module.exports = function (mongoose) {
  mongoose.set('useFindAndModify', false);
  //Connect to Local Mongo through mongoose.
  mongoose.connect('mongodb://localhost/listbooks');
  mongoose.connection.once('open', function(){
  	console.log('connection with Mongo has been successfully established!');
  }).on('error', function(error){
  	console.log("Connection to Mongo Failed: " + error);
  });
};
