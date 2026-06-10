// ========== photo-script.js ==========
// Projects Page Interactions: Scroll Reveal, Mobile Menu, Cursor, Image Modal

(function() {
    'use strict';

    // ----- 1. CUSTOM CURSOR (Desktop only) -----
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
            
            const interactiveElements = document.querySelectorAll('button, a, .gallery-item, .clip-button, .tech-stack span, .nav-link');
            interactiveElements.forEach(el => {
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
    const mobileBtn = document.getElementById('mobileToggle');
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
        
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('open');
                if (mobileBtn.querySelector('i')) {
                    mobileBtn.querySelector('i').classList.remove('fa-times');
                    mobileBtn.querySelector('i').classList.add('fa-bars');
                }
            });
        });
        
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

    // ----- 3. SCROLL REVEAL ANIMATION for project rows -----
    const projectRows = document.querySelectorAll('.project-row');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15, rootMargin: "0px 0px -30px 0px" });
    
    projectRows.forEach(row => revealObserver.observe(row));
    
    // Also add initial visible class for any that are already visible
    projectRows.forEach(row => {
        const rect = row.getBoundingClientRect();
        if (rect.top < window.innerHeight - 100) {
            row.classList.add('visible');
        }
    });

    // ----- 4. IMAGE LIGHTBOX MODAL (Click to enlarge) -----
    const galleryItems = document.querySelectorAll('.gallery-item');
    let modal = null;
    
    function createModal() {
        const modalDiv = document.createElement('div');
        modalDiv.className = 'image-modal';
        modalDiv.innerHTML = `
            <div class="modal-overlay"></div>
            <div class="modal-container">
                <button class="modal-close"><i class="fas fa-times"></i></button>
                <img class="modal-image" src="" alt="Enlarged view">
            </div>
        `;
        document.body.appendChild(modalDiv);
        
        const overlay = modalDiv.querySelector('.modal-overlay');
        const closeBtn = modalDiv.querySelector('.modal-close');
        
        overlay.addEventListener('click', () => closeModal(modalDiv));
        closeBtn.addEventListener('click', () => closeModal(modalDiv));
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modalDiv.style.display === 'flex') {
                closeModal(modalDiv);
            }
        });
        
        return modalDiv;
    }
    
    function closeModal(modalDiv) {
        modalDiv.style.display = 'none';
        document.body.style.overflow = '';
    }
    
    galleryItems.forEach(item => {
        item.addEventListener('click', (e) => {
            // Don't trigger if clicking on the button inside description
            if (e.target.closest('.clip-button')) return;
            
            const img = item.querySelector('.gallery-image');
            if (!img) return;
            
            if (!modal) {
                modal = createModal();
            }
            
            const modalImg = modal.querySelector('.modal-image');
            modalImg.src = img.src;
            modalImg.alt = img.alt || 'Project screenshot';
            modal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        });
    });
    
    // Add modal styles dynamically
    const modalStyle = document.createElement('style');
    modalStyle.textContent = `
        .image-modal {
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 10000;
            align-items: center;
            justify-content: center;
        }
        .modal-overlay {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.9);
            backdrop-filter: blur(8px);
        }
        .modal-container {
            position: relative;
            max-width: 90vw;
            max-height: 90vh;
            z-index: 10001;
        }
        .modal-image {
            max-width: 90vw;
            max-height: 85vh;
            object-fit: contain;
            border-radius: 16px;
            box-shadow: 0 25px 50px rgba(0,0,0,0.5);
            border: 2px solid rgba(108,92,231,0.5);
        }
        .modal-close {
            position: absolute;
            top: -40px;
            right: 0;
            background: rgba(0,0,0,0.7);
            border: none;
            color: white;
            font-size: 1.5rem;
            cursor: pointer;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: 0.3s;
        }
        .modal-close:hover {
            background: var(--primary);
            transform: rotate(90deg);
        }
        @media (max-width: 768px) {
            .modal-close {
                top: -50px;
                right: 0;
            }
        }
    `;
    document.head.appendChild(modalStyle);

    // ----- 5. HEADER SCROLL EFFECT -----
    const header = document.querySelector('.glass-header');
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.style.background = 'rgba(6, 6, 12, 0.9)';
                header.style.backdropFilter = 'blur(20px)';
            } else {
                header.style.background = 'rgba(10, 10, 15, 0.65)';
                header.style.backdropFilter = 'blur(16px)';
            }
        });
    }

    // ----- 6. RIPPLE EFFECT ON BUTTONS -----
    const allButtons = document.querySelectorAll('.clip-button, .nav-link');
    allButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            if (this.classList.contains('nav-link')) return;
            const ripple = document.createElement('span');
            ripple.classList.add('ripple-effect');
            const rect = this.getBoundingClientRect();
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
            this.style.position = 'relative';
            this.style.overflow = 'hidden';
            this.appendChild(ripple);
            setTimeout(() => { ripple.style.transform = 'scale(2.5)'; ripple.style.opacity = '0'; }, 20);
            setTimeout(() => { ripple.remove(); }, 500);
        });
    });
    
    const rippleStyle = document.createElement('style');
    rippleStyle.textContent = `.ripple-effect { position: absolute; background: rgba(255,255,245,0.3); border-radius: 50%; transform: scale(0); animation: rippleAnim 0.5s linear; pointer-events: none; } @keyframes rippleAnim { to { transform: scale(4); opacity: 0; } }`;
    document.head.appendChild(rippleStyle);
    
    // ----- 7. PARALLAX TILT EFFECT ON HOVER for gallery items (subtle) -----
    galleryItems.forEach(item => {
        item.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top) / rect.height - 0.5;
            const rotateX = y * 4;
            const rotateY = x * 4;
            this.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });
        item.addEventListener('mouseleave', function() {
            this.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
        });
    });
    
    console.log('✨ Projects page loaded — all content preserved, design enhanced');
})();