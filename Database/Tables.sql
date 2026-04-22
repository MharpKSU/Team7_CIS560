DROP TABLE IF EXISTS RoomReservation; 
DROP TABLE IF EXISTS LaptopReservation; 
DROP TABLE IF EXISTS Student;
DROP TABLE IF EXISTS RoomAvailability;         
DROP TABLE IF EXISTS Room;            
DROP TABLE IF EXISTS Major;           
DROP TABLE IF EXISTS Laptop;
GO


CREATE TABLE Room(
    RoomId INT IDENTITY(1,1) PRIMARY KEY,
    RoomNumber INT NOT NULL,

    UNIQUE(RoomNumber)
)

CREATE TABLE RoomAvailability(
    RoomAvailabilityId INT IDENTITY(1,1) PRIMARY KEY,
    RoomId INT NOT NULL,
    DayOfWeek NVARCHAR(12) NOT NULL,
    OpenTime TIME NOT NULL,
    ClosedTime TIME NOT NULL

    CONSTRAINT FK_Room2 FOREIGN KEY(RoomId) REFERENCES Room(RoomId)
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
VALUES(1, 'Dell', 'Precision 7510', '2020-05-08 12:35:29.12', NULL),
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

INSERT INTO RoomAvailability(RoomId, DayOfWeek, OpenTime, ClosedTime)
VALUES(1, 'Monday', '8:00:00', '20:00:00'),
      (1, 'Tuesday', '8:00:00', '20:00:00'),
      (1, 'Wednesday', '8:00:00', '20:00:00'),
      (1, 'Thursday', '8:00:00', '20:00:00'),
      (1, 'Friday', '8:00:00', '17:00:00'),
      (2, 'Monday', '8:00:00', '20:00:00'),
      (2, 'Tuesday', '8:00:00', '20:00:00'),
      (2, 'Wednesday', '8:00:00', '20:00:00'),
      (2, 'Thursday', '8:00:00', '20:00:00'),
      (2, 'Friday', '8:00:00', '17:00:00'),
      (3, 'Monday', '8:00:00', '20:00:00'),
      (3, 'Tuesday', '8:00:00', '20:00:00'),
      (3, 'Wednesday', '8:00:00', '20:00:00'),
      (3, 'Thursday', '8:00:00', '20:00:00'),
      (3, 'Friday', '8:00:00', '17:00:00'),
      (4, 'Monday', '8:00:00', '20:00:00'),
      (4, 'Tuesday', '8:00:00', '20:00:00'),
      (4, 'Wednesday', '8:00:00', '20:00:00'),
      (4, 'Thursday', '8:00:00', '20:00:00'),
      (4, 'Friday', '8:00:00', '17:00:00'),
      (5, 'Monday', '8:00:00', '20:00:00'),
      (5, 'Tuesday', '8:00:00', '20:00:00'),
      (5, 'Wednesday', '8:00:00', '20:00:00'),
      (5, 'Thursday', '8:00:00', '20:00:00'),
      (5, 'Friday', '9:00:00', '19:00:00'),
      (6, 'Monday', '8:00:00', '20:00:00'),
      (6, 'Tuesday', '8:00:00', '20:00:00'),
      (6, 'Wednesday', '8:00:00', '20:00:00'),
      (6, 'Thursday', '8:00:00', '20:00:00'),
      (6, 'Friday', '8:00:00', '17:00:00'),
      (7, 'Monday', '8:00:00', '20:00:00'),
      (7, 'Tuesday', '8:00:00', '20:00:00'),
      (7, 'Wednesday', '8:00:00', '20:00:00'),
      (7, 'Thursday', '8:00:00', '20:00:00'),
      (7, 'Friday', '8:00:00', '17:00:00'),
      (8, 'Monday', '8:00:00', '20:00:00'),
      (8, 'Tuesday', '8:00:00', '20:00:00'),
      (8, 'Wednesday', '8:00:00', '20:00:00'),
      (8, 'Thursday', '8:00:00', '20:00:00'),
      (8, 'Friday', '8:00:00', '17:00:00'),
      (9, 'Monday', '8:00:00', '20:00:00'),
      (9, 'Tuesday', '8:00:00', '20:00:00'),
      (9, 'Wednesday', '8:00:00', '20:00:00'),
      (9, 'Thursday', '8:00:00', '20:00:00'),
      (9, 'Friday', '8:00:00', '12:00:00');
SELECT * FROM RoomReservation;
SELECT * FROM Student;
SELECT * FROM Laptop;
SELECT * FROM ROOM;
SELECT * FROM LaptopReservation;
SELECT * FROM RoomAvailability;

GO
