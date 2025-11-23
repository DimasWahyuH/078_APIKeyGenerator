// public/script.js

// Fungsi untuk tombol "Generate API Key"
function generateKey() {
    const randomString = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    const key = `KEY-${randomString.toUpperCase()}`;
    document.getElementById('apiKeyDisplay').value = key;
    document.getElementById('message').innerText = "Key generated. Silakan isi data dan klik Save.";
    document.getElementById('message').style.color = "blue";
}

// Fungsi untuk tombol "Save Data"
async function saveData() {
    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const email = document.getElementById('email').value;
    const generatedKey = document.getElementById('apiKeyDisplay').value;
    const messageEl = document.getElementById('message');

    if (!firstName || !lastName || !email || !generatedKey) {
        messageEl.innerText = "Semua field harus diisi dan Key harus digenerate!";
        messageEl.style.color = "red";
        return;
    }

    try {
        // Kirim data ke API Backend
        const response = await fetch('/api/user/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                // --- BAGIAN YANG DIUBAH ADA DI SINI ---
                firstName: firstName,  // DULU: first_name
                lastName: lastName,    // DULU: last_name
                // --------------------------------------
                email: email,
                generated_key: generatedKey
            })
        });

        const result = await response.json();

        if (response.ok) {
            messageEl.innerText = result.message;
            messageEl.style.color = "green";
            // Reset form
            document.getElementById('firstName').value = '';
            document.getElementById('lastName').value = '';
            document.getElementById('email').value = '';
            document.getElementById('apiKeyDisplay').value = '';
        } else {
            messageEl.innerText = result.message || "Gagal menyimpan data.";
            messageEl.style.color = "red";
        }
    } catch (error) {
        messageEl.innerText = "Error koneksi ke server.";
        messageEl.style.color = "red";
    }
}