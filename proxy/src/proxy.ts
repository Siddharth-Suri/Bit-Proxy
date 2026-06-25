import http from "http"
import { rateLimitter } from "./rateLimitter.ts"
import { loadConfig } from "./config.ts"
import { LoadBalancer } from "./loadBalancer.ts"
import { updateBackends } from "./healthCheck.ts"
import { Metrics } from "./metrics.ts"

const config = loadConfig()
const userRateLimiterInstance = new rateLimitter(config)
const loadBalancer = new LoadBalancer(config.backends)
const metrics = new Metrics()

updateBackends(loadBalancer, config.healthCheck.intervalMs , config.healthCheck.timeoutMs)

const server = http.createServer((req, res) => {

    if (req.url === '/favicon.ico') {
        res.writeHead(204)
        res.end("Favicon request blocked")
        return
    }

    const ip = req.socket.remoteAddress ?? 'unknown'

    if (req.url === '/metrics') {
        if(ip==='unknown') {
            res.writeHead(403, {'Content-Type': 'text/plain' })
            res.end('Forbidden')
            return 
        }
        const summary = metrics.getSummary()
        summary.backendStatus = loadBalancer.backends.map(b => ({
            url: b.url,
            healthy: b.healthy
        }))

        res.writeHead(200, {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        })
        res.end(JSON.stringify(summary))
        return
    }

    const passedRateLimited = userRateLimiterInstance.check(ip)

    if (!passedRateLimited) {
        metrics.recordRejected()

        res.writeHead(429, { 'Content-Type': 'text/plain' })
        res.end('You have been rate limited')
        return
    }

    const backendURL = loadBalancer.next()

    if (!backendURL) {
        res.writeHead(502, { 'Content-Type': 'text/plain' })
        res.end('All the servers are down currently')
        return
    }

    metrics.recordRequest()
    const startTime = Date.now()

    let target = new URL(backendURL)

    const backendReq = http.request({
        hostname: target.hostname,
        port: target.port,
        path: req.url,
        method: req.method,
        headers: req.headers,
    }, (backendRes) => {
        const latency = Date.now() - startTime
        metrics.recordLatency(latency)

        res.writeHead(backendRes.statusCode ?? 502, backendRes.headers)
        backendRes.pipe(res)
    })

    backendReq.setTimeout(5000, () => {
        backendReq.destroy()
        loadBalancer.markDead(backendURL)
        metrics.recordError()

        if (!res.headersSent) {
            res.writeHead(504, { 'Content-Type': 'text/plain' })
            res.end('Gateway Timeout')
        }
    })

    backendReq.on('error', () => {
        loadBalancer.markDead(backendURL)
        metrics.recordError()

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
