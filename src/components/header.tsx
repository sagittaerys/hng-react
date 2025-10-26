import { useEffect, useState } from 'react';

export default function NavBar({onNavigate}: {onNavigate: (page: string) => void}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    checkAuthStatus();
  }, []);

  function checkAuthStatus() {
    const session = localStorage.getItem("ticketapp_session");
    
    if (session) {
      try {
        const sessionData = JSON.parse(session);
        
        if (new Date(sessionData.expiresAt) > new Date()) {
          setIsLoggedIn(true);
          setUserName(sessionData.name?.split(' ')[0] || 'User');
        } else {
          localStorage.removeItem("ticketapp_session");
          setIsLoggedIn(false);
          setUserName('');
        }
      } catch (err) {
        console.error("Session error:", err);
        setIsLoggedIn(false);
        setUserName('');
      }
    } else {
      setIsLoggedIn(false);
      setUserName('');
    }
  }

  useEffect(() => {
    (window as any).checkNavAuth = checkAuthStatus;
    return () => {
      delete (window as any).checkNavAuth;
    };
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  type NavigationHandler = (path: string) => void;

  const handleNavigation: NavigationHandler = (path: string) => {
    setIsMenuOpen(false);
    onNavigate(path);
  };

  return (
    <nav className="container navbar">
      <div className="navbar-container">
        {/* brand */}
        <div className="navbar-brand" onClick={() => handleNavigation(isLoggedIn ? '/dashboard' : '/')}>
          TicketApp
        </div>

        {/* Desktop Navigation */}
        <div className="navbar-desktop">
          {isLoggedIn ? (
            <>
              <span className="user-greeting">Hi, {userName}!</span>
              <button 
                className="nav-button nav-button-dashboard"
                onClick={() => handleNavigation('/dashboard')}
              >
                Dashboard
              </button>
            </>
          ) : (
            <>
              <button 
                className="nav-button nav-button-secondary"
                onClick={() => handleNavigation('/login')}
              >
                Login
              </button>
              <button 
                className="nav-button nav-button-primary"
                onClick={() => handleNavigation('/sign-up')}
              >
                Get Started
              </button>
            </>
          )}
        </div>

        {/* Hamburger - Only show when NOT logged in */}
        {!isLoggedIn && (
          <div 
            className={`hamburger ${isMenuOpen ? 'active' : ''}`}
            onClick={toggleMenu}
          >
            <div className="hamburger-line"></div>
            <div className="hamburger-line"></div>
            <div className="hamburger-line"></div>
          </div>
        )}
      </div>

      {/* Mobile Menu - Only show when NOT logged in */}
      {!isLoggedIn && (
        <div className={`mobile-menu ${isMenuOpen ? 'open' : ''}`}>
          <button 
            className="nav-button nav-button-secondary"
            onClick={() => handleNavigation('/login')}
          >
            Login
          </button>
          <button 
            className="nav-button nav-button-primary"
            onClick={() => handleNavigation('/sign-up')}
          >
            Get Started
          </button>
        </div>
      )}
    </nav>
  );
}