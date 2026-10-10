import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export const InteractiveSolarSystem3D: React.FC = () => {
  const mountRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // 1. Scene, Camera, Renderer
    const width = container.clientWidth || 380;
    const height = container.clientHeight || 380;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1500);
    // Angled top-down view to clearly see all concentric planetary orbits
    camera.position.set(0, 140, 290);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Master group for the entire solar system (tilted for 3D depth)
    const solarSystem = new THREE.Group();
    solarSystem.rotation.x = 0.52; // Tilted towards the camera
    scene.add(solarSystem);

    // 2. CENTRAL FIERY SUN (Golden Orange Bloom)
    const sunGroup = new THREE.Group();
    solarSystem.add(sunGroup);

    // Sun Sphere Core
    const sunGeo = new THREE.SphereGeometry(14, 32, 32);
    const sunMat = new THREE.MeshBasicMaterial({
      color: 0xffa500, // Fiery Sun Gold
    });
    const sunMesh = new THREE.Mesh(sunGeo, sunMat);
    sunGroup.add(sunMesh);

    // Sun Outer Pulsing Corona Wireframe
    const sunWireGeo = new THREE.SphereGeometry(15.5, 20, 20);
    const sunWireMat = new THREE.MeshBasicMaterial({
      color: 0xff4500, // Red-orange flare
      wireframe: true,
      transparent: true,
      opacity: 0.35,
    });
    const sunWire = new THREE.Mesh(sunWireGeo, sunWireMat);
    sunGroup.add(sunWire);

    // Radial Gradient Corona Flare Sprite
    const coronaCanvas = document.createElement('canvas');
    coronaCanvas.width = 128;
    coronaCanvas.height = 128;
    const ctx = coronaCanvas.getContext('2d');
    if (ctx) {
      const grad = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
      grad.addColorStop(0, 'rgba(255, 255, 220, 1)');
      grad.addColorStop(0.2, 'rgba(255, 170, 0, 0.9)');
      grad.addColorStop(0.5, 'rgba(255, 69, 0, 0.35)');
      grad.addColorStop(1, 'rgba(255, 69, 0, 0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(64, 64, 64, 0, Math.PI * 2);
      ctx.fill();
    }
    const coronaTex = new THREE.CanvasTexture(coronaCanvas);
    const coronaMat = new THREE.SpriteMaterial({
      map: coronaTex,
      transparent: true,
      blending: THREE.AdditiveBlending,
      opacity: 0.9,
    });
    const coronaSprite = new THREE.Sprite(coronaMat);
    coronaSprite.scale.set(72, 72, 1);
    sunGroup.add(coronaSprite);

    // Sun Light Source
    const sunLight = new THREE.PointLight(0xffaa33, 3, 400);
    sunLight.position.set(0, 0, 0);
    scene.add(sunLight);

    const ambientLight = new THREE.AmbientLight(0x334155, 0.8);
    scene.add(ambientLight);

    // 3. AMBIENT BACKGROUND STARFIELD PARTICLES
    const starCount = 220;
    const starPos = new Float32Array(starCount * 3);
    const starColors = new Float32Array(starCount * 3);
    const cWhite = new THREE.Color(0xffffff);
    const cGold = new THREE.Color(0xffd166);
    const cBlue = new THREE.Color(0x90e0ef);

    for (let i = 0; i < starCount; i++) {
      const r = 130 + Math.random() * 160;
      const theta = Math.random() * Math.PI * 2;
      const phi = (Math.random() - 0.5) * Math.PI;

      starPos[i * 3] = r * Math.cos(phi) * Math.cos(theta);
      starPos[i * 3 + 1] = r * Math.sin(phi);
      starPos[i * 3 + 2] = r * Math.cos(phi) * Math.sin(theta);

      const color = i % 5 === 0 ? cGold : i % 3 === 0 ? cBlue : cWhite;
      starColors[i * 3] = color.r;
      starColors[i * 3 + 1] = color.g;
      starColors[i * 3 + 2] = color.b;
    }

    const starGeo = new THREE.BufferGeometry();
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
    starGeo.setAttribute('color', new THREE.BufferAttribute(starColors, 3));
    const starMat = new THREE.PointsMaterial({
      size: 2.0,
      vertexColors: true,
      transparent: true,
      opacity: 0.7,
      blending: THREE.AdditiveBlending,
    });
    const stars = new THREE.Points(starGeo, starMat);
    scene.add(stars);

    // 4. THE 8 ASTRONOMICAL PLANETS
    interface PlanetItem {
      name: string;
      radiusX: number;
      radiusZ: number;
      speed: number;
      angle: number;
      mesh: THREE.Mesh;
      orbitLine: THREE.LineLoop;
      ringMesh?: THREE.Mesh;
    }

    const planetConfigs = [
      // 1. Mercury (Sao Thủy - xám tro)
      {
        name: 'Mercury',
        color: 0x9e9e9e,
        size: 2.0,
        rx: 26,
        rz: 24,
        speed: 2.4,
        hasRing: false,
      },
      // 2. Venus (Sao Kim - vàng nhạt)
      {
        name: 'Venus',
        color: 0xe6c280,
        size: 3.2,
        rx: 38,
        rz: 34,
        speed: 1.8,
        hasRing: false,
      },
      // 3. Earth (Trái Đất - xanh lam vân mây)
      {
        name: 'Earth',
        color: 0x2277bb,
        size: 3.6,
        rx: 52,
        rz: 46,
        speed: 1.4,
        hasRing: false,
      },
      // 4. Mars (Sao Hỏa - đỏ cam)
      {
        name: 'Mars',
        color: 0xc1440e,
        size: 2.6,
        rx: 66,
        rz: 58,
        speed: 1.1,
        hasRing: false,
      },
      // 5. Jupiter (Sao Mộc - vân sọc nâu cam lớn)
      {
        name: 'Jupiter',
        color: 0xd4a373,
        size: 7.2,
        rx: 85,
        rz: 74,
        speed: 0.75,
        hasRing: false,
      },
      // 6. Saturn (Sao Thổ - vàng cát kèm vành đai Ring 3D nghiêng rõ rệt)
      {
        name: 'Saturn',
        color: 0xeed7a1,
        size: 5.8,
        rx: 106,
        rz: 92,
        speed: 0.55,
        hasRing: true,
      },
      // 7. Uranus (Sao Thiên Vương - xanh lục lam)
      {
        name: 'Uranus',
        color: 0x70d6ff,
        size: 4.2,
        rx: 126,
        rz: 110,
        speed: 0.38,
        hasRing: false,
      },
      // 8. Neptune (Sao Hải Vương - xanh dương thẫm)
      {
        name: 'Neptune',
        color: 0x274c77,
        size: 4.0,
        rx: 144,
        rz: 126,
        speed: 0.28,
        hasRing: false,
      },
    ];

    const planetItems: PlanetItem[] = [];

    planetConfigs.forEach((cfg, index) => {
      // Create Orbit Elliptical Line Loop
      const orbitPointsCount = 100;
      const pts: THREE.Vector3[] = [];
      for (let i = 0; i < orbitPointsCount; i++) {
        const theta = (i / orbitPointsCount) * Math.PI * 2;
        pts.push(new THREE.Vector3(Math.cos(theta) * cfg.rx, 0, Math.sin(theta) * cfg.rz));
      }
      const orbitGeo = new THREE.BufferGeometry().setFromPoints(pts);
      const orbitMat = new THREE.LineBasicMaterial({
        color: 0x475569, // Muted grey-blue orbit line
        transparent: true,
        opacity: 0.25,
      });
      const orbitLine = new THREE.LineLoop(orbitGeo, orbitMat);
      solarSystem.add(orbitLine);

      // Create Planet Mesh
      const pGeo = new THREE.SphereGeometry(cfg.size, 24, 24);
      const pMat = new THREE.MeshStandardMaterial({
        color: cfg.color,
        roughness: 0.45,
        metalness: 0.2,
      });
      const pMesh = new THREE.Mesh(pGeo, pMat);

      // Distinct 3D Ring for Saturn
      let ringMesh: THREE.Mesh | undefined;
      if (cfg.hasRing) {
        const ringGeo = new THREE.RingGeometry(cfg.size * 1.4, cfg.size * 2.5, 32);
        const ringMat = new THREE.MeshBasicMaterial({
          color: 0xd4b886,
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.75,
        });
        ringMesh = new THREE.Mesh(ringGeo, ringMat);
        ringMesh.rotation.x = Math.PI / 2.3;
        ringMesh.rotation.y = 0.2;
        pMesh.add(ringMesh);
      }

      solarSystem.add(pMesh);

      planetItems.push({
        name: cfg.name,
        radiusX: cfg.rx,
        radiusZ: cfg.rz,
        speed: cfg.speed,
        angle: (index * Math.PI) / 3.5 + Math.random(),
        mesh: pMesh,
        orbitLine,
        ringMesh,
      });
    });

    // 5. MOUSE PARALLAX INTERACTION
    let mouseX = 0;
    let mouseY = 0;
    let targetRotX = 0.52;
    let targetRotY = 0;

    const handleMouseMove = (event: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const nx = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      const ny = -(((event.clientY - rect.top) / rect.height) * 2 - 1);
      mouseX = nx * 0.35;
      mouseY = ny * 0.25;
    };

    container.addEventListener('mousemove', handleMouseMove);

    // 6. ANIMATION LOOP
    let animId: number;
    let lastTime = performance.now();

    const animate = (time: number) => {
      animId = requestAnimationFrame(animate);

      const delta = Math.min((time - lastTime) / 1000, 0.1);
      lastTime = time;

      // Sun Rotation & Corona Pulse
      sunMesh.rotation.y += 0.008;
      sunWire.rotation.y -= 0.005;
      const pulse = 1 + Math.sin(time * 0.0025) * 0.05;
      coronaSprite.scale.set(72 * pulse, 72 * pulse, 1);

      // Planets Orbit & Axial Rotation
      planetItems.forEach((p) => {
        p.angle += p.speed * delta * 0.5;
        p.mesh.position.x = Math.cos(p.angle) * p.radiusX;
        p.mesh.position.z = Math.sin(p.angle) * p.radiusZ;
        p.mesh.rotation.y += 0.02;
      });

      // Smooth Mouse Parallax
      targetRotY += 0.0012; // Slow cosmic rotation
      solarSystem.rotation.y += (targetRotY + mouseX - solarSystem.rotation.y) * 0.04;
      solarSystem.rotation.x += (targetRotX - mouseY - solarSystem.rotation.x) * 0.04;

      // Stars rotate very slowly
      stars.rotation.y -= 0.0002;

      renderer.render(scene, camera);
    };

    animId = requestAnimationFrame(animate);

    // 7. RESIZE LISTENER
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth || 380;
      const h = container.clientHeight || 380;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    // 8. CLEANUP
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      container.removeEventListener('mousemove', handleMouseMove);

      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }

      sunGeo.dispose();
      sunMat.dispose();
      sunWireGeo.dispose();
      sunWireMat.dispose();
      coronaTex.dispose();
      coronaMat.dispose();
      starGeo.dispose();
      starMat.dispose();

      planetItems.forEach((p) => {
        p.mesh.geometry.dispose();
        if (Array.isArray(p.mesh.material)) {
          p.mesh.material.forEach((m) => m.dispose());
        } else {
          p.mesh.material.dispose();
        }
        p.orbitLine.geometry.dispose();
        if (Array.isArray(p.orbitLine.material)) {
          p.orbitLine.material.forEach((m) => m.dispose());
        } else {
          p.orbitLine.material.dispose();
        }
      });

      renderer.dispose();
    };
  }, []);

  return (
    <div className="relative flex items-center justify-center select-none w-[340px] h-[340px] sm:w-[380px] sm:h-[380px] xl:w-[440px] xl:h-[440px]">
      <div
        ref={mountRef}
        className="w-full h-full flex items-center justify-center cursor-grab active:cursor-grabbing"
      />
    </div>
  );
};
