// Side Task: "Build a Company Homepage" — an out-of-curriculum, step-by-step
// guide shown to both Grade 9 and Grade 10 Media Arts. Every student builds the
// same working homepage for a milk tea shop (BobaBar) in a real code editor,
// learning what each segment of a webpage does, then publishes it and pastes the
// live link for the teacher to grade. Self-guided: setup + publish steps have
// pictures; every line of code is provided and can be copied.
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
import { CSS_FULL, SKELETON, SEGMENTS } from '@/lib/homepageCode';
import CodeBlock from './CodeBlock';
import SubmitBox from './SubmitBox';

export const dynamic = 'force-dynamic';

const IMG = (name: string) => `${BASE_PATH}/side-task/homepage/steps/${name}`;

type SetupStep = { img: string; title: string; body: string[]; download?: boolean; tip?: string };

const SETUP: SetupStep[] = [
  {
    img: 's1-vscode.png',
    title: 'Install the code editor',
    body: [
      'Open your browser and go to code.visualstudio.com',
      'Click the big Download button, open the downloaded file, and follow the installer. This is Visual Studio Code (VS Code), the free app where you will write your website.',
    ],
    tip: 'This is a one time install. After this you can build offline.',
  },
  {
    img: 's2-folder.png',
    title: 'Make your folder and get the images',
    body: [
      'On your Desktop, make a new folder and name it bobabar.',
      'Inside bobabar, make another folder named images.',
      'Download the image pack below, unzip it, and put all the pictures inside your images folder. Every picture on the site comes from here.',
    ],
    download: true,
  },
  {
    img: 's3-open.png',
    title: 'Create your two files and open the page',
    body: [
      'Open VS Code. Choose File, then Open Folder, and pick your bobabar folder.',
      'Make two new files: index.html (the page) and styles.css (the design).',
      'Find index.html in your bobabar folder and double-click it to open it in your browser. Keep this browser tab open. Every time you paste new code and save, refresh this tab to see it appear.',
    ],
    tip: 'Save with Ctrl and S after every paste, then refresh the browser.',
  },
];

const PUBLISH: SetupStep[] = [
  {
    img: 's4-netlify.png',
    title: 'Publish your homepage online',
    body: [
      'Go to app.netlify.com/drop',
      'Drag your whole bobabar folder onto the box on that page. In a few seconds your site is live on the internet.',
      'Sign in for free (you can use your Gmail) to keep your link, then copy the live link it gives you. Open the link in a new tab to make sure everything shows.',
    ],
    tip: 'If a picture is missing, check that its name in the images folder matches the code exactly.',
  },
];

function StepCard({ n, step }: { n: number; step: SetupStep }) {
  return (
    <li className="st-step">
      <div className="st-step-head">
        <span className="st-step-num">{n}</span>
        <h3>{step.title}</h3>
      </div>
      <img className="st-img" src={IMG(step.img)} alt={`Step ${n}: ${step.title}`} loading="lazy" />
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

  // Continuous step numbering across setup, the two paste steps, the segments,
  // and publishing.
  let n = 0;
  const setupNumbered = SETUP.map((s) => ({ n: ++n, step: s }));
  const cssStepNo = ++n;
  const skeletonStepNo = ++n;
  const segNumbered = SEGMENTS.map((seg) => ({ n: ++n, seg }));
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
            You are going to build a real, working homepage for a milk tea shop called BobaBar, then
            publish it live on the internet. You will use the same tools real web designers use, and
            you will learn what every part of a webpage is for. Follow the steps in order. Every line
            of code is given to you, so you never have to guess.
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
            Setup and publishing steps have a picture. The building steps give you the exact code to
            copy. Take your time and save often.
          </p>
        </section>

        <h2 className="st-part">Part 1 · Get set up</h2>
        <ol className="st-steps">
          {setupNumbered.map(({ n, step }) => (
            <StepCard key={step.img} n={n} step={step} />
          ))}
        </ol>

        <h2 className="st-part">Part 2 · Add the design and page frame</h2>
        <ol className="st-steps">
          <li className="st-step">
            <div className="st-step-head">
              <span className="st-step-num">{cssStepNo}</span>
              <h3>Paste the whole stylesheet</h3>
            </div>
            <p className="st-step-lead">
              Open <code>styles.css</code>, paste all of this, and save. This is the paint and
              layout for the whole site. You do not need to memorize it. The comments explain the
              main parts.
            </p>
            <CodeBlock code={CSS_FULL} filename="styles.css" />
          </li>
          <li className="st-step">
            <div className="st-step-head">
              <span className="st-step-num">{skeletonStepNo}</span>
              <h3>Paste the page frame</h3>
            </div>
            <p className="st-step-lead">
              Open <code>index.html</code>, paste this, and save. This is the empty frame of the
              page. It links to your stylesheet. Every part you build next goes inside the{' '}
              <code>&lt;body&gt;</code>, where the comment is.
            </p>
            <CodeBlock code={SKELETON} filename="index.html" />
          </li>
        </ol>

        <h2 className="st-part">Part 3 · Build the page, one part at a time</h2>
        <p className="hint st-part-lead">
          Paste each block inside the <code>&lt;body&gt;</code> of <code>index.html</code>, one after
          another, in this order. Save and refresh your browser after each one to watch your homepage
          grow.
        </p>
        <ol className="st-steps">
          {segNumbered.map(({ n, seg }) => (
            <li key={seg.id} className="st-step">
              <div className="st-step-head">
                <span className="st-step-num">{n}</span>
                <h3>Add the {seg.title}</h3>
              </div>
              <p className="st-step-lead"><strong>What it does:</strong> {seg.what}</p>
              <CodeBlock code={seg.html} filename="index.html · inside body" />
            </li>
          ))}
        </ol>

        <h2 className="st-part">Part 4 · Publish and submit</h2>
        <ol className="st-steps">
          {publishNumbered.map(({ n, step }) => (
            <StepCard key={step.img} n={n} step={step} />
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
