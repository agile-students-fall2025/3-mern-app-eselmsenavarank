import { useEffect, useState } from 'react'

export default function AboutUs() {
  const [data, setData] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    (async () => {
      try 
        {
            const res = await fetch('http://localhost:5002/about_us')
            if (!res.ok) throw new Error(`HTTP ${res.status}`)
            setData(await res.json())
            
        } 
        catch (e) {
            setError(e.message || 'Error')
        }
    })()
  }, [])

  if (error) return <p>Error: {error}</p>
  if (!data) return <p>Loading...</p>

  return (
    <>
     {data.imageUrl && <img src={data.imageUrl} alt="About us" />}
      <h2>{data.title}</h2>
      <p>{data.content}</p>
    </>
  )
}


