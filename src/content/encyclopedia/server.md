---
title: "Server"
description: "What servers do, how they handle requests, and how web servers, application servers, and reverse proxies fit together."
category: "Infrastructure"
slug: "server"
status: "published"
---

## 1. Definition

A server is a program, or the computer running it, that provides resources or services to other programs called clients. The word describes a **role** in a relationship, not a type of machine. A laptop running a development site is a server for as long as it answers requests.

The two meanings are worth keeping apart:

- **Server software** listens for requests and responds, such as Nginx or PostgreSQL.
- **Server hardware** is a computer built for continuous operation, often with redundant power and error-correcting memory.

## 2. Purpose and background

Time-sharing mainframes of the 1960s served many terminals. As networks and personal computers spread in the 1980s, the [client-server](/encyclopedia/client-server/) model separated user interfaces from shared data and logic. Centralizing a service means there is one place to update, secure, and back up, and every client can see the same data.

Modern servers are often virtual machines or containers in the [cloud](/encyclopedia/cloud/), but the role has not changed.

## 3. How it works

A network server repeats a straightforward cycle:

1. **Bind** to an IP address and port.
2. **Listen** for connections.
3. **Accept** a connection.
4. **Read** the request.
5. **Process** it, possibly by calling a [database](/encyclopedia/database/) or another service.
6. **Respond**, then wait for the next request.

A minimal [HTTP](/encyclopedia/http/) server in Node.js:

```javascript
import { createServer } from 'node:http';

const server = createServer((req, res) => {
  if (req.url === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({ status: 'ok' }));
  }
  res.writeHead(404, { 'Content-Type': 'text/plain' });
  res.end('Not found');
});

server.listen(3000, '0.0.0.0', () => console.log('Listening on port 3000'));
```

A **port** identifies a service on a host. Well-known examples are 22 (SSH), 80 (HTTP), 443 (HTTPS), and 5432 (PostgreSQL).

The address a server binds to determines who can reach it:

| Bind address | Reachable from |
|---|---|
| `127.0.0.1` | The same machine only |
| `0.0.0.0` | Any network interface, subject to firewalls |

### 3.1 Handling concurrency

| Model | How it works | Trade-off |
|---|---|---|
| One process per connection | Each client has a process | Simple and isolated, but memory-heavy |
| Thread pool | Requests are assigned to threads | Good utilization; shared state needs care |
| Event loop | One thread multiplexes non-blocking I/O | Efficient for I/O; blocked by CPU work |

Nginx and Node.js use event-driven models. Many Java application servers traditionally use thread pools.

## 4. Internal structure of a web deployment

```text
Client → CDN → Load balancer → Reverse proxy → Application servers → Database
```

| Component | Responsibility | Examples |
|---|---|---|
| CDN | Serves cached content close to the user | Cloudflare, CloudFront |
| Load balancer | Distributes traffic, removes unhealthy nodes | HAProxy, cloud load balancers |
| Reverse proxy | TLS, compression, routing | Nginx, Caddy |
| Application server | Runs business logic | Node.js, Tomcat, Gunicorn |
| Database server | Stores state | PostgreSQL, MySQL |

A **stateless** application server keeps no user-specific data in its own memory between requests, so any instance can answer any request and instances can be added or replaced freely.

## 5. Practical usage

A reverse proxy that terminates TLS and forwards requests to an application:

```nginx
server {
    listen 443 ssl;
    server_name app.example.com;

    ssl_certificate     /etc/letsencrypt/live/app.example.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/app.example.com/privkey.pem;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Keep the service running on [Linux](/encyclopedia/linux/) with systemd:

```ini
[Unit]
Description=Example API
After=network.target

[Service]
User=app
WorkingDirectory=/srv/api
ExecStart=/usr/bin/node server.js
Restart=on-failure
Environment=NODE_ENV=production

[Install]
WantedBy=multi-user.target
```

Production servers also need health checks, log collection, metrics, and graceful shutdown on `SIGTERM`, so that in-flight requests can finish during a deployment.

## 6. Relationships with other concepts

- A server depends on an [operating system](/encyclopedia/os/) for sockets and processes.
- [Linux](/encyclopedia/linux/) is the most common server OS.
- The [Web](/encyclopedia/web-concept/) relies on servers to host its resources.
- An [API](/encyclopedia/api/) is the interface a server exposes.
- [Docker](/encyclopedia/docker/) packages server software consistently.

## 7. Advantages and limitations

**Advantages of centralized servers**

- One place to apply updates and security controls.
- Shared, consistent data across all clients.
- Capacity can be scaled independently of clients.

**Limitations**

- A single server is a single point of failure.
- Exposed services are continually probed by attackers.
- Scaling state is harder than scaling stateless logic.
- Clients depend on the network and on availability.

## 8. Common errors and troubleshooting

| Symptom | Likely cause | Next step |
|---|---|---|
| `EADDRINUSE` | Port already in use | `ss -ltnp | grep :3000` |
| Connection refused | Nothing is listening at that address | `systemctl status`, check the bind address |
| Connection times out | Firewall or routing | Check security groups and `ufw status` |
| Works on the server, not remotely | Bound to `127.0.0.1` | Bind to the correct interface or use a proxy |
| 502 Bad Gateway | Upstream is down or returned an invalid response | Check application logs and the `proxy_pass` port |
| 504 Gateway Timeout | Upstream is too slow | Find the slow query or dependency |
| Client IP is always the proxy | Forwarded headers ignored | Configure trusted proxy handling |

Work from outside in, testing one layer at a time:

```bash
curl -v http://127.0.0.1:3000/health   # the application directly, on the server
curl -v https://app.example.com/health # the full path, from outside
journalctl -u example-api -n 50        # recent service logs
```

## 9. Learning path

1. Learn [Client & Server](/encyclopedia/client-server/) roles and [HTTP](/encyclopedia/http/).
2. Practice with [Linux](/encyclopedia/linux/) services and logs.
3. Build an [API](/encyclopedia/api/) and put a reverse proxy in front of it.
4. Package it using [Docker](/encyclopedia/docker/).
5. Deploy it to the [Cloud](/encyclopedia/cloud/).

## 10. References

- [Nginx: Beginner's Guide](https://nginx.org/en/docs/beginners_guide.html)
- [Node.js: HTTP module](https://nodejs.org/api/http.html)
- [The Twelve-Factor App](https://12factor.net/)
