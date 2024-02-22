const fs = require('fs')
const path = require('path')
module.exports = function(){
    return JSON.parse(fs.readFileSync(path.join(__dirname, 'users.json'), (err)=>{
        if(err){
            throw new Error(err)
        }
    }))
}
