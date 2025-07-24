# Docker Testing Guide - SerB2B n8n Connector

## Overview
This guide explains how to test the SerB2B n8n connector using Docker, providing an isolated environment for development and testing.

## Prerequisites
- Docker installed on your machine
- Docker Compose installed
- Built distribution files in the `dist/` directory

## Docker Compose Configuration

Create a `docker-compose.yml` file in your project root:

```yaml
version: '3.8'

services:
  n8n:
    image: n8nio/n8n
    ports:
      - "5678:5678"
    environment:
      - N8N_BASIC_AUTH_ACTIVE=false
      - N8N_LOG_LEVEL=debug
      - N8N_LOG_OUTPUT=console
    volumes:
      - ./n8n_data:/home/node/.n8n
      - /Users/muarifer/htdocs/serb2b-n8n-connector/dist:/home/node/.n8n/custom
    networks:
      - backend

networks:
  backend:
    driver: bridge
```

## Setup Instructions

### 1. Build the Project
```bash
# Ensure you have the latest build
npm run build
```

### 2. Create Required Directories
```bash
# Create n8n data directory if it doesn't exist
mkdir -p n8n_data
```

### 3. Start Docker Container
```bash
# Start n8n with Docker Compose
docker-compose up -d

# View logs
docker-compose logs -f n8n
```

### 4. Access n8n Interface
Open your browser and navigate to:
```
http://localhost:5678
```

## Verifying Installation

1. **Check Node Availability**:
   - Look for "SerB2B" in the nodes panel
   - Check for "SerB2B Trigger" in trigger nodes

2. **Verify Credentials**:
   - Go to Settings > Credentials
   - "SerB2B API" should be available

3. **Check Logs**:
   ```bash
   docker-compose logs n8n | grep -i serb2b
   ```

## Development Workflow

### Hot Reload Setup
For active development with Docker:

1. **Watch TypeScript Changes**:
   ```bash
   # In one terminal
   npm run dev
   ```

2. **Restart Container After Changes**:
   ```bash
   # Restart to load new changes
   docker-compose restart n8n
   ```

### Quick Rebuild and Test
```bash
# One-liner to rebuild and restart
npm run build && docker-compose restart n8n
```

## Testing Workflows

### 1. Create Test Credentials
1. Navigate to Settings > Credentials
2. Add "SerB2B API" credential
3. Enter test API token and domain

### 2. Test Regular Node
1. Create new workflow
2. Add SerB2B node
3. Configure operation
4. Execute and verify

### 3. Test Trigger Node
1. Create workflow with SerB2B Trigger
2. Activate workflow
3. Test webhook with curl:
   ```bash
   curl -X POST http://localhost:5678/webhook/[webhook-id] \
     -H "Content-Type: application/json" \
     -d '{"event": "orders/create", "data": {"id": 123}}'
   ```

## Debugging

### View Container Logs
```bash
# Full logs
docker-compose logs n8n

# Follow logs
docker-compose logs -f n8n

# Last 100 lines
docker-compose logs --tail=100 n8n
```

### Access Container Shell
```bash
# Enter container
docker-compose exec n8n sh

# Check custom nodes
ls -la /home/node/.n8n/custom/
```

### Common Issues

**Node Not Appearing**:
```bash
# Check if files are mounted correctly
docker-compose exec n8n ls -la /home/node/.n8n/custom/nodes/SerB2B/

# Restart container
docker-compose restart n8n
```

**Permission Issues**:
```bash
# Fix permissions on host
chmod -R 755 dist/

# Or adjust in docker-compose.yml
user: "1000:1000"  # Match your user ID
```

**Build Errors**:
```bash
# Clean and rebuild
rm -rf dist/
npm run build
docker-compose restart n8n
```

## Advanced Configuration

### Enable Authentication
```yaml
environment:
  - N8N_BASIC_AUTH_ACTIVE=true
  - N8N_BASIC_AUTH_USER=admin
  - N8N_BASIC_AUTH_PASSWORD=password
```

### Persistent Workflows
```yaml
volumes:
  - ./n8n_data:/home/node/.n8n
  - ./workflows:/home/node/.n8n/workflows  # Backup workflows
```

### Network Mode for Webhooks
```yaml
services:
  n8n:
    network_mode: host  # Use host network for webhook testing
```

## Cleanup

### Stop Services
```bash
# Stop containers
docker-compose down

# Stop and remove volumes
docker-compose down -v
```

### Reset Environment
```bash
# Remove all data
rm -rf n8n_data/

# Clean build
rm -rf dist/
npm run build
```

## Production Considerations

For production deployment:

1. **Use Environment Variables**:
   ```yaml
   env_file:
     - .env.production
   ```

2. **Add SSL/TLS**:
   - Use reverse proxy (nginx/traefik)
   - Configure HTTPS endpoints

3. **Resource Limits**:
   ```yaml
   deploy:
     resources:
       limits:
         cpus: '2'
         memory: 2G
   ```

4. **Health Checks**:
   ```yaml
   healthcheck:
     test: ["CMD", "wget", "-q", "--spider", "http://localhost:5678/healthz"]
     interval: 30s
     timeout: 10s
     retries: 3
   ```

## Tips

1. **Use Docker volumes** for persistent data
2. **Monitor logs** during development
3. **Test webhooks** with ngrok for external access
4. **Keep containers updated** with latest n8n image
5. **Document environment variables** for team members

## Troubleshooting Checklist

- [ ] Verify Docker is running
- [ ] Check dist/ directory exists and has built files
- [ ] Confirm volume paths are correct
- [ ] Ensure ports are not in use
- [ ] Verify file permissions
- [ ] Check Docker logs for errors
- [ ] Test with minimal configuration first