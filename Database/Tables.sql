DROP TABLE IF EXISTS RoomReservation; 
DROP TABLE IF EXISTS Student;         
DROP TABLE IF EXISTS Room;            
DROP TABLE IF EXISTS Major;           
DROP TABLE IF EXISTS TestConnection;

--test table for testing server connection
CREATE TABLE TestConnection (
    id INT IDENTITY(1,1) PRIMARY KEY,
    message NVARCHAR(255) NOT NULL
);
CREATE TABLE Room(
    RoomId INT IDENTITY(1,1) PRIMARY KEY,
    RoomNumber INT NOT NULL,
    --OpenTimes NVARCHAR(255) NOT NULL, this is bad and a violation
    UNIQUE(RoomNumber)
)


CREATE TABLE Major(
    MajorId INT IDENTITY(1,1) PRIMARY KEY,
    [Name] NVARCHAR(100) NOT NULL
)


Create TABLE Student(
    StudentId INT IDENTITY(1,1) PRIMARY KEY,
    LastName NVARCHAR(32) NOT NULL CHECK (LEN([LastName]) >= 1),
    FirstName NVARCHAR(32) NOT NULL CHECK (LEN([FirstName]) >= 1),
    MajorId INT NULL,
    Email NVARCHAR(255) NOT NULL,

    UNIQUE(Email),
    CONSTRAINT FK_Major FOREIGN KEY (MajorId) REFERENCES Major(MajorId)
)


CREATE TABLE RoomReservation(
    RoomReservationId INT IDENTITY(1,1) PRIMARY KEY,
    ReserveDateTime NVARCHAR(255) NOT NULL, --I think i makes more sense to do it lik this instead of DateTime cause we can do '2015-2-2 10:20:20 To 2015-2-2 12:20:20'
    RoomPassword NVARCHAR(30) NOT NULL,
    RoomId INT NOT NULL,
    StudentId INT NOT NULL,
    ReservationDuration NVARCHAR(255),
    UNIQUE(ReserveDateTime, RoomId),
    CONSTRAINT FK_Room FOREIGN KEY(RoomId) REFERENCES Room(RoomId),
    CONSTRAINT FK_Student FOREIGN KEY(StudentId) REFERENCES Student(StudentId)
)
Insert INTO Major([Name])
Values('Computer Science'), 
      ('Eletrical Engineering'),
      ('Computer Engineering'),
      ('Mechanical Engineering'),
      ('Chemical Engineering');


INSERT INTO Room (RoomNumber) 
VALUES (101);
INSERT INTO Student (FirstName, LastName, Email, MajorId) 
VALUES ('John', 'Fuller', 'jon@ksu.edu', 1);
INSERT INTO Student (FirstName, LastName, Email, MajorId) 
Values('Maddie', 'Harp', 'maddie@ksu.edu', 1),
      ('Isaac', 'Meisinger', 'isaac46@ksu.edu', 1),
      ('Lauren', 'Palyash', 'lauren@ksu.edu', 1),
      ('Marshall', 'Mosier', 'marshall@ksu.edu', 5),
      ('Tobin', 'Simpkins', 'tobin@ksu.edu', 4),
      ('Michael', 'Valasques', 'michael@ksu.edu', 2),
      ('Pa', 'Trice', 'pa@ksu.edu', 3);
INSERT INTO RoomReservation (RoomPassword, ReserveDateTime, RoomId, StudentId, ReservationDuration)
VALUES ('Patrice', '2015-2-2 10:20:20 To 2015-2-2 12:20:20', 1, 1, '2 Hours')
SELECT * FROM RoomReservation;
SELECT * FROM Student;