/**
 * AL HABIB WORLD TRAVEL & TOURS
 * Next-Gen 2026 Motion Graphics & Interactive Flight Radar Engine
 */

document.addEventListener('DOMContentLoaded', () => {

  // =========================================================================
  // 1. INTERACTIVE FLIGHT TRAJECTORY & PARTICLE CANVAS
  // =========================================================================
  const canvas = document.getElementById('motionCanvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width, height;
    let particles = [];
    let flightArcs = [];
    let mouse = { x: -1000, y: -1000, radius: 140 };

    function resizeCanvas() {
      const parent = canvas.parentElement;
      width = canvas.width = parent.offsetWidth;
      height = canvas.height = parent.offsetHeight;
      initNodes();
    }

    // World node coordinates (scaled relative to canvas)
    const nodeData = [
      { name: 'Lahore', xRatio: 0.52, yRatio: 0.48 },
      { name: 'Karachi', xRatio: 0.49, yRatio: 0.56 },
      { name: 'Islamabad', xRatio: 0.51, yRatio: 0.42 },
      { name: 'Makkah', xRatio: 0.38, yRatio: 0.54, isHoly: true },
      { name: 'Madinah', xRatio: 0.39, yRatio: 0.49, isHoly: true },
      { name: 'Dubai', xRatio: 0.44, yRatio: 0.52 },
      { name: 'Istanbul', xRatio: 0.32, yRatio: 0.38 },
      { name: 'London', xRatio: 0.22, yRatio: 0.30 },
      { name: 'Baku', xRatio: 0.39, yRatio: 0.37 },
      { name: 'Kuala Lumpur', xRatio: 0.68, yRatio: 0.66 }
    ];

    function initNodes() {
      particles = nodeData.map(d => ({
        x: d.xRatio * width,
        y: d.yRatio * height,
        name: d.name,
        isHoly: d.isHoly,
        radius: d.isHoly ? 5 : 3.5,
        pulse: Math.random() * Math.PI * 2,
        connections: []
      }));

      // Create flight arcs between major hubs
      flightArcs = [
        { from: 0, to: 3, progress: 0, speed: 0.0035, color: '#facc15' }, // Lahore -> Makkah
        { from: 2, to: 5, progress: 0.3, speed: 0.0045, color: '#38bdf8' }, // Islamabad -> Dubai
        { from: 1, to: 6, progress: 0.6, speed: 0.0038, color: '#4ade80' }, // Karachi -> Istanbul
        { from: 0, to: 7, progress: 0.8, speed: 0.0030, color: '#f43f5e' }, // Lahore -> London
        { from: 5, to: 4, progress: 0.4, speed: 0.0040, color: '#facc15' }  // Dubai -> Madinah
      ];
    }

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    // Mouse tracking over hero
    const heroElem = document.getElementById('home');
    if (heroElem) {
      heroElem.addEventListener('mousemove', (e) => {
        const rect = canvas.getBoundingClientRect();
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;
      });
      heroElem.addEventListener('mouseleave', () => {
        mouse.x = -1000;
        mouse.y = -1000;
      });
    }

    function drawBezierArc(p1, p2, progress, color) {
      const midX = (p1.x + p2.x) / 2;
      const midY = (p1.y + p2.y) / 2 - Math.min(width, height) * 0.16;

      // Draw route arc line
      ctx.beginPath();
      ctx.moveTo(p1.x, p1.y);
      ctx.quadraticCurveTo(midX, midY, p2.x, p2.y);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 4]);
      ctx.stroke();
      ctx.setLineDash([]);

      // Calculate airplane position on curve
      const t = progress;
      const invT = 1 - t;
      const planeX = invT * invT * p1.x + 2 * invT * t * midX + t * t * p2.x;
      const planeY = invT * invT * p1.y + 2 * invT * t * midY + t * t * p2.y;

      // Plane glow & pulse
      const gradient = ctx.createRadialGradient(planeX, planeY, 0, planeX, planeY, 14);
      gradient.addColorStop(0, color);
      gradient.addColorStop(0.4, color);
      gradient.addColorStop(1, 'transparent');

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(planeX, planeY, 14, 0, Math.PI * 2);
      ctx.fill();

      // Plane core dot
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(planeX, planeY, 2.5, 0, Math.PI * 2);
      ctx.fill();
    }

    function animateMotionCanvas() {
      ctx.clearRect(0, 0, width, height);

      // Draw flight arcs
      flightArcs.forEach(arc => {
        arc.progress = (arc.progress + arc.speed) % 1;
        const p1 = particles[arc.from];
        const p2 = particles[arc.to];
        if (p1 && p2) {
          drawBezierArc(p1, p2, arc.progress, arc.color);
        }
      });

      // Draw destination nodes
      particles.forEach(p => {
        p.pulse += 0.04;
        const pulseSize = Math.sin(p.pulse) * 4 + 7;

        // Radar ring
        ctx.strokeStyle = p.isHoly ? 'rgba(234, 179, 8, 0.45)' : 'rgba(56, 189, 248, 0.35)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, pulseSize + p.radius, 0, Math.PI * 2);
        ctx.stroke();

        // Node center
        ctx.fillStyle = p.isHoly ? '#eab308' : '#38bdf8';
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();

        // City label
        ctx.font = '10px Poppins, sans-serif';
        ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
        ctx.fillText(p.name, p.x + 8, p.y + 3);

        // Mouse interaction line
        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < mouse.radius) {
          ctx.strokeStyle = `rgba(234, 179, 8, ${1 - dist / mouse.radius})`;
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          ctx.moveTo(mouse.x, mouse.y);
          ctx.lineTo(p.x, p.y);
          ctx.stroke();
        }
      });

      requestAnimationFrame(animateMotionCanvas);
    }

    animateMotionCanvas();
  }


  // =========================================================================
  // 2. INTERACTIVE FLIGHT ROUTE RADAR SIMULATOR
  // =========================================================================
  const radarRoutes = {
    jeddah: {
      origin: 'Lahore (LHE)',
      destination: 'Jeddah (JED) - Umrah Route',
      altitude: '38,000 FT',
      speed: '865 KM/H',
      distance: '4,120 KM',
      time: '04:55 hrs remaining',
      status: 'En Route to King Abdulaziz Airport',
      pct: 68
    },
    dubai: {
      origin: 'Islamabad (ISB)',
      destination: 'Dubai International (DXB)',
      altitude: '36,000 FT',
      speed: '840 KM/H',
      distance: '1,930 KM',
      time: '02:40 hrs remaining',
      status: 'Smooth Cruise over Arabian Sea',
      pct: 54
    },
    istanbul: {
      origin: 'Karachi (KHI)',
      destination: 'Istanbul Airport (IST)',
      altitude: '39,000 FT',
      speed: '890 KM/H',
      distance: '3,950 KM',
      time: '05:20 hrs remaining',
      status: 'Approaching Turkish Airspace',
      pct: 72
    },
    london: {
      origin: 'Lahore (LHE)',
      destination: 'London Heathrow (LHR)',
      altitude: '41,000 FT',
      speed: '910 KM/H',
      distance: '6,310 KM',
      time: '07:45 hrs remaining',
      status: 'Trans-European High-Altitude Corridor',
      pct: 42
    }
  };

  const routeBtns = document.querySelectorAll('.radar-route-btn');
  const radarOrigin = document.getElementById('radarOrigin');
  const radarDest = document.getElementById('radarDest');
  const radarAlt = document.getElementById('radarAlt');
  const radarSpd = document.getElementById('radarSpd');
  const radarDist = document.getElementById('radarDist');
  const radarTime = document.getElementById('radarTime');
  const radarStatus = document.getElementById('radarStatus');
  const radarProgressBar = document.getElementById('radarProgressBar');
  const radarPlaneIcon = document.getElementById('radarPlaneIcon');

  function updateRadar(routeKey) {
    const data = radarRoutes[routeKey] || radarRoutes.jeddah;
    if (radarOrigin) radarOrigin.textContent = data.origin;
    if (radarDest) radarDest.textContent = data.destination;
    if (radarAlt) radarAlt.textContent = data.altitude;
    if (radarSpd) radarSpd.textContent = data.speed;
    if (radarDist) radarDist.textContent = data.distance;
    if (radarTime) radarTime.textContent = data.time;
    if (radarStatus) radarStatus.textContent = data.status;
    if (radarProgressBar) radarProgressBar.style.width = `${data.pct}%`;
    if (radarPlaneIcon) radarPlaneIcon.style.left = `${data.pct}%`;

    routeBtns.forEach(btn => {
      if (btn.getAttribute('data-route') === routeKey) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
  }

  routeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const routeKey = btn.getAttribute('data-route');
      updateRadar(routeKey);
    });
  });

  updateRadar('jeddah');


  // =========================================================================
  // 3. LIVE 2026 WORLD CLOCKS (Makkah, Madinah, Dubai, London, Pakistan)
  // =========================================================================
  function updateWorldClocks() {
    const now = new Date();

    // Pakistan (UTC+5)
    const pktHours = (now.getUTCHours() + 5) % 24;
    const pktMins = now.getUTCMinutes();
    const pktSecs = now.getUTCSeconds();

    // Makkah & Madinah (UTC+3)
    const astHours = (now.getUTCHours() + 3) % 24;
    const astMins = now.getUTCMinutes();
    const astSecs = now.getUTCSeconds();

    // Dubai (UTC+4)
    const gstHours = (now.getUTCHours() + 4) % 24;
    const gstMins = now.getUTCMinutes();
    const gstSecs = now.getUTCSeconds();

    // London (UTC+0 / UTC+1)
    const gmtHours = (now.getUTCHours() + 1) % 24; // BST
    const gmtMins = now.getUTCMinutes();
    const gmtSecs = now.getUTCSeconds();

    function pad(n) { return n.toString().padStart(2, '0'); }

    const makkahEl = document.getElementById('clockMakkah');
    const madinahEl = document.getElementById('clockMadinah');
    const dubaiEl = document.getElementById('clockDubai');
    const londonEl = document.getElementById('clockLondon');

    if (makkahEl) makkahEl.textContent = `${pad(astHours)}:${pad(astMins)}:${pad(astSecs)}`;
    if (madinahEl) madinahEl.textContent = `${pad(astHours)}:${pad(astMins)}:${pad(astSecs)}`;
    if (dubaiEl) dubaiEl.textContent = `${pad(gstHours)}:${pad(gstMins)}:${pad(gstSecs)}`;
    if (londonEl) londonEl.textContent = `${pad(gmtHours)}:${pad(gmtMins)}:${pad(gmtSecs)}`;
  }

  setInterval(updateWorldClocks, 1000);
  updateWorldClocks();


  // =========================================================================
  // 4. 3D PHYSICS TILT EFFECT FOR CARDS
  // =========================================================================
  const tiltCards = document.querySelectorAll('[data-tilt]');

  tiltCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -9; // Max 9 deg tilt
      const rotateY = ((x - centerX) / centerX) * 9;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px) scale3d(1.02, 1.02, 1.02)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0) scale3d(1, 1, 1)';
    });
  });


  // =========================================================================
  // 5. AMBIENT MOUSE SPOTLIGHT (2026 CUTTING-EDGE CURSOR GLOW)
  // =========================================================================
  const spotlight = document.createElement('div');
  spotlight.className = 'ambient-cursor-glow';
  document.body.appendChild(spotlight);

  let mouseX = 0, mouseY = 0;
  let spotX = 0, spotY = 0;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  function renderSpotlight() {
    spotX += (mouseX - spotX) * 0.12;
    spotY += (mouseY - spotY) * 0.12;
    spotlight.style.transform = `translate(${spotX - 180}px, ${spotY - 180}px)`;
    requestAnimationFrame(renderSpotlight);
  }

  renderSpotlight();

});
