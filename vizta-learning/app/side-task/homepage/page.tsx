// Side Task: "Build a Company Homepage" — an out-of-curriculum, step-by-step
// guide shown to both Grade 9 and Grade 10 Media Arts. Every student builds the
// same working homepage for a milk tea shop (BobaBar) using Mobirise, a free
// drag-and-drop website builder (no coding), then publishes it and pastes the
// live link for the teacher to grade. This teaches the visual skill of building
// a page, so students can go on to make their own sites afterward. Self-guided:
// each step has a picture.
import Link from 'next/link';
import { redirect } from 'next/navigation';
import Brand from '../../Brand';
import { getSession } from '@/lib/session';
import { BASE_PATH } from '@/lib/basePath';
import {
  getSideTaskSubmission,
  HOMEPAGE_TASK_ID,
  HOMEPAGE_RUBRIC,
  HOMEPAGE_RUBRIC_TOTAL,
} from '@/lib/sideTask';
import SubmitBox from './SubmitBox';

export const dynamic = 'force-dynamic';

const IMG = (name: string) => `${BASE_PATH}/side-task/homepage/steps/${name}`;

type Step = { img?: string; title: string; body: string[]; download?: boolean; tip?: string };

const SETUP: Step[] = [
  {
    img: 'm1-download.png',
    title: 'Install Mobirise',
    body: [
      'Open your browser and go to mobirise.com',
      'Click Download, open the downloaded file, and follow the installer. Mobirise is a free app for building websites by dragging blocks. There is no coding.',
    ],
    tip: 'This is a one time install. After this you can build offline.',
  },
  {
    title: 'Get the image pack',
    body: [
      'Download the pictures below and unzip them somewhere easy to find, like your Desktop.',
      'These are the logo, background, and drink pictures you will place into your website. Everyone uses the same pack, so all sites look complete.',
    ],
    download: true,
  },
  {
    img: 'm2-editor.png',
    title: 'Open Mobirise and start a new site',
    body: [
      'Open Mobirise. Click "Create New Site" and pick any theme (the first one is fine).',
      'You now see your building screen. The red + button adds new parts to your page. The orange Publish button (top right) puts it online later.',
    ],
  },
];

// The blocks students add, in order. Each maps to a Mobirise section, an
// explanation of what that part of a webpage does, and what to type/upload.
type Block = { title: string; section: string; what: string; how: string[] };
const BLOCKS: Block[] = [
  {
    title: 'Menu (navigation bar)',
    section: 'Menu',
    what: 'The bar at the very top. It holds the logo and the links that let visitors jump around the page. Almost every website has one.',
    how: [
      'Click the red +, choose the Menu section, and click a menu block.',
      'Click the logo area and upload logo.png from your image pack.',
      'Leave the links (Home, Menu, About, Contact) as they are.',
    ],
  },
  {
    title: 'Hero',
    section: 'Headers / Hero',
    what: 'The big first screen. A background image, one strong headline, a short line, and a button. It is the first thing people see, so it has to make them want to stay.',
    how: [
      'Add a Header or Hero block with a big background.',
      'Click the background image and upload hero-bg.png',
      'Click the title and type: Handcrafted Milk Tea, Made Fresh Daily. Set the button text to: See our menu.',
    ],
  },
  {
    title: 'About',
    section: 'About',
    what: 'A short story of the company so visitors know who they are buying from. Trust makes people stay.',
    how: [
      'Add an About block that has text next to a picture.',
      'Type a short "Our Story" paragraph (3 to 4 sentences).',
      'Click the picture and upload about.png',
    ],
  },
  {
    title: 'Menu of drinks (cards)',
    section: 'Features',
    what: 'The products. Each drink is a card with a picture, a name, a short line, and a price. Cards keep many items neat and easy to scan.',
    how: [
      'Add a block that shows three cards in a row.',
      'Upload menu-classic.png, menu-taro.png, and menu-matcha.png into the three cards.',
      'Name them Classic, Taro, and Matcha, and add prices like P90, P110, P120.',
    ],
  },
  {
    title: 'Features (Why choose us)',
    section: 'Features',
    what: 'Three quick reasons to pick this shop over another. Short, scannable, and reassuring.',
    how: [
      'Add another three-item block.',
      'Type three reasons, for example: Fresh Ingredients, Handcrafted, Loyalty Rewards, each with one short line.',
    ],
  },
  {
    title: 'Contact',
    section: 'Contacts',
    what: 'Where and when to find the shop, and a button that lets people reach you. The working button is what makes the page truly useful.',
    how: [
      'Add a Contacts block.',
      'Type your address and opening hours.',
      'Set the button to open an email: for the link, type mailto: then your email (like mailto:hello@bobabar.com).',
    ],
  },
  {
    title: 'Footer',
    section: 'Footers',
    what: 'The small print at the very bottom: the company name and social links. It signals the page is finished.',
    how: [
      'Add a Footer block.',
      'Type the company name and the year, for example: BobaBar 2026.',
    ],
  },
];

const PUBLISH: Step[] = [
  {
    img: 'm5-publish.png',
    title: 'Publish your site to a folder',
    body: [
      'When your page looks good, click the eye icon to preview it, then click the orange Publish button.',
      'Choose Local Drive, pick a folder (for example a new folder on your Desktop), and click Publish. Mobirise saves your finished website into that folder.',
    ],
    tip: 'If a picture is missing, click it again and re-upload it, then publish once more.',
  },
  {
    img: 'm6-netlify.png',
    title: 'Put it online and get your link',
    body: [
      'Go to app.netlify.com/drop',
      'Drag the folder Mobirise just made onto the box on that page. In a few seconds your site is live on the internet.',
      'Sign in for free (your Gmail works) to keep your link, then copy the live link and open it in a new tab to check everything shows.',
    ],
  },
];

