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

    // Scroll hide/show navbar (after navbar loaded asynchronously)
    let lastScrollY = 0;
    const distanceThreshold = 6; // ระยะความต่างขั้นต่ำต่อครั้ง
    const startHideAfter = 20; // เริ่มพิจารณาซ่อนหลังเลื่อนลงเกินค่านี้ (px)
    let ticking = false;

    const handleScroll = () => {
        const navbarRoot = document.getElementById('navbar_Container');
        if (!navbarRoot) return;
        // ถ้า container เองมี class .navbar ให้ใช้เลย ไม่งั้นมองหาภายใน
        const navbar = navbarRoot.classList && navbarRoot.classList.contains('navbar')
            ? navbarRoot
            : navbarRoot.querySelector('.navbar');
        if (!navbar) return; // ยังไม่โหลดเสร็จหรือ markup ยังไม่ตรง

        const currentY = window.scrollY || window.pageYOffset;
        const goingDown = currentY > lastScrollY;
    const distance = Math.abs(currentY - lastScrollY);

        // เพิ่ม/ลบเงาเมื่อ scroll เกิน 4px
        if (currentY > 4) {
            navbar.classList.add('navbar--scrolled');
        } else {
            navbar.classList.remove('navbar--scrolled');
        }

        // ไม่ซ่อนถ้าเมนู mobile เปิดอยู่
        const collapseEl = navbar.querySelector('.navbar-collapse');
        const menuOpen = collapseEl && collapseEl.classList.contains('show');

        if (!menuOpen) {
            if (goingDown && currentY > startHideAfter && distance > distanceThreshold) {
                navbar.classList.add('navbar--hidden');
                lastScrollY = currentY;
            } else if (!goingDown && distance > 4) {
                navbar.classList.remove('navbar--hidden');
                lastScrollY = currentY;
            }
        } else {
            // เมนูเปิดอยู่ บังคับโชว์
            navbar.classList.remove('navbar--hidden');
            lastScrollY = currentY;
        }
        ticking = false;
    };

    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(handleScroll);
            ticking = true;
        }
    }, { passive: true });

    // Observe when navbar gets injected then add helper class to body (optional future use)
    const navbarContainer = document.getElementById('navbar_Container');
    const observer = new MutationObserver(() => {
        const nav = navbarContainer.querySelector('.navbar');
        if (nav) {
            document.body.classList.add('has-fixed-navbar');
            observer.disconnect();
        }
    });
    observer.observe(navbarContainer, { childList: true, subtree: true });
});