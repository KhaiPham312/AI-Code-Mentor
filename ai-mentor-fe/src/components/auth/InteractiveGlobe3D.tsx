import React, { useEffect, useRef } from 'react';

interface Point3D {
  x: number;
  y: number;
  z: number;
  baseRadius: number;
  color: string;
  isNode: boolean;
}

export const InteractiveGlobe3D: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.offsetWidth * window.devicePixelRatio);
    let height = (canvas.height = canvas.offsetHeight * window.devicePixelRatio);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      height = canvas.height = canvas.offsetHeight * window.devicePixelRatio;
    };

    window.addEventListener('resize', handleResize);

    // Generate Fibonacci Sphere points
    const sphereRadius = Math.min(width, height) * 0.36;
    const numPoints = 160;
    const points: Point3D[] = [];

    const phi = Math.PI * (3 - Math.sqrt(5)); // Golden angle

    for (let i = 0; i < numPoints; i++) {
      const y = 1 - (i / (numPoints - 1)) * 2; // y goes from 1 to -1
      const radiusAtY = Math.sqrt(1 - y * y);
      const theta = phi * i;

      const x = Math.cos(theta) * radiusAtY;
      const z = Math.sin(theta) * radiusAtY;

      const isNode = i % 9 === 0;

      points.push({
        x: x * sphereRadius,
        y: y * sphereRadius,
        z: z * sphereRadius,
        baseRadius: isNode ? 2.8 : 1.2,
        color: isNode ? '#00EA64' : '#1BA94C',
        isNode,
      });
    }

    let rotY = 0;
    let rotX = 0.25;
    let targetSpeedY = 0.007;
    let mouseX = 0;
    let mouseY = 0;
    let isHovered = false;

    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = (e.clientX - rect.left - rect.width / 2) * 0.0001;
      mouseY = (e.clientY - rect.top - rect.height / 2) * 0.0001;
      isHovered = true;
    };

    const onMouseLeave = () => {
      isHovered = false;
    };

    canvas.addEventListener('mousemove', onMouseMove);
    canvas.addEventListener('mouseleave', onMouseLeave);

    // Orbiting satellites
    const satellites = [
      { angle: 0, speed: 0.02, tilt: 0.6, dist: sphereRadius * 1.25, size: 3.5, color: '#00EA64' },
      { angle: Math.PI, speed: 0.015, tilt: -0.4, dist: sphereRadius * 1.35, size: 2.5, color: '#5eead4' },
    ];

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Rotation physics
      if (isHovered) {
        rotY += mouseX * 2 + targetSpeedY;
        rotX += mouseY * 0.5;
      } else {
        rotY += targetSpeedY;
      }

      const cosY = Math.cos(rotY);
      const sinY = Math.sin(rotY);
      const cosX = Math.cos(rotX);
      const sinX = Math.sin(rotX);

      const fov = sphereRadius * 2.8;
      const centerX = width / 2;
      const centerY = height / 2;

      // Project points
      const projected = points.map((p) => {
        // Y-axis rotation
        const x1 = p.x * cosY + p.z * sinY;
        const z1 = -p.x * sinY + p.z * cosY;

        // X-axis rotation
        const y2 = p.y * cosX - z1 * sinX;
        const z2 = p.y * sinX + z1 * cosX;

        const scale = fov / (fov - z2);
        const x2D = x1 * scale + centerX;
        const y2D = y2 * scale + centerY;
        const alpha = Math.max(0.12, (z2 + sphereRadius) / (2 * sphereRadius));

        return {
          x2D,
          y2D,
          scale,
          alpha,
          z2,
          isNode: p.isNode,
          color: p.color,
          baseRadius: p.baseRadius,
        };
      });

      // Sort by depth for correct rendering
      projected.sort((a, b) => a.z2 - b.z2);

      // Draw faint connections between nearby points on the front hemisphere
      ctx.lineWidth = 0.75 * window.devicePixelRatio;
      const maxConnectDist = sphereRadius * 0.48 * window.devicePixelRatio;

      for (let i = 0; i < projected.length; i++) {
        const p1 = projected[i];
        if (p1.z2 < -sphereRadius * 0.4) continue; // Skip back half

        for (let j = i + 1; j < projected.length; j++) {
          const p2 = projected[j];
          if (p2.z2 < -sphereRadius * 0.4) continue;

          const dx = p1.x2D - p2.x2D;
          const dy = p1.y2D - p2.y2D;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < maxConnectDist) {
            const lineAlpha = (1 - dist / maxConnectDist) * Math.min(p1.alpha, p2.alpha) * 0.35;
            ctx.strokeStyle = `rgba(0, 234, 100, ${lineAlpha})`;
            ctx.beginPath();
            ctx.moveTo(p1.x2D, p1.y2D);
            ctx.lineTo(p2.x2D, p2.y2D);
            ctx.stroke();
          }
        }
      }

      // Draw projected nodes
      for (const p of projected) {
        ctx.fillStyle = p.isNode
          ? `rgba(0, 234, 100, ${p.alpha * 0.95})`
          : `rgba(27, 169, 76, ${p.alpha * 0.65})`;

        const r = Math.max(0.6, p.baseRadius * p.scale * (window.devicePixelRatio / 1.5));
        ctx.beginPath();
        ctx.arc(p.x2D, p.y2D, r, 0, Math.PI * 2);
        ctx.fill();

        // Node glow aura
        if (p.isNode && p.z2 > 0) {
          ctx.beginPath();
          ctx.arc(p.x2D, p.y2D, r * 2.8, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(0, 234, 100, ${p.alpha * 0.15})`;
          ctx.fill();
        }
      }

      // Render orbiting satellites
      satellites.forEach((sat) => {
        sat.angle += sat.speed;
        const satX = Math.cos(sat.angle) * sat.dist;
        const satZ = Math.sin(sat.angle) * sat.dist;
        const satY = Math.sin(sat.angle * 1.5) * (sat.dist * 0.35);

        // Apply tilt and rotation
        const rotatedX = satX * cosY + satZ * sinY;
        const rotatedZ = -satX * sinY + satZ * cosY;
        const rotatedY = satY * cosX - rotatedZ * sinX;
        const finalZ = satY * sinX + rotatedZ * cosX;

        const scale = fov / (fov - finalZ);
        const x2D = rotatedX * scale + centerX;
        const y2D = rotatedY * scale + centerY;
        const alpha = Math.max(0.2, (finalZ + sat.dist) / (2 * sat.dist));

        // Core satellite
        ctx.fillStyle = `rgba(0, 234, 100, ${alpha})`;
        ctx.beginPath();
        ctx.arc(x2D, y2D, sat.size * window.devicePixelRatio, 0, Math.PI * 2);
        ctx.fill();

        // Outer glow
        ctx.fillStyle = `rgba(94, 234, 212, ${alpha * 0.35})`;
        ctx.beginPath();
        ctx.arc(x2D, y2D, sat.size * 2.5 * window.devicePixelRatio, 0, Math.PI * 2);
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      canvas.removeEventListener('mousemove', onMouseMove);
      canvas.removeEventListener('mouseleave', onMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="relative w-full aspect-square max-w-[280px] xl:max-w-[340px] mx-auto flex items-center justify-center">
      {/* Outer subtle orbital rings */}
      <div
        className="pointer-events-none absolute inset-[-12px] rounded-full border border-emerald-500/15 animate-spin"
        style={{ animationDuration: '45s' }}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-[-24px] rounded-full border border-dashed border-teal-400/15 animate-spin"
        style={{ animationDuration: '65s', animationDirection: 'reverse' }}
        aria-hidden="true"
      />

      <canvas
        ref={canvasRef}
        className="w-full h-full cursor-grab active:cursor-grabbing drop-shadow-[0_0_30px_rgba(0,234,100,0.25)]"
        aria-label="3D Interactive Holographic Globe"
      />
    </div>
  );
};
