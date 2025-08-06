# GitHub Setup Guide for HACS Distribution

This guide will help you set up your GitHub repository to distribute the AI Configuration Assistant via HACS.

## 🚀 Quick Setup Steps

### 1. Initialize Git Repository

```bash
# In your project directory
git init
git add .
git commit -m "Initial commit: AI Configuration Assistant v1.0.0"
```

### 2. Create GitHub Repository

1. Go to [GitHub.com](https://github.com) and create a new repository
2. Name it: `ai-config-assistant` (or your preferred name)
3. Description: "AI-powered configuration generator for Home Assistant"
4. Make it public (required for HACS)
5. Don't initialize with README (we already have one)

### 3. Link Local Repository to GitHub

```bash
# Replace 'yourusername' with your GitHub username
git remote add origin https://github.com/yourusername/ai-config-assistant.git
git branch -M main
git push -u origin main
```

### 4. Create Your First Release

#### Option A: Via GitHub Web Interface (Recommended)
1. Go to your repository on GitHub
2. Click "Releases" → "Create a new release"
3. Tag version: `v1.0.0`
4. Release title: `AI Configuration Assistant v1.0.0`
5. Description:
```markdown
## 🎉 Initial Release

### Features
- Natural language configuration generation
- Support for multiple LLM providers (OpenAI, Anthropic, Google, etc.)
- Live preview with real entity data
- Smart entity autocompletion
- Configuration validation
- Modern Home Assistant UI integration

### Supported Configuration Types
- Automations
- Scripts
- Scenes
- Dashboards
- Template sensors

### Requirements
- Home Assistant 2025.1+
- API key from supported LLM provider
```
6. Check "This is a pre-release" if you want to test first
7. Click "Publish release"

#### Option B: Via Command Line
```bash
# Create and push a tag
git tag -a v1.0.0 -m "AI Configuration Assistant v1.0.0"
git push origin v1.0.0

# Use GitHub CLI to create release (if you have gh installed)
gh release create v1.0.0 --title "AI Configuration Assistant v1.0.0" --notes "Initial release with AI-powered configuration generation"
```

### 5. Verify HACS Compatibility

Your repository should now have this structure:
```
ai-config-assistant/
├── .github/
│   ├── workflows/
│   │   ├── release.yml
│   │   └── validate.yml
│   ├── ISSUE_TEMPLATE/
│   │   ├── bug_report.yml
│   │   └── feature_request.yml
│   └── CODEOWNERS
├── custom_components/
│   └── ai_config_assistant/
│       ├── __init__.py
│       ├── manifest.json
│       ├── config_flow.py
│       └── [other integration files]
├── www/
│   └── ai-config-panel.js
├── hacs.json
├── info.md
├── README.md
├── LICENSE
├── VERSION
└── .gitignore
```

## 📦 HACS Integration Steps

### For End Users (After Repository is Set Up)

#### Method 1: Add as Custom Repository
1. Open HACS in Home Assistant
2. Go to "Integrations"
3. Click "..." menu → "Custom repositories"  
4. Add repository URL: `https://github.com/yourusername/ai-config-assistant`
5. Category: "Integration"
6. Click "Add"
7. Search for "AI Configuration Assistant"
8. Click "Download"

#### Method 2: Direct Install Button (Add to your README)
```markdown
[![Open your Home Assistant instance and open a repository inside the Home Assistant Community Store.](https://my.home-assistant.io/badges/hacs_repository.svg)](https://my.home-assistant.io/redirect/hacs_repository/?owner=yourusername&repository=ai-config-assistant&category=integration)
```

### For HACS Default Repository Inclusion (Optional)
To get included in HACS default repositories:

1. **Meet Requirements:**
   - Repository must be public
   - Must have proper releases with semantic versioning
   - Must have proper documentation
   - Must follow HACS quality requirements

2. **Submit to HACS:**
   - Go to [HACS Default Repository](https://github.com/hacs/default)
   - Create a pull request to add your repository
   - Follow their submission guidelines

## 🔧 Maintenance Workflow

### Creating New Releases

1. **Update VERSION file:**
```bash
echo "1.1.0" > VERSION
```

2. **Update manifest.json version:**
```json
{
  "version": "1.1.0",
  ...
}
```

3. **Commit changes:**
```bash
git add .
git commit -m "Release v1.1.0: Add new features"
git push
```

4. **Create new release:**
```bash
git tag -a v1.1.0 -m "Release v1.1.0"
git push origin v1.1.0
```

5. **GitHub Actions will automatically:**
   - Create a release ZIP file
   - Attach it to the release
   - Make it available for HACS

### Updating Documentation

- Update README.md for major changes
- Update info.md for HACS display changes  
- Keep GITHUB_SETUP.md current for contributors

## 🛡️ Quality Checklist

Before each release, ensure:

- [ ] All Python files compile without errors
- [ ] Manifest.json is valid JSON
- [ ] Version numbers are consistent
- [ ] README.md is up to date
- [ ] info.md describes current features
- [ ] GitHub Actions validate successfully
- [ ] Release notes are descriptive
- [ ] License is included

## 🎯 Success Metrics

After setup, monitor:

- **GitHub Stars:** Indicates community interest
- **Issues/PRs:** Community engagement and feedback
- **HACS Downloads:** Usage statistics
- **Release Downloads:** Version adoption rates

## 🔍 Troubleshooting

### Common Issues:

**HACS doesn't find the repository:**
- Ensure repository is public
- Check hacs.json format
- Verify GitHub URL is correct
- Make sure you have at least one release

**Integration doesn't install:**
- Check manifest.json syntax
- Verify all required files are present
- Check Home Assistant logs for errors
- Ensure dependencies are listed correctly

**Updates don't appear:**
- Version in manifest.json must match git tag
- Create proper releases (not just tags)
- HACS may take time to detect new releases

## 📚 Resources

- [HACS Documentation](https://hacs.xyz/)
- [Home Assistant Integration Development](https://developers.home-assistant.io/docs/creating_integration_manifest/)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Semantic Versioning](https://semver.org/)

Your AI Configuration Assistant is now ready for HACS distribution! 🎉