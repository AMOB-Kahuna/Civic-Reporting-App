import React, { useEffect, useState } from 'react';
import { subCategoryList } from '../category';
import { Loader2, FileText, AlertCircle, CheckCircle2 } from 'lucide-react';

const Home = () => {
  const [reports, setReports] = useState([]);
  const [openIssues, setOpenIssues] = useState(0);
  const [closedIssues, setClosedIssues] = useState(0);

  const baseUrl = import.meta.env.VITE_API_BASE_URL;

  // Compute issue type breakdown accurately
  const issueCounts = {};

  // Initialize known sub-categories with 0
  subCategoryList.forEach((subCat) => {
    issueCounts[subCat] = 0;
  });

  // Aggregate actual counts from reports
  reports.forEach((report) => {
    if (!report.sub_category) return;

    // Match case-insensitively against predefined sub-category list
    const matchedSubCategory = subCategoryList.find(
      (sc) => sc.toLowerCase() === report.sub_category.trim().toLowerCase()
    );

    if (matchedSubCategory) {
      issueCounts[matchedSubCategory] = (issueCounts[matchedSubCategory] || 0) + 1;
    } else {
      const label = report.sub_category.trim();
      issueCounts[label] = (issueCounts[label] || 0) + 1;
    }
  });

  // Convert map to sorted array (highest count first)
  const sortedIssueRank = Object.entries(issueCounts).sort((a, b) => b[1] - a[1]);

  // Fetch reports data
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${baseUrl}/reports`);
        const data = await res.json();
        setReports(data || []);
      } catch (err) {
        console.error('Failed to fetch home reports:', err);
      }
    })();
  }, []);

  // Calculate Open and Closed issues
  useEffect(() => {
    if (reports && reports.length > 0) {
      const openCount = reports.filter((report) => {
        const status = (report.resolution_status || 'new').toLowerCase();
        return status === 'open' || status === 'new' || status === 'in_progress' || status === 'in progress';
      }).length;

      const closedCount = reports.filter((report) => {
        const status = (report.resolution_status || '').toLowerCase();
        return status === 'closed' || status === 'resolved';
      }).length;

      setOpenIssues(openCount);
      setClosedIssues(closedCount);
    }
  }, [reports]);

  return (
    <div className="max-w-5xl mx-auto py-2">
      <h2 className="text-2xl md:text-3xl font-bold text-[#2d3047] text-center mb-6">Yearly Report Analytics</h2>

      {reports.length === 0 ? (
        <div className="w-full py-24 flex flex-col items-center justify-center text-[#266907]">
          <Loader2 className="w-12 h-12 animate-spin " />
          <p className="text-lg font-light text-[#2d3047]/70 mt-3">Fetching Data...</p>
        </div>
      ) : (
        <section className="flex flex-col gap-8 my-6">
          {/* Responsive Stat Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="px-6 py-6 bg-white shadow-sm shadow-black/10 border border-[#2d3047]/20 rounded-2xl flex flex-col justify-between gap-4 transition-transform hover:-translate-y-1">
              <div className="flex items-center justify-between">
                <p className="font-semibold text-gray-500 text-sm md:text-base">Total Reports</p>
                <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600">
                  <FileText className="w-5 h-5" />
                </div>
              </div>
              <p className="text-4xl md:text-5xl font-bold text-blue-600">{reports.length}</p>
            </div>

            <div className="px-6 py-6 bg-white shadow-sm shadow-black/10 border border-[#2d3047]/20 rounded-2xl flex flex-col justify-between gap-4 transition-transform hover:-translate-y-1">
              <div className="flex items-center justify-between">
                <p className="font-semibold text-gray-500 text-sm md:text-base">Open Issues</p>
                <div className="p-2.5 rounded-xl bg-orange-50 text-orange-500">
                  <AlertCircle className="w-5 h-5" />
                </div>
              </div>
              <p className="text-4xl md:text-5xl font-bold text-orange-500">{openIssues}</p>
            </div>

            <div className="px-6 py-6 bg-white shadow-sm shadow-black/10 border border-[#2d3047]/20 rounded-2xl flex flex-col justify-between gap-4 transition-transform hover:-translate-y-1">
              <div className="flex items-center justify-between">
                <p className="font-semibold text-gray-500 text-sm md:text-base">Closed Issues</p>
                <div className="p-2.5 rounded-xl bg-green-50 text-green-600">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
              </div>
              <p className="text-4xl md:text-5xl font-bold text-green-600">{closedIssues}</p>
            </div>
          </div>

          {/* Issue Types Breakdown */}
          <div className="w-full px-6 py-6 bg-white shadow-sm shadow-black/10 border border-[#2d3047]/20 rounded-2xl">
            <p className="font-bold text-xl md:text-2xl text-[#2d3047] mb-6 border-b border-gray-100 pb-3">
              Issue Types Breakdown
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-4">
              {sortedIssueRank.map(([typeLabel, count]) => (
                <div
                  key={typeLabel}
                  className="border-b border-[#2d3047]/10 pb-3 flex justify-between items-center"
                >
                  <p className="text-base md:text-lg font-medium text-[#2d3047]">{typeLabel}</p>
                  <span className="text-lg font-bold px-3 py-1 bg-[#266907]/10 text-[#266907] rounded-xl">
                    {count}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default Home;