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

dateInput.addEventListener('change', () => {
    buildCalendar(dateInput.value); 
});

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
                let isClosed = (currentSlotMins < roomOpenMins || currentSlotMins >= roomCloseMins);
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
                    html += `<td class="unavailable" data-room="${roomObj.RoomNumber}" data-time="${timeStr}" data-index="${i}"></td>`;
                } else {
                    html += `<td class="available time-block" data-room="${roomObj.RoomNumber}" data-time="${timeStr}" data-index="${i}"></td>`;
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
                finalEndTime = times[endIndex];
                document.getElementById('selection-output').innerText = 
                    `Ready to book: ${room} from ${finalStartTime} to ${finalEndTime}.`;
                if (firstClickBlock != null) {
                    confirmRes.disabled = false;
                    confirmRes.style.opacity = "1";
                    confirmRes.style.cursor = "pointer";
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
const displayStartTime = document.getElementById('displayStartTime');
const displayEndTime = document.getElementById('displayEndTime');
const displayDate = document.getElementById('displayDate');

//opens confriming pop up
function openModal() {
    modal.style.display = 'flex';
    const savedEmail = sessionStorage.getItem('userEmail');
    displayEmail.textContent = savedEmail ? savedEmail : "Guest User";
    displayStartTime.textContent = finalStartTime;
    displayEndTime.textContent = finalEndTime;
}

//closes confirming pop up
function closeModal() {
    modal.style.display = 'none';
    document.getElementById('roomPassword').value = '';
}
//for submitting the reservations
function submitReservation() {
    const password = document.getElementById('roomPassword').value;
    if (password === "") {
        alert("Please enter a password.");
        return;
    }
    passwordStep.style.display = 'none';
    successStep.style.display = 'block';
    //logs out user
    setTimeout(() => {
        alert("Logging out...");
        window.location.href = "home.html";
    }, 3000);
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