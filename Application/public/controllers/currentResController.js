let selectedReservation = null;
async function loadRooms() {
    const studentId = sessionStorage.getItem('studentId');
    if (!studentId) {
        console.error("No student ID found. Please log in.");
        return;
    }
    try {
        const response = await fetch(`/api/loadRooms?studentId=${studentId}`);
        const data = await response.json();

        if (data.success) {
            let reservations = data.reservations;
            //this sorts them in date order btw
            reservations.sort((a, b) => new Date(a.StartTime) - new Date(b.StartTime));
            buildRoomTable(reservations);
        }
    } catch (e) {
        console.error("Failed to load reservations:", e);
    }
}

function buildRoomTable(reservations) {
    const tbody = document.getElementById('reservationsBody');
    const cancelBtn = document.getElementById('cancelBtn');
    tbody.innerHTML = ''; 
    if (reservations.length === 0) {
        tbody.innerHTML = "<tr><td colspan='4'>You have no upcoming reservations.</td></tr>";
        return;
    }
    reservations.forEach(res => {
        const tr = document.createElement('tr');
        tr.dataset.roomId = res.RoomId;
        tr.dataset.startTime = res.StartTime;
        tr.innerHTML = `
            <td>${res.StartTime}</td>
            <td>${res.EndTime}</td>
            <td>${res.RoomId}</td>
            <td>${res.RoomPassword}</td>
        `;
        tr.addEventListener('click', function() {
            const allRows = tbody.querySelectorAll('tr');
            allRows.forEach(row => row.classList.remove('selected-row'));
            this.classList.add('selected-row');
            cancelBtn.disabled = false;
            selectedReservation = {
                roomId: this.dataset.roomId,
                startTime: this.dataset.startTime
            };
            console.log("Ready to cancel:", selectedReservation);
        });
        tbody.appendChild(tr);
    });
}


let selectedReservation2 = null;
async function loadLaptops() {
    const studentId = sessionStorage.getItem('studentId');
    if (!studentId) {
        console.error("No student ID found. Please log in.");
        return;
    }
    try {
        const response = await fetch(`/api/loadLaptops?studentId=${studentId}`);
        const data = await response.json();

        if (data.success) {
            let reservations = data.reservations;
            //this sorts them in date order btw
            reservations.sort((a, b) => new Date(a.PickupTime) - new Date(b.PickupTime));
            buildLaptopTable(reservations);
        }
    } catch (e) {
        console.error("Failed to load reservations:", e);
    }
}

function buildLaptopTable(reservations) {
    const tbody = document.getElementById('laptopBody');
    const cancelBtn = document.getElementById('cancelLaptopBtn');
    tbody.innerHTML = ''; 
    if (reservations.length === 0) {
        tbody.innerHTML = "<tr><td colspan='4'>You have no upcoming reservations.</td></tr>";
        return;
    }
    reservations.forEach(res => {
        const tr = document.createElement('tr');
        tr.dataset.roomId = res.RoomId;
        tr.dataset.pickupTime = res.PickupTime;
        tr.innerHTML = `
            <td>${res.PickupTime}</td>
            <td>${res.DropoffTime}</td>
            <td>${res.LaptopId}</td>
        `;
        tr.addEventListener('click', function() {
            const allRows = tbody.querySelectorAll('tr');
            allRows.forEach(row => row.classList.remove('selected-row'));
            this.classList.add('selected-row');
            cancelBtn.disabled = false;
            selectedReservation2 = {
                LaptopId: this.dataset.LaptopId,
                PickupTime: this.dataset.PickupTime
            };
            console.log("Ready to cancel:", selectedReservation2);
        });
        tbody.appendChild(tr);
    });
}
loadRooms();
loadLaptops();