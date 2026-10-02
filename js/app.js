/**
 * Xntrova Technologies - Redesign Interactive Engine
 * Modular, vanilla JavaScript implementation with high performance & accessibility
 */

document.addEventListener('DOMContentLoaded', () => {
  initStickyHeader();
  initMobileMenu();
  initSmoothScroll();
  initRoiCalculator();
  initServiceTabs();
  initPortfolioFilters();
  initTestimonialSlider();
  initFaqAccordion();
  initLeadForm();
  initFloatingAssistant();
  initBackToTop();
  initStatCounters();
});

/* ============================================================
   1. STICKY HEADER & NAV SCROLL EFFECT
   ============================================================ */
function initStickyHeader() {
  const header = document.getElementById('main-header');
  if (!header) return;

  const handleScroll = () => {
    if (window.scrollY > 20) {
      header.classList.add('glass-nav-scrolled', 'shadow-sm');
    } else {
      header.classList.remove('glass-nav-scrolled', 'shadow-sm');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
}

/* ============================================================
   2. MOBILE MENU DRAWER
   ============================================================ */
function initMobileMenu() {
  const toggleBtn = document.getElementById('mobile-menu-toggle');
  const closeBtn = document.getElementById('mobile-menu-close');
  const drawer = document.getElementById('mobile-drawer');
  const overlay = document.getElementById('mobile-overlay');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

  if (!toggleBtn || !drawer || !overlay) return;

  const openMenu = () => {
    drawer.classList.remove('translate-x-full');
    overlay.classList.remove('hidden', 'opacity-0');
    overlay.classList.add('opacity-100');
    document.body.style.overflow = 'hidden';
    toggleBtn.setAttribute('aria-expanded', 'true');
  };

  const closeMenu = () => {
    drawer.classList.add('translate-x-full');
    overlay.classList.add('opacity-0');
    setTimeout(() => {
      overlay.classList.add('hidden');
    }, 300);
    document.body.style.overflow = '';
    toggleBtn.setAttribute('aria-expanded', 'false');
  };

  toggleBtn.addEventListener('click', openMenu);
  if (closeBtn) closeBtn.addEventListener('click', closeMenu);
  overlay.addEventListener('click', closeMenu);

  mobileNavLinks.forEach(link => {
    link.addEventListener('click', closeMenu);
  });
}

/* ============================================================
   3. SMOOTH SCROLL WITH HEADER OFFSET
   ============================================================ */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || targetId === '') return;

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        const headerOffset = 80;
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}

/* ============================================================
   4. INTERACTIVE ROI & GROWTH CALCULATOR (Conversion Feature)
   ============================================================ */
function initRoiCalculator() {
  const trafficSlider = document.getElementById('calc-traffic');
  const trafficValue = document.getElementById('calc-traffic-val');
  const industrySelect = document.getElementById('calc-industry');
  const goalSelect = document.getElementById('calc-goal');
  
  const leadsOutput = document.getElementById('calc-leads-output');
  const revenueOutput = document.getElementById('calc-revenue-output');
  const roasOutput = document.getElementById('calc-roas-output');
  const claimBtn = document.getElementById('calc-claim-btn');

  if (!trafficSlider || !trafficValue || !leadsOutput) return;

  const updateCalculations = () => {
    const traffic = parseInt(trafficSlider.value, 10);
    trafficValue.textContent = Number(traffic).toLocaleString('en-IN') + ' visitors/mo';

    const industryMultiplier = parseFloat(industrySelect ? industrySelect.value : 1.0);
    const goalMultiplier = parseFloat(goalSelect ? goalSelect.value : 1.2);

    // Baseline conversion rate: 1.8% to 4.2% depending on industry & optimization
    const baseConversionRate = 0.024 * industryMultiplier * goalMultiplier;
    const projectedLeads = Math.round(traffic * baseConversionRate);
    
    // Average deal size assumptions based on industry
    let avgDealValue = 3500;
    if (industrySelect) {
      if (industrySelect.value === '1.5') avgDealValue = 12000; // B2B SaaS
      if (industrySelect.value === '1.2') avgDealValue = 2500;  // E-Commerce
      if (industrySelect.value === '1.0') avgDealValue = 8500;  // Services/Healthcare
    }

    const estimatedMonthlyUplift = Math.round(projectedLeads * 0.22 * avgDealValue);
    const estimatedRoas = (3.4 * industryMultiplier).toFixed(1) + 'x';

    leadsOutput.textContent = '+' + projectedLeads.toLocaleString('en-IN');
    revenueOutput.textContent = '₹' + (estimatedMonthlyUplift / 1000).toFixed(0) + 'K+';
    roasOutput.textContent = estimatedRoas;
  };

  trafficSlider.addEventListener('input', updateCalculations);
  if (industrySelect) industrySelect.addEventListener('change', updateCalculations);
  if (goalSelect) goalSelect.addEventListener('change', updateCalculations);

  updateCalculations();

  if (claimBtn) {
    claimBtn.addEventListener('click', () => {
      const contactSection = document.getElementById('contact');
      if (contactSection) {
        contactSection.scrollIntoView({ behavior: 'smooth' });
        const messageInput = document.getElementById('form-message');
        const traffic = trafficSlider.value;
        const industryName = industrySelect ? industrySelect.options[industrySelect.selectedIndex].text : 'General';
        if (messageInput) {
          messageInput.value = `I calculated growth potential for ${Number(traffic).toLocaleString()} visitors/month in ${industryName}. I'd like to discuss the roadmap to achieve this.`;
          messageInput.focus();
        }
      }
    });
  }
}

