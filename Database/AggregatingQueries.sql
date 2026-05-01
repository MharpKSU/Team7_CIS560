--Room popularity ranking: This shows the most popular rooms for 2025. This groups the checkout history by room, 
--calculates the total number of bookings, hours the room was checked out for, and the average duration 
--of checkout times, then ranks the rooms by most to least used.
USE KSUReservations;
GO

CREATE OR ALTER PROCEDURE GetDataStats
AS
BEGIN

DECLARE @StartDate DATETIME = '2022-01-01';
DECLARE @EndDate DATETIME = '2026-4-1';

WITH FilteredReservations AS (
	SELECT R.RoomNumber, RR.StartTime, RR.EndTime
	FROM RoomReservation RR
		INNER JOIN Room R ON RR.RoomId = R.RoomId
	WHERE RR.StartTime >= @StartDate AND RR.EndTime <= @EndDate
)


SELECT RoomNumber, COUNT(*) AS TotalReservations,
	SUM(DATEDIFF(HOUR, StartTime, EndTime)) AS TotalHoursReserved,
	AVG(DATEDIFF(MINUTE, StartTime, EndTime) / 60.0) AS AverageReservationDuration,
	RANK() OVER (
		ORDER BY COUNT(*) DESC,
		SUM(DATEDIFF(HOUR, StartTime, EndTime)) DESC
	) AS PopularityRank
FROM FilteredReservations
GROUP BY RoomNumber
ORDER BY PopularityRank; 

--Peak checkout times: This analyzes the peak checkout times for laptops and study rooms grouped by hour 
--of day and day of week. This can help IT and staff know when they have the heaviest load and for example, 
--when the help/checkout desk needs more staff. 
SET @StartDate = '2025-01-01';
SET @EndDate = '2025-12-31';

WITH CombinedReservations AS (
    --room
    SELECT StartTime AS ReservationStart, EndTime AS ReservationEnd
    FROM RoomReservation
    WHERE StartTime BETWEEN @StartDate AND @EndDate

    UNION
    --laptop
    SELECT PickupTime AS ReservationStart, DropoffTime AS ReservationEnd
    FROM LaptopReservation
    WHERE PickupTime BETWEEN @StartDate AND @EndDate
),
TimeData AS (
    SELECT DATENAME(WEEKDAY, ReservationStart) AS DayOfWeek,
        DATEPART(HOUR, ReservationStart) AS HourOfDay,
        COUNT(*) AS TotalReservations,
        SUM(DATEDIFF(MINUTE, ReservationStart, ReservationEnd)) AS TotalDuration
    FROM CombinedReservations
    GROUP BY DATENAME(WEEKDAY, ReservationStart), DATEPART(HOUR, ReservationStart)
),
RankedData AS (
    SELECT *,
        ROW_NUMBER() OVER (
            PARTITION BY DayOfWeek
            ORDER BY TotalReservations DESC, TotalDuration DESC
        ) AS PeakTimeRank
    FROM TimeData
)
SELECT DayOfWeek,
CONCAT(
        CASE 
            WHEN HourOfDay = 0 THEN 12
            WHEN HourOfDay > 12 THEN HourOfDay - 12
            ELSE HourOfDay
        END,
        CASE 
            WHEN HourOfDay < 12 THEN ' AM'
            ELSE ' PM'
        END
    ) AS HourOfDay, 
TotalReservations, TotalDuration, PeakTimeRank
FROM RankedData
WHERE PeakTimeRank <=3
ORDER BY PeakTimeRank, DayOfWeek;


--Laptop maintenance report: This will show a maintenance report/history for the laptops. 
--The query will group the laptops by make and model, calculate the total times it's been checked out, 
--the duration of the laptop reservations, and the time since the laptop was activated. This can help 
--admins decide if a laptop needs to be retired or may need replacements/repairs.  
DECLARE @LaptopMake NVARCHAR(50) = NULL;
DECLARE @MinCheckouts INT = 0;
DECLARE @MinDateActivated DATETIME = '2010-01-01';

SELECT L.LaptopMake, L.LaptopModel, L.LaptopId,
	COUNT(LR.LaptopReservationId) AS TotalTimesCheckedOut,
	SUM(
		DATEDIFF(MINUTE, LR.PickupTime, LR.DropoffTime)
	) AS TotalDurationOfCheckOuts,
	DATEDIFF(DAY, L.DateActivated, GETDATE()) AS TotalTimeSinceActivation
FROM Laptop L
	LEFT JOIN LaptopReservation LR ON L.LaptopId = LR.LaptopId
WHERE L.DateActivated >= @MinDateActivated
	AND (@LaptopMake IS NULL OR L.LaptopMake = @LaptopMake)
GROUP BY L.LaptopMake, L.LaptopModel, L.LaptopId, L.DateActivated
HAVING COUNT(LR.LaptopReservationId) >= @MinCheckouts
ORDER BY TotalTimesCheckedOut DESC, TotalDurationOfCheckOuts DESC; 

--Frequent user tracker: This query keeps track of the students that checkout rooms and laptops the
--most within a certain month & year. This groups the data by student, major, total number of room 
--and laptop reservations, and total time of reservations then ranking the students based on the total time.
DECLARE @TargetYear INT = 2026;
DECLARE @TargetMonth INT = 4;
DECLARE @MinReservationTime INT = 0; -- mins

WITH RoomTotals AS (
    SELECT
        StudentId, COUNT(*) AS TotalRoomsReserved, SUM(DATEDIFF(MINUTE, StartTime, EndTime)) AS RoomMinutes
    FROM RoomReservation
    WHERE YEAR(StartTime) = @TargetYear AND MONTH(StartTime) = @TargetMonth
    GROUP BY StudentId
),
LaptopTotals AS (
    SELECT StudentId, COUNT(*) AS TotalLaptopsReserved, SUM(DATEDIFF(MINUTE, PickupTime, DropoffTime)) AS LaptopMinutes
    FROM LaptopReservation
    WHERE YEAR(PickupTime) = @TargetYear AND MONTH(PickupTime) = @TargetMonth
    GROUP BY StudentId
)
SELECT @TargetYear AS [Year], @TargetMonth AS [Month], s.StudentId,
    s.FirstName + ' ' + s.LastName AS StudentName,
    m.Name AS Major, 
    ISNULL(r.TotalRoomsReserved, 0) AS TotalRoomsReserved,
    ISNULL(l.TotalLaptopsReserved, 0) AS TotalLaptopsReserved,
    ISNULL(r.RoomMinutes, 0) + ISNULL(l.LaptopMinutes, 0) AS TotalReservationTime,
    RANK() OVER (ORDER BY ISNULL(r.RoomMinutes, 0) + ISNULL(l.LaptopMinutes, 0) DESC) AS StudentRank
FROM Student s
    LEFT JOIN Major m ON s.MajorId = m.MajorId
    LEFT JOIN RoomTotals r ON s.StudentId = r.StudentId
    LEFT JOIN LaptopTotals l ON s.StudentId = l.StudentId
WHERE ISNULL(r.RoomMinutes, 0) + ISNULL(l.LaptopMinutes, 0) >= @MinReservationTime
ORDER BY StudentRank;

END
GO

EXEC GetDataStats;