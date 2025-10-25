import WaveSVG from "../assets/wave-haikei.svg"

export default function HeroSection ({onNavigate}: {onNavigate: (path: string) => void}) {
  return (
    <section className="container hero-section">
      {/* Decorative circles */}
      <div className="decorative-circle circle-1"></div>
      <div className="decorative-circle circle-2"></div>

      {/* Hero content */}
      <div className="hero-container">


        <div className="hero-content flex flex-col items-center text-center">
          <h1 className="hero-title">Manage all your tickets in one place</h1>
          <p className="hero-subtitle">
            Streamline your ticketing process with our all-in-one solution designed for efficiency and ease of use.
          </p>


          <div className="hero-buttons">
            <button className="hero-button-secondary" onClick={() => onNavigate('login')}>Login</button>
            <button className="hero-button-primary" onClick={() => onNavigate('sign-up')}>Get Started</button>
          </div>

        </div>
      </div>


      {/* wavy thingy */}
      <img 
        src={WaveSVG} 
        alt="" 
        className="hero-wave"
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          width: '100%',
          height: 'auto',
          zIndex: -100
        }}
      />
    </section>
  );
};

