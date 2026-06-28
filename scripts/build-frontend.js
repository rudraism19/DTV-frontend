const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const publicDir = path.join(__dirname, '..', 'public');
const distDir = path.join(publicDir, 'dist');

// Ensure dist directory exists
if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir, { recursive: true });
}

// Clear old hashed files in dist
fs.readdirSync(distDir).forEach(file => {
    if (file.endsWith('.js') || file.endsWith('.css')) {
        fs.unlinkSync(path.join(distDir, file));
    }
});

function hashFile(filePath) {
    const content = fs.readFileSync(filePath);
    const hash = crypto.createHash('md5').update(content).digest('hex').slice(0, 8);
    return hash;
}

const assets = ['app.js', 'ux-engine.js', 'css/main.css', 'js/data/careers.js'];
const manifest = {};

assets.forEach(asset => {
    const originalPath = path.join(publicDir, asset);
    if (fs.existsSync(originalPath)) {
        const hash = hashFile(originalPath);
        const ext = path.extname(asset);
        const name = path.basename(asset, ext);
        const hashedName = `${name}.${hash}${ext}`;
        const destPath = path.join(distDir, hashedName);
        
        fs.copyFileSync(originalPath, destPath);
        manifest[asset] = `/dist/${hashedName}`;
        console.log(`Hashed: ${asset} -> ${hashedName}`);
    } else {
        console.warn(`Warning: Asset not found: ${asset}`);
    }
});

// Update index.html in both public and deploy-digital-twin/public
const indexPaths = [
    path.join(publicDir, 'index.html'),
    path.join(__dirname, '..', 'deploy-digital-twin', 'public', 'index.html')
];

indexPaths.forEach(indexPath => {
    if (fs.existsSync(indexPath)) {
        let indexHtml = fs.readFileSync(indexPath, 'utf8');
        
        // Replace script src tags
        // e.g. <script src="/app.js?v=7"></script> or <script src="/dist/app.xyz.js"></script>
        
        // For app.js
        indexHtml = indexHtml.replace(/src="\/app\.js(\?[^"]*)?"/g, `src="${manifest['app.js']}"`);
        indexHtml = indexHtml.replace(/src="\/dist\/app\.[a-f0-9]+\.js"/g, `src="${manifest['app.js']}"`);
        
        // For ux-engine.js
        indexHtml = indexHtml.replace(/src="\/ux-engine\.js(\?[^"]*)?"/g, `src="${manifest['ux-engine.js']}"`);
        indexHtml = indexHtml.replace(/src="\/dist\/ux-engine\.[a-f0-9]+\.js"/g, `src="${manifest['ux-engine.js']}"`);
        
        // For main.css
        if (manifest['css/main.css']) {
            indexHtml = indexHtml.replace(/href="\/css\/main\.css(\?[^"]*)?"/g, `href="${manifest['css/main.css']}"`);
            indexHtml = indexHtml.replace(/href="\/dist\/main\.[a-f0-9]+\.css"/g, `href="${manifest['css/main.css']}"`);
        }
        
        // For careers.js
        if (manifest['js/data/careers.js']) {
            indexHtml = indexHtml.replace(/src="\/js\/data\/careers\.js(\?[^"]*)?"/g, `src="${manifest['js/data/careers.js']}"`);
            indexHtml = indexHtml.replace(/src="\/dist\/careers\.[a-f0-9]+\.js"/g, `src="${manifest['js/data/careers.js']}"`);
        }
        
        fs.writeFileSync(indexPath, indexHtml);
        console.log(`Updated ${indexPath} with hashed assets.`);
    }
});

// Generate version hash for deployment checking
const buildVersion = crypto.randomBytes(8).toString('hex');
const versionPath = path.join(__dirname, '..', 'build-version.json');
fs.writeFileSync(versionPath, JSON.stringify({ version: buildVersion }));
console.log(`Build version generated: ${buildVersion}`);

// Update Service Worker Cache Name
const swPath = path.join(publicDir, 'service-worker.js');
if (fs.existsSync(swPath)) {
    let swContent = fs.readFileSync(swPath, 'utf8');
    swContent = swContent.replace(/const CACHE_NAME = '[^']+';/, `const CACHE_NAME = 'app-cache-${buildVersion}';`);
    fs.writeFileSync(swPath, swContent);
    console.log('Updated service-worker.js with new CACHE_NAME.');
}

