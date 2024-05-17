const http = require("http");
const {crud, sources} = require('./routes.js')

const port = 5050;

//Creates the Server!
http.createServer((req, res) => {

  //Check if is a CRUD operation
  if(req.url.includes('api/')){
    //Execs the crud methods
    crud[req.method](req, res)

  }else{ //Source routes
      //Sends the home page
      if (req.url === "/") {
        sources.home(req, res)
      }else{
        //Execs the routes methods
        try {
           //First split - gets the extension of the file by the URL
           //Second split - gets the name of the file by the URL
          sources[req.url.split(".")[1]](req, res, req.url.split("/")[3])
        } catch (error) {
          sources.page404(req, res)
        }
      }
  }
}).listen(port)
