// normandpllc-style Animation System for Oranzon
// GSAP-powered animations matching normandpllc.com flow

// Configuration
const config = {
  animations: {
    default: { duration: 0.25, ease: "circ.out" },
    header: { delay: 1.7, duration: 1, ease: "circ.out" },
    cursor: { duration: 0.7, ease: "power3.out" },
    slideshow: { duration: 100, ease: "none" },
    preloader: { duration: 2, ease: "power2.inOut" }
  },
  breakpoints: {
    mobile: 768,
    tablet: 960,
    desktop: 1200,
    large: 1440
  }
};

// Initialize GSAP defaults
gsap.defaults({
  duration: config.animations.default.duration,
  ease: config.animations.default.ease,
  force3D: true
});

// Custom Cursor System
class CustomCursor {
  constructor() {
    this.cursor = null;
    this.cursorInner = null;
    this.cursorOuter = null;
    this.mouseX = 0;
    this.mouseY = 0;
    this.posX = 0;
    this.posY = 0;
    this.init();
  }

  init() {
    // Create cursor elements
    this.createCursor();
    this.bindEvents();
    this.animate();
  }

  createCursor() {
    // Create cursor HTML
    const cursorHTML = `
      <div class="custom-cursor">
        <div class="cursor-inner"></div>
        <div class="cursor-outer"></div>
      </div>
    `;
    document.body.insertAdjacentHTML('beforeend', cursorHTML);
    
    this.cursor = document.querySelector('.custom-cursor');
    this.cursorInner = document.querySelector('.cursor-inner');
    this.cursorOuter = document.querySelector('.cursor-outer');
  }

  bindEvents() {
    // Mouse move
    document.addEventListener('mousemove', (e) => {
      this.mouseX = e.clientX;
      this.mouseY = e.clientY;
    });

    // Hover states
    const interactiveElements = 'a, button, .nav-link, .menu-button, input, textarea';
    document.querySelectorAll(interactiveElements).forEach(el => {
      el.addEventListener('mouseenter', () => this.handleHover(el));
      el.addEventListener('mouseleave', () => this.handleLeave());
    });
  }

  handleHover(element) {
    gsap.to(this.cursorOuter, {
      scale: 1.2,
      duration: config.animations.cursor.duration,
      ease: config.animations.cursor.ease
    });

    // Special handling for menu button
    if (element.classList.contains('menu-button')) {
      this.cursor.classList.add('cursor-menu');
    }
    
    // Special handling for links
    if (element.tagName === 'A') {
      this.cursor.classList.add('cursor-link');
    }
  }

  handleLeave() {
    gsap.to(this.cursorOuter, {
      scale: 1,
      duration: config.animations.cursor.duration,
      ease: config.animations.cursor.ease
    });
    
    this.cursor.classList.remove('cursor-menu', 'cursor-link');
  }

  animate() {
    // Smooth cursor follow
    this.posX += (this.mouseX - this.posX) * 0.15;
    this.posY += (this.mouseY - this.posY) * 0.15;

    gsap.set(this.cursorInner, {
      x: this.mouseX,
      y: this.mouseY
    });

    gsap.set(this.cursorOuter, {
      x: this.posX,
      y: this.posY
    });

    requestAnimationFrame(() => this.animate());
  }
}

// Preloader System
class Preloader {
  constructor() {
    this.preloader = null;
    this.counter = null;
    this.progress = 0;
    this.init();
  }

  init() {
    this.createPreloader();
    this.startLoading();
  }

  createPreloader() {
    const preloaderHTML = `
      <div class="preloader">
        <div class="preloader-content">
          <div class="preloader-logo">
            <svg class="preloader-svg" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" stroke-width="2"/>
            </svg>
          </div>
          <div class="preloader-counter">
            <span class="counter-number">0</span>
            <span class="counter-percent">%</span>
          </div>
        </div>
      </div>
    `;
    document.body.insertAdjacentHTML('afterbegin', preloaderHTML);
    
    this.preloader = document.querySelector('.preloader');
    this.counter = document.querySelector('.counter-number');
  }

