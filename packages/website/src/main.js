// AIGHT Website - Memphis Design SPA
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initAnimations();
  initTabs();
  initSmoothScroll();
  initMobileMenu();
  initParallax();
});

// Navigation scroll effect
function initNavigation() {
  const navbar = document.getElementById('navbar');
  let lastScrollY = 0;

  window.addEventListener('scroll', () => {
    const currentScrollY = window.scrollY;
    
    if (currentScrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    lastScrollY = currentScrollY;
  });
}

// GSAP Animations
function initAnimations() {
  // Hero animations
  gsap.from('.hero-badge', {
    duration: 1,
    y: -50,
    opacity: 0,
    rotate: -10,
    ease: 'bounce.out',
    delay: 0.5
  });

  gsap.from('.hero-title .title-line', {
    duration: 1,
    y: 50,
    opacity: 0,
    stagger: 0.2,
    ease: 'power3.out',
    delay: 0.8
  });

  gsap.from('.hero-description', {
    duration: 1,
    y: 30,
    opacity: 0,
    ease: 'power2.out',
    delay: 1.4
  });

  gsap.from('.hero-actions .btn', {
    duration: 0.8,
    scale: 0,
    rotate: -180,
    stagger: 0.2,
    ease: 'back.out(1.7)',
    delay: 1.6
  });

  gsap.from('.hero-stats .stat', {
    duration: 1,
    y: 50,
    opacity: 0,
    stagger: 0.1,
    ease: 'power2.out',
    delay: 2
  });

  // Floating shapes animation
  const shapes = document.querySelectorAll('.shape');
  shapes.forEach((shape, index) => {
    gsap.to(shape, {
      y: 'random(-30, 30)',
      x: 'random(-30, 30)',
      duration: 'random(3, 6)',
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
      delay: index * 0.5
    });
  });

  // Feature cards scroll animation
  gsap.utils.toArray('.feature-card').forEach((card, index) => {
    gsap.from(card, {
      scrollTrigger: {
        trigger: card,
        start: 'top 80%',
        end: 'bottom 20%',
        toggleActions: 'play none none reverse'
      },
      duration: 0.8,
      y: 50,
      opacity: 0,
      rotate: index % 2 === 0 ? -5 : 5,
      stagger: 0.1,
      ease: 'power2.out'
    });
  });

  // Steps animation
  gsap.utils.toArray('.step').forEach((step, index) => {
    gsap.from(step, {
      scrollTrigger: {
        trigger: step,
        start: 'top 80%',
        toggleActions: 'play none none reverse'
      },
      duration: 0.8,
      x: index % 2 === 0 ? -100 : 100,
      opacity: 0,
      rotate: index % 2 === 0 ? -10 : 10,
      ease: 'power2.out'
    });
  });

  // Provider cards hover effect
  const providerCards = document.querySelectorAll('.provider-card');
  providerCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
      gsap.to(card, {
        duration: 0.3,
        scale: 1.05,
        rotate: 2,
        ease: 'power2.out'
      });
    });

    card.addEventListener('mouseleave', () => {
      gsap.to(card, {
        duration: 0.3,
        scale: 1,
        rotate: 0,
        ease: 'power2.out'
      });
    });
  });

  // CTA animation
  gsap.from('.cta-content', {
    scrollTrigger: {
      trigger: '.cta',
      start: 'top 80%',
      toggleActions: 'play none none reverse'
    },
    duration: 1,
    y: 50,
    opacity: 0,
    ease: 'power2.out'
  });
}

// Tab functionality
function initTabs() {
  const tabButtons = document.querySelectorAll('.tab-button');
  const tabContents = document.querySelectorAll('.tab-content');

  tabButtons.forEach(button => {
    button.addEventListener('click', () => {
      const tabName = button.dataset.tab;

      // Remove active class from all
      tabButtons.forEach(btn => btn.classList.remove('active'));
      tabContents.forEach(content => content.classList.remove('active'));

      // Add active class to clicked
      button.classList.add('active');
      document.getElementById(tabName).classList.add('active');

      // Animate the new content
      gsap.fromTo(`#${tabName}`, 
        {
          y: 20,
          opacity: 0
        },
        {
          duration: 0.5,
          y: 0,
          opacity: 1,
          ease: 'power2.out'
        }
      );
    });
  });
}

// Smooth scroll for anchor links
function initSmoothScroll() {
  const links = document.querySelectorAll('a[href^="#"]');
  
  links.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = link.getAttribute('href');
      const targetSection = document.querySelector(targetId);
      
      if (targetSection) {
        const offsetTop = targetSection.offsetTop - 80;
        
        gsap.to(window, {
          duration: 1,
          scrollTo: offsetTop,
          ease: 'power2.inOut'
        });
      }
    });
  });
}

