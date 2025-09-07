// Content Management System for Static Site
// Loads JSON content and injects into DOM before animations

class ContentManager {
  constructor() {
    this.currentLanguage = this.getStoredLanguage() || 'en';
    this.content = null;
    this.contentUrls = {
      en: 'content/site-content.json',
      ru: 'content/site-content-ru.json'
    };
  }

  getStoredLanguage() {
    return localStorage.getItem('siteLanguage') || 'en';
  }

  setLanguage(lang) {
    this.currentLanguage = lang;
    localStorage.setItem('siteLanguage', lang);
    return this.loadContent();
  }

  async loadContent() {
    try {
      // Get the appropriate content URL based on current language
      const contentUrl = this.contentUrls[this.currentLanguage] || this.contentUrls.en;
      
      // Add cache-busting parameter to prevent browser caching
      const cacheBuster = `?v=${Date.now()}`;
      const response = await fetch(contentUrl + cacheBuster);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      this.content = await response.json();
      console.log(`✅ Content loaded successfully (${this.currentLanguage})`, this.content);
      return this.content;
    } catch (error) {
      console.error('❌ Error loading content:', error);
      // Use default content if JSON fails to load
      this.content = this.getDefaultContent();
      console.log('📝 Using default content', this.content);
      return this.content;
    }
  }

  injectContent() {
    if (!this.content) {
      console.warn('No content loaded');
      return;
    }

    // Inject Hero Content
    this.injectHero();
    
    // Inject Services Content
    this.injectServices();
    
    // Inject Case Studies
    this.injectCaseStudies();
    
    // Inject Testimonial
    this.injectTestimonial();
    
    // Inject Team
    this.injectTeam();
    
    // Inject Contact
    this.injectContact();
    
    // Inject Footer
    this.injectFooter();
    
    // Inject Navigation
    this.injectNavigation();

    console.log('✅ Content injected into DOM');
  }

  injectHero() {
    const hero = this.content.hero;
    const heroTagline = document.querySelector('.hero-tagline');
    const heroSubtitle = document.querySelector('.hero-subtitle');
    const heroTitle = document.querySelector('.hero-title');
    const heroSecondary = document.querySelector('.hero-secondary');
    const heroPortrait = document.querySelector('.hero-portrait');

    console.log('🎯 Injecting hero content:', {
      tagline: hero.tagline,
      subtitle: hero.subtitle,
      title: hero.title,
      scrollText: hero.scrollText
    });

    if (heroTagline) {
      console.log(`📝 Updating tagline from "${heroTagline.textContent}" to "${hero.tagline}"`);
      heroTagline.textContent = hero.tagline;
    }
    if (heroSubtitle) {
      console.log(`📝 Updating subtitle from "${heroSubtitle.textContent}" to "${hero.subtitle}"`);
      heroSubtitle.textContent = hero.subtitle;
    }
    if (heroTitle) {
      console.log(`📝 Updating title from "${heroTitle.textContent}" to "${hero.title}"`);
      heroTitle.textContent = hero.title;
    }
    if (heroSecondary) heroSecondary.textContent = hero.scrollText;
    
    // Inject hero portrait image
    if (heroPortrait && hero.portraitImage) {
      heroPortrait.style.backgroundImage = `url('${hero.portraitImage}')`;
      heroPortrait.style.backgroundSize = 'cover';
      heroPortrait.style.backgroundPosition = 'center';
    }
  }

  injectServices() {
    const services = this.content.services;
    
    // Service section label and title
    const sectionLabel = document.querySelector('.service-intro div');
    const serviceTitle = document.querySelector('.service-intro h2');
    const serviceDescription = document.querySelector('.service-intro p');
    
    if (sectionLabel) sectionLabel.textContent = services.sectionLabel;
    if (serviceTitle) serviceTitle.textContent = services.title;
    if (serviceDescription) serviceDescription.textContent = services.description;

    // Service cards
    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach((card, index) => {
      if (services.cards[index]) {
        const serviceData = services.cards[index];
        const icon = card.querySelector('.service-icon');
        const title = card.querySelector('h3');
        const description = card.querySelector('p');

        // Update icon class and content
        if (icon) {
          icon.className = `service-icon ${this.getIconClass(serviceData.icon)}`;
        }
        if (title) title.textContent = serviceData.title;
        if (description) description.textContent = serviceData.description;
      }
    });
  }

  injectCaseStudies() {
    const caseStudies = this.content.caseStudies;
    const title = document.querySelector('.case-studies h2');
    const statNumber = document.querySelector('.stat-number');
    
    // Fix invalid CSS selectors - :contains() is not valid CSS
    const wonCases = Array.from(document.querySelectorAll('.case-studies div')).find(el => 
      el.textContent.includes('Won Cases')
    );
    const yearsRange = Array.from(document.querySelectorAll('.case-studies div')).find(el => 
      el.textContent.includes('2021') || el.textContent.includes('2024')
    );

    console.log('🎯 Injecting case studies content:', caseStudies);

    if (title) title.textContent = caseStudies.title;
    if (statNumber) statNumber.textContent = caseStudies.wonCases;
    if (wonCases) wonCases.textContent = "Won Cases";
    if (yearsRange) yearsRange.textContent = caseStudies.yearsRange;
  }

