import React, { useEffect, useState } from 'react'
import ReportCard from '../components/ReportCard'
import { Loader2 } from 'lucide-react';
import Message from '../components/Message';

const Reports = () => {

  const [loading, setLoading] = useState(false);
  const [reports, setReports] = useState([]);
  const [filter, setFilter] = useState(null);
  const [keyword, setKeyword] = useState(null);
  const [showMessage, setShowMessage] = useState(false);
  const [searchError, setSearchError] = useState('');
  const [responseError, setResponseError] = useState('');

  const baseUrl = import.meta.env.VITE_API_BASE_URL;

  useEffect( () => {
    setLoading(true);
    (async () => {
      try {
        const res = await fetch(`${baseUrl}/reports`);
        const data = await res.json();

        // console.log(data);
        setReports(data);
        setLoading(false);
      } catch (err) {
        console.log(err);
      }
    })();
  }, [])

  useEffect(() => {
    if (!showMessage) return;

    const timeOut = setTimeout(() => {
      setShowMessage(false)
    }, 2000);

    return () => clearTimeout(timeOut)
  }, [showMessage])

  async function handleSearch() {
    if (!keyword && !filter) {
      setSearchError("Provide a keyword or filter")
      setShowMessage(true);
      return
    }

    setLoading(true)
    try {
      const res = await fetch(`${baseUrl}/reports/search?keyword=${keyword}&filter=${filter}`);
      const data = await res.json();

      if (data.length === 0) {
        setResponseError(`No result for "${keyword}"`)
      }

      console.log(data);
      setReports(data);
      setLoading(false);
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <>
      <h2 className='text-2xl font-medium text-center'>Browse Reports</h2>
      
      <section className='border border-[#266907] rounded-2xl py-5 px-5 my-5 text-center'>
        {/* <p>Search</p> */}
        <div className='flex flex-col gap-5 items-center'>
          <input
            type="text"
            className='w-[98%] shadow-md px-5 py-2.5 rounded-2xl border border-[#2d3047]/30'
            placeholder='Enter location...'
            onChange={ (e) => setKeyword(e.target.value)}
           />

          <div className='w-[70%] flex justify-between mx-auto'>
            <label htmlFor='filter'>Filter:</label>
            <select
              name="filter"
              id="filter"
              className='ring-1 ring-[#2d3047]/30 rounded-xl w-[70%] px-4 py-1'
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value=""></option>
              <option value="open">Open</option>
              <option value="new">New</option>
              <option value="closed">Closed</option>
            </select>
          </div>

          <button
            className='bg-[#266907] px-8 py-4 rounded-2xl font-medium text-[#e8f1fa] cursor-pointer'
            onClick={handleSearch}
          >Search</button>
        </div>
        {
          showMessage && <Message text={searchError} type="error" />
        }
      </section>

      {
        loading ?
        <div className='w-full h-50 flex flex-col items-center justify-center text-[#266907]'>
          <Loader2 className="w-12 h-12 animate-spin " />
          <p className='text-lg font-light text-[#2d3047]/70'>Loading...</p>
        </div>
        :
        responseError ?
        <p className='w-full h-30 flex justify-center items-center text-gray-400'>{responseError}</p>
        :
        <section className='py-5 grid gap-5'>
          {
            reports &&
            reports.map( ({
              address,
              category,
              sub_category,
              resolution_status,
              description,
              id
            }, index) => <ReportCard
              key={index}
              category={category}
              subcategory={sub_category}
              address={address}
              description={description}
              resolutionStatus={resolution_status}
              id={id}
            /> )
          }
        </section>
      }
    </>
  )
}

export default Reports