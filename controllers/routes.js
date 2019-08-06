module.exports = function(app, fs, Book, path){

  const formidable = require('express-formidable');
  const sharp = require('sharp');

  let newName = "";
  let newNameSmall = "";
  let fileOK = true;

  const opts ={
    encoding: 'utf-8',
    keepExtensions: true,
    maxFileSize : 5 * 1024 * 1024,
  }

  const events = [
      {
        event: 'fileBegin',
        action: function (req, res, next, name, file) {
          console.log("ecco il file!!");
          console.log(file);
          const fileType = file.type.split('/').pop();
          const fileName = file.name.split('.').shift();
          console.log(fileType);
          if(file.type.startsWith('image/')){
            fileOK = true;
            let newFileTitle = fileName + new Date().getTime();
            newName= newFileTitle+"."+fileType;
            newNameSmall= newFileTitle+"Small."+fileType;
            file.path = './assets/images/books/' + newFileTitle + '.' + fileType;
          }else{
            console.log('extention not supported');
            fileOK = false;
          }
        }
      },
      {
        event: 'error',
        action: function (error) {
          console.log("Error");
          fileOK = false;
        }
      }
  ];

  reducePicture = (target, destination) =>{
    sharp(target).resize({ height: 500 }).toFile(destination)
    .then(function() {
        fs.unlinkSync(target);
    })
    .catch(function(err) {
        console.log("Error occured: ", err);
    });
  }

//Home Page
  app.get('/', (req, res) =>{
  	res.sendFile(path.join(__dirname, '../', 'assets/html/index.html'));
  });

  app.get('/index.html', (req, res) =>{
  	res.sendFile(path.join(__dirname, '../', 'assets/html/index.html'));
  });

  app.post('/upload.html', formidable(opts, events), (req, res) =>{

    console.log(req.files);
    req.fields.photo = "./assets/images/books/"+newNameSmall;
    target = "./assets/images/books/"+newName;
    console.log(req.fields.photo);

    if(fileOK == false){
      res.status(500).send("Error");
      return;
    }
    reducePicture(target, req.fields.photo);

    Book(req.fields).save().then((data)=>{
      res.status(200).send(data);
    }).catch((error)=>{
      res.status(500).send("Error");
    })
  })

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
