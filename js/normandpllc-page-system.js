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
    
    // Professional hover effects
    this.initHoverEffects();
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
    
    // Fade in left (professional law firm pattern)
    gsap.utils.toArray('.fade-in-left').forEach(element => {
      gsap.from(element, {
        scrollTrigger: {
          trigger: element,
          start: 'top 85%',
          scroller: this.locomotiveScroll ? '[data-scroll-container]' : null
        },
        x: -60,
        autoAlpha: 0,
        duration: 1.2,
        ease: 'power3.out'
      });
    });
    
    // Fade in right (professional law firm pattern)
    gsap.utils.toArray('.fade-in-right').forEach(element => {
      gsap.from(element, {
        scrollTrigger: {
          trigger: element,
          start: 'top 85%',
          scroller: this.locomotiveScroll ? '[data-scroll-container]' : null
        },
        x: 60,
        autoAlpha: 0,
        duration: 1.2,
        ease: 'power3.out'
      });
    });
    
    // Scale in animation (for important elements like CTAs)
    gsap.utils.toArray('.scale-in').forEach(element => {
      gsap.from(element, {
        scrollTrigger: {
          trigger: element,
          start: 'top 80%',
          scroller: this.locomotiveScroll ? '[data-scroll-container]' : null
        },
        scale: 0.8,
        autoAlpha: 0,
        duration: 1.0,
        ease: 'back.out(1.7)'
      });
    });
    
    // Text reveal animation (professional split-text effect)
    gsap.utils.toArray('.text-reveal').forEach(element => {
      gsap.from(element, {
        scrollTrigger: {
          trigger: element,
          start: 'top 90%',
          scroller: this.locomotiveScroll ? '[data-scroll-container]' : null
        },
        yPercent: 100,
        autoAlpha: 0,
        duration: 1.4,
        ease: 'power4.out',
        transformOrigin: 'bottom center'
      });
    });
    
    // Stagger animations for lists and cards
    gsap.utils.toArray('.stagger-list').forEach(list => {
      const items = list.querySelectorAll('li, .item, .card, .demo-card');
      
      gsap.from(items, {
        scrollTrigger: {
          trigger: list,
          start: 'top 75%',
          scroller: this.locomotiveScroll ? '[data-scroll-container]' : null
        },
        y: 40,
        autoAlpha: 0,
        duration: 0.8,
        stagger: {
          amount: 0.6,  // Professional stagger timing
          from: 'start'
        },
        ease: 'power2.out'
      });
    });
    
    // Practice area cards animation (law firm specific)
    gsap.utils.toArray('.practice-area-card, .service-card').forEach((card, index) => {
      gsap.from(card, {
        scrollTrigger: {
          trigger: card,
          start: 'top 80%',
          scroller: this.locomotiveScroll ? '[data-scroll-container]' : null
        },
        y: 60,
        autoAlpha: 0,
        duration: 1.2,
        delay: index * 0.1,
        ease: 'power3.out'
      });
    });
    
    // Parallax images with professional subtle movement
    gsap.utils.toArray('.parallax-img').forEach(img => {
      gsap.to(img, {
        scrollTrigger: {
          trigger: img,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1.2,  // Smooth scrub for professional feel
          scroller: this.locomotiveScroll ? '[data-scroll-container]' : null
        },
        yPercent: -15  // Subtle parallax movement
      });
    });
    
    // Counter animations (for results/statistics)
    gsap.utils.toArray('.counter').forEach(counter => {
      const endValue = parseInt(counter.dataset.count || counter.textContent);
      
      gsap.to(counter, {
        scrollTrigger: {
          trigger: counter,
          start: 'top 80%',
          scroller: this.locomotiveScroll ? '[data-scroll-container]' : null
        },
        innerHTML: endValue,
        duration: 2.5,
        ease: 'power2.out',
        snap: { innerHTML: 1 },
        onUpdate: function() {
          counter.innerHTML = Math.round(this.progress() * endValue);
        }
      });
    });
    
    // Section titles with line reveal effect
    gsap.utils.toArray('.section-title').forEach(title => {
      const line = document.createElement('div');
      line.style.cssText = 'position:absolute;bottom:0;left:0;width:0;height:3px;background:var(--color-theme-primary,#fc5a2b)';
      title.style.position = 'relative';
      title.appendChild(line);
      
      gsap.timeline({
        scrollTrigger: {
          trigger: title,
          start: 'top 85%',
          scroller: this.locomotiveScroll ? '[data-scroll-container]' : null
        }
      })
      .from(title, {
        yPercent: 50,
        autoAlpha: 0,
        duration: 1.0,
        ease: 'power2.out'
      })
      .to(line, {
        width: '60px',
        duration: 0.8,
        ease: 'power2.inOut'
      }, '-=0.3');
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
  // PROFESSIONAL HOVER EFFECTS
  // ============================================
  initHoverEffects() {
    // Button hover effects (law firm standard)
    const buttons = document.querySelectorAll('button, .btn, .cta-button, .contact-button');
    buttons.forEach(btn => {
      btn.addEventListener('mouseenter', () => {
        gsap.to(btn, {
          scale: 1.05,
          y: -2,
          duration: 0.3,
          ease: 'power2.out'
        });
      });
      
      btn.addEventListener('mouseleave', () => {
        gsap.to(btn, {
          scale: 1,
          y: 0,
          duration: 0.3,
          ease: 'power2.out'
        });
      });
    });
    
    // Card hover effects (professional law firm pattern)
    const cards = document.querySelectorAll('.card, .practice-area-card, .service-card, .demo-card');
    cards.forEach(card => {
      // Create shadow element if it doesn't exist
      if (!card.querySelector('.card-shadow')) {
        const shadow = document.createElement('div');
        shadow.className = 'card-shadow';
        shadow.style.cssText = `
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(252, 90, 43, 0.1);
          opacity: 0;
          pointer-events: none;
          z-index: -1;
          border-radius: inherit;
        `;
        card.style.position = 'relative';
        card.appendChild(shadow);
      }
      
      card.addEventListener('mouseenter', () => {
        gsap.timeline()
          .to(card, {
            y: -8,
            scale: 1.02,
            duration: 0.4,
            ease: 'power2.out'
          })
          .to(card.querySelector('.card-shadow'), {
            opacity: 1,
            duration: 0.3
          }, 0);
      });
      
      card.addEventListener('mouseleave', () => {
        gsap.timeline()
          .to(card, {
            y: 0,
            scale: 1,
            duration: 0.4,
            ease: 'power2.out'
          })
          .to(card.querySelector('.card-shadow'), {
            opacity: 0,
            duration: 0.3
          }, 0);
      });
    });
    
    // Link hover effects (professional underline animation)
    const links = document.querySelectorAll('a:not(.btn):not(.button):not(.menu-item a)');
    links.forEach(link => {
      if (!link.querySelector('.link-underline')) {
        const underline = document.createElement('div');
        underline.className = 'link-underline';
        underline.style.cssText = `
          position: absolute;
          bottom: 0;
          left: 0;
          width: 0;
          height: 1px;
          background: var(--color-theme-primary, #fc5a2b);
          transition: width 0.3s ease;
        `;
        link.style.position = 'relative';
        link.style.overflow = 'hidden';
        link.appendChild(underline);
      }
      
      link.addEventListener('mouseenter', () => {
        gsap.to(link.querySelector('.link-underline'), {
          width: '100%',
          duration: 0.3,
          ease: 'power2.out'
        });
      });
      
      link.addEventListener('mouseleave', () => {
        gsap.to(link.querySelector('.link-underline'), {
          width: '0%',
          duration: 0.3,
          ease: 'power2.out'
        });
      });
    });
    
    // Image hover effects (professional zoom)
    const images = document.querySelectorAll('.hover-zoom img, .portfolio-item img');
    images.forEach(img => {
      const container = img.closest('.image-container') || img.parentElement;
      container.style.overflow = 'hidden';
      
      container.addEventListener('mouseenter', () => {
        gsap.to(img, {
          scale: 1.1,
          duration: 0.6,
          ease: 'power2.out'
        });
      });
      
      container.addEventListener('mouseleave', () => {
        gsap.to(img, {
          scale: 1,
          duration: 0.6,
          ease: 'power2.out'
        });
      });
    });
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