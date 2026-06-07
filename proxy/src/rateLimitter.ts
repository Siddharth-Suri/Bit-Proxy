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

    private _refill() {
        const currentTime = Date.now()
        const timeDifference = (currentTime - this.lastRefillTime)/1000

        this.totalTokens = Math.min(
            this.capacity,
            this.totalTokens + this.refillRate * timeDifference
        )
        
        this.lastRefillTime = Date.now()
    }
}