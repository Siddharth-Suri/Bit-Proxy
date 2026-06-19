import http from "http"
import { rateLimiter } from "./rateLimitter.js"
import { loadConfig } from "./config.js"

const config = loadConfig()
const userRateLimiterInstance = new rateLimiter(config)

const server = http.createServer((req,res)=>{

    const ip = req.socket.remoteAddress ?? 'unknown'
    const passedRateLimited = userRateLimiterInstance.check(ip)

    if(!passedRateLimited){
        res.writeHead(429, { 'Content-Type': 'text/plain' }) 
        res.end('Good Try lil bro , Boom get rate limited lmao')
        return 
    }

    
})

server.listen(config.server.port, () => {
    console.log(`Proxy started on : ${config.server.port}`)
})