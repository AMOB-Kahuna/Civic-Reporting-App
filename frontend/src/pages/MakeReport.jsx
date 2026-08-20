import React, { useState, useEffect } from 'react';
import { categories, subCategories } from '../category';
import { Loader2 } from 'lucide-react';
import Message from '../components/Message';

const MakeReport = () => {
  // Form Values
  const [category, setCategory] = useState('');
  const [issue, setIssue] = useState('');
  const [description, setDescription] = useState('');
  const [address, setAddress] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState(null);

  const baseUrl = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => {
      setMessage(null);
    }, 4000);
    return () => clearTimeout(timer);
  }, [message]);

  async function handleSubmit(e) {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage(null);

    const formData = new FormData(e.currentTarget);

    try {
      const res = await fetch(`${baseUrl}/reports`, {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit issue');
      }

      console.log('Report Submitted', data);
      setMessage({ text: 'Report submitted successfully!', type: 'success' });

      // Clear form inputs
      setCategory('');
      setIssue('');
      setDescription('');
      setAddress('');
      e.target.reset();
    } catch (error) {
      console.error('Submission Error: ', error);
      setMessage({ text: error.message || 'Failed to submit report. Please try again.', type: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="max-w-2xl lg:max-w-3xl mx-auto my-4 relative">
      {message && <Message text={message.text} type={message.type} />}

      <h2 className="text-2xl md:text-3xl font-bold text-[#2d3047] text-center mb-6">
        Report an Issue in your Community
      </h2>

      <section>
        <form
          className="border-3 border-[#266907] rounded-3xl p-6 md:p-8 bg-[#2d3047]/90 shadow-2xl shadow-black text-[#e8f1fa]"
          onSubmit={handleSubmit}
        >
          <fieldset className="border-t border-[#e8f1fa]/20 pt-4 pb-6 flex flex-col gap-5">
            <legend className="pr-4 italic font-bold text-lg text-[#e8f1fa]">Issue Details</legend>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="flex flex-col gap-2">
                <label htmlFor="category" className="font-bold text-sm">
                  Category:
                </label>
                <select
                  name="category"
                  id="category"
                  disabled={isSubmitting}
                  className="w-full border-2 border-slate-300 px-4 py-2.5 rounded-2xl bg-white text-slate-900 focus:border-[#acaf1d] outline-none text-base disabled:opacity-50"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option value="">Select a category</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat} className="text-[#2d3047]">
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="sub_category" className="font-bold text-sm">
                  Specific Issue:
                </label>
                <select
                  name="sub_category"
                  id="sub_category"
                  className="w-full border-2 border-slate-300 px-4 py-2.5 rounded-2xl bg-white text-slate-900 focus:border-[#acaf1d] outline-none text-base disabled:opacity-50"
                  value={issue}
                  onChange={(e) => setIssue(e.target.value)}
                  required
                  disabled={!category || isSubmitting}
                >
                  <option value="">Select issue type</option>
                  {category &&
                    subCategories[category].map((subCat) => (
                      <option key={subCat} value={subCat} className="text-[#2d3047]">
                        {subCat}
                      </option>
                    ))}
                </select>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="description" className="font-bold text-sm">
                Description:
              </label>
              <input
                name="description"
                type="text"
                id="description"
                disabled={isSubmitting}
                placeholder="Provide a concise description of the problem"
                className="w-full border-2 border-slate-300 rounded-2xl px-5 py-2.5 bg-white text-slate-900 focus:border-[#acaf1d] outline-none text-base disabled:opacity-50"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="address" className="font-bold text-sm">
                Location Address:
              </label>
              <input
                name="address"
                type="text"
                id="address"
                disabled={isSubmitting}
                placeholder="e.g., Allen Avenue, Ikeja, Lagos"
                className="w-full border-2 border-slate-300 rounded-2xl px-5 py-2.5 bg-white text-slate-900 focus:border-[#acaf1d] outline-none text-base disabled:opacity-50"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>
          </fieldset>

          <fieldset className="border-t border-[#e8f1fa]/20 pt-4 pb-4 flex flex-col gap-3">
            <legend className="pr-4 italic font-bold text-lg text-[#e8f1fa]">Photo Evidence</legend>
            <label htmlFor="image" className="font-bold text-sm">
              Upload Image (Optional):
            </label>
            <input
              type="file"
              name="image"
              id="image"
              accept="image/*"
              disabled={isSubmitting}
              className="w-full border-2 border-slate-300 rounded-2xl px-4 py-2 bg-white text-slate-700 file:mr-4 file:px-4 file:py-1.5 file:rounded-xl file:bg-[#266907] file:text-white file:font-semibold file:border-0 hover:file:bg-[#acaf1d] cursor-pointer focus:border-[#acaf1d] text-sm disabled:opacity-50"
            />
          </fieldset>

          <button
            disabled={isSubmitting}
            className="w-full md:w-auto px-10 py-3.5 mx-auto flex items-center justify-center gap-2 mt-6 bg-[#266907] hover:bg-[#acaf1d] disabled:bg-slate-500 disabled:cursor-not-allowed text-white rounded-2xl font-bold transition-colors cursor-pointer text-base text-center"
            type="submit"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Submitting...</span>
              </>
            ) : (
              <span>Submit Report</span>
            )}
          </button>
        </form>
      </section>
    </div>
  );
};

export default MakeReport;