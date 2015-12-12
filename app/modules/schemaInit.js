const mongoose = require('mongoose');

const eggSchema = mongoose.Schema({
  name: String,
  version: String,
  egg: Object
});

mongoose.model('Egg', eggSchema);
