import React from 'react'
import { Link } from 'react-router-dom'

const ReportCard = ({
  address,
  category,
  subcategory,
  description,
  resolutionStatus,
  id
}) => {

  // console.log(id)
  const statusClass = resolutionStatus === "new" ?
    "text-blue-700 text-shadow-md text-shadow-blue-300" :
    resolutionStatus === "open" ?
    "text-green-700 text-shadow-md text-shadow-green-300" :
    "text-black-700 text-shadow-md text-shadow-black-300"

  return (
    <Link
      className='shadow-md px-5 py-2.5 rounded-2xl border border-[#2d3047]/30 flex flex-col gap-3 hover:scale-102'
      to={`/report/${id}`}
    >
      <h3 className='text-2xl font-medium'>{address}</h3>
      {/* <img
        src="./../assets/hero.png"
        alt=""
        className='w-full h-40'
       /> */}
      
      <div className='flex flex-col gap-3 font-light'>
        <p className='bg-gray-200 px-4 py-2 w-fit rounded-2xl ring ring-gray-400'>{category}</p>
        <p className='bg-orange-200 px-4 py-2 w-fit rounded-2xl ring ring-orange-400'>{subcategory}</p>
      </div>
      <p>{description}</p>
      <p className={statusClass}>{resolutionStatus}</p>
    </Link>
  )
}

export default ReportCard