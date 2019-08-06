module.exports = function(app, fs, Book, path){

  const formidable = require('express-formidable');

//Home Page
  app.get('/', (req, res) =>{
  	res.sendFile(path.join(__dirname, '../', 'assets/html/index.html'));
  });

  app.get('/index.html', (req, res) =>{
  	res.sendFile(path.join(__dirname, '../', 'assets/html/index.html'));
  });

  app.get('/getBooks.html', (req, res) =>{
    Book.find().then(data =>{
      res.status(200).send(data);
    }).catch(err=>{
      res.status(500).send(err);
    })
  })

  app.post('/upload.html', formidable(), (req, res) =>{
    Book(req.fields).save().then((data)=>{
      res.status(200).send(data);
    }).catch((error)=>{
      res.status(500).send("Error");
    })
  })

  app.get('*', (req, res) =>{
  	res.redirect('/index.html');
  });

}
