import resumePDF from "../assets/Surya resume.pdf";

export default function Resume() {
  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = resumePDF;
    link.download = "Surya resume.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleViewOnline = () => {
    window.open(resumePDF, "_blank");
  };

  return (
    <section className="section">
      <h2>Resume</h2>

      <p>
        Download my resume for a detailed overview of my skills, projects, certifications, and research work in cybersecurity.
      </p>

      <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", marginTop: 20 }}>
        <button className="btn" onClick={handleDownload}>
          Download Resume
        </button>
        <button className="btn" style={{ background: "rgba(79, 209, 255, 0.15)", border: "1px solid rgba(79, 209, 255, 0.4)" }} onClick={handleViewOnline}>
          View Resume Online
        </button>
      </div>
    </section>
  );
}
