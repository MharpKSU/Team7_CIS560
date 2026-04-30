let times = [];
let bookedSlots = [];
const dateInput = document.getElementById('reservationDate');
const typeDropdown = document.getElementById('reservationType');

const today = new Date();
const todayString = today.toISOString().split('T')[0];

const maxDate = new Date();
maxDate.setDate(today.getDate() + 14);
const maxDateString = maxDate.toISOString().split('T')[0];

dateInput.min = todayString;
dateInput.max = maxDateString;
dateInput.value = todayString;

document.getElementById('editRes').addEventListener('click', async function(){
    try{
        setTimeout(() => {window.location.href = `/currentResPage`;  }, 1000);
    }
    catch(e){
        console.log(e);
    }

});

dateInput.addEventListener('change', () => {
    buildCalendar(dateInput.value); 
});

function formatSQLDatetime(dateValue, timeValue) {
    let [time, modifier] = timeValue.split(' ');
    let [hours, minutes] = time.split(':');
    let h = parseInt(hours, 10);
    if (modifier === 'PM' && h < 12) h += 12;
    if (modifier === 'AM' && h === 12) h = 0;
    const HH = String(h).padStart(2, '0');
    const MM = String(minutes).padStart(2, '0');
    return `${dateValue} ${HH}:${MM}:00`;
}

function convertHeaderToMins(timeStr) {
    const [time, modifier] = timeStr.split(' ');
    let [hours, minutes] = time.split(':');
    hours = parseInt(hours);
    minutes = parseInt(minutes);
    if (hours === 12 && modifier === 'AM') hours = 0;
    if (hours < 12 && modifier === 'PM') hours += 12;
    return (hours * 60) + minutes;
}
function convertMinsToHeader(mins) {
    let hours = Math.floor(mins / 60);
    let minutes = mins % 60;
    let modifier = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    if (hours === 0) hours = 12;
    let minStr = minutes < 10 ? '0' + minutes : minutes;
    return `${hours}:${minStr} ${modifier}`;
}

//builds the caldender seen on checkoutPage for reservations
async function buildCalendar(selectedDate) {
    const container = document.getElementById('calendar-container');
    if (!selectedDate) return;
    console.log("build cal before try");
    try{
        const database = await fetch(`/api/roomCal?date=${selectedDate}`);
        const data = await database.json();
        if (!data.rooms || data.rooms.length === 0) {
            container.innerHTML = "<h3>No rooms available on this date.</h3>";
            return; 
        }
        let earliestMins = 24 * 60;
        let latestMins = 0;         
        for (let roomObj of data.rooms) {
            let openDate = new Date(roomObj.OpenTime);
            let closeDate = new Date(roomObj.ClosedTime);
            let openMins = (openDate.getUTCHours() * 60) + openDate.getUTCMinutes();
            let closeMins = (closeDate.getUTCHours() * 60) + closeDate.getUTCMinutes();

            if (openMins < earliestMins) earliestMins = openMins;
            if (closeMins > latestMins) latestMins = closeMins;
        }
        times = [];
        for (let m = earliestMins; m < latestMins; m += 30) {
            times.push(convertMinsToHeader(m));
        }
        let html = '<table>';
        html += '<tr><th>Space</th>';
        for (let time of times) {
            html += `<th>${time}</th>`;
        }
        html += '</tr>';
        for (let roomObj of data.rooms) {
            html += `<tr><td class="room-name">${roomObj.RoomNumber}</td>`;
            let openDate = new Date(roomObj.OpenTime);
            let closeDate = new Date(roomObj.ClosedTime);
            let roomOpenMins = (openDate.getUTCHours() * 60) + openDate.getUTCMinutes();
            let roomCloseMins = (closeDate.getUTCHours() * 60) + closeDate.getUTCMinutes();
            for (let i = 0; i < times.length; i++) {
                let timeStr = times[i];
                let currentSlotMins = convertHeaderToMins(timeStr);
                const now = new Date();
                const localMonth = String(now.getMonth() + 1).padStart(2, '0');
                const localDay = String(now.getDate()).padStart(2, '0');
                const today = `${now.getFullYear()}-${localMonth}-${localDay}`;
                console.log(today);
                console.log(selectedDate);
                let currentTime = (now.getHours() * 60) + now.getMinutes();
                console.log(currentTime);
                let isClosed;
                if(selectedDate == today){
                    isClosed = (currentSlotMins < roomOpenMins || currentSlotMins >= roomCloseMins || currentSlotMins <= currentTime);
                }
                else{
                    console.log("MEOWOWO");
                    isClosed = (currentSlotMins < roomOpenMins || currentSlotMins >= roomCloseMins);
                }
                let isReserved = false;
                if (!isClosed && roomObj.bookedSlots) {
                    isReserved = roomObj.bookedSlots.some(slot => {
                        let start = new Date(slot.StartTime);
                        let end = new Date(slot.EndTime);
                        let startMins = (start.getUTCHours() * 60) + start.getUTCMinutes();
                        let endMins = (end.getUTCHours() * 60) + end.getUTCMinutes();
                        return currentSlotMins >= startMins && currentSlotMins < endMins;
                    });
                }
                if (isClosed || isReserved) {
                    html += `<td id="${roomObj.RoomId}" class="unavailable" data-room="${roomObj.RoomNumber}" data-time="${timeStr}" data-index="${i}"></td>`;
                } else {
                    html += `<td id="${roomObj.RoomId}" class="available time-block" data-room="${roomObj.RoomNumber}" data-time="${timeStr}" data-index="${i}"></td>`;
                }
            }
            html += '</tr>';
        }
        html += '</table>';
        container.innerHTML = html;
        attachClickListeners();
    }
    catch(e){
        console.log("build cal failed try");
        console.log(e);
    }
    
}
const confirmRes = document.getElementById('confirmRes');
let roomId;
let finalStartTime;
let finalEndTime;
//lsitens for user to click different times for their resevation
function attachClickListeners() {
    confirmRes.disabled = true;
    confirmRes.style.opacity = "0.5";
    confirmRes.style.cursor = "not-allowed";
    let firstClickBlock = null;
    
    const blocks = document.querySelectorAll('.time-block');

    blocks.forEach(block => {
        block.addEventListener('click', function() {
            if (firstClickBlock === null) {
                blocks.forEach(b => b.classList.remove('selected'));
                confirmRes.disabled = true;
                confirmRes.style.opacity = "0.5";
                confirmRes.style.cursor = "not-allowed";
                
                firstClickBlock = this; 
                this.classList.add('selected'); 
                
                document.getElementById('selection-output').innerText = 
                    `Start time selected: ${this.dataset.time}. Now click your end time!`;
            } 
            else {
                const secondClickBlock = this;

                if (firstClickBlock.dataset.room!== secondClickBlock.dataset.room) {
                    alert("Please select an end time in the same room!");
                    return;
                }

                const room = firstClickBlock.dataset.room;
                console.log(room);
                let startIndex = parseInt(firstClickBlock.dataset.index);
                let endIndex = parseInt(secondClickBlock.dataset.index);

                if (startIndex > endIndex) {
                    let temp = startIndex;
                    startIndex = endIndex;
                    endIndex = temp;
                }

                blocks.forEach(b => {
                    if (b.dataset.room === room) {
                        let currentIndex = parseInt(b.dataset.index);
                        if (currentIndex >= startIndex && currentIndex <= endIndex) {
                            b.classList.add('selected'); 
                        }
                    }
                });
                finalStartTime = times[startIndex];
                let actualEndMins = convertHeaderToMins(times[endIndex]) + 30;
                finalEndTime = convertMinsToHeader(actualEndMins);
                document.getElementById('selection-output').innerText = 
                    `Ready to book: ${room} from ${finalStartTime} to ${finalEndTime}.`;
                if (firstClickBlock != null) {
                    confirmRes.disabled = false;
                    confirmRes.style.opacity = "1";
                    confirmRes.style.cursor = "pointer";
                    roomId = firstClickBlock.id;
                }
                firstClickBlock = null; 
            }
        });
    });
}