  startLoading() {
    // Animate counter from 0 to 100
    const tl = gsap.timeline({
      onComplete: () => this.hidePreloader()
    });

    tl.to(this, {
      progress: 100,
      duration: config.animations.preloader.duration,
      ease: "power2.inOut",
      onUpdate: () => {
        this.counter.textContent = Math.round(this.progress);
      }
    });
  }

  hidePreloader() {
    const tl = gsap.timeline({
      onComplete: () => {
        this.preloader.remove();
        // Trigger page animations
        if (window.pageAnimations) {
          window.pageAnimations.init();
        }
      }
    });

    // Exit animation
    tl.to('.preloader-svg', {
      scale: 0.8,
      rotate: 180,
      duration: 0.6,
      ease: "power2.in"
    })
    .to('.counter-number, .counter-percent', {
      opacity: 0,
      y: -20,
      duration: 0.4,
      stagger: 0.05
    }, "-=0.4")
    .to('.preloader', {
      yPercent: -100,
      duration: 0.8,
      ease: "power3.inOut"
    }, "-=0.2");
  }
}

// Navigation Animations
class NavigationAnimations {
  constructor() {
    this.navbar = document.querySelector('.navbar');
    this.navLinks = document.querySelectorAll('.nav-link');
    this.menuButton = document.querySelector('.menu-button');
    this.navMenu = document.querySelector('.nav-menu');
    this.init();
  }

  init() {
    this.setupStaggeredReveal();
    this.setupMenuToggle();
    this.setupScrollBehavior();
  }

  setupStaggeredReveal() {
    // Initial state
    gsap.set(this.navLinks, {
      yPercent: 100,
      opacity: 0
    });

    // Staggered reveal after preloader
    gsap.to(this.navLinks, {
      yPercent: 0,
      opacity: 1,
      duration: 0.8,
      delay: config.animations.header.delay,
      stagger: 0.1,
      ease: config.animations.header.ease
    });
  }

  setupMenuToggle() {
    if (!this.menuButton) return;

    let isOpen = false;
    
    this.menuButton.addEventListener('click', () => {
      isOpen = !isOpen;
      
      if (isOpen) {
        this.openMenu();
      } else {
        this.closeMenu();
      }
    });
  }

  openMenu() {
    const tl = gsap.timeline();
    
    tl.to(this.navMenu, {
      x: 0,
      duration: 0.6,
      ease: "power3.out"
    })
    .from('.nav-menu .nav-link', {
      x: -50,
      opacity: 0,
      duration: 0.4,
      stagger: 0.05,
      ease: "power2.out"
    }, "-=0.3");
  }

  closeMenu() {
    const tl = gsap.timeline();
    
    tl.to('.nav-menu .nav-link', {
      x: 50,
      opacity: 0,
      duration: 0.3,
      stagger: 0.03,
      ease: "power2.in"
    })
    .to(this.navMenu, {
      x: "100%",
      duration: 0.5,
      ease: "power3.in"
    }, "-=0.2");
  }

  setupScrollBehavior() {
    let lastScroll = 0;
    
    window.addEventListener('scroll', () => {
      const currentScroll = window.pageYOffset;
      
      if (currentScroll > lastScroll && currentScroll > 100) {
        // Scrolling down - hide navbar
        gsap.to(this.navbar, {
          yPercent: -100,
          duration: 0.3,
          ease: "power2.inOut"
        });
      } else {
        // Scrolling up - show navbar
        gsap.to(this.navbar, {
          yPercent: 0,
          duration: 0.3,
          ease: "power2.inOut"
        });
      }
      
      lastScroll = currentScroll;
    });
  }
}

// Hero Animations
class HeroAnimations {
  constructor() {
    this.hero = document.querySelector('.hero-section, .section-header');
    this.init();
  }

  init() {
    if (!this.hero) return;
    
    this.setupHeroAnimations();
  }

