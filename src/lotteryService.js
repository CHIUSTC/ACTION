const db = require('./db');

class LotteryService {
  // Create a new lottery
  async createLottery(name, description, startTime, endTime) {
    const result = await db.run(
      'INSERT INTO lotteries (name, description, start_time, end_time) VALUES (?, ?, ?, ?)',
      [name, description, startTime, endTime]
    );
    return { id: result.id, name, description, startTime, endTime };
  }

  // Add a prize to a lottery
  async addPrize(lotteryId, name, description, quantity) {
    const result = await db.run(
      'INSERT INTO prizes (lottery_id, name, description, quantity, remaining) VALUES (?, ?, ?, ?, ?)',
      [lotteryId, name, description, quantity, quantity]
    );
    return { id: result.id, lotteryId, name, description, quantity, remaining: quantity };
  }

  // Register a participant for a lottery
  async registerParticipant(lotteryId, userId, userName) {
    try {
      // Check if lottery exists and is active
      const lottery = await db.get('SELECT * FROM lotteries WHERE id = ?', [lotteryId]);
      if (!lottery) {
        throw new Error('Lottery not found');
      }

      const now = new Date();
      if (new Date(lottery.start_time) > now || new Date(lottery.end_time) < now) {
        throw new Error('Lottery is not active');
      }

      // Register participant
      const result = await db.run(
        'INSERT OR IGNORE INTO participants (lottery_id, user_id, user_name) VALUES (?, ?, ?)',
        [lotteryId, userId, userName]
      );

      return { success: true, message: 'Participant registered successfully' };
    } catch (err) {
      if (err.code === 'SQLITE_CONSTRAINT') {
        return { success: false, message: 'Participant already registered' };
      }
      throw err;
    }
  }

  // Draw a winner for a specific prize
  async drawWinner(lotteryId, prizeId) {
    // Check if lottery exists
    const lottery = await db.get('SELECT * FROM lotteries WHERE id = ?', [lotteryId]);
    if (!lottery) {
      throw new Error('Lottery not found');
    }

    // Check if prize exists and has remaining quantity
    const prize = await db.get('SELECT * FROM prizes WHERE id = ? AND lottery_id = ?', [prizeId, lotteryId]);
    if (!prize) {
      throw new Error('Prize not found');
    }

    if (prize.remaining <= 0) {
      throw new Error('No remaining prizes');
    }

    // Get all participants who haven't won this prize yet
    const participants = await db.all(`
      SELECT p.* FROM participants p
      LEFT JOIN winners w ON p.lottery_id = w.lottery_id AND p.user_id = w.user_id AND w.prize_id = ?
      WHERE p.lottery_id = ? AND w.id IS NULL
    `, [prizeId, lotteryId]);

    if (participants.length === 0) {
      throw new Error('No eligible participants');
    }

    // Randomly select a winner
    const winnerIndex = Math.floor(Math.random() * participants.length);
    const winner = participants[winnerIndex];

    // Start a transaction
    await db.run('BEGIN TRANSACTION');

    try {
      // Insert winner
      await db.run(
        'INSERT INTO winners (lottery_id, prize_id, user_id, user_name) VALUES (?, ?, ?, ?)',
        [lotteryId, prizeId, winner.user_id, winner.user_name]
      );

      // Update remaining prizes
      await db.run(
        'UPDATE prizes SET remaining = remaining - 1 WHERE id = ?',
        [prizeId]
      );

      // Commit transaction
      await db.run('COMMIT');

      return {
        success: true,
        winner: {
          userId: winner.user_id,
          userName: winner.user_name,
          prizeId: prize.id,
          prizeName: prize.name
        }
      };
    } catch (err) {
      // Rollback transaction
      await db.run('ROLLBACK');
      throw err;
    }
  }

  // Get lottery details
  async getLottery(lotteryId) {
    const lottery = await db.get('SELECT * FROM lotteries WHERE id = ?', [lotteryId]);
    if (!lottery) {
      throw new Error('Lottery not found');
    }

    const prizes = await db.all('SELECT * FROM prizes WHERE lottery_id = ?', [lotteryId]);
    const participantsCount = await db.get(
      'SELECT COUNT(*) as count FROM participants WHERE lottery_id = ?',
      [lotteryId]
    );

    return {
      ...lottery,
      prizes,
      participantsCount: participantsCount.count
    };
  }

  // Get all lotteries
  async getAllLotteries() {
    return await db.all('SELECT * FROM lotteries ORDER BY created_at DESC');
  }

  // Get winners for a lottery
  async getWinners(lotteryId) {
    return await db.all(`
      SELECT w.*, p.name as prize_name FROM winners w
      JOIN prizes p ON w.prize_id = p.id
      WHERE w.lottery_id = ?
      ORDER BY w.won_at DESC
    `, [lotteryId]);
  }

  // Get winners by prize
  async getWinnersByPrize(prizeId) {
    return await db.all(`
      SELECT w.*, p.name as prize_name FROM winners w
      JOIN prizes p ON w.prize_id = p.id
      WHERE w.prize_id = ?
      ORDER BY w.won_at DESC
    `, [prizeId]);
  }

  // Delete a lottery
  async deleteLottery(lotteryId) {
    await db.run('DELETE FROM lotteries WHERE id = ?', [lotteryId]);
    return { success: true, message: 'Lottery deleted successfully' };
  }
}

module.exports = new LotteryService();
