import { useState } from 'react';


export default function NavBar({onNavigate}: {onNavigate: (page: string) => void}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="container navbar">
        <div className="navbar-container">
         
         
         {/* brand */}
          <div className="navbar-brand" onClick={() => onNavigate('/')}>
           TicketApp
          </div>

          {/* large screens */}
          <div className="navbar-desktop">
            <button 
              className="nav-button nav-button-secondary"
              onClick={() => onNavigate('login')}
            >
              Login
            </button>
            <button 
              className="nav-button nav-button-primary"
              onClick={() => onNavigate('sign-up')}
            >
              Get Started
            </button>
          </div>

          {/* hamburger icon */}
          <div 
            className={`hamburger ${isMenuOpen ? 'active' : ''}`}
            onClick={toggleMenu}
          >
            <div className="hamburger-line"></div>
            <div className="hamburger-line"></div>
            <div className="hamburger-line"></div>
          </div>
        </div>

        {/* drop down on sm */}
        <div className={`mobile-menu ${isMenuOpen ? 'open' : ''}`}>
          <button 
            className="nav-button"
            onClick={() => {
              onNavigate('login');
              setIsMenuOpen(false);
            }}
          >

            Login
          </button>


          <button 
            className="nav-button"
            onClick={() => {
              onNavigate('signup');
              setIsMenuOpen(false);
            }}
          >
            Get Started
          </button>
        </div>
      </nav>
  
  );
}