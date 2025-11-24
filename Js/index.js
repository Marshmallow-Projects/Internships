/* ========================================
   PAGE LOAD ANIMATION SEQUENCE
   ======================================== */

// Global flag to prevent card flips until shuffle is complete
let cardsReady = false;

// Hide main content initially
document.addEventListener('DOMContentLoaded', () => {
    const body = document.body;
    body.style.opacity = '0';
    
    // Wait for logo animation to complete, then show page and run card shuffle
    setTimeout(() => {
        body.style.opacity = '1';
        body.style.transition = 'opacity 0.6s ease-in';

        // small delay to ensure layout is stable, then shuffle cards
        setTimeout(() => {
            try { shuffleCards(); } catch (e) { console.error('shuffleCards error', e); }
        }, 350);
    }, 800);
});

// Trigger logo animation on page load
window.addEventListener('load', () => {
    const logoImg = document.querySelector('.logo-img');
    if (logoImg) {
        logoImg.style.animation = 'logoLoadAnimation 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards';
    }
});

/* ========================================
   NAVIGATION & SMOOTH SCROLLING
   ======================================== */

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Active navigation link
window.addEventListener('scroll', () => {
    const navLinks = document.querySelectorAll('.nav-link');
    let currentSection = '';

    document.querySelectorAll('section').forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (pageYOffset >= sectionTop - 200) {
            currentSection = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').slice(1) === currentSection) {
            link.classList.add('active');
        }
    });
});

/* ========================================
   SCROLL TO INTERNSHIPS
   ======================================== */
function scrollToInternships() {
    const internshipsSection = document.getElementById('internships');
    internshipsSection.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
    });
}





/* ========================================
   STATS COUNTER ANIMATION
   ======================================== */

function animateStats() {
    const stats = document.querySelectorAll('.stat-number');
    
    stats.forEach(stat => {
        const target = parseInt(stat.textContent);
        const isPercentage = stat.textContent.includes('%');
        const isPlus = stat.textContent.includes('+');
        
        let current = 0;
        const increment = target / 50; // Animate over 50 frames
        
        const timer = setInterval(() => {
            current += increment;
            
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            
            let displayValue = Math.ceil(current);
            if (isPercentage) {
                stat.textContent = displayValue + '%';
            } else if (isPlus) {
                stat.textContent = displayValue + '+';
            } else {
                stat.textContent = displayValue;
            }
        }, 30);
    });
}

// Trigger stats animation when stats section is in view
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && entry.target.classList.contains('stats')) {
            animateStats();
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

document.addEventListener('DOMContentLoaded', () => {
    const statsSection = document.querySelector('.stats');
    if (statsSection) {
        observer.observe(statsSection);
    }
});

/* ========================================
   CARD INTERSECTION OBSERVER
   ======================================== */

const cardObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            setTimeout(() => {
                entry.target.style.animation = `slideUp 0.6s ease forwards`;
                entry.target.style.opacity = '0';
                entry.target.style.transform = 'translateY(30px)';
                entry.target.style.animation = 'slideUp 0.6s ease forwards';
            }, index * 100);
            cardObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.1 });

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.internship-card').forEach(card => {
        cardObserver.observe(card);

        // add click handler to flip card (for touch/click devices)
        card.addEventListener('click', (e) => {
            // if click targeted the explore button, let it open modal
            if (e.target.closest('.explore-btn')) return;
            
            // Only allow flip if cards are ready
            if (!cardsReady) return;
            
            card.classList.toggle('flipped');
            // update aria-pressed
            const pressed = card.classList.contains('flipped');
            card.setAttribute('aria-pressed', pressed);
        });

        // allow Enter key to flip when focused
        card.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                
                // Only allow flip if cards are ready
                if (!cardsReady) return;
                
                card.classList.toggle('flipped');
                card.setAttribute('aria-pressed', card.classList.contains('flipped'));
            }
        });
    });
});

/* ========================================
   FORM VALIDATION (for future integration)
   ======================================== */

function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function validateForm(formData) {
    if (!formData.name || formData.name.trim() === '') {
        showNotification('Please enter your name', 'error');
        return false;
    }
    
    if (!validateEmail(formData.email)) {
        showNotification('Please enter a valid email', 'error');
        return false;
    }
    
    return true;
}

/* ========================================
   HAMBURGER MENU
   ======================================== */

const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

if (hamburger) {
    hamburger.addEventListener('click', () => {
        navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
        hamburger.classList.toggle('active');
    });

    // Close menu when a link is clicked
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.style.display = 'none';
            hamburger.classList.remove('active');
        });
    });
}

/* ========================================
   KEYBOARD SHORTCUTS
   ======================================== */

document.addEventListener('keydown', (event) => {
    // Alt + I to scroll to internships
    if (event.altKey && event.key === 'i') {
        scrollToInternships();
    }
});

/* ========================================
   PAGE LOAD ANIMATION
   ======================================== */

window.addEventListener('load', () => {
    document.body.style.animation = 'fadeIn 0.5s ease';
});

