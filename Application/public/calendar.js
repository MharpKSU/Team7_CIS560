//random data will use table later
const rooms = ["Hale 309A", "Hale 309B", "Hale 309C"];
const times = ["3:00 PM", "3:30 PM", "4:00 PM", "4:30 PM", "5:00 PM", "5:30 PM", "6:00 PM", "6:30 PM", "6:00 PM", "6:00 PM", "6:00 PM", "6:00 PM", "6:00 PM", "6:00 PM", "6:00 PM", "6:00 PM"];
const bookedSlots = [
    { room: "Hale 309A", time: "4:00 PM" },
    { room: "Hale 309A", time: "4:30 PM" }
];

//builds the caldender seen on checkoutPage for reservations
function buildCalendar() {
    const container = document.getElementById('calendar-container');
    let html = '<table>';

    html += '<tr><th>Space</th>';
    for (let time of times) {
        html += `<th>${time}</th>`;
    }
    html += '</tr>';

    for (let room of rooms) {
        html += `<tr><td class="room-name">${room}</td>`;
        
        for (let i = 0; i < times.length; i++) {
            let time = times[i];
            const isBooked = bookedSlots.some(slot => slot.room === room && slot.time === time);
            
            if (isBooked) {
                html += `<td class="unavailable" data-room="${room}" data-time="${time}" data-index="${i}"></td>`;
            } else {
                html += `<td class="available time-block" data-room="${room}" data-time="${time}" data-index="${i}"></td>`;
            }
        }
        html += '</tr>';
    }
    html += '</table>';
    container.innerHTML = html;

    attachClickListeners();
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

                if (firstClickBlock.dataset.room !== secondClickBlock.dataset.room) {
                    alert("Please select an end time in the same room!");
                    return;
                }

                const room = firstClickBlock.dataset.room;
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

                const finalStartTime = times[startIndex];
                const finalEndTime = times[endIndex];
                document.getElementById('selection-output').innerText = 
                    `Ready to book: ${room} from ${finalStartTime} to ${finalEndTime}.`;
                firstClickBlock = null; 
            }
        });
    });
}

buildCalendar();