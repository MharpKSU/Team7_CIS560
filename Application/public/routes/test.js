const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = (query) => new Promise((resolve) => rl.question(query, resolve));
5
async function runTester() {
  console.log('--- KSU Student Database Tester ---');

  try {
    const firstName = await question('First Name: ');
    const lastName = await question('Last Name: ');
    const email = await question('Email: ');
    const majorId = await question('Major ID (1-10): ');
    const password = await question('Password: ');

    const studentData = {
      firstName,
      lastName,
      email,
      majorId: parseInt(majorId),
      password
    };

    console.log('\nSending data to backend...');

    const response = await fetch('http://localhost:3000/api/students', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(studentData)
    });

    if (response.ok) {
      const result = await response.text();
      console.log('Success:', result);
    } else {
      const error = await response.text();
      console.log('Failed:', error);
    }
  } catch (err) {
    console.error('Error running tester:', err);
  } finally {
    rl.close();
  }
}

runTester();