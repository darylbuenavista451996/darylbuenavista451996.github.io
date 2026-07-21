// Ambient constellation background, shared by the browse pages. Matches the
// home page but with no cursor interaction (calm, non-distracting).
(function () {
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var canvas = document.getElementById("constellation");
  if (!canvas) return;
  var ctx = canvas.getContext("2d");
  var W, H, DPR, pts;
  var LINK = 132, MINT = "62,180,137";
  function size() {
    DPR = Math.min(window.devicePixelRatio || 1, 2);
    W = window.innerWidth; H = window.innerHeight;
    canvas.width = W * DPR; canvas.height = H * DPR;
    canvas.style.width = W + "px"; canvas.style.height = H + "px";
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    var n = Math.max(24, Math.min(80, Math.round((W * H) / 22000)));
    pts = [];
    for (var i = 0; i < n; i++) pts.push({ x: Math.random()*W, y: Math.random()*H, vx: (Math.random()-0.5)*0.17, vy: (Math.random()-0.5)*0.17, r: Math.random()*1.6+1 });
  }
  var raf;
  function frame() {
    ctx.clearRect(0, 0, W, H);
    for (var i = 0; i < pts.length; i++) {
      var p = pts[i]; p.x += p.vx; p.y += p.vy;
      if (p.x < -20) p.x = W + 20; else if (p.x > W + 20) p.x = -20;
      if (p.y < -20) p.y = H + 20; else if (p.y > H + 20) p.y = -20;
      for (var j = i + 1; j < pts.length; j++) {
        var q = pts[j], dx = p.x - q.x, dy = p.y - q.y, d = Math.sqrt(dx*dx + dy*dy);
        if (d < LINK) { ctx.strokeStyle = "rgba(" + MINT + "," + (1 - d/LINK)*0.5 + ")"; ctx.lineWidth = 0.6; ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); ctx.stroke(); }
      }
      ctx.fillStyle = "rgba(84,224,166,0.85)"; ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 6.2832); ctx.fill();
    }
    raf = requestAnimationFrame(frame);
  }
  function start() { cancelAnimationFrame(raf); if (!reduce) raf = requestAnimationFrame(frame); else frame(); }
  window.addEventListener("resize", function () { size(); if (reduce) frame(); });
  document.addEventListener("visibilitychange", function () { if (document.hidden) cancelAnimationFrame(raf); else if (!reduce) raf = requestAnimationFrame(frame); });
  size(); start();
})();
