"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const routes_1 = require("./routes");
const node_http_1 = require("node:http");
const port = 5050;
//Creates the Server!
(0, node_http_1.createServer)(function (req, res) {
    if (req.url && req.method) {
        //Check if is a CRUD operation
        if (req.url.includes('api/')) {
            //Execs the crud methods
            const { method } = req;
            if (routes_1.crud.hasOwnProperty(method)) {
                routes_1.crud[method](req, res);
            }
        }
        else { //Source routes
            //Sends the home page
            if (req.url === "/") {
                routes_1.sources.home(req, res);
            }
            else {
                //Execs the routes methods
                try {
                    //First split - gets the extension of the file by the URL
                    //Second split - gets the name of the file by the URL
                    const fileExtension = req.url.split(".")[1];
                    const file = req.url.split("/")[3];
                    if (routes_1.sources.hasOwnProperty(fileExtension)) {
                        routes_1.sources[fileExtension](req, res, file);
                    }
                }
                catch (error) {
                    routes_1.sources.page404(req, res);
                }
            }
        }
    }
}).listen(port, () => console.log("Running on port " + port));
