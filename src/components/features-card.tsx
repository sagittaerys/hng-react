
import { GiBullseye } from "react-icons/gi";
import { GiLightningTrio } from "react-icons/gi";
import { SiGoogleanalytics } from "react-icons/si";

const FeatureCards = () => {
  const features = [
    {
      icon: <GiBullseye size={40} />,
      title: "Easy Tracking",
      content: "Monitor all your tickets in one centralized dashboard with real-time updates and notifications."
    },
    {
      icon: <GiLightningTrio size={40} />,
      title: "Fast Resolution",
      content: "Prioritize and resolve issues quickly with our intuitive workflow system and smart automation."
    },
    {
      icon: <SiGoogleanalytics size={40} />,
      title: "Detailed Analytics",
      content: "Get insights into ticket patterns and team performance with comprehensive reporting tools."
    }
  ];

  return (
    <>
     

      <section className="features-section">
        {/* decorative circle */}
        <div className="features-decorative-circle"></div>

        <div className="features-container">
          <h2 className="section-title">Features</h2>

          <div className="features-grid">
            {features.map((feature, index) => (
              <div key={index} className="feature-card">
                <div className="feature-icon">
                  {feature.icon}
                </div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-content">{feature.content}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default FeatureCards;