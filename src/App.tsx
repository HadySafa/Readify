import './App.css'
import { Routes, Route } from 'react-router-dom'
import Login from './Components/Login'
import Register from './Components/Register'
import HomePage from './Components/HomePage'


function App() {
  return (

    <>
      <Routes>
        <Route path='/' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/homepage' element={<HomePage />} />

      </Routes>
    </>

  )
}

export default App
