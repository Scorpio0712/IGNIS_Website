document.addEventListener("DOMContentLoaded", function () {
    const scriptURL = 'YOUR_WEB_APP_URL_HERE';
    const form = document.getElementById('contactForm');
    const formContainer = document.getElementById('contactFormContainer');

    form.addEventListener('submit', e => {
        e.preventDefault();

        const submitButton = form.querySelector('button[type="submit"]');
        const originalButtonText = submitButton.innerHTML;
        submitButton.disabled = true;
        submitButton.textContent = 'Sending...';

        fetch(scriptURL, { method: 'POST', body: new FormData(form) })
            .then(response => response.json())
            .then(data => {
                console.log('Success!', data);
                //แสดงข้อความขอบคุณหลังส่งฟอร์ม
                formContainer.innerHTML = '<div class="text-center"><h3>Thank you!</h3><p>Your message has been sent successfully.<br>We will get back to you soon.</p></div>';
            })
            .catch(error => {
                console.error('Error!', error.message);
                alert('Something went wrong. Please try again later.');
                submitButton.disabled = false;
                submitButton.textContent = originalButtonText;
            })
    })
})