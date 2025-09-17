# Build Guide - IMI Student Dashboard

## Overview

This project uses a build system to combine modular page files into a single `index.html` for production use. This allows for better code organization while maintaining a simple deployment process.

## Project Structure

```
Student-Dashboard/
├── pages/                    # Individual page modules (edit these)
│   ├── dashboard.html
│   ├── innovation.html
│   ├── ideas.html
│   ├── projects.html
│   ├── companies.html
│   ├── network.html
│   ├── resources.html
│   ├── tracking.html
│   ├── profile.html
│   └── notifications.html
├── index-template.html       # Template with navigation (don't edit)
├── build.js                  # Build script
├── index.html               # Generated output (don't edit manually)
└── package.json             # NPM scripts configuration
```

## Development Workflow

### 1. Making Changes

Always edit the individual page files in the `/pages/` directory:
```bash
# Example: Edit the dashboard
code pages/dashboard.html
```

**⚠️ Never edit `index.html` directly** - it will be overwritten by the build process!

### 2. Building the Site

After making changes, run the build command:
```bash
npm run build
```

This will:
- Read all page files from `/pages/`
- Combine them with the template
- Generate a new `index.html`

### 3. Testing

Open `index.html` directly in your browser:
```bash
# On Mac
open index.html

# On Windows
start index.html

# Or use the included server
npm run serve
```

## Available Commands

| Command | Description |
|---------|------------|
| `npm run build` | Builds the index.html from page files |
| `npm run serve` | Starts a local server on port 8080 |
| `npm run dev` | Builds and then starts the server |

## Build Process Details

The build script (`build.js`) performs these steps:

1. **Reads Template**: Loads `index-template.html` as the base structure
2. **Collects Pages**: Reads all `.html` files from `/pages/` directory
3. **Orders Pages**: Arranges pages with dashboard first, then alphabetically
4. **Combines Content**: Inserts all page content between build markers
5. **Sets Active Page**: Makes dashboard active by default
6. **Generates Output**: Writes the complete `index.html` file

## Adding New Pages

To add a new page to the dashboard:

1. Create a new file in `/pages/`:
```html
<!-- pages/newpage.html -->
<div id="newpage-page" class="page-section">
    <h2>New Page Title</h2>
    <!-- Your page content here -->
</div>
```

2. Add navigation link in `index-template.html`:
```html
<li><a href="#newpage" id="nav-newpage">New Page</a></li>
```

3. Run the build:
```bash
npm run build
```

4. Add page initialization in relevant JS files if needed

## Team Collaboration

### For Developers
- Each developer can work on separate page files without conflicts
- Use git to track changes to individual page files
- Run `npm run build` before committing to ensure `index.html` is updated

### For Designers
- Edit CSS files directly - they don't require building
- Page structure changes should be made in `/pages/` files

### For Content Editors
- Edit text content in the appropriate `/pages/` file
- Run `npm run build` to see changes
- No coding knowledge required for basic text updates

## Troubleshooting

### Changes not appearing?
- Make sure you ran `npm run build` after editing
- Hard refresh your browser (Ctrl+Shift+R or Cmd+Shift+R)
- Check the build output for any errors

### Build fails?
- Ensure Node.js is installed: `node --version`
- Check that all page files are valid HTML
- Verify `index-template.html` hasn't been corrupted

### Page not showing?
- Verify the page file exists in `/pages/`
- Check that the page has the correct ID format: `id="pagename-page"`
- Ensure navigation link uses correct href: `href="#pagename"`

## Best Practices

1. **Always build before testing**: Run `npm run build` after any changes
2. **Commit both source and output**: Commit both page files and generated `index.html`
3. **Use meaningful commit messages**: Indicate which pages were modified
4. **Test navigation**: After building, test all navigation links work
5. **Keep pages modular**: Each page should be self-contained

## Deployment

For production deployment, you only need:
- `index.html` (the built file)
- `/css/` directory
- `/js/` directory
- `/images/` or `/assets/` directories
- Any other static assets (logo.png, etc.)

The `/pages/` directory and build files are not needed in production.

## Version Control

```bash
# After making changes and building
git add pages/dashboard.html    # Add your source changes
git add index.html              # Add the built output
git commit -m "Updated dashboard layout"
git push
```

## Questions?

If you encounter any issues with the build process, check:
1. This guide
2. The console output from `npm run build`
3. Browser developer console for runtime errors