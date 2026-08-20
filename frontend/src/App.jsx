// import { useState } from 'react'
import {Routes, Route} from 'react-router-dom';
import Home from './pages/Home';
import Terms from './pages/Terms';
import Layout from './components/Layout';
import MakeReport from './pages/MakeReport';
import Reports from './pages/Reports';
import Report from './pages/Report';

function App() {

  return (
    <>
      <Routes>
        <Route path='/' element={<Layout />}>
          <Route index element={<Home />} />
          <Route path='make-report' element={<MakeReport />} />
          <Route path='reports' element={<Reports />} />
          <Route path="terms" element={<Terms />} />
          <Route path='report/:id' element={<Report />} />
        </Route>
      </Routes>
    </>
  )
}

export default App
