document.addEventListener('DOMContentLoaded', () => {
  initTerminal();
  initBloodCanvas();
  initVirusEvasion();
  initConceptMap();
  initScrollNav();
});

/* =========================================================================
   1. TERMINAL CHOICE BRANCH SYSTEM (ENTRY GATE)
   ========================================================================= */
const terminalQuestions = [
  {
    text: "WARNING: ACCESSING SECURED ARCHIVE [ZOMBIE:LIBERATION_MONSTER].\nIDENTIFYING BIOMETRIC SIGNALS... UNKNOWN SUBJECT DETECTED.\n\nQ1. 당신은 거대한 재난과 종말의 징후 앞에서 어떤 행동을 취하겠습니까?",
    choices: [
      { text: "[ ROUTE A ] 철저한 격리 장벽을 세우고, 이성적인 통제 시스템에 편입된다.", value: "survival" },
      { text: "[ ROUTE B ] 격리 장벽을 넘어, 감염의 두려움을 무릅쓰고 타자와 연대한다.", value: "liberation" }
    ]
  },
  {
    text: "DECISION REGISTED. COLLECTING NEURAL DATA...\nSYSTEM OVERRIDE DETECTED. ANALYZING CORE IDEOLOGY...\n\nQ2. 당신에게 '좀비'는 무엇으로 정의됩니까?",
    choices: [
      { text: "[ OPTION A ] 인류의 생존을 저해하는 비이성적인 공포이자 철저히 박멸해야 할 괴물.", value: "quarantine" },
      { text: "[ OPTION B ] 기존 체제의 모순을 폭로하고 새로운 세계의 주체로 거듭나는 해방의 괴물.", value: "emancipation" }
    ]
  }
];

let currentStep = 0;
let userChoices = [];

function initTerminal() {
  const terminalOverlay = document.getElementById('terminal-overlay');
  const terminalText = document.getElementById('terminal-text');
  const terminalChoices = document.getElementById('terminal-choices');
  
  if (!terminalOverlay) return;
  
  // Disable body scrolling initially
  document.body.style.overflow = 'hidden';
  
  function renderStep() {
    terminalChoices.innerHTML = '';
    const stepData = terminalQuestions[currentStep];
    
    // Typewriter effect
    typeWriter(stepData.text, terminalText, () => {
      // Show choices after text finishes typing
      stepData.choices.forEach(choice => {
        const btn = document.createElement('button');
        btn.className = 'choice-btn';
        btn.textContent = choice.text;
        btn.addEventListener('click', () => selectChoice(choice.value));
        terminalChoices.appendChild(btn);
      });
    });
  }
  
  function selectChoice(value) {
    userChoices.push(value);
    currentStep++;
    
    if (currentStep < terminalQuestions.length) {
      renderStep();
    } else {
      bootSystem();
    }
  }
  
  function typeWriter(text, element, callback) {
    element.textContent = '';
    let index = 0;
    const speed = 15; // ms per character
    
    function type() {
      if (index < text.length) {
        element.textContent += text.charAt(index);
        index++;
        setTimeout(type, speed);
      } else if (callback) {
        callback();
      }
    }
    type();
  }
  
  function bootSystem() {
    terminalChoices.innerHTML = '';
    terminalText.innerHTML = '';
    
    const bootContainer = document.createElement('div');
    bootContainer.className = 'booting-screen';
    bootContainer.innerHTML = `
      <p style="color: var(--accent-red); margin-bottom: 0.5rem; font-weight: bold;">[ BOOTING ZOMBIE:ARCHIVE CORE SYSTEM ]</p>
      <p style="font-size: 0.8rem; color: var(--text-secondary);" id="boot-status">INITIALIZING ARCHIVE DATA DECRYPTION...</p>
      <div class="boot-progress-bar"><div class="boot-progress-fill" id="boot-progress"></div></div>
    `;
    
    terminalText.appendChild(bootContainer);
    
    const progressFill = document.getElementById('boot-progress');
    const bootStatus = document.getElementById('boot-status');
    let width = 0;
    
    const statuses = [
      "DECRYPTING CHAPTER RECORDS...",
      "LOADING CONCEPTUAL GEOGRAPHY NODE NETWORKS...",
      "INJECTING BLOOD PARTICLES & PATH PATHWAYS...",
      "SYSTEM CLEAR. ACCESSING ARCHIVE..."
    ];
    
    const interval = setInterval(() => {
      if (width >= 100) {
        clearInterval(interval);
        
        // Final transition
        setTimeout(() => {
          // Set custom route layout attribute
          const primaryRoute = userChoices[0]; // 'survival' or 'liberation'
          document.documentElement.setAttribute('data-route', primaryRoute);
          
          terminalOverlay.classList.add('fade-out');
          document.getElementById('main-archive').classList.add('active');

          window.scrollTo(0, 0);
          document.body.style.overflow = 'auto';
          
          // Trigger custom entry splash
          console.log(`System booted successfully on [${primaryRoute.toUpperCase()}] route.`);
        }, 500);
      } else {
        width += 2;
        progressFill.style.width = width + '%';
        
        // Update status subtext
        if (width === 25) bootStatus.textContent = statuses[0];
        if (width === 50) bootStatus.textContent = statuses[1];
        if (width === 75) bootStatus.textContent = statuses[2];
        if (width === 95) bootStatus.textContent = statuses[3];
      }
    }, 30);
  }
  
  renderStep();
}

