import 
interface Backend {
    url: string;
    weight: number;
    healthy: boolean;
}

export class LoadBalancer {
    public backends 
    private currentIndex
    private currentWeight
    constructor(backends:{url:string, weight: number}[]){
        this.backends = backends.map((b)=>{
            url: b.url
            weight: b.weight
            healthy: true
        })
        this.currentIndex = 0;
        this.currentWeight = backends[0]?.weight ?? 0;
    }

    public next(){
        let total = this.backends.length

        for(let i = 0 ; i < total ; i++){
            const backend = this.backends[this.currentIndex];
            if(!backend.healthy){
                this.advance();
                continue;
            }

            this.currentWeight--;
            
            if(this.currentWeight<=0){
                this.advance();
            }

            return backend.url;
            
        }
    }
}
