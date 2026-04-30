document.getElementById('addStudentBtn').addEventListener('click', async () => {
    const first = document.getElementById('firstName').value.trim();
    const last = document.getElementById('lastName').value.trim();
    const email = document.getElementById('email').value.trim();
    const pass = document.getElementById('password').value.trim();
    if (first == '' || last == '' || email == '' || pass == '') {
        alert("please fill out all required fields");
        return;
    }
    const student = {
        firstName: first,
        lastName: last,
        email: email,
        majorId: parseInt(document.getElementById('majorId').value) || null,
        password: pass,
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
            setTimeout(() => {
                output.innerText = "";
            }, 3000);

        } else {
            output.style.color = "red";
            output.innerText = data.message;
        }

    } catch (e) {
        console.error(e);
    }
});

document.getElementById('addLaptopBtn').addEventListener('click', async () => {
    const make = document.getElementById('laptopMake').value.trim();
    const model = document.getElementById('laptopModel').value.trim();
    const date = document.getElementById('dateActivated').value;
    if (make == '' || model == '' || date == '') {
        alert("please fill out all required fields");
        return;
    }
    const laptop = {
    laptopMake: make, 
    laptopModel: model, 
    dateActivated:date,
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
            setTimeout(() => {
                output.innerText = "";
            }, 3000);
        } else {
            output.style.color = "red";
            output.innerText = data.message;
        }

    } catch (e) {
        console.error(e);
    }
});

document.getElementById('laptopMakeD').addEventListener('click', async () => {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    document.getElementById('dateDeactivatedD').value =now.toISOString().slice(0, 16);

});

document.getElementById('deactLaptopBtn').addEventListener('click', async () => {
    const make = document.getElementById('laptopMakeD').value.trim();
    const model = document.getElementById('laptopModelD').value.trim();
    const id = document.getElementById('laptopId').value;
    if (make == '' || model == '' || id == '') {
        alert("please fill out all required fields");
        return;
    }
    const laptop = {
        laptopId: id,
        laptopMake: make, 
        laptopModel: model, 
        dateDeactivated: document.getElementById('dateDeactivatedD').value
    };
    try {
        const response = await fetch('/api/deact-laptop', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(laptop)
        });

        const data = await response.json();
        const output = document.getElementById('laptopOutputD');

        if (data.success) {
            output.style.color = "green";
            output.innerText = "Laptop deactvated!";
            output.style.color = "green";
            output.innerText = "Laptop deactvated!";
            document.getElementById('laptopMakeD').value = "";
            document.getElementById('laptopModelD').value = "";
            document.getElementById('laptopId').value = "";
            document.getElementById('dateDeactivatedD').value = "";
            setTimeout(() => {
                output.innerText = "";
            }, 3000);
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
