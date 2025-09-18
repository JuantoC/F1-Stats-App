import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function OrderList() {
  const [list, setlist] = useState([])

  return (
    <>
      <ol>
          {list.map((curr)=> (<li>{curr.time}</li>))}
      </ol>
      <button onClick={()=>{
        setlist([...list, {
          time: new Date().getTime()
        }])
      }}>Get Time</button>
      </>
  )
}

export default OrderList
