import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { StorePage } from "./pages/StorePage"
import { LoginPage } from "./pages/LoginPage"
import { RegistrationPage } from "./pages/RegistrationPage"
import { UserProfile } from './pages/UserProfile'

export default function App()
{
  return (
    <BrowserRouter>
      <main className='container'>
        <Routes>
          <Route path="/registration" element={<RegistrationPage />} />
          <Route path="/" element={<LoginPage />} />
          <Route path="/store" element={<StorePage />} />
          <Route path="/userpage" element={<UserProfile />} />
        </Routes>
      </main>
    </BrowserRouter>
  )
}