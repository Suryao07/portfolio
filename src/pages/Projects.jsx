import { useState, useEffect } from "react";
import React from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeSanitize from 'rehype-sanitize';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [currentPath, setCurrentPath] = useState("");
  const [repositoryContents, setRepositoryContents] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileContent, setFileContent] = useState("");
  const [isLoadingFile, setIsLoadingFile] = useState(false);
  const [readmeContent, setReadmeContent] = useState("");
  const [viewMode, setViewMode] = useState("files"); // "files" or "readme"

  // GitHub repositories to display
  const repositories = [
    "Suryao07/DomainScanner",
    "Suryao07/Ceaser-chiper-",
    "Suryao07/EmailScrapper"
  ];

  // Fallback data for when API fails
  const fallbackProjects = [
    {
      id: 1,
      name: "DomainScanner",
      description: "A domain scanning tool for cybersecurity research",
      language: "Python",
      stars: 0,
      forks: 0,
      url: "https://github.com/Suryao07/DomainScanner",
      updatedAt: new Date().toLocaleDateString(),
      createdAt: new Date().toLocaleDateString(),
      topics: ["security", "scanning", "python"],
      license: null,
      size: 1024,
      defaultBranch: "main"
    },
    {
      id: 2,
      name: "Ceaser-ciper-",
      description: "Caesar cipher implementation for encryption/decryption",
      language: "Python",
      stars: 0,
      forks: 0,
      url: "https://github.com/Suryao07/Ceaser-chiper-",
      updatedAt: new Date().toLocaleDateString(),
      createdAt: new Date().toLocaleDateString(),
      topics: ["cryptography", "cipher", "python"],
      license: null,
      size: 512,
      defaultBranch: "main"
    },
    {
      id: 3,
      name: "EmailScrapper",
      description: "Email scraping utility for research purposes",
      language: "Python",
      stars: 0,
      forks: 0,
      url: "https://github.com/Suryao07/EmailScrapper",
      updatedAt: new Date().toLocaleDateString(),
      createdAt: new Date().toLocaleDateString(),
      topics: ["scraping", "email", "python"],
      license: null,
      size: 768,
      defaultBranch: "main"
    }
  ];

  // GitHub API headers (add token to avoid rate limits)
  const getGitHubHeaders = () => {
    const token = import.meta.env.VITE_GITHUB_TOKEN;

    // Debug: Check if token is loaded (only in development)
    if (import.meta.env.DEV && !token) {
      console.warn('⚠️ VITE_GITHUB_TOKEN not found in environment variables. Make sure:');
      console.warn('1. .env file exists in project root');
      console.warn('2. .env contains: VITE_GITHUB_TOKEN=your_token_here');
      console.warn('3. Dev server was restarted after creating .env');
    }

    return token ? {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/vnd.github.v3+json'
    } : {
      'Accept': 'application/vnd.github.v3+json'
    };
  };

  // Security: Validate URLs to prevent XSS attacks
  const isValidUrl = (url) => {
    if (!url) return false;
    try {
      const urlObj = new URL(url, window.location.href);
      // Only allow http, https, and relative paths
      return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
    } catch {
      // Check for relative paths and fragments
      return url.startsWith('/') || url.startsWith('#');
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  // Horizontal mouse wheel scrolling for projects horizontal scroll
  useEffect(() => {
    if (loading) return; // Wait for projects to load

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

    // Store handler reference for cleanup
    let wheelHandler = null;
    let projectsScrollContainer = null;

    const attachWheelHandler = () => {
      projectsScrollContainer = document.querySelector('.projects-horizontal-scroll');

      if (projectsScrollContainer) {
        wheelHandler = (e) => handleWheel(e, projectsScrollContainer);
        projectsScrollContainer.addEventListener('wheel', wheelHandler, { passive: false });
      }
    };

    // Attach after a short delay to ensure DOM is ready
    const timeoutId = setTimeout(attachWheelHandler, 100);

    // Cleanup function
    return () => {
      clearTimeout(timeoutId);
      if (projectsScrollContainer && wheelHandler) {
        projectsScrollContainer.removeEventListener('wheel', wheelHandler);
      }
    };
  }, [loading, projects]);

  const openProjectModal = async (project) => {
    console.log('Opening project modal for:', project.name);
    setSelectedProject(project);
    setCurrentPath("");
    setSelectedFile(null);
    setFileContent("");
    setReadmeContent("");
    setViewMode("files");
    setShowModal(true);

    // Fetch initial repository contents
    await fetchRepositoryContents(project, "");
  };

  const closeProjectModal = () => {
    setSelectedProject(null);
    setShowModal(false);
    setCurrentPath("");
    setRepositoryContents([]);
    setSelectedFile(null);
    setFileContent("");
    setReadmeContent("");
    setIsLoadingFile(false);
  };

  const fetchRepositoryContents = async (project, path = "") => {
    try {
      const apiUrl = `https://api.github.com/repos/${project.name.includes('/') ? project.name : project.url.split('/').slice(-2).join('/')}/contents/${path}`;
      const response = await fetch(apiUrl, {
        headers: getGitHubHeaders()
      });

      if (!response.ok) {
        if (response.status === 403) {
          const resetTime = response.headers.get('X-RateLimit-Reset');
          const resetDate = resetTime ? new Date(parseInt(resetTime) * 1000) : null;
          const resetMessage = resetDate ? `Rate limit resets at ${resetDate.toLocaleTimeString()}` : 'Rate limit exceeded';
          throw new Error(`GitHub API rate limit exceeded. ${resetMessage}.`);
        }
        throw new Error(`Failed to fetch contents: ${response.status} ${response.statusText}`);
      }

      const contents = await response.json();
      console.log('Repository contents loaded:', contents.length, 'items');
      console.log('Sample file object:', contents.find(item => item.type === 'file'));

      // Sort: folders first, then files alphabetically
      const sortedContents = contents.sort((a, b) => {
        if (a.type !== b.type) {
          return a.type === 'dir' ? -1 : 1;
        }
        return a.name.localeCompare(b.name);
      });

      console.log('Sorted contents:', sortedContents.slice(0, 5).map(item => ({ name: item.name, type: item.type })));
      setRepositoryContents(sortedContents);

      // Try to fetch README if at root
      if (!path) {
        const readmeFile = contents.find(file =>
          file.name.toLowerCase().startsWith('readme') &&
          (file.name.toLowerCase().endsWith('.md') || file.name.toLowerCase().endsWith('.txt'))
        );

        if (readmeFile) {
          const response = await fetch(readmeFile.download_url);
          const content = await response.text();
          // Store raw markdown - ReactMarkdown will safely render it with sanitization
          setReadmeContent(content);
        }
      }
    } catch (error) {
      console.error("Error fetching repository contents:", error);
      setRepositoryContents([]);
    }
  };

  const fetchFileContent = async (file) => {
    try {
      setIsLoadingFile(true);
      setFileContent(""); // Clear previous content
      setSelectedFile(file); // Set selected file immediately for UI feedback
      
      console.log('Fetching file content for:', file.name);
      console.log('File object:', file);
      console.log('Selected project:', selectedProject);

      // Try download_url first (provided by GitHub API)
      let fileUrl = file.download_url;
      
      // If no download_url, construct it from repository info
      if (!fileUrl && selectedProject) {
        // Get repository path from project
        const repoPath = selectedProject.url.split('github.com/')[1];
        const filePath = currentPath ? `${currentPath}/${file.name}` : file.name;
        fileUrl = `https://raw.githubusercontent.com/${repoPath}/${selectedProject.defaultBranch || 'main'}/${filePath}`;
      }

      // Last resort: try to construct from file.url
      if (!fileUrl && file.url) {
        const apiUrl = file.url;
        // Extract path from API URL: https://api.github.com/repos/owner/repo/contents/path
        const match = apiUrl.match(/\/repos\/([^\/]+\/[^\/]+)\/contents\/(.+)/);
        if (match) {
          const [, repoPath, filePath] = match;
          fileUrl = `https://raw.githubusercontent.com/${repoPath}/${selectedProject?.defaultBranch || 'main'}/${filePath}`;
        }
      }

      console.log('Final file URL:', fileUrl);

      if (!fileUrl) {
        throw new Error('Could not determine file URL');
      }

      // Try fetching from GitHub API first (supports authentication better)
      let response;
      let content;

      // If we have the file's API URL, try using GitHub API with ?ref parameter
      if (file.url && file.url.includes('/contents/')) {
        try {
          console.log('Trying GitHub API URL:', file.url);
          response = await fetch(file.url, {
            headers: getGitHubHeaders()
          });
          
          if (response.ok) {
            const fileData = await response.json();
            // GitHub API returns base64 encoded content for files
            if (fileData.content && fileData.encoding === 'base64') {
              content = atob(fileData.content.replace(/\n/g, ''));
              console.log('Got content from GitHub API (base64 decoded)');
            } else if (fileData.content) {
              content = fileData.content;
            }
          }
        } catch (apiError) {
          console.log('GitHub API fetch failed, trying raw URL:', apiError);
        }
      }

      // Fallback to raw URL if API didn't work
      if (!content) {
        console.log('Fetching from raw URL:', fileUrl);
        response = await fetch(fileUrl, {
          headers: getGitHubHeaders()
        });

        console.log('Response status:', response.status);

        if (!response.ok) {
          throw new Error(`Failed to fetch file content: ${response.status} ${response.statusText}`);
        }

        content = await response.text();
      }
      console.log('File content length:', content.length);
      console.log('File content preview:', content.substring(0, 100));

      setFileContent(content);
      setSelectedFile(file);
      setIsLoadingFile(false);
      console.log('File content set, selectedFile:', file.name, 'Content length:', content.length);
    } catch (error) {
      console.error("Error fetching file content:", error);
      setFileContent("Error loading file content: " + error.message);
      setSelectedFile(file); // Still set selected file so UI shows it's selected
      setIsLoadingFile(false);
    }
  };

  const navigateToPath = async (path) => {
    setCurrentPath(path);
    setSelectedFile(null);
    setFileContent("");
    setIsLoadingFile(false);
    await fetchRepositoryContents(selectedProject, path);
  };

  const getFileIcon = (file) => {
    if (file.type === 'dir') return '📁';

    const ext = file.name.split('.').pop().toLowerCase();
    const iconMap = {
      'js': '🟨', 'jsx': '⚛️', 'ts': '🔷', 'tsx': '⚛️', 'py': '🐍',
      'java': '☕', 'cpp': '🔧', 'c': '🔧', 'html': '🌐', 'css': '🎨',
      'md': '📝', 'txt': '📄', 'json': '📋', 'xml': '📋', 'yaml': '📋',
      'yml': '📋', 'sh': '⚡', 'bat': '⚡', 'ps1': '⚡', 'sql': '🗄️',
      'png': '🖼️', 'jpg': '🖼️', 'jpeg': '🖼️', 'gif': '🖼️', 'svg': '🖼️'
    };
    return iconMap[ext] || '📄';
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const detectLanguage = (filename) => {
    const ext = filename.split('.').pop().toLowerCase();
    const langMap = {
      'js': 'javascript',
      'jsx': 'jsx',
      'ts': 'typescript',
      'tsx': 'tsx',
      'py': 'python',
      'java': 'java',
      'cpp': 'cpp',
      'c': 'c',
      'cs': 'csharp',
      'php': 'php',
      'rb': 'ruby',
      'go': 'go',
      'rs': 'rust',
      'swift': 'swift',
      'kt': 'kotlin',
      'scala': 'scala',
      'sh': 'bash',
      'bash': 'bash',
      'zsh': 'bash',
      'fish': 'bash',
      'ps1': 'powershell',
      'sql': 'sql',
      'html': 'html',
      'xml': 'xml',
      'css': 'css',
      'scss': 'scss',
      'sass': 'sass',
      'less': 'less',
      'json': 'json',
      'yaml': 'yaml',
      'yml': 'yaml',
      'md': 'markdown',
      'dockerfile': 'dockerfile',
      'makefile': 'makefile'
    };
    return langMap[ext] || 'text';
  };

  const renderFileContent = (content, filename) => {
    console.log('renderFileContent called with:', { content: content ? content.substring(0, 50) + '...' : 'null', filename });

    if (!content) return "Loading file content...";

    const language = detectLanguage(filename);
    console.log('Rendering file:', filename, 'Language:', language);

    // For text/markdown files, just show as plain text
    if (language === 'markdown' || language === 'text' || filename.toLowerCase().endsWith('.txt')) {
      return (
        <pre style={{
          margin: 0,
          padding: '20px',
          background: '#0d1117',
          fontFamily: 'Monaco, "Courier New", monospace',
          fontSize: '14px',
          lineHeight: '1.5',
          whiteSpace: 'pre-wrap',
          wordWrap: 'break-word',
          color: '#e8f1ff',
          borderRadius: '6px'
        }}>
          {content}
        </pre>
      );
    }

    // For code files, add basic syntax highlighting
    return (
      <div style={{
        margin: 0,
        padding: '20px',
        background: '#0d1117',
        borderRadius: '6px',
        fontFamily: 'Monaco, "Courier New", monospace',
        fontSize: '14px',
        lineHeight: '1.5',
        color: '#e8f1ff',
        overflow: 'auto'
      }}>
        <pre style={{
          margin: 0,
          whiteSpace: 'pre',
          wordWrap: 'break-word'
        }}>
          {content.split('\n').map((line, index) => (
            <div key={index} style={{ display: 'flex', minHeight: '1.5em' }}>
              <span style={{
                color: '#6b7280',
                marginRight: '16px',
                userSelect: 'none',
                minWidth: '40px',
                textAlign: 'right'
              }}>
                {index + 1}
              </span>
              <span style={{ flex: 1 }}>
                {highlightCodeLine(line, language)}
              </span>
            </div>
          ))}
        </pre>
      </div>
    );
  };

  const highlightCodeLine = (line, language) => {
    // Basic syntax highlighting for common patterns
    const patterns = {
      javascript: [
        { regex: /\b(function|const|let|var|if|else|for|while|return|class|import|export)\b/g, color: '#c792ea' }, // keywords
        { regex: /(["'`])(.*?)\1/g, color: '#c3e88d' }, // strings
        { regex: /\/\/.*$/gm, color: '#546e7a' }, // comments
        { regex: /\/\*[\s\S]*?\*\//g, color: '#546e7a' }, // multi-line comments
        { regex: /\b\d+\.?\d*\b/g, color: '#f78c6c' }, // numbers
      ],
      python: [
        { regex: /\b(def|class|if|elif|else|for|while|return|import|from|try|except|with)\b/g, color: '#c792ea' },
        { regex: /(["'`])(.*?)\1/g, color: '#c3e88d' },
        { regex: /#.*/g, color: '#546e7a' },
        { regex: /\b\d+\.?\d*\b/g, color: '#f78c6c' },
      ],
      java: [
        { regex: /\b(public|private|protected|class|interface|void|int|String|if|else|for|while|return)\b/g, color: '#c792ea' },
        { regex: /(["'`])(.*?)\1/g, color: '#c3e88d' },
        { regex: /\/\/.*$/gm, color: '#546e7a' },
        { regex: /\/\*[\s\S]*?\*\//g, color: '#546e7a' },
      ],
      cpp: [
        { regex: /\b(#include|int|void|char|float|double|if|else|for|while|return|class|public|private)\b/g, color: '#c792ea' },
        { regex: /(["'`])(.*?)\1/g, color: '#c3e88d' },
        { regex: /\/\/.*$/gm, color: '#546e7a' },
        { regex: /\/\*[\s\S]*?\*\//g, color: '#546e7a' },
      ]
    };

    if (!patterns[language]) {
      return <span>{line}</span>;
    }

    let highlightedLine = line;
    const highlights = [];

    patterns[language].forEach(({ regex, color }) => {
      let match;
      while ((match = regex.exec(line)) !== null) {
        highlights.push({
          start: match.index,
          end: match.index + match[0].length,
          color,
          text: match[0]
        });
      }
    });

    // Sort highlights by position
    highlights.sort((a, b) => a.start - b.start);

    // Build highlighted JSX
    const result = [];
    let lastIndex = 0;

    highlights.forEach((highlight, index) => {
      // Add unhighlighted text before this highlight
      if (highlight.start > lastIndex) {
        result.push(
          <span key={`text-${index}`}>
            {line.substring(lastIndex, highlight.start)}
          </span>
        );
      }

      // Add highlighted text
      result.push(
        <span key={`highlight-${index}`} style={{ color: highlight.color }}>
          {highlight.text}
        </span>
      );

      lastIndex = highlight.end;
    });

    // Add remaining unhighlighted text
    if (lastIndex < line.length) {
      result.push(
        <span key="remaining">
          {line.substring(lastIndex)}
        </span>
      );
    }

    return result.length > 0 ? result : <span>{line}</span>;
  };

  const fetchProjects = async () => {
    try {
      setLoading(true);
      setError(null);

      const projectPromises = repositories.map(async (repo) => {
        const response = await fetch(`https://api.github.com/repos/${repo}`, {
          headers: getGitHubHeaders()
        });

        if (!response.ok) {
          // Handle rate limiting
          if (response.status === 403) {
            const resetTime = response.headers.get('X-RateLimit-Reset');
            const resetDate = resetTime ? new Date(parseInt(resetTime) * 1000) : null;
            const resetMessage = resetDate ? `Rate limit resets at ${resetDate.toLocaleTimeString()}` : 'Rate limit exceeded';
            throw new Error(`GitHub API rate limit exceeded for ${repo}. ${resetMessage}. Try again later or use authentication.`);
          }
          throw new Error(`Failed to fetch ${repo}: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        return {
          id: data.id,
          name: data.name,
          description: data.description || "No description available",
          language: data.language,
          stars: data.stargazers_count,
          forks: data.forks_count,
          url: data.html_url,
          updatedAt: new Date(data.updated_at).toLocaleDateString(),
          createdAt: new Date(data.created_at).toLocaleDateString(),
          topics: data.topics || [],
          license: data.license?.name || null,
          size: data.size,
          defaultBranch: data.default_branch
        };
      });

      const projectData = await Promise.all(projectPromises);
      setProjects(projectData);
    } catch (err) {
      console.error("Error fetching projects:", err);

      // Provide more specific error messages
      let errorMessage = "Failed to load projects. ";

      if (err.message.includes('rate limit')) {
        errorMessage += "GitHub API rate limit exceeded. Please wait 1 hour or add VITE_GITHUB_TOKEN to your .env file. ";
      } else if (err.message.includes('404')) {
        errorMessage += "Repository not found. Please check repository URLs. ";
      } else if (err.message.includes('403')) {
        errorMessage += "Access forbidden. Repository might be private. ";
      } else {
        errorMessage += "Please try again later. ";
      }

      errorMessage += "Click retry to try again.";

      // Show fallback data for rate limiting
      if (err.message.includes('rate limit')) {
        setProjects(fallbackProjects);
        errorMessage = "⚠️ Using cached data due to GitHub API rate limit. " + errorMessage;
        setError(errorMessage);
        setLoading(false);
        return;
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const getLanguageColor = (language) => {
    const colors = {
      Python: "#3776AB",
      JavaScript: "#F7DF1E",
      TypeScript: "#3178C6",
      Java: "#ED8B00",
      "C++": "#00599C",
      C: "#A8B9CC",
      Go: "#00ADD8",
      Rust: "#000000",
      PHP: "#777BB4",
      Ruby: "#CC342D",
      Shell: "#89E051",
      HTML: "#E34F26",
      CSS: "#1572B6",
      null: "#6B7280" // For repositories without a primary language
    };
    return colors[language] || "#6B7280";
  };

  if (loading) {
    return (
      <section className="section">
        <h2>Projects</h2>
        <p>
          Selected security and development projects showcasing automation,
          cryptography, and reconnaissance capabilities.
        </p>
        <div style={{ textAlign: "center", padding: "40px" }}>
          <div style={{
            display: "inline-block",
            width: "20px",
            height: "20px",
            border: "2px solid #4fd1ff",
            borderTop: "2px solid transparent",
            borderRadius: "50%",
            animation: "spin 1s linear infinite"
          }}></div>
          <p style={{ marginTop: "16px", color: "#cbd5e1" }}>Loading projects...</p>
        </div>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </section>
    );
  }

  if (error) {
    return (
      <section className="section">
        <h2>Projects</h2>
        <p>
          A collection of cybersecurity and automation projects focused on penetration testing,
           reconnaissance, and real-world security practices. These projects demonstrate hands-on experience in identifying 
           vulnerabilities, building tools, and applying security concepts in practical scenarios.
        </p>
        <div style={{
          textAlign: "center",
          padding: "40px",
          color: "#ef4444",
          background: "rgba(239, 68, 68, 0.1)",
          borderRadius: "8px",
          border: "1px solid rgba(239, 68, 68, 0.3)"
        }}>
          <p>{error}</p>
          <button
            onClick={fetchProjects}
            className="btn"
            style={{ marginTop: "16px" }}
          >
            Retry
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="section">
      <h2>Projects</h2>

      <p>
        A collection of cybersecurity and automation projects focused on penetration testing,
         reconnaissance, and real-world security practices. These projects demonstrate hands-on experience in identifying 
         vulnerabilities, building tools, and applying security concepts in practical scenarios.
      </p>

      <div style={{
        display: "flex",
        gap: "24px",
        marginTop: "40px",
        overflowX: "auto",
        paddingBottom: "20px",
        scrollbarWidth: "none",
        msOverflowStyle: "none",
        WebkitOverflowScrolling: "touch"
      }}
      className="projects-horizontal-scroll"
      >
        {projects.map((project) => (
          <div
            key={project.id}
            style={{
              background: "rgba(255, 255, 255, 0.02)",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              borderRadius: "12px",
              padding: "24px",
              transition: "all 0.3s ease",
              cursor: "pointer",
              minWidth: "350px",
              maxWidth: "350px",
              flexShrink: 0
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-4px)";
              e.currentTarget.style.boxShadow = "0 8px 25px rgba(79, 209, 255, 0.15)";
              e.currentTarget.style.borderColor = "rgba(79, 209, 255, 0.4)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "none";
              e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.08)";
            }}
            onClick={() => openProjectModal(project)}
          >
            <div style={{ marginBottom: "16px" }}>
              <h3 style={{
                color: "#e8f1ff",
                margin: "0 0 8px 0",
                fontSize: "1.25rem",
                fontWeight: "600"
              }}>
                {project.name}
              </h3>

              <p style={{
                color: "#cbd5e1",
                margin: "0",
                fontSize: "0.9rem",
                lineHeight: "1.5"
              }}>
                {project.description}
              </p>
            </div>

            <div style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "16px"
            }}>
              {project.language && (
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px"
                }}>
                  <div style={{
                    width: "12px",
                    height: "12px",
                    borderRadius: "50%",
                    backgroundColor: getLanguageColor(project.language)
                  }}></div>
                  <span style={{
                    color: "#94a3b8",
                    fontSize: "0.85rem",
                    fontWeight: "500"
                  }}>
                    {project.language}
                  </span>
                </div>
              )}

              <div style={{
                display: "flex",
                gap: "16px",
                fontSize: "0.85rem",
                color: "#94a3b8"
              }}>
                <span>⭐ {project.stars}</span>
                <span>🍴 {project.forks}</span>
              </div>
            </div>

            <div style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center"
            }}>
              <span style={{
                color: "#64748b",
                fontSize: "0.8rem"
              }}>
                Updated {project.updatedAt}
              </span>

              <div style={{
                display: "flex",
                gap: "8px"
              }}>
                <button
                  style={{
                    background: "#4fd1ff",
                    border: "1px solid #4fd1ff",
                    color: "#02040a",
                    padding: "6px 12px",
                    borderRadius: "6px",
                    fontSize: "0.85rem",
                    fontWeight: "500",
                    cursor: "pointer",
                    transition: "all 0.2s ease"
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = "transparent";
                    e.target.style.color = "#4fd1ff";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = "#4fd1ff";
                    e.target.style.color = "#02040a";
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    openProjectModal(project);
                  }}
                >
                  View Project
                </button>

                <button
                  style={{
                    background: "none",
                    border: "1px solid rgba(79, 209, 255, 0.6)",
                    color: "#4fd1ff",
                    padding: "6px 12px",
                    borderRadius: "6px",
                    fontSize: "0.85rem",
                    fontWeight: "500",
                    cursor: "pointer",
                    transition: "all 0.2s ease"
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = "#4fd1ff";
                    e.target.style.color = "#02040a";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = "none";
                    e.target.style.color = "#4fd1ff";
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    window.open(project.url, "_blank", "noopener,noreferrer");
                  }}
                >
                  GitHub →
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Mobile Scroll Indicator - Dots */}
      <div className="mobile-scroll-indicator" style={{
        display: "none",
        justifyContent: "center",
        alignItems: "center",
        marginTop: "24px",
        gap: "8px"
      }}>
        {projects.map((_, index) => (
          <span
            key={index}
            className="scroll-indicator-dot"
            style={{
              width: "8px",
              height: "8px",
              borderRadius: "50%",
              background: "#4fd1ff",
              boxShadow: "0 0 12px rgba(79, 209, 255, 0.6)",
              opacity: 0.6,
              transition: "all 0.3s ease"
            }}
          ></span>
        ))}
      </div>

      {/* Project File Browser Modal */}
      {showModal && selectedProject && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(2, 5, 12, 0.95)",
            backdropFilter: "blur(8px)",
            zIndex: 1000,
            display: "flex",
            flexDirection: "column",
            paddingTop: "clamp(60px, 10vh, 80px)",
            paddingLeft: "clamp(10px, 3vw, 20px)",
            paddingRight: "clamp(10px, 3vw, 20px)",
            paddingBottom: "clamp(10px, 2vw, 20px)"
          }}
          onClick={closeProjectModal}
        >
          {/* Header */}
          <div
            className="modal-header"
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              marginBottom: "20px",
              padding: "clamp(16px, 3vw, 20px)",
              background: "rgba(2, 7, 18, 0.95)",
              border: "1px solid rgba(79, 209, 255, 0.3)",
              borderRadius: "12px",
              position: "relative",
              zIndex: 1002,
              flexWrap: "wrap",
              gap: "16px"
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
              <h2 style={{
                color: "#e8f1ff",
                fontSize: "1.5rem",
                margin: 0,
                fontWeight: "700"
              }}>
                {selectedProject.name}
              </h2>
              {selectedProject.language && (
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px"
                }}>
                  <div style={{
                    width: "12px",
                    height: "12px",
                    borderRadius: "50%",
                    backgroundColor: getLanguageColor(selectedProject.language)
                  }}></div>
                  <span style={{
                    color: "#94a3b8",
                    fontSize: "0.85rem",
                    fontWeight: "500"
                  }}>
                    {selectedProject.language}
                  </span>
                </div>
              )}
            </div>

            <div className="modal-header-buttons" style={{
              display: "flex",
              gap: "clamp(8px, 2vw, 12px)",
              alignItems: "center",
              flexWrap: "wrap",
              justifyContent: "flex-end",
              minWidth: 0,
              flexShrink: 0
            }}>
              {/* View Mode Toggle */}
              <div style={{
                display: "flex",
                background: "rgba(255, 255, 255, 0.05)",
                borderRadius: "6px",
                padding: "2px",
                flexShrink: 0
              }}>
                <button
                  onClick={() => setViewMode("files")}
                  style={{
                    background: viewMode === "files" ? "#4fd1ff" : "transparent",
                    color: viewMode === "files" ? "#02040a" : "#cbd5e1",
                    border: "none",
                    padding: "clamp(4px, 1.5vw, 6px) clamp(8px, 2.5vw, 12px)",
                    borderRadius: "4px",
                    fontSize: "clamp(0.75rem, 2vw, 0.8rem)",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    whiteSpace: "nowrap"
                  }}
                >
                  Files
                </button>
                <button
                  onClick={() => setViewMode("readme")}
                  style={{
                    background: viewMode === "readme" ? "#4fd1ff" : "transparent",
                    color: viewMode === "readme" ? "#02040a" : "#cbd5e1",
                    border: "none",
                    padding: "clamp(4px, 1.5vw, 6px) clamp(8px, 2.5vw, 12px)",
                    borderRadius: "4px",
                    fontSize: "clamp(0.75rem, 2vw, 0.8rem)",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    whiteSpace: "nowrap"
                  }}
                >
                  README
                </button>
              </div>

              <button
                onClick={() => window.open(selectedProject.url, "_blank", "noopener,noreferrer")}
                style={{
                  background: "#4fd1ff",
                  border: "1px solid #4fd1ff",
                  color: "#02040a",
                  padding: "clamp(6px, 2vw, 8px) clamp(12px, 3vw, 16px)",
                  borderRadius: "6px",
                  fontSize: "clamp(0.8rem, 2vw, 0.85rem)",
                  fontWeight: "500",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  whiteSpace: "nowrap",
                  flexShrink: 0
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = "transparent";
                  e.target.style.color = "#4fd1ff";
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = "#4fd1ff";
                  e.target.style.color = "#02040a";
                }}
              >
                GitHub →
              </button>

              <button
                onClick={closeProjectModal}
                style={{
                  background: "none",
                  border: "1px solid rgba(255, 255, 255, 0.3)",
                  color: "#cbd5e1",
                  padding: "clamp(6px, 2vw, 8px) clamp(10px, 2.5vw, 12px)",
                  borderRadius: "6px",
                  fontSize: "clamp(1rem, 3vw, 1.2rem)",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  flexShrink: 0,
                  minWidth: "44px",
                  minHeight: "44px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}
                onMouseEnter={(e) => {
                  e.target.style.borderColor = "rgba(255, 255, 255, 0.6)";
                  e.target.style.color = "#e8f1ff";
                }}
                onMouseLeave={(e) => {
                  e.target.style.borderColor = "rgba(255, 255, 255, 0.3)";
                  e.target.style.color = "#cbd5e1";
                }}
              >
                ×
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div
            style={{
              flex: 1,
              display: "flex",
              gap: "clamp(10px, 2vw, 20px)",
              overflow: "hidden",
              position: "relative",
              zIndex: 1002
            }}
            className="modal-main-content"
            onClick={(e) => e.stopPropagation()}
          >
            {/* File Browser Sidebar */}
            {viewMode === "files" && (
              <div style={{
                width: "clamp(280px, 30vw, 350px)",
                background: "rgba(2, 7, 18, 0.95)",
                border: "1px solid rgba(79, 209, 255, 0.3)",
                borderRadius: "12px",
                overflow: "hidden",
                display: "flex",
                flexDirection: "column"
              }}>
              {/* Breadcrumb Navigation */}
              <div style={{
                padding: "16px",
                borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
                background: "rgba(255, 255, 255, 0.02)"
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                  <button
                    onClick={() => navigateToPath("")}
                    style={{
                      background: "none",
                      border: "none",
                      color: "#4fd1ff",
                      cursor: "pointer",
                      fontSize: "0.9rem",
                      padding: "2px 4px",
                      borderRadius: "4px"
                    }}
                    onMouseEnter={(e) => e.target.style.background = "rgba(79, 209, 255, 0.1)"}
                    onMouseLeave={(e) => e.target.style.background = "none"}
                  >
                    {selectedProject.name}
                  </button>
                  {currentPath && (
                    <>
                      <span style={{ color: "#94a3b8" }}>/</span>
                      {currentPath.split('/').map((segment, index) => {
                        const pathToHere = currentPath.split('/').slice(0, index + 1).join('/');
                        return (
                          <span key={index} style={{ display: "flex", alignItems: "center" }}>
                            {index > 0 && <span style={{ color: "#94a3b8", marginRight: "4px" }}>/</span>}
                            <button
                              onClick={() => navigateToPath(pathToHere)}
                              style={{
                                background: "none",
                                border: "none",
                                color: "#4fd1ff",
                                cursor: "pointer",
                                fontSize: "0.9rem",
                                padding: "2px 4px",
                                borderRadius: "4px"
                              }}
                              onMouseEnter={(e) => e.target.style.background = "rgba(79, 209, 255, 0.1)"}
                              onMouseLeave={(e) => e.target.style.background = "none"}
                            >
                              {segment}
                            </button>
                          </span>
                        );
                      })}
                    </>
                  )}
                </div>
              </div>

              {/* File List */}
              <div style={{ flex: 1, overflowY: "auto" }}>
                {repositoryContents.length === 0 ? (
                  <div style={{
                    padding: "40px",
                    textAlign: "center",
                    color: "#94a3b8"
                  }}>
                    Loading repository contents...
                  </div>
                ) : (
                  repositoryContents.map((item) => {
                    console.log('Rendering item:', item.name, 'Type:', item.type);
                    return (
                      <div
                        key={item.sha}
                      onClick={(e) => {
                        e.stopPropagation();
                        console.log('File clicked:', item.name, 'Type:', item.type, 'Item:', item);

                        if (item.type === 'dir') {
                          console.log('Navigating to directory:', item.name);
                          navigateToPath(currentPath ? `${currentPath}/${item.name}` : item.name);
                        } else {
                          console.log('Fetching file content for:', item.name);
                          fetchFileContent(item);
                        }
                      }}
                      style={{
                        padding: "12px 16px",
                        borderBottom: "1px solid rgba(255, 255, 255, 0.05)",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                        transition: "background 0.2s ease",
                        background: selectedFile && selectedFile.sha === item.sha ? "rgba(79, 209, 255, 0.1)" : "transparent"
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.background = "rgba(255, 255, 255, 0.05)";
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.background = selectedFile && selectedFile.sha === item.sha ? "rgba(79, 209, 255, 0.1)" : "transparent";
                      }}
                    >
                      <span style={{ fontSize: "1.2rem" }}>
                        {getFileIcon(item)}
                      </span>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{
                          color: "#e8f1ff",
                          fontSize: "0.9rem",
                          fontWeight: "500",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis"
                        }}>
                          {item.name}
                        </div>
                        {item.type === 'file' && (
                          <div style={{
                            color: "#94a3b8",
                            fontSize: "0.75rem",
                            marginTop: "2px"
                          }}>
                            {formatFileSize(item.size)}
                          </div>
                        )}
                      </div>
                    </div>
                    );
                  })
                )}
              </div>
            </div>
            )}

            {/* Content Area */}
            <div style={{
              flex: 1,
              background: "rgba(2, 7, 18, 0.95)",
              border: "1px solid rgba(79, 209, 255, 0.3)",
              borderRadius: "12px",
              overflow: "hidden",
              display: "flex",
              flexDirection: "column"
            }}>
              {viewMode === "files" ? (
                selectedFile ? (
                  <>
                    {/* File Header */}
                    <div style={{
                      padding: "16px",
                      borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
                      background: "rgba(255, 255, 255, 0.02)",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center"
                    }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                        <span style={{ fontSize: "1.2rem" }}>
                          {getFileIcon(selectedFile)}
                        </span>
                        <div>
                          <div style={{
                            color: "#e8f1ff",
                            fontSize: "1rem",
                            fontWeight: "600"
                          }}>
                            {selectedFile.name}
                          </div>
                          <div style={{
                            color: "#94a3b8",
                            fontSize: "0.8rem"
                          }}>
                            {formatFileSize(selectedFile.size)}
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => window.open(selectedFile.html_url, "_blank")}
                        style={{
                          background: "none",
                          border: "1px solid rgba(79, 209, 255, 0.6)",
                          color: "#4fd1ff",
                          padding: "6px 12px",
                          borderRadius: "6px",
                          fontSize: "0.8rem",
                          cursor: "pointer",
                          transition: "all 0.2s ease"
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.background = "#4fd1ff";
                          e.target.style.color = "#02040a";
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.background = "none";
                          e.target.style.color = "#4fd1ff";
                        }}
                      >
                        View Raw
                      </button>
                    </div>

                    {/* File Content */}
                    <div className="file-content-scroll" style={{
                      flex: 1,
                      overflow: "auto",
                      background: "#0a0f1a",
                      overflowX: "auto",
                      overflowY: "auto"
                    }}>
                      {isLoadingFile ? (
                        <div style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          height: "100%",
                          color: "#94a3b8"
                        }}>
                          <div style={{ textAlign: "center" }}>
                            <div style={{ fontSize: "2rem", marginBottom: "16px" }}>⏳</div>
                            <div>Loading file content...</div>
                          </div>
                        </div>
                      ) : fileContent ? (
                        renderFileContent(fileContent, selectedFile.name)
                      ) : (
                        <div style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          height: "100%",
                          color: "#94a3b8"
                        }}>
                          <div style={{ textAlign: "center" }}>
                            <div style={{ fontSize: "2rem", marginBottom: "16px" }}>📄</div>
                            <div>No content available</div>
                          </div>
                        </div>
                      )}
                    </div>
                  </>
                ) : (
                  <div style={{
                    flex: 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#94a3b8"
                  }}>
                    <div style={{ textAlign: "center" }}>
                      <div style={{ fontSize: "3rem", marginBottom: "16px" }}>📁</div>
                      <div>Select a file to view its contents</div>
                    </div>
                  </div>
                )
              ) : (
                /* README View */
                <div className="readme-content-scroll" style={{
                  flex: 1,
                  padding: "24px",
                  overflow: "auto",
                  color: "#e8f1ff",
                  overflowX: "auto",
                  overflowY: "auto"
                }}>
                  {readmeContent ? (
                    <div
                      className="readme-content"
                      style={{
                        padding: '20px',
                        background: '#0d1117',
                        color: '#e8f1ff',
                        borderRadius: '6px',
                        overflow: 'auto',
                        fontFamily: 'Inter, system-ui, sans-serif',
                        fontSize: '14px',
                        lineHeight: '1.6'
                      }}
                    >
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        rehypePlugins={[rehypeSanitize]}
                        components={{
                          h1: ({node, ...props}) => <h1 style={{ color: '#4fd1ff', marginTop: '20px', marginBottom: '10px' }} {...props} />,
                          h2: ({node, ...props}) => <h2 style={{ color: '#4fd1ff', marginTop: '16px', marginBottom: '8px' }} {...props} />,
                          h3: ({node, ...props}) => <h3 style={{ color: '#4fd1ff', marginTop: '12px', marginBottom: '6px' }} {...props} />,
                          a: ({node, href, ...props}) => {
                            // Validate URL - prevent javascript: and data: protocols
                            const isValidUrl = href && (href.startsWith('http://') || href.startsWith('https://') || href.startsWith('/') || href.startsWith('#'));
                            return isValidUrl ? <a href={href} target="_blank" rel="noopener noreferrer" style={{ color: '#4fd1ff', textDecoration: 'underline' }} {...props} /> : <span {...props} />;
                          },
                          img: ({node, src, alt, ...props}) => {
                            // Validate image src - prevent data: URIs and other dangerous protocols
                            const isValidSrc = src && (src.startsWith('http://') || src.startsWith('https://') || src.startsWith('/'));
                            return isValidSrc ? <img src={src} alt={alt} style={{ maxWidth: '100%', borderRadius: '6px', marginTop: '10px' }} {...props} /> : null;
                          },
                          code: ({node, inline, ...props}) => inline ? <code style={{ background: '#1a1f2e', padding: '2px 6px', borderRadius: '3px', fontFamily: 'monospace' }} {...props} /> : null,
                          pre: ({node, ...props}) => <pre style={{ background: '#0a0f1a', padding: '12px', borderRadius: '6px', overflow: 'auto' }} {...props} />
                        }}
                      >
                        {readmeContent}
                      </ReactMarkdown>
                    </div>
                  ) : (
                    <div style={{
                      textAlign: "center",
                      color: "#94a3b8",
                      padding: "40px"
                    }}>
                      <div style={{ fontSize: "3rem", marginBottom: "16px" }}>📄</div>
                      <div>No README file found in this repository.</div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* README and Code Styles */}
      <style>{`
        .readme-content h1 {
          font-size: 2em;
          font-weight: 600;
          margin: 16px 0 8px 0;
          color: #4fd1ff;
          border-bottom: 1px solid rgba(79, 209, 255, 0.3);
          padding-bottom: 8px;
        }

        .readme-content h2 {
          font-size: 1.5em;
          font-weight: 600;
          margin: 16px 0 8px 0;
          color: #4fd1ff;
        }

        .readme-content h3 {
          font-size: 1.25em;
          font-weight: 600;
          margin: 16px 0 8px 0;
          color: #4fd1ff;
        }

        .readme-content p {
          margin: 8px 0;
          line-height: 1.6;
        }

        .readme-content strong {
          color: #4fd1ff;
          font-weight: 600;
        }

        .readme-content em {
          color: #94a3b8;
          font-style: italic;
        }

        .readme-content code {
          background: rgba(79, 209, 255, 0.1);
          color: #4fd1ff;
          padding: 2px 6px;
          border-radius: 3px;
          font-family: Monaco, 'Courier New', monospace;
          font-size: 0.9em;
        }

        .readme-content a {
          color: #4fd1ff;
          text-decoration: none;
        }

        .readme-content a:hover {
          text-decoration: underline;
        }

        .readme-content img {
          max-width: 100%;
          border-radius: 6px;
          margin: 8px 0;
        }

        /* Hide scrollbar for projects horizontal scroll on all devices */
        .projects-horizontal-scroll {
          scrollbar-width: none;
          -ms-overflow-style: none;
        }

        .projects-horizontal-scroll::-webkit-scrollbar {
          display: none;
        }

        /* Mobile Scroll Indicator */
        .mobile-scroll-indicator {
          text-align: center;
          display: flex;
          justify-content: center;
          gap: 8px;
        }

        .scroll-indicator-dot {
          animation: dotPulse 2s ease-in-out infinite;
        }

        .scroll-indicator-dot:nth-child(1) {
          animation-delay: 0s;
        }

        .scroll-indicator-dot:nth-child(2) {
          animation-delay: 0.2s;
        }

        .scroll-indicator-dot:nth-child(3) {
          animation-delay: 0.4s;
        }

        @keyframes dotPulse {
          0%, 100% {
            opacity: 0.4;
            transform: scale(1);
            box-shadow: 0 0 8px rgba(79, 209, 255, 0.3);
          }
          50% {
            opacity: 1;
            transform: scale(1.2);
            box-shadow: 0 0 16px rgba(79, 209, 255, 0.8);
          }
        }

        @keyframes scrollPulse {
          0%, 100% {
            opacity: 0.4;
            transform: scale(1);
            box-shadow: 0 0 12px rgba(79, 209, 255, 0.3);
          }
          50% {
            opacity: 1;
            transform: scale(1.3);
            box-shadow: 0 0 20px rgba(79, 209, 255, 0.8);
          }
        }

        /* Projects horizontal scroll responsive */
        @media (max-width: 768px) {
          .projects-horizontal-scroll {
            padding-left: 1rem;
            padding-right: 1rem;
          }

          /* Show mobile scroll indicator only on mobile */
          .mobile-scroll-indicator {
            display: flex !important;
          }

          .modal-main-content {
            flex-direction: column !important;
          }

          .modal-main-content > div:first-child {
            width: 100% !important;
            height: 200px !important;
            flex-shrink: 0 !important;
          }

          /* Horizontal scroll for code and readme content */
          .file-content-scroll,
          .readme-content-scroll {
            scrollbar-width: thin;
            scrollbar-color: #4fd1ff rgba(79, 209, 255, 0.2);
            -webkit-overflow-scrolling: touch;
          }

          .file-content-scroll::-webkit-scrollbar,
          .readme-content-scroll::-webkit-scrollbar {
            height: 8px;
            width: 8px;
          }

          .file-content-scroll::-webkit-scrollbar-track,
          .readme-content-scroll::-webkit-scrollbar-track {
            background: rgba(79, 209, 255, 0.1);
            border-radius: 4px;
          }

          .file-content-scroll::-webkit-scrollbar-thumb,
          .readme-content-scroll::-webkit-scrollbar-thumb {
            background: #4fd1ff;
            border-radius: 4px;
            border: 1px solid rgba(79, 209, 255, 0.3);
          }

          .file-content-scroll::-webkit-scrollbar-thumb:hover,
          .readme-content-scroll::-webkit-scrollbar-thumb:hover {
            background: rgba(79, 209, 255, 0.8);
          }

          /* Modal header mobile fixes */
          .modal-header {
            flex-direction: column !important;
            align-items: flex-start !important;
            gap: 1rem !important;
          }

          .modal-header-buttons {
            width: 100% !important;
            justify-content: space-between !important;
            flex-wrap: nowrap !important;
          }

          .modal-header-buttons > div {
            flex-shrink: 1 !important;
          }
        }
      `}</style>
    </section>
  );
}