/* =========================================================================
   2. DRIPPING BLOOD CURSOR TRAIL (HTML5 CANVAS)
   ========================================================================= */
let canvas, ctx;
let particles = [];
let mouse = { x: 0, y: 0, lastX: 0, lastY: 0, speed: 0 };
let isMouseActive = false;

function initBloodCanvas() {
  canvas = document.getElementById('blood-canvas');
  if (!canvas) return;
  
  ctx = canvas.getContext('2d');
  resizeCanvas();
  
  window.addEventListener('resize', resizeCanvas);
  
  window.addEventListener('mousemove', (e) => {
    isMouseActive = true;
    mouse.lastX = mouse.x;
    mouse.lastY = mouse.y;
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    
    // Calculate speed
    const dx = mouse.x - mouse.lastX;
    const dy = mouse.y - mouse.lastY;
    mouse.speed = Math.sqrt(dx*dx + dy*dy);
    
    // Add dripping particles based on speed
    if (mouse.speed > 2) {
      const count = Math.min(Math.floor(mouse.speed / 4), 6);
      for (let i = 0; i < count; i++) {
        createBloodDrop(mouse.x, mouse.y, false);
      }
    }
  });
  
  // Periodic random dripping when mouse moves slowly or stops
  setInterval(() => {
    if (isMouseActive && Math.random() < 0.25) {
      createBloodDrop(mouse.x + (Math.random() * 20 - 10), mouse.y + 10, true);
    }
  }, 150);
  
  animateParticles();
}

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

class BloodParticle {
  constructor(x, y, isHeavyDrip) {
    this.x = x;
    this.y = y;
    // Heavy drips fall straight down, normal sprays disperse
    this.vx = isHeavyDrip ? (Math.random() * 0.4 - 0.2) : (Math.random() * 3 - 1.5);
    this.vy = isHeavyDrip ? (Math.random() * 2 + 1) : (Math.random() * 1.5 - 0.5);
    this.radius = isHeavyDrip ? (Math.random() * 3 + 2.5) : (Math.random() * 2.5 + 1);
    this.alpha = Math.random() * 0.4 + 0.6;
    this.gravity = isHeavyDrip ? 0.12 : 0.08;
    this.fade = Math.random() * 0.01 + 0.008;
    this.color = Math.random() < 0.3 ? '#800a0a' : '#da1212'; // Mix of dark blood and bright blood
  }
  
  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.vy += this.gravity; // Apply gravity
    this.radius -= 0.015;    // Shrink slightly
    this.alpha -= this.fade; // Fade out
  }
  
  draw() {
    ctx.save();
    ctx.beginPath();
    ctx.arc(this.x, this.y, Math.max(0, this.radius), 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.globalAlpha = Math.max(0, this.alpha);
    
    // Add subtle shadow glow
    ctx.shadowColor = 'rgba(128, 10, 10, 0.4)';
    ctx.shadowBlur = 4;
    
    ctx.fill();
    ctx.restore();
  }
}

