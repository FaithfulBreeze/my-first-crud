const fs = require("fs");
const path = require("path");
const crypto = require("crypto")
const users = require('./src/users/users.js')

const crud = {
    //Read route
    GET:(req, res)=>{
      res.writeHead(200, {'Content-Type':'application/json'})

      if(req.url.includes('id=')){ //Checking if the client is requesting an user
        const ID = req.url.split('id=')[1] //If yes, gets the ID
        const user = users().find(user => user.id === ID)

        if(user === undefined){ //If user does not exist, sends an obj with property exists stted to false
          res.end(JSON.stringify({exists: false}))
        }
        res.end(JSON.stringify(user)) //If exixsts, returns the user
      }else{ //This sends all users (without sensible info)
        const userList = []
        for(user of users()){
          for(property in user){ //Removing sensible data
            if(property != 'name' && property != 'id')
            delete user[property]
          }
          userList.push(user)
        }
        res.end(JSON.stringify(userList))
      }
    },
    //Create route
    POST:(req, res)=>{
      const userList = users() //Gets users
      req.on('data', (chunk)=>{
        const user = JSON.parse(chunk)
        user.id = crypto.randomBytes(12).toString('hex')
        userList.push(user)
        fs.writeFileSync('./src/users/users.json', JSON.stringify(userList)) //Write the user list with the new user inside
      })
    },
    //Update route
    PUT:(req, res)=>{
      req.on('data', (chunk)=>{
        const userUpdate = JSON.parse(chunk)
        const userList = users()
        const userIndex = userList.findIndex((userFromList)=>{ //Searching for the user
          return userFromList.id === userUpdate.id
        })
        if(userIndex !== -1){ //Updates if the index is not -1
          userList[userIndex] = userUpdate
          fs.writeFileSync('./src/users/users.json', JSON.stringify(userList))
        }
      })
    },
    //Delete route
    DELETE:(req, res)=>{
      req.on('data', (chunk)=>{
        const {ID} = JSON.parse(chunk) //Getting the ID
        const userList = users()
        const userIndex = userList.findIndex(userFromList => userFromList.id === ID)
        if(userIndex !== -1){ //Deletes if the index is not -1
          userList.splice(userIndex, 1)
          fs.writeFileSync('./src/users/users.json', JSON.stringify(userList))
        }
      })
    }
}
const sources = {
    home:(req, res)=>{
      res.writeHead(200, { "Content-Type": "text/html" });
      res.end(fs.readFileSync("./index.html"))
    },
    html:(req, res, file)=>{
      res.writeHead(200, { "Content-Type": "text/html" })
      res.end(fs.readFileSync(path.join(__dirname, "src", "pages", file)))
    },
    css:(req, res, file)=>{
      res.writeHead(200, { "Content-Type": "text/css" })
      res.end(fs.readFileSync(path.join(__dirname, "src", "css", file)))
    },
    png:(req, res, file)=>{
      res.writeHead(200, { "Content-Type": "image/png" })
      res.end(fs.readFileSync(path.join(__dirname, "src", "images", file)))
    },
    js:(req, res, file)=>{
      res.writeHead(200, { "Content-Type": "text/javascript" })
      res.end(fs.readFileSync(path.join(__dirname, "src", "scripts", file)))
    },
    ico:(req, res, file)=>{

    },
    page404:(req, res)=>{
      res.writeHead(404, { "Content-Type": "text/html" })
      res.end(fs.readFileSync(path.join(__dirname, "src", "pages", "404.html")))
    }
}

module.exports = {crud, sources}