function StepCard({ n, step }: { n: number; step: Step }) {
  return (
    <li className="st-step">
      <div className="st-step-head">
        <span className="st-step-num">{n}</span>
        <h3>{step.title}</h3>
      </div>
      {step.img ? (
        <img className="st-img" src={IMG(step.img)} alt={`Step ${n}: ${step.title}`} loading="lazy" />
      ) : null}
      <ul className="st-step-body">
        {step.body.map((line, j) => (
          <li key={j}>{line}</li>
        ))}
      </ul>
      {step.download ? (
        <a className="btn st-download" href={`${BASE_PATH}/side-task/homepage/bobabar-images.zip`} download>
          ⬇ Download the image pack
        </a>
      ) : null}
      {step.tip ? <p className="st-tip">💡 {step.tip}</p> : null}
    </li>
  );
}

export default async function HomepageSideTaskPage() {
  const session = getSession();
  if (!session) redirect('/login');
  if (session.class === 'M9') redirect('/dashboard');

  const existing = await getSideTaskSubmission(session.sid, HOMEPAGE_TASK_ID);

  let n = 0;
  const setupNumbered = SETUP.map((s) => ({ n: ++n, step: s }));
  const blockNumbered = BLOCKS.map((b) => ({ n: ++n, block: b }));
  const publishNumbered = PUBLISH.map((s) => ({ n: ++n, step: s }));

  return (
    <main className="page page-wide">
      <div className="card card-wide st-guide">
        <div className="topbar">
          <Brand />
          <Link className="btn btn-ghost btn-sm" href="/dashboard">← Back to dashboard</Link>
        </div>

        <div className="module-head">
          <span className="eyebrow st-badge">Side Task</span>
          <h1>Build a Company Homepage</h1>
          <p className="goal">
            You are going to build a real, working homepage for a milk tea shop called BobaBar using
            Mobirise, a free app that builds websites by dragging blocks. There is no coding. By the
            end you will know how to build and publish a webpage, so you can go on to make your own
            for anything you like. Follow the steps in order.
          </p>
        </div>

        <section className="st-need">
          <h2>What you need</h2>
          <ul className="st-need-list">
            <li>💻 A laptop</li>
            <li>🌐 Internet connection</li>
            <li>🎨 About one class period</li>
          </ul>
          <p className="hint">
            Every step has a picture that shows what your screen should look like. Take your time and
            save often.
          </p>
        </section>

        <h2 className="st-part">Part 1 · Get set up</h2>
        <ol className="st-steps">
          {setupNumbered.map(({ n, step }) => (
            <StepCard key={step.title} n={n} step={step} />
          ))}
        </ol>

        <h2 className="st-part">Part 2 · Build your homepage, block by block</h2>
        <p className="hint st-part-lead">
          You build a page by stacking blocks. Here is the whole idea, then the exact blocks to add.
        </p>
        <div className="st-howto">
          <figure className="st-howto-card">
            <img className="st-img" src={IMG('m3-blocks.png')} alt="Choosing a block in Mobirise" loading="lazy" />
            <figcaption>Click the red +, pick a section, and click a block to drop it on your page.</figcaption>
          </figure>
          <figure className="st-howto-card">
            <img className="st-img" src={IMG('m4-edit.png')} alt="Editing a block in Mobirise" loading="lazy" />
            <figcaption>Click any text to type your own words. Click a picture to upload one from your image pack.</figcaption>
          </figure>
        </div>
        <p className="hint st-part-lead">
          Now add these blocks, in this order. After each one, your homepage grows.
        </p>
        <ol className="st-steps">
          {blockNumbered.map(({ n, block }) => (
            <li key={block.title} className="st-step">
              <div className="st-step-head">
                <span className="st-step-num">{n}</span>
                <h3>Add the {block.title}</h3>
              </div>
              <p className="st-step-lead"><strong>What it does:</strong> {block.what}</p>
              <p className="st-how-label">How to add it (section: <strong>{block.section}</strong>)</p>
              <ul className="st-step-body">
                {block.how.map((line, j) => (
                  <li key={j}>{line}</li>
                ))}
              </ul>
            </li>
          ))}
        </ol>

        <h2 className="st-part">Part 3 · Publish and submit</h2>
        <ol className="st-steps">
          {publishNumbered.map(({ n, step }) => (
            <StepCard key={step.title} n={n} step={step} />
          ))}
        </ol>

        <section className="st-rubric-wrap">
          <h2>How your homepage is graded</h2>
          <p className="hint">
            Your teacher will open your link and check each part below. A part earns its points when
            it works. Points are taken off only for parts that are missing or broken, so make sure
            every picture loads and the email button works. Total: {HOMEPAGE_RUBRIC_TOTAL} points.
          </p>
          <div className="table-scroll">
            <table className="data-table st-rubric">
              <thead>
                <tr><th>Working part</th><th>What it means</th><th>Points</th></tr>
              </thead>
              <tbody>
                {HOMEPAGE_RUBRIC.map((p) => (
                  <tr key={p.label}>
                    <td><strong>{p.label}</strong></td>
                    <td>{p.how}</td>
                    <td>{p.points}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="st-submit-wrap">
          <h2>Submit your homepage</h2>
          <p className="hint">
            When your site is published and the link opens, paste it here so your teacher can grade
            it.
          </p>
          <SubmitBox
            studentKey={session.sid}
            existingUrl={existing?.url ?? null}
            grade={existing?.grade ?? null}
            feedback={existing?.feedback ?? null}
            total={HOMEPAGE_RUBRIC_TOTAL}
          />
        </section>
      </div>
    </main>
  );
}
