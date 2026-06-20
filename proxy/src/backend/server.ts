import http from "http"

const backend1 = http.createServer((req,res)=>{
    console.log("Reached backend 1")
    res.statusCode == 200
    res.end("Hello from backend 1")
}).listen(3000,()=>{console.log("Backend 1 active on port"+3000)})

const backend2 = http.createServer((req,res)=>{
    console.log("Reached backend 2")
    setTimeout(()=>{
        res.end("Hello , Waited 3 seconds for server 2 ")
    },3*1000)
}).listen(3001, ()=>{console.log("Backend 2 active on port"+3001)})

const backend3 = http.createServer((req,res)=>{
    console.log("Reached backend 3")
    setTimeout(()=>{
        res.end("Waited 5 seconds for server 3 ")
    },5*1000)
}).listen(3002, ()=>{console.log("Backend 3 active on port"+3002)})

const backend4 = http.createServer((req,res)=>{
    console.log("Reached backend 4")
    setTimeout(()=>{
        res.end("Waited 7 seconds for server 2 ")
    },7*1000)
}).listen(3003, ()=>{console.log("Backend 4 active on port"+3003)})

const backend5 = http.createServer((req,res)=>{
    console.log("Reached backend 5")
    if (Math.random() < 0.3) {
        console.log("Backend 5 crashed")
        res.writeHead(500);
        return res.end('error');
    }
}).listen(3004, ()=>{console.log("Backend 5 active on port"+3004)})
