// NormandPLLC Complete Page Animation System
// Based on normandpllc.com page flow and transitions

class NormandPageSystem {
  constructor() {
    this.isHomepage = window.location.pathname === '/' || window.location.pathname === '/index.html';
    this.locomotiveScroll = null;
    this.cursor = null;
    this.preloaderComplete = false;
    
    this.init();
  }
  
  init() {
    // Set GSAP defaults
    gsap.defaults({
      duration: 0.25,
      ease: 'circ.out'
    });
    
    // Initialize systems in sequence
    this.initPreloader();
    this.initLocomotiveScroll();
    this.initScrollTrigger();
    this.initCustomCursor();
    this.initPageAnimations();
    this.initSlideshows();
  }
  
  // ============================================
  // PRELOADER SYSTEM
  // ============================================
  initPreloader() {
    const preloader = document.querySelector('.preloader');
    if (!preloader) return;
    
    // SVG Path Animation (Infinite Loop while loading)
    const pathAnimation = gsap.timeline({ repeat: -1 });
    const svgPaths = preloader.querySelectorAll('svg path');
    
    pathAnimation
      .to(svgPaths, {
        scaleX: 1,
        autoAlpha: 1,
        stagger: 0.1,
        duration: 0.8,
        ease: 'circ.out'
      })
      .to(svgPaths, {
        scaleX: 0,
        autoAlpha: 0,
        stagger: 0.1,
        duration: 0.8,
        ease: 'circ.out'
      });
    
    // Homepage Counter Animation
    if (this.isHomepage) {
      const counter = preloader.querySelector('.preloader-percentage');
      if (counter) {
        gsap.to(counter, {
          innerHTML: 100,
          duration: 2,
          snap: { innerHTML: 1 },
          onUpdate: function() {
            counter.innerHTML = Math.round(this.progress() * 100) + '%';
          }
        });
      }
    }
    
    // Preloader Exit Animation (triggered on page load)
    window.addEventListener('load', () => {
      setTimeout(() => {
        pathAnimation.kill();
        this.exitPreloader();
      }, this.isHomepage ? 2500 : 1500);
    });
  }
  
  exitPreloader() {
    const preloader = document.querySelector('.preloader');
    if (!preloader) return;
    
    gsap.timeline({
      onComplete: () => {
        preloader.style.display = 'none';
        this.preloaderComplete = true;
        this.startPageAnimations();
      }
    })
    .to('.preloader-percentage', { 
      autoAlpha: 0,
      duration: 0.3
    })
    .to('.preloader svg', { 
      scale: 0, 
      rotation: 180,
      duration: 0.5
    })
    .to(preloader, { 
      yPercent: -100,
      duration: 0.8,
      ease: 'circ.out',
      force3D: true
    });
  }
  
  // ============================================
  // LOCOMOTIVE SCROLL SYSTEM
  // ============================================
  initLocomotiveScroll() {
    const scrollContainer = document.querySelector('[data-scroll-container]');
    if (!scrollContainer) return;
    
    // Check if mobile
    const isMobile = window.innerWidth <= 768;
    
    if (!isMobile && typeof LocomotiveScroll !== 'undefined') {
      this.locomotiveScroll = new LocomotiveScroll({
        el: scrollContainer,
        smooth: true,
        reloadOnContextChange: true,
        multiplier: 1,
        lerp: 0.1,
        smartphone: {
          smooth: false
        },
        tablet: {
          smooth: false
        }
      });
      
      // Update ScrollTrigger on scroll
      this.locomotiveScroll.on('scroll', ScrollTrigger.update);
      
      // ScrollTrigger refresh on Locomotive Scroll init
      ScrollTrigger.addEventListener('refresh', () => this.locomotiveScroll.update());
      ScrollTrigger.refresh();
    }
  }
  
  // ============================================
  // SCROLLTRIGGER INTEGRATION
  // ============================================
  initScrollTrigger() {
    if (!this.locomotiveScroll) return;
    
    const scrollContainer = document.querySelector('[data-scroll-container]');
    
    // ScrollTrigger Proxy for Locomotive Scroll
    ScrollTrigger.scrollerProxy(scrollContainer, {
      scrollTop(value) {
        return arguments.length 
          ? this.locomotiveScroll.scrollTo(value, 0, 0) 
          : this.locomotiveScroll.scroll.instance.scroll.y;
      },
      getBoundingClientRect() {
        return {
          top: 0,
          left: 0,
          width: window.innerWidth,
          height: window.innerHeight
        };
      },
      pinType: scrollContainer.style.transform ? 'transform' : 'fixed'
    });
  }
  
  // ============================================
  // CUSTOM CURSOR SYSTEM
  // ============================================
  initCustomCursor() {
    const cursorEl = document.querySelector('.custom-cursor');
    if (!cursorEl || window.innerWidth <= 768) return;
    
    this.cursor = {
      el: cursorEl,
      x: 0,
      y: 0,
      targetX: 0,
      targetY: 0,
      lerp: 0.1
    };
    
    // Track mouse movement
    document.addEventListener('mousemove', (e) => {
      this.cursor.targetX = e.clientX;
      this.cursor.targetY = e.clientY;
    });
    
    // Render loop for smooth cursor
    this.renderCursor();
    
    // Add hover interactions
    this.initCursorHovers();
  }
  
  renderCursor() {
    if (!this.cursor) return;
    
    // Smooth interpolation
    this.cursor.x += (this.cursor.targetX - this.cursor.x) * this.cursor.lerp;
    this.cursor.y += (this.cursor.targetY - this.cursor.y) * this.cursor.lerp;
    
    gsap.set(this.cursor.el, {
      x: this.cursor.x,
      y: this.cursor.y
    });
    
    requestAnimationFrame(() => this.renderCursor());
  }
  
