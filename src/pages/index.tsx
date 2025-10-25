import NavBar from "../components/header";
import HeroSection from "./hero-section";
import FeatureCards from "../components/features-card";


export default function Landing({onNavigate}: {onNavigate: (path: string) => void}) {
  return (
    <div className="container">
      <NavBar onNavigate={onNavigate} />

      {/* hero section */}
      <div>
      <HeroSection onNavigate={onNavigate} />

      </div>


      {/* featured */}
      <section>
      <FeatureCards />
        
      </section>
    </div>
  );
}