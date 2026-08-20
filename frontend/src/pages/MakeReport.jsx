import React, { useState } from 'react'
import { NavLink } from 'react-router-dom';
import { categories, subCategories } from '../category';

const MakeReport = () => {

  // Form Values
  const [category, setCategory] = useState('');
  const [issue, setIssue] = useState('');
  const [description, setDescription] = useState('');
  const [address, setAddress] = useState('');


  const baseUrl = import.meta.env.VITE_API_BASE_URL;
  // console.log(subCategory[category[2]])

  async function handleSubmit(e) {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    try {
      const res = await fetch(`${baseUrl}/reports`, {
        method: "POST",
        body: formData
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to submit issue");
      }

      console.log("Report Submitted", data);
    } catch (error) {
      console.log("Submission Error: ", error);
    }
  }

  return (
    <>
      <h2 className='text-2xl font-medium text-center mb-5'>Report an Issue in your Community</h2>

      <section>
        <form
          className='border-3 border-[#266907] rounded-2xl p-3 bg-[#2d3047]/80 shadow-2xl shadow-black text-[#e8f1fa]'
          onSubmit={handleSubmit}
        >
          <fieldset className='border-t pt-3 pb-7 flex flex-col gap-4'>
            <legend className='pr-5 italic font-bold'>Details</legend>
            <div className='flex gap-5 items-center justify-between'>
              <label
                htmlFor="category"
                className='font-bold'
              >Category:</label>
              <select
                name="category"
                id="category"
                className='w-47 border-2 px-5 py-2 rounded-2xl focus:border-[#acaf1d]'
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="">Select a category</option>
                {
                  categories.map(category => <option
                    key={category}
                    value={category}
                    className='text-[#2d3047]'
                  >{category}</option>)
                }
              </select>
            </div>

            <div className='flex gap-5 items-center justify-between'>
              <label
                htmlFor="sub_category"
                className='font-bold'
              >Issue:</label>
              <select
                name="sub_category"
                id="sub_category"
                className='w-47 border-2 px-5 py-2 rounded-2xl focus:border-[#acaf1d]'
                value={issue}
                onChange={(e) => setIssue(e.target.value)}
                required
                disabled={!category}
              >
                {
                  category &&
                  subCategories[category].map(subCategory => <option
                    key={subCategory}
                    value={subCategory}
                    className='text-[#2d3047]'
                  >{subCategory}</option>)
                }
              </select>
            </div>

            <div>
              <label
                htmlFor="description"
                className='font-bold'
              >Description:</label>
              <input
                name="description"
                type="text"
                id='description'
                placeholder='Short description'
                className='w-full border-2 rounded-2xl px-5 py-2 focus:border-[#acaf1d]'
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                />
            </div>

            <div>
              <label
                htmlFor="address"
                className='font-bold'
              >Address:</label>
              <input
                name="address"
                type="text"
                id='address'
                placeholder='Address'
                className='w-full border-2 rounded-2xl px-5 py-2 focus:border-[#acaf1d]'
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                />
            </div>
          </fieldset>
          <br />
          <fieldset className='border-t py-3 flex flex-col gap-4'>
            <legend className='pr-5 italic font-bold'>Add Media</legend>
            <label
              htmlFor="image"
              className='font-bold'
            >Upload Image:</label>
            <input
              type="file"
              name="image"
              id="image"
              accept='image/*'
              className='w-full border-2 rounded-2xl px-5 py-2 file:px-5 file:py-2 file:rounded-2xl file:bg-[#4298e4] file:text-white cursor-pointer focus:border-[#acaf1d]'
              />
          </fieldset>

          <button
            className='block text-center py-3 px-7 mx-auto my-5 bg-[#266907] rounded-2xl font-bold hover:bg-[#acaf1d]'
            type='submit'
          >Submit</button>
        </form>
      </section>
    </>
  )
}

export default MakeReport