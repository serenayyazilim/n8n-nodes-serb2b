# Local Testing Guide for n8n-nodes-serb2b

## Prerequisites

1. **Node.js 18+** installed
2. **n8n** installed globally: `npm install -g n8n`

## Testing Steps

### 1. Install n8n globally (if not already installed)
```bash
npm install -g n8n
```

### 2. Create a test directory
```bash
mkdir ~/n8n-test
cd ~/n8n-test
```

### 3. Initialize n8n workspace
```bash
n8n init
```

### 4. Install the SerB2B nodes directly
```bash
# Option A: Install from local directory
npm install /Users/muarifer/htdocs/huysuz/n8n-nodes-serb2b

# Option B: If you publish to npm later
# npm install n8n-nodes-serb2b
```

### 5. Configure n8n to load community nodes
Create or edit `~/.n8n/config` file:
```json
{
  "nodes": {
    "communityPackages": {
      "enabled": true
    }
  }
}
```

### 6. Start n8n
```bash
n8n start
```

### 7. Access n8n
Open browser to: http://localhost:5678

## Testing the Nodes

### 1. Set up Credentials
- Go to Settings > Credentials
- Add new "SerB2B API" credential
- Enter your API token and domain

### 2. Create Test Workflow

#### Test SerB2B Trigger:
1. Add "SerB2B Trigger" node
2. Select an event (e.g., "orders/create")
3. Select your credentials
4. Save and activate workflow

#### Test SerB2B Actions:
1. Add "SerB2B" node
2. Choose resource (Customer/Order/Product)
3. Choose operation (Get/Create/Update/Delete)
4. Configure parameters
5. Execute workflow

### 3. Webhook Testing
- The trigger automatically creates webhooks when activated
- Test by triggering events in your SerB2B system
- Check workflow executions

## Alternative: Docker Testing

If you prefer Docker:

```bash
# Create docker-compose.yml
cat > docker-compose.yml << EOF
version: '3.8'
services:
  n8n:
    image: n8nio/n8n
    ports:
      - "5678:5678"
    environment:
      - N8N_BASIC_AUTH_ACTIVE=false
    volumes:
      - ./n8n_data:/home/node/.n8n
      - /Users/muarifer/htdocs/huysuz/n8n-nodes-serb2b:/home/node/.n8n/nodes/n8n-nodes-serb2b
EOF

# Start n8n
docker-compose up
```

## Troubleshooting

### Node not appearing
1. Check n8n logs for errors
2. Verify package.json n8n configuration
3. Restart n8n completely

### Webhook issues
1. Check SerB2B API logs
2. Verify webhook URL accessibility
3. Check HMAC signature if enabled

### API errors
1. Verify API credentials
2. Check API endpoint URLs
3. Ensure proper permissions

## Development Testing

For active development:

```bash
# In the node package directory
npm run dev  # Watch mode compilation

# In separate terminal
n8n start --tunnel  # Exposes local n8n via tunnel for webhook testing
```

## Production Testing

Before publishing:

1. Test all CRUD operations
2. Test webhook creation/deletion
3. Test error handling
4. Verify credential security
5. Test with multiple workflows

## Next Steps

Once local testing is successful:
1. Publish to npm: `npm publish`
2. Submit to n8n community nodes
3. Share with SerB2B users