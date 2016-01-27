var mongoose = require('mongoose');
var Schema = mongoose.Schema;


// create User Schema
var Attendance = new Schema({
  barID: {type: String, unique:true},
  attendees: [String],
});


module.exports = mongoose.model('attendances', Attendance);
