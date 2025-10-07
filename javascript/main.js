document.addEventListener("DOMContentLoaded", function () {
    const loadComponent = (componentPath, targetElementId) => {
        fetch(componentPath)
            .then(response => response.ok ? response.text() : Promise.reject('File not found'))
            .then(data => {
                document.getElementById(targetElementId).innerHTML = data;

                // Special handling for navbar active state
                if (targetElementId === 'navbar-Container') {
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
                        const navbarRoot = document.getElementById('navbar-Container');
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
    loadComponent('components/navbar.html', 'navbar-Container');
    loadComponent('components/footer.html', 'footer-Container');

});

///////// Hamburger Menu Animation /////////
function hamMenuFunction(x) {
    x.classList.toggle("change");

    let navMenu = document.getElementById("navMenu");
    if(navMenu.className === "menu") {
        navMenu.className += " menu-active";
    } else {
        navMenu.className = "menu";
    }
}

// Close menu when clicking outside
document.addEventListener('click', function(event) {
    const navMenu = document.getElementById("navMenu");
    const hamMenu = document.querySelector(".ham-menu");
    
    if (navMenu && hamMenu && navMenu.classList.contains("menu-active")) {
        // Check if click is outside menu and hamburger button
        if (!navMenu.contains(event.target) && !hamMenu.contains(event.target)) {
            navMenu.className = "menu";
            hamMenu.classList.remove("change");
        }
    }
});

// Close menu when clicking on menu links
document.addEventListener('click', function(event) {
    const navMenu = document.getElementById("navMenu");
    const hamMenu = document.querySelector(".ham-menu");
    
    if (event.target.tagName === 'A' && event.target.closest('.menu')) {
        if (navMenu && hamMenu) {
            navMenu.className = "menu";
            hamMenu.classList.remove("change");
        }
    }
});