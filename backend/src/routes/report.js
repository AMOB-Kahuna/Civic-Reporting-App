import express from 'express';
import { supabase } from '../config/supabase.js';
import { createClient } from '@supabase/supabase-js';
import multer from 'multer';

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage()
});

router.get('/', async (req, res) => {
  try{
    const { data, error } = await supabase
      .from('reports')
      .select();
  
    if (error) throw error;

    res.json(data);
  } catch(err) {
    console.error(err);
    res.status(500).json("Internal Server Error");
  }
});

router.post('/', upload.single('image'), async (req, res) => {
  
  // urgency,
  // lat,
  // lng,
  // verification_status,
  // resolution_status
  
  try{
    const {
      category,
      sub_category,
      description,
      address,
    } = req.body;
  
    // console.log(req.body);
    console.log(req.file);
    // console.log("category", category)
    // console.log("sub category", sub_category)
    // console.log("description", description)

    if (!category || !description || !sub_category || !address) {
      return res.status(400).json({
        error: "all fields are required"
      });
    }

    const {data: report, error: reportError} = await supabase
      .from('reports')
      .insert({
        category,
        sub_category,
        urgency: 0,
        description,
        address,
        verification_status: "unverified",
        resolution_status: "new"
      })
      .select()
      .single();

    if (reportError) throw reportError;

    const imgExtension = req.file.originalname.split('.').pop();
    const filePath = `reports/${report.id}/${crypto.randomUUID()}.${imgExtension}`;

    const {error: uploadError} = await supabase.storage
      .from('images')
      .upload(filePath, req.file.buffer, {
        contentType: req.file.mimetype,
        upsert: false
      });

    if (uploadError) {
      return res.status(500).json({error: uploadError.message})
    }

    const { data: publicUrlData } = supabase.storage
      .from("images")
      .getPublicUrl(filePath);

    const imageUrl = publicUrlData.publicUrl;

    const { data: updatedReport, error: updateError } = await supabase
      .from("reports")
      .update({
        img: imageUrl,
      })
      .eq("id", report.id)
      .select()
      .single();

    if (updateError) {
      throw updateError;
    }

    res.status(201).json("Report created successfully", {
      message: "Report created successfully",
      report: updatedReport,
      imagePath: filePath,
      imageUrl,
    });
  } catch(err) {
    console.log(err);
    res.status(500).json("Internal Server Error");
  }
});

router.get('/search', async (req, res) => {
  const keyword = typeof req.query.keyword === "string" &&
    req.query.keyword.trim() &&
    req.query.keyword.trim().toLowerCase() !== "null"
    ? req.query.keyword.trim()
    : null;

  const filter = typeof req.query.filter === "string" &&
    req.query.filter.trim() &&
    req.query.filter.trim().toLowerCase() !== "null"
    ? req.query.filter.trim()
    : null;
  
  console.log(keyword, filter)

  if (!keyword && !filter) {
    return res.status(400).json({
      error: "Provide a keyword or filter",
    });
  }

  try{
    let query = supabase
      .from('reports')
      .select();

    // if (!filter | !keyword)
    if (filter) query.eq("resolution_status", filter);
    if (keyword) query.ilike('address', `%${keyword}%`)
    const { data, error } = await query;
  
    if (error) throw error;

    res.json(data);
  } catch(err) {
    console.error(err);
    res.status(500).json("Internal Server Error");
  }
});

router.get('/:id', async (req, res) => {
  const {id} = req.params;
  console.log(req.params)
  // console.log(id)

  try{
    const { data, error } = await supabase
      .from('reports')
      .select()
      .eq('id', id);

    if (error) throw error;
    
    res.json(data);
  } catch (err) {
    console.log(err);
    res.status(500).json("Internal Server Error");
  }
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  const authHeader = req.headers.authorization;

  try {
    let client = supabase;
    if (authHeader) {
      const supabaseUrl = process.env.SUPABASE_URL || '';
      const supabaseKey = process.env.SUPABASE_PUBLISHABLE_KEY || '';
      client = createClient(supabaseUrl, supabaseKey, {
        global: { headers: { Authorization: authHeader } }
      });
    }

    // Fetch report data to get image details
    const { data: reportData } = await client
      .from('reports')
      .select()
      .eq('id', id)
      .single();

    // Delete files in storage bucket under reports/${id}
    try {
      const { data: files } = await client.storage
        .from('images')
        .list(`reports/${id}`);

      if (files && files.length > 0) {
        const pathsToDelete = files.map(f => `reports/${id}/${f.name}`);
        await client.storage.from('images').remove(pathsToDelete);
      }

      if (reportData && reportData.img) {
        const match = reportData.img.match(/\/images\/(.+)$/);
        if (match && match[1]) {
          const imgPath = decodeURIComponent(match[1]);
          await client.storage.from('images').remove([imgPath]);
        }
      }
    } catch (storageErr) {
      console.warn("Storage deletion error (continuing DB record deletion):", storageErr);
    }

    // Delete record from database and verify deletion with .select()
    let { data: deletedRows, error: deleteError } = await client
      .from('reports')
      .delete()
      .eq('id', id)
      .select();

    if (deleteError) {
      console.error("Supabase delete error:", deleteError);
      return res.status(400).json({ error: deleteError.message });
    }

    // Fallback: try matching numeric ID if column type is integer
    if ((!deletedRows || deletedRows.length === 0) && !isNaN(Number(id))) {
      const { data: numDeletedRows, error: numDeleteErr } = await client
        .from('reports')
        .delete()
        .eq('id', Number(id))
        .select();

      if (numDeleteErr) {
        return res.status(400).json({ error: numDeleteErr.message });
      }

      if (numDeletedRows && numDeletedRows.length > 0) {
        return res.json({ message: "Report and associated images deleted successfully", report: numDeletedRows[0] });
      }
    }

    if (!deletedRows || deletedRows.length === 0) {
      return res.status(404).json({ error: "Report not found or deletion blocked by database RLS policy" });
    }

    res.json({ message: "Report and associated images deleted successfully", report: deletedRows[0] });
  } catch (err) {
    console.error("Delete report error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;