//communicates with our sql database in order to relay it back to our frontend, runs server for our html website
//tools downloaded:
//npm install express mssql
//npm install msnodesqlv8
const express = require('express');
const sql = require('mssql/msnodesqlv8');
const path = require('path');
const app = express();
app.use(express.static(path.join(__dirname, 'public')));
const dbConfig ={
    server: '(localdb)\\MSSQLLocalDb',
    database: 'master',
    driver: 'ODBC Driver 17 for SQL Server',
    options: {
        trustedConnection: true,
        encrypt: false,
        trustServerCertificate: true
    }
};

app.get('/api/testconnection', async (req, res) => {
    try{
        await sql.connect(dbConfig);
        const result = await sql.query('SELECT * FROM TestConnection');
        res.json({dbMessage: result.recordset[0].message});
    }
    catch(e){
        //if ConnectionError: failed to connect to localhost:1433 happens
        //enable TCP/IP protocol for MSSQLSERVER
        console.error("ERROR:", e);
        res.status(500).json({dbMessage: "FAILED TO CONNECT"})
    }
});

app.listen(3000, () => {
    console.log('server running open http://localhost:3000 in browser');
});