const http = require("http");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto")
const port = 3030;
//Creates the Server!
http.createServer((req, res) => {
  //Reads the user json
  const usersJSON = JSON.parse(fs.readFileSync('./src/users/users.json'))
  //Just to get more readable
  const url = req.url
  //Check if is a CRUD operation
  if(url.includes('api/')){
    const method = req.method
    //Methods for each operation
    const crudRoutes= {
      //Read route
      GET:()=>{
        res.writeHead(200, {'Content-Type':'application/json'})
        res.end(JSON.stringify(usersJSON))
      },
      //Create route
      POST:()=>{
        req.on('data', (chunk)=>{
          const user = JSON.parse(chunk)
          user.id = crypto.randomBytes(12).toString('hex')
          usersJSON.push(user)
          fs.writeFileSync('./src/users/users.json', JSON.stringify(usersJSON))
        })
      },
      //Update route
      PUT:()=>{
        req.on('data', (chunk)=>{
          const userUpdate = JSON.parse(chunk)
          const {index} = userUpdate
          delete userUpdate.index
            usersJSON[index] = userUpdate
            fs.writeFileSync('./src/users/users.json', JSON.stringify(usersJSON))
        })
      },
      //Delete route
      DELETE:()=>{
        req.on('data', (chunk)=>{
          const index = JSON.parse(chunk).index
          usersJSON.splice(index, 1)
          fs.writeFileSync('./src/users/users.json', JSON.stringify(usersJSON))
        })
      }
    }
    //Execs the operation
    crudRoutes[method]()
  }else{
      //Sends the home page
      if (url === "/") {
        res.writeHead(200, { "Content-Type": "text/html" });
        res.end(fs.readFileSync("./index.html"))
      }else{
        //Get the name of the file
        const file = url.split("/")[3]
        //Using object bracket notation to exec the right method based on the url
        const routes = {
          html,
          css,
          png,
          js,
          ico,
        }
        //Execs the routes methods
        try {
          routes[url.split(".")[1]]()
        } catch (error) {
          //If the method from the routes obj gets an error (does not exist), then exec the 404 route
          pageNotFound()
        }
        //The methods that are on the routes obj
        function html() {
          res.writeHead(200, { "Content-Type": "text/html" })
          res.end(fs.readFileSync(path.join(__dirname, "src", "pages", file)))
        }
        function css() {
          res.writeHead(200, { "Content-Type": "text/css" })
          res.end(fs.readFileSync(path.join(__dirname, "src", "css", file)))
        }
        function png() {
          res.writeHead(200, { "Content-Type": "image/png" })
          res.end(fs.readFileSync(path.join(__dirname, "src", "images", file)))
        }
        function pageNotFound() {
          res.writeHead(404, { "Content-Type": "text/html" })
          res.end(fs.readFileSync("./404.html"))
        }
        function js() {
          res.writeHead(200, { "Content-Type": "text/javascript" })
          res.end(fs.readFileSync(path.join(__dirname, "src", "scripts", file)))
        }
        function ico() {}
      }
    }
}).listen(port)
