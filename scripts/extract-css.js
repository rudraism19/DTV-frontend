const fs = require('fs');
const path = require('path');

const indexPath = path.join(__dirname, '..', 'public', 'index.html');
const cssPath = path.join(__dirname, '..', 'public', 'css', 'main.css');

if (!fs.existsSync(path.dirname(cssPath))) {
    fs.mkdirSync(path.dirname(cssPath), { recursive: true });
}

let content = fs.readFileSync(indexPath, 'utf8');

const styleStart = content.indexOf('<style>');
const styleEnd = content.indexOf('</style>', styleStart) + 8;

if (styleStart !== -1 && styleEnd !== -1) {
    let cssContent = content.substring(styleStart + 7, styleEnd - 8).trim();
    fs.writeFileSync(cssPath, cssContent);
    
    // Replace the <style> block with <link>
    const newContent = content.substring(0, styleStart) + 
                       '<link rel="stylesheet" href="/css/main.css">\n' + 
                       content.substring(styleEnd);
    
    fs.writeFileSync(indexPath, newContent);
    console.log('CSS extracted to public/css/main.css');
} else {
    console.log('Could not find <style> tags');
}