function createBloodDrop(x, y, isHeavyDrip) {
  particles.push(new BloodParticle(x, y, isHeavyDrip));
}

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i];
    p.update();
    p.draw();
    
    // Remove faded/invisible particles
    if (p.alpha <= 0 || p.radius <= 0 || p.y > window.innerHeight) {
      particles.splice(i, 1);
    }
  }
  
  requestAnimationFrame(animateParticles);
}

/* =========================================================================
   3. VIRUS EVADING PHYSICS BACKGROUND (VIEWPORT-FIXED VECTOR MOVEMENT)
   ========================================================================= */
let virusElements = [];
const virusCount = 12;

const virusSVGContent = `
  <svg viewBox="0 0 100 100" class="virus-svg">
    <defs>
      <radialGradient id="virusGrad" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="#FF0000" stop-opacity="1.0"/> 
        <stop offset="55%" stop-color="#FF0000" stop-opacity="0.8"/>
        <stop offset="100%" stop-color="#000000" stop-opacity="0"/>
      </radialGradient>
    </defs>
    <circle cx="50" cy="50" r="28" fill="url(#virusGrad)"/>
    
    <path d="M50 10 L50 25 M50 90 L50 75 M10 50 L25 50 M90 50 L75 50 M22 22 L32 32 M78 78 L68 68 M22 78 L32 68 M78 22 L68 32" 
          stroke="#FF0000" stroke-width="6" stroke-linecap="round"/>
    
    <circle cx="50" cy="10" r="5" fill="#FF0000"/>
    <circle cx="50" cy="90" r="5" fill="#FF0000"/>
    <circle cx="10" cy="50" r="5" fill="#FF0000"/>
    <circle cx="90" cy="50" r="5" fill="#FF0000"/>
  </svg>
`;

function initVirusEvasion() {
  const container = document.getElementById('virus-container');
  if (!container) return;
  
  // Clean up and spawn elements
  container.innerHTML = '';
  
  for (let i = 0; i < virusCount; i++) {
    const el = document.createElement('div');
    el.className = 'evading-virus';
    el.innerHTML = virusSVGContent;
    container.appendChild(el);
    
    // Disperse anchor points across the grid
    const anchorX = Math.random() * window.innerWidth;
    const anchorY = Math.random() * window.innerHeight;
    const scale = Math.random() * 0.6 + 0.5; // Size variation 0.5x to 1.1x
    
    virusElements.push({
      element: el,
      ax: anchorX, // Anchor X
      ay: anchorY, // Anchor Y
      x: anchorX,  // Current X
      y: anchorY,  // Current Y
      vx: 0,
      vy: 0,
      scale: scale,
      angle: Math.random() * 360,
      spinSpeed: (Math.random() * 0.4 + 0.1) * (Math.random() < 0.5 ? -1 : 1),
      noiseOffset: Math.random() * 1000
    });
  }
  
  window.addEventListener('resize', () => {
    // Re-anchor elements relatively on resize
    virusElements.forEach(v => {
      v.ax = Math.random() * window.innerWidth;
      v.ay = Math.random() * window.innerHeight;
    });
  });
  
  // Start the physics loop
  updateVirusPhysics();
}

