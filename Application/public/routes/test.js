const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = (query) => new Promise((resolve) => rl.question(query, resolve));

async function runTester() {
  console.log('--- KSU Database Tester ---');
  console.log('1: Create Student\n2: Create a Room Reservation\n 3: Create a Laptop Reservation');
  const choice = await question('Select an option: ');

  try {
    if (choice === '1') {
      // Student Logic
      const firstName = await question('First Name: ');
      const lastName = await question('Last Name: ');
      const email = await question('Email: ');
      const majorId = await question('Major ID: ');
      const password = await question('Password: ');

      const data = { firstName, lastName, email, majorId: parseInt(majorId), password };
      await sendRequest('http://localhost:3000/api/students', data);

    } else if (choice === '2') {
      
      const roomPassword = await question('Room Password: ');
      const startTime = await question('Start Time (YYYY-MM-DD HH:MM): ');
      const endTime = await question('End Time (YYYY-MM-DD HH:MM): ');
      const roomId = await question('Room ID: ');
      const studentId = await question('Student ID: ');
      const reservationDuration = await question('Duration: ');

      const data = { 
        roomPassword, 
        startTime, 
        endTime, 
        roomId: parseInt(roomId), 
        studentId: parseInt(studentId), 
        reservationDuration 
      };
      await sendRequest('http://localhost:3000/api/room-reservations', data);

    }
    else if(choice === '3'){
      const reservationDateTime = await question('DateTime: ');
      const studentId = await question('Student Id: ');
      const pickUpTime = await question('Pick Up Time (YYYY-MM-DD HH:MM): ');
      const dropOffTime = await question('Drop Off Time (YYYY-MM-DD HH:MM): ');
      const laptopId = await question('Laptop Id: ');

      const data = {reservationDateTime, studentId, dropOffTime, pickUpTime, laptopId};
      await sendRequest('http://localhost:3000/api/laptop-reservations', data);
    }
    else 
    {
      console.log('Invalid selection.');
    }
  } catch (err) {
    console.error('Tester Error:', err);
  } finally {
    rl.close();
  }
}

async function sendRequest(url, data) {
  console.log('\nSending data to backend...');
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });

  const result = await response.text();
  console.log(response.ok ? 'Success:' : 'Failed:', result);
}

runTester();