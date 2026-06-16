import http from "http"

const backend1 = http.createServer((req,res)=>{
    res.statusCode == 200
    res.end("Reached the server")
})

const backend2 = http.createServer((req,res)=>{

})

const backend3 = http.createServer((req,res)=>{

})
