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
                }
            })
            .catch(error => console.error(`Error loading ${componentPath}:`, error));
    };
    loadComponent('components/navbar.html', 'navbar_Container');
    loadComponent('components/footer.html', 'footer_Container');
});