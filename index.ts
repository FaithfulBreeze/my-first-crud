import { crud, sources } from './routes'
import { IncomingMessage, ServerResponse, createServer } from 'node:http'

const port = 5050

interface ServerFunctionInterface {
  (req: IncomingMessage, res: ServerResponse): void
}

//Creates the Server!
createServer(<ServerFunctionInterface>function(req, res){
  if(req.url && req.method){
    //Check if is a CRUD operation
    if(req.url.includes('api/')){
      //Execs the crud methods
      const { method } = req
      if(crud.hasOwnProperty(method)){
        crud[method](req, res)
      }
    }else{ //Source routes
      //Sends the home page
      if (req.url === "/") {
        sources.home(req, res)
      }else{
        //Execs the routes methods
        try {
          //First split - gets the extension of the file by the URL
          //Second split - gets the name of the file by the URL
          const fileExtension = req.url.split(".")[1]
          const file = req.url.split("/")[3]
          if(sources.hasOwnProperty(fileExtension)){
            sources[fileExtension](req, res, file)
          }
        } catch (error) {
          sources.page404(req, res)
        }
      }
    }
    
  }
}).listen(port, () => console.log("Running on port " + port))
