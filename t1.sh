cd ~/Projects/agent-marketplace-ld-web

# Create .env.production file
cat > .env.production << EOF
VITE_API_URL=http://api.ai-agentmarket.com:8000
VITE_GITHUB_CLIENT_ID=Ov23littVkxMT7QlMdH0
EOF

# Rebuild with production env vars
docker buildx build --platform linux/amd64 -t registry.digitalocean.com/lanierdevelopments/marketplace-web:latest --push .

# Restart the deployment
kubectl rollout restart deployment web -n agent-marketplace
