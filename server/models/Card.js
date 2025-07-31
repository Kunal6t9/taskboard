const mongoose = require('mongoose'); 

const CardSchema = new mongoose.Schema({

  text: String,
  listId: {
    
    type: mongoose.Schema.Types.ObjectId,
    ref: 'List'
  
  }
});

module.exports = mongoose.model('Card', CardSchema);