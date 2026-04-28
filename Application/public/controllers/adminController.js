document.getElementById('addStudentBtn').addEventListener('click', async () => {
    const student = {
        firstName: document.getElementById('firstName').value,
        lastName: document.getElementById('lastName').value,
        majorId: document.getElementById('majorId').value || null,
        email: document.getElementById('email').value,
        password: document.getElementById('password').value,
        isAdmin: document.getElementById('isAdmin').checked
    };

    try {
        const response = await fetch('/api/addStudent', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(student)
        });

        const data = await response.json();

        const output = document.getElementById('adminOutput');

        if (data.success) {
            output.style.color = "green";
            output.innerText = "Student added to database!";
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
        make: document.getElementById('laptopMake').value,
        model: document.getElementById('laptopModel').value,
        dateActivated: document.getElementById('dateActivated').value,
        dateDeactivated: document.getElementById('dateDeactivated').value || null
    };

    try {
        const response = await fetch('/api/addLaptop', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(laptop)
        });

        const data = await response.json();
        const output = document.getElementById('laptopOutput');

        if (data.success) {
            output.style.color = "green";
            output.innerText = "Laptop added to database!";
        } else {
            output.style.color = "red";
            output.innerText = data.message;
        }

    } catch (e) {
        console.error(e);
    }
});
