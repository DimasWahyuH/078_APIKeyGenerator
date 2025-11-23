// public/login.js
async function loginAdmin() {
    const email = document.getElementById('adminEmail').value;
    const password = document.getElementById('adminPass').value;
    const errorMsg = document.getElementById('errorMsg');

    try {
        const response = await fetch('/api/admin/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const result = await response.json();

        if (response.ok) {
            // Simpan token di localStorage browser
            localStorage.setItem('adminToken', result.token);
            // Redirect ke dashboard
            window.location.href = 'dashboard.html';
        } else {
            errorMsg.innerText = result.message;
        }
    } catch (error) {
        errorMsg.innerText = "Error koneksi.";
    }
}