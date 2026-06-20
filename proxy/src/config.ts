import fs from 'fs';

const path = "./proxy/config/proxy.json"

interface Backend {
    url: string;
    weight: number;
}
  
interface HealthCheck {
    intervalMs: number;
    timeoutMs: number;
}
  
interface RateLimit {
    capacity: number;
    refillRate: number;
}
  
export interface Config {
    server: {
      port: number;
    };
    backends: Backend[];
    healthCheck: HealthCheck;
    rateLimit: RateLimit;
}
  
export function loadConfig():Config {
    const parsed:Config = JSON.parse(fs.readFileSync(path,"utf-8"));
    return parsed
}