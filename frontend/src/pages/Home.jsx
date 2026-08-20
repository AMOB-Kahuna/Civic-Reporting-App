import React, { useEffect, useState } from 'react'
import { subCategoryList } from '../category';
import {Loader2} from 'lucide-react'

const Home = () => {

  const [reports, setReports] = useState([]);
  const [openIssues, setOpenIssues] = useState(0);
  const [closedIssues, setClosedIssues] = useState(0);

  const baseUrl = import.meta.env.VITE_API_BASE_URL;
  const issueRank = reports && subCategoryList.map(subCategory => {
    return [subCategory, reports.filter(report => report.sub_category === subCategory.toLowerCase()).length]
  });
  const sortedIssueRank = issueRank.sort( (a, b) => b[1] - a[1]);

  // console.log(sortedIssueRank)
  // const topLocations = reports && reports.map(report => report.area)

  // console.log(issueRank)

  // Fetch reports data
  useEffect( () => {
    (async () => {
      try {
        const res = await fetch(`${baseUrl}/reports`);
        const data = await res.json();

        console.log(data);
        setReports(data)
      } catch (err) {
        console.log(err);
      }
    })();
  }, [])

  // Calculate Open and closed issues
  useEffect( () => {
    if (reports.length > 0) {
      setOpenIssues(reports.filter(report => report.resolution_status === 'open').length);
      setClosedIssues(reports.filter(report => report.resolution_status === 'closed').length);
    }
  }, [reports]);

  return (
    <>
      <h2 className='text-2xl font-medium text-center'>Yearly Report Analytics</h2>

      {
        reports.length === 0 ?
        <div className='w-full h-full flex flex-col items-center justify-center py-30 text-[#266907]'>
          <Loader2 className="w-12 h-12 animate-spin " />
          <p className='text-lg font-light text-[#2d3047]/70'>Fetching Data...</p>
        </div>
        :
        <section className='flex flex-col gap-10 items-center my-10'>
        <div className='w-[60%] px-10 py-5 shadow-sm shadow-black/30 border border-[#2d3047]/20 rounded-2xl flex  flex-col gap-8'>
          <p className='font-medium text-gray-500'>Total Reports</p>
          <p className='text-4xl font-medium text-blue-500'>{reports.length}</p>
        </div>

        <div className='w-[60%] px-10 py-5 shadow-sm shadow-black/30 border border-[#2d3047]/20 rounded-2xl flex flex-col gap-8'>
          <p className='font-medium text-gray-500'>Open Issues</p>
          <p className='text-4xl font-medium text-orange-500'>{openIssues}</p>
        </div>

        <div className='w-[60%] px-10 py-5 shadow-sm shadow-black/30 border border-[#2d3047]/20 rounded-2xl flex flex-col gap-8'>
          <p className='font-medium text-gray-500'>Closed Issues</p>
          <p className='text-4xl font-medium text-green-500'>{closedIssues}</p>
        </div>

        <div className='w-full px-5 py-5 shadow-sm shadow-black/30 border border-[#2d3047]/20 rounded-2xl'>
          <p className='font-bold text-xl mb-5'>Issue Types</p>
          {
            sortedIssueRank.map(issue => 
              <div
                key={issue}
                className='border-b border-b-[#2d3047]/20 mb-5 flex justify-between'
              >
                <p className='text-xl font-light'>{issue[0]}</p>
                <p className='text-2xl text-right font-medium'>{issue[1]}</p>
              </div>
            )
          }
        </div>

        {/* <div className='w-full px-10 py-5 shadow-sm shadow-black/30 border border-[#2d3047]/20 rounded-2xl'>
          <p className='font-bold text-xl'>Top Locations</p>
        </div> */}
      </section>}
    </>
  )
}

export default Home