function updateVirusPhysics() {
  const evasionRadius = 150;
  const evasionForce = 4.5;
  const springK = 0.008; // Spring stiffness
  const damping = 0.92;  // Velocity friction
  
  const time = Date.now() * 0.001;
  
  virusElements.forEach(v => {
    // 1. Natural floating noise
    v.noiseOffset += 0.005;
    const driftX = Math.sin(time + v.noiseOffset) * 0.25;
    const driftY = Math.cos(time + v.noiseOffset * 1.3) * 0.25;
    
    // 2. Mouse evasion vector calculation
    let evadingX = 0;
    let evadingY = 0;
    
    if (isMouseActive) {
      const dx = v.x - mouse.x;
      const dy = v.y - mouse.y;
      const dist = Math.sqrt(dx*dx + dy*dy);
      
      if (dist < evasionRadius && dist > 10) {
        // Evasive push multiplier: strong when close, zero at boundary
        const force = ((evasionRadius - dist) / evasionRadius) * evasionForce;
        evadingX = (dx / dist) * force;
        evadingY = (dy / dist) * force;
      }
    }
    
    // 3. Spring restoring force towards original anchor
    const rx = (v.ax - v.x) * springK;
    const ry = (v.ay - v.y) * springK;
    
    // 4. Update velocity and position
    v.vx += evadingX + rx + driftX;
    v.vy += evadingY + ry + driftY;
    
    v.vx *= damping;
    v.vy *= damping;
    
    v.x += v.vx;
    v.y += v.vy;
    
    // Spin animation
    v.angle += v.spinSpeed;
    
    // Apply transform styling
    v.element.style.transform = `translate3d(${v.x - 40}px, ${v.y - 40}px, 0) scale(${v.scale}) rotate(${v.angle}deg)`;
  });
  
  requestAnimationFrame(updateVirusPhysics);
}

/* =========================================================================
   4. INTERACTIVE CONCEPTUAL MINDMAP
   ========================================================================= */
const conceptData = {
  "pandemic": {
    title: "팬데믹 (Pandemic)",
    desc: "생명을 위협하는 전염병 재난을 넘어, 자본주의 문명의 모순과 예외상태가 전면화되는 임계점.<br><br>단순한 생물학적 바이러스 감염을 넘어 사회 구조적 격리와 통치 통제가 완성되며 예외상태가 마침내 일상으로 틈입하는 거대한 균열을 의미합니다."
  },
  "zombie": {
    title: "좀비 (Zombie)",
    desc: "생과 사의 경계를 무너뜨리고 인간적 예외상태를 고발하는 대중의 괴물이이자, 낡은 체제를 전복하는 새로운 주체.<br><br>과거 부두교의 노예에서 근대 감염병 괴물을 거쳐, 현재는 통치 권력에 의해 벌거벗겨진 생명(호모 사케르)들을 상징하고 마침내 재난 이후의 해방을 주도하는 주체로 진화합니다."
  },
  "liberation": {
    title: "해방 (Liberation)",
    desc: "절망의 극한에서 피어나는 연대. 자본의 관리와 방역 장벽을 허물어뜨리는 자유와 주체성의 획득.<br><br>지배 권력이 부과한 '생명 관리적 격리'를 돌파하여 경계면을 허물어뜨리고, 억압받던 비인간(좀비)이 비로소 능동적으로 자신의 세계를 개척해 나가는 혁명적 횡단을 지칭합니다."
  },
  "philosophy": {
    title: "철학적 사유 (Philosophy)",
    desc: "익숙한 일상의 붕괴 속에서 종말과 재난, 그리고 유토피아적 사유의 가능성을 횡단하는 성찰의 렌즈.<br><br>이 책은 좀비를 오락 영화의 소재로 다루는 대중문화 비평에 머물지 않고, 아감벤, 맑스, 에스포지토 등의 현대 사상가들을 빌려 현실의 통치 공포를 급진적으로 사유하는 철학을 구축합니다."
  },
  "disaster": {
    title: "재난 (Disaster)",
    desc: "통치 권력이 예외상태를 선언하고 인간을 벌거벗은 생명으로 전락시키는 동시에, 공동체의 새로운 연대를 싹트게 하는 계기.<br><br>자본주의가 위기 속에서 어떻게 착취를 정당화하는지 폭로하는 동시에, 기존 질서가 마비된 틈을 타 생존자들이 이기심을 넘어 이타적인 상호 보조 공동체를 구성하도록 유도하는 이중의 통로입니다."
  },
  "utopia": {
    title: "유토피아 (Utopia)",
    desc: "단순히 올 수 없는 미래의 낙원이 아니라, 아포칼립스의 어둠 한가운데서 주체들이 직조해내는 구체적인 희망의 영토.<br><br>종말을 넘어서는 유토피아는 모든 모순이 해결된 완전무결한 상태가 아닌, 파국의 상흔 속에서 감염자들과 생존자들이 '함께 살아내며' 경계를 돌파하는 좀비적 연대의 공간입니다."
  },
  "culture": {
    title: "문화연구 (Cultural Study)",
    desc: "대중문화 서사(영화, 소설) 속 좀비 형상의 역사적 변천을 아감벤 등의 사상을 통해 해독하는 비판적 사유.<br><br>〈부산행〉, 〈서울역〉, 〈워킹 데드〉, 〈군체〉 등 포스트 아포칼립스 장르의 서사를 해체하여 계급 갈등, 예외상태의 확장, 홈리스 배제, 하이브 마인드의 자본 착취 등을 종횡무진 추적합니다."
  },
  "eschatology": {
    title: "종말론 (Eschatology)",
    desc: "파국에 대한 공포에 갇히는 대신, 파국 이후의 세계를 능동적으로 상상하며 '재난 자본주의'에 정면으로 맞서게 하는 원동력.<br><br>자본주의가 심어둔 영구적 공포와 종말 시나리오를 뒤집어, '종말 이후에도 우리는 어떻게 타자와 조우하고 연대할 것인가'를 묻는 근본적인 종말 사유로 나아갑니다."
  }
};

