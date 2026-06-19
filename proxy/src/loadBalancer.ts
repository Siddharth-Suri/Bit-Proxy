interface Backend {
    url: string;
    weight: number;
    healthy: boolean;
}

export class LoadBalancer {
    public backends : Backend[]
    private currentIndex : number
    private currentWeight : number 
    // need a remap function to again count totalbackends
    constructor(backends:{url:string, weight: number}[]){
        this.backends = backends.map((b)=>({
            url: b.url,
            weight: b.weight,
            healthy: true
        }))
        this.currentIndex = 0;
        this.currentWeight = backends[0]?.weight ?? 0;

    }

    public next(): string | null{

        for(let i = 0 ; i < this.backends.length; i++){
            const backend = this.backends[this.currentIndex];

            if(!backend || !backend.healthy){
                this.advance();
                continue;
            }

            this.currentWeight--;
            
            if(this.currentWeight<=0){
                this.advance();
            }

            return backend.url;
        }

        return null;
    }
    
    public markDead(url : string):void {
        const backend = this.backends.find((val) => {
            return val.url === url
        })
        if(backend){
            backend.healthy = false;
            console.log("Marked as dead: "+ url )
        }
        
    }

    public markAlive(url:string): void {
        const backend = this.backends.find((val)=>{
            return val.url === url 
        })
        if(backend){
            backend.healthy = true;
            console.log("Marked as alive: "+ url )
        }
    }

    private advance(){
        this.currentIndex = (this.currentIndex+1) % this.backends.length
        const next = this.backends[this.currentIndex]
        this.currentWeight = next?.weight ?? 0 
    }
}
