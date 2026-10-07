import { execSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const distPath = path.join(__dirname, 'client', 'dist');

console.log('Deploying to gh-pages branch...');
try {
  execSync('git init', { cwd: distPath, stdio: 'inherit' });
  execSync('git add -A', { cwd: distPath, stdio: 'inherit' });
  execSync('git commit -m "Deploy interactive MAG site with tactile press to gh-pages"', { cwd: distPath, stdio: 'inherit' });
  execSync('git branch -M gh-pages', { cwd: distPath, stdio: 'inherit' });
  try {
    execSync('git remote add origin https://github.com/dirana21/mag-plant.git', { cwd: distPath, stdio: 'inherit' });
  } catch (_) {
    execSync('git remote set-url origin https://github.com/dirana21/mag-plant.git', { cwd: distPath, stdio: 'inherit' });
  }
  execSync('git push -f origin gh-pages', { cwd: distPath, stdio: 'inherit' });
  console.log('✅ DEPLOYED TO mag-plant gh-pages SUCCESSFULLY!');

  try {
    execSync('git remote set-url origin https://github.com/dirana21/mag-plant-site.git', { cwd: distPath, stdio: 'inherit' });
    execSync('git push -f origin gh-pages', { cwd: distPath, stdio: 'inherit' });
    console.log('✅ DEPLOYED TO mag-plant-site gh-pages SUCCESSFULLY!');
  } catch (e) {
    console.log('Note: mag-plant-site push skipped or not configured:', e.message);
  }
} catch (err) {
  console.error('Error deploying:', err.message);
}
