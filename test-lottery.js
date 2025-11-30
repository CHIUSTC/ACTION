const axios = require('axios');

const API_BASE_URL = 'http://localhost:3000/api';

async function testLotterySystem() {
  console.log('Testing Lottery System API...\n');

  try {
    // 1. Create a new lottery
    console.log('1. Creating a new lottery...');
    const lotteryResponse = await axios.post(`${API_BASE_URL}/lotteries`, {
      name: 'Test Lottery',
      description: 'A test lottery for API testing',
      startTime: new Date().toISOString(),
      endTime: new Date(Date.now() + 86400000).toISOString() // 24 hours from now
    });
    const lottery = lotteryResponse.data;
    console.log(`✓ Lottery created: ${lottery.name} (ID: ${lottery.id})`);

    // 2. Add prizes to the lottery
    console.log('\n2. Adding prizes...');
    const prizes = [
      { name: 'First Prize', description: 'Grand prize', quantity: 1 },
      { name: 'Second Prize', description: 'Second prize', quantity: 2 },
      { name: 'Third Prize', description: 'Third prize', quantity: 3 }
    ];

    const prizeIds = [];
    for (const prizeData of prizes) {
      const prizeResponse = await axios.post(`${API_BASE_URL}/lotteries/${lottery.id}/prizes`, prizeData);
      const prize = prizeResponse.data;
      prizeIds.push(prize.id);
      console.log(`✓ Prize added: ${prize.name} (ID: ${prize.id}, Quantity: ${prize.quantity})`);
    }

    // 3. Register participants
    console.log('\n3. Registering participants...');
    const participants = [
      { userId: 'user1', userName: 'User One' },
      { userId: 'user2', userName: 'User Two' },
      { userId: 'user3', userName: 'User Three' },
      { userId: 'user4', userName: 'User Four' },
      { userId: 'user5', userName: 'User Five' },
      { userId: 'user6', userName: 'User Six' },
      { userId: 'user7', userName: 'User Seven' },
      { userId: 'user8', userName: 'User Eight' }
    ];

    for (const participant of participants) {
      await axios.post(`${API_BASE_URL}/lotteries/${lottery.id}/participants`, participant);
      console.log(`✓ Participant registered: ${participant.userName} (ID: ${participant.userId})`);
    }

    // 4. Draw winners
    console.log('\n4. Drawing winners...');
    const winners = [];

    for (let i = 0; i < prizeIds.length; i++) {
      const prizeId = prizeIds[i];
      const prizeName = prizes[i].name;
      const quantity = prizes[i].quantity;

      for (let j = 0; j < quantity; j++) {
        const drawResponse = await axios.post(`${API_BASE_URL}/lotteries/${lottery.id}/draw/${prizeId}`);
        const result = drawResponse.data;
        winners.push(result.winner);
        console.log(`✓ Winner drawn for ${prizeName}: ${result.winner.userName} (User ID: ${result.winner.userId})`);
      }
    }

    // 5. Get all winners
    console.log('\n5. Getting all winners...');
    const winnersResponse = await axios.get(`${API_BASE_URL}/lotteries/${lottery.id}/winners`);
    const allWinners = winnersResponse.data;
    console.log(`✓ Found ${allWinners.length} winners:`);
    allWinners.forEach(winner => {
      console.log(`  - ${winner.user_name} won ${winner.prize_name} (${winner.won_at})`);
    });

    // 6. Get lottery details
    console.log('\n6. Getting lottery details...');
    const lotteryDetailsResponse = await axios.get(`${API_BASE_URL}/lotteries/${lottery.id}`);
    const lotteryDetails = lotteryDetailsResponse.data;
    console.log(`✓ Lottery details retrieved:`);
    console.log(`  - Name: ${lotteryDetails.name}`);
    console.log(`  - Description: ${lotteryDetails.description}`);
    console.log(`  - Participants: ${lotteryDetails.participantsCount}`);
    console.log(`  - Prizes: ${lotteryDetails.prizes.length}`);
    lotteryDetails.prizes.forEach(prize => {
      console.log(`    * ${prize.name}: ${prize.remaining}/${prize.quantity} remaining`);
    });

    console.log('\n🎉 All tests passed successfully!');
    console.log('\nAPI Endpoints:');
    console.log('  - GET /api/lotteries          - Get all lotteries');
    console.log('  - POST /api/lotteries         - Create a new lottery');
    console.log('  - GET /api/lotteries/:id      - Get lottery details');
    console.log('  - DELETE /api/lotteries/:id   - Delete a lottery');
    console.log('  - POST /api/lotteries/:lotteryId/prizes - Add a prize');
    console.log('  - POST /api/lotteries/:lotteryId/participants - Register participant');
    console.log('  - POST /api/lotteries/:lotteryId/draw/:prizeId - Draw a winner');
    console.log('  - GET /api/lotteries/:lotteryId/winners - Get all winners');
    console.log('  - GET /api/prizes/:prizeId/winners - Get winners by prize');

  } catch (error) {
    console.error('❌ Test failed:', error);
    console.error('Error details:', {
      message: error.message,
      response: error.response?.data,
      stack: error.stack
    });
    process.exit(1);
  }
}

testLotterySystem();
