import { Link } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import profile from "../assets/profile.png";
import "./Home.css";

export default function Home() {
  const [typedText, setTypedText] = useState("");
  const fullText = "Exploring hybrid post-quantum cryptographic systems for secure communication  Interested in evaluating how modern encryption techniques perform under real-world attack scenarios.";
  const skillsGridRef = useRef(null);
  const toolsGridRef = useRef(null);

  useEffect(() => {
    let index = 0;
    const typingInterval = setInterval(() => {
      if (index < fullText.length) {
        setTypedText(fullText.slice(0, index + 1));
        index++;
      } else {
        clearInterval(typingInterval);
      }
    }, 50);

    return () => clearInterval(typingInterval);
  }, []);

  // Horizontal mouse wheel scrolling for ALL horizontal scroll grids
  // Automatically applies to any element with class containing "-grid" (future-proof - no manual updates needed)
  useEffect(() => {
    const handleWheel = (e, element) => {
      if (!element) return;
      
      // Check if element can scroll horizontally
      const canScrollHorizontally = element.scrollWidth > element.clientWidth;
      
      if (canScrollHorizontally) {
        const isScrollingVertically = Math.abs(e.deltaY) > Math.abs(e.deltaX);
        
        // If scrolling vertically but hovering over horizontal scrollable element, scroll horizontally
        if (isScrollingVertically && e.deltaY !== 0) {
          e.preventDefault();
          element.scrollBy({
            left: e.deltaY,
            behavior: 'auto'
          });
        }
      }
    };

    // Store all handlers for cleanup
    const handlerMap = new Map();

    const attachToAllGrids = () => {
      // Automatically find ALL elements with class names containing "-grid"
      // This means any new horizontal scroll section will automatically work without code changes!
      const allGridElements = document.querySelectorAll('[class*="-grid"]');
      
      allGridElements.forEach(element => {
        // Skip if already has handler attached
        if (handlerMap.has(element)) return;
        
        // Only attach if element can scroll horizontally
        if (element && element.scrollWidth > element.clientWidth) {
          const handler = (e) => handleWheel(e, element);
          element.addEventListener('wheel', handler, { passive: false });
          handlerMap.set(element, handler);
        }
      });
    };

    // Attach handlers after DOM is ready
    attachToAllGrids();
    
    // Re-attach after a short delay to catch any dynamically added elements
    const timeoutId = setTimeout(attachToAllGrids, 500);

    // Cleanup function
    return () => {
      clearTimeout(timeoutId);
      handlerMap.forEach((handler, element) => {
        element.removeEventListener('wheel', handler);
      });
      handlerMap.clear();
    };
  }, []);

  // Quick Stats Data
  const stats = [
    { label: "TryHackMe Rooms  ", value: "50+", icon: "🛡️" },
    { label: "CTF Challenges Solved ", value: "4+", icon: "🚩" },
    { label: "Certifications", value: "4+", icon: "📜" },
    { label: "Security Projects", value: "3+", icon: "🗂️" },
  ];

  // Skills Data
  const securitySkills = [
    { name: "Web Security", icon: "🌐" },
    { name: "Network Reconnaissance", icon: "📡" },
    { name: "Vulnerability Assessment", icon: "🛡️" },
    { name: "Cryptography Fundamentals", icon: "🔐" },
    { name: "CTF Problem Solving", icon: "🎯" },
  ];

  const programmingLanguages = [
    { name: "Python", icon: "🐍" },
    { name: "JavaScript", icon: "🟨" },
    { name: "React", icon: "⚛️" },
    { name: "Java", icon: "☕" },
    { name: "C++", icon: "🔧" },
    { name: "HTML", icon: "🌐" },
    { name: "CSS", icon: "🎨" },
    { name: "C", icon: "⚙️" },
    { name: "SQL", icon: "💾" },
  ];

  const securityTools = [
    { name: "Burp Suite", icon: "🟠" },
    { name: "Nmap", icon: "🟢" },
    { name: "Wireshark", icon: "🔵" },
    { name: "Metasploit", icon: "🔴" },
    { name: "OWASP ZAP", icon: "🟣" },
    { name: "Aircrack-ng", icon: "🟡" },
  ];

  // Organized Security Tools by Category
  const securityToolsCategories = [
    {
      title: "Web Testing",
      icon: "🌐",
      tools: ["Burp Suite", "OWASP ZAP", "sqlmap", "Nikto"]
    },
    {
      title: "Recon & Enumeration",
      icon: "📡",
      tools: ["Nmap", "Gobuster", "Dirb", "Enum4linux", "Whois", "Netdiscover", "DNSRecon", "theHarvester"]
    },
    {
      title: "Exploitation",
      icon: "🔓",
      tools: ["Metasploit", "Searchsploit"]
    },
    {
      title: "Password Attacks",
      icon: "🔑",
      tools: ["Hydra", "John the Ripper", "Hashcat"]
    },
    {
      title: "Network Analysis",
      icon: "📊",
      tools: ["Wireshark", "Tcpdump", "Netcat"]
    },
    {
      title: "Wireless Security",
      icon: "📶",
      tools: ["Aircrack-ng","Wifite", "fern-wifi-cracker"]
    },
    {
      title: "Environment",
      icon: "🐧",
      tools: ["Kali Linux", "Linux CLI"]
    }
  ];

  // Certifications Data
  const certifications = [
    { 
      title: "Certified Ethical Hacker", 
      subtitle: "Training – Internshala & Scholverse Educare",
      icon: "🛡️",
      shortName: "CEH"
    },
    { 
      title: "TryHackMe Pre Security Certificate",
      subtitle: "Security Fundamentals",
      icon: "🧠",
      shortName: "TryHackMe"
    },
    { 
      title: "Google Foundations of Cybersecurity",
      subtitle: "Coursera Professional Certificate",
      icon: "🌐",
      shortName: "Google"
    },
    { 
      title: "Advanced Diploma in Python Programming",
      subtitle: "Programming & Automation",
      icon: "🐍",
      shortName: "Python"
    },
    { 
      title: "CTF Participation",
      subtitle: "3+ Capture The Flag Competitions",
      icon: "🎯",
      shortName: "CTF"
    },
  ];

  // Featured Project
  const featuredProject = {
    name: "DomainScanner",
    description: "A Python-based reconnaissance tool for subdomain enumeration and directory brute-forcing, designed to identify hidden assets and analyze HTTP responses during security assessments.",
    tech: ["Python", "Security", "Automation"],
    link: "/projects",
  };



  // Social Links (placeholder - user will add later)
  const socialLinks = [
    { name: "GitHub", icon: "💻", url: "https://github.com/Suryao07" },
    { name: "LinkedIn", icon: "💼", url: "https://www.linkedin.com/in/surya-pratap-singh-61a41130a" },
    { name: "TryHackMe", icon: "🛡️", url: "https://tryhackme.com/p/suryao07" },
    { name: "Email", icon: "📧", url: "mailto:surya7978252@gmail.com" },
  ];

  return (
    <>
      {/* Hero Section */}
      <section className="home-hero" style={heroContainer}>
        <div className="text-area" style={textArea}>
          <h1 className="glow">SURYA PRATAP SINGH</h1>

          <p style={{ marginTop: "clamp(1rem, 3vw, 1.5rem)" }}>
            Aspiring Penetration Tester | Cybersecurity Student
          </p>

          <p style={{ marginTop: "clamp(1.2rem, 4vw, 2rem)" }}>
            Passionate cybersecurity student focused on penetration testing and real-world security practices. Experienced in identifying vulnerabilities through hands-on labs and CTF challenges using tools like Burp Suite and Nmap. Actively building practical skills in web security, network reconnaissance, and automation, while continuously learning modern security techniques.
          </p>

          <p style={{ marginTop: "clamp(1rem, 3vw, 1.5rem)" }}>
            Currently seeking opportunities to apply and grow practical cybersecurity skills.
          </p>

          {/* Social Links */}
          <div className="social-links-container" style={socialLinksContainer}>
            {socialLinks.map((social, index) => (
              <a
                key={index}
                href={social.url}
                className="social-link-style"
                style={socialLinkStyle}
                aria-label={social.name}
                target="_blank"
                rel="noopener noreferrer"
              >
                <span style={{ fontSize: "1.5rem" }}>{social.icon}</span>
                <span style={{ fontSize: "0.85rem", marginLeft: "8px" }}>{social.name}</span>
              </a>
            ))}
          </div>

          {/* Call-to-Action Buttons */}
          <div className="cta-container" style={ctaContainer}>
            <Link to="/projects" className="cta-button-primary" style={ctaButtonPrimary}>
              View My Projects →
            </Link>
            <Link to="/resume" className="cta-button-secondary" style={ctaButtonSecondary}>
              Download Resume
            </Link>
          </div>
        </div>

        <div className="home-image-area" style={imageArea}>
          <img src={profile} alt="Profile" style={imageStyle} />
        </div>
      </section>

      {/* Quick Stats Section */}
      <section style={{...sectionStyle, paddingTop: "clamp(30px, 4vw, 50px)"}}>
        <h2 style={sectionTitle}>Quick Stats</h2>
        <div className="stats-grid" style={statsGrid}>
          {stats.map((stat, index) => (
            <div key={index} style={statCard}>
              <div style={statIcon}>{stat.icon}</div>
              <div style={statValue}>{stat.value}</div>
              <div style={statLabel}>{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Recent Activity / Status */}
      <section style={sectionStyle}>
        <h2 style={sectionTitle}>Current Status</h2>
        <div style={statusContainer}>
          <div style={statusBadge}>
            <span style={statusIcon}>⚡</span>
            <span style={statusText}>
              {typedText}
              <span style={cursorBlink}>|</span>
            </span>
          </div>
          <div style={availabilityBadge}>
            <span style={availabilityDot}>🟢</span>
            Available for opportunities
          </div>
        </div>
      </section>

      {/* Featured Project */}
      <section style={sectionStyle}>
        <h2 style={sectionTitle}>Featured Project</h2>
        <div style={featuredProjectCard}>
          <div style={featuredProjectHeader}>
            <h3 style={featuredProjectTitle}>{featuredProject.name}</h3>
            <Link to={featuredProject.link} style={viewAllLink}>
              View All Projects →
            </Link>
          </div>
          <p style={featuredProjectDesc}>{featuredProject.description}</p>
          <div style={featuredProjectTech}>
            {featuredProject.tech.map((tech, index) => (
              <span key={index} style={techTag}>
                {tech}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Skills & Technologies Section */}
      <section style={sectionStyle}>
        <h2 style={sectionTitle}>Skills & Technologies</h2>
        
        {/* Security Skills */}
        <div style={skillsSection}>
          <h3 style={subsectionTitle}>Security Skills</h3>
          <div className="skills-grid" ref={skillsGridRef} style={skillsGrid}>
            {securitySkills.map((skill, index) => (
              <div key={index} style={securitySkillBadge}>
                <span style={skillIcon}>{skill.icon}</span>
                <span style={skillName}>{skill.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Security Tools - Organized by Category */}
        <div style={skillsSection}>
          <h3 style={subsectionTitle}>Security Tools & Frameworks</h3>
          <div className="security-tools-grid" style={toolsCategoriesContainer}>
            {securityToolsCategories.map((category, categoryIndex) => (
              <div key={categoryIndex} className="security-tool-category" style={toolCategorySection}>
                <div className="category-header" style={categoryHeader}>
                  <span className="category-icon" style={categoryIcon}>{category.icon}</span>
                  <h4 className="category-title" style={categoryTitle}>{category.title}</h4>
                </div>
                <div className="tools-grid" style={toolsGridCategory}>
                  {category.tools.map((tool, toolIndex) => (
                    <div key={toolIndex} className="tool-tag" style={toolTag}>
                      {tool}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Programming Languages */}
        <div style={skillsSection}>
          <h3 style={subsectionTitle}>Programming Languages</h3>
          <div className="skills-grid" ref={skillsGridRef} style={skillsGrid}>
            {programmingLanguages.map((lang, index) => (
              <div key={index} style={toolBadge}>
                <span style={skillIcon}>{lang.icon}</span>
                <span style={skillName}>{lang.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Certifications Section */}
      <section style={sectionStyle}>
        <h2 style={sectionTitle}>Certifications</h2>
        <div className="certifications-grid" style={certificationsGrid}>
          {certifications.map((cert, index) => (
            <div 
              key={index} 
              style={certCard} 
              className="cert-card"
              onClick={() => window.open("https://www.linkedin.com/in/surya-pratap-singh-61a41130a", "_blank", "noopener,noreferrer")}
              role="button"
              tabIndex={0}
              aria-label={`${cert.title} - Click to view LinkedIn profile`}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  window.open("https://www.linkedin.com/in/surya-pratap-singh-61a41130a", "_blank", "noopener,noreferrer");
                }
              }}
            >
              <div style={certIconContainer}>{cert.icon}</div>
              <div style={certTitleNew}>{cert.title}</div>
              {cert.subtitle && <div style={certSubtitle}>{cert.subtitle}</div>}
            </div>
          ))}
        </div>
        <div style={certificationNote}>
          <p style={certNoteText}>For verification, please visit my <a href="https://www.linkedin.com/in/surya-pratap-singh-61a41130a" target="_blank" rel="noopener noreferrer" style={linkedInLink}>LinkedIn profile</a></p>
        </div>
      </section>

      {/* Quick Links Section */}
      <section style={sectionStyle}>
        <h2 style={sectionTitle}>Quick Links</h2>
        <div className="quick-links-grid" style={quickLinksGrid}>
          <Link to="/projects" className="quick-link-card" style={quickLinkCard}>
            <span style={quickLinkIcon}>📁</span>
            <span style={quickLinkText}>View Projects</span>
          </Link>
          <Link to="/research" className="quick-link-card" style={quickLinkCard}>
            <span style={quickLinkIcon}>🔬</span>
            <span style={quickLinkText}>Research Work</span>
          </Link>
          <Link to="/about" className="quick-link-card" style={quickLinkCard}>
            <span style={quickLinkIcon}>👤</span>
            <span style={quickLinkText}>About</span>
          </Link>
          <Link to="/resume" className="quick-link-card" style={quickLinkCard}>
            <span style={quickLinkIcon}>📄</span>
            <span style={quickLinkText}>Download Resume</span>
          </Link>
        </div>
      </section>

      {/* Floating Code Snippets Animation */}
      <div style={floatingCodeContainer}>
        {["<code>", "def secure()", "encrypt()", "hack()"].map((snippet, index) => (
          <div
            key={index}
            style={{
              ...floatingCode,
              left: `${20 + index * 25}%`,
              animationDelay: `${index * 0.5}s`,
            }}
          >
            {snippet}
          </div>
        ))}
      </div>

      <style dangerouslySetInnerHTML={{ __html: mobileStyles }} />
    </>
  );
}

// Styles
const heroContainer = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  alignItems: "center",
  gap: "clamp(2rem, 4vw, 3rem)",
  maxWidth: "1400px",
  margin: "0 auto",
  paddingTop: "clamp(60px, 8vw, 100px)",
  paddingRight: "clamp(5%, 6vw, 80px)",
  paddingBottom: "clamp(40px, 6vw, 60px)",
  paddingLeft: "clamp(5%, 6vw, 80px)",
  minHeight: "auto",
  overflowX: "hidden",
};

const textArea = {
  maxWidth: "100%",
  width: "100%",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  overflowX: "hidden",
  overflowWrap: "break-word",
  wordWrap: "break-word",
};

const imageArea = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};

const imageStyle = {
  width: "clamp(200px, 30vw, 350px)",
  height: "clamp(200px, 30vw, 350px)",
  objectFit: "cover",
  objectPosition: "center 30%",
  borderRadius: "50%",
  border: "3px solid rgba(79,209,255,0.5)",
  boxShadow: "0 0 40px rgba(79,209,255,0.4)",
};

const socialLinksContainer = {
  display: "flex",
  gap: "12px",
  marginTop: "clamp(1rem, 3vw, 1.5rem)",
  flexWrap: "wrap",
};

const socialLinkStyle = {
  display: "flex",
  alignItems: "center",
  padding: "6px 12px",
  background: "rgba(79, 209, 255, 0.1)",
  border: "1px solid rgba(79, 209, 255, 0.3)",
  borderRadius: "8px",
  color: "#4fd1ff",
  textDecoration: "none",
  transition: "all 0.3s ease",
  fontSize: "0.85rem",
};

const ctaContainer = {
  display: "flex",
  gap: "12px",
  marginTop: "clamp(1rem, 3vw, 1.5rem)",
  flexWrap: "wrap",
};

const ctaButtonPrimary = {
  padding: "12px 24px",
  background: "#4fd1ff",
  color: "#02040a",
  border: "1px solid #4fd1ff",
  borderRadius: "8px",
  textDecoration: "none",
  fontWeight: 600,
  transition: "all 0.3s ease",
  fontSize: "0.9rem",
};

const ctaButtonSecondary = {
  padding: "12px 24px",
  background: "transparent",
  color: "#4fd1ff",
  border: "1px solid rgba(79, 209, 255, 0.6)",
  borderRadius: "8px",
  textDecoration: "none",
  fontWeight: 600,
  transition: "all 0.3s ease",
  fontSize: "0.9rem",
};

const sectionStyle = {
  padding: "clamp(40px, 5vw, 60px) clamp(5%, 6vw, 80px)",
  maxWidth: "1400px",
  margin: "0 auto",
  minHeight: "auto",
};

const sectionTitle = {
  fontSize: "clamp(1.8rem, 4vw, 2.5rem)",
  color: "#4fd1ff",
  marginBottom: "clamp(1.5rem, 3vw, 2rem)",
  textAlign: "left",
  fontWeight: 700,
};

const statsGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(clamp(160px, 20vw, 200px), 1fr))",
  gap: "clamp(16px, 2vw, 24px)",
  paddingBottom: "10px",
  scrollbarWidth: "none",
  msOverflowStyle: "none",
  WebkitOverflowScrolling: "touch",
};

const statCard = {
  background: "rgba(255, 255, 255, 0.03)",
  border: "1px solid rgba(79, 209, 255, 0.3)",
  borderRadius: "16px",
  padding: "clamp(20px, 3vw, 28px) clamp(24px, 4vw, 32px)",
  textAlign: "center",
  transition: "all 0.3s ease",
  minWidth: "clamp(160px, 20vw, 200px)",
  flexShrink: 0,
  flex: "1 1 auto",
};

const statIcon = {
  fontSize: "clamp(2rem, 3vw, 2.5rem)",
  marginBottom: "clamp(8px, 1vw, 12px)",
};

const statValue = {
  fontSize: "clamp(1.8rem, 3vw, 2.2rem)",
  fontWeight: 700,
  color: "#4fd1ff",
  marginBottom: "clamp(6px, 1vw, 10px)",
};

const statLabel = {
  fontSize: "0.8rem",
  color: "#cbd5e1",
};

const statusContainer = {
  display: "flex",
  flexDirection: "column",
  gap: "12px",
  alignItems: "center",
  maxWidth: "800px",
  margin: "0 auto",
};

const statusBadge = {
  display: "flex",
  alignItems: "center",
  gap: "10px",
  padding: "12px 20px",
  background: "rgba(79, 209, 255, 0.1)",
  border: "1px solid rgba(79, 209, 255, 0.3)",
  borderRadius: "12px",
  fontSize: "0.95rem",
  color: "#4fd1ff",
};

const statusIcon = {
  fontSize: "1.5rem",
};

const statusText = {
  fontFamily: "monospace",
};

const cursorBlink = {
  animation: "blink 1s infinite",
  marginLeft: "4px",
};

const availabilityBadge = {
  display: "flex",
  alignItems: "center",
  gap: "8px",
  padding: "12px 20px",
  background: "rgba(34, 197, 94, 0.1)",
  border: "1px solid rgba(34, 197, 94, 0.3)",
  borderRadius: "8px",
  color: "#22c55e",
  fontSize: "0.95rem",
};

const availabilityDot = {
  fontSize: "0.8rem",
};

const skillsSection = {
  marginBottom: "2rem",
};

const subsectionTitle = {
  fontSize: "clamp(1.4rem, 2.5vw, 1.8rem)",
  color: "#4fd1ff",
  marginBottom: "clamp(1.2rem, 2vw, 1.5rem)",
  fontWeight: 600,
};

const skillsGrid = {
  display: "flex",
  overflowX: "auto",
  overflowY: "hidden",
  gap: "16px",
  paddingBottom: "10px",
  WebkitOverflowScrolling: "touch",
  marginLeft: 0,
  marginRight: 0,
  width: "100%",
  scrollbarWidth: "none",
  msOverflowStyle: "none",
  flex: 1,
};

const skillCard = {
  background: "rgba(255, 255, 255, 0.03)",
  border: "1px solid rgba(79, 209, 255, 0.3)",
  borderRadius: "16px",
  padding: "clamp(20px, 3vw, 24px)",
  minWidth: "clamp(240px, 25vw, 280px)",
  flexShrink: 0,
};

const skillHeader = {
  display: "flex",
  alignItems: "center",
  gap: "12px",
  marginBottom: "12px",
};

const skillIcon = {
  fontSize: "1.5rem",
};

const skillName = {
  fontSize: "1.1rem",
  fontWeight: 600,
  color: "#e8f1ff",
  wordWrap: "break-word",
  overflowWrap: "break-word",
  wordBreak: "break-word",
  lineHeight: 1.3,
};

const progressBarContainer = {
  display: "flex",
  alignItems: "center",
  gap: "12px",
};

const progressBar = {
  flex: 1,
  height: "8px",
  background: "rgba(255, 255, 255, 0.1)",
  borderRadius: "4px",
  overflow: "hidden",
};

const progressBarFill = {
  height: "100%",
  background: "linear-gradient(90deg, #4fd1ff, #22c55e)",
  borderRadius: "4px",
  transition: "width 0.5s ease",
};

const progressText = {
  fontSize: "0.85rem",
  color: "#94a3b8",
  minWidth: "40px",
  textAlign: "right",
};

const toolsGrid = {
  display: "flex",
  overflowX: "auto",
  gap: "10px",
  paddingBottom: "10px",
  WebkitOverflowScrolling: "touch",
  flexWrap: "nowrap",
  marginLeft: 0,
  marginRight: 0,
  width: "100%",
  scrollbarWidth: "none",
  msOverflowStyle: "none",
};

const securitySkillBadge = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  gap: "12px",
  padding: "20px 14px",
  background: "rgba(79, 209, 255, 0.1)",
  border: "1px solid rgba(79, 209, 255, 0.3)",
  borderRadius: "12px",
  color: "#cbd5e1",
  minWidth: "clamp(155px, 24vw, 220px)",
  maxWidth: "clamp(155px, 24vw, 220px)",
  width: "clamp(155px, 24vw, 220px)",
  flexShrink: 0,
  textAlign: "center",
  transition: "all 0.3s ease",
  overflow: "hidden",
};

const toolBadge = {
  display: "flex",
  alignItems: "center",
  gap: "8px",
  padding: "8px 14px",
  background: "rgba(79, 209, 255, 0.1)",
  border: "1px solid rgba(79, 209, 255, 0.3)",
  borderRadius: "8px",
  color: "#cbd5e1",
  fontSize: "0.85rem",
  minWidth: "fit-content",
  flexShrink: 0,
  whiteSpace: "nowrap",
};

const toolIcon = {
  fontSize: "1.2rem",
};

// Security Tools Categories Styles
const toolsCategoriesContainer = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
  gap: "24px",
  marginTop: "20px",
};

const toolCategorySection = {
  background: "linear-gradient(135deg, rgba(79, 209, 255, 0.08) 0%, rgba(79, 209, 255, 0.03) 100%)",
  border: "1px solid rgba(79, 209, 255, 0.25)",
  borderRadius: "14px",
  padding: "24px",
  transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
  boxShadow: "0 8px 32px rgba(79, 209, 255, 0.1)",
  backdropFilter: "blur(10px)",
  cursor: "default",
  position: "relative",
  overflow: "hidden",
};

// Add pseudo-element glow effect via CSS
const toolCategorySectionHover = {
  ...toolCategorySection,
  background: "linear-gradient(135deg, rgba(79, 209, 255, 0.12) 0%, rgba(79, 209, 255, 0.06) 100%)",
  border: "1px solid rgba(79, 209, 255, 0.35)",
  boxShadow: "0 12px 48px rgba(79, 209, 255, 0.15), inset 0 1px 0 rgba(79, 209, 255, 0.1)",
  transform: "translateY(-2px)",
};

const categoryHeader = {
  display: "flex",
  alignItems: "center",
  gap: "14px",
  marginBottom: "18px",
  paddingBottom: "14px",
  borderBottom: "2px solid rgba(79, 209, 255, 0.15)",
};

const categoryIcon = {
  fontSize: "2rem",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  filter: "drop-shadow(0 2px 8px rgba(79, 209, 255, 0.2))",
};

const categoryTitle = {
  fontSize: "1.15rem",
  fontWeight: 700,
  color: "#4fd1ff",
  margin: 0,
  letterSpacing: "0.5px",
};

const toolsGridCategory = {
  display: "flex",
  flexWrap: "wrap",
  gap: "10px",
};

const toolTag = {
  padding: "10px 16px",
  background: "linear-gradient(135deg, rgba(79, 209, 255, 0.15) 0%, rgba(79, 209, 255, 0.08) 100%)",
  border: "1.5px solid rgba(79, 209, 255, 0.4)",
  borderRadius: "20px",
  color: "#cbd5e1",
  fontSize: "0.9rem",
  fontWeight: 600,
  whiteSpace: "nowrap",
  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  cursor: "default",
  letterSpacing: "0.3px",
};

const certificationsGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
  gap: "24px",
  marginBottom: "32px",
  maxWidth: "100%",
};

const certCard = {
  background: "linear-gradient(135deg, rgba(79, 209, 255, 0.08) 0%, rgba(79, 209, 255, 0.03) 100%)",
  border: "1.5px solid rgba(79, 209, 255, 0.25)",
  borderRadius: "16px",
  padding: "32px 24px",
  textAlign: "center",
  transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
  cursor: "pointer",
  position: "relative",
  overflow: "hidden",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  minHeight: "240px",
};

const certIconContainer = {
  fontSize: "3rem",
  marginBottom: "16px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  filter: "drop-shadow(0 2px 8px rgba(79, 209, 255, 0.15))",
  transition: "all 0.3s ease",
};

const certTitleNew = {
  fontSize: "1.15rem",
  fontWeight: 700,
  color: "#4fd1ff",
  marginBottom: "12px",
  lineHeight: "1.4",
};

const certSubtitle = {
  fontSize: "0.85rem",
  color: "#94a3b8",
  lineHeight: "1.4",
  fontWeight: 500,
};

const certificationNote = {
  textAlign: "center",
  marginTop: "24px",
  padding: "16px",
  background: "rgba(79, 209, 255, 0.05)",
  border: "1px solid rgba(79, 209, 255, 0.15)",
  borderRadius: "12px",
  margin: "24px auto 0 auto",
  maxWidth: "800px",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};

const certNoteText = {
  fontSize: "0.9rem",
  color: "#cbd5e1",
  margin: 0,
  textAlign: "center",
};

const linkedInLink = {
  color: "#4fd1ff",
  textDecoration: "none",
  fontWeight: 600,
  transition: "all 0.3s ease",
};

const certBadge = {
  background: "rgba(255, 255, 255, 0.03)",
  border: "1px solid rgba(79, 209, 255, 0.3)",
  borderRadius: "16px",
  padding: "clamp(20px, 3vw, 28px) clamp(24px, 4vw, 32px)",
  textAlign: "center",
  transition: "all 0.3s ease",
  cursor: "pointer",
  minWidth: "clamp(180px, 22vw, 220px)",
  flexShrink: 0,
  width: "clamp(180px, 22vw, 220px)",
};

const certIcon = {
  fontSize: "clamp(2.2rem, 3vw, 2.8rem)",
  marginBottom: "clamp(10px, 1.5vw, 14px)",
};

const certName = {
  fontSize: "clamp(1.3rem, 2vw, 1.6rem)",
  fontWeight: 700,
  color: "#4fd1ff",
  marginBottom: "clamp(8px, 1vw, 12px)",
};

const certFullName = {
  fontSize: "0.75rem",
  color: "#94a3b8",
};

const featuredProjectCard = {
  background: "rgba(255, 255, 255, 0.03)",
  border: "1px solid rgba(79, 209, 255, 0.3)",
  borderRadius: "16px",
  padding: "clamp(28px, 4vw, 36px) clamp(32px, 5vw, 40px)",
  maxWidth: "900px",
  margin: "0 auto",
};

const featuredProjectHeader = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "16px",
  flexWrap: "wrap",
  gap: "16px",
};

const featuredProjectTitle = {
  fontSize: "clamp(1.6rem, 3vw, 2rem)",
  color: "#4fd1ff",
  margin: 0,
  fontWeight: 700,
};

const viewAllLink = {
  color: "#4fd1ff",
  textDecoration: "none",
  fontSize: "0.95rem",
  transition: "all 0.3s ease",
};

const featuredProjectDesc = {
  fontSize: "0.95rem",
  color: "#cbd5e1",
  marginBottom: "16px",
  lineHeight: "1.6",
};

const featuredProjectTech = {
  display: "flex",
  flexWrap: "wrap",
  gap: "8px",
};

const techTag = {
  padding: "6px 12px",
  background: "rgba(79, 209, 255, 0.1)",
  border: "1px solid rgba(79, 209, 255, 0.3)",
  borderRadius: "6px",
  color: "#4fd1ff",
  fontSize: "0.85rem",
};

const quickLinksGrid = {
  display: "flex",
  overflowX: "auto",
  gap: "clamp(16px, 2vw, 24px)",
  paddingBottom: "10px",
  scrollbarWidth: "none",
  msOverflowStyle: "none",
  WebkitOverflowScrolling: "touch",
};

const quickLinkCard = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "clamp(12px, 2vw, 16px)",
  padding: "clamp(20px, 3vw, 28px) clamp(24px, 4vw, 32px)",
  background: "rgba(255, 255, 255, 0.03)",
  border: "1px solid rgba(79, 209, 255, 0.3)",
  borderRadius: "16px",
  textDecoration: "none",
  color: "#cbd5e1",
  transition: "all 0.3s ease",
  minWidth: "clamp(160px, 20vw, 200px)",
  flexShrink: 0,
  width: "clamp(160px, 85vw, 200px)",
};

const quickLinkIcon = {
  fontSize: "clamp(2.2rem, 3vw, 2.8rem)",
};

const quickLinkText = {
  fontSize: "0.9rem",
  fontWeight: 600,
  color: "#4fd1ff",
};

const floatingCodeContainer = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  pointerEvents: "none",
  zIndex: 1,
  overflow: "hidden",
};

const floatingCode = {
  position: "absolute",
  color: "rgba(79, 209, 255, 0.1)",
  fontSize: "0.9rem",
  fontFamily: "monospace",
  animation: "float 20s infinite ease-in-out",
  top: "20%",
};

// Mobile responsive styles
const mobileStyles = `
  @keyframes blink {
    0%, 50% { opacity: 1; }
    51%, 100% { opacity: 0; }
  }

  @keyframes float {
    0%, 100% { transform: translateY(0) rotate(0deg); opacity: 0.1; }
    25% { transform: translateY(-20px) rotate(5deg); opacity: 0.2; }
    50% { transform: translateY(-40px) rotate(-5deg); opacity: 0.15; }
    75% { transform: translateY(-20px) rotate(3deg); opacity: 0.2; }
  }

  /* Hide scrollbars for all horizontal scroll containers on all devices */
  .stats-grid::-webkit-scrollbar,
  .skills-grid::-webkit-scrollbar,
  .tools-grid::-webkit-scrollbar,
  .certifications-grid::-webkit-scrollbar,
  .quick-links-grid::-webkit-scrollbar {
    display: none;
  }

  .stats-grid,
  .skills-grid,
  .tools-grid,
  .certifications-grid,
  .quick-links-grid {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }

  @media (max-width: 768px) {
    .home-hero {
      grid-template-columns: 1fr !important;
      text-align: left !important;
      gap: 2rem !important;
      padding: 30px 16px 20px 16px !important;
      overflow-x: hidden !important;
    }

    .home-hero .text-area {
      text-align: left !important;
      align-items: flex-start !important;
      word-wrap: break-word !important;
      overflow-wrap: break-word !important;
      overflow-x: hidden !important;
    }

    .home-hero h1 {
      text-align: left !important;
      width: 100% !important;
      word-wrap: break-word !important;
      overflow-wrap: break-word !important;
      word-break: break-word !important;
      font-size: clamp(1.8rem, 5vw, 2.5rem) !important;
      margin: 0 !important;
    }

    .home-hero p {
      text-align: left !important;
      width: 100% !important;
      word-wrap: break-word !important;
      overflow-wrap: break-word !important;
      word-break: break-word !important;
      font-size: clamp(0.9rem, 2.5vw, 1rem) !important;
      line-height: 1.5 !important;
    }

    .home-image-area {
      order: -1 !important;
    }

    .home-image-area img {
      object-position: center 25% !important;
    }

    /* Horizontal scroll layouts on mobile - single row */
    .certifications-grid,
    .quick-links-grid {
      display: flex !important;
      overflow-x: auto !important;
      -webkit-overflow-scrolling: touch !important;
      scrollbar-width: none !important;
      -ms-overflow-style: none !important;
      gap: 12px !important;
      padding-left: 16px !important;
      padding-right: 16px !important;
      margin-left: -16px !important;
      margin-right: -16px !important;
    }

    .certifications-grid::-webkit-scrollbar,
    .quick-links-grid::-webkit-scrollbar {
      display: none !important;
    }

    .cert-card,
    .quick-link-card {
      width: calc(85vw - 32px) !important;
      min-width: calc(85vw - 32px) !important;
      max-width: calc(85vw - 32px) !important;
      flex-shrink: 0 !important;
    }
    
    .stats-grid {
      display: flex !important;
      overflow-x: auto !important;
      -webkit-overflow-scrolling: touch !important;
      scrollbar-width: none !important;
      -ms-overflow-style: none !important;
    }

    .stats-grid::-webkit-scrollbar {
      display: none !important;
    }
    

    .cta-container {
      flex-direction: column;
    }

    .cta-container a {
      width: 100%;
      text-align: left;
    }

    .social-links-container {
      justify-content: flex-start;
    }

    /* Security Skills on Mobile */
    .skills-grid {
      gap: 12px !important;
    }

    /* Override section padding for very small screens */
    section {
      padding-left: 16px !important;
      padding-right: 16px !important;
      overflow-x: hidden !important;
    }
  }

  @media (max-width: 480px) {
    html, body {
      overflow-x: hidden !important;
      width: 100% !important;
      max-width: 100% !important;
    }

    section {
      padding-left: 16px !important;
      padding-right: 16px !important;
      overflow-x: hidden !important;
      width: 100% !important;
      max-width: 100% !important;
    }

    .home-hero {
      padding: 30px 16px 20px 16px !important;
      overflow-x: hidden !important;
      width: 100% !important;
    }

    .home-hero h1 {
      font-size: 1.8rem !important;
      margin: 0 !important;
      line-height: 1.2 !important;
    }

    .home-hero p {
      font-size: 0.9rem !important;
      line-height: 1.5 !important;
      margin: 0 !important;
    }

    h2 {
      font-size: 1.5rem !important;
    }

    h3 {
      font-size: 1.2rem !important;
    }

    /* Ensure all text containers don't overflow */
    * {
      box-sizing: border-box;
      max-width: 100% !important;
    }
  }

  @media (min-width: 769px) {
    .home-hero {
      align-items: center;
    }

    .home-hero h1 {
      white-space: nowrap;
      font-size: clamp(2.5rem, 5vw, 3.5rem);
    }

    .home-hero p {
      font-size: clamp(1rem, 1.5vw, 1.15rem);
      line-height: 1.7;
    }

    .home-image-area img {
      object-position: center 20% !important;
    }

    /* Desktop: Keep grid layouts */
    .certifications-grid {
      display: grid !important;
      grid-template-columns: repeat(auto-fit, minmax(clamp(180px, 22vw, 220px), 1fr)) !important;
      overflow-x: visible !important;
      padding-left: 0 !important;
      padding-right: 0 !important;
    }

    .quick-links-grid {
      display: grid !important;
      grid-template-columns: repeat(auto-fit, minmax(clamp(160px, 20vw, 200px), 1fr)) !important;
      overflow-x: visible !important;
      padding-left: 0 !important;
      padding-right: 0 !important;
    }

    .cert-card,
    .quick-link-card {
      width: auto !important;
      min-width: auto !important;
      max-width: none !important;
    }

    .cert-card:hover {
      transform: translateY(-5px);
      border-color: rgba(79, 209, 255, 0.5);
      box-shadow: 0 8px 25px rgba(79, 209, 255, 0.2);
    }

    .quick-link-card:hover {
      transform: translateY(-5px);
      border-color: rgba(79, 209, 255, 0.5);
      box-shadow: 0 8px 25px rgba(79, 209, 255, 0.2);
    }

    .social-link-style:hover {
      background: rgba(79, 209, 255, 0.2);
      transform: translateY(-2px);
    }

    .cta-button-primary:hover {
      background: transparent;
      color: #4fd1ff;
      box-shadow: 0 0 25px rgba(79, 209, 255, 0.5);
    }

    .cta-button-secondary:hover {
      background: #4fd1ff;
      color: #02040a;
      box-shadow: 0 0 25px rgba(79, 209, 255, 0.5);
    }
  }

  .home-hero.section {
    padding: 0;
  }

  /* Better spacing for all sections */
  section {
    padding-top: clamp(40px, 6vw, 60px) !important;
    padding-bottom: clamp(40px, 6vw, 60px) !important;
  }
`;
