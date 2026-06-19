import type {Config} from "./config.js"

class tokenBucket {
    private capacity
    private totalTokens
    private refillRate
    private lastRefillTime

    constructor(capacity : number, refill : number){
        this.capacity = capacity
        this.totalTokens = capacity
        this.refillRate = refill
        this.lastRefillTime = Date.now()
    }

    public eat() {
        this._refill()
        if(this.totalTokens<1){
            return false;
        }
        this.totalTokens--
        return true
    }

    public isFull(){
        this._refill()
        return this.totalTokens >= this.capacity
    }

    private _refill() {
        const currentTime = Date.now()
        const timeDifference = (currentTime - this.lastRefillTime)/1000

        this.totalTokens = Math.min(
            this.capacity,
            this.totalTokens + this.refillRate * timeDifference
        )
        
        this.lastRefillTime = currentTime
    }
}

export class rateLimiter {
    private buckets :  Map<string, tokenBucket>
    private configFile : Config

    constructor(config: Config) {
        this.buckets = new Map()
        this.configFile = config

        setInterval(()=>{
            this._cleanup()
        },5*60*1000)
    }

    public check (ipAddress:string) : boolean{
        if(!this.buckets.has(ipAddress)){
            this.buckets.set(ipAddress, new tokenBucket(
                this.configFile.rateLimit.capacity,
                this.configFile.rateLimit.refillRate
            ))
        }
        return this.buckets.get(ipAddress)!.eat()
    }

    private _cleanup() {
        for (const [ip, bucket] of this.buckets) {
            if (bucket.isFull()) {
              this.buckets.delete(ip);
            }
        }
    }
}   