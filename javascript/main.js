document.addEventListener("DOMContentLoaded", function () {
    const loadComponent = (componentPath, targetElementId) => {
        fetch(componentPath)
            .then(response => response.ok ? response.text() : Promise.reject('File not found'))
            .then(data => {
                document.getElementById(targetElementId).innerHTML = data;
                
                // Special handling for navbar active state
                if (targetElementId === 'navbar_Container') {
                    const pageName = document.body.dataset.page;
                    if (pageName) {
                        const navLink = document.querySelector(`.nav-link[data-page='${pageName}']`);
                        if (navLink) {
                            navLink.classList.add('active');
                            navLink.setAttribute('aria-current', 'page');
                        }
                    }
                    // Close navbar collapse when clicking outside (mobile hamburger)
                    try {
                        const navbarRoot = document.getElementById('navbar_Container');
                        const collapseEl = navbarRoot && navbarRoot.querySelector('#navbarSupportedContent');
                        const togglerEl = navbarRoot && navbarRoot.querySelector('.navbar-toggler');

                        if (collapseEl && togglerEl && typeof bootstrap !== 'undefined') {
                            const closeIfClickOutside = (evt) => {
                                const isOpen = collapseEl.classList.contains('show');
                                if (!isOpen) return;
                                const target = evt.target;
                                // Ignore clicks on the toggler or inside the collapse
                                if (togglerEl.contains(target) || collapseEl.contains(target)) return;
                                const bsCollapse = bootstrap.Collapse.getOrCreateInstance(collapseEl, { toggle: false });
                                bsCollapse.hide();
                            };

                            // Use both click and touchstart for better mobile responsiveness
                            document.addEventListener('click', closeIfClickOutside, { passive: true });
                            document.addEventListener('touchstart', closeIfClickOutside, { passive: true });

                            // Also close after clicking a nav link (useful on single-page anchors)
                            navbarRoot.querySelectorAll('.nav-link').forEach((link) => {
                                link.addEventListener('click', () => {
                                    const isOpen = collapseEl.classList.contains('show');
                                    if (!isOpen) return;
                                    const bsCollapse = bootstrap.Collapse.getOrCreateInstance(collapseEl, { toggle: false });
                                    bsCollapse.hide();
                                });
                            });
                        }
                    } catch (e) {
                        console.warn('Navbar outside-click handler setup failed:', e);
                    }
                }
            })
            .catch(error => console.error(`Error loading ${componentPath}:`, error));
    };
    loadComponent('components/navbar.html', 'navbar_Container');
    loadComponent('components/footer.html', 'footer_Container');
});