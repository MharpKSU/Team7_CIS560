//selected res for room
let selectedReservation = null;
//selected res for laptop
let selectedReservation2 = null;
document.getElementById('editRes').addEventListener('click', async function(){
    try{
        setTimeout(() => {window.location.href = `/roomPage`;  }, 1000);
    }
    catch(e){
        console.log(e);
    }

});

document.getElementById('cancelBtn').addEventListener('click', async function(){
    if (!selectedReservation) return;
    const isSure = confirm("Are you sure you want to cancel this room reservation?");
    if (!isSure) return;
    try{
        console.log("got into try");
        const response = await fetch('/api/delete-room-reservation', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                roomId: selectedReservation.roomId,
                roomResId: selectedReservation.resId
            })
        });
        console.log("about to wait reponse");
        const data = await response.json();
        if (data.success) {
            alert("Reservation cancelled successfully!");
            this.disabled = true;
            selectedReservation = null;
            loadRooms();
        } else {
            alert("failed: " + errorMsg);
        }
    }
    catch(e){
        console.log(e);
    }

});

document.getElementById('cancelLaptopBtn').addEventListener('click', async function(){
    if (!selectedReservation2) return;
    const isSure = confirm("Are you sure you want to cancel this laptop reservation?");
    if (!isSure) return;
    try{
        console.log("got into try");
        const response = await fetch('/api/delete-laptop-reservation', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                laptopId: selectedReservation2.laptopId,
                LaptopReservationId: selectedReservation2.resId
            })
        });
        console.log("about to wait reponse");
        const data = await response.json();
        if (data.success) {
            alert("Reservation cancelled successfully!");
            this.disabled = true;
            selectedReservation2 = null;
            loadLaptops();
        } else {
            alert("failed: " + errorMsg);
        }
    }
    catch(e){
        console.log(e);
    }

});


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
        tr.dataset.resId = res.RoomReservationId
        tr.innerHTML = `
            <td>${res.StartTime}</td>
            <td>${res.EndTime}</td>
            <td>${res.RoomNumber}</td>
            <td>${res.RoomPassword}</td>
        `;
        tr.addEventListener('click', function() {
            const allRows = tbody.querySelectorAll('tr');
            allRows.forEach(row => row.classList.remove('selected-row'));
            this.classList.add('selected-row');
            cancelBtn.disabled = false;
            selectedReservation = {
                roomId: this.dataset.roomId,
                startTime: this.dataset.startTime,
                resId: this.dataset.resId
            };
            console.log("Ready to cancel:", selectedReservation);
        });
        tbody.appendChild(tr);
    });
}

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
        tr.dataset.laptopId = res.LaptopId;
        tr.dataset.pickupTime = res.PickupTime;
        tr.dataset.resId = res.LaptopReservationId
        tr.innerHTML = `
            <td>${res.PickupTime}</td>
            <td>${res.DropoffTime}</td>
            <td> ${res.LaptopId} (${res.LaptopMake})</td>
        `;
        tr.addEventListener('click', function() {
            const allRows = tbody.querySelectorAll('tr');
            allRows.forEach(row => row.classList.remove('selected-row'));
            this.classList.add('selected-row');
            cancelBtn.disabled = false;
            selectedReservation2 = {
                laptopId: this.dataset.laptopId,
                resId: this.dataset.resId
            };
            console.log("Ready to cancel:", selectedReservation2);
        });
        tbody.appendChild(tr);
    });
}

async function logOut() {
    try {
        const response = await fetch('/api/logout', { method: 'POST' });
        const data = await response.json();
        
        if (data.success) {
            alert("Logging out...");
            sessionStorage.clear(); 
            setTimeout(() => {
            window.location.href = "home.html"; 
            }, 1000);
        }
    } catch(e) {
        console.error("Error logging out:", e);
    }
}
loadRooms();
loadLaptops();