  injectTestimonial() {
    const testimonial = this.content.testimonial;
    const quote = document.querySelector('.quote');
    const attribution = document.querySelector('.testimonial div:last-child');

    if (quote) quote.textContent = `"${testimonial.quote}"`;
    if (attribution) attribution.textContent = testimonial.attribution;
  }

  injectTeam() {
    const team = this.content.team;
    const title = document.querySelector('.team-section h2');
    
    if (title) title.textContent = team.title;

    // Team members
    const teamMembers = document.querySelectorAll('.team-member');
    teamMembers.forEach((member, index) => {
      if (team.members[index]) {
        const memberData = team.members[index];
        const name = member.querySelector('h3');
        const bio = member.querySelector('p');
        const photo = member.querySelector('.member-photo');

        if (name) name.textContent = memberData.name;
        if (bio) bio.textContent = memberData.bio;
        
        // Inject member photo
        if (photo && memberData.photo) {
          photo.style.backgroundImage = `url('${memberData.photo}')`;
          photo.style.backgroundSize = 'cover';
          photo.style.backgroundPosition = 'center';
        }
      }
    });
  }

  injectContact() {
    const contact = this.content.contact;
    const contactInfo = document.querySelector('.contact-info');
    
    if (contactInfo) {
      contactInfo.innerHTML = `
        <h2>${contact.title}</h2>
        <p><strong>${contact.office}</strong></p>
        <p>Phone: ${contact.phone}</p>
        <p>Email: ${contact.email}</p>
        <p>Fax: ${contact.fax}</p>
        <p>Address: ${contact.address}</p>
      `;
    }
  }

  injectFooter() {
    const footer = this.content.footer;
    const footerContent = document.querySelector('.site-footer .content-container');
    
    if (footerContent) {
      footerContent.innerHTML = `
        <p>${footer.copyright}</p>
        <p>${footer.credit}</p>
      `;
    }
  }

  injectNavigation() {
    const navigation = this.content.navigation;
    const navMenu = document.querySelector('.nav-menu');
    
    if (navMenu && navigation.items) {
      // Clear existing nav items
      navMenu.innerHTML = '';
      
      // Create navigation items
      navigation.items.forEach(item => {
        const link = document.createElement('a');
        link.href = item.href;
        link.textContent = item.label;
        navMenu.appendChild(link);
      });
    }
  }

  getIconClass(emoji) {
    const iconMap = {
      '🔒': 'privacy',
      '🛡️': 'consumer', 
      '☂️': 'insurance'
    };
    return iconMap[emoji] || 'default';
  }

  getDefaultContent() {
    // Fallback content in case JSON fails to load
    return {
      hero: {
        tagline: "NORMAND",
        subtitle: "EXPERTS IN CLASS ACTION", 
        title: "WE ARE RESULTS",
        scrollText: "SCROLL DOWN ↓",
        portraitImage: ""
      },
      services: {
        sectionLabel: "OUR SERVICES",
        title: "WE ARE CLASS ACTION",
        description: "Normand PLLC attorneys represent consumers around the world in important and often unprecedented complex class actions.",
        cards: [
          {
            icon: "🔒",
            title: "Privacy Class Action",
            description: "You have a right to privacy in your home, in your personal life and with your private information."
          },
          {
            icon: "🛡️",
            title: "Consumer Protection Class Action", 
            description: "False advertising, bait and switch practices, unconscionable or illegal pricing schemes, deceptive credit reporting, identity theft, violations of consumer protection laws, debt collection violations, and other consumer rights violations."
          },
          {
            icon: "☂️",
            title: "Insurance Class Action",
            description: "When you pay your insurance premium and the time comes to make a claim you have a right to any and all benefits provided by the insurance policy."
          }
        ]
      },
      caseStudies: {
        title: "Case Studies",
        wonCases: "5",
        yearsRange: "2021 - 2024"
      },
      testimonial: {
        quote: "We are not insular: we are compassion. We know that when one is cheated we all suffer.",
        attribution: "Client testimonial"
      },
      team: {
        title: "Our Team",
        members: [
          {
            name: "Edmund Normand",
            bio: "Edmund Normand started his practice in 1991, specializing in personal injury law.",
            photo: ""
          }
        ]
      },
      contact: {
        title: "Contact Information",
        office: "Orlando Office:",
        phone: "407-603-6031",
        email: "office@normandpllc.com", 
        fax: "888-974-2175",
        address: "3165 McCrory Place Suite 175, Orlando, FL 32803"
      },
      footer: {
        copyright: "Copyright © Normand PLLC 2025",
        credit: "Website by ultramodern ✨"
      }
    };
  }

  // Method to update content and refresh display
  async updateContent(newContent) {
    this.content = newContent;
    this.injectContent();
    
    // Optionally restart animations after content update
    if (window.startPageAnimations) {
      window.startPageAnimations();
    }
  }

  // Save content back to JSON (for admin interfaces)
  async saveContent() {
    try {
      const response = await fetch('/api/save-content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(this.content)
      });
      
      if (response.ok) {
        console.log('✅ Content saved successfully');
      } else {
        throw new Error('Failed to save content');
      }
    } catch (error) {
      console.error('❌ Error saving content:', error);
    }
  }
}

// Export for use in other files
window.ContentManager = ContentManager;