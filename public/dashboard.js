// public/dashboard.js

// Cek apakah admin sudah login (punya token)
const token = localStorage.getItem('adminToken');
if (!token) {
    window.location.href = 'login.html';
}

// Fungsi Logout
function logout() {
    localStorage.removeItem('adminToken');
    window.location.href = 'login.html';
}

// Fungsi Load Data saat halaman dibuka
async function loadDashboardData() {
    try {
        const response = await fetch('/api/admin/dashboard', {
            method: 'GET',
            headers: {
                // Kirim token di header untuk otentikasi
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.status === 401 || response.status === 403) {
            alert("Sesi habis. Silakan login lagi.");
            logout();
            return;
        }

        const data = await response.json();
        const tableBody = document.querySelector('#dataTable tbody');
        tableBody.innerHTML = ''; // Kosongkan tabel

        data.forEach(item => {
            const row = document.createElement('tr');
            const createdDate = new Date(item.created_at).toLocaleString();
            const statusClass = item.status === 'Valid' ? 'status-valid' : 'status-invalid';

            row.innerHTML = `
                <td>${item.user_name}</td>
                <td>${item.email}</td>
                <td>${createdDate}</td>
                <td class="${statusClass}">${item.status}</td>
                <td>
                    <input type="text" class="edit-input" id="key-${item.key_id}" value="${item.key_value}">
                </td>
                <td>
                    <button class="btn-edit" onclick="updateKey(${item.key_id})">Update</button>
                </td>
            `;
            tableBody.appendChild(row);
        });

    } catch (error) {
        console.error("Gagal mengambil data:", error);
    }
}

// Fungsi Update Key
async function updateKey(keyId) {
    const newKeyValue = document.getElementById(`key-${keyId}`).value;
    
    if(!confirm("Yakin ingin mengubah API Key ini?")) return;

    try {
        const response = await fetch(`/api/admin/key/${keyId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ new_key: newKeyValue })
        });

        const result = await response.json();
        if(response.ok) {
            alert(result.message);
            loadDashboardData(); // Reload tabel
        } else {
            alert("Gagal update: " + result.message);
        }
    } catch (error) {
        alert("Error koneksi.");
    }
}

// Jalankan fungsi load saat script dimuat
loadDashboardData();