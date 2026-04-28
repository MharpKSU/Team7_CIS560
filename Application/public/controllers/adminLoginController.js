document.getElementById('loginBtn').addEventListener('click', async function () {
    console.log("The button was clicked!");
    const emailInput = document.getElementById('emailLogin').value;
    const passInput = document.getElementById('passLogin').value;

    try {
        const database = await fetch('/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: emailInput, pass: passInput })
        });

        const data = await database.json();

        if (data.success) {
            if (data.isAdmin) {
                loginOutput.style.color = "green";

                sessionStorage.setItem('userEmail', emailInput);
                sessionStorage.setItem('isAdmin', data.isAdmin);

                setTimeout(() => {
                    window.location.href = `/adminPage`;
                }, 1000);
            } else {
                loginOutput.style.color = "red";
                loginOutput.innerText = "User is not an admin.";
            }
        } else {
            loginOutput.style.color = "red";
            loginOutput.innerText = data.dbMessage;
        }
    }
    catch (e) {
        console.log(e);
    }
});