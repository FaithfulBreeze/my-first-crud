const http = require("http");
const fs = require("fs");
const path = require("path");
const port = 3030;
//Creates the Server!
http.createServer((req, res) => {
  //Just to get more readable
  const url = req.url
  //Sends the home page
  if (url === "/") {
    res.writeHead(200, { "Content-Type": "text/html" });
    res.end(fs.readFileSync("./index.html"))
  } else {
    //Get the name of the file
    const file = url.split("/")[3]
    //Using object bracket notation to exec the right method based on the url
    const routes = {
      html,
      css,
      png,
      ico,
    }
    //If the method from the routes obj gets an error (does not exist), then exec the 404 route
    try {
      routes[url.split(".")[1]]()
    } catch (error) {
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
    function ico() {}
  }
}).listen(port)
