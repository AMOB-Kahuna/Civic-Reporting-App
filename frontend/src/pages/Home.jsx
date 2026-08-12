import React from 'react'

const Home = () => {
  return (
    <>
      <h2 className='text-2xl font-medium'>Yearly Report Analytics</h2>

      <section className='flex flex-col gap-10 items-center my-10'>
        <div className='w-[60%] px-10 py-5 shadow-sm shadow-black/30 rounded-2xl flex flex-col gap-8'>
          <p className='font-medium text-gray-500'>Total Reports</p>
          <p className='text-4xl font-medium'>20</p>
        </div>

        <div className='w-[60%] px-10 py-5 shadow-sm shadow-black/30 rounded-2xl flex flex-col gap-8'>
          <p className='font-medium text-gray-500'>Open Issues</p>
          <p className='text-4xl font-medium'>15</p>
        </div>

        <div className='w-[60%] px-10 py-5 shadow-sm shadow-black/30 rounded-2xl flex flex-col gap-8'>
          <p className='font-medium text-gray-500'>Closed Issues</p>
          <p className='text-4xl font-medium'>5</p>
        </div>

        <div className='w-full px-10 py-5 shadow-sm shadow-black/30 rounded-2xl'>
          <p className='font-bold text-xl'>Issue Types</p>
        </div>

        <div className='w-full px-10 py-5 shadow-sm shadow-black/30 rounded-2xl'>
          <p className='font-bold text-xl'>Top Locations</p>
        </div>
      </section>
    </>
  )
}

export default Home