# SerB2B n8n Connector - Project Overview

## Project Description
This is an n8n community node package that provides integration with the SerB2B e-commerce platform. It includes both a regular node for CRUD operations and a trigger node for webhook events.

## Technology Stack
- **Language**: TypeScript
- **Target Platform**: n8n workflow automation
- **Node.js Version**: 18+
- **n8n API Version**: 1
- **Build System**: TypeScript Compiler (tsc)

## Project Structure
```
/Users/muarifer/htdocs/serb2b-n8n-connector/
├── credentials/
│   └── SerB2BApi.credentials.ts      # API authentication credentials
├── nodes/SerB2B/
│   ├── SerB2B.node.ts               # Main CRUD operations node
│   ├── SerB2BTrigger.node.ts        # Webhook trigger node
│   ├── GenericFunctions.ts          # Shared utility functions
│   └── serb2b.svg                   # Node icon
├── dist/                            # Compiled output directory
├── package.json                     # Project configuration
├── tsconfig.json                    # TypeScript configuration
├── README.md                        # User documentation
├── DEVELOPMENT.md                   # Development guide
└── LOCAL_TESTING.md                 # Local testing guide
```

## Key Components

### Credentials (SerB2BApi.credentials.ts)
- Handles API authentication
- Requires API Token and Domain
- Uses header-based authentication (X-Serb2b-Access-Token)

### Main Node (SerB2B.node.ts)
Supports CRUD operations for:
- **Customer**: Create, Read, Update, Delete, List
- **Order**: Create, Read, Update, Delete, List
- **Product**: Create, Read, Update, Delete, List
- **Category**: Read, List
- **Brand**: Read, List

### Trigger Node (SerB2BTrigger.node.ts)
Webhook-based event triggers for:
- Order events (create, update, delete)
- Product events (create, delete)
- Customer events (create, delete, approve)
- Supplier events (create, delete, approve, decline, quantity change)
- Marketplace events (create, price approved)

### Utility Functions (GenericFunctions.ts)
- `serB2BApiRequest`: Generic API request handler
- `serB2BApiRequestAllItems`: Pagination handler
- `validateJSON`: JSON validation utility

## Development Commands

### Build Commands
```bash
npm run build          # Compile TypeScript and copy icons
npm run dev           # Watch mode for development
```

### Code Quality
```bash
npm run lint          # Run ESLint
npm run lintfix       # Fix ESLint issues
npm run format        # Format code with Prettier
```

### Testing
```bash
# No automated tests configured
# Manual testing via n8n instance required
```

## Dependencies
- **Runtime**: n8n-workflow (>=1.0.0)
- **Development**: 
  - TypeScript (~4.9.5)
  - ESLint with TypeScript parser
  - Prettier

## API Integration
- **Base URL**: User's SerB2B domain (e.g., https://your-domain.com)
- **Authentication**: Header-based with API token
- **Rate Limits**: 1000 requests/hour per API token
- **Webhook Security**: HMAC-SHA256 signature verification

## Important Files to Edit

### Adding New Resources
Edit `nodes/SerB2B/SerB2B.node.ts`:
- Add to resource options array (line 46-65)
- Implement operations in properties array
- Add execution logic in execute() method

### Adding New Events
Edit `nodes/SerB2B/SerB2BTrigger.node.ts`:
- Add to events options array
- Update webhook subscription logic

### Modifying API Requests
Edit `nodes/SerB2B/GenericFunctions.ts`:
- Modify serB2BApiRequest for request handling
- Update error handling logic

## Build Process
1. TypeScript files compiled to JavaScript in `dist/`
2. SVG icons copied to output directory
3. Package ready for n8n consumption

## Local Development Setup
```bash
# Install dependencies
npm install

# Start development mode
npm run dev

# Link to n8n for testing
npm link
cd ~/n8n-test
npm link n8n-nodes-serb2b
n8n start
```

## Testing Checklist
- [ ] Test all CRUD operations for each resource
- [ ] Verify webhook creation/deletion
- [ ] Test error handling for invalid credentials
- [ ] Verify pagination for large datasets
- [ ] Test all event types for trigger node

## Common Issues
1. **Node not appearing**: Clear n8n cache (`rm -rf ~/.n8n/cache`)
2. **TypeScript errors**: Run `npm run build` to see compilation errors
3. **Webhook issues**: Use `n8n start --tunnel` for local webhook testing

## Security Considerations
- API tokens stored securely in n8n credentials system
- All requests use HTTPS
- Webhook signatures verified using HMAC-SHA256
- No hardcoded credentials in codebase

## Future Enhancements
- Additional resource types support
- Batch operations
- Advanced filtering options
- Custom field mapping
- Rate limit handling improvements