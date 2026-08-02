// The exact code students paste to build the BobaBar homepage, split so the
// guide can teach one segment at a time. Keep this identical to what the images
// and rubric describe.

// The whole stylesheet. Pasted once into styles.css. It is the "paint and
// layout"; students do not need to memorize it (the comments explain the parts).
export const CSS_FULL = `/* ===== Basic reset: makes every browser start the same ===== */
* { margin: 0; padding: 0; box-sizing: border-box; }

body {
  font-family: 'Segoe UI', Arial, sans-serif;
  color: #3b2a20;            /* dark brown text */
  background: #f5ede1;       /* warm cream */
  line-height: 1.6;
}

img { max-width: 100%; display: block; }

.btn {
  display: inline-block;
  background: #c98a3c;       /* caramel button */
  color: #fff;
  padding: 12px 26px;
  border-radius: 30px;
  text-decoration: none;
  font-weight: 700;
}
.btn:hover { background: #b0762f; }
.btn-light { background: #fff; color: #3b2a20; }

.section-title { text-align: center; font-size: 32px; margin-bottom: 30px; }

/* ===== NAVBAR ===== */
.navbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 40px;
  background: #fff;
  position: sticky;          /* stays at the top while scrolling */
  top: 0;
  box-shadow: 0 2px 10px rgba(0,0,0,.06);
  z-index: 10;
}
.logo img { height: 40px; }
.nav-links a { margin-left: 26px; text-decoration: none; color: #3b2a20; font-weight: 600; }
.nav-links a:hover { color: #c98a3c; }

/* ===== HERO ===== */
.hero {
  background: linear-gradient(rgba(59,42,32,.45), rgba(59,42,32,.45)), url('images/hero-bg.png');
  background-size: cover;
  background-position: center;
  color: #fff;
  text-align: center;
  padding: 120px 20px;
}
.hero-inner { max-width: 640px; margin: 0 auto; }
.hero h1 { font-size: 46px; line-height: 1.2; margin-bottom: 16px; }
.hero p { font-size: 18px; margin-bottom: 26px; }

/* ===== ABOUT ===== */
.about { display: flex; align-items: center; gap: 40px; max-width: 1000px; margin: 0 auto; padding: 80px 20px; }
.about-img { width: 320px; border-radius: 16px; }
.about-text h2 { font-size: 32px; margin-bottom: 14px; }

/* ===== MENU ===== */
.menu { padding: 60px 20px; background: #fff; }
.menu-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; max-width: 1000px; margin: 0 auto; }
.card { background: #f5ede1; border-radius: 16px; padding: 20px; text-align: center; }
.card img { border-radius: 12px; margin-bottom: 14px; }
.card h3 { margin-bottom: 6px; }
.price { display: inline-block; margin-top: 10px; font-weight: 800; color: #c98a3c; font-size: 20px; }

/* ===== FEATURES ===== */
.features { padding: 80px 20px; }
.feature-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; max-width: 1000px; margin: 0 auto; text-align: center; }
.feature-icon { font-size: 40px; }
.feature h3 { margin: 10px 0 6px; }

/* ===== CALL TO ACTION ===== */
.cta { background: #c98a3c; color: #fff; text-align: center; padding: 70px 20px; }
.cta h2 { font-size: 32px; margin-bottom: 10px; }
.cta p { margin-bottom: 24px; }

/* ===== CONTACT ===== */
.contact { text-align: center; padding: 80px 20px; }
.contact-line { font-size: 18px; }
.contact .btn { margin-top: 20px; }

/* ===== FOOTER ===== */
.footer { background: #3b2a20; color: #f5ede1; text-align: center; padding: 30px 20px; }
.footer-socials { margin-top: 6px; opacity: .8; }

/* ===== PHONE SIZES: stack things so it still looks good on small screens ===== */
@media (max-width: 720px) {
  .navbar { padding: 14px 20px; }
  .hero h1 { font-size: 34px; }
  .about { flex-direction: column; text-align: center; }
  .menu-grid, .feature-grid { grid-template-columns: 1fr; }
}
`;

// The empty page frame. Pasted into index.html first. Every segment goes where
// the comment is, inside the <body>.
export const SKELETON = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>BobaBar — Milk Tea Shop</title>
  <link rel="stylesheet" href="styles.css" />
</head>
<body>

  <!-- Paste each segment below, in order, one after another -->

