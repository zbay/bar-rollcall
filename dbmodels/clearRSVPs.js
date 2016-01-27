var mongoose = require("mongoose");
var Attendance = require("./attendance");

//mongoose.connect('mongodb://localhost:27017/bar-rollcall', function (err, db)
mongoose.connect(process.env.MONGOLAB_URI, function (err, db)
{
Attendance.remove({}, function(error, msg){
    mongoose.connection.close()
});
});