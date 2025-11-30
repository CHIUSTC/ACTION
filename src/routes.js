const express = require('express');
const lotteryService = require('./lotteryService');

const router = express.Router();

// Lottery endpoints

// Create a new lottery
router.post('/lotteries', async (req, res) => {
  try {
    const { name, description, startTime, endTime } = req.body;
    const lottery = await lotteryService.createLottery(name, description, startTime, endTime);
    res.status(201).json(lottery);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get all lotteries
router.get('/lotteries', async (req, res) => {
  try {
    const lotteries = await lotteryService.getAllLotteries();
    res.json(lotteries);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get a specific lottery
router.get('/lotteries/:id', async (req, res) => {
  try {
    const lottery = await lotteryService.getLottery(req.params.id);
    res.json(lottery);
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
});

// Delete a lottery
router.delete('/lotteries/:id', async (req, res) => {
  try {
    const result = await lotteryService.deleteLottery(req.params.id);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Prize endpoints

// Add a prize to a lottery
router.post('/lotteries/:lotteryId/prizes', async (req, res) => {
  try {
    const { name, description, quantity } = req.body;
    const prize = await lotteryService.addPrize(
      req.params.lotteryId,
      name,
      description,
      quantity
    );
    res.status(201).json(prize);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Participant endpoints

// Register a participant
router.post('/lotteries/:lotteryId/participants', async (req, res) => {
  try {
    const { userId, userName } = req.body;
    const result = await lotteryService.registerParticipant(
      req.params.lotteryId,
      userId,
      userName
    );
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Lottery draw endpoints

// Draw a winner for a specific prize
router.post('/lotteries/:lotteryId/draw/:prizeId', async (req, res) => {
  try {
    const result = await lotteryService.drawWinner(
      req.params.lotteryId,
      req.params.prizeId
    );
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Winner endpoints

// Get winners for a lottery
router.get('/lotteries/:lotteryId/winners', async (req, res) => {
  try {
    const winners = await lotteryService.getWinners(req.params.lotteryId);
    res.json(winners);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get winners by prize
router.get('/prizes/:prizeId/winners', async (req, res) => {
  try {
    const winners = await lotteryService.getWinnersByPrize(req.params.prizeId);
    res.json(winners);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
