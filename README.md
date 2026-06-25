# Reverse Proxy

A barebones reverse proxy implemented from scratch using the Node.js `http` module and TypeScript. It has Load balancing across multiple backend servers using `weighted round robin` IP based rate limiting using `token bucket algorithm` and `automated health checks`


## How it works 

- Accepts traffic on a single proxy port
- Applies token bucket rate limiting 
- Forwards requests to configured backend servers using weighted round robin
- Uses weighted node.js servers 
- Tracks backend health with periodic checks

## Project Structure

```text
:
├── proxy/
│   ├── config/proxy.json        
│   └── src/
│       ├── proxy.ts             
│       ├── loadBalancer.ts    
│       ├── healthCheck.ts     
│       ├── rateLimitter.ts    
│       ├── metrics.ts     
│       ├── config.ts          
│       └── backend/ - server.ts         
├── index.html            
├── package.json
├── pnpm-lock.yaml
└── tsconfig.json
```


## Getting Started

### Install

```bash
pnpm install
```

### Run Scripts

```bash
node proxy/src/backend/server.ts
```

This starts 5 sample servers on ports `3000` to `3004`.

### Run Project 

Development:

```bash
pnpm dev
```

Build:

```bash
pnpm build
```

Run compiled output:

```bash
pnpm start
```

### View Metrics

The proxy exposes metrics at:

```text
http://localhost:8080/metrics
```

You can open `index.html` in a browser to view the metrics. It polls the proxy every 2 seconds.

## Metrics Exposed

The proxy currently returns:

- `totalRequests`
- `rejectedRequests`
- `errors`
- `p50` - 50% of requests completed in less than this time
- `p90` - 90% of requests completed in less than this time
- `p95` - 95% of requests completed in less than this time
- `backendStatus[]`


## Future Improvements

- Tests and comparison to HAProxy and NGinx
- Addition of retries 
- Better structured logs
