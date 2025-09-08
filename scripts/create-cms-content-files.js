#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const contentDir = path.join(__dirname, '..', 'content');

// Ensure content directory exists
if (!fs.existsSync(contentDir)) {
  fs.mkdirSync(contentDir, { recursive: true });
}

// Define all content files with default data
const contentFiles = {
  // English pages
  'class-action-en.json': {
    pageTitle: "Class Action - Normand PLLC",
    heroTitle: "WE ARE CLASS ACTION",
    heroSubtitle: "Fighting for consumer rights nationwide",
    content: "## Class Action Litigation\n\nNormand PLLC represents consumers in complex class action litigation across the United States. We fight against corporate misconduct and seek justice for those who have been wronged.",
    practiceAreas: [
      {
        title: "Privacy Class Actions",
        description: "Protecting your personal information and privacy rights",
        icon: "🔒"
      },
      {
        title: "Consumer Protection",
        description: "Fighting deceptive business practices and false advertising",
        icon: "🛡️"
      },
      {
        title: "Insurance Disputes",
        description: "Ensuring fair treatment from insurance companies",
        icon: "☂️"
      }
    ]
  },
  
  'privacy-en.json': {
    pageTitle: "Privacy Class Action - Normand PLLC",
    heroTitle: "PRIVACY CLASS ACTION",
    content: "## Your Privacy Rights Matter\n\nIn today's digital age, protecting your personal information is more important than ever. We fight for consumers whose privacy rights have been violated.",
    privacyRights: [
      {
        right: "Data Protection",
        description: "Your personal information should be protected from unauthorized access"
      },
      {
        right: "Notice & Consent",
        description: "Companies must inform you about data collection and get your consent"
      },
      {
        right: "Access & Control",
        description: "You have the right to access and control your personal data"
      }
    ]
  },
  
  'consumer-en.json': {
    pageTitle: "Consumer Protection - Normand PLLC",
    heroTitle: "CONSUMER PROTECTION",
    content: "## Standing Up for Consumer Rights\n\nWe represent consumers who have been victims of unfair, deceptive, or fraudulent business practices.",
    protectionAreas: [
      {
        area: "False Advertising",
        description: "Holding companies accountable for misleading marketing claims"
      },
      {
        area: "Product Defects",
        description: "Seeking compensation for dangerous or defective products"
      },
      {
        area: "Unfair Practices",
        description: "Fighting against deceptive business practices"
      }
    ]
  },
  
  'insurance-en.json': {
    pageTitle: "Insurance Class Action - Normand PLLC",
    heroTitle: "INSURANCE CLASS ACTION",
    content: "## Fighting for Policyholders\n\nWhen insurance companies fail to honor their obligations, we fight for the benefits you deserve.",
    insuranceTypes: [
      {
        type: "Health Insurance",
        description: "Denials of legitimate medical claims"
      },
      {
        type: "Property Insurance",
        description: "Underpayment or denial of property damage claims"
      },
      {
        type: "Life Insurance",
        description: "Wrongful denial of life insurance benefits"
      }
    ]
  },
  
  'team-en.json': {
    pageTitle: "Our Team - Normand PLLC",
    heroTitle: "OUR TEAM",
    teamMembers: [
      {
        name: "Edmund Normand",
        position: "Founding Partner",
        bio: "Edmund Normand has been practicing law since 1991, specializing in class action litigation and consumer protection. He has successfully represented thousands of consumers in complex litigation matters.",
        photo: "/images/edmund-normand.jpg",
        linkedin: "https://linkedin.com/in/edmund-normand"
      }
    ]
  },
  
  'news-en.json': {
    pageTitle: "News & Articles - Normand PLLC",
    heroTitle: "NEWS & ARTICLES",
    articles: [
      {
        title: "New Privacy Class Action Filed",
        date: "2025-01-15T00:00:00Z",
        author: "Normand PLLC",
        excerpt: "We have filed a new class action lawsuit regarding data privacy violations.",
        content: "Full article content here...",
        image: "/images/news-1.jpg"
      }
    ]
  },
  
  'contact-en.json': {
    pageTitle: "Contact Us - Normand PLLC",
    heroTitle: "CONTACT US",
    formTitle: "Get in Touch",
    formDescription: "Have a question or need legal assistance? Contact us today for a free consultation.",
    locations: [
      {
        city: "Orlando",
        address: "3165 McCrory Place Suite 175, Orlando, FL 32803",
        phone: "407-603-6031",
        email: "office@normandpllc.com"
      }
    ]
  },
  
  'disclaimer-en.json': {
    pageTitle: "Disclaimer - Normand PLLC",
    content: "## Legal Disclaimer\n\nThe information provided on this website is for general informational purposes only and should not be construed as legal advice. No attorney-client relationship is formed by accessing or using this website."
  },
  
  'privacy-policy-en.json': {
    pageTitle: "Privacy Policy - Normand PLLC",
    lastUpdated: "2025-01-01",
    content: "## Privacy Policy\n\nThis privacy policy explains how we collect, use, and protect your personal information when you use our website.\n\n### Information We Collect\n\nWe may collect personal information that you provide to us directly..."
  },
  
  // Russian pages
  'class-action-ru.json': {
    pageTitle: "Коллективные иски - Normand PLLC",
    heroTitle: "МЫ - КОЛЛЕКТИВНЫЕ ИСКИ",
    heroSubtitle: "Защита прав потребителей по всей стране",
    content: "## Коллективные иски\n\nNormand PLLC представляет интересы потребителей в сложных коллективных исках по всей территории США.",
    practiceAreas: [
      {
        title: "Коллективные иски о конфиденциальности",
        description: "Защита вашей личной информации и прав на конфиденциальность",
        icon: "🔒"
      },
      {
        title: "Защита потребителей",
        description: "Борьба с обманной деловой практикой",
        icon: "🛡️"
      },
      {
        title: "Страховые споры",
        description: "Обеспечение справедливого обращения со стороны страховых компаний",
        icon: "☂️"
      }
    ]
  },
  
  'privacy-ru.json': {
    pageTitle: "Конфиденциальность - Normand PLLC",
    heroTitle: "ЗАЩИТА КОНФИДЕНЦИАЛЬНОСТИ",
    content: "## Ваши права на конфиденциальность важны\n\nВ современную цифровую эпоху защита вашей личной информации важнее, чем когда-либо.",
    privacyRights: [
      {
        right: "Защита данных",
        description: "Ваша личная информация должна быть защищена от несанкционированного доступа"
      },
      {
        right: "Уведомление и согласие",
        description: "Компании должны информировать вас о сборе данных"
      },
      {
        right: "Доступ и контроль",
        description: "У вас есть право на доступ и контроль над вашими личными данными"
      }
    ]
  },
  
  'consumer-ru.json': {
    pageTitle: "Защита потребителей - Normand PLLC",
    heroTitle: "ЗАЩИТА ПОТРЕБИТЕЛЕЙ",
    content: "## Защита прав потребителей\n\nМы представляем потребителей, ставших жертвами несправедливой или мошеннической деловой практики.",
    protectionAreas: [
      {
        area: "Ложная реклама",
        description: "Привлечение компаний к ответственности за вводящие в заблуждение маркетинговые заявления"
      },
      {
        area: "Дефекты продукции",
        description: "Получение компенсации за опасные или дефектные продукты"
      },
      {
        area: "Несправедливая практика",
        description: "Борьба с обманной деловой практикой"
      }
    ]
  },
  
  'insurance-ru.json': {
    pageTitle: "Страховые иски - Normand PLLC",
    heroTitle: "СТРАХОВЫЕ ИСКИ",
    content: "## Борьба за держателей полисов\n\nКогда страховые компании не выполняют свои обязательства, мы боремся за выплаты, которые вы заслуживаете.",
    insuranceTypes: [
      {
        type: "Медицинское страхование",
        description: "Отказы в законных медицинских требованиях"
      },
      {
        type: "Страхование имущества",
        description: "Недоплата или отказ в возмещении ущерба имуществу"
      },
      {
        type: "Страхование жизни",
        description: "Неправомерный отказ в выплате страховых пособий"
      }
    ]
  },
  
  'team-ru.json': {
    pageTitle: "Наша команда - Normand PLLC",
    heroTitle: "НАША КОМАНДА",
    teamMembers: [
      {
        name: "Эдмунд Норманд",
        position: "Основатель и партнер",
        bio: "Эдмунд Норманд практикует право с 1991 года, специализируясь на коллективных исках и защите потребителей.",
        photo: "/images/edmund-normand.jpg",
        linkedin: "https://linkedin.com/in/edmund-normand"
      }
    ]
  },
  
  'news-ru.json': {
    pageTitle: "Новости и статьи - Normand PLLC",
    heroTitle: "НОВОСТИ И СТАТЬИ",
    articles: [
      {
        title: "Подан новый коллективный иск о конфиденциальности",
        date: "2025-01-15T00:00:00Z",
        author: "Normand PLLC",
        excerpt: "Мы подали новый коллективный иск в связи с нарушениями конфиденциальности данных.",
        content: "Полный текст статьи здесь...",
        image: "/images/news-1.jpg"
      }
    ]
  },
  
  'contact-ru.json': {
    pageTitle: "Контакты - Normand PLLC",
    heroTitle: "СВЯЖИТЕСЬ С НАМИ",
    formTitle: "Связаться",
    formDescription: "Есть вопросы или нужна юридическая помощь? Свяжитесь с нами сегодня для бесплатной консультации.",
    locations: [
      {
        city: "Орландо",
        address: "3165 McCrory Place Suite 175, Orlando, FL 32803",
        phone: "407-603-6031",
        email: "office@normandpllc.com"
      }
    ]
  },
  
  'disclaimer-ru.json': {
    pageTitle: "Отказ от ответственности - Normand PLLC",
    content: "## Юридический отказ от ответственности\n\nИнформация, представленная на этом веб-сайте, предназначена только для общих информационных целей и не должна рассматриваться как юридическая консультация."
  },
  
  'privacy-policy-ru.json': {
    pageTitle: "Политика конфиденциальности - Normand PLLC",
    lastUpdated: "2025-01-01",
    content: "## Политика конфиденциальности\n\nЭта политика конфиденциальности объясняет, как мы собираем, используем и защищаем вашу личную информацию при использовании нашего веб-сайта."
  }
};

// Create all JSON files
Object.entries(contentFiles).forEach(([filename, content]) => {
  const filepath = path.join(contentDir, filename);
  
  // Only create if file doesn't exist
  if (!fs.existsSync(filepath)) {
    fs.writeFileSync(filepath, JSON.stringify(content, null, 2));
    console.log(`✅ Created: ${filename}`);
  } else {
    console.log(`⏭️  Skipped (exists): ${filename}`);
  }
});

console.log('\n✨ All content files created successfully!');
console.log('📝 The CMS will now show all pages in both English and Russian collections.');