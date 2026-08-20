import React from 'react';

const Message = ({ text, type }) => {
  return (
    <div
      className={`fixed top-6 left-1/2 -translate-x-1/2 z-50 w-fit max-w-md mx-auto px-6 py-3.5 rounded-2xl shadow-2xl backdrop-blur-md font-semibold text-base transition-all duration-300 border-2 ${
        type === 'error'
          ? 'bg-red-50 text-red-700 border-red-500/50'
          : 'bg-green-50 text-green-800 border-green-600/50'
      }`}
    >
      {text}
    </div>
  );
};

export default Message;