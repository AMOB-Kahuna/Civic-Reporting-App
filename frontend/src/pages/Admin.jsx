import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../supabase';
import {
  Loader2,
  LogOut,
  ShieldCheck,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Trash2,
  ExternalLink,
  RefreshCw,
} from 'lucide-react';

const Admin = () => {
  const { user, logout, session } = useAuth();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [updatingId, setUpdatingId] = useState(null);
  const [actionSuccessMessage, setActionSuccessMessage] = useState('');

  const baseUrl = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    if (!actionSuccessMessage) return;
    const timer = setTimeout(() => {
      setActionSuccessMessage('');
    }, 4000);
    return () => clearTimeout(timer);
  }, [actionSuccessMessage]);

  const fetchReports = async () => {
    setLoading(true);
    setError('');
    try {
      // Primary fetch from backend API, fallback to Supabase direct client if needed
      let data = null;
      try {
        const res = await fetch(`${baseUrl}/reports`);
        if (res.ok) {
          data = await res.json();
        }
      } catch (err) {
        console.warn('API fetch failed, falling back to direct Supabase query:', err);
      }

      if (!data) {
        const { data: supaData, error: supaErr } = await supabase
          .from('reports')
          .select('*')
          .order('created_at', { ascending: false });

        if (supaErr) throw supaErr;
        data = supaData;
      }

      setReports(data || []);
    } catch (err) {
      console.error('Failed to fetch reports:', err);
      setError('Could not load reports. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleStatusChange = async (reportId, newStatus) => {
    setUpdatingId(reportId);
    try {
      let { error: updateErr } = await supabase
        .from('reports')
        .update({ resolution_status: newStatus })
        .eq('id', reportId);

      if (updateErr && !isNaN(Number(reportId))) {
        const numRes = await supabase
          .from('reports')
          .update({ resolution_status: newStatus })
          .eq('id', Number(reportId));
        updateErr = numRes.error;
      }

      if (updateErr) throw updateErr;

      setReports((prev) =>
        prev.map((r) => (r.id === reportId ? { ...r, resolution_status: newStatus } : r))
      );
    } catch (err) {
      console.error('Failed to update resolution status:', err);
      alert('Failed to update report status: ' + (err.message || 'Unknown error'));
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDeleteReport = async (reportId) => {
    if (!window.confirm('Are you sure you want to delete this report and its associated images? This action cannot be undone.')) {
      return;
    }
    setUpdatingId(reportId);
    try {
      const targetReport = reports.find((r) => r.id === reportId);

      // 1. Delete associated image files from Supabase Storage bucket
      try {
        const { data: files } = await supabase.storage
          .from('images')
          .list(`reports/${reportId}`);

        if (files && files.length > 0) {
          const filePaths = files.map((file) => `reports/${reportId}/${file.name}`);
          await supabase.storage.from('images').remove(filePaths);
        }

        if (targetReport?.img) {
          const match = targetReport.img.match(/\/images\/(.+)$/);
          if (match && match[1]) {
            const extractedPath = decodeURIComponent(match[1]);
            await supabase.storage.from('images').remove([extractedPath]);
          }
        }
      } catch (storageErr) {
        console.warn('Storage deletion error:', storageErr);
      }

      // 2. Direct Supabase client database deletion with session authorization
      let { data: deletedRows, error: deleteErr } = await supabase
        .from('reports')
        .delete()
        .eq('id', reportId)
        .select();

      // Try numeric ID if string reportId didn't match integer column type
      if ((!deletedRows || deletedRows.length === 0) && !isNaN(Number(reportId))) {
        const numRes = await supabase
          .from('reports')
          .delete()
          .eq('id', Number(reportId))
          .select();
        deletedRows = numRes.data;
        deleteErr = numRes.error;
      }

      if (deleteErr) {
        throw new Error(deleteErr.message);
      }

      if (!deletedRows || deletedRows.length === 0) {
        throw new Error('Could not delete report from database. Please verify your admin privileges in Supabase.');
      }

      setReports((prev) => prev.filter((r) => r.id !== reportId));
      setActionSuccessMessage('Report and associated media deleted successfully.');
    } catch (err) {
      console.error('Failed to delete report:', err);
      alert('Failed to delete report: ' + (err.message || 'Unknown error'));
    } finally {
      setUpdatingId(null);
    }
  };

  // Filter and search logic
  const filteredReports = reports.filter((report) => {
    const matchesSearch =
      (report.address || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (report.description || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (report.category || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (report.sub_category || '').toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === 'all' ||
      (report.resolution_status || 'new').toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  const totalCount = reports.length;
  const openCount = reports.filter((r) => (r.resolution_status || 'new').toLowerCase() === 'open' || (r.resolution_status || 'new').toLowerCase() === 'new').length;
  const closedCount = reports.filter((r) => (r.resolution_status || '').toLowerCase() === 'closed').length;
  const inProgressCount = reports.filter((r) => (r.resolution_status || '').toLowerCase() === 'in_progress' || (r.resolution_status || '').toLowerCase() === 'in progress').length;

  return (
    <div className="max-w-6xl mx-auto py-4">
      {/* Admin Top Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-[#2d3047] text-[#e8f1fa] p-5 rounded-2xl mb-8 border-3 border-[#266907] shadow-xl">
        <div className="flex items-center gap-3 mb-4 sm:mb-0">
          <div className="p-3 bg-[#266907] rounded-xl text-white">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold">Admin Control Center</h2>
            <p className="text-xs text-[#e8f1fa]/70">Logged in as: {user?.email}</p>
          </div>
        </div>

        <button
          onClick={logout}
          className="flex items-center gap-2 bg-red-600/80 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-xl transition-colors duration-200 cursor-pointer text-sm"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>

      {/* Success Floating Toast Notification */}
      {actionSuccessMessage && (
        <div className="fixed top-6 right-6 z-50 max-w-md bg-white border-2 border-green-600/40 text-green-900 px-5 py-4 rounded-2xl shadow-2xl flex items-center gap-4 transition-all duration-300">
          <CheckCircle2 className="w-6 h-6 text-green-600 shrink-0" />
          <span className="text-sm md:text-base font-semibold">{actionSuccessMessage}</span>
          <button
            onClick={() => setActionSuccessMessage('')}
            className="ml-auto text-xs font-bold text-green-700 hover:text-green-900 px-2.5 py-1 bg-green-100 rounded-xl cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Analytics Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="px-6 py-4 shadow-sm shadow-black/20 border border-[#2d3047]/20 rounded-2xl bg-white flex flex-col gap-2">
          <p className="font-medium text-gray-500 text-sm">Total Reports</p>
          <p className="text-3xl font-bold text-blue-600">{totalCount}</p>
        </div>

        <div className="px-6 py-4 shadow-sm shadow-black/20 border border-[#2d3047]/20 rounded-2xl bg-white flex flex-col gap-2">
          <p className="font-medium text-gray-500 text-sm">Open / New Issues</p>
          <p className="text-3xl font-bold text-orange-500">{openCount}</p>
        </div>

        <div className="px-6 py-4 shadow-sm shadow-black/20 border border-[#2d3047]/20 rounded-2xl bg-white flex flex-col gap-2">
          <p className="font-medium text-gray-500 text-sm">In Progress</p>
          <p className="text-3xl font-bold text-purple-600">{inProgressCount}</p>
        </div>

        <div className="px-6 py-4 shadow-sm shadow-black/20 border border-[#2d3047]/20 rounded-2xl bg-white flex flex-col gap-2">
          <p className="font-medium text-gray-500 text-sm">Closed / Resolved</p>
          <p className="text-3xl font-bold text-green-600">{closedCount}</p>
        </div>
      </div>

      {/* Search & Filter Section */}
      <div className="bg-[#e8f1fa] p-4 rounded-2xl mb-6 flex flex-col md:flex-row gap-4 justify-between items-center border border-[#2d3047]/10">
        <div className="relative w-full md:w-96">
          <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            placeholder="Search location, issue, description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl bg-white focus:outline-none focus:border-[#266907] text-base"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-600" />
            <span className="text-sm font-semibold text-[#2d3047]">Filter:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-xl bg-white text-base focus:outline-none focus:border-[#266907]"
            >
              <option value="all">All Statuses</option>
              <option value="new">New / Open</option>
              <option value="in_progress">In Progress</option>
              <option value="closed">Closed / Resolved</option>
            </select>
          </div>

          <button
            onClick={fetchReports}
            className="p-2.5 bg-[#266907] text-white rounded-xl hover:bg-[#acaf1d] transition-colors cursor-pointer"
            title="Refresh reports"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Reports List / Table */}
      {loading ? (
        <div className="w-full py-20 flex flex-col items-center justify-center text-[#266907]">
          <Loader2 className="w-12 h-12 animate-spin" />
          <p className="mt-3 text-lg font-light text-[#2d3047]/70">Loading submitted reports...</p>
        </div>
      ) : error ? (
        <div className="p-6 bg-red-50 text-red-700 rounded-2xl text-center font-medium border border-red-200">
          {error}
        </div>
      ) : filteredReports.length === 0 ? (
        <div className="p-12 text-center bg-gray-50 rounded-2xl border border-dashed border-gray-300">
          <p className="text-gray-500 font-medium text-lg">No reports match your current filter.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredReports.map((report) => {
            const currentStatus = (report.resolution_status || 'new').toLowerCase();
            const isUpdating = updatingId === report.id;

            return (
              <div
                key={report.id}
                className="bg-white border border-[#2d3047]/15 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col md:flex-row gap-5 justify-between items-start md:items-center"
              >
                <div className="flex flex-col md:flex-row gap-4 items-start w-full md:w-3/4">
                  {report.img ? (
                    <img
                      src={report.img}
                      alt={report.sub_category}
                      className="w-full md:w-28 h-28 object-cover rounded-xl border border-gray-200 flex-shrink-0"
                    />
                  ) : (
                    <div className="w-full md:w-28 h-28 bg-gray-100 rounded-xl flex items-center justify-center text-gray-400 text-xs font-semibold flex-shrink-0">
                      No Image
                    </div>
                  )}

                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-[#266907]/10 text-[#266907] uppercase">
                        {report.category || 'General'}
                      </span>
                      <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-gray-100 text-gray-700 capitalize">
                        {report.sub_category}
                      </span>
                      <span
                        className={`text-xs font-bold px-2.5 py-1 rounded-lg ${
                          currentStatus === 'closed'
                            ? 'bg-green-100 text-green-800'
                            : currentStatus === 'in_progress' || currentStatus === 'in progress'
                            ? 'bg-purple-100 text-purple-800'
                            : 'bg-orange-100 text-orange-800'
                        }`}
                      >
                        Status: {currentStatus}
                      </span>
                    </div>

                    <h3 className="font-bold text-lg text-[#2d3047]">{report.description}</h3>
                    <p className="text-sm text-gray-600 flex items-center gap-1">
                      <span className="font-semibold text-gray-700">Location:</span> {report.address}
                    </p>
                    {report.created_at && (
                      <p className="text-xs text-gray-400">
                        Submitted: {new Date(report.created_at).toLocaleString()}
                      </p>
                    )}
                  </div>
                </div>

                {/* Actions & Status Control */}
                <div className="flex flex-wrap md:flex-col gap-2 w-full md:w-auto items-end justify-between border-t md:border-t-0 pt-3 md:pt-0 border-gray-100">
                  <div className="flex items-center gap-2">
                    <label className="text-xs font-bold text-gray-500">Update Status:</label>
                    <select
                      disabled={isUpdating}
                      value={currentStatus}
                      onChange={(e) => handleStatusChange(report.id, e.target.value)}
                      className="text-sm px-3 py-1.5 border border-gray-300 rounded-xl bg-gray-50 font-semibold text-slate-800 focus:outline-none focus:border-[#266907]"
                    >
                      <option value="new">New / Open</option>
                      <option value="in_progress">In Progress</option>
                      <option value="closed">Closed / Resolved</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-2">
                    <a
                      href={`/report/${report.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 text-gray-600 hover:text-[#266907] transition-colors rounded-lg hover:bg-gray-100"
                      title="View report details"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>

                    <button
                      disabled={isUpdating}
                      onClick={() => handleDeleteReport(report.id)}
                      className="p-2 text-red-500 hover:text-red-700 transition-colors rounded-lg hover:bg-red-50 cursor-pointer disabled:opacity-50"
                      title="Delete report"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Admin;