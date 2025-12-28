# Walet Frontend

## Team Members

**Group Name:** Tanya Steven (TS)

| Name | NPM |
|------|-----|
| Naufal Ichsan | 2206082013 |
| Winoto Hasyim | 2206025243 |
| Steven Faustin Orginata | 2206030855 |
| Matthew Hotmaraja Johan Turnip | 2206081231 |
| Emir Mohamad Fathan | 2206081982 |

---

A modern web application frontend for Walet - a wallet/finance management system. This project was developed as part of a **Cloud Computing course** final project, demonstrating containerized deployment with Docker and reverse proxy configuration with Nginx.

## 📋 Table of Contents

- [Project Overview](#project-overview)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Deployment Guide](#deployment-guide)
- [Project Architecture](#project-architecture)
- [Configuration](#configuration)
- [Troubleshooting](#troubleshooting)

---

## Project Overview

Walet is a full-stack wallet/finance management application. This repository contains the **frontend** portion of the application, which provides:

- User authentication (login/register)
- Dashboard for financial overview
- Project management features
- Invitation system
- Data visualization with charts

The frontend communicates with a separate backend API server to handle data persistence and business logic.

---

## Tech Stack

| Category | Technology | Version |
|----------|------------|---------|
| **Framework** | [Next.js](https://nextjs.org/) | 15.3.1 |
| **Runtime** | [Bun](https://bun.sh/) | Alpine (Docker) |
| **Language** | TypeScript | 5.x |
| **UI Library** | React | 19.0.0 |
| **Styling** | [Tailwind CSS](https://tailwindcss.com/) | 4.x |
| **State Management** | [Zustand](https://zustand-demo.pmnd.rs/) | 5.0.4 |
| **HTTP Client** | [Axios](https://axios-http.com/) | 1.9.0 |
| **UI Components** | [Radix UI](https://www.radix-ui.com/), [Lucide React](https://lucide.dev/) | Various |
| **Charts** | [Recharts](https://recharts.org/) | 2.15.3 |
| **Containerization** | [Docker](https://www.docker.com/) | Latest |
| **Reverse Proxy** | [Nginx](https://nginx.org/) | Alpine |
| **Container Orchestration** | [Docker Compose](https://docs.docker.com/compose/) | v2+ |

---

## Prerequisites

Before deploying this application, ensure you have the following installed on your server/machine:

- **Docker** (v24.x or higher)
- **Docker Compose** (v2.x or higher)
- **Git** (for cloning the repository)

---

## Deployment Guide

Follow these steps to deploy the Walet Frontend application:

### Step 1: Clone the Repository

```bash
git clone <repository-url>
cd walet-frontend
```

### Step 2: Configure Environment Variables

The application requires the backend API URL to be set at build time.

Edit the `docker-compose.yml` file and update the `NEXT_PUBLIC_API_URL` argument:

```yaml
args:
  - NEXT_PUBLIC_API_URL=http://<YOUR_BACKEND_API_IP_OR_DOMAIN>
```

> **Note:** Replace `<YOUR_BACKEND_API_IP_OR_DOMAIN>` with the actual IP address or domain of your backend server.

### Step 3: Build and Start the Application

Run the following command to build and start all services:

```bash
docker compose up -d --build
```

**Explanation of flags:**
- `-d`: Run in detached mode (background)
- `--build`: Force rebuild of Docker images

### Step 4: Verify Deployment

Check that containers are running:

```bash
docker compose ps
```

**Expected output:**

```
NAME              IMAGE                    STATUS         PORTS
walet-frontend    walet-frontend-...       Up             80/tcp
walet-nginx       nginx:alpine             Up             0.0.0.0:80->80/tcp
```

### Step 5: Access the Application

Open your browser and navigate to:

```
http://<YOUR_SERVER_IP>
```

The application should be accessible on port 80.

---

## Project Architecture

The deployment uses a **two-container architecture** orchestrated by Docker Compose:

```
┌─────────────────────────────────────────────────────────────┐
│                        Host Machine                          │
│                                                              │
│   ┌─────────────────────────────────────────────────────┐   │
│   │              Docker Compose Network                  │   │
│   │                                                      │   │
│   │   ┌─────────────┐         ┌───────────────────┐     │   │
│   │   │   Nginx     │         │  Walet Frontend   │     │   │
│   │   │  (Reverse   │────────▶│    (Next.js +     │     │   │
│   │   │   Proxy)    │         │      Bun)         │     │   │
│   │   │             │         │                   │     │   │
│   │   │  Port: 80   │         │   Internal: 80    │     │   │
│   │   │  (exposed)  │         │   (not exposed)   │     │   │
│   │   └─────────────┘         └───────────────────┘     │   │
│   │         ▲                                            │   │
│   │         │                                            │   │
│   └─────────┼────────────────────────────────────────────┘   │
│             │                                                │
└─────────────┼────────────────────────────────────────────────┘
              │
         Internet
        (Port 80)
```

### Container Details

#### 1. `walet-frontend` Container

- **Base Image:** `oven/bun:alpine`
- **Purpose:** Runs the Next.js application in production mode
- **Build Process:**
  - Multi-stage Docker build for optimized image size
  - Dependencies installed with Bun
  - Next.js build with standalone output
- **Port:** 80 (internal, not exposed to host)

#### 2. `walet-nginx` Container

- **Base Image:** `nginx:alpine`
- **Purpose:** Acts as a reverse proxy to the frontend
- **Features:**
  - Load balancing capability
  - Proper HTTP header forwarding
  - WebSocket support for Next.js hot reload (development)
- **Port:** 80 (exposed to host)

### Why Use Nginx as a Reverse Proxy?

1. **Security:** Only Nginx is exposed to the internet; the application container remains internal
2. **Scalability:** Can easily add load balancing for multiple frontend instances
3. **SSL Termination:** Can be extended to handle HTTPS certificates
4. **Static File Serving:** Efficient handling of static assets
5. **Request Routing:** Can route to multiple backend services

---

## Configuration

### Docker Compose Configuration (`docker-compose.yml`)

```yaml
services:
  walet-frontend:
    build:
      context: .
      dockerfile: Dockerfile
      args:
        - NEXT_PUBLIC_API_URL=http://52.2.37.1  # Backend API URL
    container_name: walet-frontend
    restart: unless-stopped                      # Auto-restart on failure
    expose:
      - "80"                                     # Internal port only
    environment:
      - NODE_ENV=production

  nginx:
    image: nginx:alpine
    container_name: walet-nginx
    restart: unless-stopped
    ports:
      - "80:80"                                  # Expose to host
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro   # Mount config as read-only
    depends_on:
      - walet-frontend                           # Start after frontend
```

### Nginx Configuration (`nginx.conf`)

The Nginx configuration sets up:
- **Upstream server:** Points to the frontend container
- **Reverse proxy:** Forwards all requests to the Next.js app
- **Header forwarding:** Preserves client IP and protocol information

---

## Troubleshooting

### Common Issues

#### 1. Port 80 Already in Use

```bash
# Check what's using port 80
sudo lsof -i :80

# Stop the conflicting service or use a different port in docker-compose.yml
```

#### 2. Container Fails to Start

```bash
# Check container logs
docker compose logs walet-frontend
docker compose logs nginx
```

#### 3. Cannot Connect to Backend API

- Ensure the `NEXT_PUBLIC_API_URL` is correct in `docker-compose.yml`
- Verify the backend server is running and accessible
- Check firewall rules allow traffic between frontend and backend

#### 4. Rebuild After Changes

```bash
# Stop and remove containers, then rebuild
docker compose down
docker compose up -d --build
```

#### 5. Clean Up Docker Resources

```bash
# Remove unused images and containers
docker system prune -a
```

### Useful Commands

| Command | Description |
|---------|-------------|
| `docker compose up -d` | Start services in background |
| `docker compose down` | Stop and remove containers |
| `docker compose ps` | List running containers |
| `docker compose logs -f` | Follow logs from all services |
| `docker compose restart` | Restart all services |
| `docker compose build --no-cache` | Rebuild without cache |

---

## Development (Local)

For local development without Docker:

```bash
# Install dependencies
npm install
# or
bun install

# Run development server
npm run dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## License

This project was created for educational purposes as part of a Cloud Computing course.
