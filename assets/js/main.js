/**
 * HOMEHAVEN WATCH — Vacation Home Watch & Property Check Service
 * Core JavaScript Engine & Interactive Components
 * Version: 1.0.0
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // -------------------------------------------------------------------------
  // 1. Theme Toggle System (Light / Dark Mode)
  // -------------------------------------------------------------------------
  const themeToggleBtns = document.querySelectorAll('.theme-toggle-btn');
  const storedTheme = localStorage.getItem('homehaven_theme');
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)');

  function getActiveTheme() {
    if (storedTheme) {
      return storedTheme;
    }
    return systemPrefersDark.matches ? 'dark' : 'light';
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-bs-theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('homehaven_theme', theme);

    themeToggleBtns.forEach(btn => {
      const icon = btn.querySelector('i');
      if (icon) {
        if (theme === 'dark') {
          icon.className = 'bi bi-sun-fill';
          btn.setAttribute('aria-label', 'Switch to light mode');
          btn.setAttribute('title', 'Switch to light mode');
        } else {
          icon.className = 'bi bi-moon-stars-fill';
          btn.setAttribute('aria-label', 'Switch to dark mode');
          btn.setAttribute('title', 'Switch to dark mode');
        }
      }
    });
  }

  // Initialize theme
  applyTheme(getActiveTheme());

  // Listen to toggle clicks
  themeToggleBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const currentTheme = document.documentElement.getAttribute('data-bs-theme') || 'light';
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      applyTheme(newTheme);
    });
  });

  // Listen to system preference changes if user has not manually overridden
  systemPrefersDark.addEventListener('change', (e) => {
    if (!localStorage.getItem('homehaven_theme')) {
      applyTheme(e.matches ? 'dark' : 'light');
    }
  });


  // -------------------------------------------------------------------------
  // 2. Navbar Scrolling & Mobile Menu Handling
  // -------------------------------------------------------------------------
  const navbar = document.querySelector('.haven-navbar');
  const navCollapse = document.getElementById('navbarHavenNav');

  function checkNavbarScroll() {
    if (navbar) {
      if (window.scrollY > 40) {
        navbar.classList.add('navbar-scrolled');
      } else {
        navbar.classList.remove('navbar-scrolled');
      }
    }
  }

  window.addEventListener('scroll', checkNavbarScroll, { passive: true });
  checkNavbarScroll();

  // Close mobile menu on outside click or ESC key
  if (navCollapse) {
    document.addEventListener('click', (e) => {
      const isClickInside = navbar && navbar.contains(e.target);
      const isExpanded = navCollapse.classList.contains('show');
      if (!isClickInside && isExpanded && typeof bootstrap !== 'undefined') {
        const bsCollapse = bootstrap.Collapse.getInstance(navCollapse);
        if (bsCollapse) bsCollapse.hide();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navCollapse.classList.contains('show') && typeof bootstrap !== 'undefined') {
        const bsCollapse = bootstrap.Collapse.getInstance(navCollapse);
        if (bsCollapse) bsCollapse.hide();
      }
    });

    // Close on navlink click (except dropdown toggles)
    const directNavLinks = navCollapse.querySelectorAll('.nav-link:not(.dropdown-toggle), .haven-dropdown-item');
    directNavLinks.forEach(link => {
      link.addEventListener('click', () => {
        if (window.innerWidth < 1200 && navCollapse.classList.contains('show') && typeof bootstrap !== 'undefined') {
          const bsCollapse = bootstrap.Collapse.getInstance(navCollapse);
          if (bsCollapse) bsCollapse.hide();
        }
      });
    });
  }


  // -------------------------------------------------------------------------
  // 3. Pricing Tier & Frequency Switcher
  // -------------------------------------------------------------------------
  const pricingSwitchBtns = document.querySelectorAll('.pricing-switch-btn');
  const pricingCards = document.querySelectorAll('.pricing-card');

  if (pricingSwitchBtns.length > 0) {
    pricingSwitchBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        pricingSwitchBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const freq = btn.getAttribute('data-frequency');

        pricingCards.forEach(card => {
          const priceDisplay = card.querySelector('.pricing-val');
          const periodDisplay = card.querySelector('.period-val');
          const checkCountDisplay = card.querySelector('.checks-count-val');

          if (priceDisplay && freq) {
            const price = card.getAttribute(`data-price-${freq}`);
            const period = card.getAttribute(`data-period-${freq}`) || '/month';
            const count = card.getAttribute(`data-checks-${freq}`) || '';

            if (price) priceDisplay.textContent = price;
            if (periodDisplay) periodDisplay.textContent = period;
            if (checkCountDisplay && count) checkCountDisplay.textContent = count;
          }
        });
      });
    });
  }


  // -------------------------------------------------------------------------
  // 4. Interactive Property Watch Checklist
  // -------------------------------------------------------------------------
  const checklistItems = document.querySelectorAll('.checklist-item');
  const checklistProgressBar = document.getElementById('checklistProgress');
  const checklistProgressPercent = document.getElementById('checklistPercent');
  const checklistCountDone = document.getElementById('checklistDoneCount');
  const checklistTotalCount = document.getElementById('checklistTotalCount');
  const resetChecklistBtn = document.getElementById('resetChecklistBtn');

  function updateChecklistStats() {
    if (!checklistItems.length) return;
    const total = checklistItems.length;
    let checked = 0;

    checklistItems.forEach(item => {
      if (item.classList.contains('checked')) {
        checked++;
      }
    });

    const percent = Math.round((checked / total) * 100);

    if (checklistProgressBar) checklistProgressBar.style.width = `${percent}%`;
    if (checklistProgressPercent) checklistProgressPercent.textContent = `${percent}%`;
    if (checklistCountDone) checklistCountDone.textContent = checked;
    if (checklistTotalCount) checklistTotalCount.textContent = total;
  }

  if (checklistItems.length > 0) {
    updateChecklistStats();

    checklistItems.forEach(item => {
      item.addEventListener('click', () => {
        item.classList.toggle('checked');
        const box = item.querySelector('.checklist-checkbox i');
        if (box) {
          if (item.classList.contains('checked')) {
            box.className = 'bi bi-check-lg';
          } else {
            box.className = '';
          }
        }
        updateChecklistStats();
      });
    });

    if (resetChecklistBtn) {
      resetChecklistBtn.addEventListener('click', () => {
        checklistItems.forEach(item => {
          item.classList.remove('checked');
          const box = item.querySelector('.checklist-checkbox i');
          if (box) box.className = '';
        });
        updateChecklistStats();
      });
    }
  }


  // -------------------------------------------------------------------------
  // 5. FAQ Instant Search & Category Filter
  // -------------------------------------------------------------------------
  const faqSearchInput = document.getElementById('faqSearchInput');
  const faqFilterTabs = document.querySelectorAll('.faq-category-btn');
  const faqItems = document.querySelectorAll('.haven-accordion .accordion-item');

  function filterFAQs() {
    if (!faqItems.length) return;
    const searchTerm = (faqSearchInput ? faqSearchInput.value.toLowerCase().trim() : '');
    const activeTab = document.querySelector('.faq-category-btn.active');
    const selectedCategory = activeTab ? activeTab.getAttribute('data-category') : 'all';

    faqItems.forEach(item => {
      const itemCategory = item.getAttribute('data-category') || 'all';
      const questionText = item.querySelector('.accordion-button')?.textContent.toLowerCase() || '';
      const answerText = item.querySelector('.accordion-body')?.textContent.toLowerCase() || '';
      
      const matchesCategory = (selectedCategory === 'all' || itemCategory === selectedCategory);
      const matchesSearch = (!searchTerm || questionText.includes(searchTerm) || answerText.includes(searchTerm));

      if (matchesCategory && matchesSearch) {
        item.style.display = 'block';
      } else {
        item.style.display = 'none';
      }
    });
  }

  if (faqSearchInput) {
    faqSearchInput.addEventListener('input', filterFAQs);
  }

  if (faqFilterTabs.length > 0) {
    faqFilterTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        faqFilterTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        filterFAQs();
      });
    });
  }


  // -------------------------------------------------------------------------
  // 6. Blog Category Filter & Search
  // -------------------------------------------------------------------------
  const blogSearchInput = document.getElementById('blogSearchInput');
  const blogCategoryBtns = document.querySelectorAll('.blog-category-btn');
  const blogArticles = document.querySelectorAll('.blog-article-item');

  function filterBlog() {
    if (!blogArticles.length) return;
    const searchTerm = (blogSearchInput ? blogSearchInput.value.toLowerCase().trim() : '');
    const activeBtn = document.querySelector('.blog-category-btn.active');
    const selectedCat = activeBtn ? activeBtn.getAttribute('data-category') : 'all';

    blogArticles.forEach(article => {
      const articleCat = article.getAttribute('data-category') || '';
      const title = article.querySelector('.blog-title')?.textContent.toLowerCase() || '';
      const desc = article.querySelector('p')?.textContent.toLowerCase() || '';

      const matchesCat = (selectedCat === 'all' || articleCat === selectedCat);
      const matchesQuery = (!searchTerm || title.includes(searchTerm) || desc.includes(searchTerm));

      if (matchesCat && matchesQuery) {
        article.parentElement.style.display = 'block';
      } else {
        article.parentElement.style.display = 'none';
      }
    });
  }

  if (blogSearchInput) {
    blogSearchInput.addEventListener('input', filterBlog);
  }

  if (blogCategoryBtns.length > 0) {
    blogCategoryBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        blogCategoryBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        filterBlog();
      });
    });
  }


  // -------------------------------------------------------------------------
  // 7. Password Visibility Toggle (Login & Signup)
  // -------------------------------------------------------------------------
  const passwordToggles = document.querySelectorAll('.password-toggle-btn');
  passwordToggles.forEach(toggle => {
    toggle.addEventListener('click', () => {
      const input = toggle.parentElement.querySelector('input');
      const icon = toggle.querySelector('i');
      if (input && icon) {
        if (input.type === 'password') {
          input.type = 'text';
          icon.className = 'bi bi-eye-slash';
        } else {
          input.type = 'password';
          icon.className = 'bi bi-eye';
        }
      }
    });
  });


  // -------------------------------------------------------------------------
  // 8. Client-Side Form Validations & Demo Feedback Alerts
  // -------------------------------------------------------------------------
  const validatedForms = document.querySelectorAll('.needs-validation-demo');

  validatedForms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!form.checkValidity()) {
        e.stopPropagation();
        form.classList.add('was-validated');
        return;
      }

      form.classList.add('was-validated');

      // Show interactive demo alert
      const alertBox = form.querySelector('.demo-feedback-alert') || document.getElementById('demoFeedbackAlert');
      if (alertBox) {
        alertBox.classList.remove('d-none');
        alertBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      } else {
        alert('Thank you! Your demo submission has been recorded successfully. (Note: This is a frontend demonstration template)');
      }

      // Reset fields smoothly
      setTimeout(() => {
        form.reset();
        form.classList.remove('was-validated');
      }, 5000);
    });
  });


  // -------------------------------------------------------------------------
  // 9. Back to Top Button
  // -------------------------------------------------------------------------
  const backToTopBtn = document.querySelector('.back-to-top-btn');

  if (backToTopBtn) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 400) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    }, { passive: true });

    backToTopBtn.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }


  // -------------------------------------------------------------------------
  // 10. RTL Layout Compatibility & Toggle System
  // -------------------------------------------------------------------------
  const rtlToggleBtns = document.querySelectorAll('.rtl-toggle-btn');
  const storedDir = localStorage.getItem('homehaven_dir') || 'ltr';

  function applyDir(dir) {
    document.documentElement.setAttribute('dir', dir);
    localStorage.setItem('homehaven_dir', dir);

    rtlToggleBtns.forEach(btn => {
      // Keep only 'RTL' text as requested, and toggle active styling
      btn.textContent = 'RTL';
      if (dir === 'rtl') {
        btn.classList.add('active');
        btn.setAttribute('aria-label', 'Switch to Left-to-Right layout');
        btn.setAttribute('title', 'Currently RTL: Click for LTR');
      } else {
        btn.classList.remove('active');
        btn.setAttribute('aria-label', 'Switch to Right-to-Left layout');
        btn.setAttribute('title', 'Currently LTR: Click for RTL');
      }
    });
  }

  // Initialize Direction
  applyDir(storedDir);

  rtlToggleBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const currentDir = document.documentElement.getAttribute('dir') || 'ltr';
      const newDir = currentDir === 'rtl' ? 'ltr' : 'rtl';
      applyDir(newDir);
    });
  });


  // -------------------------------------------------------------------------
  // 11. Dashboard Interactive Navigation & Features
  // -------------------------------------------------------------------------
  const dashNavLinks = document.querySelectorAll('.dash-nav-link');
  const dashPanels = document.querySelectorAll('.dash-view-panel');
  const dashMobileToggle = document.getElementById('dashMobileSidebarToggle');
  const dashSidebar = document.getElementById('dashboardSidebar');
  const dashCloseMobile = document.getElementById('dashCloseMobileSidebar');

  // Sidebar navigation switching
  if (dashNavLinks.length > 0) {
    dashNavLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        const targetViewId = link.getAttribute('data-target-view');
        if (targetViewId) {
          e.preventDefault();
          dashNavLinks.forEach(l => l.classList.remove('active'));
          link.classList.add('active');

          dashPanels.forEach(panel => {
            if (panel.id === targetViewId) {
              panel.classList.remove('d-none');
            } else {
              panel.classList.add('d-none');
            }
          });

          // Close mobile sidebar if open
          if (dashSidebar && window.innerWidth < 1200) {
            dashSidebar.classList.remove('show-mobile');
          }
        }
      });
    });
  }

  // Mobile sidebar toggles (Tablets < 1200px & Mobile)
  if (dashMobileToggle && dashSidebar) {
    dashMobileToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      e.preventDefault();
      dashSidebar.classList.toggle('show-mobile');
    });
  }

  if (dashCloseMobile && dashSidebar) {
    dashCloseMobile.addEventListener('click', (e) => {
      e.preventDefault();
      dashSidebar.classList.remove('show-mobile');
    });
  }

  // Dismiss dashboard mobile sidebar on click outside or ESC key
  if (dashSidebar) {
    document.addEventListener('click', (e) => {
      if (dashSidebar.classList.contains('show-mobile')) {
        if (!dashSidebar.contains(e.target) && dashMobileToggle && !dashMobileToggle.contains(e.target)) {
          dashSidebar.classList.remove('show-mobile');
        }
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && dashSidebar.classList.contains('show-mobile')) {
        dashSidebar.classList.remove('show-mobile');
      }
    });
  }

  // Photo Lightbox modal demo for Dashboard Reports
  const photoItems = document.querySelectorAll('.dash-photo-item');
  const photoModal = document.getElementById('photoPreviewModal');
  const modalImg = document.getElementById('modalPreviewImage');
  const modalCaption = document.getElementById('modalPreviewCaption');

  if (photoItems.length > 0 && photoModal && modalImg) {
    photoItems.forEach(item => {
      item.addEventListener('click', () => {
        const img = item.querySelector('img');
        const caption = item.querySelector('.dash-photo-title');
        if (img) modalImg.src = img.src;
        if (caption && modalCaption) modalCaption.textContent = caption.textContent;
        if (typeof bootstrap !== 'undefined') {
          const bsModal = new bootstrap.Modal(photoModal);
          bsModal.show();
        }
      });
    });
  }


  // -------------------------------------------------------------------------
  // 12. GSAP Micro-Animations (Respects prefers-reduced-motion)
  // -------------------------------------------------------------------------
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (typeof gsap !== 'undefined' && !prefersReducedMotion) {
    // Fade in hero content
    gsap.from('.hero-anim-item', {
      opacity: 0,
      y: 25,
      duration: 0.8,
      stagger: 0.15,
      ease: 'power2.out',
      delay: 0.1
    });

    // Animate trust items
    gsap.from('.trust-anim-item', {
      opacity: 0,
      y: 15,
      duration: 0.6,
      stagger: 0.1,
      ease: 'power2.out',
      delay: 0.4
    });
  }
});

