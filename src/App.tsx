import './App.css'
import { Routes, Route } from 'react-router-dom'
import Login from './Components/Login'
import Register from './Components/Register'
import Dashboard from './Components/Admin/Dashboard'
import BooksContainer  from './Components/BooksContainer'
import NotificationsPage from './Components/Notifications'
import ProfilePage from './Components/Profile'
import History from './Components/History'
import Borrow from './Components/Borrow'
import { HeaderNavigation } from './Components/Header'

function App() {
  return (

    <>
      <Routes>
        <Route path='/' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/dashboard' element={<Dashboard />} />
        <Route path='/homepage' element={<BooksContainer />} />
        <Route path='/notifications' element={<NotificationsPage />} />
        <Route path='/profile' element={<ProfilePage />} />
        <Route path='/history' element={<History />} />
        <Route path='/borrow' element={<Borrow />} />
        <Route path='/header' element={<HeaderNavigation />} />
      </Routes>
    </>

  )
}

export default App
