const mongoose = require('mongoose');

const eggSchema = mongoose.Schema({
  name: String,
  version: String,
  egg: Object
});

mongoose.model('Egg', eggSchema);

const nestSchema = mongoose.Schema({
  name: String,
  OS: String,
  provisioned: Boolean,
  provisioned_at: Date,
  provision_error: String,
  provision_token: String,
  address: String,
  user: String,
  port: Number,
  password: String, // We need to salt and hash this
  eggs: Array,
  busy: Boolean
});

mongoose.model('Nest', nestSchema);
