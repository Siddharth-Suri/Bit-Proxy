interface typeMetrics {
    totalRequests : number
    rejectedRequests : number
    errors: number
    p50: number
    p90 : number
    p95 : number 
    backendStatus: { url: string; healthy: boolean }[];
}

export class Metrics {
    private totalRequests: number = 0;
    private rejectedRequests: number = 0;
    private errors: number = 0;
    private latencies: number[] = [];
  
    public recordRequest(): void {
      this.totalRequests++;
    }
  
    public recordRejected(): void {
      this.rejectedRequests++;
    }
  
    public recordError(): void {
      this.errors++;
    }

    public recordLatency(ms : number) : void {
        this.latencies.push(ms)
        if(this.latencies.length>1000){
            this.latencies.shift()
        }
    }

    public latencyResult(): number[] {
        const length = this.latencies.length
        if (length === 0) return [0, 0, 0]
    
        const arrCopy = [...this.latencies]
        arrCopy.sort((a, b) => a - b)
    
        const p50Index = Math.floor(length * 0.5)
        const p90Index = Math.floor(length * 0.9)
        const p95Index = Math.floor(length * 0.95)
    
        const p50 = arrCopy[p50Index] ?? 0
        const p90 = arrCopy[p90Index] ?? 0
        const p95 = arrCopy[p95Index] ?? 0
    
        return [p50, p90, p95]
    }

    public getSummary() : typeMetrics{
        const result = this.latencyResult()
        return {
            totalRequests : this.totalRequests,
            rejectedRequests :  this.rejectedRequests,
            errors: this.errors,
            p50 : result[0] as number,
            p90 : result[1] as number,
            p95 : result[2] as number,
            backendStatus: []

        }
    }

}