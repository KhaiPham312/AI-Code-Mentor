import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

// Global Developer Tech Nodes (Lat, Lon, City Name)
const TECH_HUBS = [
  { name: 'Hanoi', lat: 21.0285, lon: 105.8542 },
  { name: 'Tokyo', lat: 35.6762, lon: 139.6503 },
  { name: 'Singapore', lat: 1.3521, lon: 103.8198 },
  { name: 'Bengaluru', lat: 12.9716, lon: 77.5946 },
  { name: 'London', lat: 51.5074, lon: -0.1278 },
  { name: 'Berlin', lat: 52.52, lon: 13.405 },
  { name: 'Silicon Valley', lat: 37.3861, lon: -122.0839 },
  { name: 'New York', lat: 40.7128, lon: -74.006 },
  { name: 'Seattle', lat: 47.6062, lon: -122.3321 },
  { name: 'Sydney', lat: -33.8688, lon: 151.2093 },
  { name: 'Sao Paulo', lat: -23.5505, lon: -46.6333 },
];

// Tech connections between hubs (indices in TECH_HUBS)
const HUB_CONNECTIONS: [number, number][] = [
  [0, 2], // Hanoi <-> Singapore
  [0, 1], // Hanoi <-> Tokyo
  [1, 6], // Tokyo <-> Silicon Valley
  [6, 7], // Silicon Valley <-> New York
  [6, 8], // Silicon Valley <-> Seattle
  [7, 4], // New York <-> London
  [4, 5], // London <-> Berlin
  [4, 3], // London <-> Bengaluru
  [3, 0], // Bengaluru <-> Hanoi
  [2, 9], // Singapore <-> Sydney
];

// Convert geographic coordinates (Lat, Lon) to 3D Cartesian Vector3
function latLonToVector3(lat: number, lon: number, radius: number): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);
  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);
  return new THREE.Vector3(x, y, z);
}

