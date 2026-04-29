const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = (query) => new Promise((resolve) => rl.question(query, resolve));

async function runTester() {
  console.log('--- KSU Database Tester ---');
  console.log('1: Create Student\n2: Create a Room Reservation\n 3: Create a Laptop Reservation\n 4: Add Laptop\n5: Update Student\n6: Update Laptop\n7: Delete Room Reservation\n8: Delete a Laptop Reservation');
  const choice = await question('Select an option: ');

  try {
    if (choice === '1') {
      
      const firstName = await question('First Name: ');
      const lastName = await question('Last Name: ');
      const email = await question('Email: ');
      const majorId = await question('Major ID: ');
      const password = await question('Password: ');
      const isAdmin = await question('Is admin(1 of yes, 0 for no): ')

      const data = { firstName, lastName, email, majorId: parseInt(majorId), password,  isAdmin: parseInt(isAdmin)};
      await sendRequest('http://localhost:3000/api/add-students', data);

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
    else if(choice === '4'){
      const laptopMake = await question('Laptop make: ');
      const laptopModel = await question('Laptop model: ');
      const dateActivated = await question('Date activated (YYYY-MM-DD HH:MM): ');
      const dateDeactivated = await question('Date deactivated (YYYY-MM-DD HH:MM): ')
      
      const data = {laptopMake, laptopModel, dateActivated, dateDeactivated};
      await sendRequest('http://localhost:3000/api/add-laptop', data);
    }
    else if(choice === '5'){
      const studentId = await question('Student Id: ');
      const firstName = await question('First Name: ');
      const lastName = await question('Last Name: ');
      const email = await question('Email: ');
      const majorId = await question('Major ID: ');
      const password = await question('Password: ');

      const data = {studentId: parseInt(studentId), firstName, lastName, email, majorId: parseInt(majorId), password };
      await sendRequest('http://localhost:3000/api/update-student', data);
    }
    else if(choice === '6')
    {
      const laptopId = await question('Laptop Id: ');
      const laptopMake = await question('Laptop make: ');
      const laptopModel = await question('Laptop model: ');
      const dateActivated = await question('Date activated (YYYY-MM-DD HH:MM): ');
      const dateDeactivated = await question('Date deactivated (YYYY-MM-DD HH:MM): ');

      const data = {laptopId, laptopMake, laptopModel, dateActivated, dateDeactivated};
      await sendRequest('http://localhost:3000/api/update-laptop', data);
    }
    else if(choice === '7'){
      const roomId = await question('Room Id: ');
      const data = {roomId};
      await sendRequest('http://localhost:3000/api/delete-room-reservation', data);
    }
    else if(choice === '8'){
      const laptopId = await question('Laptop Id: ');
      const data = {laptopId};
      await sendRequest('http://localhost:3000/api/delete-laptop-reservation', data);
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