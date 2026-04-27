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
function parseReservationString(resString) {
    const parts = resString.split(' To ');
    const startTimeStr = parts[0].split(' ')[1]; 
    const endTimeStr = parts[1].split(' ')[1];
    const startMins = (parseInt(startTimeStr.split(':')[0]) * 60) + parseInt(startTimeStr.split(':')[1]);
    const endMins = (parseInt(endTimeStr.split(':')[0]) * 60) + parseInt(endTimeStr.split(':')[1]);
    return { start: startMins, end: endMins };
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

                let isReserved = false;
                if (laptopObj.bookedSlots) {
                    isReserved = laptopObj.bookedSlots.some(slot => {
                        let resBounds = parseReservationString(slot.ReserveDateTime);
                        return currentSlotMins >= resBounds.start && currentSlotMins < resBounds.end;
                    });
                }
                if (isReserved) {
                    html += `<td class="unavailable" data-laptop="${laptopObj.LaptopId}" data-time="${timeStr}" data-index="${i}"></td>`;
                } else {
                    html += `<td class="available time-block" data-laptop="${laptopObj.LaptopId}" data-time="${timeStr}" data-index="${i}"></td>`;
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

//lsitens for user to click different times for their resevation
function attachClickListeners() {
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

                const finalStartTime = times[startIndex];
                const finalEndTime = times[endIndex];
                document.getElementById('selection-output').innerText = 
                    `Ready to book: Laptop ${laptop} from ${finalStartTime} to ${finalEndTime}.`;
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