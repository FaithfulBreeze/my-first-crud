import fs from "fs"
import path from "path"
import crypto from "crypto"
import { UserInterface } from "./src/interfaces/UserInterface"
import { CrudFunctionInterface } from "./src/interfaces/CrudFunctionInterface"
import { SourceFunctionInterface } from "./src/interfaces/SourceFunctionInterface"
import { users } from './src/users/users'



interface CrudInterface {
  [key: string]: Function,
  GET: CrudFunctionInterface,
  POST: CrudFunctionInterface,
  PUT: CrudFunctionInterface,
  DELETE: CrudFunctionInterface
}

export const crud: CrudInterface = {
    //Read route
    GET:(req, res)=>{
      res.writeHead(200, {'Content-Type':'application/json'})

      const userList = users()

      if(!Array.isArray(userList)){
        res.statusCode = 500
        return res.end(JSON.stringify({ message: "Error on reading database." }))
      }

      if(userList.length == 0){
        res.statusCode = 404
        return res.end(JSON.stringify({ message: "Empty database." }))
      }

      if(req.url && req.url.includes('id=')){ //Checking if the client is requesting an user

        const ID = req.url.split('id=')[1] //If yes, gets the ID
        const user = userList.find((user: UserInterface) => user.id === ID)

        //If user does not exist, sends an obj with property exists setted to false
        if(!user){
          res.statusCode = 404
          return res.end() 
        }

        return res.end(JSON.stringify(user)) //If exixsts, returns the user

      }else{ //This sends all users (without sensible info)

        const userList = users()

        if(!Array.isArray(userList)){
          res.statusCode = 500
          return res.end(JSON.stringify({ message: "Error on reading database." }))
        }

        userList.forEach((user: { email: (string | undefined), age: (number | undefined)  }) => {
          delete user.email
          delete user.age
        })
        res.end(JSON.stringify(userList))
      }
    },
    //Create route
    POST:(req, res)=>{
      res.writeHead(201, {'Content-Type':'application/json'})
      const userList = users() //Gets users
      
      if(!Array.isArray(userList)){
        res.statusCode = 500
        return res.end(JSON.stringify({ message: "Error on reading database." }))
      }

      req.on('data', (chunk)=>{
        const user: UserInterface = JSON.parse(chunk)
        user.id = crypto.randomBytes(12).toString('hex')
        userList.push(user)
        try {
          fs.writeFileSync('./src/users/userDatabase.json', JSON.stringify(userList)) //Write the user list with the new user inside
        } catch (error) {
          res.statusCode = 500
          return res.end(JSON.stringify({ message: "Error on writing data." }))
        }
        res.end(JSON.stringify(user))
      })
    },
    //Update route
    PUT:(req, res)=>{
      res.writeHead(204, {'Content-Type':'application/json'})
      req.on('data', (chunk)=>{
        const newUserData: UserInterface = JSON.parse(chunk)
        const userList = users()

        if(!Array.isArray(userList)){
          res.statusCode = 500
          return res.end(JSON.stringify({ message: "Error on reading database." }))
        }

        const userIndex = userList.findIndex((userFromList) => userFromList.id === newUserData.id)

        if(userIndex === -1){
          res.statusCode = 404
          return res.end()
        }

        if(userIndex !== -1){ //Updates if the index is not -1
          userList[userIndex] = newUserData
          try {
            fs.writeFileSync('./src/users/userDatabase.json', JSON.stringify(userList))
          } catch (error) {
            res.statusCode = 500
            return res.end(JSON.stringify({ message: "Error on writing data." }))
          }
          return res.end()
        }
      })
    },
    //Delete route
    DELETE:(req, res)=>{
      res.writeHead(204, {'Content-Type':'application/json'})
      req.on('data', (chunk)=>{
        const { ID } = JSON.parse(chunk) //Getting the ID

        const userList = users()

        if(!Array.isArray(userList)){
          res.statusCode = 500
          return res.end(JSON.stringify({ message: "Error on reading database." }))
        }

        const userIndex = userList.findIndex(userFromList => userFromList.id === ID)

        if(userIndex === -1){
          res.statusCode = 404
          return res.end()
        }

          userList.splice(userIndex, 1)

          try {
            fs.writeFileSync('./src/users/userDatabase.json', JSON.stringify(userList))            
          } catch (error) {
            res.statusCode = 500
            return res.end(JSON.stringify({ message: "Error on writing data." }))
          }
          res.end()
      })
    }
}

export const sources: { [key: string]: Function } = {
    home: <SourceFunctionInterface>function(req, res) {
      res.writeHead(200, { "Content-Type": "text/html" });
      res.end(fs.readFileSync("./index.html"))
    },
    html: <SourceFunctionInterface>function(req, res, file) {
      res.writeHead(200, { "Content-Type": "text/html" })
      res.end(fs.readFileSync(path.join(__dirname, "src", "pages", file as string)))
    },
    css: <SourceFunctionInterface>function(req, res, file) {
      res.writeHead(200, { "Content-Type": "text/css" })
      res.end(fs.readFileSync(path.join(__dirname, "src", "css", file as string)))
    },
    png: <SourceFunctionInterface>function(req, res, file) {
      res.writeHead(200, { "Content-Type": "image/png" })
      res.end(fs.readFileSync(path.join(__dirname, "src", "images", file as string)))
    },
    js: <SourceFunctionInterface>function(req, res, file) {
      res.writeHead(200, { "Content-Type": "text/javascript" })
      res.end(fs.readFileSync(path.join(__dirname, "src", "scripts", file as string)))
    },
    ico: <SourceFunctionInterface>function(req, res) {

    },
    page404: <SourceFunctionInterface>function(req, res, file) {
      res.writeHead(404, { "Content-Type": "text/html" })
      res.end(fs.readFileSync(path.join(__dirname, "src", "pages", "404.html")))
    }
}
