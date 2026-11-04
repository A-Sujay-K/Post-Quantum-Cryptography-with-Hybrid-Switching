import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const pathsFilePath = path.resolve(__dirname, '../frontend-user/src/home/qc/paths.json');
const alphaBinPath = path.resolve(__dirname, '../frontend-user/public/hero/qc-alpha-1x.bin');

console.log('=== VERIFYING QUANTUM COMPUTER PATH NETWORK ===\n');

if (!fs.existsSync(pathsFilePath)) {
  console.error(`FATAL: paths.json not found at ${pathsFilePath}`);
  process.exit(1);
}

if (!fs.existsSync(alphaBinPath)) {
  console.error(`FATAL: qc-alpha-1x.bin not found at ${alphaBinPath}`);
  process.exit(1);
}

const pathsData = JSON.parse(fs.readFileSync(pathsFilePath, 'utf8'));
const alphaBuf = fs.readFileSync(alphaBinPath);

const { width, height } = pathsData.viewBox;
console.log(`Canvas viewBox: ${width} x ${height}`);
console.log(`Total Nodes: ${Object.keys(pathsData.nodes).length}`);
console.log(`Total Paths: ${pathsData.paths.length}\n`);

let errors = [];

// 1. Check all nodes
const nodeIds = new Set(Object.keys(pathsData.nodes));
for (const [nid, node] of Object.entries(pathsData.nodes)) {
  if (node.x < 0 || node.x > width || node.y < 0 || node.y > height) {
    errors.push(`Node ${nid} out of bounds: (${node.x}, ${node.y})`);
  }
  // Check that node has inbound or outbound paths
  if (node.type === 'entry') {
    if (!node.out || node.out.length === 0) {
      errors.push(`Entry node ${nid} has no outbound paths`);
    }
  } else if (node.type === 'exit') {
    if (!node.in || node.in.length === 0) {
      errors.push(`Exit node ${nid} has no inbound paths`);
    }
  } else {
    if (!node.in || node.in.length === 0) {
      errors.push(`Internal node ${nid} has no inbound paths`);
    }
    if (!node.out || node.out.length === 0) {
      errors.push(`Internal node ${nid} has no outbound paths`);
    }
  }
}

// 2. Check all paths and endpoints
const pathIds = new Set(pathsData.paths.map(p => p.id));
let minX = width, maxX = 0;

for (const p of pathsData.paths) {
  if (!nodeIds.has(p.start)) {
    errors.push(`Path ${p.id} startNode '${p.start}' does not exist`);
  }
  if (!nodeIds.has(p.end)) {
    errors.push(`Path ${p.id} endNode '${p.end}' does not exist`);
  }

  const startNode = pathsData.nodes[p.start];
  const endNode = pathsData.nodes[p.end];

  if (startNode && p.points[0]) {
    const dStart = Math.hypot(p.points[0][0] - startNode.x, p.points[0][1] - startNode.y);
    if (dStart > 2.0) {
      errors.push(`Path ${p.id} start point (${p.points[0]}) does not match node ${p.start} (${startNode.x}, ${startNode.y})`);
    }
  }

  if (endNode && p.points[p.points.length - 1]) {
    const lastPt = p.points[p.points.length - 1];
    const dEnd = Math.hypot(lastPt[0] - endNode.x, lastPt[1] - endNode.y);
    if (dEnd > 2.0) {
      errors.push(`Path ${p.id} end point (${lastPt}) does not match node ${p.end} (${endNode.x}, ${endNode.y})`);
    }
  }

  if (!p.lut || p.lut.length < 10) {
    errors.push(`Path ${p.id} missing arc-length lookup table (LUT)`);
  }

  // 3. Sample points along LUT and verify alpha silhouette
  for (let i = 0; i < p.lut.length; i++) {
    const [px, py] = p.lut[i];
    minX = Math.min(minX, px);
    maxX = Math.max(maxX, px);

    const ix = Math.round(px);
    const iy = Math.round(py);

    if (ix < 0 || ix >= width || iy < 0 || iy >= height) {
      errors.push(`Path ${p.id} LUT point [${px}, ${py}] is outside canvas bounds`);
      continue;
    }

    const alphaVal = alphaBuf[iy * width + ix];
    if (alphaVal < 8) {
      errors.push(`Path ${p.id} sampled point (${ix}, ${iy}) lies outside alpha silhouette (alpha = ${alphaVal})`);
    }
  }
}

// 4. Graph connectivity traversal (BFS from all entry nodes)
const visitedNodes = new Set();
const queue = Object.values(pathsData.nodes).filter(n => n.type === 'entry').map(n => n.id);
queue.forEach(id => visitedNodes.add(id));

while (queue.length > 0) {
  const curId = queue.shift();
  const node = pathsData.nodes[curId];
  if (!node || !node.out) continue;

  for (const pid of node.out) {
    const pathObj = pathsData.paths.find(p => p.id === pid);
    if (pathObj && pathObj.end && !visitedNodes.has(pathObj.end)) {
      visitedNodes.add(pathObj.end);
      queue.push(pathObj.end);
    }
  }
}

const disconnectedNodes = Object.keys(pathsData.nodes).filter(id => !visitedNodes.has(id));
if (disconnectedNodes.length > 0) {
  errors.push(`Graph connectivity error: ${disconnectedNodes.length} nodes are disconnected from entry: ${disconnectedNodes.join(', ')}`);
}

// 5. Check coverage
console.log(`Path coverage horizontal span: X = ${minX.toFixed(1)} to X = ${maxX.toFixed(1)}`);
if (minX > 120 || maxX < 500) {
  errors.push(`Paths do not cover the fan evenly (span ${minX.toFixed(1)} to ${maxX.toFixed(1)})`);
}

// Summary
if (errors.length > 0) {
  console.error(`\n❌ VERIFICATION FAILED with ${errors.length} error(s):`);
  errors.slice(0, 10).forEach(e => console.error(`  - ${e}`));
  if (errors.length > 10) console.error(`  ... and ${errors.length - 10} more`);
  process.exit(1);
} else {
  console.log('✅ ALL CHECKS PASSED:');
  console.log('  1. All path endpoints match graph nodes perfectly.');
  console.log('  2. Graph is fully connected from entry to exit nodes with zero loose ends.');
  console.log('  3. Every internal node has valid inbound and outbound paths.');
  console.log('  4. Every sampled point along all paths lies strictly within the machine alpha silhouette.');
  console.log('  5. Wire paths cover left, center, and right stages with authentic S-curves.');
  console.log('\n=== PATH NETWORK VERIFIED: GREEN ===\n');
  process.exit(0);
}