  initCursorHovers() {
    const hoverElements = document.querySelectorAll('a, button, .hover-target');
    
    hoverElements.forEach(el => {
      el.addEventListener('mouseenter', () => {
        gsap.to(this.cursor.el, {
          scale: 1.5,
          mixBlendMode: 'difference',
          duration: 0.3
        });
      });
      
      el.addEventListener('mouseleave', () => {
        gsap.to(this.cursor.el, {
          scale: 1,
          mixBlendMode: 'normal',
          duration: 0.3
        });
      });
    });
  }
  
  // ============================================
  // PAGE ANIMATIONS
  // ============================================
  startPageAnimations() {
    // Page Header Animation
    this.animatePageHeader();
    
    // Hero Section Animations
    this.animateHeroSection();
    
    // Scroll-triggered animations
    this.initScrollAnimations();
  }
  
  animatePageHeader() {
    const pageHeader = document.querySelector('.page-header');
    if (!pageHeader) return;
    
    gsap.timeline({ delay: 0.5 })
      .from('.page-header .page-title', {
        yPercent: 50,
        autoAlpha: 0,
        duration: 1.5,
        force3D: true
      })
      .from('.page-header .page-subtitle', {
        yPercent: 30,
        autoAlpha: 0,
        duration: 1.0
      }, '-=0.8');
  }
  
  animateHeroSection() {
    const hero = document.querySelector('.hero-section');
    if (!hero) return;
    
    const tl = gsap.timeline({ delay: 0.3 });
    
    // Hero image reveal
    tl.from('.hero-portrait', {
      scale: 1.2,
      autoAlpha: 0,
      duration: 1.5,
      ease: 'power2.out'
    });
    
    // Text animations
    tl.from('.hero-tagline', {
      yPercent: 100,
      autoAlpha: 0,
      duration: 1.0
    }, '-=0.8')
    .from('.hero-subtitle', {
      yPercent: 100,
      autoAlpha: 0,
      duration: 0.8
    }, '-=0.6')
    .from('.hero-title', {
      yPercent: 100,
      autoAlpha: 0,
      duration: 1.2,
      ease: 'power3.out'
    }, '-=0.4')
    .from('.hero-secondary', {
      yPercent: 50,
      autoAlpha: 0,
      duration: 0.8
    }, '-=0.2');
  }
  
  initScrollAnimations() {
    // Fade in elements on scroll
    gsap.utils.toArray('.fade-in').forEach(element => {
      gsap.from(element, {
        scrollTrigger: {
          trigger: element,
          start: 'top 80%',
          scroller: this.locomotiveScroll ? '[data-scroll-container]' : null
        },
        y: 50,
        autoAlpha: 0,
        duration: 1,
        ease: 'power2.out'
      });
    });
    
    // Stagger animations for lists
    gsap.utils.toArray('.stagger-list').forEach(list => {
      const items = list.querySelectorAll('li, .item');
      
      gsap.from(items, {
        scrollTrigger: {
          trigger: list,
          start: 'top 75%',
          scroller: this.locomotiveScroll ? '[data-scroll-container]' : null
        },
        y: 30,
        autoAlpha: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: 'power2.out'
      });
    });
    
    // Parallax images
    gsap.utils.toArray('.parallax-img').forEach(img => {
      gsap.to(img, {
        scrollTrigger: {
          trigger: img,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
          scroller: this.locomotiveScroll ? '[data-scroll-container]' : null
        },
        yPercent: -20
      });
    });
  }
  
  // ============================================
  // SLIDESHOW SYSTEM
  // ============================================
  initSlideshows() {
    const slideshows = document.querySelectorAll('.slideshow');
    
    slideshows.forEach(slideshow => {
      const slides = slideshow.querySelectorAll('.slide');
      const slideCount = slides.length;
      
      if (slideCount <= 1) return;
      
      // Clone slides for infinite loop
      slides.forEach(slide => {
        const clone = slide.cloneNode(true);
        slideshow.appendChild(clone);
      });
      
      // Continuous animation
      gsap.to(slideshow, {
        x: `-${100 * slideCount}%`,
        duration: slideCount * 10,
        repeat: -1,
        ease: 'none',
        force3D: true
      });
    });
  }
  
  // ============================================
  // PAGE TRANSITION HANDLER
  // ============================================
  handlePageTransition(url) {
    // Exit animation
    const tl = gsap.timeline({
      onComplete: () => {
        window.location.href = url;
      }
    });
    
    tl.to('.site-main', {
      autoAlpha: 0,
      yPercent: -20,
      duration: 0.5
    })
    .to('.site-header', {
      autoAlpha: 0,
      duration: 0.3
    }, '-=0.3');
  }
  
  // ============================================
  // UTILITIES
  // ============================================
  destroy() {
    // Clean up on page leave
    if (this.locomotiveScroll) {
      this.locomotiveScroll.destroy();
    }
    
    ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    
    // Kill all GSAP animations
    gsap.killTweensOf('*');
  }
  
  refresh() {
    // Refresh scroll systems
    if (this.locomotiveScroll) {
      this.locomotiveScroll.update();
    }
    
    ScrollTrigger.refresh();
  }
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  // Check for required libraries
  if (typeof gsap === 'undefined') {
    console.error('GSAP is required for NormandPageSystem');
    return;
  }
  
  // Initialize page system
  window.normandPageSystem = new NormandPageSystem();
  
  // Handle window resize
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      window.normandPageSystem.refresh();
    }, 250);
  });
  
  // Clean up on page unload
  window.addEventListener('beforeunload', () => {
    window.normandPageSystem.destroy();
  });
});