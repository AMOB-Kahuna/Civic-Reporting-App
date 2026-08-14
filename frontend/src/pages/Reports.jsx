import React from 'react'

const Reports = () => {
  return (
    <>
      <h2 className='text-2xl font-medium text-center'>Browse Reports</h2>
      
      <section className='border border-[#266907] rounded-2xl py-5 px-5 my-5 text-center'>
        {/* <p>Search</p> */}
        <div className='flex flex-col gap-5 items-center'>
          <input
            type="text"
            className='shadow-md px-5 py-2.5 rounded-2xl border border-[#2d3047]/30'
            placeholder='Enter keyword...'
           />

          <div className='w-[70%] flex justify-between mx-auto'>
            <label htmlFor='filter'>Filter:</label>
            <select name="filter" id="filter" className='ring-1 ring-[#2d3047]/30 rounded-2xl w-[70%] px-4 py-1'>
              <option value=""></option>
              <option value="">Open</option>
              <option value="">New</option>
              <option value="">Resolved</option>
            </select>
          </div>

          <button className='bg-[#266907] px-8 py-4 rounded-4xl font-medium text-[#e8f1fa] cursor-pointer'>Search</button>
        </div>
      </section>
    </>
  )
}

export default Reports