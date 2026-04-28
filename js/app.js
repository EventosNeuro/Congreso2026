
        // Navigation Logic
        
        // Global Navigation Click Delegate
        document.addEventListener('click', (e) => {
            let target = e.target.closest('a[href^="#seccion-"], [data-navigate]');
            if (target) {
                e.preventDefault();
                let sectionId;
                if (target.hasAttribute('data-navigate')) {
                    sectionId = target.getAttribute('data-navigate');
                } else {
                    sectionId = target.getAttribute('href').substring(1);
                }
                if (sectionId) {
                    navigate(sectionId);
                }
            }
        });

        function navigate(sectionId, pushToHistory = true) {
            // Hide all sections
            document.querySelectorAll('.section').forEach(sec => {
                sec.classList.remove('active');
            });
            
            // Reset reveal animations
            document.querySelectorAll('.reveal').forEach(el => {
                el.classList.remove('is-visible');
            });
            
            // Reset profile card animations
            document.querySelectorAll('.profile-card-animate, .about-card-animate-left, .about-card-animate-right').forEach(el => {
                el.classList.remove('is-visible');
            });
            
            // Show target section
            const target = document.getElementById(sectionId);
            if (target) {
                target.classList.add('active');
            }

            // Handle floating button visibility
            const floatingBtn = document.getElementById('floating-inscription-btn');
            if (floatingBtn) {
                if (sectionId === 'seccion-inscripcion') {
                    floatingBtn.classList.add('hidden');
                } else {
                    floatingBtn.classList.remove('hidden');
                }
            }

            // Close mobile menu if open
            const mobileMenu = document.getElementById('mobile-menu');
            if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
                mobileMenu.classList.add('hidden');
            }

            // Scroll to top
            window.scrollTo(0, 0);

            // History API logic
            if (pushToHistory) {
                try { history.pushState({ section: sectionId }, '', '#' + sectionId); } catch(e) { window.location.hash = sectionId; }
            }
        }

        window.addEventListener('popstate', (e) => {
            if (e.state && e.state.section) {
                navigate(e.state.section, false);
            } else {
                const hash = window.location.hash.substring(1);
                if (hash && document.getElementById(hash)) {
                    navigate(hash, false);
                } else {
                    navigate('seccion-inicio', false);
                }
            }
        });


        // Mobile Menu Toggle
        function toggleMobileMenu() {
            const menu = document.getElementById('mobile-menu');
            menu.classList.toggle('hidden');
        }

        // Mobile Submenu Toggle
        function toggleMobileSubmenu() {
            const submenu = document.getElementById('mobile-submenu');
            const icon = document.getElementById('mobile-submenu-icon');
            submenu.classList.toggle('hidden');
            icon.classList.toggle('rotate-180');
        }

        // Tab Logic
        function switchTab(context, tabId) {
            // Context is either 'inicio' or 'programa'
            
            // Reset all tabs in context
            document.querySelectorAll(`[id^="tab-${context}-"]`).forEach(tab => {
                tab.classList.remove('bg-accent', 'text-white', 'font-bold', 'rounded-t-lg');
                tab.classList.add('text-gray-500', 'font-semibold');
            });

            // Set active tab
            const activeTab = document.getElementById(`tab-${context}-${tabId}`);
            if (activeTab) {
                activeTab.classList.remove('text-gray-500', 'font-semibold');
                activeTab.classList.add('bg-accent', 'text-white', 'font-bold', 'rounded-t-lg');
            }

            // Hide all content in context
            document.querySelectorAll(`[id^="content-${context}-"]`).forEach(content => {
                content.classList.remove('block');
                content.classList.add('hidden');
            });

            // Show active content
            const activeContent = document.getElementById(`content-${context}-${tabId}`);
            if (activeContent) {
                activeContent.classList.remove('hidden');
                activeContent.classList.add('block');
            }
        }

        // Carousel Logic
                document.addEventListener('DOMContentLoaded', () => {
            const hash = window.location.hash.substring(1);
            if (hash && document.getElementById(hash)) {
                navigate(hash, false);
            } else {
                const activeSec = document.querySelector('.section.active');
                if (activeSec) {
                    try { history.replaceState({ section: activeSec.id }, '', '#' + activeSec.id); } catch(e) {}
                }
            }
            const carousels = document.querySelectorAll('.carousel-container');
            
            carousels.forEach(container => {
                const track = container.querySelector('.carousel-track');
                const btnLeft = container.querySelector('.btn-scroll-left');
                const btnRight = container.querySelector('.btn-scroll-right');
                
                let scrollAmount = 0;
                let scrollAnimation;

                function scrollCarousel() {
                    if (scrollAmount !== 0) {
                        track.scrollLeft += scrollAmount;
                        scrollAnimation = requestAnimationFrame(scrollCarousel);
                    }
                }

                function startScroll(amount) {
                    scrollAmount = amount;
                    cancelAnimationFrame(scrollAnimation);
                    scrollAnimation = requestAnimationFrame(scrollCarousel);
                }

                function stopScroll() {
                    scrollAmount = 0;
                    cancelAnimationFrame(scrollAnimation);
                }

                if (btnLeft && btnRight && track) {
                    // Hover events for continuous scrolling
                    btnRight.addEventListener('mouseenter', () => startScroll(4));
                    btnRight.addEventListener('mouseleave', stopScroll);
                    btnRight.addEventListener('touchstart', () => startScroll(4));
                    btnRight.addEventListener('touchend', stopScroll);
                    
                    btnLeft.addEventListener('mouseenter', () => startScroll(-4));
                    btnLeft.addEventListener('mouseleave', stopScroll);
                    btnLeft.addEventListener('touchstart', () => startScroll(-4));
                    btnLeft.addEventListener('touchend', stopScroll);

                    // Click events for jumping a larger distance
                    btnRight.addEventListener('click', () => {
                        track.scrollBy({ left: 300, behavior: 'smooth' });
                    });
                    btnLeft.addEventListener('click', () => {
                        track.scrollBy({ left: -300, behavior: 'smooth' });
                    });
                }
            });

            // Scroll Reveal Animation
            const revealElements = document.querySelectorAll('.reveal');
            
            const revealCallback = (entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('is-visible');
                    }
                });
            };

            const revealOptions = {
                root: null,
                rootMargin: '0px 0px -50px 0px',
                threshold: 0
            };

            const revealObserver = new IntersectionObserver(revealCallback, revealOptions);

            revealElements.forEach(el => {
                revealObserver.observe(el);
            });

            // Profile Card Animation Observer
            const profileObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('is-visible');
                    }
                });
            }, { rootMargin: '0px 0px -50px 0px', threshold: 0 });

            document.querySelectorAll('.profile-card-animate, .about-card-animate-left, .about-card-animate-right').forEach(el => {
                profileObserver.observe(el);
            });

            // Solar Carousel Logic
            const solarCarousels = document.querySelectorAll('.solar-carousel');

            solarCarousels.forEach(carousel => {
                const solarItems = carousel.querySelectorAll('.solar-item');
                const btnSolarLeft = carousel.querySelector('.solar-btn-left');
                const btnSolarRight = carousel.querySelector('.solar-btn-right');
                let currentSolarIndex = 0;
                const totalSolarItems = solarItems.length;

                function updateSolarCarousel() {
                    solarItems.forEach((item, index) => {
                        // Calculate relative position
                        let relativeIndex = (index - currentSolarIndex + totalSolarItems) % totalSolarItems;
                        
                        let position = relativeIndex;
                        if (position > Math.floor(totalSolarItems / 2)) {
                            position -= totalSolarItems;
                        }

                        let scale = 1;
                        let zIndex = 20;
                        let opacity = 1;
                        let translateX = 0;
                        let textOpacity = 0;

                        const isMobile = window.innerWidth < 768;
                        const offset1 = isMobile ? 100 : 200;
                        const offset2 = isMobile ? 180 : 360;
                        const offset3 = isMobile ? 240 : 480;

                        if (position === 0) {
                            scale = 1;
                            zIndex = 20;
                            opacity = 1;
                            translateX = 0;
                            textOpacity = 1;
                        } else if (position === 1) {
                            scale = 0.75;
                            zIndex = 10;
                            opacity = 0.8;
                            translateX = offset1;
                        } else if (position === -1) {
                            scale = 0.75;
                            zIndex = 10;
                            opacity = 0.8;
                            translateX = -offset1;
                        } else if (position === 2) {
                            scale = 0.55;
                            zIndex = 5;
                            opacity = 0.4;
                            translateX = offset2;
                        } else if (position === -2) {
                            scale = 0.55;
                            zIndex = 5;
                            opacity = 0.4;
                            translateX = -offset2;
                        } else {
                            scale = 0.4;
                            zIndex = 1;
                            opacity = 0;
                            translateX = 0;
                        }

                        item.style.transform = `translate(-50%, -50%) translateX(${translateX}px) scale(${scale})`;
                        item.style.zIndex = zIndex;
                        item.style.opacity = opacity;
                        
                        const textEl = item.querySelector('.solar-text');
                        if(textEl) {
                            textEl.style.opacity = textOpacity;
                        }
                    });
                }

                if (solarItems.length > 0) {
                    updateSolarCarousel();

                    if (btnSolarRight) {
                        btnSolarRight.addEventListener('click', () => {
                            currentSolarIndex = (currentSolarIndex + 1) % totalSolarItems;
                            updateSolarCarousel();
                        });
                    }

                    if (btnSolarLeft) {
                        btnSolarLeft.addEventListener('click', () => {
                            currentSolarIndex = (currentSolarIndex - 1 + totalSolarItems) % totalSolarItems;
                            updateSolarCarousel();
                        });
                    }

                    solarItems.forEach((item, index) => {
                        item.addEventListener('click', () => {
                            currentSolarIndex = index;
                            updateSolarCarousel();
                        });
                    });
                    
                    window.addEventListener('resize', updateSolarCarousel);
                }
            });

            // Dynamic Navbar Color logic removed per user request
            const navbar = document.getElementById('main-navbar');
            const mobileMenu = document.getElementById('mobile-menu');
            // Navbar is now permanently red (bg-accent)

            // Fix for particles.js squashing when body height changes
            const resizeObserver = new ResizeObserver(() => {
                window.dispatchEvent(new Event('resize'));
            });
            resizeObserver.observe(document.body);

            // Subscribe Form Logic
            const subscribeForm = document.getElementById('subscribe-form');
            const subscribeSuccess = document.getElementById('subscribe-success');

            if (subscribeForm && subscribeSuccess) {
                subscribeForm.addEventListener('submit', (e) => {
                    e.preventDefault(); // Prevent page reload
                    
                    // Show success message
                    subscribeSuccess.classList.remove('hidden');
                    // Small delay to allow display flex/block to apply before animating opacity
                    setTimeout(() => {
                        subscribeSuccess.classList.remove('opacity-0');
                        subscribeSuccess.classList.add('opacity-100');
                    }, 10);
                    
                    // Reset form
                    subscribeForm.reset();
                    
                    // Hide after a few seconds
                    setTimeout(() => {
                        subscribeSuccess.classList.remove('opacity-100');
                        subscribeSuccess.classList.add('opacity-0');
                        setTimeout(() => {
                            subscribeSuccess.classList.add('hidden');
                        }, 300); // match transition duration
                    }, 5000);
                });
            }
        });
