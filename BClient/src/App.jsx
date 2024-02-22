import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { StorePage } from "./pages/StorePage"
import { LoginPage } from "./pages/LoginPage"
import { RegistrationPage } from "./pages/RegistrationPage"

export default function App()
{
  return (
    <BrowserRouter>
      <main className='container'>
        <Routes>
          <Route path="/registration" element={<RegistrationPage />} />
          <Route path="/" element={<LoginPage />} />
          <Route path="/store" element={<StorePage />} />
        </Routes>
      </main>
    </BrowserRouter>
  )
}