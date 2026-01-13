# Agent Marketplace Web

Modern React frontend for Agent Marketplace - a beautiful, responsive web interface for discovering, installing, and managing AI agents.

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Quick Start](#quick-start)
- [Deployment Tutorials](#deployment-tutorials)
  - [Linux VM](#linux-vm-deployment)
  - [Windows](#windows-deployment)
  - [Docker](#docker-deployment)
  - [Kubernetes (K8s)](#kubernetes-k8s-deployment)
  - [K3s](#k3s-deployment)
- [Configuration](#configuration)
- [Development](#development)
- [Troubleshooting](#troubleshooting)

---

## Overview

Agent Marketplace Web provides:

- Agent discovery with search and filtering
- Detailed agent pages with versions, stats, and reviews
- GitHub OAuth authentication
- Agent publishing and management
- Social features (stars, reviews, ratings)
- Responsive design for all devices

## Tech Stack

| Category | Technology |
|----------|------------|
| Framework | React 19 + TypeScript |
| Build Tool | Vite 7 |
| Styling | Tailwind CSS |
| State Management | Redux Toolkit + React Query |
| Forms | React Hook Form + Zod |
| HTTP Client | Axios |
| Icons | Lucide React |

## Prerequisites

### All Platforms
- Node.js 20+ (for development/building)
- Git

### Platform-Specific
| Platform | Requirements |
|----------|-------------|
| Linux VM | Nginx or Node.js runtime |
| Windows | IIS, Nginx, or Node.js runtime |
| Docker | Docker Engine 24+ |
| Kubernetes | kubectl, cluster access |
| K3s | k3s installed, kubectl |

---

## Quick Start

```bash
# Clone the repository
git clone https://github.com/kmcallorum/agent-marketplace-web.git
cd agent-marketplace-web

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

The development server runs at `http://localhost:5173`

---

## Deployment Tutorials

### Linux VM Deployment

This guide covers deploying to Ubuntu/Debian, RHEL/CentOS, and generic Linux distributions.

#### Option A: Nginx (Recommended for Production)

**Step 1: Install Node.js and build the application**

```bash
# Ubuntu/Debian
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs nginx

# RHEL/CentOS
curl -fsSL https://rpm.nodesource.com/setup_20.x | sudo bash -
sudo yum install -y nodejs nginx

# Clone and build
git clone https://github.com/kmcallorum/agent-marketplace-web.git
cd agent-marketplace-web
npm ci
npm run build
```

**Step 2: Configure Nginx**

```bash
# Copy built files
sudo mkdir -p /var/www/agent-marketplace
sudo cp -r dist/* /var/www/agent-marketplace/

# Create Nginx configuration
sudo tee /etc/nginx/sites-available/agent-marketplace << 'EOF'
server {
    listen 80;
    server_name your-domain.com;  # Replace with your domain or IP

    root /var/www/agent-marketplace;
    index index.html;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types text/plain text/css text/xml application/json application/javascript application/rss+xml application/atom+xml image/svg+xml;

    # SPA routing
    location / {
        try_files $uri $uri/ /index.html;
    }

    # API proxy (adjust URL to your API server)
    location /api/ {
        proxy_pass http://localhost:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
}
EOF

# Enable site
sudo ln -sf /etc/nginx/sites-available/agent-marketplace /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default

# Test and restart Nginx
sudo nginx -t
sudo systemctl restart nginx
sudo systemctl enable nginx
```

**Step 3: Configure firewall**

```bash
# Ubuntu/Debian (UFW)
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# RHEL/CentOS (firewalld)
sudo firewall-cmd --permanent --add-service=http
sudo firewall-cmd --permanent --add-service=https
sudo firewall-cmd --reload
```

**Step 4: Add SSL with Let's Encrypt (Optional but Recommended)**

```bash
# Install Certbot
sudo apt-get install certbot python3-certbot-nginx  # Debian/Ubuntu
sudo yum install certbot python3-certbot-nginx      # RHEL/CentOS

# Obtain certificate
sudo certbot --nginx -d your-domain.com

# Auto-renewal is configured automatically
```

#### Option B: PM2 with Node.js (Alternative)

```bash
# Install PM2 globally
sudo npm install -g pm2 serve

# Build the application
npm ci
npm run build

# Serve with PM2
pm2 start "serve -s dist -l 3000" --name agent-marketplace

# Save PM2 process list and configure startup
pm2 save
pm2 startup
```

#### Option C: Systemd Service

```bash
# Create systemd service
sudo tee /etc/systemd/system/agent-marketplace.service << 'EOF'
[Unit]
Description=Agent Marketplace Web
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=/var/www/agent-marketplace
ExecStart=/usr/bin/npx serve -s . -l 3000
Restart=on-failure
RestartSec=10

[Install]
WantedBy=multi-user.target
EOF

# Enable and start
sudo systemctl daemon-reload
sudo systemctl enable agent-marketplace
sudo systemctl start agent-marketplace
```

---

### Windows Deployment

#### Option A: IIS (Internet Information Services)

**Step 1: Install IIS with URL Rewrite**

```powershell
# Run as Administrator
# Enable IIS
Enable-WindowsOptionalFeature -Online -FeatureName IIS-WebServerRole, IIS-WebServer, IIS-CommonHttpFeatures, IIS-StaticContent, IIS-DefaultDocument, IIS-HttpCompressionStatic

# Download and install URL Rewrite Module
# https://www.iis.net/downloads/microsoft/url-rewrite
```

**Step 2: Build the application**

```powershell
# Install Node.js from https://nodejs.org/
# Open PowerShell

git clone https://github.com/kmcallorum/agent-marketplace-web.git
cd agent-marketplace-web
npm ci
npm run build
```

**Step 3: Deploy to IIS**

```powershell
# Copy dist folder to IIS
Copy-Item -Path ".\dist\*" -Destination "C:\inetpub\wwwroot\agent-marketplace" -Recurse -Force

# Create web.config for SPA routing
@"
<?xml version="1.0" encoding="UTF-8"?>
<configuration>
    <system.webServer>
        <rewrite>
            <rules>
                <rule name="React Routes" stopProcessing="true">
                    <match url=".*" />
                    <conditions logicalGrouping="MatchAll">
                        <add input="{REQUEST_FILENAME}" matchType="IsFile" negate="true" />
                        <add input="{REQUEST_FILENAME}" matchType="IsDirectory" negate="true" />
                    </conditions>
                    <action type="Rewrite" url="/index.html" />
                </rule>
            </rules>
        </rewrite>
        <staticContent>
            <mimeMap fileExtension=".json" mimeType="application/json" />
            <mimeMap fileExtension=".woff" mimeType="font/woff" />
            <mimeMap fileExtension=".woff2" mimeType="font/woff2" />
        </staticContent>
        <httpCompression>
            <staticTypes>
                <add mimeType="application/javascript" enabled="true" />
                <add mimeType="text/css" enabled="true" />
            </staticTypes>
        </httpCompression>
    </system.webServer>
</configuration>
"@ | Out-File -FilePath "C:\inetpub\wwwroot\agent-marketplace\web.config" -Encoding UTF8
```

**Step 4: Create IIS Site**

```powershell
# Import IIS module
Import-Module WebAdministration

# Create application pool
New-WebAppPool -Name "AgentMarketplace"
Set-ItemProperty -Path "IIS:\AppPools\AgentMarketplace" -Name "managedRuntimeVersion" -Value ""

# Create website
New-Website -Name "AgentMarketplace" -Port 80 -PhysicalPath "C:\inetpub\wwwroot\agent-marketplace" -ApplicationPool "AgentMarketplace"

# Configure firewall
New-NetFirewallRule -DisplayName "Agent Marketplace HTTP" -Direction Inbound -Protocol TCP -LocalPort 80 -Action Allow
```

#### Option B: Nginx on Windows

**Step 1: Download and install Nginx**

```powershell
# Download Nginx for Windows
Invoke-WebRequest -Uri "http://nginx.org/download/nginx-1.24.0.zip" -OutFile "nginx.zip"
Expand-Archive -Path "nginx.zip" -DestinationPath "C:\nginx"

# Build the application
npm ci
npm run build

# Copy dist to nginx html folder
Copy-Item -Path ".\dist\*" -Destination "C:\nginx\nginx-1.24.0\html" -Recurse -Force
```

**Step 2: Configure Nginx**

Create `C:\nginx\nginx-1.24.0\conf\nginx.conf`:

```nginx
worker_processes 1;

events {
    worker_connections 1024;
}

http {
    include mime.types;
    default_type application/octet-stream;
    sendfile on;
    keepalive_timeout 65;

    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml;

    server {
        listen 80;
        server_name localhost;

        root html;
        index index.html;

        location / {
            try_files $uri $uri/ /index.html;
        }

        location /api/ {
            proxy_pass http://localhost:8000;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
        }

        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }
}
```

**Step 3: Run Nginx as a Windows Service**

```powershell
# Install NSSM (Non-Sucking Service Manager)
# Download from https://nssm.cc/download

nssm install nginx "C:\nginx\nginx-1.24.0\nginx.exe"
nssm set nginx AppDirectory "C:\nginx\nginx-1.24.0"
nssm start nginx
```

#### Option C: Node.js with PM2

```powershell
# Install serve and pm2
npm install -g serve pm2 pm2-windows-startup

# Build
npm ci
npm run build

# Start with PM2
pm2 start "serve -s dist -l 3000" --name agent-marketplace
pm2 save
pm2-startup install
```

---

### Docker Deployment

#### Quick Start with Docker

```bash
# Build the image
docker build -t agent-marketplace-web:latest .

# Run the container
docker run -d \
  --name agent-marketplace \
  -p 3000:80 \
  -e VITE_API_URL=http://your-api-server:8000 \
  --restart unless-stopped \
  agent-marketplace-web:latest
```

#### Full Stack with Docker Compose

**Step 1: Create environment file**

```bash
cat > .env << 'EOF'
# API Configuration
VITE_API_URL=http://localhost:8000

# Database
POSTGRES_USER=postgres
POSTGRES_PASSWORD=your-secure-password
POSTGRES_DB=agent_marketplace

# Redis
REDIS_PASSWORD=your-redis-password
EOF
```

**Step 2: Run Docker Compose**

```bash
# Start all services
docker compose up -d

# View logs
docker compose logs -f

# Stop all services
docker compose down

# Stop and remove volumes (WARNING: deletes data)
docker compose down -v
```

#### Production Docker Compose

Create `docker-compose.prod.yml`:

```yaml
version: '3.8'

services:
  web:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - "80:80"
      - "443:443"
    environment:
      - VITE_API_URL=${VITE_API_URL}
    depends_on:
      - api
    restart: always
    deploy:
      resources:
        limits:
          cpus: '0.5'
          memory: 256M
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost/"]
      interval: 30s
      timeout: 10s
      retries: 3

  api:
    image: agent-marketplace-api:latest
    ports:
      - "8000:8000"
    environment:
      - DATABASE_URL=postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@db:5432/${POSTGRES_DB}
      - REDIS_URL=redis://:${REDIS_PASSWORD}@redis:6379
    depends_on:
      db:
        condition: service_healthy
      redis:
        condition: service_healthy
    restart: always
    deploy:
      resources:
        limits:
          cpus: '1'
          memory: 512M

  db:
    image: postgres:15-alpine
    environment:
      - POSTGRES_USER=${POSTGRES_USER}
      - POSTGRES_PASSWORD=${POSTGRES_PASSWORD}
      - POSTGRES_DB=${POSTGRES_DB}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    restart: always
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${POSTGRES_USER} -d ${POSTGRES_DB}"]
      interval: 10s
      timeout: 5s
      retries: 5
    deploy:
      resources:
        limits:
          cpus: '1'
          memory: 512M

  redis:
    image: redis:7-alpine
    command: redis-server --requirepass ${REDIS_PASSWORD}
    volumes:
      - redis_data:/data
    restart: always
    healthcheck:
      test: ["CMD", "redis-cli", "-a", "${REDIS_PASSWORD}", "ping"]
      interval: 10s
      timeout: 5s
      retries: 5
    deploy:
      resources:
        limits:
          cpus: '0.25'
          memory: 128M

volumes:
  postgres_data:
  redis_data:

networks:
  default:
    driver: bridge
```

Run production stack:

```bash
docker compose -f docker-compose.prod.yml up -d
```

#### Multi-Architecture Build

```bash
# Create buildx builder
docker buildx create --name multiarch --use

# Build for multiple architectures
docker buildx build \
  --platform linux/amd64,linux/arm64 \
  -t your-registry/agent-marketplace-web:latest \
  --push .
```

---

### Kubernetes (K8s) Deployment

#### Prerequisites

- kubectl configured with cluster access
- Container registry access (Docker Hub, ECR, GCR, etc.)

#### Step 1: Create Namespace

```bash
kubectl create namespace agent-marketplace
```

#### Step 2: Create ConfigMap

```bash
kubectl apply -f - << 'EOF'
apiVersion: v1
kind: ConfigMap
metadata:
  name: agent-marketplace-config
  namespace: agent-marketplace
data:
  VITE_API_URL: "http://api-service:8000"
EOF
```

#### Step 3: Create Secrets

```bash
kubectl create secret generic agent-marketplace-secrets \
  --namespace agent-marketplace \
  --from-literal=POSTGRES_PASSWORD=your-secure-password \
  --from-literal=REDIS_PASSWORD=your-redis-password
```

#### Step 4: Deploy the Application

Create `k8s/deployment.yaml`:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: agent-marketplace-web
  namespace: agent-marketplace
  labels:
    app: agent-marketplace-web
spec:
  replicas: 3
  selector:
    matchLabels:
      app: agent-marketplace-web
  template:
    metadata:
      labels:
        app: agent-marketplace-web
    spec:
      containers:
        - name: web
          image: your-registry/agent-marketplace-web:latest
          ports:
            - containerPort: 80
          envFrom:
            - configMapRef:
                name: agent-marketplace-config
          resources:
            requests:
              memory: "128Mi"
              cpu: "100m"
            limits:
              memory: "256Mi"
              cpu: "500m"
          livenessProbe:
            httpGet:
              path: /
              port: 80
            initialDelaySeconds: 10
            periodSeconds: 30
          readinessProbe:
            httpGet:
              path: /
              port: 80
            initialDelaySeconds: 5
            periodSeconds: 10
      imagePullSecrets:
        - name: regcred  # If using private registry
---
apiVersion: v1
kind: Service
metadata:
  name: agent-marketplace-web
  namespace: agent-marketplace
spec:
  selector:
    app: agent-marketplace-web
  ports:
    - protocol: TCP
      port: 80
      targetPort: 80
  type: ClusterIP
---
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: agent-marketplace-ingress
  namespace: agent-marketplace
  annotations:
    nginx.ingress.kubernetes.io/rewrite-target: /
    cert-manager.io/cluster-issuer: letsencrypt-prod  # If using cert-manager
spec:
  ingressClassName: nginx
  tls:
    - hosts:
        - agent-marketplace.your-domain.com
      secretName: agent-marketplace-tls
  rules:
    - host: agent-marketplace.your-domain.com
      http:
        paths:
          - path: /
            pathType: Prefix
            backend:
              service:
                name: agent-marketplace-web
                port:
                  number: 80
          - path: /api
            pathType: Prefix
            backend:
              service:
                name: agent-marketplace-api
                port:
                  number: 8000
```

Apply the deployment:

```bash
kubectl apply -f k8s/deployment.yaml
```

#### Step 5: Deploy Supporting Services

Create `k8s/database.yaml`:

```yaml
apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: postgres
  namespace: agent-marketplace
spec:
  serviceName: postgres
  replicas: 1
  selector:
    matchLabels:
      app: postgres
  template:
    metadata:
      labels:
        app: postgres
    spec:
      containers:
        - name: postgres
          image: postgres:15-alpine
          ports:
            - containerPort: 5432
          env:
            - name: POSTGRES_USER
              value: postgres
            - name: POSTGRES_PASSWORD
              valueFrom:
                secretKeyRef:
                  name: agent-marketplace-secrets
                  key: POSTGRES_PASSWORD
            - name: POSTGRES_DB
              value: agent_marketplace
          volumeMounts:
            - name: postgres-data
              mountPath: /var/lib/postgresql/data
          resources:
            requests:
              memory: "256Mi"
              cpu: "250m"
            limits:
              memory: "512Mi"
              cpu: "500m"
  volumeClaimTemplates:
    - metadata:
        name: postgres-data
      spec:
        accessModes: ["ReadWriteOnce"]
        resources:
          requests:
            storage: 10Gi
---
apiVersion: v1
kind: Service
metadata:
  name: postgres
  namespace: agent-marketplace
spec:
  selector:
    app: postgres
  ports:
    - port: 5432
      targetPort: 5432
  clusterIP: None
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: redis
  namespace: agent-marketplace
spec:
  replicas: 1
  selector:
    matchLabels:
      app: redis
  template:
    metadata:
      labels:
        app: redis
    spec:
      containers:
        - name: redis
          image: redis:7-alpine
          command:
            - redis-server
            - --requirepass
            - $(REDIS_PASSWORD)
          env:
            - name: REDIS_PASSWORD
              valueFrom:
                secretKeyRef:
                  name: agent-marketplace-secrets
                  key: REDIS_PASSWORD
          ports:
            - containerPort: 6379
          resources:
            requests:
              memory: "64Mi"
              cpu: "50m"
            limits:
              memory: "128Mi"
              cpu: "100m"
---
apiVersion: v1
kind: Service
metadata:
  name: redis
  namespace: agent-marketplace
spec:
  selector:
    app: redis
  ports:
    - port: 6379
      targetPort: 6379
```

Apply database services:

```bash
kubectl apply -f k8s/database.yaml
```

#### Step 6: Horizontal Pod Autoscaler

```yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: agent-marketplace-web-hpa
  namespace: agent-marketplace
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: agent-marketplace-web
  minReplicas: 2
  maxReplicas: 10
  metrics:
    - type: Resource
      resource:
        name: cpu
        target:
          type: Utilization
          averageUtilization: 70
    - type: Resource
      resource:
        name: memory
        target:
          type: Utilization
          averageUtilization: 80
```

#### Useful K8s Commands

```bash
# Check deployment status
kubectl get pods -n agent-marketplace

# View logs
kubectl logs -f deployment/agent-marketplace-web -n agent-marketplace

# Scale deployment
kubectl scale deployment agent-marketplace-web --replicas=5 -n agent-marketplace

# Rollout status
kubectl rollout status deployment/agent-marketplace-web -n agent-marketplace

# Rollback
kubectl rollout undo deployment/agent-marketplace-web -n agent-marketplace

# Get all resources
kubectl get all -n agent-marketplace
```

---

### K3s Deployment

K3s is a lightweight Kubernetes distribution, ideal for edge, IoT, and resource-constrained environments.

#### Step 1: Install K3s

**Single Node (Development)**

```bash
# Install K3s
curl -sfL https://get.k3s.io | sh -

# Verify installation
sudo k3s kubectl get nodes

# Copy kubeconfig for kubectl access
mkdir -p ~/.kube
sudo cp /etc/rancher/k3s/k3s.yaml ~/.kube/config
sudo chown $(id -u):$(id -g) ~/.kube/config
export KUBECONFIG=~/.kube/config
```

**Multi-Node Cluster**

```bash
# On master node
curl -sfL https://get.k3s.io | sh -s - server --cluster-init

# Get token
sudo cat /var/lib/rancher/k3s/server/node-token

# On worker nodes
curl -sfL https://get.k3s.io | K3S_URL=https://master-ip:6443 K3S_TOKEN=<token> sh -
```

#### Step 2: Create Namespace and Secrets

```bash
kubectl create namespace agent-marketplace

kubectl create secret generic agent-marketplace-secrets \
  --namespace agent-marketplace \
  --from-literal=POSTGRES_PASSWORD=your-secure-password \
  --from-literal=REDIS_PASSWORD=your-redis-password
```

#### Step 3: Deploy with K3s-Optimized Configuration

Create `k3s/deployment.yaml`:

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: agent-marketplace-config
  namespace: agent-marketplace
data:
  VITE_API_URL: "http://api-service:8000"
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: agent-marketplace-web
  namespace: agent-marketplace
spec:
  replicas: 2
  selector:
    matchLabels:
      app: agent-marketplace-web
  template:
    metadata:
      labels:
        app: agent-marketplace-web
    spec:
      containers:
        - name: web
          image: your-registry/agent-marketplace-web:latest
          ports:
            - containerPort: 80
          envFrom:
            - configMapRef:
                name: agent-marketplace-config
          resources:
            requests:
              memory: "64Mi"
              cpu: "50m"
            limits:
              memory: "128Mi"
              cpu: "200m"
          livenessProbe:
            httpGet:
              path: /
              port: 80
            initialDelaySeconds: 10
            periodSeconds: 30
          readinessProbe:
            httpGet:
              path: /
              port: 80
            initialDelaySeconds: 5
            periodSeconds: 10
---
apiVersion: v1
kind: Service
metadata:
  name: agent-marketplace-web
  namespace: agent-marketplace
spec:
  selector:
    app: agent-marketplace-web
  ports:
    - protocol: TCP
      port: 80
      targetPort: 80
  type: ClusterIP
---
# K3s uses Traefik by default as ingress controller
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: agent-marketplace-ingress
  namespace: agent-marketplace
  annotations:
    traefik.ingress.kubernetes.io/router.entrypoints: web,websecure
spec:
  rules:
    - host: agent-marketplace.local  # Use your domain or IP
      http:
        paths:
          - path: /
            pathType: Prefix
            backend:
              service:
                name: agent-marketplace-web
                port:
                  number: 80
```

Apply the configuration:

```bash
kubectl apply -f k3s/deployment.yaml
```

#### Step 4: Deploy Database Services (Lightweight)

Create `k3s/database.yaml`:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: postgres
  namespace: agent-marketplace
spec:
  replicas: 1
  selector:
    matchLabels:
      app: postgres
  template:
    metadata:
      labels:
        app: postgres
    spec:
      containers:
        - name: postgres
          image: postgres:15-alpine
          ports:
            - containerPort: 5432
          env:
            - name: POSTGRES_USER
              value: postgres
            - name: POSTGRES_PASSWORD
              valueFrom:
                secretKeyRef:
                  name: agent-marketplace-secrets
                  key: POSTGRES_PASSWORD
            - name: POSTGRES_DB
              value: agent_marketplace
          volumeMounts:
            - name: postgres-data
              mountPath: /var/lib/postgresql/data
          resources:
            requests:
              memory: "128Mi"
              cpu: "100m"
            limits:
              memory: "256Mi"
              cpu: "250m"
      volumes:
        - name: postgres-data
          persistentVolumeClaim:
            claimName: postgres-pvc
---
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: postgres-pvc
  namespace: agent-marketplace
spec:
  accessModes:
    - ReadWriteOnce
  storageClassName: local-path  # K3s default storage class
  resources:
    requests:
      storage: 5Gi
---
apiVersion: v1
kind: Service
metadata:
  name: postgres
  namespace: agent-marketplace
spec:
  selector:
    app: postgres
  ports:
    - port: 5432
      targetPort: 5432
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: redis
  namespace: agent-marketplace
spec:
  replicas: 1
  selector:
    matchLabels:
      app: redis
  template:
    metadata:
      labels:
        app: redis
    spec:
      containers:
        - name: redis
          image: redis:7-alpine
          command:
            - redis-server
            - --requirepass
            - $(REDIS_PASSWORD)
            - --maxmemory
            - 64mb
            - --maxmemory-policy
            - allkeys-lru
          env:
            - name: REDIS_PASSWORD
              valueFrom:
                secretKeyRef:
                  name: agent-marketplace-secrets
                  key: REDIS_PASSWORD
          ports:
            - containerPort: 6379
          resources:
            requests:
              memory: "32Mi"
              cpu: "25m"
            limits:
              memory: "64Mi"
              cpu: "50m"
---
apiVersion: v1
kind: Service
metadata:
  name: redis
  namespace: agent-marketplace
spec:
  selector:
    app: redis
  ports:
    - port: 6379
      targetPort: 6379
```

Apply:

```bash
kubectl apply -f k3s/database.yaml
```

#### Step 5: Access the Application

**Option A: NodePort**

```bash
# Patch service to NodePort
kubectl patch svc agent-marketplace-web -n agent-marketplace -p '{"spec": {"type": "NodePort"}}'

# Get the NodePort
kubectl get svc agent-marketplace-web -n agent-marketplace
```

**Option B: Port Forward (Development)**

```bash
kubectl port-forward svc/agent-marketplace-web 3000:80 -n agent-marketplace
```

**Option C: LoadBalancer with MetalLB**

```bash
# Install MetalLB
kubectl apply -f https://raw.githubusercontent.com/metallb/metallb/v0.13.12/config/manifests/metallb-native.yaml

# Configure IP pool
kubectl apply -f - << 'EOF'
apiVersion: metallb.io/v1beta1
kind: IPAddressPool
metadata:
  name: default-pool
  namespace: metallb-system
spec:
  addresses:
    - 192.168.1.200-192.168.1.250  # Adjust to your network
---
apiVersion: metallb.io/v1beta1
kind: L2Advertisement
metadata:
  name: default
  namespace: metallb-system
EOF

# Change service type to LoadBalancer
kubectl patch svc agent-marketplace-web -n agent-marketplace -p '{"spec": {"type": "LoadBalancer"}}'
```

#### K3s Specific Commands

```bash
# Check K3s status
sudo systemctl status k3s

# View K3s logs
sudo journalctl -u k3s -f

# Uninstall K3s (master)
/usr/local/bin/k3s-uninstall.sh

# Uninstall K3s (worker)
/usr/local/bin/k3s-agent-uninstall.sh

# Check Traefik dashboard
kubectl port-forward -n kube-system deployment/traefik 9000:9000
```

---

## Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API URL | `http://localhost:8000` |
| `VITE_GITHUB_CLIENT_ID` | GitHub OAuth Client ID | - |
| `VITE_ENABLE_ANALYTICS` | Enable analytics | `false` |

### Build-time Configuration

Create `.env.production` for production builds:

```bash
VITE_API_URL=https://api.your-domain.com
VITE_GITHUB_CLIENT_ID=your-client-id
VITE_ENABLE_ANALYTICS=true
```

---

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run linter
npm run lint

# Run type checking
npm run type-check

# Run tests
npm test

# Build for production
npm run build

# Preview production build
npm run preview
```

---

## Troubleshooting

### Common Issues

**Build fails with memory error**

```bash
# Increase Node.js memory limit
export NODE_OPTIONS="--max-old-space-size=4096"
npm run build
```

**Nginx returns 404 on routes**

Ensure your Nginx config includes the SPA fallback:
```nginx
location / {
    try_files $uri $uri/ /index.html;
}
```

**Docker container won't start**

```bash
# Check logs
docker logs agent-marketplace

# Verify image
docker run -it --rm agent-marketplace-web:latest sh
```

**Kubernetes pod in CrashLoopBackOff**

```bash
# Check pod logs
kubectl logs -f pod/agent-marketplace-web-xxx -n agent-marketplace

# Describe pod for events
kubectl describe pod agent-marketplace-web-xxx -n agent-marketplace
```

**K3s Traefik not routing correctly**

```bash
# Check Traefik logs
kubectl logs -f deployment/traefik -n kube-system

# Verify ingress
kubectl get ingress -n agent-marketplace -o yaml
```

### Health Checks

```bash
# Docker
docker exec agent-marketplace curl -f http://localhost/ || echo "unhealthy"

# Kubernetes
kubectl exec -it deployment/agent-marketplace-web -n agent-marketplace -- curl -f http://localhost/
```

---

## License

MIT License - see [LICENSE](LICENSE) for details.