// =========================================================================
// 1. PROCEDURAL MILKY WAY COSMIC SPACE SKYBOX
// =========================================================================
function createMilkyWayTexture(): THREE.CanvasTexture {
  const width = 2048;
  const height = 1024;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.CanvasTexture(canvas);

  // Deep space background
  ctx.fillStyle = '#02050c';
  ctx.fillRect(0, 0, width, height);

  // Milky Way Galactic diagonal dust band
  ctx.save();
  ctx.translate(width / 2, height / 2);
  ctx.rotate(-Math.PI / 5.5);

  const galaxyBand = ctx.createLinearGradient(0, -260, 0, 260);
  galaxyBand.addColorStop(0, 'rgba(3, 7, 18, 0)');
  galaxyBand.addColorStop(0.2, 'rgba(30, 27, 75, 0.18)');
  galaxyBand.addColorStop(0.4, 'rgba(76, 29, 149, 0.28)');
  galaxyBand.addColorStop(0.5, 'rgba(125, 211, 252, 0.35)');
  galaxyBand.addColorStop(0.55, 'rgba(216, 180, 254, 0.3)');
  galaxyBand.addColorStop(0.65, 'rgba(49, 46, 129, 0.22)');
  galaxyBand.addColorStop(0.8, 'rgba(14, 116, 144, 0.16)');
  galaxyBand.addColorStop(1, 'rgba(3, 7, 18, 0)');

  ctx.fillStyle = galaxyBand;
  ctx.fillRect(-width, -260, width * 2, 520);

  // Dense cosmic dust clouds
  for (let i = 0; i < 90; i++) {
    const cx = (Math.random() - 0.5) * width * 1.6;
    const cy = (Math.random() - 0.5) * 220;
    const r = 25 + Math.random() * 95;
    const rad = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
    const alpha = 0.04 + Math.random() * 0.12;
    rad.addColorStop(0, `rgba(224, 231, 255, ${alpha * 1.5})`);
    rad.addColorStop(0.4, `rgba(165, 180, 252, ${alpha})`);
    rad.addColorStop(0.8, `rgba(56, 189, 248, ${alpha * 0.5})`);
    rad.addColorStop(1, 'rgba(2, 6, 23, 0)');
    ctx.fillStyle = rad;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fill();
  }

  // Galactic stellar dust specks
  ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
  for (let i = 0; i < 1800; i++) {
    const sx = (Math.random() - 0.5) * width * 1.8;
    const sy = (Math.random() - 0.5) * 200 * (1 - Math.abs(sx) / (width * 1.2));
    const size = Math.random() * 1.2;
    ctx.fillRect(sx, sy, size, size);
  }
  ctx.restore();

  // Background random stars throughout sky
  for (let i = 0; i < 1200; i++) {
    const rx = Math.random() * width;
    const ry = Math.random() * height;
    const s = 0.5 + Math.random() * 1.3;
    const alpha = 0.3 + Math.random() * 0.65;
    ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
    ctx.fillRect(rx, ry, s, s);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  return texture;
}

// =========================================================================
// 2. PHOTOREALISTIC PROCEDURAL EARTH TEXTURE (Oceans, Biomes, Shallows, Night Lights)
// =========================================================================
function createPhotorealisticEarthTexture(): THREE.CanvasTexture {
  const width = 2048;
  const height = 1024;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.CanvasTexture(canvas);

  // 1. Deep Ocean Realistic Gradient
  const oceanGrad = ctx.createLinearGradient(0, 0, 0, height);
  oceanGrad.addColorStop(0, '#020b18');    // Arctic ocean
  oceanGrad.addColorStop(0.2, '#061a38');  // North Atlantic/Pacific
  oceanGrad.addColorStop(0.5, '#0a254d');  // Tropical oceans
  oceanGrad.addColorStop(0.8, '#061a38');  // Southern Ocean
  oceanGrad.addColorStop(1, '#020b18');    // Antarctic waters
  ctx.fillStyle = oceanGrad;
  ctx.fillRect(0, 0, width, height);

  // Continent Polygons Data (Longitude [-180..180], Latitude [-90..90])
  const northAmerica: [number, number][] = [
    [-168, 65], [-160, 71], [-140, 70], [-130, 68], [-110, 74], [-85, 70],
    [-80, 62], [-65, 58], [-55, 50], [-60, 44], [-70, 42], [-75, 35],
    [-80, 25], [-82, 28], [-90, 30], [-97, 26], [-97, 20], [-90, 16],
    [-84, 10], [-77, 8], [-82, 10], [-90, 14], [-96, 17], [-105, 23],
    [-110, 24], [-117, 32], [-124, 40], [-125, 48], [-135, 58], [-145, 60],
    [-160, 58], [-168, 65],
  ];

  const greenland: [number, number][] = [
    [-50, 60], [-42, 60], [-35, 65], [-20, 70], [-18, 77], [-25, 82],
    [-40, 83], [-55, 80], [-55, 72], [-50, 60],
  ];

  const southAmerica: [number, number][] = [
    [-77, 8], [-72, 12], [-62, 11], [-50, 0], [-36, -5], [-35, -9],
    [-38, -13], [-40, -20], [-48, -26], [-55, -34], [-62, -39], [-65, -55],
    [-72, -54], [-74, -45], [-72, -35], [-70, -20], [-76, -14], [-81, -5],
    [-79, 1], [-77, 8],
  ];

  const europe: [number, number][] = [
    [-10, 36], [-9, 43], [-1, 44], [-2, 47], [3, 51], [8, 54],
    [12, 57], [10, 62], [14, 66], [24, 70], [30, 68], [30, 60],
    [25, 54], [28, 45], [25, 40], [20, 37], [15, 38], [12, 44],
    [4, 43], [0, 38], [-5, 36], [-10, 36],
  ];

  const uk: [number, number][] = [
    [-5, 50], [-4, 55], [-2, 58], [-1, 53], [1, 51], [-5, 50],
  ];

  const africa: [number, number][] = [
    [-15, 28], [-10, 35], [0, 36], [11, 37], [18, 32], [26, 31],
    [33, 31], [34, 27], [43, 12], [51, 10], [47, 5], [41, -5],
    [36, -18], [32, -28], [28, -34], [18, -34], [15, -28], [12, -18],
    [10, -5], [3, 5], [-5, 5], [-12, 7], [-17, 15], [-17, 21], [-15, 28],
  ];

  const madagascar: [number, number][] = [
    [44, -13], [50, -15], [49, -24], [44, -25], [44, -13],
  ];

  const asia: [number, number][] = [
    [30, 60], [45, 60], [60, 68], [80, 72], [110, 75], [140, 72],
    [170, 66], [180, 65], [170, 60], [155, 55], [142, 50], [135, 45],
    [130, 42], [122, 38], [122, 30], [118, 22], [108, 21], [108, 16],
    [106, 10], [104, 2], [100, 5], [96, 17], [90, 22], [85, 20],
    [80, 10], [77, 8], [73, 18], [68, 24], [60, 25], [55, 16],
    [48, 13], [44, 15], [35, 30], [36, 36], [42, 42], [50, 40],
    [55, 48], [45, 55], [30, 60],
  ];

  const japan: [number, number][] = [
    [130, 31], [135, 34], [140, 36], [142, 43], [145, 44],
    [141, 38], [132, 33], [130, 31],
  ];

  const australia: [number, number][] = [
    [114, -22], [123, -16], [131, -12], [137, -12], [142, -11],
    [146, -17], [153, -28], [150, -37], [144, -38], [136, -35],
    [128, -32], [116, -35], [113, -26], [114, -22],
  ];

  const newZealand: [number, number][] = [
    [172, -35], [178, -38], [175, -42], [171, -40], [172, -35],
  ];

  const antarctica: [number, number][] = [
    [-180, -70], [180, -70], [180, -90], [-180, -90],
  ];

  // Draw polygon helper
  const drawPoly = (pts: [number, number][], fill: string, stroke?: string, strokeW: number = 1.5) => {
    if (pts.length < 2) return;
    ctx.beginPath();
    const sx = ((pts[0][0] + 180) / 360) * width;
    const sy = ((90 - pts[0][1]) / 180) * height;
    ctx.moveTo(sx, sy);
    for (let i = 1; i < pts.length; i++) {
      ctx.lineTo(((pts[i][0] + 180) / 360) * width, ((90 - pts[i][1]) / 180) * height);
    }
    ctx.closePath();
    ctx.fillStyle = fill;
    ctx.fill();
    if (stroke) {
      ctx.strokeStyle = stroke;
      ctx.lineWidth = strokeW;
      ctx.stroke();
    }
  };

  const allLands = [northAmerica, greenland, southAmerica, europe, uk, africa, madagascar, asia, japan, australia, newZealand];

  // 2. Continental Turquoise Shallows (Realistic coastal shelves)
  allLands.forEach((poly) => {
    ctx.save();
    ctx.shadowColor = '#06b6d4';
    ctx.shadowBlur = 12;
    drawPoly(poly, '#0e4369', '#0891b2', 3.5);
    ctx.restore();
  });

  // 3. Realistic Continental Base Terrains (Forest, Mountain & Savannah Tones)
  drawPoly(northAmerica, '#234a2e', '#2e633d');
  drawPoly(southAmerica, '#1c492b', '#265f37');
  drawPoly(europe, '#2d5336', '#3b6a45');
  drawPoly(uk, '#2a5a32', '#3b6a45');
  drawPoly(africa, '#635338', '#786544');       // Savannah & Sahara tones
  drawPoly(madagascar, '#244e30', '#2e633d');
  drawPoly(asia, '#34523a', '#476f4e');
  drawPoly(japan, '#2a5534', '#3b6a45');
  drawPoly(australia, '#825936', '#96673f');     // Australian Outback warm red-ochre
  drawPoly(newZealand, '#234a2e', '#2e633d');

  // 4. Deserts (Sahara, Arabian Peninsula, Gobi)
  // Sahara & Arabia
  ctx.save();
  ctx.beginPath();
  const saharaX = ((-14 + 180) / 360) * width;
  const saharaY = ((90 - 24) / 180) * height;
  ctx.ellipse(saharaX + 160, saharaY, 210, 65, 0.05, 0, Math.PI * 2);
  const saharaGrad = ctx.createRadialGradient(saharaX + 160, saharaY, 20, saharaX + 160, saharaY, 210);
  saharaGrad.addColorStop(0, '#c49a56');
  saharaGrad.addColorStop(0.7, '#967440');
  saharaGrad.addColorStop(1, 'rgba(110, 85, 48, 0)');
  ctx.fillStyle = saharaGrad;
  ctx.fill();
  ctx.restore();

  // Gobi Desert
  ctx.save();
  ctx.beginPath();
  const gobiX = ((100 + 180) / 360) * width;
  const gobiY = ((90 - 43) / 180) * height;
  ctx.ellipse(gobiX, gobiY, 95, 32, -0.05, 0, Math.PI * 2);
  const gobiGrad = ctx.createRadialGradient(gobiX, gobiY, 10, gobiX, gobiY, 95);
  gobiGrad.addColorStop(0, '#ad8750');
  gobiGrad.addColorStop(1, 'rgba(148, 115, 68, 0)');
  ctx.fillStyle = gobiGrad;
  ctx.fill();
  ctx.restore();

  // 5. Polar Ice Caps & Greenland Glaciers (Pure white & glacial cyan)
  drawPoly(greenland, '#f8fafc', '#bae6fd', 2);
  drawPoly(antarctica, '#f1f5f9', '#bae6fd', 3);

  // 6. Mountain Ridges & Shading (Himalayas, Andes, Rockies)
  ctx.strokeStyle = '#e2e8f0';
  ctx.lineWidth = 1.8;
  // Himalayas
  ctx.beginPath();
  const himStart = [((75 + 180) / 360) * width, ((90 - 32) / 180) * height];
  ctx.moveTo(himStart[0], himStart[1]);
  ctx.lineTo(((92 + 180) / 360) * width, ((90 - 28) / 180) * height);
  ctx.stroke();

  // Andes
  ctx.beginPath();
  ctx.moveTo(((-74 + 180) / 360) * width, ((90 - 2) / 180) * height);
  ctx.lineTo(((-70 + 180) / 360) * width, ((90 - -45) / 180) * height);
  ctx.stroke();

  // 7. Night City Lights Clusters (Glowing Amber / Golden City Sprawls)
  const cityClusters: [number, number, number][] = [
    // [lon, lat, radius]
    [-74, 40.7, 18],     // US East Coast / NY
    [-87, 41.8, 14],     // Chicago
    [-122, 37.7, 16],    // Silicon Valley / SF
    [-118, 34.0, 15],    // Los Angeles
    [-0.1, 51.5, 20],    // London / Western Europe
    [2.3, 48.8, 16],     // Paris
    [13.4, 52.5, 14],    // Berlin / Central Europe
    [105.8, 21.0, 12],   // Hanoi
    [106.6, 10.8, 13],   // Ho Chi Minh City
    [100.5, 13.7, 13],   // Bangkok
    [103.8, 1.3, 14],    // Singapore
    [139.7, 35.7, 24],   // Tokyo metropolitan
    [121.5, 31.2, 20],   // Shanghai
    [116.4, 39.9, 18],   // Beijing
    [77.2, 28.6, 17],    // New Delhi
    [72.8, 19.0, 16],    // Mumbai
    [77.6, 12.9, 15],    // Bengaluru
    [151.2, -33.8, 14],  // Sydney
    [-46.6, -23.5, 16],  // Sao Paulo
  ];

  cityClusters.forEach(([lon, lat, rad]) => {
    const cx = ((lon + 180) / 360) * width;
    const cy = ((90 - lat) / 180) * height;

    // Golden halo glow
    const halo = ctx.createRadialGradient(cx, cy, 0, cx, cy, rad);
    halo.addColorStop(0, 'rgba(254, 240, 138, 0.95)');
    halo.addColorStop(0.3, 'rgba(245, 158, 11, 0.6)');
    halo.addColorStop(0.7, 'rgba(217, 119, 6, 0.25)');
    halo.addColorStop(1, 'rgba(180, 83, 9, 0)');
    ctx.fillStyle = halo;
    ctx.beginPath();
    ctx.arc(cx, cy, rad, 0, Math.PI * 2);
    ctx.fill();

    // Hot city center core
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(cx, cy, 1.8, 0, Math.PI * 2);
    ctx.fill();
  });

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  return texture;
}

// =========================================================================
// 3. TERRAIN BUMP MAP TEXTURE
// =========================================================================
function createEarthBumpTexture(): THREE.CanvasTexture {
  const width = 1024;
  const height = 512;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.CanvasTexture(canvas);

  // Sea level: pitch black (0 elevation)
  ctx.fillStyle = '#000000';
  ctx.fillRect(0, 0, width, height);

  // Continental land: medium gray elevation
  const drawBump = (pts: [number, number][], gray: string) => {
    if (pts.length < 2) return;
    ctx.beginPath();
    const sx = ((pts[0][0] + 180) / 360) * width;
    const sy = ((90 - pts[0][1]) / 180) * height;
    ctx.moveTo(sx, sy);
    for (let i = 1; i < pts.length; i++) {
      ctx.lineTo(((pts[i][0] + 180) / 360) * width, ((90 - pts[i][1]) / 180) * height);
    }
    ctx.closePath();
    ctx.fillStyle = gray;
    ctx.fill();
  };

  const sampleLand: [number, number][] = [
    [-168, 65], [-110, 74], [-60, 44], [-75, 35], [-97, 20], [-124, 40], [-168, 65]
  ];
  drawBump(sampleLand, '#777777');

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  return texture;
}

// =========================================================================
// 4. REALISTIC SWIRLING CLOUDS LAYER TEXTURE
// =========================================================================
function createRealisticCloudsTexture(): THREE.CanvasTexture {
  const width = 2048;
  const height = 1024;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.CanvasTexture(canvas);

  ctx.clearRect(0, 0, width, height);

  // 1. Equatorial Intertropical Convergence Zone (ITCZ) Cloud Bands
  for (let i = 0; i < 70; i++) {
    const cx = Math.random() * width;
    const cy = height * 0.48 + (Math.random() - 0.5) * 80;
    const rx = 60 + Math.random() * 160;
    const ry = 12 + Math.random() * 28;
    const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, rx);
    grad.addColorStop(0, 'rgba(255, 255, 255, 0.45)');
    grad.addColorStop(0.5, 'rgba(240, 249, 255, 0.22)');
    grad.addColorStop(1, 'rgba(255, 255, 255, 0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.ellipse(cx, cy, rx, ry, (Math.random() - 0.5) * 0.2, 0, Math.PI * 2);
    ctx.fill();
  }

  // 2. Temperate & Mid-latitude Frontal Weather Systems (Swirling bands)
  for (let i = 0; i < 85; i++) {
    const cx = Math.random() * width;
    // Northern or southern hemisphere weather tracks
    const cy = Math.random() > 0.5
      ? height * 0.22 + Math.random() * (height * 0.22)
      : height * 0.62 + Math.random() * (height * 0.22);
    const rx = 70 + Math.random() * 180;
    const ry = 15 + Math.random() * 45;
    const rot = (Math.random() - 0.5) * 0.6;

    const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, rx);
    grad.addColorStop(0, 'rgba(255, 255, 255, 0.48)');
    grad.addColorStop(0.6, 'rgba(241, 245, 249, 0.2)');
    grad.addColorStop(1, 'rgba(255, 255, 255, 0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.ellipse(cx, cy, rx, ry, rot, 0, Math.PI * 2);
    ctx.fill();
  }

  // 3. Realistic Tropical Cyclones / Hurricanes (Spiral vortices)
  const drawCyclone = (cx: number, cy: number, radius: number) => {
    for (let a = 0; a < Math.PI * 4; a += 0.2) {
      const r = (a / (Math.PI * 4)) * radius;
      const px = cx + Math.cos(a) * r;
      const py = cy + Math.sin(a) * (r * 0.7);
      const dotGrad = ctx.createRadialGradient(px, py, 0, px, py, 20);
      dotGrad.addColorStop(0, 'rgba(255, 255, 255, 0.55)');
      dotGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
      ctx.fillStyle = dotGrad;
      ctx.beginPath();
      ctx.arc(px, py, 20, 0, Math.PI * 2);
      ctx.fill();
    }
  };

  drawCyclone(width * 0.28, height * 0.38, 70); // Atlantic hurricane
  drawCyclone(width * 0.76, height * 0.35, 80); // Pacific typhoon

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  return texture;
}

// =========================================================================
// MAIN COMPONENT
// =========================================================================
export const InteractiveGlobe3D: React.FC = () => {
  const mountRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // 1. Scene, Camera, High-Performance WebGL Renderer
    const width = container.clientWidth || Math.floor(window.innerWidth * 0.55);
    const height = container.clientHeight || window.innerHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 195;

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.domElement.style.display = 'block';
    renderer.domElement.style.outline = 'none';
    renderer.domElement.style.border = 'none';
    container.appendChild(renderer.domElement);

    // 2. Space / Milky Way Background Skybox Sphere
    const skyboxGeom = new THREE.SphereGeometry(380, 48, 48);
    const skyboxTex = createMilkyWayTexture();
    const skyboxMat = new THREE.MeshBasicMaterial({
      map: skyboxTex,
      side: THREE.BackSide,
      depthWrite: false,
    });
    const skyboxMesh = new THREE.Mesh(skyboxGeom, skyboxMat);
    scene.add(skyboxMesh);

    // 3. Earth Group tilted at 23.5 degrees (Authentic Axial Tilt)
    const earthTiltGroup = new THREE.Group();
    earthTiltGroup.rotation.z = (23.5 * Math.PI) / 180;
    scene.add(earthTiltGroup);

    // Globe Spin Group inside tilted axis
    const globeSpinGroup = new THREE.Group();
    earthTiltGroup.add(globeSpinGroup);

    const radius = 62;

    // 4. Photorealistic Earth Surface Sphere
    const earthTexture = createPhotorealisticEarthTexture();
    const bumpTexture = createEarthBumpTexture();
    const earthGeom = new THREE.SphereGeometry(radius, 64, 64);
    const earthMat = new THREE.MeshStandardMaterial({
      map: earthTexture,
      bumpMap: bumpTexture,
      bumpScale: 1.2,
      roughness: 0.55,
      metalness: 0.08,
    });
    const earthMesh = new THREE.Mesh(earthGeom, earthMat);
    globeSpinGroup.add(earthMesh);

    // 5. Realistic Atmospheric Clouds Layer (drifts independently)
    const cloudTexture = createRealisticCloudsTexture();
    const cloudGeom = new THREE.SphereGeometry(radius * 1.018, 54, 54);
    const cloudMat = new THREE.MeshPhongMaterial({
      map: cloudTexture,
      transparent: true,
      opacity: 0.52,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const cloudMesh = new THREE.Mesh(cloudGeom, cloudMat);
    globeSpinGroup.add(cloudMesh);

    // 6. NASA-Style Atmospheric Fresnel Rim Glow (Gentle Cyan / Sky Blue Rim)
    const atmosphereGeom = new THREE.SphereGeometry(radius * 1.055, 48, 48);
    const atmosphereMat = new THREE.ShaderMaterial({
      vertexShader: `
        varying vec3 vNormal;
        varying vec3 vViewPosition;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          vViewPosition = -mvPosition.xyz;
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        varying vec3 vNormal;
        varying vec3 vViewPosition;
        void main() {
          vec3 normal = normalize(vNormal);
          vec3 viewDir = normalize(vViewPosition);
          float fresnel = 1.0 - dot(normal, viewDir);
          float intensity = pow(fresnel, 3.2);
          // Realistic Atmospheric Blue Glow (#38bdf8 to #60a5fa)
          vec3 atmosphereColor = mix(vec3(0.22, 0.74, 0.97), vec3(0.37, 0.65, 0.98), 0.4);
          gl_FragColor = vec4(atmosphereColor, intensity * 0.92);
        }
      `,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide,
      transparent: true,
      depthWrite: false,
    });
    const atmosphereMesh = new THREE.Mesh(atmosphereGeom, atmosphereMat);
    earthTiltGroup.add(atmosphereMesh);

    // 7. Global Developer Tech Hubs & Glowing Beacons
    const hubPositions: THREE.Vector3[] = TECH_HUBS.map((h) =>
      latLonToVector3(h.lat, h.lon, radius * 1.016)
    );

    const hubGeom = new THREE.SphereGeometry(0.85, 12, 12);
    const hubMat = new THREE.MeshBasicMaterial({ color: 0x00ea64 });

    hubPositions.forEach((pos) => {
      const marker = new THREE.Mesh(hubGeom, hubMat);
      marker.position.copy(pos);
      globeSpinGroup.add(marker);
    });

    // 8. Great-Circle Developer Connection Arcs & Pulse Particles
    const arcCurves: { curve: THREE.QuadraticBezierCurve3; pulseProgress: number }[] = [];
    const arcsGroup = new THREE.Group();
    globeSpinGroup.add(arcsGroup);

    HUB_CONNECTIONS.forEach(([startIdx, endIdx], i) => {
      const vStart = hubPositions[startIdx];
      const vEnd = hubPositions[endIdx];

      const vMid = new THREE.Vector3().addVectors(vStart, vEnd).multiplyScalar(0.5);
      const distance = vStart.distanceTo(vEnd);
      vMid.setLength(radius * (1.12 + Math.min(distance / 120, 0.22)));

      const curve = new THREE.QuadraticBezierCurve3(vStart, vMid, vEnd);
      arcCurves.push({ curve, pulseProgress: (i * 0.12) % 1 });

      const curvePoints = curve.getPoints(36);
      const curveGeom = new THREE.BufferGeometry().setFromPoints(curvePoints);
      const curveMat = new THREE.LineBasicMaterial({
        color: i % 2 === 0 ? 0x00ea64 : 0x38bdf8,
        transparent: true,
        opacity: 0.38,
      });
      const arcLine = new THREE.Line(curveGeom, curveMat);
      arcsGroup.add(arcLine);
    });

    const pulseCount = arcCurves.length;
    const pulseGeom = new THREE.SphereGeometry(0.7, 8, 8);
    const pulseMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const pulseMeshes: THREE.Mesh[] = [];

    for (let i = 0; i < pulseCount; i++) {
      const pMesh = new THREE.Mesh(pulseGeom, pulseMat);
      arcsGroup.add(pMesh);
      pulseMeshes.push(pMesh);
    }

    // 9. Natural Sunlight & Space Illumination
    const sunLight = new THREE.DirectionalLight(0xfff8ee, 2.6);
    sunLight.position.set(160, 50, 110);
    scene.add(sunLight);

    const cosmicAmbient = new THREE.AmbientLight(0x0a192f, 0.7);
    scene.add(cosmicAmbient);

    // 10. Smooth Parallax Interaction
    let targetParallaxX = 0;
    let targetParallaxY = 0;
    let currentParallaxX = 0;
    let currentParallaxY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const relX = (e.clientX - rect.left) / rect.width - 0.5;
      const relY = (e.clientY - rect.top) / rect.height - 0.5;
      targetParallaxX = relY * 0.25;
      targetParallaxY = relX * 0.35;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    // 11. Animation Loop
    let animId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const delta = clock.getDelta();

      // Earth rotation
      globeSpinGroup.rotation.y += 0.0016;
      // Clouds drift independently
      cloudMesh.rotation.y += 0.0022;

      // Milky Way background subtle drift
      skyboxMesh.rotation.y += 0.00018;

      // Smooth mouse parallax lerp
      currentParallaxX += (targetParallaxX - currentParallaxX) * 0.05;
      currentParallaxY += (targetParallaxY - currentParallaxY) * 0.05;
      earthTiltGroup.rotation.x = currentParallaxX;
      earthTiltGroup.rotation.y = currentParallaxY;

      // Pulse traveling along connection arcs
      arcCurves.forEach((arc, i) => {
        arc.pulseProgress += delta * 0.42;
        if (arc.pulseProgress > 1) arc.pulseProgress = 0;
        const pt = arc.curve.getPoint(arc.pulseProgress);
        pulseMeshes[i].position.copy(pt);
      });

      renderer.render(scene, camera);
    };

    animate();

    // Resize Handler
    const handleResize = () => {
      if (!container) return;
      const newW = container.clientWidth || Math.floor(window.innerWidth * 0.55);
      const newH = container.clientHeight || window.innerHeight;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup & Memory Management
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);

      skyboxGeom.dispose();
      earthGeom.dispose();
      cloudGeom.dispose();
      atmosphereGeom.dispose();
      hubGeom.dispose();
      pulseGeom.dispose();

      skyboxTex.dispose();
      earthTexture.dispose();
      bumpTexture.dispose();
      cloudTexture.dispose();

      skyboxMat.dispose();
      earthMat.dispose();
      cloudMat.dispose();
      atmosphereMat.dispose();
      hubMat.dispose();
      pulseMat.dispose();

      renderer.dispose();
      if (renderer.domElement && renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="w-full h-full absolute inset-0 border-none bg-transparent overflow-hidden cursor-grab active:cursor-grabbing select-none pointer-events-auto"
      title="Quả cầu Trái Đất 3D Chân Thực & Dải Ngân Hà AI Code Mentor"
    />
  );
};