  setupHeroAnimations() {
    const heroElements = {
      title: this.hero.querySelector('h1, .hero-title'),
      subtitle: this.hero.querySelector('p, .hero-subtitle'),
      buttons: this.hero.querySelectorAll('.button, .hero-button'),
      image: this.hero.querySelector('img, .hero-image')
    };

    // Create timeline
    const tl = gsap.timeline({
      delay: config.animations.header.delay + 0.5
    });

    // Animate hero elements
    if (heroElements.title) {
      tl.from(heroElements.title, {
        yPercent: 30,
        opacity: 0,
        duration: 1,
        ease: "power3.out"
      });
    }

    if (heroElements.subtitle) {
      tl.from(heroElements.subtitle, {
        yPercent: 20,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out"
      }, "-=0.6");
    }

    if (heroElements.buttons.length) {
      tl.from(heroElements.buttons, {
        yPercent: 20,
        opacity: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: "power3.out"
      }, "-=0.4");
    }

    if (heroElements.image) {
      tl.from(heroElements.image, {
        scale: 1.2,
        opacity: 0,
        duration: 1.2,
        ease: "power3.out"
      }, "-=1");
    }
  }
}

// Scroll Animations
class ScrollAnimations {
  constructor() {
    this.init();
  }

  init() {
    this.setupScrollTriggers();
    this.setupParallax();
  }

  setupScrollTriggers() {
    // Fade in elements on scroll
    gsap.utils.toArray('.fade-in').forEach(element => {
      gsap.from(element, {
        scrollTrigger: {
          trigger: element,
          start: "top 80%",
          end: "bottom 20%",
          toggleActions: "play none none reverse"
        },
        y: 50,
        opacity: 0,
        duration: 1,
        ease: "power3.out"
      });
    });

    // Stagger animations for lists
    gsap.utils.toArray('.stagger-container').forEach(container => {
      const items = container.querySelectorAll('.stagger-item');
      
      gsap.from(items, {
        scrollTrigger: {
          trigger: container,
          start: "top 80%"
        },
        y: 30,
        opacity: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: "power2.out"
      });
    });
  }

  setupParallax() {
    gsap.utils.toArray('.parallax').forEach(element => {
      gsap.to(element, {
        scrollTrigger: {
          trigger: element,
          start: "top bottom",
          end: "bottom top",
          scrub: 1
        },
        yPercent: -20
      });
    });
  }
}

// Page Animations Controller
class PageAnimations {
  constructor() {
    this.animations = {
      navigation: null,
      hero: null,
      scroll: null
    };
  }

  init() {
    // Initialize all animation modules
    this.animations.navigation = new NavigationAnimations();
    this.animations.hero = new HeroAnimations();
    this.animations.scroll = new ScrollAnimations();
    
    // Add animation classes to elements
    this.prepareElements();
  }

  prepareElements() {
    // Add fade-in class to sections
    document.querySelectorAll('.section').forEach(section => {
      section.classList.add('fade-in');
    });

    // Add stagger classes to grids
    document.querySelectorAll('.w-layout-grid').forEach(grid => {
      grid.classList.add('stagger-container');
      grid.querySelectorAll('> *').forEach(item => {
        item.classList.add('stagger-item');
      });
    });
  }
}

// Initialize everything
document.addEventListener('DOMContentLoaded', () => {
  // Check if it's the homepage
  const isHomepage = window.location.pathname === '/' || 
                     window.location.pathname.includes('index');
  
  // Initialize custom cursor (all pages)
  if (window.innerWidth > config.breakpoints.mobile) {
    new CustomCursor();
  }
  
  // Initialize preloader (homepage only)
  if (isHomepage) {
    new Preloader();
  } else {
    // Direct page animations for other pages
    window.pageAnimations = new PageAnimations();
    window.pageAnimations.init();
  }
  
  // Store reference for preloader callback
  if (isHomepage) {
    window.pageAnimations = new PageAnimations();
  }
});

// Mobile optimizations
if (window.innerWidth <= config.breakpoints.mobile) {
  // Reduce animation complexity on mobile
  gsap.defaults({
    duration: config.animations.default.duration * 0.7
  });
  
  // Disable parallax on mobile
  ScrollTrigger.config({
    limitCallbacks: true,
    syncInterval: 40
  });
}