buildCalendar(todayString);
typeDropdown.addEventListener('change', function() {
    const selectedChoice = this.value; 
    if (selectedChoice === 'Laptops') {
        window.location.href = '/laptopPage'; 
    } 
});


//confrim res section!
const modal = document.getElementById('reservationModal');
const passwordStep = document.getElementById('passwordStep');
const successStep = document.getElementById('successStep');
const passwordInput = document.getElementById('roomPassword');
const submitBtn = document.getElementById('submitBtn');
const displayEmail = document.getElementById('displayEmail');
const displayTime = document.getElementById('displayTime');

//opens confriming pop up
function openModal() {
    modal.style.display = 'flex';
    const savedEmail = sessionStorage.getItem('userEmail');
    displayEmail.textContent = savedEmail ? savedEmail : "Guest User";
    displayTime.textContent = `${dateInput.value} ${finalStartTime} to ${finalEndTime}`;
}

//closes confirming pop up
function closeModal() {
    modal.style.display = 'none';
    document.getElementById('roomPassword').value = '';
}

function testfunc(){
    const startTime = formatSQLDatetime(dateInput.value, finalStartTime);
    const endTime = formatSQLDatetime(dateInput.value, finalEndTime);
    const studentId = sessionStorage.getItem('studentId');
    return {
        startTime: startTime,
        endTime: endTime,
        roomPassword: document.getElementById('roomPassword').value,
        roomId: parseInt(roomId),
        studentId: parseInt(studentId),
        reservationDuration: "1 hour" 
    };
}
//for submitting the reservations
async function submitReservation() {
    const roomPassword = document.getElementById('roomPassword').value;
    if (roomPassword == "") {
        alert("Please enter a password.");
        return;
    }
    passwordStep.style.display = 'none';
    successStep.style.display = 'block';
    const data = testfunc();
    console.log(data);

    try {
        console.log('Sending reservation to database...', data);
        const response = await fetch('http://localhost:3000/api/room-reservations', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            passwordStep.style.display = 'none';
            successStep.style.display = 'block';
            setTimeout(() => {
                window.location.href = "home.html"; 
            }, 3000);
        } else {
            const errorMsg = await response.text();
            alert("Reservation failed: " + errorMsg);
        }
    } catch (err) {
        console.error('Connection Error:', err);
        alert("Could not connect to the server.");
    }
}
//password creation
passwordInput.addEventListener('input', () => {
    passwordInput.value = passwordInput.value.replace(/[^0-9]/g, '');
    if (passwordInput.value.length === 4) {
        submitBtn.disabled = false;
        submitBtn.style.opacity = "1";
        submitBtn.style.cursor = "pointer";
    } else {
        submitBtn.disabled = true;
        submitBtn.style.opacity = "0.5";
        submitBtn.style.cursor = "not-allowed";
    }
});