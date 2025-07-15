// DOM Elements
const loadingScreen = document.getElementById("loading-screen");
const scrollProgress = document.querySelector(".scroll-progress");
const backToTopBtn = document.getElementById("backToTop");
const mobileMenuToggle = document.querySelector(".mobile-menu-toggle");
const navLinks = document.querySelector(".nav-links");
const filterBtns = document.querySelectorAll(".filter-btn");
const projectCards = document.querySelectorAll(".project-card");
const header = document.querySelector("header");

// Loading Screen Animation
window.addEventListener("load", () => {
  setTimeout(() => {
    loadingScreen.classList.add("hidden");
    setTimeout(() => {
      loadingScreen.style.display = "none";
    }, 500);
  }, 1000);
});

// Particle Background Animation
class ParticleBackground {
  constructor() {
    this.canvas = document.getElementById("particle-canvas");
    this.ctx = this.canvas.getContext("2d");
    this.particles = [];
    this.particleCount = 50;
    this.mouse = { x: 0, y: 0 };

    this.init();
    this.animate();
    this.setupEventListeners();
  }

  init() {
    this.resize();
    this.createParticles();
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  createParticles() {
    this.particles = [];
    for (let i = 0; i < this.particleCount; i++) {
      this.particles.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 3 + 1,
        opacity: Math.random() * 0.5 + 0.2,
      });
    }
  }

  animate() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.particles.forEach((particle) => {
      // Update position
      particle.x += particle.vx;
      particle.y += particle.vy;

      // Boundary collision
      if (particle.x < 0 || particle.x > this.canvas.width) particle.vx *= -1;
      if (particle.y < 0 || particle.y > this.canvas.height) particle.vy *= -1;

      // Mouse interaction
      const dx = this.mouse.x - particle.x;
      const dy = this.mouse.y - particle.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < 100) {
        particle.x -= dx * 0.01;
        particle.y -= dy * 0.01;
      }

      // Draw particle
      this.ctx.beginPath();
      this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      this.ctx.fillStyle = `rgba(255, 255, 255, ${particle.opacity})`;
      this.ctx.fill();
    });

    // Draw connections
    this.particles.forEach((particle, i) => {
      this.particles.slice(i + 1).forEach((otherParticle) => {
        const dx = particle.x - otherParticle.x;
        const dy = particle.y - otherParticle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 150) {
          this.ctx.beginPath();
          this.ctx.moveTo(particle.x, particle.y);
          this.ctx.lineTo(otherParticle.x, otherParticle.y);
          this.ctx.strokeStyle = `rgba(255, 255, 255, ${
            0.1 * (1 - distance / 150)
          })`;
          this.ctx.lineWidth = 0.5;
          this.ctx.stroke();
        }
      });
    });

    requestAnimationFrame(() => this.animate());
  }

  setupEventListeners() {
    window.addEventListener("resize", () => this.resize());
    window.addEventListener("mousemove", (e) => {
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;
    });
  }
}

// Initialize particle background
new ParticleBackground();

// Scroll Progress Indicator
function updateScrollProgress() {
  const windowHeight = window.innerHeight;
  const documentHeight = document.documentElement.scrollHeight - windowHeight;
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  const scrollPercentage = (scrollTop / documentHeight) * 100;

  scrollProgress.style.width = scrollPercentage + "%";
}

// Header Background on Scroll
function updateHeaderBackground() {
  const scrollY = window.scrollY;

  if (scrollY > 100) {
    header.style.background = "rgba(255, 255, 255, 0.15)";
    header.style.boxShadow = "0 10px 30px rgba(0, 0, 0, 0.1)";
  } else {
    header.style.background = "rgba(255, 255, 255, 0.1)";
    header.style.boxShadow = "none";
  }
}

// Back to Top Button
function updateBackToTopButton() {
  if (window.scrollY > 500) {
    backToTopBtn.classList.add("show");
  } else {
    backToTopBtn.classList.remove("show");
  }
}

