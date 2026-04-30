//js file helps connect our homepage to our sql databbase, listens for button press, then fetchs the databse from server.js
document.getElementById('loginBtn').addEventListener('click', async function(){
    console.log("The button was clicked!");
    const emailInput = document.getElementById('emailLogin').value;
    const passInput = document.getElementById('passLogin').value;
    try{
        const database = await fetch('/api/login', {
            method:'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({email: emailInput, pass: passInput})
        });
        const data = await database.json();
        if(data.success){
            loginOutput.style.color = "green";
            loginOutput.innerText = "Logging in...";
            setTimeout(() => {window.location.href = `/roomPage`;  }, 1000);
            sessionStorage.setItem('userEmail', emailInput);
            sessionStorage.setItem('studentId', parseInt(data.dbMessage));
            console.log(parseInt(data.dbMessage));
        }
        else {
            loginOutput.style.color = "red";
            loginOutput.innerText = "Not Found - Try again or contact support for help.";
        }
    }
    catch(e){
        console.log(e);
    }

});

//js file helps connect our homepage to our sql databbase, listens for button press, then fetchs the databse from server.js
document.getElementById('adminLoginBtn').addEventListener('click', async function(){
    const loginOutput = document.getElementById('loginOutput');
    console.log("The button was clicked!");
    const emailInput = document.getElementById('emailLogin').value;
    const passInput = document.getElementById('passLogin').value;
    try{
        const database = await fetch('/api/adminLogin', {
            method:'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({email: emailInput, pass: passInput})
        });
        const data = await database.json();
        if(data.success){
            loginOutput.style.color = "green";
            loginOutput.innerText = "Logging in...";
            setTimeout(() => {window.location.href = `/adminPage`;  }, 1000);
            sessionStorage.setItem('userEmail', emailInput);
        }
        else {
            loginOutput.style.color = "red";
            loginOutput.innerText = "Not Found - Try again or contact support for help.";
        }
    }
    catch(e){
        console.log(e);
    }

});