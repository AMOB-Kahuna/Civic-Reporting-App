import React from 'react'

const Message = ({ text, type }) => {

  return (
    <div className={`absolute top-10 right-0 left-0 w-fit mx-auto ring px-5 py-3 rounded-2xl backdrop-blur-lg font-medium transition-all ${type === "error" ? 'bg-red-300/30 ring-red-500 text-red-500' : 'bg-green-300/30 ring-green-500 text-green-500'}`}>
      {text}
    </div>
  )
}

export default Message