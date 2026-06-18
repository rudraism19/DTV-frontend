const https = require('https');
require('dotenv').config();

const deployUrl = process.env.RENDER_DEPLOY_HOOK || '';

console.log('Triggering Render deployment...');

https.get(deployUrl, (res) => {
    console.log('Deploy Triggered! Status:', res.statusCode);
}).on('error', (err) => {
    console.error('Error triggering deploy:', err.message);
});
