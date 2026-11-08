---
title: "Docker"
description: "How Docker packages applications as images and runs them as isolated containers, with Dockerfile, Compose, and debugging examples."
category: "Infrastructure"
slug: "docker"
status: "published"
---

## 1. Definition

Docker is a platform for building, distributing, and running applications in **containers**. A container is an isolated group of processes that includes an application's own file system and dependencies, while sharing the kernel of its host.

Two terms are essential:

- **Image:** an immutable, layered template containing an application and its dependencies.
- **Container:** a running, or stopped, instance of an image. The relationship is similar to a program and a process.

## 2. Purpose and background

Software commonly behaved differently on a developer's laptop than on a production [server](/encyclopedia/server/), due to differing library versions and configuration. Docker, introduced by Solomon Hykes at dotCloud in 2013, made existing [Linux](/encyclopedia/linux/) isolation features easy to use and added a portable image format.

Docker's formats later informed the Open Container Initiative (OCI) standards, so images built with Docker also run on other compliant runtimes.

## 3. How it works

Containers are built from Linux kernel features:

| Feature | Role |
|---|---|
| **Namespaces** | Give the process its own view of PIDs, network, mounts, and host name |
| **cgroups** | Limit and account for CPU, memory, and I/O |
| **Union file system (overlay2)** | Stacks read-only image layers below a writable layer |
| **Capabilities and seccomp** | Reduce the privileges and system calls available |

Because the kernel is shared, a Linux container needs a Linux kernel. Docker Desktop on Windows and macOS runs a lightweight Linux virtual machine for this purpose.

### 3.1 Containers and virtual machines

| | Container | Virtual machine |
|---|---|---|
| Isolates | Processes | A whole guest machine |
| Kernel | Shared with the host | Guest has its own |
| Startup | Often under a second | Typically much longer |
| Size | Often megabytes | Often gigabytes |
| Isolation strength | Good, with a larger shared surface | Stronger hardware-level boundary |

## 4. Internal structure

```text
docker CLI → dockerd → containerd → runc → container process
                 ↕
             Registry (Docker Hub, GHCR, ECR)
```

Each Dockerfile instruction that changes the file system creates a **layer**. Layers are identified by content and reused between images, and the build cache reuses unchanged steps. Once one step changes, all later steps must rebuild, so instruction order matters.

## 5. Practical usage

### 5.1 A multi-stage Dockerfile

This builds a static Astro site in one stage and ships only its output with Nginx:

```dockerfile
# Build stage
FROM node:22-alpine AS build
WORKDIR /app

# Copy dependency manifests first, to benefit from the layer cache.
COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

# Runtime stage
FROM nginx:1.27-alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
```

A `.dockerignore` file keeps unwanted files out of the build context:

```text
node_modules
dist
.git
.env
```

### 5.2 Everyday commands

```bash
docker build -t expansion:1.0 .
docker run -d --name web -p 8080:80 expansion:1.0
docker ps
docker logs -f web
docker exec -it web sh
docker stop web && docker rm web
```

`-p 8080:80` maps port 8080 on the host to port 80 in the container.

### 5.3 Multiple services with Compose

```yaml
services:
  api:
    build: .
    ports:
      - "3000:3000"
    environment:
      DATABASE_URL: postgres://app:${DB_PASSWORD}@db:5432/app
    depends_on:
      db:
        condition: service_healthy

  db:
    image: postgres:17
    environment:
      POSTGRES_USER: app
      POSTGRES_PASSWORD: ${DB_PASSWORD}
      POSTGRES_DB: app
    volumes:
      - db-data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U app"]
      interval: 5s
      retries: 10

volumes:
  db-data:
```

Compose gives services a shared network, on which they reach each other by service name, here `db`.

A container's writable layer disappears when the container is removed. Data that must persist belongs in a **volume**.

### 5.4 Image security

- Use small, trusted, version-pinned base images.
- Run as a non-root user with the `USER` instruction.
- Never bake secrets into an image. Layers and history can be read.
- Scan images for known vulnerabilities and rebuild regularly.

## 6. Relationships with other concepts

- Docker relies on [Linux](/encyclopedia/linux/) kernel features.
- Containers are ultimately [operating system](/encyclopedia/os/) processes.
- [Cloud](/encyclopedia/cloud/) platforms run container images at scale.
- Kubernetes orchestrates containers across multiple machines.

## 7. Advantages and limitations

**Advantages**

- The same image runs the same way across environments.
- Fast startup and efficient resource use.
- Simple rollbacks to earlier image versions.
- Dependency isolation between applications.

**Limitations**

- Weaker isolation than a virtual machine for untrusted workloads.
- Persistent data and networking add complexity.
- Images built for one CPU architecture need emulation or a multi-platform build on another.
- A single host needs orchestration tools to achieve scale and failover.

## 8. Common errors and troubleshooting

| Symptom | Likely cause | Solution |
|---|---|---|
| `port is already allocated` | Host port in use | Choose another port or stop the other process |
| Container exits immediately | Main process ended or crashed | `docker logs name` |
| Exit code 137 | Killed by SIGKILL, frequently out of memory | `docker inspect`, raise the limit |
| Cannot connect to `localhost` from one container to another | `localhost` is the container itself | Use the service name |
| App is unreachable from the host | Listening on `127.0.0.1` inside | Bind to `0.0.0.0` |
| `exec format error` | Image is for another CPU architecture | Build with `--platform` |
| Every build reinstalls dependencies | Cache invalidated by early `COPY . .` | Copy manifests first |
| Data vanished | No volume | Mount a named volume |
| `no space left on device` | Old images and layers | Review `docker system df`; prune with care |

Be careful with `docker system prune --volumes`: it can permanently remove data that is not attached to a running container.

## 9. Learning path

1. Learn [Linux](/encyclopedia/linux/) processes and file systems.
2. Containerize a simple [Server](/encyclopedia/server/).
3. Write multi-stage builds.
4. Combine an application with a [Database](/encyclopedia/database/) using Compose.
5. Deploy images to the [Cloud](/encyclopedia/cloud/), then explore Kubernetes.

## 10. References

- [Docker documentation](https://docs.docker.com/)
- [Dockerfile best practices](https://docs.docker.com/build/building/best-practices/)
- [Open Container Initiative](https://opencontainers.org/)