// Scroll Event Listeners
window.addEventListener("scroll", () => {
  updateScrollProgress();
  updateHeaderBackground();
  updateBackToTopButton();
});

// Back to Top Click Handler
backToTopBtn.addEventListener("click", () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
});

// Mobile Menu Toggle
mobileMenuToggle.addEventListener("click", () => {
  navLinks.classList.toggle("active");
  mobileMenuToggle.classList.toggle("active");

  // Toggle hamburger animation
  const icon = mobileMenuToggle.querySelector("i");
  if (mobileMenuToggle.classList.contains("active")) {
    icon.classList.remove("fa-bars");
    icon.classList.add("fa-times");
  } else {
    icon.classList.remove("fa-times");
    icon.classList.add("fa-bars");
  }
});

// Close mobile menu when clicking on a link
navLinks.addEventListener("click", (e) => {
  if (e.target.tagName === "A") {
    navLinks.classList.remove("active");
    mobileMenuToggle.classList.remove("active");

    const icon = mobileMenuToggle.querySelector("i");
    icon.classList.remove("fa-times");
    icon.classList.add("fa-bars");
  }
});

// Smooth Scrolling for Navigation Links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();

    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      const headerHeight = header.offsetHeight;
      const targetPosition = target.offsetTop - headerHeight;

      window.scrollTo({
        top: targetPosition,
        behavior: "smooth",
      });
    }
  });
});

// Project Filter Functionality
filterBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    // Remove active class from all buttons
    filterBtns.forEach((b) => b.classList.remove("active"));
    // Add active class to clicked button
    btn.classList.add("active");

    const filter = btn.getAttribute("data-filter");

    projectCards.forEach((card) => {
      const category = card.getAttribute("data-category");

      if (filter === "all" || category === filter) {
        card.style.display = "block";
        card.style.opacity = "0";
        card.style.transform = "translateY(20px)";

        // Animate in
        setTimeout(() => {
          card.style.opacity = "1";
          card.style.transform = "translateY(0)";
        }, 100);
      } else {
        card.style.opacity = "0";
        card.style.transform = "translateY(20px)";

        setTimeout(() => {
          card.style.display = "none";
        }, 300);
      }
    });
  });
});


// Intersection Observer for Animations
const observerOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px -50px 0px",
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("aos-animate");
    }
  });
}, observerOptions);

// Observe all elements with data-aos attribute
document.querySelectorAll("[data-aos]").forEach((el) => {
  observer.observe(el);
});

// Tech Stack Items Hover Animation
document.querySelectorAll(".tech-item").forEach((item) => {
  item.addEventListener("mouseenter", () => {
    item.style.transform = "translateY(-15px) rotateY(10deg)";
    item.style.boxShadow = "0 25px 50px rgba(0, 0, 0, 0.3)";
  });

  item.addEventListener("mouseleave", () => {
    item.style.transform = "translateY(0) rotateY(0)";
    item.style.boxShadow = "none";
  });
});

// Certificate Verification Modal (placeholder)
document.querySelectorAll(".btn-verify").forEach((btn) => {
  btn.addEventListener("click", () => {
    // Placeholder for certificate verification
    alert(
      "Certificate verification would redirect to SAP certification database."
    );
  });
});

// Project Details Modal (placeholder)
document.querySelectorAll(".btn-view-details").forEach((btn) => {
  btn.addEventListener("click", () => {
    // Placeholder for project details modal
    alert("Project details modal would open here with detailed information.");
  });
});

// Contact Form Animations
document.querySelectorAll(".contact-card").forEach((card) => {
  card.addEventListener("mouseenter", () => {
    card.style.transform = "translateY(-15px) scale(1.02)";
  });

  card.addEventListener("mouseleave", () => {
    card.style.transform = "translateY(0) scale(1)";
  });
});

// Dynamic Year in Footer
document.addEventListener("DOMContentLoaded", () => {
  const yearElement = document.querySelector(".footer-bottom p");
  if (yearElement) {
    const currentYear = new Date().getFullYear();
    yearElement.innerHTML = yearElement.innerHTML.replace("2025", currentYear);
  }
});

