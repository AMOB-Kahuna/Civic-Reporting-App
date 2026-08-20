import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, ChevronRight, Image as ImageIcon } from 'lucide-react';

const ReportCard = ({
  address,
  category,
  subcategory,
  description,
  resolutionStatus,
  id,
  img,
  createdAt,
}) => {
  const currentStatus = (resolutionStatus || 'new').toLowerCase();

  return (
    <Link
      to={`/report/${id}`}
      className="bg-white border border-[#2d3047]/15 rounded-2xl p-5 shadow-sm hover:shadow-md hover:border-[#266907]/40 transition-all flex flex-col md:flex-row gap-5 justify-between items-start md:items-center group"
    >
      <div className="flex flex-col md:flex-row gap-4 items-start w-full md:w-3/4">
        {img ? (
          <img
            src={img}
            alt={subcategory || category || 'Report thumbnail'}
            className="w-full md:w-28 h-28 object-cover rounded-xl border border-gray-200 flex-shrink-0"
          />
        ) : (
          <div className="w-full md:w-28 h-28 bg-gray-100 rounded-xl flex items-center justify-center text-gray-400 flex-shrink-0">
            <ImageIcon className="w-8 h-8 opacity-40" />
          </div>
        )}

        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-[#266907]/10 text-[#266907] uppercase tracking-wide">
              {category || 'General'}
            </span>
            {subcategory && (
              <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-gray-100 text-gray-700 capitalize">
                {subcategory}
              </span>
            )}
            <span
              className={`text-xs font-bold px-2.5 py-1 rounded-lg capitalize ${
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

          <h3 className="font-bold text-lg text-[#2d3047] group-hover:text-[#266907] transition-colors">
            {description}
          </h3>

          <p className="text-sm text-gray-600 flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0" />
            <span className="font-semibold text-gray-700">Location:</span> {address}
          </p>

          {createdAt && (
            <p className="text-xs text-gray-400">
              Submitted: {new Date(createdAt).toLocaleString()}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-1 text-[#266907] font-semibold text-sm self-end md:self-center pt-2 md:pt-0">
        <span>View Details</span>
        <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
      </div>
    </Link>
  );
};

export default ReportCard;