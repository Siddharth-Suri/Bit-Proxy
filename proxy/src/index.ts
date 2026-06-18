import http from "http"
import { rateLimiter } from "./rateLimitter.js"
import { loadConfig } from "./config.js"

const parsed = loadConfig()
const userRateLimiterInstance = new rateLimiter(parsed)


const server = http.createServer((req,res)=>{
    const ip = req.socket.remoteAddress ?? 'unknown'
    userRateLimiterInstance.check(ip)
})