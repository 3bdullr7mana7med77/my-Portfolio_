/**
 * Abdelrahman Ahmed — AI Engineer & Data Science Enthusiast Portfolio
 * Vanilla JavaScript (ES6+)
 * 
 * Modules:
 * 1. Theme Manager (Dark/Light mode + localStorage persistence)
 * 2. Sticky Header & ScrollSpy Navigation
 * 3. Mobile Drawer Menu & Focus Handling
 * 4. Scroll Reveal Animations (IntersectionObserver)
 * 5. Interactive Neural Network Particle Canvas
 * 6. Contact Form Validation & Feedback Simulation
 * 7. Back to Top Button
 */

(function () {
  'use strict';

  // ==========================================================================
  // 1. THEME MANAGER
  // ==========================================================================
  const ThemeManager = {
    STORAGE_KEY: 'abdelrahman_theme_pref',
    themeToggleBtn: document.getElementById('theme-toggle'),
    themeMetaTag: document.querySelector('meta[name="theme-color"]'),

    init() {
      // Check stored preference, fallback to dark mode as default
      const savedTheme = localStorage.getItem(this.STORAGE_KEY);
      const initialTheme = savedTheme ? savedTheme : 'dark';
      this.applyTheme(initialTheme);

      if (this.themeToggleBtn) {
        this.themeToggleBtn.addEventListener('click', () => {
          const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
          const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
          this.applyTheme(newTheme);
          localStorage.setItem(this.STORAGE_KEY, newTheme);
        });
      }
    },

    applyTheme(theme) {
      document.documentElement.setAttribute('data-theme', theme);
      if (this.themeMetaTag) {
        this.themeMetaTag.setAttribute('content', theme === 'dark' ? '#090d16' : '#f8fafc');
      }
      if (this.themeToggleBtn) {
        const isDark = theme === 'dark';
        this.themeToggleBtn.setAttribute('aria-label', isDark ? 'Switch to light theme' : 'Switch to dark theme');
        this.themeToggleBtn.setAttribute('title', isDark ? 'Switch to light theme' : 'Switch to dark theme');
      }
    }
  };

  // ==========================================================================
  // 2. STICKY HEADER & SCROLLSPY
  // ==========================================================================
  const NavigationManager = {
    header: document.getElementById('site-header'),
    navLinks: document.querySelectorAll('.nav-link'),
    sections: document.querySelectorAll('section[id]'),

    init() {
      this.handleScroll();
      window.addEventListener('scroll', () => this.handleScroll(), { passive: true });
      this.setupSmoothScroll();
    },

    handleScroll() {
      const scrollY = window.scrollY || window.pageYOffset;

      // Header blur on scroll
      if (this.header) {
        if (scrollY > 40) {
          this.header.classList.add('scrolled');
        } else {
          this.header.classList.remove('scrolled');
        }
      }

      // Active Section ScrollSpy
      let currentSectionId = '';
      const headerOffset = 140;

      this.sections.forEach(section => {
        const sectionTop = section.offsetTop - headerOffset;
        const sectionHeight = section.offsetHeight;
        if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
          currentSectionId = section.getAttribute('id');
        }
      });

      if (currentSectionId) {
        this.navLinks.forEach(link => {
          if (link.getAttribute('href') === `#${currentSectionId}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    },

    setupSmoothScroll() {
      document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
          const targetId = this.getAttribute('href');
          if (targetId.length > 1 && !targetId.startsWith('#PROJECT-') && !targetId.endsWith('-LINK')) {
            const targetElem = document.querySelector(targetId);
            if (targetElem) {
              e.preventDefault();
              targetElem.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
              });
            }
          }
        });
      });
    }
  };

  // ==========================================================================
  // 3. MOBILE MENU CONTROLLER
  // ==========================================================================
  const MobileMenuManager = {
    menuToggleBtn: document.getElementById('menu-toggle'),
    navMenu: document.getElementById('nav-menu'),
    navLinks: document.querySelectorAll('.nav-menu .nav-link'),

    init() {
      if (!this.menuToggleBtn || !this.navMenu) return;

      this.menuToggleBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.toggleMenu();
      });

      // Auto-close menu when a navigation item is clicked
      this.navLinks.forEach(link => {
        link.addEventListener('click', () => {
          if (this.navMenu.classList.contains('is-open')) {
            this.closeMenu();
          }
        });
      });

      // Close menu on click outside
      document.addEventListener('click', (e) => {
        if (
          this.navMenu.classList.contains('is-open') &&
          !this.navMenu.contains(e.target) &&
          !this.menuToggleBtn.contains(e.target)
        ) {
          this.closeMenu();
        }
      });

      // Close menu on Escape key
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && this.navMenu.classList.contains('is-open')) {
          this.closeMenu();
          this.menuToggleBtn.focus();
        }
      });

      // Close menu on resize to desktop
      window.addEventListener('resize', () => {
        if (window.innerWidth > 992 && this.navMenu.classList.contains('is-open')) {
          this.closeMenu();
        }
      });
    },

    toggleMenu() {
      const isOpen = this.navMenu.classList.contains('is-open');
      if (isOpen) {
        this.closeMenu();
      } else {
        this.openMenu();
      }
    },

    header: document.getElementById('site-header'),

    openMenu() {
      this.navMenu.classList.add('is-open');
      this.menuToggleBtn.classList.add('is-active');
      this.menuToggleBtn.setAttribute('aria-expanded', 'true');
      document.body.classList.add('menu-open');
      document.body.style.overflow = 'hidden';
      if (this.header) this.header.classList.add('menu-active');
    },

    closeMenu() {
      this.navMenu.classList.remove('is-open');
      this.menuToggleBtn.classList.remove('is-active');
      this.menuToggleBtn.setAttribute('aria-expanded', 'false');
      document.body.classList.remove('menu-open');
      document.body.style.overflow = '';
      if (this.header) this.header.classList.remove('menu-active');
    }
  };

  // ==========================================================================
  // 4. SCROLL REVEAL ANIMATIONS
  // ==========================================================================
  const RevealManager = {
    revealElements: document.querySelectorAll('[data-reveal]'),

    init() {
      if (!('IntersectionObserver' in window)) {
        // Fallback for older browsers
        this.revealElements.forEach(el => el.classList.add('is-revealed'));
        return;
      }

      // Check prefers-reduced-motion
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        this.revealElements.forEach(el => el.classList.add('is-revealed'));
        return;
      }

      const observerOptions = {
        root: null,
        rootMargin: '0px 0px -15px 0px',
        threshold: 0.02
      };

      const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed');
            obs.unobserve(entry.target);
          }
        });
      }, observerOptions);

      this.revealElements.forEach(el => observer.observe(el));
    }
  };

  // ==========================================================================
  // 5. INTERACTIVE NEURAL NETWORK PARTICLE CANVAS
  // ==========================================================================
  const NeuralCanvasManager = {
    canvas: document.getElementById('hero-canvas'),
    ctx: null,
    particles: [],
    numParticles: 45,
    maxDistance: 130,
    animationFrameId: null,
    isActive: true,
    mouse: { x: null, y: null, radius: 100 },

    init() {
      if (!this.canvas) return;

      // Disable canvas if user prefers reduced motion
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        this.canvas.style.display = 'none';
        return;
      }

      this.ctx = this.canvas.getContext('2d');
      if (!this.ctx) return;

      this.resize();
      this.createParticles();
      this.bindEvents();
      this.animate();

      // Pause canvas when scrolled out of hero section to optimize CPU performance
      const heroSection = document.getElementById('home');
      if (heroSection && 'IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            this.isActive = entry.isIntersecting;
            if (this.isActive && !this.animationFrameId) {
              this.animate();
            }
          });
        }, { threshold: 0.05 });
        observer.observe(heroSection);
      }
    },

    resize() {
      const rect = this.canvas.parentElement.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      this.canvas.width = rect.width * dpr;
      this.canvas.height = rect.height * dpr;
      this.ctx.scale(dpr, dpr);
      this.width = rect.width;
      this.height = rect.height;

      // Adjust particle count for smaller screens
      if (this.width < 768) {
        this.numParticles = 24;
        this.maxDistance = 95;
      } else {
        this.numParticles = 48;
        this.maxDistance = 135;
      }
    },

    createParticles() {
      this.particles = [];
      for (let i = 0; i < this.numParticles; i++) {
        this.particles.push({
          x: Math.random() * this.width,
          y: Math.random() * this.height,
          vx: (Math.random() - 0.5) * 0.7,
          vy: (Math.random() - 0.5) * 0.7,
          radius: Math.random() * 2 + 1.2,
          color: Math.random() > 0.4 ? '#6366f1' : '#06b6d4'
        });
      }
    },

    bindEvents() {
      window.addEventListener('resize', () => {
        this.resize();
        this.createParticles();
      });

      this.canvas.addEventListener('mousemove', (e) => {
        const rect = this.canvas.getBoundingClientRect();
        this.mouse.x = e.clientX - rect.left;
        this.mouse.y = e.clientY - rect.top;
      });

      this.canvas.addEventListener('mouseleave', () => {
        this.mouse.x = null;
        this.mouse.y = null;
      });
    },

    animate() {
      if (!this.isActive) {
        this.animationFrameId = null;
        return;
      }

      this.ctx.clearRect(0, 0, this.width, this.height);

      const isDarkMode = document.documentElement.getAttribute('data-theme') !== 'light';

      // Update and draw particles
      for (let i = 0; i < this.particles.length; i++) {
        const p = this.particles[i];

        p.x += p.vx;
        p.y += p.vy;

        // Bounce from walls
        if (p.x < 0 || p.x > this.width) p.vx *= -1;
        if (p.y < 0 || p.y > this.height) p.vy *= -1;

        // Mouse interaction (gentle attraction)
        if (this.mouse.x !== null && this.mouse.y !== null) {
          const dx = this.mouse.x - p.x;
          const dy = this.mouse.y - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < this.mouse.radius) {
            p.x += dx * 0.02;
            p.y += dy * 0.02;
          }
        }

        // Draw particle dot
        this.ctx.beginPath();
        this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        this.ctx.fillStyle = p.color;
        this.ctx.globalAlpha = isDarkMode ? 0.65 : 0.45;
        this.ctx.fill();

        // Connect nearby particles
        for (let j = i + 1; j < this.particles.length; j++) {
          const p2 = this.particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < this.maxDistance) {
            const alpha = (1 - dist / this.maxDistance) * (isDarkMode ? 0.22 : 0.12);
            this.ctx.beginPath();
            this.ctx.moveTo(p.x, p.y);
            this.ctx.lineTo(p2.x, p2.y);
            this.ctx.strokeStyle = p.color;
            this.ctx.globalAlpha = alpha;
            this.ctx.lineWidth = 1;
            this.ctx.stroke();
          }
        }
      }

      this.ctx.globalAlpha = 1;
      this.animationFrameId = requestAnimationFrame(() => this.animate());
    }
  };

  // ==========================================================================
  // 6. CONTACT FORM CONTROLLER
  // ==========================================================================
  const ContactFormManager = {
    form: document.getElementById('contact-form'),
    feedbackContainer: document.getElementById('form-feedback'),
    submitBtn: document.getElementById('form-submit-btn'),

    init() {
      if (!this.form) return;

      this.form.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleSubmit();
      });

      // Realtime validation clearing on input
      const inputs = this.form.querySelectorAll('.form-input, .form-textarea');
      inputs.forEach(input => {
        input.addEventListener('input', () => {
          this.clearFieldError(input);
        });
      });
    },

    clearFieldError(input) {
      const errorElem = document.getElementById(`${input.name}-error`);
      if (errorElem) {
        errorElem.textContent = '';
      }
      input.classList.remove('has-error');
    },

    setFieldError(input, message) {
      const errorElem = document.getElementById(`${input.name}-error`);
      if (errorElem) {
        errorElem.textContent = message;
      }
      input.classList.add('has-error');
    },

    validate() {
      let isValid = true;

      const name = this.form.elements['name'];
      const email = this.form.elements['email'];
      const subject = this.form.elements['subject'];
      const message = this.form.elements['message'];

      if (!name.value.trim()) {
        this.setFieldError(name, 'Please enter your full name.');
        isValid = false;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!email.value.trim()) {
        this.setFieldError(email, 'Please enter your email address.');
        isValid = false;
      } else if (!emailRegex.test(email.value.trim())) {
        this.setFieldError(email, 'Please enter a valid email address.');
        isValid = false;
      }

      if (!subject.value.trim()) {
        this.setFieldError(subject, 'Please specify a subject.');
        isValid = false;
      }

      if (!message.value.trim()) {
        this.setFieldError(message, 'Please provide your message.');
        isValid = false;
      } else if (message.value.trim().length < 10) {
        this.setFieldError(message, 'Message must be at least 10 characters long.');
        isValid = false;
      }

      return isValid;
    },

    handleSubmit() {
      // Clear previous feedback
      if (this.feedbackContainer) {
        this.feedbackContainer.hidden = true;
        this.feedbackContainer.textContent = '';
        this.feedbackContainer.className = 'form-feedback';
      }

      if (!this.validate()) {
        return;
      }

      // Display loading state on button
      const originalText = this.submitBtn.innerHTML;
      this.submitBtn.disabled = true;
      this.submitBtn.innerHTML = '<span>Sending message...</span>';

      // Simulate instantaneous client-side submission feedback
      setTimeout(() => {
        this.submitBtn.disabled = false;
        this.submitBtn.innerHTML = originalText;

        if (this.feedbackContainer) {
          this.feedbackContainer.hidden = false;
          this.feedbackContainer.classList.add('success');
          this.feedbackContainer.innerHTML = '<strong>Message sent successfully!</strong> Thank you for reaching out, Abdelrahman will get back to you soon.';
        }

        this.form.reset();

        // Hide feedback after 7 seconds
        setTimeout(() => {
          if (this.feedbackContainer) {
            this.feedbackContainer.hidden = true;
          }
        }, 7000);
      }, 750);
    }
  };

  // ==========================================================================
  // 7. BACK TO TOP BUTTON
  // ==========================================================================
  const BackToTopManager = {
    backToTopBtn: document.getElementById('back-to-top'),

    init() {
      if (!this.backToTopBtn) return;

      this.backToTopBtn.addEventListener('click', (e) => {
        e.preventDefault();
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      });
    }
  };

  // ==========================================================================
  // INITIALIZE ALL MODULES
  // ==========================================================================
  document.addEventListener('DOMContentLoaded', () => {
    ThemeManager.init();
    NavigationManager.init();
    MobileMenuManager.init();
    RevealManager.init();
    NeuralCanvasManager.init();
    ContactFormManager.init();
    BackToTopManager.init();
  });
})();
