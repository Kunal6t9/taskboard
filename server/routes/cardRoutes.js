const express = require('express');
const router = express.Router();
const Card = require('../models/Card');


// Create card in list
router.post('/:listId/cards', async (req, res) => {
  try {
    console.log('Creating card:', req.body.text, 'for listId:', req.params.listId);
   
    const card = new Card({
      text: req.body.text,
      listId: req.params.listId
    });
    await card.save();
    res.status(200).json(card);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create card' });
  }
});

// Delete card
router.delete('/:id', async (req, res) => {
  try {
    await Card.findByIdAndDelete(req.params.id);
    res.json({ message: 'Card deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete card' });
  }
});

// Move card to another list
router.patch('/:id', async (req, res) => {
  try {
    const card = await Card.findByIdAndUpdate(req.params.id, {
      listId: req.body.listId
    }, { new: true });
    res.json(card);
  } catch (err) {
    res.status(500).json({ error: 'Failed to move card' });
  }
});

module.exports = router;
