import express from 'express';
import { supabase } from '../config/supabase.js';
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


export default router;