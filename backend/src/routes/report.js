import express from 'express';
import { supabase } from '../config/supabase.js';

const router = express.Router();

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

router.post('/', async (req, res) => {
  const {
    category,
    sub_category,
    urgency,
    description,
    lat,
    lng,
    address,
    verification_status,
    resolution_status
  } = req.body;
  console.log(req.body);

  try{
    const {error} = await supabase
      .from('reports')
      .insert({
        category: category,
        sub_category: sub_category,
        urgency: Number.parseInt(urgency),
        description: description,
        lat: Number.parseFloat(lat),
        lng: Number.parseFloat(lat),
        address: address,
        verification_status: verification_status,
        resolution_status: resolution_status
      });

    if (error) throw error;
    res.status(201).json("Report created successfully");
  } catch(err) {
    console.log(err);
    res.status(500).json("Internal Server Error");
  }
})

export default router;