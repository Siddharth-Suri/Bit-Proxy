import http from "http"
import type { Backend, LoadBalancer } from "./loadBalancer.js";
async function checkBackendAlive(url: string) : Promise<boolean> {
    let isAlive = true 
    await new Promise<boolean> ((resolve)=>{
        const timer = setTimeout(()=>{
            isAlive=false;
            console.log("Backend has died : " + url)
            resolve(isAlive)
        },5*1000)

        const req = http.get(url,(res)=>{
            console.log("Backend is up and running broski : "+ url)
            clearTimeout(timer)
            resolve(isAlive)
        })

        req.on('error',()=>{
            isAlive=false;
            console.log("Backend has died : " + url)
            clearTimeout(timer)
            resolve(isAlive)
        })
        
    })
    return isAlive
}

function updateBackends(BackendObject : LoadBalancer , interval : number) : void {
    setInterval(async()=>{
        await Promise.all(
            BackendObject.backends.map(async (backend) => {
                const isAlive = await checkBackendAlive(backend.url)
                if (isAlive) BackendObject.markAlive(backend.url)
                else BackendObject.markDead(backend.url)
            })
        )
    }, interval)
}