/* ============================================================
   5. SERVICE TABS & FILTERING
   ============================================================ */
function initServiceTabs() {
  const tabs = document.querySelectorAll('.service-tab');
  const serviceCards = document.querySelectorAll('.service-card');

  if (!tabs.length || !serviceCards.length) return;

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active', 'bg-sky-600', 'text-white'));
      tab.classList.add('active');

      const filter = tab.getAttribute('data-filter');

      serviceCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          card.classList.remove('hidden');
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 50);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(12px)';
          setTimeout(() => {
            card.classList.add('hidden');
          }, 200);
        }
      });
    });
  });
}

/* ============================================================
   6. PORTFOLIO / CASE STUDIES FILTERS & MODAL
   ============================================================ */
function initPortfolioFilters() {
  const filterBtns = document.querySelectorAll('.portfolio-tab');
  const portfolioItems = document.querySelectorAll('.portfolio-item');

  if (!filterBtns.length || !portfolioItems.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active', 'bg-sky-600', 'text-white'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      portfolioItems.forEach(item => {
        const category = item.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          item.classList.remove('hidden');
          setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'scale(1)';
          }, 50);
        } else {
          item.style.opacity = '0';
          item.style.transform = 'scale(0.96)';
          setTimeout(() => {
            item.classList.add('hidden');
          }, 200);
        }
      });
    });
  });
}

/* Case study modal preview function (global for onclicks) */
window.openCaseStudyModal = function(title, category, metrics, description, clientLogo) {
  const modal = document.getElementById('case-study-modal');
  if (!modal) return;

  document.getElementById('modal-title').textContent = title;
  document.getElementById('modal-category').textContent = category;
  document.getElementById('modal-metrics').innerHTML = metrics;
  document.getElementById('modal-description').textContent = description;

  modal.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
};

window.closeCaseStudyModal = function() {
  const modal = document.getElementById('case-study-modal');
  if (!modal) return;

  modal.classList.add('hidden');
  document.body.style.overflow = '';
};

/* ============================================================
   7. TESTIMONIAL SLIDER
   ============================================================ */
function initTestimonialSlider() {
  const track = document.getElementById('testimonial-track');
  const prevBtn = document.getElementById('testimonial-prev');
  const nextBtn = document.getElementById('testimonial-next');
  const cards = document.querySelectorAll('.testimonial-slide');
  const dots = document.querySelectorAll('.testimonial-dot');

  if (!track || !cards.length) return;

  let currentIndex = 0;
  const totalSlides = cards.length;

  const updateSlidePosition = () => {
    track.style.transform = `translateX(-${currentIndex * 100}%)`;
    
    dots.forEach((dot, index) => {
      if (index === currentIndex) {
        dot.classList.add('bg-sky-500', 'w-8');
        dot.classList.remove('bg-slate-300', 'w-2.5');
      } else {
        dot.classList.remove('bg-sky-500', 'w-8');
        dot.classList.add('bg-slate-300', 'w-2.5');
      }
    });
  };

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      currentIndex = (currentIndex + 1) % totalSlides;
      updateSlidePosition();
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
      updateSlidePosition();
    });
  }

  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      currentIndex = index;
      updateSlidePosition();
    });
  });

  // Auto-slide every 7 seconds
  let autoSlide = setInterval(() => {
    currentIndex = (currentIndex + 1) % totalSlides;
    updateSlidePosition();
  }, 7000);

  track.addEventListener('mouseenter', () => clearInterval(autoSlide));
  track.addEventListener('mouseleave', () => {
    autoSlide = setInterval(() => {
      currentIndex = (currentIndex + 1) % totalSlides;
      updateSlidePosition();
    }, 7000);
  });
}

