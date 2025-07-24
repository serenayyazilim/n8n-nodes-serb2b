# Development Guide - n8n-nodes-serb2b

## How to Run n8n Package Locally

This guide explains how to develop and test the n8n-nodes-serb2b package locally.

## Prerequisites

- **Node.js 18+** installed
- **n8n** installed globally
- **Git** for version control

## Installation Methods

### Method 1: Direct Installation (Recommended for Testing)

```bash
# 1. Install n8n globally if not already installed
npm install -g n8n

# 2. Create a test workspace
mkdir ~/n8n-test && cd ~/n8n-test

# 3. Install the SerB2B package directly from local directory
npm install /Users/muarifer/htdocs/huysuz/n8n-nodes-serb2b

# 4. Start n8n
n8n start
```

### Method 2: Symlink Method (Best for Development)

```bash
# 1. In the package directory, create a global symlink
cd /Users/muarifer/htdocs/huysuz/n8n-nodes-serb2b
npm link

# 2. In your n8n workspace, link the package
cd ~/n8n-test
npm link n8n-nodes-serb2b

# 3. Start n8n
n8n start
```

### Method 3: Manual Copy Method

```bash
# 1. Find your n8n global installation path
npm list -g n8n

# 2. Copy package to n8n's community nodes directory
mkdir -p ~/.n8n/nodes
cp -r /Users/muarifer/htdocs/huysuz/n8n-nodes-serb2b ~/.n8n/nodes/

# 3. Start n8n
n8n start
```

## Development Workflow

### 1. Setup Development Environment

```bash
# Clone/navigate to package directory
cd /Users/muarifer/htdocs/huysuz/n8n-nodes-serb2b

# Install dependencies
npm install

# Start development mode (watches for changes)
npm run dev
```

### 2. Making Changes

1. **Edit TypeScript files** in `nodes/` or `credentials/`
2. **TypeScript compiler** will automatically recompile (if using `npm run dev`)
3. **Restart n8n** to see changes:
   ```bash
   # Stop n8n (Ctrl+C)
   # Start again
   n8n start
   ```

### 3. Testing Changes

```bash
# Build the package
npm run build

# If using symlink method, changes are automatically available
# If using direct install, reinstall:
cd ~/n8n-test
npm install /Users/muarifer/htdocs/huysuz/n8n-nodes-serb2b --force

# Restart n8n
n8n start
```

## Accessing n8n Interface

1. **Open browser**: http://localhost:5678
2. **Look for nodes**:
   - **SerB2B** node in the regular nodes panel
   - **SerB2B Trigger** in the trigger nodes section
   - **SerB2B API** in Settings > Credentials

## Setting Up Credentials

1. Go to **Settings > Credentials**
2. Click **Add Credential**
3. Select **SerB2B API**
4. Fill in:
   - **API Token**: Your SerB2B API token
   - **Domain**: Your SerB2B instance URL (e.g., https://your-domain.com)
5. **Test** and **Save**

## Testing Workflows

### Test SerB2B Regular Node

1. **Create new workflow**
2. **Add SerB2B node**
3. **Configure**:
   - Select resource (Customer/Order/Product/Category/Brand)
   - Choose operation (Get/Create/Update/Delete/Get All)
   - Set parameters
   - Select credentials
4. **Execute** and check results

### Test SerB2B Trigger Node

1. **Create new workflow**
2. **Add SerB2B Trigger node**
3. **Configure**:
   - Select event type (orders/create, products/delete, etc.)
   - Select credentials
4. **Save and activate** workflow
5. **Check webhook creation** in SerB2B admin panel
6. **Trigger event** in SerB2B to test

## Development Tips

### Hot Reloading

For faster development, use this workflow:

```bash
# Terminal 1: Watch TypeScript compilation
npm run dev

# Terminal 2: Run n8n with tunnel for webhook testing
n8n start --tunnel

# Terminal 3: Make your changes and test
# n8n will need restart for node changes, but credentials persist
```

### Debugging

1. **Check n8n logs** in terminal for errors
2. **Use browser dev tools** for frontend debugging
3. **Add console.log** in your TypeScript code:
   ```typescript
   console.log('Debug info:', data);
   ```
4. **Check SerB2B API logs** for webhook/API issues

### Common Issues

**Node not appearing:**
```bash
# Clear n8n cache and restart
rm -rf ~/.n8n/cache
n8n start
```

**TypeScript errors:**
```bash
# Check and fix TypeScript issues
npm run build
```

**Webhook not working:**
- Verify SerB2B webhook settings
- Check network connectivity
- Test with ngrok tunnel: `n8n start --tunnel`

## Build and Publish

### Local Build

```bash
# Build for production
npm run build

# Check build output
ls -la dist/
```

### Publishing to npm

```bash
# Update version
npm version patch  # or minor/major

# Publish to npm
npm publish

# Install from npm
npm install n8n-nodes-serb2b
```

## File Structure

```
n8n-nodes-serb2b/
├── credentials/
│   └── SerB2BApi.credentials.ts      # API credentials
├── nodes/
│   └── SerB2B/
│       ├── SerB2B.node.ts            # Main CRUD node
│       ├── SerB2BTrigger.node.ts     # Webhook trigger node
│       ├── GenericFunctions.ts       # Shared functions
│       └── serb2b.svg               # Node icon
├── dist/                             # Built output
├── package.json                      # Package config
├── tsconfig.json                     # TypeScript config
└── README.md                         # Documentation
```

## Advanced Development

### Adding New Operations

1. **Edit node files** (SerB2B.node.ts or SerB2BTrigger.node.ts)
2. **Add new properties** to the properties array
3. **Implement logic** in the execute() method
4. **Test thoroughly**
5. **Update documentation**

### Adding New Resources

1. **Add resource option** in properties
2. **Implement CRUD operations** for the resource
3. **Add proper TypeScript types**
4. **Test all operations**
5. **Update README**

### Custom Error Handling

```typescript
try {
    const response = await serB2BApiRequest.call(this, 'GET', '/endpoint');
    return response;
} catch (error) {
    if (this.continueOnFail()) {
        return { json: { error: (error as Error).message } };
    }
    throw new NodeOperationError(this.getNode(), error as Error);
}
```

## Support

For development questions:
1. Check n8n documentation: https://docs.n8n.io/
2. Review SerB2B API documentation
3. Check existing n8n community nodes for examples
4. Contact SerB2B technical support