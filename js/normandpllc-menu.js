// NormandPLLC Menu System Implementation
// Based on normandpllc.com navigation flow and animations

class NormandMenu {
  constructor() {
    this.DOM = {};
    this.tl = null;
    this.isMenuOpen = false;
    this.init();
  }

  init() {
    // Cache DOM elements
    this.DOM.body = document.body;
    this.DOM.menuToggle = document.querySelector('.menu-toggle');
    this.DOM.menuToggleInner = document.querySelector('.menu-toggle span');
    this.DOM.menuToggleClose = document.querySelector('.menu-toggle-close');
    this.DOM.primaryMenuContainer = document.querySelector('.primary-menu-container');
    this.DOM.menuItems = document.querySelectorAll('.menu-item > a');
    this.DOM.submenuItems = document.querySelectorAll('.sub-menu a');
    this.DOM.socialItems = document.querySelectorAll('.social-menu a');
    this.DOM.contactItems = document.querySelectorAll('.contact-link');
    this.DOM.menuBorder = document.querySelector('.menu-border');
    
    // Initialize GSAP defaults
    gsap.defaults({
      ease: 'power2.inOut',
      duration: 0.7
    });
    
    // Set initial states
    this.setInitialStates();
    
    // Bind events
    this.bindEvents();
  }
  
  setInitialStates() {
    // Hide menu container initially
    gsap.set(this.DOM.primaryMenuContainer, { 
      display: 'none',
      xPercent: -100
    });
    
    // Hide close button
    if (this.DOM.menuToggleClose) {
      gsap.set(this.DOM.menuToggleClose, { 
        autoAlpha: 0,
        pointerEvents: 'none'
      });
    }
    
    // Set initial state for menu items
    gsap.set([...this.DOM.menuItems, ...this.DOM.submenuItems], {
      autoAlpha: 1,
      yPercent: 0
    });
  }
  
