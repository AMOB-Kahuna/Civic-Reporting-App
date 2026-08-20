import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

const Report = () => {

  const {id} = useParams();
  const [report, setReport] = useState(null);
  const baseUrl = import.meta.env.VITE_API_BASE_URL;

  // console.log(id)

  useEffect( () => {
    (async () => {
      try {
        const res = await fetch(`${baseUrl}/reports/${id}`);
        const data = await res.json();

        console.log(data);
        setReport(data)
      } catch (err) {
        console.log(err);
      }
    })();
  }, [])

  return (
    <div>
      {
        report &&
        <img src={report[0].img} alt="" className='w-100 h-50' />
      }
    </div>
  )
}

export default Report