const mapNodes = [
  { id: "pandemic", x: 25, y: 25, name: "팬데믹" },
  { id: "zombie", x: 55, y: 20, name: "좀비" },
  { id: "liberation", x: 80, y: 35, name: "해방" },
  { id: "philosophy", x: 50, y: 50, name: "철학적 사유" },
  { id: "disaster", x: 20, y: 70, name: "재난" },
  { id: "utopia", x: 75, y: 75, name: "유토피아" },
  { id: "culture", x: 45, y: 80, name: "문화연구" },
  { id: "eschatology", x: 82, y: 55, name: "종말론" }
];

const mapConnections = [
  ["pandemic", "zombie"],
  ["pandemic", "disaster"],
  ["zombie", "liberation"],
  ["philosophy", "culture"],
  ["philosophy", "eschatology"],
  ["disaster", "philosophy"],
  ["liberation", "utopia"],
  ["utopia", "philosophy"],
  ["eschatology", "utopia"],
  ["culture", "zombie"]
];

function initConceptMap() {
  const viewport = document.getElementById('concept-map-viewport');
  const svg = document.getElementById('concept-map-svg');
  if (!viewport || !svg) return;
  
  // Clear SVG and elements
  svg.innerHTML = '';
  const nodeContainer = document.createElement('div');
  nodeContainer.id = 'concept-nodes-wrapper';
  viewport.appendChild(nodeContainer);
  
  const width = viewport.clientWidth;
  const height = viewport.clientHeight;
  
  // 1. Draw Connection Lines
  mapConnections.forEach(([fromId, toId]) => {
    const fromNode = mapNodes.find(n => n.id === fromId);
    const toNode = mapNodes.find(n => n.id === toId);
    
    if (fromNode && toNode) {
      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line.setAttribute('class', `concept-link-line l-${fromId} l-${toId}`);
      line.setAttribute('x1', `${fromNode.x}%`);
      line.setAttribute('y1', `${fromNode.y}%`);
      line.setAttribute('x2', `${toNode.x}%`);
      line.setAttribute('y2', `${toNode.y}%`);
      svg.appendChild(line);
    }
  });
  
  // 2. Render Node Elements
  mapNodes.forEach(node => {
    const nodeEl = document.createElement('div');
    nodeEl.className = 'concept-node';
    nodeEl.style.left = `${node.x}%`;
    nodeEl.style.top = `${node.y}%`;
    nodeEl.setAttribute('data-id', node.id);
    
    nodeEl.innerHTML = `
      <div class="concept-node-circle"></div>
      <div class="concept-node-label">${node.name}</div>
    `;
    
    nodeEl.addEventListener('click', () => selectConcept(node.id));
    nodeContainer.appendChild(nodeEl);
  });
  
  // 3. Selection Function
  function selectConcept(id) {
    // Reset all nodes and lines
    document.querySelectorAll('.concept-node').forEach(el => el.classList.remove('active'));
    document.querySelectorAll('.concept-link-line').forEach(el => el.classList.remove('active'));
    
    // Set clicked node active
    const activeNode = document.querySelector(`.concept-node[data-id="${id}"]`);
    if (activeNode) activeNode.classList.add('active');
    
    // Set connected lines active
    document.querySelectorAll(`.concept-link-line.l-${id}`).forEach(el => el.classList.add('active'));
    
    // Update Details panel with content fade
    const panelTitle = document.getElementById('concept-detail-title');
    const panelBody = document.getElementById('concept-detail-body');
    const data = conceptData[id];
    
    if (panelTitle && panelBody && data) {
      // Fade out
      panelTitle.style.opacity = 0;
      panelBody.style.opacity = 0;
      
      setTimeout(() => {
        panelTitle.textContent = data.title;
        panelBody.innerHTML = data.desc;
        
        // Fade in
        panelTitle.style.transition = 'opacity 0.4s';
        panelBody.style.transition = 'opacity 0.4s';
        panelTitle.style.opacity = 1;
        panelBody.style.opacity = 1;
      }, 200);
    }
  }
  
  // Select initial node
  setTimeout(() => selectConcept('zombie'), 400);
  
  // SVG size adjust on window resize
  window.addEventListener('resize', () => {
    // Redraw connections just in case percentage updates
    document.querySelectorAll('.concept-link-line').forEach(line => {
      // SVGs use relative percentages, so they resize automatically!
    });
  });
}

