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
        trustServerCertificate: true,
    }
};

const checkAuth = (req, res, next) => {
    const cookieHeader = req.headers.cookie || "";
    if (cookieHeader.includes("email=")) {
        const emailValue = cookieHeader.split("email=")[1].split(";")[0];
        if (emailValue.trim() !== "") {
            return next();
        }
    }
    res.redirect('/home.html'); 
};
//this section driects users to different pages 
app.get('/roomPage', checkAuth, (req, res) => {
    res.set({
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
    });
    res.sendFile(path.join(__dirname, 'websites', 'roomPage.html'));
});

app.get('/laptopPage', checkAuth, (req, res) => {
    res.set({
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
    });
   res.sendFile(path.join(__dirname, 'websites', 'laptopPage.html'));
});

app.get('/currentResPage', checkAuth, (req, res) => {
    res.set({
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
    });
   res.sendFile(path.join(__dirname, 'websites', 'currentResPage.html'));
});

app.get('/adminPage', checkAuth, (req, res) => {
    const cookieHeader = req.headers.cookie || "";
    if (!cookieHeader.includes("isAdmin=true")) {
        return res.redirect('/roomPage');;
    } 
    res.set({
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
    });
    res.sendFile(path.join(__dirname, 'websites', 'adminPage.html'));
});

//logins for regular users and admin users
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
            res.setHeader('Set-Cookie', [
            `email=${email}; Path=/; HttpOnly; Max-Age=1800`,
            `isAdmin=false; Path=/; HttpOnly; Max-Age=1800` 
            ]);
            return res.json({ success: true, dbMessage: result.recordset[0].StudentId });
        } else {
            return res.json({ success: false, dbMessage:"0" });
        }

    }
    catch(e){
        //if ConnectionError: failed to connect to localhost:1433 happens
        //enable TCP/IP protocol for MSSQLSERVER
        console.error("ERROR:", e);
        res.status(500).json({dbMessage: "SERVER ERROR"})
    }
});

app.post('/api/adminLogin', async (req, res) => {
    const email = req.body.email;
    const pass = req.body.pass;
    console.log("here");
    try{
        await sql.connect(dbConfig);
        const request = new sql.Request();
        request.input('email', sql.NVarChar, email);
        request.input('pass', sql.NVarChar, pass);
        const result = await request.query('SELECT StudentId, FirstName FROM Student WHERE Email = @email AND [Password] = @pass AND IsAdmin = 1');
        if (result.recordset.length > 0) {
            res.setHeader('Set-Cookie', [
            `email=${email}; Path=/; HttpOnly; Max-Age=1800`,
            `isAdmin=true; Path=/; HttpOnly; Max-Age=1800` 
            ]);
            return res.json({ success: true, dbMessage: "success" });
        } else {
            return res.json({ success: false, dbMessage:"0" });
        }

    }
    catch(e){
        //if ConnectionError: failed to connect to localhost:1433 happens
        //enable TCP/IP protocol for MSSQLSERVER
        console.error("ERROR:", e);
        res.status(500).json({dbMessage: "SERVER ERROR"})
    }
});

app.post('/api/logout', (req, res) => {
    res.setHeader('Set-Cookie', [
            `email=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly`,
            `isAdmin=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly` 
            ]);
    res.json({ success: true, message: "Logged out successfully" });
});

//this section is for commincating back and update the database with new data
app.post('/api/add-students', async (req, res) => {
    const { firstName, lastName, email, majorId, password, isAdmin } = req.body;
    try {
        await sql.connect(dbConfig);

        const request = new sql.Request();
        request.input('fname', sql.NVarChar, firstName);
        request.input('lname', sql.NVarChar, lastName);
        request.input('email', sql.NVarChar, email);
        request.input('mid', sql.Int, majorId);
        request.input('pass', sql.NVarChar, password);
        request.input('admin', sql.Bit, isAdmin);

        await request.query(`
            INSERT INTO Student (FirstName, LastName, Email, MajorId, [Password], IsAdmin)
            VALUES (@fname, @lname, @email, @mid, @pass, @admin)
        `);
        
        res.json({ success: true, message: "Student created" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: err.message });
    }
});

