import React from "react";

export default function Research() {
  return (
    <section style={pageWrapper}>
      <div style={container}>
        {/* Header */}
        <div style={header}>
          <h1 style={title}>Research Work</h1>
        </div>

        {/* Research Title */}
        <div style={researchHeader}>
          <h2 style={researchTitle}>
            Security Evaluation of Hybrid Post-Quantum Cryptographic Systems Under Real-World Attack Scenarios
          </h2>
          <p style={researchDescription}>
            This research focuses on evaluating hybrid cryptographic systems that combine classical encryption with post-quantum algorithms. The goal is to analyze their performance, security, and practical feasibility under real-world attack scenarios, with emphasis on implementation challenges and system-level behavior.
          </p>
        </div>

        {/* Research Sections */}
        <div style={sectionsContainer}>
          {/* Objective Section */}
          <div style={researchSection}>
            <h3 style={sectionHeading}>Objective</h3>
            <ul style={bulletList}>
              <li>Analyze hybrid encryption models combining classical and post-quantum algorithms</li>
              <li>Evaluate security and performance under realistic attack conditions</li>
            </ul>
          </div>

          {/* Approach Section */}
          <div style={researchSection}>
            <h3 style={sectionHeading}>Approach</h3>
            <ul style={bulletList}>
              <li>Implement hybrid models (e.g., AES + post-quantum key exchange)</li>
              <li>Simulate real-world attack scenarios and measure system performance</li>
              <li>Analyze trade-offs between security, latency, and computational overhead</li>
            </ul>
          </div>

          {/* Current Status Section */}
          <div style={researchSection}>
            <h3 style={sectionHeading}>Current Status</h3>
            <p style={statusText}>
              Research in progress — currently focused on implementation, testing, and performance evaluation.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* -------- STYLES -------- */

const pageWrapper = {
  padding: "clamp(80px, 12vw, 110px) clamp(5%, 6vw, 80px) clamp(60px, 8vw, 80px)",
  display: "flex",
  justifyContent: "center",
  minHeight: "100vh",
};

const container = {
  width: "100%",
  maxWidth: "1000px",
  display: "flex",
  flexDirection: "column",
  gap: "clamp(40px, 6vw, 60px)",
};

const header = {
  textAlign: "center",
};

const title = {
  fontSize: "clamp(2rem, 5vw, 3rem)",
  color: "#4fd1ff",
  fontWeight: 800,
  letterSpacing: "0.5px",
};

const researchHeader = {
  background: "rgba(255,255,255,0.02)",
  border: "1px solid rgba(79,209,255,0.25)",
  borderRadius: "18px",
  padding: "clamp(28px, 4vw, 36px) clamp(24px, 3vw, 40px)",
  display: "flex",
  flexDirection: "column",
  gap: "clamp(14px, 2vw, 18px)",
};

const researchTitle = {
  fontSize: "clamp(1.2rem, 2.5vw, 1.5rem)",
  color: "#e5e7eb",
  fontWeight: 700,
  lineHeight: 1.5,
};

const researchDescription = {
  fontSize: "clamp(0.95rem, 1.8vw, 1rem)",
  lineHeight: 1.75,
  color: "#cbd5e1",
};

const sectionsContainer = {
  display: "grid",
  gridTemplateColumns: "1fr",
  gap: "clamp(24px, 4vw, 32px)",
};

const researchSection = {
  background: "rgba(255,255,255,0.03)",
  border: "1px solid rgba(79,209,255,0.3)",
  borderRadius: "14px",
  padding: "clamp(20px, 3vw, 28px) clamp(20px, 2.5vw, 32px)",
};

const sectionHeading = {
  fontSize: "clamp(1rem, 2vw, 1.2rem)",
  color: "#4fd1ff",
  fontWeight: 700,
  marginBottom: "clamp(12px, 2vw, 16px)",
};

const bulletList = {
  margin: 0,
  paddingLeft: "1.5rem",
  color: "#e5e7eb",
  fontSize: "clamp(0.9rem, 1.7vw, 0.95rem)",
  lineHeight: 1.7,
};

const statusText = {
  color: "#e5e7eb",
  fontSize: "clamp(0.95rem, 1.8vw, 1rem)",
  lineHeight: 1.75,
  margin: 0,
};
