module.exports = function(app, fs, Book, path){


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

  app.get('*', (req, res) =>{
  	res.redirect('/index.html');
  });

}