// Parallax Effect for Hero Section
window.addEventListener("scroll", () => {
  const scrolled = window.pageYOffset;
  const hero = document.querySelector(".hero");

  if (hero) {
    const rate = scrolled * -0.5;
    hero.style.transform = `translateY(${rate}px)`;
  }
});

// Preloader for Images
function preloadImages() {
  const images = document.querySelectorAll("img");
  let loadedImages = 0;

  images.forEach((img) => {
    if (img.complete) {
      loadedImages++;
    } else {
      img.addEventListener("load", () => {
        loadedImages++;
        if (loadedImages === images.length) {
          // All images loaded
          document.body.classList.add("images-loaded");
        }
      });
    }
  });
}

// Initialize image preloading
preloadImages();

// Smooth reveal animation for sections
function revealOnScroll() {
  const reveals = document.querySelectorAll(
    ".tech-item, .cert-card, .project-card, .contact-card"
  );

  reveals.forEach((reveal) => {
    const windowHeight = window.innerHeight;
    const elementTop = reveal.getBoundingClientRect().top;
    const elementVisible = 150;

    if (elementTop < windowHeight - elementVisible) {
      reveal.classList.add("revealed");
    }
  });
}

window.addEventListener("scroll", revealOnScroll);

// Add revealed class styles
const style = document.createElement("style");
style.textContent = `
  .tech-item, .cert-card, .project-card, .contact-card {
    opacity: 0;
    transform: translateY(20px);
    transition: all 0.6s ease;
  }
  
  .tech-item.revealed, .cert-card.revealed, .project-card.revealed, .contact-card.revealed {
    opacity: 1;
    transform: translateY(0);
  }
  
  .nav-links.active {
    display: flex;
    flex-direction: column;
    position: absolute;
    top: 100%;
    left: 0;
    width: 100%;
    background: rgba(255, 255, 255, 0.15);
    backdrop-filter: blur(20px);
    padding: 1rem 0;
    border-top: 1px solid rgba(255, 255, 255, 0.2);
  }
  
  @media (max-width: 768px) {
    .nav-links {
      display: none;
    }
    
    .nav-links.active {
      display: flex;
    }
  }
`;
document.head.appendChild(style);

// Performance optimization: Throttle scroll events
function throttle(func, limit) {
  let inThrottle;
  return function () {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

// Apply throttling to scroll events
window.addEventListener(
  "scroll",
  throttle(() => {
    updateScrollProgress();
    updateHeaderBackground();
    updateBackToTopButton();
    revealOnScroll();
  }, 16)
); // ~60fps

// Easter egg: Konami code
let konamiCode = "";
const konamiSequence =
  "ArrowUpArrowUpArrowDownArrowDownArrowLeftArrowRightArrowLeftArrowRightKeyBKeyA";

document.addEventListener("keydown", (e) => {
  konamiCode += e.code;

  if (konamiCode === konamiSequence) {
    // Easter egg activated
    document.body.style.filter = "hue-rotate(180deg)";
    setTimeout(() => {
      document.body.style.filter = "none";
    }, 3000);
    konamiCode = "";
  } else if (!konamiSequence.startsWith(konamiCode)) {
    konamiCode = "";
  }
});

// Console message for developers
console.log(
  "%c👋 Hello Developer! 👋",
  "color: #667eea; font-size: 20px; font-weight: bold;"
);
console.log(
  "%cThis portfolio showcases SAP expertise with modern web technologies.",
  "color: #764ba2; font-size: 14px;"
);
console.log(
  "%cFeel free to explore the code and get inspired!",
  "color: #667eea; font-size: 12px;"
);

// Initialize everything when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  // Trigger initial animations
  setTimeout(() => {
    revealOnScroll();
  }, 100);

  // Set initial states
  updateScrollProgress();
  updateHeaderBackground();
  updateBackToTopButton();

  console.log("SAP Portfolio loaded successfully! 🚀");
});
