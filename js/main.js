/**
 * Live Karaoke - Main JavaScript
 * Author: Live Karaoke Астана
 * Description: Main functionality for the website
 */

// ============================================
// DOM Elements
// ============================================
const header = document.getElementById('header');
const mobileMenuToggle = document.getElementById('mobileMenuToggle');
const navMenu = document.getElementById('navMenu');

// ============================================
// Header Scroll Effect
// ============================================
function handleScroll() {
    if (window.scrollY > 100) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
}

window.addEventListener('scroll', handleScroll);

// ============================================
// Mobile Menu Toggle
// ============================================
if (mobileMenuToggle && navMenu) {
    mobileMenuToggle.addEventListener('click', function() {
        navMenu.classList.toggle('active');
        this.classList.toggle('active');

        // Animate hamburger icon
        const spans = this.querySelectorAll('span');
        if (this.classList.contains('active')) {
            spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
            spans[1].style.opacity = '0';
            spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
        } else {
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        }
    });

    // Close menu when clicking on a link
    const navLinks = navMenu.querySelectorAll('a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            mobileMenuToggle.classList.remove('active');

            const spans = mobileMenuToggle.querySelectorAll('span');
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!navMenu.contains(e.target) && !mobileMenuToggle.contains(e.target)) {
            navMenu.classList.remove('active');
            mobileMenuToggle.classList.remove('active');

            const spans = mobileMenuToggle.querySelectorAll('span');
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        }
    });
}

// ============================================
// Smooth Scroll for Internal Links
// ============================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');

        if (targetId === '#') return;

        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            const offsetTop = targetElement.offsetTop - 80; // Account for fixed header
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// ============================================
// Active Navigation Link on Scroll
// ============================================
function highlightActiveSection() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-menu a');

    let currentSection = '';

    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.offsetHeight;

        if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
            currentSection = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSection}`) {
            link.classList.add('active');
        }
    });
}

window.addEventListener('scroll', highlightActiveSection);

// ============================================
// Counter Animation for Stats
// ============================================
function animateCounter(element, target, duration = 2000) {
    const start = 0;
    const increment = target / (duration / 16); // 60fps
    let current = start;

    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target + (element.dataset.suffix || '');
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current) + (element.dataset.suffix || '');
        }
    }, 16);
}

// Trigger counter animation when element is in viewport
function handleCounterAnimation() {
    const counters = document.querySelectorAll('.stat-number');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.dataset.animated) {
                const target = parseInt(entry.target.textContent);
                const suffix = entry.target.textContent.replace(/[0-9]/g, '');
                entry.target.dataset.suffix = suffix;
                animateCounter(entry.target, target);
                entry.target.dataset.animated = 'true';
            }
        });
    }, {
        threshold: 0.5
    });

    counters.forEach(counter => observer.observe(counter));
}

// Initialize counter animation on page load
if (document.querySelector('.stat-number')) {
    handleCounterAnimation();
}

// ============================================
// Card Hover Tilt Effect
// ============================================
function addTiltEffect(cards) {
    cards.forEach(card => {
        card.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;

            this.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;
        });

        card.addEventListener('mouseleave', function() {
            this.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
        });
    });
}

// Apply tilt effect to service cards
const serviceCards = document.querySelectorAll('.service-card');
if (serviceCards.length > 0) {
    addTiltEffect(serviceCards);
}

// ============================================
// Parallax Effect for Hero Section
// ============================================
function handleParallax() {
    const heroGradient = document.querySelector('.hero-gradient');
    if (heroGradient) {
        const scrolled = window.scrollY;
        heroGradient.style.transform = `translateY(${scrolled * 0.5}px)`;
    }
}

window.addEventListener('scroll', handleParallax);

// ============================================
// Quick Actions Visibility
// ============================================
function handleQuickActionsVisibility() {
    const quickActions = document.querySelector('.quick-actions');
    if (quickActions) {
        if (window.scrollY > 300) {
            quickActions.style.opacity = '1';
            quickActions.style.pointerEvents = 'auto';
        } else {
            quickActions.style.opacity = '0';
            quickActions.style.pointerEvents = 'none';
        }
    }
}

window.addEventListener('scroll', handleQuickActionsVisibility);

// Initialize quick actions visibility
document.addEventListener('DOMContentLoaded', () => {
    const quickActions = document.querySelector('.quick-actions');
    if (quickActions) {
        quickActions.style.transition = 'opacity 0.3s ease';
        quickActions.style.opacity = '0';
        quickActions.style.pointerEvents = 'none';
    }
});

// ============================================
// Lazy Loading for Images
// ============================================
function lazyLoadImages() {
    const images = document.querySelectorAll('img[data-src]');

    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                observer.unobserve(img);
            }
        });
    });

    images.forEach(img => imageObserver.observe(img));
}

// Initialize lazy loading on page load
if (document.querySelectorAll('img[data-src]').length > 0) {
    lazyLoadImages();
}

// ============================================
// Form Validation Helper
// ============================================
function validatePhone(phone) {
    // Kazakhstan phone number validation
    const phoneRegex = /^(\+7|7|8)?[\s\-]?\(?[0-9]{3}\)?[\s\-]?[0-9]{3}[\s\-]?[0-9]{2}[\s\-]?[0-9]{2}$/;
    return phoneRegex.test(phone);
}

function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// ============================================
// Show Success/Error Messages
// ============================================
function showMessage(message, type = 'success') {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message-toast message-${type}`;
    messageDiv.textContent = message;

    messageDiv.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        padding: 1rem 1.5rem;
        background: ${type === 'success' ? '#4caf50' : '#f44336'};
        color: white;
        border-radius: 0.5rem;
        box-shadow: 0 5px 20px rgba(0, 0, 0, 0.3);
        z-index: 10000;
        animation: slideInRight 0.3s ease;
    `;

    document.body.appendChild(messageDiv);

    setTimeout(() => {
        messageDiv.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(messageDiv);
        }, 300);
    }, 3000);
}

// ============================================
// Local Storage Helper
// ============================================
const storage = {
    set: (key, value) => {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (e) {
            console.error('Error saving to localStorage:', e);
            return false;
        }
    },

    get: (key) => {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : null;
        } catch (e) {
            console.error('Error reading from localStorage:', e);
            return null;
        }
    },

    remove: (key) => {
        try {
            localStorage.removeItem(key);
            return true;
        } catch (e) {
            console.error('Error removing from localStorage:', e);
            return false;
        }
    }
};

// ============================================
// Performance Optimization: Debounce
// ============================================
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Apply debounce to scroll handlers for better performance
const debouncedScroll = debounce(() => {
    handleScroll();
    highlightActiveSection();
    handleParallax();
    handleQuickActionsVisibility();
}, 10);

window.addEventListener('scroll', debouncedScroll);

// ============================================
// Page Load Animation
// ============================================
window.addEventListener('load', () => {
    document.body.classList.add('loaded');

    // Add entrance animations
    const elements = document.querySelectorAll('.hero-text > *');
    elements.forEach((el, index) => {
        el.style.animationDelay = `${index * 0.1}s`;
    });
});

// ============================================
// Console Message
// ============================================
console.log('%c🎵 Live Karaoke Астана', 'font-size: 20px; font-weight: bold; color: #ff1744;');
console.log('%cРазработано для Live Karaoke | livekaraoke.kz', 'font-size: 12px; color: #7c4dff;');

// ============================================
// Export utilities for use in other scripts
// ============================================
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        validatePhone,
        validateEmail,
        showMessage,
        storage
    };
}
