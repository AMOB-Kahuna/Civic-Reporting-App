import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../supabase';
import {
  ArrowLeft,
  MapPin,
  Calendar,
  Loader2,
  Image as ImageIcon,
} from 'lucide-react';

const Report = () => {
  const { id } = useParams();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const baseUrl = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const fetchReport = async () => {
      setLoading(true);
      setError('');
      try {
        let singleReport = null;

        // Try backend API first
        try {
          const res = await fetch(`${baseUrl}/reports/${id}`);
          if (res.ok) {
            const data = await res.json();
            if (Array.isArray(data) && data.length > 0) {
              singleReport = data[0];
            } else if (data && !Array.isArray(data)) {
              singleReport = data;
            }
          }
        } catch (err) {
          console.warn('API fetch single report failed, trying Supabase direct:', err);
        }

        // Fallback to Supabase direct query
        if (!singleReport) {
          const { data: supaData, error: supaErr } = await supabase
            .from('reports')
            .select('*')
            .eq('id', id)
            .single();

          if (supaErr) throw supaErr;
          singleReport = supaData;
        }

        if (!singleReport) {
          setError('Report not found');
        } else {
          setReport(singleReport);
        }
      } catch (err) {
        console.error('Error loading report details:', err);
        setError('Failed to load report details.');
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchReport();
  }, [id]);

  if (loading) {
    return (
      <div className="w-full min-h-[50vh] flex flex-col items-center justify-center text-[#266907]">
        <Loader2 className="w-12 h-12 animate-spin" />
        <p className="mt-3 text-lg font-light text-[#2d3047]/70">Loading report details...</p>
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="max-w-xl mx-auto my-12 p-8 text-center bg-white rounded-3xl border border-gray-200 shadow-md">
        <h2 className="text-2xl font-bold text-[#2d3047] mb-2">Report Not Found</h2>
        <p className="text-gray-500 mb-6">{error || 'The report you are looking for does not exist.'}</p>
        <Link
          to="/reports"
          className="inline-flex items-center gap-2 px-6 py-3 bg-[#266907] text-white font-bold rounded-2xl hover:bg-[#acaf1d] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Return to Reports
        </Link>
      </div>
    );
  }

  const currentStatus = (report.resolution_status || 'new').toLowerCase();

  return (
    <div className="max-w-4xl mx-auto py-4 px-2">
      {/* Back Link */}
      <Link
        to="/reports"
        className="inline-flex items-center gap-2 text-[#266907] hover:text-[#acaf1d] font-semibold text-base mb-6 transition-colors"
      >
        <ArrowLeft className="w-5 h-5" /> Back to All Reports
      </Link>

      {/* Main Report Container Card */}
      <article className="bg-white rounded-3xl border border-[#2d3047]/15 shadow-xl overflow-hidden">
        {/* Header Banner / Image section */}
        {report.img ? (
          <div className="w-full max-h-96 overflow-hidden bg-slate-950 relative border-b border-gray-200">
            <img
              src={report.img}
              alt={report.sub_category || 'Report image'}
              className="w-full h-full max-h-96 object-contain mx-auto"
            />
          </div>
        ) : (
          <div className="w-full h-48 bg-gradient-to-r from-[#2d3047] to-[#1f2233] flex flex-col items-center justify-center text-white/60 p-6 border-b border-gray-200">
            <ImageIcon className="w-12 h-12 mb-2 opacity-50" />
            <p className="text-sm font-medium">No Image Uploaded For This Report</p>
          </div>
        )}

        {/* Card Body */}
        <div className="p-6 md:p-8 space-y-6">
          {/* Metadata Badges Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 pb-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold px-3 py-1.5 rounded-xl bg-[#266907]/10 text-[#266907] uppercase tracking-wide">
                {report.category || 'General'}
              </span>
              <span className="text-xs font-bold px-3 py-1.5 rounded-xl bg-gray-100 text-gray-700 capitalize">
                {report.sub_category}
              </span>
              <span
                className={`text-xs font-bold px-3 py-1.5 rounded-xl capitalize ${
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

            {report.created_at && (
              <div className="flex items-center gap-1.5 text-xs font-medium text-gray-500">
                <Calendar className="w-4 h-4 text-gray-400" />
                <span>{new Date(report.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</span>
              </div>
            )}
          </div>

          {/* Description / Content Header */}
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-[#2d3047] leading-snug mb-3">
              {report.description}
            </h1>
          </div>

          {/* Location Details Box */}
          <div className="bg-[#e8f1fa]/70 border border-[#2d3047]/10 p-5 rounded-2xl flex items-start gap-3">
            <div className="p-2.5 bg-white rounded-xl text-[#266907] shadow-sm">
              <MapPin className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-[#2d3047]/70 uppercase tracking-wider mb-1">
                Reported Location
              </h4>
              <p className="text-base font-semibold text-[#2d3047]">{report.address}</p>
            </div>
          </div>

          {/* Additional Meta Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 border border-gray-100 rounded-2xl bg-gray-50/60">
              <span className="text-xs font-bold text-gray-400 uppercase">Verification Status</span>
              <p className="text-base font-semibold text-gray-800 capitalize mt-1">
                {report.verification_status || 'Unverified'}
              </p>
            </div>

            <div className="p-4 border border-gray-100 rounded-2xl bg-gray-50/60">
              <span className="text-xs font-bold text-gray-400 uppercase">Urgency Level</span>
              <p className="text-base font-semibold text-gray-800 mt-1">
                {report.urgency !== undefined ? `Level ${report.urgency}` : 'Normal'}
              </p>
            </div>
          </div>
        </div>
      </article>
    </div>
  );
};

export default Report;