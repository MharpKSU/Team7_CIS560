Team 7(Maddie, Lauren, Isaac): Eng Study Room and Laptop Checkout website 
web-based database application

must have following installed to run:
Microsoft SQL Server
Node.js(v18 or higher) - https://nodejs.org/en

RUNNING THE APPLICATION:
1. Open and run Tables.sql(builds schema)
2. to start server, type in terminal: node Application/server.js
3. open http://localhost:3000/home.html in web browser

potential errors:
1. when running, if error: Data source name not found 
- must change driver in server.js, search and open ODBC Data sources on device, go to driver tab, and change line in server.js to '.... for SQL Server' found on device
