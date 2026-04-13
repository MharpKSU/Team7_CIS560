DROP TABLE IF EXISTS TestConnection;

--test table for testing server connection
CREATE TABLE TestConnection (
    id INT IDENTITY(1,1) PRIMARY KEY,
    message NVARCHAR(255) NOT NULL
);

INSERT INTO TestConnection (message)
VALUES ('Success! Your Node.js server is talking to your SQL database!');

SELECT * FROM TestConnection;