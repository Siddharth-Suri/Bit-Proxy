import http from "http"
import { rateLimiter } from "./rateLimitter.js"
import { loadConfig } from "./config.js"
import { LoadBalancer } from "./loadBalancer.js"
import { updateBackends } from "./healthCheck.js"

const config = loadConfig()
const userRateLimiterInstance = new rateLimiter(config)
const loadBalancer = new LoadBalancer(config.backends)
updateBackends(loadBalancer,config.healthCheck.intervalMs)

const server = http.createServer((req,res)=>{

    const ip = req.socket.remoteAddress ?? 'unknown'
    const passedRateLimited = userRateLimiterInstance.check(ip)

    if(!passedRateLimited){
        res.writeHead(429, { 'Content-Type': 'text/plain' }) 
        res.end('Good Try lil bro , Boom get rate limited lmao')
        return 
    }

    const backendURL = loadBalancer.next()

    if(!backendURL) {
        res.writeHead(502, { 'Content-Type': 'text/plain' }) 
        res.end('All the servers are down currently')
        return 
    }

    let target = new URL(backendURL)

    const backendReq = http.request({
        hostname: target.hostname,
        port: target.port,
        path: req.url,        
        method: req.method,   
        headers: req.headers, 
    }, (backendRes) => {
        res.writeHead(backendRes.statusCode ?? 502, backendRes.headers)
        backendRes.pipe(res)   
    })

    backendReq.setTimeout(5000, () => {
        backendReq.destroy()
        loadBalancer.markDead(backendURL)
        if (!res.headersSent) {
            res.writeHead(504, { 'Content-Type': 'text/plain' })
            res.end('Gateway Timeout')
        }
    })

    backendReq.on('error',()=>{
        loadBalancer.markDead(backendURL)
        if (!res.headersSent) {
            res.writeHead(502, { 'Content-Type': 'text/plain' })
            res.end('Backend error')
        }
    })

    req.pipe(backendReq) 
    
})

server.listen(config.server.port, () => {
    console.log(`Proxy started on : ${config.server.port}`)
})