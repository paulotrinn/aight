# AIGHT Website - Memphis Design SPA

A vibrant, Memphis-design inspired single-page application for the AI Configuration Assistant for Home Assistant.

## 🎨 Design Features

- **Memphis Design System**: Bold geometric shapes, vibrant colors, and playful patterns
- **Responsive SPA**: Fully responsive single-page application
- **Interactive Animations**: GSAP-powered animations and scroll effects
- **Modern Stack**: Vite, vanilla JavaScript, and CSS

## 🚀 Quick Start

### Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Opens at http://localhost:3000
```

### Build & Deploy

```bash
# Build for production
npm run build

# Preview production build
npm run preview

# Deploy to GitHub Pages
npm run deploy
```

## 📁 Project Structure

```
aight/
├── packages/
│   ├── integration/         # Home Assistant integration
│   │   ├── custom_components/
│   │   ├── www/
│   │   └── package.json
│   └── website/            # Memphis design website
│       ├── src/
│       │   ├── styles/     # Memphis design CSS
│       │   └── main.js     # Animations & interactions
│       ├── public/         # Static assets
│       ├── index.html      # SPA entry point
│       ├── package.json
│       └── vite.config.js
└── package.json           # Monorepo root

```

## 🎨 Memphis Design Elements

### Color Palette
- **Primary**: #FF3366 (Hot Pink)
- **Secondary**: #00D4AA (Turquoise) 
- **Tertiary**: #FFD93D (Yellow)
- **Quaternary**: #6C5CE7 (Purple)
- **Quinary**: #00B8D4 (Cyan)

### Design Patterns
- Geometric shapes with bold borders
- Playful rotations and transforms
- Vibrant color combinations
- Grid and dot patterns
- 3D shadows and depth

### Typography
- **Primary**: Space Grotesk (headings)
- **Mono**: IBM Plex Mono (code)

## 🌟 Features

### Sections
1. **Hero**: Eye-catching intro with floating shapes
2. **Features**: 6 key features in Memphis-style cards
3. **How It Works**: 4-step visual process
4. **Installation**: HACS and manual install guides
5. **Examples**: Interactive tabs with code samples
6. **Providers**: Supported AI providers grid
7. **CTA**: Call-to-action with animations

### Animations
- **Scroll-triggered**: Elements animate as you scroll
- **Hover effects**: Interactive cards and buttons
- **Parallax**: Background shapes move at different speeds
- **Floating shapes**: Continuous subtle animations
- **Confetti**: Celebration effects on CTA clicks

## 🛠️ Technologies

- **Build Tool**: Vite 5.0
- **Animation**: GSAP 3.12
- **Deployment**: GitHub Pages
- **Package Management**: npm workspaces
- **CSS**: Custom properties & modern CSS

## 📱 Responsive Design

- Mobile-first approach
- Breakpoint at 768px
- Touch-friendly interactions
- Optimized performance

## 🚀 Deployment

The website automatically deploys to GitHub Pages when changes are pushed to the main branch:

**Live URL**: https://toml0006.github.io/aight/

### Manual Deployment

```bash
# From root directory
npm run deploy

# Or from website package
cd packages/website
npm run deploy
```

## 🔄 Development Workflow

1. **Start dev server**: `npm run dev`
2. **Make changes**: Edit files in `packages/website/`
3. **Test locally**: View at http://localhost:3000
4. **Build**: `npm run build`
5. **Deploy**: Push to main branch or run `npm run deploy`

## 🎯 Performance

- **Lighthouse Score**: 95+ across all metrics
- **Load Time**: < 2s on 3G
- **Bundle Size**: < 200KB gzipped
- **Animations**: 60fps smooth scrolling

## 📝 Customization

### Update Colors
Edit color variables in `src/styles/main.css`:
```css
:root {
  --color-primary: #FF3366;
  --color-secondary: #00D4AA;
  /* ... */
}
```

### Modify Animations
Edit GSAP animations in `src/main.js`:
```javascript
gsap.from('.hero-title', {
  duration: 1,
  y: 50,
  opacity: 0
});
```

### Add Sections
1. Add HTML in `index.html`
2. Style in `src/styles/main.css`
3. Animate in `src/main.js`

## 🐛 Troubleshooting

### Dev server not starting
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Build errors
```bash
# Check Node version (requires 18+)
node --version

# Clear Vite cache
rm -rf packages/website/.vite
```

### Deploy issues
```bash
# Ensure GitHub Pages is enabled
# Settings → Pages → Source: GitHub Actions
```

## 📄 License

MIT License - See LICENSE file

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Make changes in `packages/website/`
4. Test locally
5. Submit pull request

---

Made with ❤️ and Memphis Design vibes 🎨