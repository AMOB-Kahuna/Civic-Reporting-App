import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import reportsRouter from './routes/report.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
console.log(PORT);

app.use(cors());
app.use(express.json());

// logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// routes
app.use('/api/reports', reportsRouter);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})