/* =========================================================================
   5. UTILS & NAVIGATION SCROLL SYNC
   ========================================================================= */
function initScrollNav() {
  const sections = document.querySelectorAll('section[id]');
  const navLi = document.querySelectorAll('.nav-links li');
  
  window.addEventListener('scroll', () => {
    let current = '';
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (window.scrollY >= (sectionTop - sectionHeight / 3)) {
        current = section.getAttribute('id');
      }
    });
    
    navLi.forEach(li => {
      li.classList.remove('active');
      const href = li.querySelector('a').getAttribute('href');
      if (href === `#${current}`) {
        li.classList.add('active');
      }
    });
  });
  
  // Custom scrolling indicator scroll triggering
  const scrollIndicator = document.getElementById('scroll-indicator');
  if (scrollIndicator) {
    scrollIndicator.addEventListener('click', () => {
      const nextSection = document.getElementById('introduction');
      if (nextSection) {
        nextSection.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }
}
window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;
  
  // 스크롤을 500px 이상 내리면 붉은색으로, 아니면 검은색으로
  if (scrollY > 500) {
    document.body.style.backgroundColor = '#1a0000'; 
  } else {
    document.body.style.backgroundColor = '#000000'; 
  }
});
// 5초 후 자동으로 인트로가 부드럽게 사라지는 코드
setTimeout(() => {
    const intro = document.getElementById('first-intro');
    if (intro) {
        intro.style.opacity = '0'; // 5초 뒤에 서서히 투명해짐
        setTimeout(() => {
            intro.style.display = 'none'; // 1초 뒤(총 6초 뒤) 완전히 제거
        }, 1000);
    }
}, 5000); // 5초 대기
