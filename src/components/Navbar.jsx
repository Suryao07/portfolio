import { NavLink } from "react-router-dom";
import { useState, useEffect } from "react";

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
      if (window.innerWidth > 768) {
        setIsMobileMenuOpen(false);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const linkStyle = ({ isActive }) => ({
    color: isActive ? "#4fd1ff" : "#cbd5e1",
    textDecoration: "none",
    fontWeight: 600,
    letterSpacing: 1,
    transition: "0.2s ease",
    padding: isMobile ? "12px 20px" : "8px 16px",
    borderRadius: isMobile ? "6px" : "0",
    display: "flex",
    alignItems: "center",
    width: isMobile ? "100%" : "auto",
    lineHeight: "1",
    height: "100%",
  });

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <nav
      style={{
        position: "sticky",
        top: 0,
        zIndex: 1001,
        background: "rgba(2,7,18,0.95)",
        backdropFilter: "blur(6px)",
        borderBottom: "1px solid rgba(255,255,255,0.05)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: isMobile ? "16px 20px" : "18px clamp(20px, 2vw, 40px)",
          maxWidth: "1600px",
          margin: "0 auto",
          gap: "20px",
        }}
      >
        {/* Logo */}
        <div
          style={{
            color: "#4fd1ff",
            fontWeight: 800,
            fontSize: isMobile ? "clamp(18px, 4vw, 20px)" : "clamp(20px, 2vw, 24px)",
            letterSpacing: 1.5,
            lineHeight: "1.2",
            display: "flex",
            alignItems: "center",
            height: "100%",
          }}
        >
          Surya0x.dev
        </div>

        {/* Desktop Links */}
        {!isMobile && (
          <div
            style={{
              display: "flex",
              gap: "clamp(16px, 2vw, 24px)",
              fontSize: "clamp(14px, 1.5vw, 16px)",
              alignItems: "center",
              lineHeight: "1",
              height: "100%",
            }}
          >
            <NavLink to="/" style={linkStyle}>
              Home
            </NavLink>

            <NavLink to="/about" style={linkStyle}>
              About
            </NavLink>

            <NavLink to="/projects" style={linkStyle}>
              Projects
            </NavLink>

            <NavLink to="/research" style={linkStyle}>
              Research
            </NavLink>

            <NavLink to="/resume" style={linkStyle}>
              Resume
            </NavLink>
          </div>
        )}

        {/* Mobile Menu Button */}
        {isMobile && (
          <button
            onClick={toggleMobileMenu}
            style={{
              background: "none",
              border: "none",
              color: "#cbd5e1",
              fontSize: "20px",
              cursor: "pointer",
              padding: "8px",
              borderRadius: "4px",
              transition: "0.2s ease",
              minHeight: "44px",
              minWidth: "44px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            aria-label="Toggle mobile menu"
          >
            {isMobileMenuOpen ? "✕" : "☰"}
          </button>
        )}
      </div>

      {/* Mobile Menu */}
      {isMobile && isMobileMenuOpen && (
        <div
          style={{
            background: "rgba(2,7,18,0.98)",
            borderTop: "1px solid rgba(255,255,255,0.05)",
            padding: "20px",
            animation: "slideDown 0.3s ease",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <NavLink to="/" style={linkStyle} onClick={closeMobileMenu}>
              Home
            </NavLink>

            <NavLink to="/about" style={linkStyle} onClick={closeMobileMenu}>
              About
            </NavLink>

            <NavLink to="/projects" style={linkStyle} onClick={closeMobileMenu}>
              Projects
            </NavLink>

            <NavLink to="/research" style={linkStyle} onClick={closeMobileMenu}>
              Research
            </NavLink>

            <NavLink to="/resume" style={linkStyle} onClick={closeMobileMenu}>
              Resume
            </NavLink>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </nav>
  );
}
