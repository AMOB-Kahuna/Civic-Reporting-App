import React from 'react';

const Terms = () => {
  return (
    <div className="max-w-3xl lg:max-w-4xl mx-auto my-6 p-6 md:p-8 bg-white border border-[#2d3047]/15 rounded-3xl shadow-sm">
      <h2 className="text-2xl md:text-3xl font-bold text-center text-[#2d3047] mb-6 border-b border-gray-100 pb-4">
        Terms of Service
      </h2>

      <div className="space-y-4 text-justify text-base md:text-lg text-gray-700 leading-relaxed">
        <p>
          Welcome to NaijaReport. By using our civic reporting platform, you agree to submit truthful, accurate, and relevant information regarding civic and community issues.
        </p>
        <p>
          Users are prohibited from uploading offensive content, false allegations, or unauthorized private information. Reports submitted through this portal are made available to local authorities and relevant administrative bodies for verification and resolution.
        </p>
        <p>
          We reserve the right to review, modify, or remove any report that violates our community standards or contains misleading data. Thank you for contributing to safer and better-maintained communities across Nigeria.
        </p>
      </div>
    </div>
  );
};

export default Terms;