// Mobile menu toggle
function initMobileMenu() {
  const navToggle = document.querySelector('.nav-toggle');
  const navMenu = document.querySelector('.nav-menu');
  let isOpen = false;

  navToggle?.addEventListener('click', () => {
    isOpen = !isOpen;
    
    if (isOpen) {
      navMenu.style.display = 'flex';
      navMenu.style.position = 'absolute';
      navMenu.style.top = '100%';
      navMenu.style.left = '0';
      navMenu.style.right = '0';
      navMenu.style.flexDirection = 'column';
      navMenu.style.background = 'var(--color-white)';
      navMenu.style.borderBottom = '3px solid var(--color-black)';
      navMenu.style.padding = 'var(--space-md)';
      
      gsap.from(navMenu, {
        duration: 0.3,
        y: -20,
        opacity: 0,
        ease: 'power2.out'
      });

      // Animate hamburger to X
      gsap.to(navToggle.children[0], {
        duration: 0.3,
        rotate: 45,
        y: 7
      });
      gsap.to(navToggle.children[1], {
        duration: 0.3,
        opacity: 0
      });
      gsap.to(navToggle.children[2], {
        duration: 0.3,
        rotate: -45,
        y: -7
      });
    } else {
      gsap.to(navMenu, {
        duration: 0.3,
        opacity: 0,
        onComplete: () => {
          navMenu.style.display = '';
          navMenu.style.position = '';
          navMenu.style.opacity = '';
        }
      });

      // Animate X back to hamburger
      gsap.to(navToggle.children[0], {
        duration: 0.3,
        rotate: 0,
        y: 0
      });
      gsap.to(navToggle.children[1], {
        duration: 0.3,
        opacity: 1
      });
      gsap.to(navToggle.children[2], {
        duration: 0.3,
        rotate: 0,
        y: 0
      });
    }
  });
}

// Parallax effects
function initParallax() {
  // Hero shapes parallax
  gsap.utils.toArray('.hero-bg .shape').forEach((shape, index) => {
    gsap.to(shape, {
      scrollTrigger: {
        trigger: '.hero',
        start: 'top top',
        end: 'bottom top',
        scrub: 1 + index * 0.5
      },
      y: -100 * (index + 1),
      ease: 'none'
    });
  });

  // CTA shapes parallax
  gsap.to('.cta-shape-1', {
    scrollTrigger: {
      trigger: '.cta',
      start: 'top bottom',
      end: 'bottom top',
      scrub: 2
    },
    y: -150,
    rotate: 45,
    ease: 'none'
  });

  gsap.to('.cta-shape-2', {
    scrollTrigger: {
      trigger: '.cta',
      start: 'top bottom',
      end: 'bottom top',
      scrub: 3
    },
    y: -100,
    rotate: -45,
    ease: 'none'
  });
}

// Add typewriter effect for hero title
function typewriterEffect() {
  const titleLines = document.querySelectorAll('.hero-title .title-line');
  
  titleLines.forEach((line, index) => {
    const text = line.textContent;
    line.textContent = '';
    line.style.visibility = 'visible';
    
    let charIndex = 0;
    const typeInterval = setInterval(() => {
      if (charIndex < text.length) {
        line.textContent += text[charIndex];
        charIndex++;
      } else {
        clearInterval(typeInterval);
      }
    }, 50);
  });
}

// Add confetti effect on CTA button click
function confettiEffect() {
  const ctaButtons = document.querySelectorAll('.cta .btn-primary');
  
  ctaButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Create confetti particles
      for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div');
        particle.style.position = 'fixed';
        particle.style.width = '10px';
        particle.style.height = '10px';
        particle.style.background = `hsl(${Math.random() * 360}, 100%, 50%)`;
        particle.style.left = button.getBoundingClientRect().left + button.offsetWidth / 2 + 'px';
        particle.style.top = button.getBoundingClientRect().top + button.offsetHeight / 2 + 'px';
        particle.style.pointerEvents = 'none';
        particle.style.zIndex = '9999';
        document.body.appendChild(particle);

        gsap.to(particle, {
          duration: 1 + Math.random(),
          x: (Math.random() - 0.5) * 300,
          y: (Math.random() - 0.5) * 300,
          opacity: 0,
          scale: 0,
          ease: 'power2.out',
          onComplete: () => particle.remove()
        });
      }
    });
  });
}

// Initialize confetti on load
confettiEffect();

// Add cursor follow effect for hero section
function cursorFollowEffect() {
  const hero = document.querySelector('.hero');
  const cursor = document.createElement('div');
  cursor.className = 'custom-cursor';
  cursor.style.cssText = `
    position: fixed;
    width: 20px;
    height: 20px;
    border: 3px solid var(--color-primary);
    border-radius: 50%;
    pointer-events: none;
    z-index: 9999;
    transition: transform 0.1s ease;
    display: none;
  `;
  document.body.appendChild(cursor);

  hero?.addEventListener('mousemove', (e) => {
    cursor.style.display = 'block';
    cursor.style.left = e.clientX - 10 + 'px';
    cursor.style.top = e.clientY - 10 + 'px';
  });

  hero?.addEventListener('mouseleave', () => {
    cursor.style.display = 'none';
  });

  // Scale cursor on hover over buttons
  const buttons = document.querySelectorAll('.btn');
  buttons.forEach(button => {
    button.addEventListener('mouseenter', () => {
      cursor.style.transform = 'scale(2)';
    });
    button.addEventListener('mouseleave', () => {
      cursor.style.transform = 'scale(1)';
    });
  });
}

// Initialize cursor effect
cursorFollowEffect();