app.post('/api/update-student', async (req, res) =>
{
   const { studentId, firstName, lastName, email, majorId, password } = req.body;

    try{
        await sql.connect(dbConfig);
        const request = new sql.Request();

        request.input('id', sql.Int, studentId);
        request.input('fname', sql.NVarChar, firstName);
        request.input('lname', sql.NVarChar, lastName);
        request.input('email', sql.NVarChar, email);
        request.input('mid', sql.Int, majorId);
        request.input('pass', sql.NVarChar, password);

        const result = await request.query(`
            UPDATE Student 
            SET FirstName = @fname,
                LastName = @lname,
                Email = @email,
                MajorId = @mid,
                Password = @pass
            WHERE StudentId = @id
            `);
        if (result.rowsAffected[0] === 0) {
        return res.status(404).json({ success: false, message: "Student not found" });
        }

        res.json({ success: true, message: "Student updated successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: err.message });
    }
});

app.post('/api/room-reservations', async (req, res) => {
    const { roomPassword, startTime, endTime, roomId, studentId, reservationDuration } = req.body;
    
    try {
        
        await sql.connect(dbConfig);
        const request = new sql.Request();

        request.input('pass', sql.NVarChar, roomPassword);
        request.input('start', sql.VarChar, startTime);
        request.input('end', sql.VarChar, endTime);
        request.input('rid', sql.Int, roomId);
        request.input('sid', sql.Int, studentId);
        request.input('dur', sql.NVarChar, reservationDuration);

        const query = `
            INSERT INTO RoomReservation (RoomPassword, StartTime, EndTime, RoomId, StudentId, ReservationDuration)
            VALUES (@pass, @start, @end, @rid, @sid, @dur)
        `;

        await request.query(query);
        
        res.json({ success: true, message: "Reservation made" });
    } catch (err) {
        console.error("SQL Error:", err);
        res.status(500).json({ success: false, message: err.message });
    }
});

app.post('/api/update-laptop', async(req, res) =>
{
    const{laptopId, laptopMake, laptopModel, dateActivated, dateDeactivated} = req.body;
    try{
        await sql.connect(dbConfig);
        const request = new sql.Request();

        request.input('lapId', sql.Int, laptopId)
        request.input('lMake', sql.NVarChar, laptopMake);
        request.input('lModel', sql.NVarChar, laptopModel);
        request.input('dActivated', sql.DateTime, dateActivated);

        const deactValue = dateDeactivated && dateDeactivated !== "" ? dateDeactivated : null;
        request.input('dDeactivated', sql.DateTime, deactValue);

        const result = await request.query(`
            UPDATE Laptop
            SET LaptopMake = @lMake,
                LaptopModel = @lModel,
                DateActivated = @dActivated,
                DateDeactivated = @dDeactivated
            WHERE LaptopId = @lapId
            `);
        if (result.rowsAffected[0] === 0) {
        return res.status(404).json({ success: false, message: "Laptop not found" });
        }
        res.json({ success: true, message: "Laptop updated successfully" });
        
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: err.message });
    }
});

app.post('/api/add-laptop', async (req, res) =>
{
    const{laptopMake, laptopModel, dateActivated, dateDeactivated} = req.body;
    try{
        await sql.connect(dbConfig);
        const request = new sql.Request();
        request.input('lMake', sql.NVarChar, laptopMake);
        request.input('lModel', sql.NVarChar, laptopModel);
        request.input('dActivated', sql.DateTime, dateActivated);

        //allows for dDeactivated to be entered as "" and be null
        const deactValue = dateDeactivated && dateDeactivated !== "" ? dateDeactivated : null;
        request.input('dDeactivated', sql.DateTime, deactValue);

        await request.query(` 
            INSERT INTO Laptop (LaptopMake, LaptopModel,  DateActivated, DateDeactivated)
            VALUES (@lMake, @lModel, @dActivated, @dDeactivated)
        `);
        res.json({ success: true, message: "Laptop Added"});
    } 
    catch(err)
    {
        console.error(err);
        res.status(500).json({ success: false, message: err.message });
    }
});

app.post('/api/delete-laptop-reservation', async (req, res) =>
{
    const{laptopId, LaptopReservationId} = req.body;
    try{
        await sql.connect(dbConfig);
        const request = new sql.Request();
        request.input('id', sql.Int, laptopId);
        request.input('resId', sql.Int, LaptopReservationId);

        const result = await request.query(`
            DELETE FROM LaptopReservation
            WHERE LaptopReservationId = @resId AND LaptopId = @id
            `);
        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({ success: false, message: "Reservation not found." });
        }
        res.json({ success: true, message: "Laptop reservation deleted" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: err.message });
    }
});

