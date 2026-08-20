import React, { useEffect, useState } from 'react';
import ReportCard from '../components/ReportCard';
import { Loader2, Search, Filter, RefreshCw } from 'lucide-react';
import Message from '../components/Message';

const Reports = () => {

  const [loading, setLoading] = useState(false);
  const [reports, setReports] = useState([]);
  const [filter, setFilter] = useState('');
  const [keyword, setKeyword] = useState('');
  const [showMessage, setShowMessage] = useState(false);
  const [searchError, setSearchError] = useState('');
  const [responseError, setResponseError] = useState('');

  const baseUrl = import.meta.env.VITE_API_BASE_URL;

  const fetchAllReports = async () => {
    setLoading(true);
    setResponseError('');
    try {
      const res = await fetch(`${baseUrl}/reports`);
      const data = await res.json();
      setReports(data || []);
    } catch (err) {
      console.error(err);
      setResponseError('Failed to load reports');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllReports();
  }, []);

  useEffect(() => {
    if (!showMessage) return;

    const timeOut = setTimeout(() => {
      setShowMessage(false);
    }, 2000);

    return () => clearTimeout(timeOut);
  }, [showMessage]);

  async function handleSearch(e) {
    if (e) e.preventDefault();
    setResponseError('');

    if (!keyword.trim() && (!filter || filter === 'all')) {
      fetchAllReports();
      return;
    }

    setLoading(true);
    try {
      const queryParams = new URLSearchParams();
      if (keyword.trim()) queryParams.append('keyword', keyword.trim());
      if (filter && filter !== 'all') queryParams.append('filter', filter);

      const res = await fetch(`${baseUrl}/reports/search?${queryParams.toString()}`);
      const data = await res.json();

      if (!res.ok || !Array.isArray(data) || data.length === 0) {
        setReports([]);
        setResponseError(`No reports found for matching criteria.`);
      } else {
        setReports(data);
      }
    } catch (err) {
      console.error(err);
      setResponseError('Error searching reports');
    } finally {
      setLoading(false);
    }
  }

  const handleReset = () => {
    setKeyword('');
    setFilter('');
    fetchAllReports();
  };

  return (
    <div className="max-w-5xl mx-auto py-2">
      <h2 className="text-2xl md:text-3xl font-bold text-center text-[#2d3047]">Browse Reports</h2>
      
      {/* Search & Filter Section - Matches Admin Page Design */}
      <form
        onSubmit={handleSearch}
        className="bg-[#e8f1fa] p-4 rounded-2xl my-6 flex flex-col md:flex-row gap-4 justify-between items-center border border-[#2d3047]/10 shadow-sm"
      >
        <div className="relative w-full md:w-96">
          <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            placeholder="Search location or keyword..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl bg-white focus:outline-none focus:border-[#266907] text-base"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-between md:justify-end">
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-600" />
            <span className="text-sm font-semibold text-[#2d3047]">Filter:</span>
            <select
              name="filter"
              id="filter"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-xl bg-white text-base focus:outline-none focus:border-[#266907]"
            >
              <option value="">All Statuses</option>
              <option value="open">Open</option>
              <option value="new">New</option>
              <option value="in_progress">In Progress</option>
              <option value="closed">Closed / Resolved</option>
            </select>
          </div>

          <button
            type="submit"
            className="px-5 py-2 bg-[#266907] text-white font-bold rounded-xl hover:bg-[#acaf1d] transition-colors cursor-pointer text-sm"
          >
            Search
          </button>

          <button
            type="button"
            onClick={handleReset}
            className="p-2.5 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-colors cursor-pointer"
            title="Reset search & filters"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        {showMessage && <Message text={searchError} type="error" />}
      </form>

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
            reports.map( (report) => <ReportCard
              key={report.id}
              category={report.category}
              subcategory={report.sub_category}
              address={report.address}
              description={report.description}
              resolutionStatus={report.resolution_status}
              id={report.id}
              img={report.img}
              createdAt={report.created_at}
            /> )
          }
        </section>
      }
    </div>
  );
};

export default Reports;