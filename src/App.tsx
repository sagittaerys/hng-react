import './index.css'
import { Route, Routes } from 'react-router-dom';
import Landing from './pages/index';
import Login from './pages/login';
import SignUp from './pages/sign-up';
import Dashboard from './pages/dashboard';
import Footer from './components/footer';
import NavBar from './components/header';
import TicketsPage from './pages/tickets';

function App() {
  const handleNavigate = (path: string) => {
    window.location.href = path;
  };

  return (
    <>
      <NavBar onNavigate={handleNavigate} />
      <Routes>
        <Route path="/" element={<Landing onNavigate={handleNavigate} />} />
        <Route path="/sign-up" element={<SignUp onNavigate={handleNavigate} />} />
        <Route path="/dashboard" element={<Dashboard onNavigate={handleNavigate} />} />
        <Route path="/login" element={<Login onNavigate={handleNavigate} />} />
        <Route path="/tickets" element={<TicketsPage onNavigate={handleNavigate} />} />
      </Routes>
      <Footer   />
    </>
  )
}

export default App
