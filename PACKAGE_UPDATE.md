# Package Update Guide

This guide provides step-by-step instructions for updating and publishing the n8n-nodes-serb2b package.

## 📦 Update npm Package - Step by Step

### 1. **Make your code changes**
```bash
# Edit your files as needed
# For example: fix bugs, add features, update documentation
```

### 2. **Build and test**
```bash
npm run build
npm run lint
```

### 3. **Commit your changes**
```bash
git add .
git commit -m "Your descriptive commit message"
```

### 4. **Update version**
```bash
# For bug fixes (0.1.1 → 0.1.2)
npm version patch

# For new features (0.1.1 → 0.2.0)
npm version minor

# For breaking changes (0.1.1 → 1.0.0)
npm version major
```

### 5. **Build final version**
```bash
npm run build
```

### 6. **Publish to npm**
```bash
npm publish --access public
```

### 7. **Push to GitHub**
```bash
git push origin main --tags
```

## 🔄 Complete Example

```bash
# 1. Make changes to your code

# 2. Build and test
npm run build
npm run lint

# 3. Commit changes
git add .
git commit -m "Fix webhook validation issue"

# 4. Bump version
npm version patch

# 5. Build again
npm run build

# 6. Publish
npm publish --access public

# 7. Push to GitHub
git push origin main --tags
```

## 📝 Version Guidelines

- **Patch** (0.0.X): Bug fixes, minor updates, documentation changes
- **Minor** (0.X.0): New features, non-breaking changes
- **Major** (X.0.0): Breaking changes, major refactoring

## 🚀 Quick Update (One-liner)

For simple updates after committing your changes:
```bash
npm version patch && npm run build && npm publish --access public && git push origin main --tags
```

## ⚠️ Important Notes

1. Always test your changes before publishing
2. Ensure all tests pass and linting is clean
3. Update documentation if adding new features
4. Check that the build completes without errors
5. Verify the package works in a test n8n instance before publishing

## 🔍 Verify Published Package

After publishing, verify your package:
```bash
# Check npm registry
npm view n8n-nodes-serb2b

# Install in a test project
npm install n8n-nodes-serb2b@latest
```