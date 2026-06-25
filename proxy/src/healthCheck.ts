import http from "http"
import type { Backend, LoadBalancer } from "./loadBalancer.ts";

async function checkBackendAlive(url: string , timeout : number) : Promise<boolean> {
    let isAlive = true 

    await new Promise<boolean> ((resolve)=>{
        const timer = setTimeout(()=>{
            isAlive=false;
            console.log("Backend has died : " + url)
            resolve(isAlive)
        },timeout)

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

export function updateBackends(BackendObject : LoadBalancer , interval : number , timeout : number) : void {
    
    setInterval(async()=>{
        await Promise.all(
            BackendObject.backends.map(async (backend) => {
                const isAlive = await checkBackendAlive(backend.url, timeout)
                if (isAlive) BackendObject.markAlive(backend.url)
                else BackendObject.markDead(backend.url)
            })
        )
    }, interval)
}