  bindEvents() {
    // Menu toggle click
    if (this.DOM.menuToggle) {
      this.DOM.menuToggle.addEventListener('click', () => {
        if (!this.isMenuOpen) {
          this.showMenu();
        }
      });
    }
    
    // Close button click
    if (this.DOM.menuToggleClose) {
      this.DOM.menuToggleClose.addEventListener('click', () => {
        if (this.isMenuOpen) {
          this.hideMenu();
        }
      });
    }
    
    // ESC key to close
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isMenuOpen) {
        this.hideMenu();
      }
    });
    
    // Menu item hover effects
    this.DOM.menuItems.forEach(item => {
      item.addEventListener('mouseenter', () => this.handleItemHover(item, true));
      item.addEventListener('mouseleave', () => this.handleItemHover(item, false));
    });
  }
  
  showMenu() {
    // Set ARIA attributes
    this.DOM.menuToggle.setAttribute('aria-expanded', 'true');
    this.isMenuOpen = true;
    
    // Kill any existing animations
    if (this.tl) this.tl.kill();
    gsap.killTweensOf(this.DOM.primaryMenuContainer);
    gsap.killTweensOf(this.DOM.menuItems);
    gsap.killTweensOf(this.DOM.socialItems);
    gsap.killTweensOf(this.DOM.contactItems);
    
    // Create animation timeline
    this.tl = gsap.timeline({
      onStart: () => {
        gsap.set(this.DOM.primaryMenuContainer, { display: 'flex' });
        gsap.set(this.DOM.menuToggle, { pointerEvents: 'none' });
        if (this.DOM.menuToggleClose) {
          gsap.set(this.DOM.menuToggleClose, { pointerEvents: 'all' });
        }
        this.DOM.body.classList.add('menu-open');
      }
    });
    
    // Animate menu button text out
    this.tl.to(this.DOM.menuToggleInner, {
      autoAlpha: 0,
      yPercent: 100,
      rotationX: 90,
      force3D: true,
      duration: 1.5,
      ease: 'expo.inOut'
    }, 'start');
    
    // Slide in menu container from left
    this.tl.from(this.DOM.primaryMenuContainer, {
      xPercent: -100,
      duration: 1,
      ease: 'slow(0.5, 2, false)',
      force3D: true
    }, 'start');
    
    // Stagger animate menu items from top
    this.tl.from(this.DOM.menuItems, {
      autoAlpha: 0,
      yPercent: -100,
      stagger: 0.2,
      duration: 1,
      force3D: true,
      ease: 'expo.out'
    }, 'start+=0.3');
    
    // Animate submenu items
    if (this.DOM.submenuItems.length) {
      this.tl.from(this.DOM.submenuItems, {
        autoAlpha: 0,
        yPercent: -100,
        stagger: 0.1,
        duration: 0.8,
        force3D: true,
        ease: 'expo.out'
      }, 'start+=0.5');
    }
    
    // Animate social items
    if (this.DOM.socialItems.length) {
      this.tl.from(this.DOM.socialItems, {
        autoAlpha: 0,
        yPercent: -100,
        stagger: 0.2,
        duration: 1,
        force3D: true,
        ease: 'expo.out'
      }, 'start+=1.7');
    }
    
    // Animate contact items
    if (this.DOM.contactItems.length) {
      this.tl.from(this.DOM.contactItems, {
        autoAlpha: 0,
        yPercent: -100,
        stagger: 0.2,
        duration: 1,
        force3D: true,
        ease: 'expo.out'
      }, 'start+=2.7');
    }
    
    // Show close button
    if (this.DOM.menuToggleClose) {
      this.tl.to(this.DOM.menuToggleClose, {
        duration: 1.5,
        autoAlpha: 1,
        ease: 'expo.out'
      }, 'start+=2.7');
    }
  }
  
  hideMenu() {
    this.DOM.menuToggle.setAttribute('aria-expanded', 'false');
    this.isMenuOpen = false;
    
    // Kill existing timeline
    if (this.tl) this.tl.kill();
    
    this.tl = gsap.timeline({
      onComplete: () => {
        // Reset positions
        gsap.set(this.DOM.primaryMenuContainer, { 
          display: 'none',
          xPercent: 0 
        });
        gsap.set(this.DOM.menuItems, { autoAlpha: 1, yPercent: 0 });
        gsap.set(this.DOM.submenuItems, { autoAlpha: 1, yPercent: 0 });
        gsap.set(this.DOM.socialItems, { autoAlpha: 1, yPercent: 0 });
        gsap.set(this.DOM.contactItems, { autoAlpha: 1, yPercent: 0 });
        gsap.set(this.DOM.menuToggle, { pointerEvents: 'all' });
        this.DOM.body.classList.remove('menu-open');
      }
    });
    
    // Restore menu button
    this.tl.to(this.DOM.menuToggleInner, {
      autoAlpha: 1,
      yPercent: 0,
      rotationX: 0,
      force3D: true,
      duration: 1.5,
      ease: 'expo.inOut'
    }, 'start');
    
    // Hide close button
    if (this.DOM.menuToggleClose) {
      this.tl.to(this.DOM.menuToggleClose, { 
        autoAlpha: 0,
        duration: 0.3
      }, 'start');
    }
    
    // Animate out menu items
    this.tl.to(this.DOM.menuItems, {
      autoAlpha: 0,
      yPercent: -100,
      duration: 0.7,
      stagger: 0.05,
      ease: 'expo.in'
    }, 'start');
    
    // Animate out submenu items
    if (this.DOM.submenuItems.length) {
      this.tl.to(this.DOM.submenuItems, {
        autoAlpha: 0,
        yPercent: -100,
        duration: 0.5,
        stagger: 0.02,
        ease: 'expo.in'
      }, 'start');
    }
    
    // Slide out menu container
    this.tl.to(this.DOM.primaryMenuContainer, {
      xPercent: -100,
      duration: 0.7,
      ease: 'slow(0.5, 2, false)',
      force3D: true
    }, window.innerWidth >= 960 ? 'start+=0.7' : 'start');
  }
  
  handleItemHover(item, isEntering) {
    const afterElement = item.querySelector(':after') || item;
    
    if (isEntering) {
      // Scale up background on hover
      gsap.to(afterElement, {
        scaleX: 1,
        scaleY: 1.2,
        transformOrigin: 'center left',
        duration: 0.7,
        ease: 'power2.out'
      });
    } else {
      // Scale down background on leave
      gsap.to(afterElement, {
        scaleX: 0,
        scaleY: 1.2,
        transformOrigin: 'center right',
        duration: 0.7,
        ease: 'power2.out'
      });
    }
  }
  
  // Responsive handling
  handleResize() {
    const isMobile = window.innerWidth < 960;
    
    if (isMobile) {
      // Mobile specific adjustments
      gsap.set(this.DOM.menuToggle, {
        width: '100%',
        transform: 'none'
      });
    } else {
      // Desktop specific adjustments
      gsap.set(this.DOM.menuToggle, {
        width: window.innerWidth >= 1440 ? '212px' : '130px',
        transform: 'translateY(-50%) rotate(-90deg)'
      });
    }
  }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  // Check if GSAP is loaded
  if (typeof gsap !== 'undefined') {
    const menu = new NormandMenu();
    
    // Handle resize events
    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        menu.handleResize();
      }, 250);
    });
  } else {
    console.error('GSAP is required for NormandMenu');
  }
});