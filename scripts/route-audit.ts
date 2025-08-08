// Script to audit routes and components in a Next.js app (app router).
import fs from 'fs';
import path from 'path';

function findFiles(dir: string, match: RegExp, list: string[] = []) {
  for (const file of fs.readdirSync(dir)) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      findFiles(fullPath, match, list);
    } else {
      if (match.test(fullPath)) {
        list.push(fullPath);
      }
    }
  }
  return list;
}

const projectRoot = process.cwd();
const appDir = path.join(projectRoot, 'app');
const apiDir = path.join(projectRoot, 'app', 'api');
const compDir = path.join(projectRoot, 'components');

const routes = fs.existsSync(appDir) ? findFiles(appDir, /\/page\.(tsx?|jsx?|mdx)$/) : [];
const apiRoutes = fs.existsSync(apiDir) ? findFiles(apiDir, /\/route\.(ts|js)$/) : [];
const components = fs.existsSync(compDir) ? findFiles(compDir, /\.(tsx?|jsx?)$/) : [];

console.log('Routes:');
routes.forEach((r) => console.log(' -', path.relative(projectRoot, r)));
console.log('API Routes:');
apiRoutes.forEach((r) => console.log(' -', path.relative(projectRoot, r)));
console.log('Components:');
components.forEach((c) => console.log(' -', path.relative(projectRoot, c)));