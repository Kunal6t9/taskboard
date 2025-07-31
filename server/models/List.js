const mongoose = require('mongoose');

const ListSchema = new mongoose.Schema({
  
  name: String

});

module.exports = mongoose.model('List', ListSchema);