/* ============================================================
   8. FAQ ACCORDION
   ============================================================ */
function initFaqAccordion() {
  const faqButtons = document.querySelectorAll('.faq-toggle');

  faqButtons.forEach(button => {
    button.addEventListener('click', () => {
      const parentItem = button.closest('.faq-item');
      const isExpanded = button.getAttribute('aria-expanded') === 'true';

      // Close other open FAQs
      document.querySelectorAll('.faq-item').forEach(item => {
        if (item !== parentItem) {
          item.classList.remove('active');
          const otherBtn = item.querySelector('.faq-toggle');
          if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
        }
      });

      // Toggle current
      if (isExpanded) {
        parentItem.classList.remove('active');
        button.setAttribute('aria-expanded', 'false');
      } else {
        parentItem.classList.add('active');
        button.setAttribute('aria-expanded', 'true');
      }
    });
  });
}

/* ============================================================
   9. HIGH-CONVERSION LEAD CAPTURE FORM
   ============================================================ */
function initLeadForm() {
  const form = document.getElementById('xntrova-lead-form');
  const servicePills = document.querySelectorAll('.service-pill');
  const selectedServiceInput = document.getElementById('selected-service');
  const submitBtn = document.getElementById('form-submit-btn');
  const successModal = document.getElementById('form-success-modal');

  if (!form) return;

  // Multi-choice service pills
  servicePills.forEach(pill => {
    pill.addEventListener('click', () => {
      pill.classList.toggle('active');
      pill.classList.toggle('bg-sky-600');
      pill.classList.toggle('text-white');
      pill.classList.toggle('border-sky-600');

      // Update hidden input with selected values
      const activePills = document.querySelectorAll('.service-pill.active');
      const selected = Array.from(activePills).map(p => p.getAttribute('data-service'));
      if (selectedServiceInput) {
        selectedServiceInput.value = selected.join(', ');
      }
    });
  });

  form.addEventListener('submit', function(e) {
    e.preventDefault();

    // Basic Validation
    const nameInput = document.getElementById('form-name');
    const emailInput = document.getElementById('form-email');
    const phoneInput = document.getElementById('form-phone');

    if (!nameInput.value.trim() || !emailInput.value.trim() || !phoneInput.value.trim()) {
      alert('Please fill in all required fields (Name, Email, and Phone).');
      return;
    }

    // Submit state simulation
    const originalText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = `
      <svg class="animate-spin -ml-1 mr-2 h-5 w-5 text-white inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
      </svg>
      Processing Strategy Session...
    `;

    setTimeout(() => {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalText;
      
      // Open success modal
      if (successModal) {
        successModal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
      } else {
        alert('Thank you! Your growth strategy request has been submitted. Our team will contact you within 2 business hours.');
      }
      form.reset();
      servicePills.forEach(p => p.classList.remove('active', 'bg-sky-600', 'text-white'));
    }, 1200);
  });
}

window.closeSuccessModal = function() {
  const successModal = document.getElementById('form-success-modal');
  if (successModal) {
    successModal.classList.add('hidden');
    document.body.style.overflow = '';
  }
};

/* ============================================================
   10. FLOATING AI STRATEGY ASSISTANT (Interactive Agency Bot)
   ============================================================ */
