import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import axios from 'axios';

function CarRacersList(props) {
  const [list, setlist] = useState([])

  useEffect(() => {
    const getResults = async () => {
      const result = await axios.get('http://localhost:3000/car_racers')
      setlist([...list, ...result.data])
    }
    getResults()
  }, [])
  return (
    <ol>
      {list.map((curr) => (<li key={curr.id}>{curr.name} {curr.age} years old, from {curr.country}.</li>))}
    </ol>
  )
}

export default CarRacersList;
