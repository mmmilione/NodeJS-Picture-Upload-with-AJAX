  window.addEventListener('load', function(event){
    console.log("caricato!!");
    M.AutoInit();
    getBooks();
  })

//Components
let waitSpinner =  '<div class = "s12 center-align marginTop30">  <div class="preloader-wrapper big active"><div class="spinner-layer spinner-blue"><div class="circle-clipper left"><div class="circle"></div></div><div class="gap-patch"><div class="circle"></div></div><div class="circle-clipper right"><div class="circle"></div></div></div>';
    waitSpinner +='<div class="spinner-layer spinner-red"><div class="circle-clipper left"><div class="circle"></div></div><div class="gap-patch"><div class="circle"></div></div><div class="circle-clipper right"><div class="circle"></div></div></div>';
    waitSpinner += '<div class="spinner-layer spinner-yellow"><div class="circle-clipper left"><div class="circle"></div></div><div class="gap-patch"><div class="circle"></div></div><div class="circle-clipper right"><div class="circle"></div></div></div>';
    waitSpinner +='<div class="spinner-layer spinner-green"><div class="circle-clipper left"><div class="circle"></div></div><div class="gap-patch"><div class="circle"></div></div><div class="circle-clipper right"><div class="circle"></div></div></div></div></div>';

let progress = "<div class = 'col s12 center-align'><h5 class = 'green-text'>Uploaded: <span id = 'percentage'>0</span>%</h5></div>";
    progress += '<div class="preloader-wrapper big active marginTop20 marginBottom"><div class="spinner-layer spinner-green-only"><div class="circle-clipper left"><div class="circle"></div>';
    progress += '</div><div class="gap-patch"><div class="circle"></div></div><div class="circle-clipper right"><div class="circle"></div></div></div></div>';

let success = "<div class = 'col s12 center-align'>";
    success += "<h1 class = 'marginTop20'><i class='far fa-check-circle green-text ' style = 'font-size: 120px' id = 'ok'></i></h1>";
    success += "<div class = 'col s12 center-align'><a href = '#' class = 'btn-large white blue-text marginBottom' onclick = 'location.reload()'><i class ='fas fa-check'></i></a> </div>";

let errorMessage = "<div class = 'col s12 red-text center-align'><h2 class= 'marginTop20'><i class = 'fas fa-exclamation-triangle'></i></h2></div>"
    errorMessage += "<div class = 'col s12 center-align'><h4 class = 'red-text'>Error!</h4></div>";
    errorMessage += "<div class = 'col s12 center-align'><a href = '#' class = 'modal-close btn-large white blue-text marginBottom'><i class ='far fa-window-close'></i></a> </div>";

let formContent =  "<div class='modal-content'><h4 class = 'blue-text'>Add New Book</h4><form>";
    formContent += "<div class = 'input-field'><input type = 'text' placeholder = 'Title' id = 'title'></div>";
    formContent += "<div class = 'input-field'><input type = 'text' placeholder = 'Author' id = 'author'></div>";
    formContent += "<div class='file-field input-field'><div class='btn white'>";
    formContent += "<span><i class='fas fa-image blue-text'></i></span><input type='file' id = 'foto'></div>";
    formContent += "<div class='file-path-wrapper'><input class='file-path validate' type='text'></div></div>";
    formContent += "<div class='center-align'><a href='#' class='btn-large white blue-text' onclick = 'submit()'><i class='fas fa-plus'></i></a></div></form></div>";

renderProgress=(e)=>{
    	const percent = document.querySelector('#percentage');
    	const progressDone = ((e.loaded / e.total) * 100);
    	percent.innerHTML = progressDone.toFixed(0);
}

showForm = () => {
      document.querySelector('#addBookModal').innerHTML = formContent;
      const elems = document.querySelector('#addBookModal');
      const instance = M.Modal.getInstance(elems);
      instance.open();
    }

getBooks = () =>{
  let myBooks = "";
  const url = "/getBooks.html";
  fetch(url).then(function(response){
      if(response.ok){
        return response.json();
      }
    }).then(function(myResponse){
      console.log(myResponse);

      if(myResponse.length > 0){
        myResponse.forEach(book=>{
          myBooks += "<div class = 'col s12 m6 l4 marginTop20 center-align grey-text text-darken-2 z-depth-1'>";
          myBooks += "<img src = '"+book.photo+"' class = 'bookPic'>";
          myBooks += "<p><b>Title:</b> "+book.title+"</p>";
          myBooks += "<p class= 'marginBottom'><b>Author:</b> "+book.author+"</p>";
          myBooks +="</div>";
        })
      }else{
        myBooks += "<div class = 'col s12 marginTop100 red-text'>";
        myBooks += "<p>No Books Found</p>";
        myBooks +="</div>";
      }
      document.querySelector('#startSpinner').hidden = true;
      document.querySelector('#bookList').innerHTML = myBooks;
    }).catch(function(error){
      console.log(error);
      document.querySelector("#startSpinner").hidden = true;
      document.querySelector("#articleContent").innerHTML = errorMessage;
    })
}

submit = () =>{

      //create new Http Request and open it
      const xhr = new XMLHttpRequest();
      xhr.open('POST', '/upload.html', true);

      //Create new FormData Object
      let formdata = new FormData();

      //Get inputs to be submitted and append the to formdata
      const title = document.querySelector('#title').value;
      formdata.append('title', title);
      const author = document.querySelector('#author').value;
      formdata.append('author', author);
      var photo = document.getElementById("foto").files[0];
      formdata.append('photo', photo);

      //Listen for Upload progress and fires renderProgressFunction to show progress to user
      xhr.upload.addEventListener('progress', renderProgress, false);

      /*List for request state changes. When complete (status 200 and state 4)
      diplay error message if something went wrong. Else diplay success message */
      xhr.onreadystatechange = function(){
        if(xhr.status == 500){
          document.querySelector('#addBookModal').innerHTML = errorMessage;
          return;
        }
        if(xhr.readyState == 4 && xhr.status == 200) {
          if(xhr.responseText.includes('Error')){
              console.log(xhr.responseText);
              document.querySelector('#addBookModal').innerHTML = errorMessage;
              return;
          }
          console.log(JSON.parse(xhr.responseText));
          document.querySelector('#addBookModal').innerHTML = success;
        }
      }

      //send http post request to submit FormData
      xhr.send(formdata);
      document.querySelector('#addBookModal').innerHTML = progress;
    }
