// ========== about-script.js ==========
// Interactive About Page: cursor, mobile menu, scroll reveal, buttons

(function() {
    'use strict';
    
    // ----- 1. CUSTOM CURSOR (DESKTOP ONLY) -----
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
            const interactiveEls = document.querySelectorAll('button, a, .skill-category, .hobby-card, .btn-drive');
            interactiveEls.forEach(el => {
                el.addEventListener('mouseenter', () => {
                    cursorOutline.style.transform = 'translate(-50%, -50%) scale(1.5)';
                    cursorOutline.style.borderColor = '#a28eff';
                    cursorOutline.style.backgroundColor = 'rgba(108, 92, 231, 0.1)';
                });
                el.addEventListener('mouseleave', () => {
                    cursorOutline.style.transform = 'translate(-50%, -50%) scale(1)';
                    cursorOutline.style.borderColor = 'rgba(108, 92, 231, 0.5)';
                    cursorOutline.style.backgroundColor = 'transparent';
                });
            });
        }
    }
    
    // ----- 2. MOBILE MENU TOGGLE -----
    const mobileBtn = document.getElementById('mobileMenuBtn');
    const navLinks = document.querySelector('.nav-links');
    if (mobileBtn && navLinks) {
        mobileBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            navLinks.classList.toggle('open');
            const icon = mobileBtn.querySelector('i');
            if (icon) {
                if (navLinks.classList.contains('open')) {
                    icon.classList.remove('fa-bars');
                    icon.classList.add('fa-times');
                } else {
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
            }
        });
        // close when clicking a link
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('open');
                if (mobileBtn.querySelector('i')) {
                    mobileBtn.querySelector('i').classList.remove('fa-times');
                    mobileBtn.querySelector('i').classList.add('fa-bars');
                }
            });
        });
        // close when clicking outside
        document.addEventListener('click', (event) => {
            if (!navLinks.contains(event.target) && !mobileBtn.contains(event.target) && navLinks.classList.contains('open')) {
                navLinks.classList.remove('open');
                const icon = mobileBtn.querySelector('i');
                if (icon) {
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
            }
        });
    }
    
    // ----- 3. SCROLL REVEAL (Intersection Observer) -----
    const revealElements = document.querySelectorAll('.reveal-on-scroll');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15, rootMargin: "0px 0px -20px 0px" });
    
    revealElements.forEach(el => revealObserver.observe(el));
    
    // also set initial state for profile elements
    const profileHero = document.querySelector('.profile-grid');
    if (profileHero) {
        profileHero.style.opacity = '0';
        profileHero.style.transform = 'translateY(18px)';
        setTimeout(() => {
            profileHero.style.transition = 'opacity 0.6s ease, transform 0.6s';
            profileHero.style.opacity = '1';
            profileHero.style.transform = 'translateY(0)';
        }, 150);
    }
    
    // ----- 4. BUTTON ACTIONS -----
    const resumeBtn = document.getElementById('resumeBtn');
    if (resumeBtn) {
        resumeBtn.addEventListener('click', () => {
            alert("📄 Alleiza's Resume: Available upon request or you can connect via contact page.");
            // optional: window.open("#") if you have pdf
        });
    }
    const contactRedirect = document.getElementById('contactRedirect');
    if (contactRedirect) {
        contactRedirect.addEventListener('click', () => {
            window.location.href = 'contact.html';
        });
    }
    
    // ----- 5. HOVER ANIMATION ON SKILL CARDS + RIPPLE for buttons -----
    const allButtons = document.querySelectorAll('.btn-primary, .btn-outline, .btn-drive');
    allButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            ripple.classList.add('ripple-effect');
            const rect = btn.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = e.clientX - rect.left - size/2 + 'px';
            ripple.style.top = e.clientY - rect.top - size/2 + 'px';
            ripple.style.position = 'absolute';
            ripple.style.borderRadius = '50%';
            ripple.style.backgroundColor = 'rgba(255,255,240,0.4)';
            ripple.style.pointerEvents = 'none';
            ripple.style.transform = 'scale(0)';
            ripple.style.transition = 'transform 0.4s, opacity 0.5s';
            btn.style.position = 'relative';
            btn.style.overflow = 'hidden';
            btn.appendChild(ripple);
            setTimeout(() => { ripple.style.transform = 'scale(2.5)'; ripple.style.opacity = '0'; }, 20);
            setTimeout(() => { ripple.remove(); }, 500);
        });
    });
    
    // dynamic ripple style
    if (!document.querySelector('#ripple-style')) {
        const rippleStyle = document.createElement('style');
        rippleStyle.id = 'ripple-style';
        rippleStyle.textContent = `.ripple-effect { position: absolute; background: rgba(255,255,245,0.3); border-radius: 50%; transform: scale(0); animation: rippleAnim 0.5s linear; pointer-events: none; } @keyframes rippleAnim { to { transform: scale(4); opacity: 0; } }`;
        document.head.appendChild(rippleStyle);
    }
    
    // ---- 6. Header transparency on scroll ----
    const header = document.querySelector('.glass-header');
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 40) {
                header.style.background = 'rgba(6,6,12,0.85)';
                header.style.backdropFilter = 'blur(18px)';
            } else {
                header.style.background = 'rgba(10, 10, 15, 0.6)';
            }
        });
    }
    
    // small console vibe
    console.log('✨ About page loaded — dynamic experience ready');
})();