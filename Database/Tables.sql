DROP TABLE IF EXISTS RoomReservation; 
DROP TABLE IF EXISTS LaptopReservation; 
DROP TABLE IF EXISTS Student;         
DROP TABLE IF EXISTS Room;            
DROP TABLE IF EXISTS Major;           
DROP TABLE IF EXISTS Laptop;
GO


CREATE TABLE Room(
    RoomId INT IDENTITY(1,1) PRIMARY KEY,
    RoomNumber INT NOT NULL,
    --OpenTimes NVARCHAR(255) NOT NULL, this is bad and a violation
    UNIQUE(RoomNumber)
)

CREATE TABLE Laptop(
    LaptopId INT IDENTITY(1,1) PRIMARY KEY,
    LaptopNumber INT NOT NULL,
    LaptopMake NVARCHAR(50) NOT NULL,--Brand
    LaptopModel NVARCHAR(50) NOT NULL,--Model
    DateActivated DATETIME NOT NULL,
    DateDeactivated DATETIME NULL,
    
    UNIQUE(LaptopNumber)
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
    [Password] NVARCHAR(30) NOT NULL,
    UNIQUE(Email),
    CONSTRAINT FK_Major FOREIGN KEY (MajorId) REFERENCES Major(MajorId)
)

CREATE TABLE LaptopReservation(
    LaptopReservationId INT IDENTITY(1,1) PRIMARY KEY,
    ReserveDateTime NVARCHAR(255) NOT NULL, 
    StudentId INT NULL,
    DropoffTime DATETIME NULL,
    PickupTime DATETIME NULL,
    LaptopId INT NOT NULL,
    CONSTRAINT FK_Laptop FOREIGN KEY(LaptopId) REFERENCES Laptop(LaptopId),
    CONSTRAINT FK_Student FOREIGN KEY(StudentId) REFERENCES Student(StudentId)
)

CREATE TABLE RoomReservation(
    RoomReservationId INT IDENTITY(1,1) PRIMARY KEY,
    ReserveDateTime NVARCHAR(255) NOT NULL, --I think it makes more sense to do it lik this instead of DateTime cause we can do '2015-2-2 10:20:20 To 2015-2-2 12:20:20'
    RoomPassword NVARCHAR(30) NOT NULL,
    RoomId INT NOT NULL,
    StudentId INT NOT NULL,
    ReservationDuration NVARCHAR(255),
    UNIQUE(ReserveDateTime, RoomId),
    CONSTRAINT FK_Room FOREIGN KEY(RoomId) REFERENCES Room(RoomId),
    CONSTRAINT FK_Student2 FOREIGN KEY(StudentId) REFERENCES Student(StudentId)
)
GO

INSERT INTO Laptop(LaptopNumber, LaptopMake, LaptopModel, DateActivated, DateDeactivated)
VALUEs(1, 'Dell', 'Precision 7510', '2020-05-08 12:35:29.12', NULL),
      (2, 'Dell', 'XPS 13', '2026-4-21 7:32:32:0', NULL),
      (3, 'Dell', 'Latitude 2120', '2011-3-11 8:10:48:123', '2018-1-1 1:00:00:00'),
      (4, 'ThinkPad', 'X1', '2025-11-14 18:23:45:66', NULL),
      (5, 'HP', 'OmniBook', '2023-6-17 15:23:00:00', NULL),
      (6, 'HP', 'Spectre', '2022-8-30 13:00:00:76', '2026-4-21 20:03:00:00');

Insert INTO Major([Name])
Values('Computer Science'), 
      ('Eletrical Engineering'),
      ('Computer Engineering'),
      ('Mechanical Engineering'),
      ('Chemical Engineering'),
      ('Industrial Engineering'),
      ('Civil Engineering'),
      ('Construction Science'),
      ('Nuclear Engineering'),
      ('Boimedical Engineering');
      
INSERT INTO Room (RoomNumber) 
VALUES (101),
       (102),
       (103),
       (107),
       (108),
       (234),
       (235),
       (236),
       (237);
INSERT INTO Student (FirstName, LastName, Email, MajorId, [Password]) 
VALUES ('Jon', 'Fuller', 'jon@ksu.edu', 1, 'JOHN');
INSERT INTO Student (FirstName, LastName, Email, MajorId, [Password]) 
Values('Maddie', 'Harp', 'maddie@ksu.edu', 1, 'HARP1234'),
      ('Isaac', 'Meisinger', 'isaac46@ksu.edu', 1, 'ISAAC1234'),
      ('Lauren', 'Palyash', 'lauren@ksu.edu', 1, 'PASSPASS'),
      ('Marshall', 'Mosier', 'marshall@ksu.edu', 5, 'CHUDCHUD'),
      ('Tobin', 'Simpkins', 'tobin@ksu.edu', 4, 'BOBERBOBER'),
      ('Michael', 'Valasques', 'michael@ksu.edu', 2, 'BIGMIKE12'),
      ('Pa', 'Trice', 'pa@ksu.edu', 3, 'HELP');
INSERT INTO RoomReservation (RoomPassword, ReserveDateTime, RoomId, StudentId, ReservationDuration)
VALUES ('Patrice', '2015-2-2 10:20:20 To 2015-2-2 12:20:20', 1, 1, '2 Hours')
INSERT INTO LaptopReservation(ReserveDateTime, StudentId, DropoffTime, PickupTime, LaptopId)
VALUES ('BLEH BLEH', 4, '2026-4-21 10:20:00:00', '2026-4-21 12:20:00:00', 1)
SELECT * FROM RoomReservation;
SELECT * FROM Student;
SELECT * FROM Laptop;
SELECT * FROM ROOM;
SELECT * FROM LaptopReservation;
GO