app.post('/api/laptop-reservations', async (req, res) =>{
    const{ studentId, dropOffTime, pickUpTime, laptopId} = req.body;
    try{
        await sql.connect(dbConfig);
        const request = new sql.Request();
        request.input('stid', sql.Int, studentId);
        request.input('drop', sql.VarChar, dropOffTime);
        request.input('pick', sql.VarChar, pickUpTime);
        request.input('lapid', sql.Int, laptopId);
        const query = `
           INSERT INTO LaptopReservation (StudentId, DropoffTime, PickupTime, LaptopId)
           VALUES(@stid, @drop, @pick, @lapid)
        `;
        await request.query(query);
        res.json({success: true, message: "Reservation made"});
    } catch(err){
        console.error("SQL Error:", err);
        res.status(500).json({ success: false, message: err.message });
    }
});

app.post('/api/delete-room-reservation', async (req, res) =>
{
    const{roomId, roomResId} = req.body;
    try{
        await sql.connect(dbConfig);
        const request = new sql.Request();
        request.input('id', sql.Int, roomId);
        request.input('roomResId', sql.Int, roomResId);

        const result = await request.query(`
            DELETE FROM RoomReservation
            WHERE RoomReservationId = @roomResId AND RoomId = @id
            `);
        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({ success: false, message: "Reservation not found." });
        }
        res.json({ success: true, message: "Room reservation deleted" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: err.message });
    }
});

app.listen(3000, () => {
    console.log('server running open http://localhost:3000/home.html in browser');
});


//this section is used for room and laptop page, sets up calendar user can pick times from
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
        const laptopQuery = `
            SELECT LaptopId,LaptopMake, LaptopModel 
            FROM Laptop
            WHERE DateDeactivated IS NULL OR DateDeactivated > GETDATE()
        `;
        const laptopResult = await request.query(laptopQuery);
        let laptops = laptopResult.recordset;
        request.input('searchDate', sql.Date, requestedDate); 
        const resQuery = `
            SELECT LaptopId, 
                FORMAT(PickupTime, 'yyyy-MM-dd HH:mm:ss') AS PickupTime, 
                FORMAT(DropoffTime, 'yyyy-MM-dd HH:mm:ss') AS DropoffTime
            FROM LaptopReservation LR
            WHERE CAST(PickupTime AS DATE) = @searchDate
        `;
        const resResult = await request.query(resQuery);
        const reservations = resResult.recordset;
        laptops.forEach(laptop => {
            laptop.bookedSlots = reservations.filter(res => res.LaptopId === laptop.LaptopId);
        });
        res.json({ success: true, laptops: laptops });
        
    } catch(e) {
        console.error("ERROR:", e);
        res.status(500).json({ success: false, dbMessage: "SERVER ERROR" });
    }
});


//this section is used for currentResPage, gets their current rooms and laptops
app.get('/api/loadRooms', async (req, res) => {
    const studentId = req.query.studentId
    try {
        await sql.connect(dbConfig);
        const request = new sql.Request();
        request.input('studentId', sql.Int, studentId);
        const roomQuery = `
            SELECT 
                FORMAT(RR.StartTime, 'yyyy-MM-dd HH:mm:ss') AS StartTime,
                FORMAT(RR.EndTime, 'yyyy-MM-dd HH:mm:ss') AS EndTime,
                RR.RoomPassword,
                RR.RoomId, 
                R.RoomNumber,
                RR.RoomReservationId
            FROM RoomReservation RR
            INNER JOIN Room R ON RR.RoomId = R.RoomId
            WHERE RR.StudentId = @studentId AND RR.EndTime >= GETDATE();
        `;
        const roomResult = await request.query(roomQuery);
        let reservations = roomResult.recordset;
        res.json({ success: true, reservations: reservations });
        
    } catch(e) {
        console.error("ERROR:", e);
        res.status(500).json({ success: false, dbMessage: "SERVER ERROR" });
    }
});

app.get('/api/loadLaptops', async (req, res) => {
    const studentId = req.query.studentId
    try {
        await sql.connect(dbConfig);
        const request = new sql.Request();
        request.input('studentId', sql.Int, studentId);
        const lapQuery = `
            SELECT 
                LR.LaptopReservationId,
                FORMAT(LR.PickupTime, 'yyyy-MM-dd HH:mm:ss') AS PickupTime,
                FORMAT(LR.DropoffTime, 'yyyy-MM-dd HH:mm:ss') AS DropoffTime,
                LR.LaptopId,
                L.LaptopMake
            FROM LaptopReservation LR
            INNER JOIN Laptop L ON LR.LaptopId = L.LaptopId
            WHERE LR.StudentId = @studentId AND LR.DropoffTime >= GETDATE();
        `;
        const lapResult = await request.query(lapQuery);
        let reservations = lapResult.recordset;
        res.json({ success: true, reservations: reservations });
        
    } catch(e) {
        console.error("ERROR:", e);
        res.status(500).json({ success: false, dbMessage: "SERVER ERROR" });
    }
});