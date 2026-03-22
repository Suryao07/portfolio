import { useEffect, useState } from "react";
import profile from "../assets/profile.png";

export default function About() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <section style={pageWrapper}>
      <div style={container}>
        {/* Header */}
        <div style={{...header, ...fadeIn(0)}} className={isVisible ? 'fade-in' : ''}>
          <h1 style={title}>About Me</h1>
          <p style={subtitle}>
            Aspiring Cybersecurity Engineer · Penetration Testing · Applied Cryptography · Post-Quantum Security · Research
          </p>
        </div>

        {/* Main Grid */}
        <div style={mainGrid} className="main-grid-responsive">
          {/* Profile Card */}
          <div 
            style={{...hoverCard(profileCard), ...slideInLeft(0.2)}} 
            className={isVisible ? 'slide-in-left' : ''}
            data-hover
          >
            <img
              src={profile}
              alt="Profile"
              loading="lazy"
              className="profile-photo"
              style={profileImage}
            />
            <h3 style={profileName}>Surya Pratap Singh</h3>
            <p style={profileRole}>B.Tech CSE (Cybersecurity)</p>
          </div>

          {/* About Text */}
          <div 
            style={{...hoverCard(aboutCard), ...slideInRight(0.3)}} 
            className={isVisible ? 'slide-in-right' : ''}
            data-hover
          >
            <p style={aboutText}>
              I am a cybersecurity student and aspiring penetration tester with hands-on experience in web security, network reconnaissance, and vulnerability assessment. I design and develop practical security tools and solve real-world security challenges through labs, CTFs, and independent projects.
            </p>

            <p style={aboutText}>
              My core interests lie in penetration testing, security automation, and applied cryptography. I focus on understanding system weaknesses, identifying vulnerabilities, and developing efficient approaches to secure modern applications and infrastructure.
            </p>

            <p style={aboutText}>
              I am currently working on research in hybrid post-quantum cryptographic systems, exploring how classical encryption can be combined with quantum-resistant mechanisms to enhance security in real-world environments. My work emphasizes practical implementation, performance evaluation, and resilience against modern attack scenarios.
            </p>

            <p style={aboutText}>
              I follow responsible security practices and continuously improve through hands-on experimentation and real-world problem solving.
            </p>

            <p style={aboutText}>
              My long-term goal is to contribute to cybersecurity research and offensive security engineering while building impactful tools and contributing to secure system design.
            </p>

            <p style={aboutText}>
              Actively seeking opportunities to apply and grow my skills in real-world cybersecurity environments.
            </p>
          </div>
        </div>

        {/* Core Focus */}
        <div style={{...focusSection, ...fadeIn(0.5)}} className={isVisible ? 'fade-in' : ''}>
          <h2 style={sectionTitle}>Core Focus Areas</h2>

          <div className="core-focus-scroll" onWheel={(e)=>{e.preventDefault(); e.currentTarget.scrollLeft += e.deltaY;}}>
            <div 
              style={{...hoverCard(focusCard), ...staggerFadeIn(0.1)}} 
              className={isVisible ? 'stagger-fade-in' : ''}
              data-hover
            >
              🔐 Penetration Testing
            </div>
            <div 
              style={{...hoverCard(focusCard), ...staggerFadeIn(0.2)}} 
              className={isVisible ? 'stagger-fade-in' : ''}
              data-hover
            >
              🌐 Network Reconnaissance
            </div>
            <div 
              style={{...hoverCard(focusCard), ...staggerFadeIn(0.3)}} 
              className={isVisible ? 'stagger-fade-in' : ''}
              data-hover
            >
              ⚙️ Security Automation
            </div>
            <div 
              style={{...hoverCard(focusCard), ...staggerFadeIn(0.4)}} 
              className={isVisible ? 'stagger-fade-in' : ''}
              data-hover
            >
              🛡️ Cryptography & Post-Quantum Security
            </div>
          </div>
        </div>

        {/* Research Direction */}
        <div 
          style={{...hoverCard(researchSection), ...fadeInUp(0.6)}} 
          className={isVisible ? 'fade-in-up' : ''}
          data-hover
        >
          <h2 style={sectionTitle}>Research Direction</h2>
          <p style={researchText}>
            Currently researching the security evaluation of hybrid post-quantum cryptographic systems under real-world attack scenarios. This involves analyzing how classical encryption techniques can be integrated with quantum-resistant algorithms to enhance system security.
          </p>
          <p style={researchText}>
            The research focuses on performance analysis, computational efficiency, and resistance against practical attack models. Emphasis is placed on real-world applicability, secure system design, and understanding trade-offs between security and performance in hybrid cryptographic implementations.
          </p>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes staggerFadeIn {
          from {
            opacity: 0;
            transform: translateY(20px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .fade-in {
          animation: fadeIn 0.8s ease-out forwards;
        }

        .slide-in-left {
          animation: slideInLeft 0.8s ease-out forwards;
        }

        .slide-in-right {
          animation: slideInRight 0.8s ease-out forwards;
        }

        .fade-in-up {
          animation: fadeInUp 0.8s ease-out forwards;
        }

        .stagger-fade-in {
          animation: staggerFadeIn 0.6s ease-out forwards;
        }

        [data-hover] {
          transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease;
        }

        [data-hover]:hover {
          transform: translateY(-5px) scale(1.02);
          box-shadow: 0 8px 30px rgba(79, 209, 255, 0.35), 0 0 60px rgba(79, 209, 255, 0.15);
          border-color: rgba(79, 209, 255, 0.5) !important;
        }

        /* Responsive Design - Mobile & Tablet */
        @media (max-width: 1024px) {
          section > div > div.main-grid-responsive {
            grid-template-columns: 1fr !important;
            gap: 32px !important;
          }
        }

        @media (max-width: 768px) {
          section > div > div.main-grid-responsive {
            gap: 28px !important;
          }
        }

        /* iOS Safari optimizations */
        @supports (-webkit-touch-callout: none) {
          [data-hover] {
            -webkit-transform: translateZ(0);
            transform: translateZ(0);
          }
        }

        /* Android optimizations */
        @media screen and (max-width: 768px) and (-webkit-min-device-pixel-ratio: 2) {
          [data-hover] {
            -webkit-transform: translateZ(0);
            transform: translateZ(0);
            will-change: transform;
          }
        }
      `}</style>
    </section>
  );
}

/* ---------------- STYLES ---------------- */

const pageWrapper = {
  padding: "clamp(80px, 12vw, 110px) clamp(5%, 6vw, 80px) clamp(60px, 8vw, 80px)",
  display: "flex",
  justifyContent: "center",
  minHeight: "100vh",
};

const container = {
  width: "100%",
  maxWidth: "1400px",
  display: "flex",
  flexDirection: "column",
  gap: "clamp(40px, 6vw, 70px)",
};

/* Header */

const header = {
  textAlign: "center",
  maxWidth: "900px",
  margin: "0 auto",
};

const title = {
  fontSize: "clamp(2rem, 5vw, 3rem)",
  color: "#4fd1ff",
  fontWeight: 800,
  letterSpacing: "0.5px",
};

const subtitle = {
  marginTop: "clamp(10px, 2vw, 14px)",
  color: "#cbd5e1",
  fontSize: "clamp(0.95rem, 2vw, 1.1rem)",
};

/* Main Grid */

const mainGrid = {
  display: "grid",
  gridTemplateColumns: "minmax(280px, 360px) 1fr",
  gap: "clamp(32px, 4vw, 48px)",
  alignItems: "start", // Fixed: Changed from "stretch" to "start" for proper alignment
};

/* Profile Card */

const profileCard = {
  background: "rgba(255,255,255,0.03)",
  border: "1px solid rgba(79,209,255,0.3)",
  borderRadius: "18px",
  padding: "clamp(24px, 3vw, 32px) clamp(20px, 2.5vw, 28px)",
  textAlign: "center",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "flex-start",
};

/* ✅ Fixed image alignment - centered vertically and horizontally */
const profileImage = {
  width: "clamp(140px, 18vw, 180px)",
  height: "clamp(140px, 18vw, 180px)",
  objectFit: "cover",
  objectPosition: "50% 25%",
  borderRadius: "50%",
  border: "2px solid rgba(79,209,255,0.45)",
  boxShadow:
    "0 0 18px rgba(79,209,255,0.25), 0 0 60px rgba(79,209,255,0.08)",
  margin: "0 auto clamp(16px, 2vw, 18px)",
  display: "block",
};

const profileName = {
  fontSize: "clamp(1.2rem, 2.5vw, 1.4rem)",
  color: "#4fd1ff",
  fontWeight: 700,
  marginBottom: "8px",
};

const profileRole = {
  fontSize: "clamp(0.85rem, 1.8vw, 0.9rem)",
  color: "#cbd5e1",
};

/* About Card */

const aboutCard = {
  background: "rgba(255,255,255,0.02)",
  border: "1px solid rgba(79,209,255,0.25)",
  borderRadius: "18px",
  padding: "clamp(28px, 4vw, 36px) clamp(24px, 3vw, 40px)",
  display: "flex",
  flexDirection: "column",
  justifyContent: "flex-start",
};

const aboutText = {
  fontSize: "clamp(0.95rem, 1.8vw, 1rem)",
  lineHeight: 1.75,
  color: "#e5e7eb",
  marginBottom: "clamp(14px, 2vw, 18px)",
};

/* Focus Section */

const focusSection = {
  display: "flex",
  flexDirection: "column",
  gap: "28px",
};

const sectionTitle = {
  fontSize: "clamp(1.5rem, 3.5vw, 2rem)",
  color: "#4fd1ff",
  fontWeight: 700,
};

const focusGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(clamp(240px, 25vw, 260px), 1fr))",
  gap: "clamp(16px, 2vw, 22px)",
};

const focusCard = {
  background: "rgba(255,255,255,0.03)",
  border: "1px solid rgba(79,209,255,0.3)",
  borderRadius: "14px",
  padding: "clamp(18px, 2.5vw, 22px)",
  fontSize: "clamp(0.9rem, 1.8vw, 0.95rem)",
  color: "#e5e7eb",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  textAlign: "center",
};

/* Research Section */

const researchSection = {
  background:
    "linear-gradient(135deg, rgba(79,209,255,0.08), rgba(255,255,255,0.02))",
  border: "1px solid rgba(79,209,255,0.35)",
  borderRadius: "18px",
  padding: "clamp(32px, 5vw, 48px) clamp(32px, 4vw, 56px)",
  display: "flex",
  flexDirection: "column",
  gap: "clamp(12px, 2vw, 14px)",
};

const researchText = {
  fontSize: "clamp(0.95rem, 1.8vw, 1rem)",
  lineHeight: 1.75,
  color: "#e5e7eb",
};

/* ---------------- Hover Effect Utility ---------------- */

const hoverCard = (baseStyle) => ({
  ...baseStyle,
  cursor: "default",
});

/* Animation delay helpers */
const fadeIn = (delay) => ({
  opacity: 0,
  animationDelay: `${delay}s`,
});

const slideInLeft = (delay) => ({
  opacity: 0,
  transform: "translateX(-30px)",
  animationDelay: `${delay}s`,
});

const slideInRight = (delay) => ({
  opacity: 0,
  transform: "translateX(30px)",
  animationDelay: `${delay}s`,
});

const fadeInUp = (delay) => ({
  opacity: 0,
  transform: "translateY(30px)",
  animationDelay: `${delay}s`,
});

const staggerFadeIn = (delay) => ({
  opacity: 0,
  transform: "translateY(20px) scale(0.95)",
  animationDelay: `${delay}s`,
});
