import http from "http"
import { loadConfig } from "../config.ts";
const config = loadConfig()
const counts = new Map<string, number>();

const backend1 = http.createServer((req,res)=>{

    counts.set("http://localhost:3000", (counts.get("http://localhost:3000") ?? 0) + 1);
    console.log("Reached backend 1")
    res.statusCode = 200
    res.end("Hello from backend 1")

}).listen(3000,()=>{console.log("Backend 1 active on port"+3000)})

const backend2 = http.createServer((req,res)=>{

    counts.set("http://localhost:3001", (counts.get("http://localhost:3001") ?? 0) + 1);
    console.log("Reached backend 2")
    setTimeout(()=>{
        res.end("Hello from backend 2")
    },50)

}).listen(3001, ()=>{console.log("Backend 2 active on port"+3001)})

const backend3 = http.createServer((req,res)=>{

    counts.set("http://localhost:3002", (counts.get("http://localhost:3002") ?? 0) + 1);
    console.log("Reached backend 3")
    setTimeout(()=>{
        res.end("Hello from backend 3")
    },100)

}).listen(3002, ()=>{console.log("Backend 3 active on port"+3002)})

const backend4 = http.createServer((req,res)=>{

    counts.set("http://localhost:3003", (counts.get("http://localhost:3003") ?? 0) + 1);
    console.log("Reached backend 4")
    setTimeout(()=>{
        res.end("Hello from backend 4")
    },200)

}).listen(3003, ()=>{console.log("Backend 4 active on port"+3003)})

const backend5 = http.createServer((req,res)=>{

    counts.set("http://localhost:3004", (counts.get("http://localhost:3004") ?? 0) + 1);
    console.log("Reached backend 5")
    if (Math.random() < 0.3) {
        console.log("Backend 5 crashed")
        res.writeHead(500);
        return res.end('error');
    }

    return res.end("Hello from backend 5");

}).listen(3004, ()=>{console.log("Backend 5 active on port"+3004)})

const backend6 = http.createServer((req,res)=>{

    counts.set("http://localhost:3005", (counts.get("http://localhost:3005") ?? 0) + 1);
    console.log("Reached backend 6")
    setTimeout(()=>{
        res.end("Hello from backend 6")
    },10*1000)

}).listen(3005, ()=>{console.log("Backend 6 active on port"+3005)})

const backend7 = http.createServer((req,res)=>{

    counts.set("http://localhost:3006", (counts.get("http://localhost:3006") ?? 0) + 1);
    console.log("Reached backend 7")
    let sum = 0 ; 
    for(let i = 0 ; i < 100000; i++){
        sum = sum*i;
    }
    res.end("Hello from backend 7")

}).listen(3006, ()=>{console.log("Backend 7 active on port"+3006)})

process.on("SIGINT", () => {

    console.log("\n=== Backend Request Counts ===\n");
    for (const backend of config.backends) {
        console.log(
            `${backend.url} , Weight : ${backend.weight} , Requests : ${counts.get(backend.url) ?? 0}`
        );
    }
    process.exit(0);
});