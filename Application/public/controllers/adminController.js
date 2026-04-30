document.getElementById('addStudentBtn').addEventListener('click', async () => {
    const student = {
        firstName: document.getElementById('firstName').value,
        lastName: document.getElementById('lastName').value,
        email: document.getElementById('email').value,
        majorId: parseInt(document.getElementById('majorId').value) || null,
        password: document.getElementById('password').value,
        isAdmin: document.getElementById('isAdmin').checked ? 1 : 0

    };

    try {
        const response = await fetch('/api/add-students', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(student)
        });

        const data = await response.json();

        const output = document.getElementById('adminOutput');

        if (data.success) {
            
            output.style.color = "green";
            output.innerText = "Student added to database!";
            document.getElementById('firstName').value = "";
            document.getElementById('lastName').value = "";
            document.getElementById('email').value = "";
            document.getElementById('majorId').value = "";
            document.getElementById('password').value = ""
            document.getElementById('isAdmin').checked = false;

        } else {
            output.style.color = "red";
            output.innerText = data.message;
        }

    } catch (e) {
        console.error(e);
    }
});

document.getElementById('addLaptopBtn').addEventListener('click', async () => {
    const laptop = {
    laptopMake: document.getElementById('laptopMake').value, 
    laptopModel: document.getElementById('laptopModel').value, 
    dateActivated: document.getElementById('dateActivated').value,
    dateDeactivated: document.getElementById('dateDeactivated').value || null
    };

    try {
        const response = await fetch('/api/add-laptop', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(laptop)
        });

        const data = await response.json();
        const output = document.getElementById('laptopOutput');

        if (data.success) {
            output.style.color = "green";
            output.innerText = "Laptop added to database!";
            document.getElementById('laptopMake').value = "";
            document.getElementById('laptopModel').value = "";
            document.getElementById('dateActivated').value = "";
            document.getElementById('dateDeactivated').value = "";
        } else {
            output.style.color = "red";
            output.innerText = data.message;
        }

    } catch (e) {
        console.error(e);
    }
});

async function logOut() {
    try {
        const response = await fetch('/api/logout', { method: 'POST' });
        const data = await response.json();
        
        if (data.success) {
            alert("Logging out...");
            sessionStorage.clear(); 
            setTimeout(() => {
            window.location.href = "home.html"; 
            }, 1000);
        }
    } catch(e) {
        console.error("Error logging out:", e);
    }
}
