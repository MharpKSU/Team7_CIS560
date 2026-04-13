//js file helps connect our homepage to our sql databbase, listens for button press, then fetchs the databse from server.js
const testBtn = document.getElementById('showDatabase');
const testResults = document.getElementById('result');

//
testBtn.addEventListener('click', async function() {
    testResults.innerText = "loading data base!";
    try{
        const database = await fetch('/api/testconnection');
        const data = await database.json();
        testResults.innerText = data.dbMessage;
    }
    catch(error){
        testResults.innerText = "ERROR GETTING DATABASE";
    }
    
});