function initFloatingAssistant() {
  const triggerBtn = document.getElementById('assistant-trigger');
  const widget = document.getElementById('assistant-widget');
  const closeBtn = document.getElementById('assistant-close');
  const chatMessages = document.getElementById('assistant-messages');
  const chatInput = document.getElementById('assistant-input');
  const sendBtn = document.getElementById('assistant-send');
  const quickChips = document.querySelectorAll('.assistant-quick-chip');

  if (!triggerBtn || !widget) return;

  const toggleWidget = () => {
    widget.classList.toggle('hidden');
  };

  triggerBtn.addEventListener('click', toggleWidget);
  if (closeBtn) closeBtn.addEventListener('click', () => widget.classList.add('hidden'));

  const botResponses = {
    'seo': "Our SEO strategies deliver top 3 Google rankings with comprehensive technical audits, Core Web Vitals optimization, and high-authority backlink development.",
    'web': "We build lightning-fast, high-converting responsive web apps with modern stacks like React, Next.js, and WordPress with sub-second page loads.",
    'pricing': "We offer tailored growth packages starting from ₹25,000/mo for SEO/PPC up to full-scale enterprise transformation sprints.",
    'contact': "You can call us directly at +91 868-382-8646 or book a slot via the free consultation form below!"
  };

  const addMessage = (text, isUser = false) => {
    const msgDiv = document.createElement('div');
    msgDiv.className = `flex ${isUser ? 'justify-end' : 'justify-start'} mb-3`;
    msgDiv.innerHTML = `
      <div class="max-w-[82%] px-3.5 py-2.5 rounded-2xl text-xs leading-relaxed ${
        isUser ? 'bg-sky-600 text-white rounded-tr-none' : 'bg-slate-100 text-slate-800 rounded-tl-none border border-slate-200'
      }">
        ${text}
      </div>
    `;
    chatMessages.appendChild(msgDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  };

  const handleSend = (text) => {
    const query = text || (chatInput ? chatInput.value.trim() : '');
    if (!query) return;

    addMessage(query, true);
    if (chatInput) chatInput.value = '';

    setTimeout(() => {
      const lower = query.toLowerCase();
      let reply = "Thanks for asking! An Xntrova strategist can prepare a bespoke proposal for your exact needs. Fill out our quick audit form or tap WhatsApp for instant chat.";
      
      if (lower.includes('seo') || lower.includes('traffic') || lower.includes('google')) {
        reply = botResponses.seo;
      } else if (lower.includes('web') || lower.includes('website') || lower.includes('dev') || lower.includes('app')) {
        reply = botResponses.web;
      } else if (lower.includes('price') || lower.includes('cost') || lower.includes('budget') || lower.includes('package')) {
        reply = botResponses.pricing;
      } else if (lower.includes('call') || lower.includes('phone') || lower.includes('contact')) {
        reply = botResponses.contact;
      }
      
      addMessage(reply, false);
    }, 600);
  };

  if (sendBtn) {
    sendBtn.addEventListener('click', () => handleSend());
  }

  if (chatInput) {
    chatInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') handleSend();
    });
  }

  quickChips.forEach(chip => {
    chip.addEventListener('click', () => {
      handleSend(chip.textContent.trim());
    });
  });
}

/* ============================================================
   11. BACK TO TOP BUTTON
   ============================================================ */
function initBackToTop() {
  const topBtn = document.getElementById('back-to-top');
  if (!topBtn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      topBtn.classList.remove('opacity-0', 'pointer-events-none');
      topBtn.classList.add('opacity-100', 'pointer-events-auto');
    } else {
      topBtn.classList.add('opacity-0', 'pointer-events-none');
      topBtn.classList.remove('opacity-100', 'pointer-events-auto');
    }
  }, { passive: true });

  topBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ============================================================
   12. ANIMATED NUMBER STATS
   ============================================================ */
function initStatCounters() {
  const statElements = document.querySelectorAll('.stat-counter');
  if (!statElements.length) return;

  const animateCounter = (el) => {
    const target = parseInt(el.getAttribute('data-target'), 10);
    const suffix = el.getAttribute('data-suffix') || '';
    const prefix = el.getAttribute('data-prefix') || '';
    const duration = 1800;
    const stepTime = 30;
    const steps = duration / stepTime;
    const increment = target / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        el.textContent = `${prefix}${target}${suffix}`;
        clearInterval(timer);
      } else {
        el.textContent = `${prefix}${Math.floor(current)}${suffix}`;
      }
    }, stepTime);
  };

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  statElements.forEach(el => observer.observe(el));
}