/* ========================================
   LAZY LOADING ENHANCEMENT
   ======================================== */

document.querySelectorAll('img').forEach(img => {
    if (img.complete) {
        img.classList.add('loaded');
    } else {
        img.addEventListener('load', () => {
            img.classList.add('loaded');
        });
    }
});

/* ========================================
   PERFORMANCE OPTIMIZATION
   ======================================== */

// Debounce function for better performance
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

// Optimize scroll event
window.addEventListener('scroll', debounce(() => {
    // Scroll event logic here
}, 100));

/* ========================================
   ACCESSIBILITY ENHANCEMENTS
   ======================================== */

// Add focus visible styles
document.addEventListener('keydown', (event) => {
    if (event.key === 'Tab') {
        document.body.classList.add('using-keyboard');
    }
});

document.addEventListener('mousedown', () => {
    document.body.classList.remove('using-keyboard');
});

// Announce modal changes to screen readers
function announceToScreenReader(message) {
    const announcement = document.createElement('div');
    announcement.setAttribute('role', 'status');
    announcement.setAttribute('aria-live', 'polite');
    announcement.textContent = message;
    announcement.style.display = 'none';
    document.body.appendChild(announcement);
    
    setTimeout(() => {
        announcement.remove();
    }, 1000);
}

/* ========================================
   CONSOLE GREETING
   ======================================== */

/* ========================================
   CARD SHUFFLE ANIMATION
   ======================================== */

function shuffleCards() {
    cardsReady = false; // Disable flips during shuffle
    const grid = document.querySelector('.internship-grid');
    const cards = Array.from(document.querySelectorAll('.internship-card'));
    if (!grid || cards.length === 0) return;

    const gridRect = grid.getBoundingClientRect();

    // store final positions
    const finalRects = cards.map(c => c.getBoundingClientRect());

    // lock cards in place and prepare absolute positioning relative to grid
    cards.forEach((card, i) => {
        const rect = finalRects[i];
        card.style.width = rect.width + 'px';
        card.style.height = rect.height + 'px';
        card.style.position = 'absolute';
        card.style.left = (rect.left - gridRect.left) + 'px';
        card.style.top = (rect.top - gridRect.top) + 'px';
        card.style.margin = '0';
        card.style.zIndex = cards.length - i;
        card.style.transition = 'left 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94), top 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94), transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
    });

    // compute center position
    const centerX = gridRect.width / 2;
    const centerY = gridRect.height / 2;

    // move to center stacked
    requestAnimationFrame(() => {
        cards.forEach((card, i) => {
            const w = finalRects[i].width;
            const h = finalRects[i].height;
            const cx = centerX - w / 2 + (Math.random() - 0.5) * 6; // reduced offset
            const cy = centerY - h / 2 + (Math.random() - 0.5) * 6;
            card.style.left = cx + 'px';
            card.style.top = cy + 'px';
            card.style.transform = `rotate(${(Math.random() - 0.5) * 8}deg) scale(1.01)`;
        });
    });

    // quick jitter to simulate shuffle (3 pulses, smoother)
    const jitterRounds = 3;
    for (let r = 0; r < jitterRounds; r++) {
        setTimeout(() => {
            cards.forEach((card, i) => {
                const rx = (Math.random() - 0.5) * 20;
                const ry = (Math.random() - 0.5) * 8;
                card.style.transform = `translate(${rx}px, ${ry}px) rotate(${(Math.random() - 0.5) * 16}deg) scale(1.01)`;
            });
        }, 350 + r * 140);
    }

    // deal back to final positions with stagger
    cards.forEach((card, i) => {
        const delay = 300 + jitterRounds * 140 + i * 120; // optimized stagger
        setTimeout(() => {
            // reset transform and move to original location
            card.style.transform = `rotate(${(Math.random() - 0.5) * 4}deg) scale(1)`;
            card.style.left = (finalRects[i].left - gridRect.left) + 'px';
            card.style.top = (finalRects[i].top - gridRect.top) + 'px';
            card.style.zIndex = i + 1;

            // after transition, clear absolute positioning to return to flow
            const clean = () => {
                card.style.position = '';
                card.style.left = '';
                card.style.top = '';
                card.style.width = '';
                card.style.height = '';
                card.style.margin = '';
                card.style.transition = '';
                card.style.transform = '';
                card.removeEventListener('transitionend', clean);
                
                // Enable flips and interactions once final card is dealt
                if (i === cards.length - 1) {
                    cards.forEach(c => c.classList.add('ready'));
                    cardsReady = true;
                }
            };

            card.addEventListener('transitionend', clean);
        }, delay);
    });
}

/* ========================================
   CONSOLE GREETING
   ======================================== */

console.log(
    '%c🍫 Welcome to Marshmallow Projects! 🍫',
    'color: #2563EB; font-size: 20px; font-weight: bold; text-shadow: 2px 2px 4px rgba(0,0,0,0.06);'
);
console.log(
    '%cHave fun exploring internship opportunities!',
    'color: #1E40AF; font-size: 14px;'
);
