#!/usr/bin/env node

/**
 * Build Script for IMI Student Dashboard
 *
 * This script combines all individual page files from the /pages directory
 * into a single index.html file for production use.
 *
 * Usage: node build.js
 */

const fs = require('fs');
const path = require('path');

// Configuration
const PAGES_DIR = './pages';
const TEMPLATE_FILE = './index-template.html';
const OUTPUT_FILE = './index.html';
const BUILD_MARKER_START = '<!-- BUILD:PAGES:START -->';
const BUILD_MARKER_END = '<!-- BUILD:PAGES:END -->';

// Color codes for console output
const colors = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    red: '\x1b[31m'
};

// Define the order of pages (login first, dashboard second, then alphabetical)
const PAGE_ORDER = [
    'login.html',
    'dashboard.html',
    'blueprint.html',
    'ideas.html',
    'projects.html',
    'companies.html',
    'network.html',
    'resources.html',
    'tracking.html',
    'profile.html',
    'notifications.html'
];

function log(message, color = 'reset') {
    console.log(`${colors[color]}${message}${colors.reset}`);
}

function logStep(step, message) {
    console.log(`${colors.bright}${colors.blue}[${step}]${colors.reset} ${message}`);
}

async function build() {
    try {
        log('\n🔨 Starting build process...', 'bright');

        // Step 1: Check if template file exists
        logStep('1/5', 'Checking template file...');
        if (!fs.existsSync(TEMPLATE_FILE)) {
            throw new Error(`Template file not found: ${TEMPLATE_FILE}`);
        }
        log(`  ✓ Template file found: ${TEMPLATE_FILE}`, 'green');

        // Step 2: Check if pages directory exists
        logStep('2/5', 'Checking pages directory...');
        if (!fs.existsSync(PAGES_DIR)) {
            throw new Error(`Pages directory not found: ${PAGES_DIR}`);
        }

        // Step 3: Read all page files
        logStep('3/5', 'Reading page files...');
        const pageFiles = fs.readdirSync(PAGES_DIR)
            .filter(file => file.endsWith('.html'))
            .sort((a, b) => {
                // Sort according to PAGE_ORDER
                const indexA = PAGE_ORDER.indexOf(a);
                const indexB = PAGE_ORDER.indexOf(b);
                if (indexA === -1 && indexB === -1) return a.localeCompare(b);
                if (indexA === -1) return 1;
                if (indexB === -1) return -1;
                return indexA - indexB;
            });

        if (pageFiles.length === 0) {
            throw new Error('No HTML files found in pages directory');
        }

        log(`  ✓ Found ${pageFiles.length} page files:`, 'green');
        pageFiles.forEach(file => {
            const size = fs.statSync(path.join(PAGES_DIR, file)).size;
            log(`    • ${file} (${formatBytes(size)})`, 'blue');
        });

        // Step 4: Read and combine page contents
        logStep('4/5', 'Combining page contents...');
        let combinedPages = '';
        let totalSize = 0;

        for (const file of pageFiles) {
            const filePath = path.join(PAGES_DIR, file);
            let content = fs.readFileSync(filePath, 'utf8');

            // Clean up the content (remove extra whitespace at start/end)
            content = content.trim();

            // Add a comment to show where each page starts (helpful for debugging)
            combinedPages += `\n        <!-- Page: ${file} -->\n`;
            combinedPages += '        ' + content.split('\n').join('\n        ');
            combinedPages += '\n\n';

            totalSize += content.length;

            // No page should be active by default - auth.js or main.js will set the correct one
            // (Previously this set dashboard as active, but that caused both login and dashboard to be active)
        }

        log(`  ✓ Combined ${formatBytes(totalSize)} of page content`, 'green');

        // Step 5: Read template and insert pages
        logStep('5/5', 'Building final index.html...');
        let template = fs.readFileSync(TEMPLATE_FILE, 'utf8');

        // Find the build markers
        const startIndex = template.indexOf(BUILD_MARKER_START);
        const endIndex = template.indexOf(BUILD_MARKER_END);

        if (startIndex === -1 || endIndex === -1) {
            throw new Error('Build markers not found in template file');
        }

        // Replace the content between markers
        const beforeMarker = template.substring(0, startIndex + BUILD_MARKER_START.length);
        const afterMarker = template.substring(endIndex);

        const finalContent = beforeMarker + combinedPages + '        ' + afterMarker;

        // Write the final file
        fs.writeFileSync(OUTPUT_FILE, finalContent);

        const outputSize = fs.statSync(OUTPUT_FILE).size;
        log(`  ✓ Written to ${OUTPUT_FILE} (${formatBytes(outputSize)})`, 'green');

        // Success message
        console.log('');
        log('✨ Build completed successfully!', 'bright');
        log(`   Output: ${OUTPUT_FILE}`, 'green');
        log(`   Size: ${formatBytes(outputSize)}`, 'green');
        log(`   Pages included: ${pageFiles.length}`, 'green');
        console.log('');
        log('📌 Next steps:', 'yellow');
        log('   1. Open index.html in your browser', 'yellow');
        log('   2. Test all navigation links', 'yellow');
        log('   3. Commit the generated index.html if everything works', 'yellow');
        console.log('');

    } catch (error) {
        console.log('');
        log(`❌ Build failed: ${error.message}`, 'red');
        console.log('');
        process.exit(1);
    }
}

function formatBytes(bytes) {
    if (bytes < 1024) return bytes + ' bytes';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

// Run the build
build();