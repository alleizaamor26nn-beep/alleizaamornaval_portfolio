// ===== JS/script.js =====
// Alleiza Portfolio - Dynamic Interactions & Smooth Animations

(function() {
    'use strict';

    // ---------- 1. CURSOR EFFECT (only on devices with mouse) ----------
    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (!isTouch) {
        const cursorDot = document.querySelector('.cursor-dot');
        const cursorOutline = document.querySelector('.cursor-outline');
        if (cursorDot && cursorOutline) {
            window.addEventListener('mousemove', (e) => {
                cursorDot.style.left = e.clientX + 'px';
                cursorDot.style.top = e.clientY + 'px';
                cursorOutline.style.left = e.clientX + 'px';
                cursorOutline.style.top = e.clientY + 'px';
            });
            
            // hover effect on interactive elements
            const interactiveElements = document.querySelectorAll('button, a, .service-card, .btn-primary, .btn-outline, .social-floating a');
            interactiveElements.forEach(el => {
                el.addEventListener('mouseenter', () => {
                    cursorOutline.style.transform = 'translate(-50%, -50%) scale(1.5)';
                    cursorOutline.style.borderColor = '#a28eff';
                    cursorOutline.style.backgroundColor = 'rgba(108, 92, 231, 0.1)';
                });
                el.addEventListener('mouseleave', () => {
                    cursorOutline.style.transform = 'translate(-50%, -50%) scale(1)';
                    cursorOutline.style.borderColor = 'rgba(108, 92, 231, 0.6)';
                    cursorOutline.style.backgroundColor = 'transparent';
                });
            });
        }
    }

    // ---------- 2. STATS COUNTER ANIMATION (Intersection Observer) ----------
    const statNumbers = document.querySelectorAll('.stat-number');
    let animated = false;

    function animateNumbers() {
        if (animated) return;
        statNumbers.forEach(stat => {
            const target = parseInt(stat.getAttribute('data-target'));
            if (isNaN(target)) return;
            let current = 0;
            const increment = target / 50;
            const updateCounter = () => {
                current += increment;
                if (current < target) {
                    stat.innerText = Math.floor(current);
                    requestAnimationFrame(updateCounter);
                } else {
                    stat.innerText = target;
                }
            };
            updateCounter();
        });
        animated = true;
    }

    const observerOptions = { threshold: 0.5, rootMargin: "0px" };
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !animated) {
                animateNumbers();
                statsObserver.disconnect();
            }
        });
    }, observerOptions);
    
    const statsContainer = document.querySelector('.hero-stats');
    if (statsContainer) statsObserver.observe(statsContainer);

    // ---------- 3. MOBILE MENU TOGGLE (Smooth + close on link click) ----------
    const mobileToggle = document.getElementById('mobile-menu');
    const navMenu = document.querySelector('.nav-links');
    if (mobileToggle && navMenu) {
        mobileToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            navMenu.classList.toggle('active');
            const icon = mobileToggle.querySelector('i');
            if (icon) {
                if (navMenu.classList.contains('active')) {
                    icon.classList.remove('fa-bars');
                    icon.classList.add('fa-times');
                } else {
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
            }
        });
        
        // close mobile menu when clicking a link
        const navLinks = document.querySelectorAll('.nav-item');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                const icon = mobileToggle.querySelector('i');
                if (icon) {
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
            });
        });
        
        // Close if clicked outside
        document.addEventListener('click', (event) => {
            if (!navMenu.contains(event.target) && !mobileToggle.contains(event.target) && navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                const icon = mobileToggle.querySelector('i');
                if (icon) {
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
            }
        });
    }

    // ---------- 4. BUTTON NAVIGATION (explore & contact quick) ----------
    const exploreBtn = document.getElementById('exploreBtn');
    if (exploreBtn) {
        exploreBtn.addEventListener('click', () => {
            window.location.href = 'html/about.html';
        });
    }
    
    const contactQuick = document.getElementById('contactQuick');
    if (contactQuick) {
        contactQuick.addEventListener('click', () => {
            window.location.href = 'html/contact.html';
        });
    }
    
    // ---------- 5. SCROLL REVEAL ANIMATION (Fade up on service cards + hero elements) ----------
    const revealElements = document.querySelectorAll('.service-card, .hero-content .greeting-tag, .glow-text, .hero-description, .btn-group');
    
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2, rootMargin: "0px 0px -20px 0px" });
    
    revealElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(22px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s cubic-bezier(0.2, 0.9, 0.4, 1.1)';
        revealObserver.observe(el);
    });
    
    // also make portrait frame slightly animate on load
    const portraitFrame = document.querySelector('.floating-frame');
    if (portraitFrame) {
        portraitFrame.style.opacity = '0';
        portraitFrame.style.transform = 'scale(0.97)';
        setTimeout(() => {
            portraitFrame.style.transition = 'opacity 0.9s ease, transform 0.8s ease';
            portraitFrame.style.opacity = '1';
            portraitFrame.style.transform = 'scale(1)';
        }, 200);
    }
    
    // ---------- 6. Background parallax tilt effect for floating shapes (tiny playful) ----------
    const heroWrap = document.querySelector('.hero-section');
    const shapes = document.querySelectorAll('.floating-shape');
    if (heroWrap && shapes.length) {
        heroWrap.addEventListener('mousemove', (e) => {
            const rect = heroWrap.getBoundingClientRect();
            const xAxis = (e.clientX - rect.left) / rect.width - 0.5;
            const yAxis = (e.clientY - rect.top) / rect.height - 0.5;
            shapes.forEach((shape, idx) => {
                const shiftX = xAxis * (idx === 0 ? 12 : 18);
                const shiftY = yAxis * (idx === 0 ? 12 : 18);
                shape.style.transform = `translate(${shiftX}px, ${shiftY}px)`;
            });
        });
    }
    
    // ---------- 7. dynamic header transparency on scroll ----------
    const headerEl = document.querySelector('header');
    if (headerEl) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                headerEl.style.background = 'rgba(8, 8, 12, 0.85)';
                headerEl.style.backdropFilter = 'blur(16px)';
                headerEl.style.boxShadow = '0 8px 20px rgba(0,0,0,0.3)';
            } else {
                headerEl.style.background = 'rgba(10, 10, 15, 0.55)';
                headerEl.style.backdropFilter = 'blur(12px)';
                headerEl.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.2)';
            }
        });
    }
    
    // ---------- 8. Add smooth preloader-like feel and extra ripple for stat numbers ----------
    // small detail: make stat numbers update with extra spark
    console.log('✨ Alleiza portfolio — enhanced experience loaded');
    
    // 9. Ripple effect on buttons
    const allButtons = document.querySelectorAll('.btn-primary, .btn-outline');
    allButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            let ripple = document.createElement('span');
            ripple.classList.add('ripple-effect');
            const rect = btn.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = e.clientX - rect.left - size/2 + 'px';
            ripple.style.top = e.clientY - rect.top - size/2 + 'px';
            ripple.style.position = 'absolute';
            ripple.style.borderRadius = '50%';
            ripple.style.backgroundColor = 'rgba(255,255,255,0.4)';
            ripple.style.pointerEvents = 'none';
            ripple.style.transform = 'scale(0)';
            ripple.style.transition = 'transform 0.5s, opacity 0.6s';
            btn.style.position = 'relative';
            btn.style.overflow = 'hidden';
            btn.appendChild(ripple);
            setTimeout(() => {
                ripple.style.transform = 'scale(2)';
                ripple.style.opacity = '0';
            }, 20);
            setTimeout(() => {
                ripple.remove();
            }, 500);
        });
    });
    
    // add ripple style dynamically
    const styleSheet = document.createElement("style");
    styleSheet.textContent = `.ripple-effect { position: absolute; background: rgba(255,255,240,0.3); border-radius: 50%; transform: scale(0); animation: rippleAnim 0.5s linear; pointer-events: none; } @keyframes rippleAnim { to { transform: scale(4); opacity: 0; } }`;
    document.head.appendChild(styleSheet);
    
})();