</body>
</html>
`;

export type Segment = { id: string; title: string; what: string; html: string };

export const SEGMENTS: Segment[] = [
  {
    id: 'navbar',
    title: 'Navbar',
    what: 'The bar at the very top. It holds the logo and the links that let visitors jump to each part of the page. Almost every website has one.',
    html: `<header class="navbar">
  <a class="logo" href="#home">
    <img src="images/logo.png" alt="BobaBar logo" />
  </a>
  <nav class="nav-links">
    <a href="#home">Home</a>
    <a href="#menu">Menu</a>
    <a href="#about">About</a>
    <a href="#contact">Contact</a>
  </nav>
</header>`,
  },
  {
    id: 'hero',
    title: 'Hero',
    what: 'The big first screen. A background image, one strong headline, a short line, and a button. This is the first thing people see, so it has to make them want to stay.',
    html: `<section class="hero" id="home">
  <div class="hero-inner">
    <h1>Handcrafted Milk Tea,<br />Made Fresh Daily</h1>
    <p>Real tea, real milk, and chewy pearls. Taste the difference in every cup.</p>
    <a class="btn" href="#menu">See our menu</a>
  </div>
</section>`,
  },
  {
    id: 'about',
    title: 'About',
    what: 'A short story of the company so visitors know who they are buying from. Trust makes people stay.',
    html: `<section class="about" id="about">
  <img class="about-img" src="images/about.png" alt="A cup of milk tea" />
  <div class="about-text">
    <h2>Our Story</h2>
    <p>
      BobaBar started with one simple idea: milk tea should taste homemade, not
      rushed. We brew our tea fresh every morning and cook our pearls by hand, so
      every cup is worth the wait. Come sit, sip, and stay a while.
    </p>
  </div>
</section>`,
  },
  {
    id: 'menu',
    title: 'Menu',
    what: 'The products. Each drink is a card with a picture, a name, a short line, and a price. Cards keep a lot of items neat and easy to scan.',
    html: `<section class="menu" id="menu">
  <h2 class="section-title">Our Menu</h2>
  <div class="menu-grid">
    <div class="card">
      <img src="images/menu-classic.png" alt="Classic Milk Tea" />
      <h3>Classic Milk Tea</h3>
      <p>The original. Smooth black tea with fresh milk.</p>
      <span class="price">P90</span>
    </div>
    <div class="card">
      <img src="images/menu-taro.png" alt="Taro Milk Tea" />
      <h3>Taro Milk Tea</h3>
      <p>Creamy taro with a naturally sweet, nutty flavor.</p>
      <span class="price">P110</span>
    </div>
    <div class="card">
      <img src="images/menu-matcha.png" alt="Matcha Milk Tea" />
      <h3>Matcha Milk Tea</h3>
      <p>Stone ground green tea, rich and refreshing.</p>
      <span class="price">P120</span>
    </div>
  </div>
</section>`,
  },
  {
    id: 'features',
    title: 'Features (Why choose us)',
    what: 'Three quick reasons to pick this shop over another. Short, scannable, and reassuring.',
    html: `<section class="features">
  <h2 class="section-title">Why BobaBar</h2>
  <div class="feature-grid">
    <div class="feature">
      <span class="feature-icon">🌱</span>
      <h3>Fresh Ingredients</h3>
      <p>Brewed daily. Never from powder.</p>
    </div>
    <div class="feature">
      <span class="feature-icon">👐</span>
      <h3>Handcrafted</h3>
      <p>Pearls cooked by hand every batch.</p>
    </div>
    <div class="feature">
      <span class="feature-icon">⭐</span>
      <h3>Loyalty Rewards</h3>
      <p>Every 10th drink is on us.</p>
    </div>
  </div>
</section>`,
  },
  {
    id: 'cta',
    title: 'Call to action',
    what: 'One banner that tells visitors exactly what to do next. A good homepage always asks for one clear action.',
    html: `<section class="cta">
  <h2>Ready for a treat?</h2>
  <p>Drop by today and find your new favorite cup.</p>
  <a class="btn btn-light" href="#contact">Find us</a>
</section>`,
  },
  {
    id: 'contact',
    title: 'Contact',
    what: 'Where and when to find the shop, and a button that opens an email. The email button is what makes the page truly "working".',
    html: `<section class="contact" id="contact">
  <h2 class="section-title">Visit Us</h2>
  <p class="contact-line">123 Mabini Street, Your City</p>
  <p class="contact-line">Open daily, 10:00 AM to 9:00 PM</p>
  <a class="btn" href="mailto:hello@bobabar.example">Email us</a>
</section>`,
  },
  {
    id: 'footer',
    title: 'Footer',
    what: 'The small print at the very bottom: copyright and social links. It signals the page is finished.',
    html: `<footer class="footer">
  <p>© 2026 BobaBar. Made with love (and a lot of tea).</p>
  <p class="footer-socials">Instagram · Facebook · TikTok</p>
</footer>`,
  },
];
