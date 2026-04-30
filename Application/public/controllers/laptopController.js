let times = [];
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
        const database = await fetch(`/api/laptopCal?date=${selectedDate}`);
        const data = await database.json();
        if (!data.laptops || data.laptops.length === 0) {
            container.innerHTML = "<h3>No laptops available on this date.</h3>";
            return; 
        }
        let earliestMins = 8 * 60;
        let latestMins = 20.5*60;    
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
        for (let laptopObj of data.laptops) {
            let displayName = `Laptop ${laptopObj.LaptopId} (${laptopObj.LaptopMake})`;
            html += `<tr><td class="laptop-name">${displayName}</td>`;
            for (let i = 0; i < times.length; i++) {
                let timeStr = times[i];
                let currentSlotMins = convertHeaderToMins(timeStr);
                const now = new Date();
                const localMonth = String(now.getMonth() + 1).padStart(2, '0');
                const localDay = String(now.getDate()).padStart(2, '0');
                const today = `${now.getFullYear()}-${localMonth}-${localDay}`;
                let currentTime = (now.getHours() * 60) + now.getMinutes();
                let isClosed;
                if(selectedDate == today){
                    isClosed = (currentSlotMins <= currentTime);
                }
                else{
                    console.log("MEOWOWO");
                    isClosed = false;
                }
                let isReserved = false;
                if (laptopObj.bookedSlots) {
                    isReserved = laptopObj.bookedSlots.some(slot => {
                        let pickTime = slot.PickupTime.split(' ')[1]; 
                        let dropTime = slot.DropoffTime.split(' ')[1];
                        let startMins = (parseInt(pickTime.split(':')[0]) * 60) + parseInt(pickTime.split(':')[1]);
                        let endMins = (parseInt(dropTime.split(':')[0]) * 60) + parseInt(dropTime.split(':')[1]);
                        return currentSlotMins >= startMins && currentSlotMins < endMins;
                    });
                }
                if (isClosed || isReserved) {
                    html += `<td class="unavailable" data-laptop="${laptopObj.LaptopId}" data-time="${timeStr}" data-index="${i}"></td>`;
                } else {
                    html += `<td id="${laptopObj.LaptopId}" class="available time-block" data-laptop="${laptopObj.LaptopId}" data-time="${timeStr}" data-index="${i}"></td>`;
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
let laptopId;
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
                
                firstClickBlock = this; 
                this.classList.add('selected'); 
                
                document.getElementById('selection-output').innerText = 
                    `Start time selected: ${this.dataset.time}. Now click your end time!`;
            } 
            else {
                const secondClickBlock = this;

                if (firstClickBlock.dataset.laptop!== secondClickBlock.dataset.laptop) {
                    alert("Please select an end time in the same laptop!");
                    return;
                }

                const laptop = firstClickBlock.dataset.laptop;
                let startIndex = parseInt(firstClickBlock.dataset.index);
                let endIndex = parseInt(secondClickBlock.dataset.index);

                if (startIndex > endIndex) {
                    let temp = startIndex;
                    startIndex = endIndex;
                    endIndex = temp;
                }

                blocks.forEach(b => {
                    if (b.dataset.laptop === laptop) {
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
                    `Ready to book: Laptop ${laptop} from ${finalStartTime} to ${finalEndTime}.`;
                if (firstClickBlock != null) {
                    confirmRes.disabled = false;
                    confirmRes.style.opacity = "1";
                    confirmRes.style.cursor = "pointer";
                    laptopId = firstClickBlock.id;
                }
                firstClickBlock = null; 
            }
        });
    });
}

buildCalendar(todayString);
typeDropdown.addEventListener('change', function() {
    const selectedChoice = this.value; 
    if (selectedChoice === 'Rooms') {
        window.location.href = '/roomPage'; 
    } 
});


//confrim res section!
const modal = document.getElementById('reservationModal');
const successStep = document.getElementById('successStep');
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
    passwordStep.style.display = 'block';
    successStep.style.display = 'none';
    buildCalendar(todayString);
}

function testfunc(){
    const pickupTime = formatSQLDatetime(dateInput.value, finalStartTime);
    const dropoffTime = formatSQLDatetime(dateInput.value, finalEndTime);
    const studentId = sessionStorage.getItem('studentId');
    return {
        studentId: parseInt(studentId),
        dropOffTime: dropoffTime,
        pickUpTime: pickupTime,
        laptopId: parseInt(laptopId)
    };
}
//for submitting the reservations
async function submitReservation() {
    const data = testfunc();
    console.log(data);
    try{
        console.log("in tryy");
        const response = await fetch(`/api/loadLaptops?studentId=${sessionStorage.getItem('studentId')}`);
        const reser = await response.json();
        if (reser.success) {
            console.log("in if");
            for(let res of reser.reservations){
                console.log("in for");
                if(res.PickupTime.split(' ')[0] == dateInput.value){
                    console.log("in MAIN");
                    console.log(data.pickUpTime);
                    console.log(data.dropOffTime);
                    const existingStart = res.PickupTime;
                    const existingEnd = res.DropoffTime;
                    console.log(existingStart);
                    console.log(existingEnd);
                    if(data.pickUpTime < existingEnd && data.dropOffTime > existingStart){
                        alert("you cannot checkout mutiple laptops at the same times");
                        closeModal();
                        return;
                    }
                }
            }
        }
    }
    catch(e){
        console.log(e);
    }
    passwordStep.style.display = 'none';
    successStep.style.display = 'block';

    try {
        console.log('Sending reservation to database...', data);
        const response = await fetch('http://localhost:3000/api/laptop-reservations', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            passwordStep.style.display = 'none';
            successStep.style.display = 'block';
        } else {
            const errorMsg = await response.text();
            alert("Reservation failed: " + errorMsg);
        }
    } catch (err) {
        console.error('Connection Error:', err);
        alert("Could not connect to the server.");
    }
}

async function logOut() {
    try {
        const response = await fetch('/api/logout', { method: 'POST' });
        const data = await response.json();
        
        if (data.success) {
            alert("Logging out...");
            document.getElementById('stay').disabled = true;
            sessionStorage.clear(); 
            setTimeout(() => {
            window.location.href = "home.html"; 
            }, 1000);
        }
    } catch(e) {
        console.error("Error logging out:", e);
    }
}