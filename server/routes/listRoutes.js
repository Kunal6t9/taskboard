const express = require('express');
const router = express.Router();
const List = require('../models/List');
const Card = require('../models/Card');

// Get all list
router.get('/', async (req, res) => {
  try {
    const lists = await List.find();
    const result = [];

    for (let list of lists) {
      const cards = await Card.find({ listId: list._id });
      result.push({ ...list._doc, cards });
    }

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Create a new list
router.post('/', async (req, res) => {
  try {
    const list = new List({ name: req.body.name });
    await list.save();
    res.status(201).json(list);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create list' });
  }
});

// Update a list 
router.patch('/:id' , async (req,res) => {
  try {
    const updatedList = await List.findByIdAndUpdate(req.params.id, {name: req.body.name},{new: true});
    res.json(updatedList);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update list'});
  }
});

// Delete a list
router.delete('/:id', async (req,res) => {
  try {
    await Card.deleteMany({ listId: req.params.id });
    await List.findByIdAndDelete(req.params.id);
    res.json({ message: 'List and its Cards deleted'});
  } catch (err){
    res.status(500).json({ message: 'Failed to delete list' });
  }
});

module.exports = router;
