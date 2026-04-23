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
            loginOutput.innerText = data.dbMessage;
            console.log("SECOND PAGE NOW");
            setTimeout(() => {window.location.href = '/websites/roomPage.html'; }, 1000);
        }
        else {
            loginOutput.style.color = "red";
            loginOutput.innerText = data.dbMessage;
        }
    }
    catch(e){
        console.log(e);
    }

});