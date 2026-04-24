DROP TABLE IF EXISTS RoomReservation; 
DROP TABLE IF EXISTS LaptopReservation; 
DROP TABLE IF EXISTS RoomReservation; 
DROP TABLE IF EXISTS RoomAvailability; 

DROP TABLE IF EXISTS Student;  
GO

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
GO 

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
   -- ReserveDateTime NVARCHAR(255) NOT NULL, --I think it makes more sense to do it lik this instead of DateTime cause we can do '2015-2-2 10:20:20 To 2015-2-2 12:20:20'
    StartTime DATETIME NOT NULL,
    EndTime DATETIME NOT NULL,
    RoomPassword NVARCHAR(30) NOT NULL,
    RoomId INT NOT NULL,
    StudentId INT NOT NULL,
    ReservationDuration NVARCHAR(255),
    UNIQUE(StartTime, RoomId),
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
      --AI
      ('Pa', 'Trice', 'pa@ksu.edu', 3, 'HELP'),('Ethan', 'Ramirez', 'ethanr@ksu.edu', 1, 'ETHAN99!'),
      ('Sophia', 'Chen', 'schen@ksu.edu', 3, 'SOPHIAPASS'),
      ('Liam', 'Oconnor', 'liamo@ksu.edu', 2, 'IRISH123'),
      ('Olivia', 'Patel', 'olivap@ksu.edu', 9, 'BIOMED01'),
      ('Noah', 'Brooks', 'nbrooks@ksu.edu', 4, 'MECH44'),
      ('Ava', 'Jenkins', 'ajenkins@ksu.edu', 5, 'CHEM_LIFE'),
      ('Mason', 'Gupta', 'mgupta@ksu.edu', 1, 'CODING7'),
      ('Isabella', 'Rossi', 'irossi@ksu.edu', 7, 'CIVIL88'),
      ('William', 'Zhao', 'wzhao@ksu.edu', 3, 'COMP_ENG'),
      ('Mia', 'Sullivan', 'msullivan@ksu.edu', 8, 'CONSTRUCT'),
      ('James', 'Fisher', 'jfisher@ksu.edu', 6, 'INDUS22'),
      ('Charlotte', 'Kim', 'ckim@ksu.edu', 1, 'KIM1234'),
      ('Benjamin', 'Hayes', 'bhayes@ksu.edu', 4, 'WILD_CAT'),
      ('Amelia', 'Wagner', 'awagner@ksu.edu', 5, 'CHEM_E'),
      ('Lucas', 'Martinez', 'lmartinez@ksu.edu', 2, 'POWER_UP'),
      ('Harper', 'Lee', 'hlee@ksu.edu', 7, 'DRAFT_ING'),
      ('Alexander', 'Dixon', 'adixon@ksu.edu', 9, 'NUCLEAR_S'),
      ('Evelyn', 'Grant', 'egrant@ksu.edu', 8, 'BUILDIT'),
      ('Daniel', 'Moore', 'dmoore@ksu.edu', 1, 'SQL_PRO'),
      ('Abigail', 'Stone', 'astone@ksu.edu', 3, 'HARDWARE'),
      ('Henry', 'Price', 'hprice@ksu.edu', 4, 'GEARS9'),
      ('Emily', 'Foster', 'efoster@ksu.edu', 5, 'BOTTLE7'),
      ('Jackson', 'Reed', 'jreed@ksu.edu', 6, 'FACTORY1'),
      ('Elizabeth', 'Kelly', 'ekelly@ksu.edu', 2, 'CIRCUIT'),
      ('Sebastian', 'Webb', 'swebb@ksu.edu', 7, 'STEEL_3'),
      ('Sofia', 'Reyes', 'sreyes@ksu.edu', 9, 'BME_FUTURE'),
      ('Matthew', 'Black', 'mblack@ksu.edu', 1, 'BITS_BYTES'),
      ('Luna', 'Woods', 'lwoods@ksu.edu', 3, 'LOGIC_L'),
      ('Jacob', 'Cole', 'jcole@ksu.edu', 4, 'TORQUE'),
      ('Chloe', 'Vance', 'cvance@ksu.edu', 8, 'SITE_VISIT');
      --End AI
INSERT INTO RoomReservation (RoomPassword, StartTime, EndTime, RoomId, StudentId, ReservationDuration)
VALUES ('Patrice', '2026-04-24 10:00:00', '2026-04-24 12:00:00', 1, 1, '2 Hours'),
('TestPass', '2026-04-22 13:00:00', '2026-04-22 15:00:00', 1, 2, '2 Hours');
INSERT INTO LaptopReservation(ReserveDateTime, StudentId, DropoffTime, PickupTime, LaptopId)
VALUES ('BLEH BLEH', 4, '2026-4-24 10:20:00:00', '2026-4-24 12:20:00:00', 1)

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
