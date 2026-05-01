Team 7(Maddie, Lauren, Isaac): Eng Study Room and Laptop Checkout website 

- web-based database application



Libraries used - must have following installed to run:

1. Microsoft SQL Server

2. Node.js(v18 or higher) - https://nodejs.org/en

3. npm install express mssql

4. npm install msnodesqlv8



RUNNING THE APPLICATION:

1. Open and run Tables.sql(builds schema)

2. to start server, type in terminal: node Application/server.js

3. open http://localhost:3000/home.html in web browser



Technical Details:

- Website/UI: HTML, CSS, Javascript

- Backend: Node.js

- Database: SQL server



Project Details:



Frontend



every html page has a corrensponding .js controller and .css file for styling



home.html:

This is where the user logs in, it asks for an email and password. There are two logging in options/buttons: Log in, and Admin log in



roomPage.htmk:

this is where student can checkout study rooms, on the table that has the open times & rooms, you click the time you want, and when you want it to end

you then can go to the bottom of the page and hit confirm, which will prompt for a room pin, and then you can submit or cancel the reservation



above the table you can find a button to log out, a button to look at current/upcoming reservations, and a drop down menu to switch between the room and laptop checkout page



laptopPage.html:

this is where student can checkout laptops, on the table that has the open times & rooms, you click the time you want, and when you want it to end

you then can go to the bottom of the page and hit confirm, which will show the selected time and ask if they want to submit, and then you can submit or cancel the reservation



above the table you can find a button to log out, a button to look at current/upcoming reservations, and a drop down menu to switch between the room and laptop checkout page



currentResPage:

this is where a student can see their current/upcoming reservations, it shows the date and times booked, what room, and the room pin

same for the laptops as well

you can click and highlight any reservation you would like to cancel, and hit the cancel reservation button to proceed.



adminPage.html:

this is where an admin can add in a student, laptop, or deactivate a laptop in the database

scrolling down the admin can also access the aggregating queries stats for the rooms, laptops, most used times, and students



Backend



server.js:

The core Node.js and Express backend for the application

It establishes the connection pool to the SQL Server database and defines all the API endpoints the frontend uses to retrieve or submit checkout data



backend.js

this file is for testing and adding data into the database using the terminal only



SQL



Tables.sql:

This file is the the foundational schema for the KSUReservations database. 

defines the main tables of our project: Students, Laptops, Rooms, etc.

where we pull and store all of our data.



AggregatingQueries.sql:

This file is the raw SQL source code for the four aggregating queries: Room Popularity, Peak Checkout Times, Laptop Maintenance, and Frequent User tracking. 



Procedures.sql:

This file contains GetDataStats stored procedure which is designed to act as a single "Dashboard Engine" for the Admin portal.

By putting our four aggregating queries into one procedure, the application minimizes network overhead getting all of our datasets in a single database call

making sure the dashboard loads efficiently and also keeps our SQL logic centralized and easy to maintain!
