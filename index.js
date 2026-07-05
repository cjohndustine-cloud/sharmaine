 (function(){
  "use strict";
 /* ---------------- inject lily svgs from template ---------------- */
  const lilyTpl = document.getElementById('lily-template');
  function makeLily(){ return lilyTpl.content.cloneNode(true); }
  document.querySelectorAll('.lily').forEach(el => el.appendChild(makeLily()));
  document.getElementById('lilyLeft').innerHTML = lilyTpl.innerHTML;
  document.getElementById('lilyRight').innerHTML = lilyTpl.innerHTML;

  // cake lily decorations (small lily glyphs along the tiers)
  const cakeLiliesG = document.getElementById('cakeLilies');
  const lilySpots = [[75,225],[245,225],[100,165],[220,165]];
  lilySpots.forEach(([x,y])=>{
    const g = document.createElementNS('http://www.w3.org/2000/svg','g');
    g.setAttribute('transform', `translate(${x-9},${y-9}) scale(0.28)`);
    g.innerHTML = `<path d="M32 58C32 58 14 46 14 30C14 20 21 13 32 13C43 13 50 20 50 30C50 46 32 58 32 58Z" stroke="#93A87E" stroke-width="2.4" fill="#FFFDFB"/>`;
    cakeLiliesG.appendChild(g);
  });

  /* ---------------- reveal on scroll ---------------- */
  const revealEls = document.querySelectorAll('.reveal');
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){
        entry.target.classList.add('visible');
      }
    });
  }, {threshold:0.18});
  revealEls.forEach(el=>io.observe(el));

  /* ---------------- photo gallery ---------------- */
  // Add / remove entries here. "photo" points to a file in the img/ folder
  // (one level up from this html file). Leave "photo" out to show a lily
  // placeholder card instead of a real picture.
  const memories = [
    { photo: 's4.jpg',  caption: 'A beautiful moment together' },
    { photo: 's5.jpg',  caption: 'Laughing under the stars' },
    { photo: 's6.jpg',  caption: 'Our favorite coffee date' },
    { photo: 's7.jpg',  caption: 'Golden days' },
    { photo: 's8.jpg',  caption: 'Silly and sweet' },
    { photo: 's9.jpg',  caption: 'Adventures together' },
    { photo: 's10.jpg', caption: 'Growing up so fast' },
    { photo: 's11.jpg', caption: 'Just us' },
    { photo: 's12.jpg', caption: 'Laughter, always' },
    { photo: 's13.jpg', caption: 'Becoming you' },
    { photo: 's14.jpg', caption: 'Ready for what\'s next' },
    { photo: 's15.jpg', caption: 'Forever grateful for you' }
  ];

  const track = document.getElementById('galleryTrack');
  const lightbox = document.getElementById('lightbox');
  const lightboxInner = document.getElementById('lightboxInner');
  const lightboxClose = document.getElementById('lightboxClose');

  function buildCards(list){
    return list.map(m=>{
      const card = document.createElement('div');
      card.className = 'photo-card';
      if(m.photo){
        card.innerHTML = `
          <img src="${m.photo}" alt="${m.caption}" loading="lazy">
          <div class="frame-edge"></div>
          <div class="caption">${m.caption}</div>`;
      } else {
        card.innerHTML = `
          <div class="placeholder">
            <div class="lily"></div>
            <p>${m.caption}</p>
          </div>
          <div class="frame-edge"></div>
          <div class="caption">${m.caption}</div>`;
        card.querySelector('.lily').appendChild(makeLily());
      }
      card.addEventListener('click', ()=>openLightbox(m));
      return card;
    });
  }
  buildCards(memories).forEach(c=>track.appendChild(c));
  buildCards(memories).forEach(c=>track.appendChild(c)); // duplicate for seamless scroll loop

  function openLightbox(memory){
    if(memory.photo){
      lightboxInner.innerHTML = `
        <img src="${memory.photo}" alt="${memory.caption}">
        <p class="lightbox-caption">${memory.caption}</p>`;
    } else {
      lightboxInner.innerHTML = `<div style="padding:60px 30px; text-align:center; background:linear-gradient(160deg,#F6DCE2,#FFFDFB 55%,#CBD9BD);">
          <div class="lily" style="width:90px;height:90px;margin:0 auto 18px;color:#6E8058;"></div>
          <p style="font-family:'Great Vibes',cursive; font-size:2.1rem; color:#B5748A; margin:0;">${memory.caption}</p>
        </div>`;
      lightboxInner.querySelector('.lily').appendChild(makeLily());
    }
    lightbox.classList.add('active');
  }
  lightboxClose.addEventListener('click', ()=>lightbox.classList.remove('active'));
  lightbox.addEventListener('click', (e)=>{ if(e.target===lightbox) lightbox.classList.remove('active'); });

  /* ---------------- cake interaction ---------------- */
  const cake = document.getElementById('cakeSvg');
  function lilyConfetti(){
    const defaults = { spread: 100, ticks: 200, gravity: 0.6, decay: 0.94, startVelocity: 22 };
    const colors = ['#F6DCE2','#E6B8C6','#CBD9BD','#C9A876','#FFFDFB'];
    if(window.confetti){
      window.confetti(Object.assign({}, defaults, {
        particleCount: 60,
        origin: { y: 0.55 },
        colors,
        shapes: ['circle'],
        scalar: 0.9
      }));
      window.confetti(Object.assign({}, defaults, {
        particleCount: 30,
        origin: { y: 0.5, x: 0.3 },
        colors,
        scalar: 1.1
      }));
      window.confetti(Object.assign({}, defaults, {
        particleCount: 30,
        origin: { y: 0.5, x: 0.7 },
        colors,
        scalar: 1.1
      }));
    }
  }
  cake.addEventListener('click', ()=>{
    cake.classList.remove('bounce');
    void cake.offsetWidth;
    cake.classList.add('bounce','sparkling');
    lilyConfetti();
    setTimeout(()=>cake.classList.remove('sparkling'), 1400);
  });

  /* ---------------- typing letter effect ---------------- */
  const letterText = `My dearest,

Eighteen years ago the world became softer and brighter, simply because you arrived in it. Watching you grow into the thoughtful, radiant person you are today has been one of the quiet joys of my life.

Today isn't just a birthday — it's the beginning of a whole new chapter, one where your dreams get to take their first real steps into the world. Chase them gently, and boldly, and often.

Wherever this year takes you, I hope it's full of soft mornings, easy laughter, and people who love you exactly as you are.

Happy eighteenth birthday. I am, and will always be, so incredibly proud of you.`;

  const letterBody = document.getElementById('letterBody');
  let typed = false;
  function typeLetter(){
    if(typed) return;
    typed = true;
    let i = 0;
    const cursor = document.createElement('span');
    cursor.className='cursor';
    cursor.textContent='\u00A0';
    function step(){
      if(i <= letterText.length){
        letterBody.textContent = letterText.slice(0, i);
        letterBody.appendChild(cursor);
        i += 2;
        requestAnimationFrame(()=>setTimeout(step, 14));
      } else {
        cursor.remove();
      }
    }
    step();
  }
  const letterIo = new IntersectionObserver((entries)=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting) typeLetter();
    });
  }, {threshold:0.35});
  letterIo.observe(document.getElementById('letter'));

  /* ---------------- music player ---------------- */
  const audio = document.getElementById('bgAudio');
  const playBtn = document.getElementById('playPauseBtn');
  const playIcon = document.getElementById('playIcon');
  const pauseIcon = document.getElementById('pauseIcon');
  const volumeSlider = document.getElementById('volumeSlider');
  audio.volume = 0.5;
  let playing = false;
  playBtn.addEventListener('click', ()=>{
    if(!audio.src){
      // no track loaded — gentle visual feedback only
      playBtn.animate([{transform:'scale(1)'},{transform:'scale(0.9)'},{transform:'scale(1)'}], {duration:300});
      return;
    }
    if(playing){
      audio.pause();
    } else {
      audio.play().catch(()=>{});
    }
  });
  audio.addEventListener('play', ()=>{
    playing = true;
    playIcon.style.display='none';
    pauseIcon.style.display='block';
  });
  audio.addEventListener('pause', ()=>{
    playing = false;
    playIcon.style.display='block';
    pauseIcon.style.display='none';
  });
  volumeSlider.addEventListener('input', (e)=>{
    audio.volume = parseFloat(e.target.value);
  });

  /* ---------------- background canvas: petals, sparkles, bokeh ---------------- */
  const canvas = document.getElementById('bg-canvas');
  const ctx = canvas.getContext('2d');
  let W, H, DPR;
  function resize(){
    DPR = Math.min(window.devicePixelRatio || 1, 2);
    W = window.innerWidth; H = window.innerHeight;
    canvas.width = W*DPR; canvas.height = H*DPR;
    canvas.style.width = W+'px'; canvas.style.height = H+'px';
    ctx.setTransform(DPR,0,0,DPR,0,0);
  }
  resize();
  window.addEventListener('resize', resize);

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function rand(min,max){ return Math.random()*(max-min)+min; }

  // petals
  const petalCount = reduceMotion ? 0 : (window.innerWidth < 700 ? 9 : 16);
  const petals = Array.from({length:petalCount}, ()=>({
    x: rand(0,W), y: rand(-H,H),
    size: rand(8,16),
    speedY: rand(0.15,0.4),
    speedX: rand(-0.25,0.25),
    rot: rand(0,Math.PI*2),
    rotSpeed: rand(-0.006,0.006),
    hue: Math.random() < 0.5 ? '230,184,198' : '255,253,251',
    sway: rand(0.4,1.2),
    swayOff: rand(0,Math.PI*2)
  }));

  function drawPetal(p){
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rot);
    ctx.fillStyle = `rgba(${p.hue},0.75)`;
    ctx.beginPath();
    ctx.ellipse(0,0,p.size*0.55,p.size,Math.PI/4,0,Math.PI*2);
    ctx.fill();
    ctx.restore();
  }

  // sparkles
  const sparkleCount = reduceMotion ? 0 : (window.innerWidth < 700 ? 14 : 26);
  const sparkles = Array.from({length:sparkleCount}, ()=>({
    x: rand(0,W), y: rand(0,H),
    r: rand(0.6,1.8),
    phase: rand(0,Math.PI*2),
    speed: rand(0.01,0.03)
  }));

  // bokeh
  const bokehCount = reduceMotion ? 0 : 7;
  const bokehs = Array.from({length:bokehCount}, ()=>({
    x: rand(0,W), y: rand(0,H),
    r: rand(40,110),
    speedX: rand(-0.06,0.06),
    speedY: rand(-0.05,0.05),
    hue: Math.random()<0.5 ? '246,220,226' : '203,217,189',
    alpha: rand(0.08,0.16)
  }));

  let t = 0;
  function animate(){
    ctx.clearRect(0,0,W,H);

    // bokeh
    bokehs.forEach(b=>{
      b.x += b.speedX; b.y += b.speedY;
      if(b.x < -150) b.x = W+150; if(b.x > W+150) b.x = -150;
      if(b.y < -150) b.y = H+150; if(b.y > H+150) b.y = -150;
      const grad = ctx.createRadialGradient(b.x,b.y,0,b.x,b.y,b.r);
      grad.addColorStop(0, `rgba(${b.hue},${b.alpha})`);
      grad.addColorStop(1, `rgba(${b.hue},0)`);
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(b.x,b.y,b.r,0,Math.PI*2);
      ctx.fill();
    });

    // petals
    petals.forEach(p=>{
      p.y += p.speedY;
      p.x += p.speedX + Math.sin(t*0.01*p.sway + p.swayOff)*0.3;
      p.rot += p.rotSpeed;
      if(p.y > H+20){ p.y = -20; p.x = rand(0,W); }
      if(p.x > W+20) p.x = -20;
      if(p.x < -20) p.x = W+20;
      drawPetal(p);
    });

    // sparkles
    sparkles.forEach(s=>{
      s.phase += s.speed;
      const alpha = (Math.sin(s.phase)+1)/2 * 0.8 + 0.1;
      ctx.beginPath();
      ctx.fillStyle = `rgba(201,168,118,${alpha})`;
      ctx.arc(s.x,s.y,s.r,0,Math.PI*2);
      ctx.fill();
    });

    t++;
    if(!reduceMotion) requestAnimationFrame(animate);
  }
  animate();

  /* ---------------- gentle parallax on hero lilies ---------------- */
  if(!reduceMotion){
    window.addEventListener('scroll', ()=>{
      const y = window.scrollY;
      const left = document.getElementById('lilyLeft');
      const right = document.getElementById('lilyRight');
      if(left) left.style.transform = `translateY(${y*0.08}px)`;
      if(right) right.style.transform = `translateY(${y*0.08}px) scaleX(-1)`;
    }, {passive:true});
  }

})();
