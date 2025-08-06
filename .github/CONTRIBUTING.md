# Contributing to AI Configuration Assistant

Thank you for considering contributing to AI Configuration Assistant! This project is open source and welcomes contributions from the community.

## Project Governance

This project is maintained by @toml0006 who has sole authority over releases and major architectural decisions. All contributions are welcome, but final approval for merging into the main branch rests with the maintainer.

## How to Contribute

### 1. Issues and Bug Reports

- **Bug Reports**: Use the [GitHub Issues](https://github.com/toml0006/aight/issues) to report bugs
- **Feature Requests**: Submit feature ideas as GitHub Issues with the "enhancement" label
- **Questions**: Use [GitHub Discussions](https://github.com/toml0006/aight/discussions) for questions

### 2. Code Contributions

1. **Fork the repository** to your GitHub account
2. **Create a feature branch** from `main`: `git checkout -b feature/your-feature-name`
3. **Make your changes** following the coding standards below
4. **Test thoroughly** - ensure your changes don't break existing functionality
5. **Submit a Pull Request** to the `main` branch

### 3. Pull Request Process

All Pull Requests will be reviewed by @toml0006. Please:

- **Describe your changes** clearly in the PR description
- **Reference any related issues** using `Fixes #123` or `Closes #123`
- **Include tests** if adding new functionality
- **Update documentation** if needed
- **Ensure CI passes** (if we have CI set up)

## Development Standards

### Code Style

- **Python**: Follow PEP 8 style guide
- **JavaScript**: Use modern ES6+ syntax, follow Home Assistant frontend patterns
- **Comments**: Document complex logic and Home Assistant integration points
- **Commit Messages**: Use clear, descriptive commit messages

### Testing

- Test your changes with different Home Assistant versions if possible
- Test with different LLM providers
- Verify the UI works on mobile devices
- Test error scenarios and edge cases

### Home Assistant Integration

- Follow Home Assistant development best practices
- Use appropriate service patterns for API calls
- Ensure compatibility with Home Assistant's async architecture
- Test integration loading and configuration flow

## Project Structure

```
/
├── custom_components/ai_config_assistant/  # Main integration code
│   ├── __init__.py                        # Integration setup
│   ├── config_flow.py                     # Configuration UI
│   ├── services.py                        # Core AI services
│   └── www/                               # Frontend assets
├── packages/integration/                   # Packaged version
└── .github/                              # GitHub templates and workflows
```

## Release Process

Releases are managed exclusively by @toml0006:

1. Version numbers follow semantic versioning (x.y.z)
2. Releases are tagged and published through GitHub Releases
3. The integration is packaged and distributed via HACS

## Code of Conduct

- **Be respectful** and inclusive in all interactions
- **Focus on the code** and technical aspects
- **Help newcomers** and answer questions patiently
- **Credit contributions** appropriately

## Questions?

If you have questions about contributing, feel free to:

- Open a [Discussion](https://github.com/toml0006/aight/discussions)
- Comment on relevant issues
- Reach out to @toml0006 through GitHub

We appreciate your interest in making AI Configuration Assistant better for everyone!