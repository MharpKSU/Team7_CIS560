--Room popularity ranking: This shows the most popular rooms for 2025. This groups the checkout history by room, 
--calculates the total number of bookings, hours the room was checked out for, and the average duration 
--of checkout times, then ranks the rooms by most to least used.

DECLARE @StartDate DATETIME = '2025-01-01';
DECLARE @EndDate DATETIME = '2025-12-31';

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