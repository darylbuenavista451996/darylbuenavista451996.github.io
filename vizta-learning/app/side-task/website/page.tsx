// Side Task: "Build Your First Website" — an out-of-curriculum, step-by-step
// guide shown to both Grade 9 and Grade 10 Media Arts. Every student builds the
// same one-page portfolio on Google Sites, then pastes their published link for
// the teacher to open and grade. Self-guided: each step has its own picture.
import Link from 'next/link';
import { redirect } from 'next/navigation';
import Brand from '../../Brand';
import { getSession } from '@/lib/session';
import { BASE_PATH } from '@/lib/basePath';
import {
  getSideTaskSubmission,
  WEBSITE_TASK_ID,
  WEBSITE_RUBRIC,
  WEBSITE_RUBRIC_TOTAL,
} from '@/lib/sideTask';
import SubmitBox from './SubmitBox';

export const dynamic = 'force-dynamic';

type Step = { img: string; title: string; body: string[]; tip?: string };

const STEPS: Step[] = [
  {
    img: '02-signin.png',
    title: 'Sign in to Google',
    body: [
      'Open Google Chrome on your laptop.',
      'Go to accounts.google.com and sign in with your Gmail. If you do not have one, click "Create account" and follow the steps.',
    ],
    tip: 'Use the same Gmail every time so you can come back and edit your site later.',
  },
  {
    img: '01-create.png',
    title: 'Open Google Sites and start a blank site',
    body: [
      'In a new tab, go to sites.google.com',
      'Click the "Blank" card. A new, empty website opens. This is your building screen.',
    ],
    tip: 'Google saves your work automatically. You will see "All changes saved" at the top.',
  },
  {
    img: '03-cover.png',
    title: 'Make your cover: name and tagline',
    body: [
      'Click the big title area at the top and type your full name.',
      'Under it, type a short one line tagline, for example "Media Arts Student, Grade 9".',
    ],
    tip: 'This top part is called the cover. It is the first thing people see.',
  },
  {
    img: '04-insert.png',
    title: 'Add an About Me',
    body: [
      'On the right side is the Insert panel. Everything you add comes from here.',
      'Click "Text box", then write 3 to 4 sentences about yourself: who you are, what you like to create, and what you want to learn.',
    ],
    tip: 'If the panel is hidden, click "Insert" at the top right to open it.',
  },
  {
    img: '05-image.png',
    title: 'Add your photo and three pieces of work',
    body: [
      'In the Insert panel, click "Images", then "Upload", and choose a photo of yourself.',
      'Do the same to add three images of your work (drawings, edits, designs, posters, anything you made).',
    ],
    tip: 'Wait for each image to finish loading before adding the next one.',
  },
  {
    img: '06-button.png',
    title: 'Add a working Contact button',
    body: [
      'In the Insert panel, click "Button".',
      'For the label, type "Email me".',
      'For the link, type mailto: then your email, like mailto:yourname@gmail.com. This makes the button open an email when someone clicks it.',
    ],
    tip: 'The word mailto: is what makes the button actually work. Do not forget the colon.',
  },
  {
    img: '07-publish.png',
    title: 'Publish your site',
    body: [
      'Click the blue "Publish" button at the top right.',
      'For the web address, type your name (for example juandelacruz). Then click "Publish" again to confirm.',
    ],
    tip: 'Publishing makes your site public so your teacher can open it.',
  },
  {
    img: '08-link.png',
    title: 'Get your link and check it',
    body: [
      'After publishing, click "Copy link" to copy your website address.',
      'Open a new tab, paste the link, and press Enter. Make sure your site really opens and everything shows.',
    ],
    tip: 'If a part is missing or a picture does not load, go back and fix it, then Publish again.',
  },
];

export default async function WebsiteSideTaskPage() {
  const session = getSession();
  if (!session) redirect('/login');
  if (session.class === 'M9') redirect('/dashboard');

  const existing = await getSideTaskSubmission(session.sid, WEBSITE_TASK_ID);

  return (
    <main className="page page-wide">
      <div className="card card-wide st-guide">
        <div className="topbar">
          <Brand />
          <Link className="btn btn-ghost btn-sm" href="/dashboard">← Back to dashboard</Link>
        </div>

        <div className="module-head">
          <span className="eyebrow st-badge">Side Task · Extra skill</span>
          <h1>Build Your First Website</h1>
          <p className="goal">
            You are going to build your own one page website and publish it live on the internet.
            Everyone follows the same steps, but your website will be yours: your name, your photo,
            your work. This is a real skill you can be proud of and use for the rest of your life.
          </p>
        </div>

        <section className="st-need">
          <h2>What you need</h2>
          <ul className="st-need-list">
            <li>💻 A laptop</li>
            <li>🌐 Internet connection</li>
            <li>📧 A Google (Gmail) account</li>
          </ul>
          <p className="hint">
            Follow the steps in order. Each step has a picture showing what your screen should look
            like. Take your time. You can stop and continue later on the same Gmail.
          </p>
        </section>

        <ol className="st-steps">
          {STEPS.map((s, i) => (
            <li key={s.img} className="st-step">
              <div className="st-step-head">
                <span className="st-step-num">{i + 1}</span>
                <h3>{s.title}</h3>
              </div>
              <img
                className="st-img"
                src={`${BASE_PATH}/side-task/${s.img}`}
                alt={`Step ${i + 1}: ${s.title}`}
                loading="lazy"
              />
              <ul className="st-step-body">
                {s.body.map((line, j) => (
                  <li key={j}>{line}</li>
                ))}
              </ul>
              {s.tip ? <p className="st-tip">💡 {s.tip}</p> : null}
            </li>
          ))}
        </ol>

        <section className="st-rubric-wrap">
          <h2>How your website is graded</h2>
          <p className="hint">
            Your teacher will open your link and check each part below. A part earns its points when
            it works. Points are taken off only for parts that are missing or broken, so make sure
            everything loads and the button works. Total: {WEBSITE_RUBRIC_TOTAL} points.
          </p>
          <div className="table-scroll">
            <table className="data-table st-rubric">
              <thead>
                <tr><th>Working part</th><th>What it means</th><th>Points</th></tr>
              </thead>
              <tbody>
                {WEBSITE_RUBRIC.map((p) => (
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
          <h2>Submit your website</h2>
          <p className="hint">
            When your site is published and the link opens, paste it here so your teacher can grade
            it.
          </p>
          <SubmitBox
            studentKey={session.sid}
            existingUrl={existing?.url ?? null}
            grade={existing?.grade ?? null}
            feedback={existing?.feedback ?? null}
            total={WEBSITE_RUBRIC_TOTAL}
          />
        </section>
      </div>
    </main>
  );
}
