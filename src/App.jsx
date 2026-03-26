import { useState } from 'react'
import BarberShop from './components/BarberShop'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <BarberShop />
    </>
  )
}

export default App
