//communicates with our sql database in order to relay it back to our frontend, runs server for our html website
//tools downloaded:
//npm install express mssql
//npm install msnodesqlv8
const express = require('express');
const sql = require('mssql/msnodesqlv8');
const path = require('path');
const app = express();
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

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

app.post('/api/login', async (req, res) => {
    const email = req.body.email;
    const pass = req.body.pass;
    console.log("here");
    try{
        await sql.connect(dbConfig);
        const request = new sql.Request();
        request.input('email', sql.NVarChar, email);
        request.input('pass', sql.NVarChar, pass);
        const result = await request.query('SELECT StudentId, FirstName FROM Student WHERE Email = @email AND [Password] = @pass');
        if (result.recordset.length > 0) {
            console.log('right');
            res.json({ success: true, dbMessage:"Logging In..." });
        } else {
            res.json({ success: false, dbMessage:"Not Found - Try again or contact support for help." });
        }
    }
    catch(e){
        //if ConnectionError: failed to connect to localhost:1433 happens
        //enable TCP/IP protocol for MSSQLSERVER
        console.error("ERROR:", e);
        res.status(500).json({dbMessage: "SERVER ERROR"})
    }
});

app.listen(3000, () => {
    console.log('server running open http://localhost:3000/home.html in browser');
});

app.get('/api/roomCal', async (req, res) => {
    const requestedDate = req.query.date; 
    const dateObj = new Date(requestedDate);
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const dayOfWeek = days[dateObj.getUTCDay()];
    try{
        await sql.connect(dbConfig);
        const request = new sql.Request();
        request.input('dayOfWeek', sql.NVarChar, dayOfWeek);
        const roomQuery = `
            SELECT r.RoomId, r.RoomNumber, a.OpenTime, a.ClosedTime 
            FROM Room r
            JOIN RoomAvailability a ON r.RoomId = a.RoomId
            WHERE a.DayOfWeek = @dayOfWeek
        `;
        const roomResult = await request.query(roomQuery)
        let rooms = roomResult.recordset;

        request.input('searchDate', sql.Date, requestedDate); 
        const resQuery = `
            SELECT RoomId, StartTime, EndTime 
            FROM RoomReservation 
            WHERE CAST(StartTime AS DATE) = @searchDate
        `;
        
        const resResult = await request.query(resQuery);
        const reservations = resResult.recordset;
        rooms.forEach(room => {
            room.bookedSlots = reservations.filter(res => res.RoomId === room.RoomId);
        });
        res.json({ success: true, rooms: rooms });
    }
    catch(e){
        console.log(e);
    }
});

app.get('/api/laptopCal', async (req, res) => {
    const requestedDate = req.query.date; 

    try {
        await sql.connect(dbConfig);
        const request = new sql.Request();
        
        // 1. Get all laptops that aren't deactivated yet
        const laptopQuery = `
            SELECT LaptopId, LaptopNumber, LaptopMake, LaptopModel 
            FROM Laptop
            WHERE DateDeactivated IS NULL OR DateDeactivated > GETDATE()
        `;
        const laptopResult = await request.query(laptopQuery);
        let laptops = laptopResult.recordset;

        // 2. Get laptop reservations for this specific date
        request.input('searchDate', sql.NVarChar, `%${requestedDate}%`);
        const resQuery = `
            SELECT LaptopId, ReserveDateTime 
            FROM LaptopReservation 
            WHERE ReserveDateTime LIKE @searchDate
        `;
        const resResult = await request.query(resQuery);
        const reservations = resResult.recordset;

        // 3. Bundle the reservations into the specific laptops
        laptops.forEach(laptop => {
            laptop.bookedSlots = reservations.filter(res => res.LaptopId === laptop.LaptopId);
        });

        // Send it to the frontend!
        res.json({ success: true, laptops: laptops });
        
    } catch(e) {
        console.error("ERROR:", e);
        res.status(500).json({ success: false, dbMessage: "SERVER ERROR" });
    }
});