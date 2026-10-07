import { execSync } from 'child_process';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const distPath = path.join(__dirname, 'client', 'dist');

console.log('Deploying the ONE official MAG Plant site to gh-pages branch...');
try {
  // 1. Deploy the full interactive MAG Plant site to the primary mag-plant repository
  execSync('git init', { cwd: distPath, stdio: 'inherit' });
  execSync('git add -A', { cwd: distPath, stdio: 'inherit' });
  execSync('git commit -m "Deploy official MAG plant site with CMS to gh-pages"', { cwd: distPath, stdio: 'inherit' });
  execSync('git branch -M gh-pages', { cwd: distPath, stdio: 'inherit' });
  try {
    execSync('git remote add origin https://github.com/dirana21/mag-plant.git', { cwd: distPath, stdio: 'inherit' });
  } catch (_) {
    execSync('git remote set-url origin https://github.com/dirana21/mag-plant.git', { cwd: distPath, stdio: 'inherit' });
  }
  execSync('git push -f origin gh-pages', { cwd: distPath, stdio: 'inherit' });
  console.log('✅ DEPLOYED SINGLE OFFICIAL SITE TO mag-plant gh-pages SUCCESSFULLY!');

  // 2. Set up permanent auto-redirect on secondary repo (mag-plant-site) so only 1 active site remains
  try {
    const redirectDir = path.join(__dirname, '.temp-redirect');
    if (!fs.existsSync(redirectDir)) fs.mkdirSync(redirectDir, { recursive: true });
    const redirectHtml = `<!DOCTYPE html>
<html lang="uk">
<head>
  <meta charset="utf-8">
  <title>Перенаправлення на офіційний сайт заводу MAG...</title>
  <meta http-equiv="refresh" content="0; url=https://dirana21.github.io/mag-plant/">
  <script>
    window.location.replace("https://dirana21.github.io/mag-plant/" + window.location.hash);
  </script>
</head>
<body style="background:#0b0f17;color:#fff;font-family:sans-serif;text-align:center;padding-top:20vh;">
  <h2>Завод MAG</h2>
  <p>Перенаправлення на єдиний офіційний сайт заводу: <a href="https://dirana21.github.io/mag-plant/" style="color:#10b981;font-weight:bold;">https://dirana21.github.io/mag-plant/</a></p>
</body>
</html>`;
    fs.writeFileSync(path.join(redirectDir, 'index.html'), redirectHtml);
    fs.writeFileSync(path.join(redirectDir, '404.html'), redirectHtml);

    execSync('git init', { cwd: redirectDir, stdio: 'inherit' });
    execSync('git add -A', { cwd: redirectDir, stdio: 'inherit' });
    execSync('git commit -m "Redirect to official MAG site"', { cwd: redirectDir, stdio: 'inherit' });
    execSync('git branch -M gh-pages', { cwd: redirectDir, stdio: 'inherit' });
    try {
      execSync('git remote add origin https://github.com/dirana21/mag-plant-site.git', { cwd: redirectDir, stdio: 'inherit' });
    } catch (_) {
      execSync('git remote set-url origin https://github.com/dirana21/mag-plant-site.git', { cwd: redirectDir, stdio: 'inherit' });
    }
    execSync('git push -f origin gh-pages', { cwd: redirectDir, stdio: 'inherit' });
    console.log('✅ Secondary mag-plant-site configured to redirect to the official site!');
  } catch (e) {
    console.log('Note: mag-plant-site redirect push:', e.message);
  }
} catch (err) {
  console.error('Error deploying:', err.message);
}
