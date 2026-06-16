import http from "http"

function createProxyServer(rateLimiter , LoadBalancer, metrics){
    const server = http.createServer((req,res)=>{
        //  Here we need to check 3 things 
        // - Rate limiter
        // - Load Balancer 
        // - Metris

        const ip = req.socket.remoteAddress ?? 'unkown'

        if()
        


    })
}