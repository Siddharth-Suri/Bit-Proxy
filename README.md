# Reverse Proxy

A reverse proxy implemented from scratch using the Node.js `http` module and TypeScript. It supports weighted round robin load balancing, IP based rate limiting using a token bucket algorithm, automated health checks, and real time metrics that updates every 2 seconds.


## How it works 

- Accepts traffic on a single proxy port
- Applies token bucket algorithm for rate limiting and protects against DOS attacks
- Forwards requests to configured backend servers using weighted round robin
- Uses weighted node.js servers
- If server doesn’t respond with `timeoutMs` it is marked as dead
- Tracks backend health with periodic checks every `intervalMs`

## Test Statistics

Benchmarks were performed using `autocannon` with the rate limiter disabled. Request distribution was also tracked manually using a `Map` to compare weighted round robin against standard round robin.

- **Requests/sec:** +74%
- **Total requests:** +77%
- **Average latency:** −43%

### Autocannon
- **Weighted**

  ![Weighted](/assets/Weighted-AutoCannon.png)

- **Standard**


	![Standard](/assets/UnWeighted-AutoCannon.png)

### Manual Tracking
- **Weighted**
  
	![Weighted](/assets/Weighted-Server.png)


- **Standard**

	![Standard](/assets/Unweighted-Server.png)

## Metrics Exposed

The proxy currently returns:

- `totalRequests`
- `rejectedRequests`
- `errors`
- `p50` - 50% of requests completed in less than this time
- `p90` - 90% of requests completed in less than this time
- `p95` - 95% of requests completed in less than this time
- `backendStatus[]`

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


## Future Improvements

- Tests and comparison to HAProxy and NGinx
- Addition of retries 
