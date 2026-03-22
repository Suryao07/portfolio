import { BrowserRouter, Routes, Route } from "react-router-dom";
import ParticleBackground from "./components/ParticleBackground";
import CustomCursor from "./components/CustomCursor";
import Navbar from "./components/Navbar";

import Home from "./pages/Home";
import About from "./pages/About";
import Projects from "./pages/Projects";
import Research from "./pages/Research";
import Resume from "./pages/Resume";

export default function App() {
  return (
    <BrowserRouter>
      {/* 🌌 Particle Background */}
      <ParticleBackground />

      {/* 🎯 Custom Cursor */}
      <CustomCursor />

      {/* 🧭 Navigation */}
      <Navbar />

      {/* 📄 Pages */}
      <div style={{ position: "relative", zIndex: 2 }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/research" element={<Research />} />
          <Route path="/resume" element={<Resume />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
