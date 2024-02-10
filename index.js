const http = require('http')
const port = 3030
http.createServer((req, res)=>{
    res.end('<h1>Rodando!</h1>')
}).listen(port)