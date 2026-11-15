'use client';

// Teacher-only read-through of a lesson: video, discussion, tools, and every graded
// question with its correct answer marked. Nothing is answerable or saved here.

import type { LessonContent } from './LessonShell';

export default function LessonKey({ content }: { content: LessonContent }) {
  const { video, discussion, explore, groups, reflectionPrompt } = content;
  let n = 0;
  return (
    <div>
      <p className="mlz-p" style={{ background: '#fff7e0', border: '1px solid #f0d58a', padding: 10, borderRadius: 8 }}>
        <strong>Teacher preview.</strong> Answers are marked. Nothing here is saved, and students never see this page.
      </p>
      <h2 className="ls-h2">Video</h2>
      <p className="ls-sub">
        {video.title} · {video.channel} ·{' '}
        <a href={`https://www.youtube.com/watch?v=${video.youtubeId}`} target="_blank" rel="noreferrer">open on YouTube</a>
      </p>
      <div className="ls-video">
        <iframe src={`https://www.youtube-nocookie.com/embed/${video.youtubeId}`} title={video.title} allowFullScreen />
      </div>
      <h2 className="ls-h2" style={{ marginTop: 24 }}>Learn</h2>
      <div className="ls-read">{discussion}</div>
      {explore && (
        <>
          <h2 className="ls-h2" style={{ marginTop: 24 }}>Practice tools (ungraded)</h2>
          <div className="ls-activity">{explore}</div>
        </>
      )}
      {groups.map((g, gi) => (
        <section key={gi} style={{ marginTop: 24 }}>
          <h2 className="ls-h2">{g.title}</h2>
          {g.instructions && <p className="ls-sub">{g.instructions}</p>}
          {g.questions.map((q, qi) => {
            n += 1;
            return (
              <div key={qi} className="mlz-example" style={{ marginBottom: 10 }}>
                <span className="mlz-ex-tag">Q{n} · {q.points} pt{q.points > 1 ? 's' : ''}</span>
                <div>{q.prompt}</div>
                {q.kind === 'choice' ? (
                  <ol type="A" style={{ margin: '6px 0 0', paddingLeft: 22 }}>
                    {q.options.map((o, oi) => (
                      <li key={oi} style={oi === q.answer ? { fontWeight: 700, color: '#1f8a5f' } : undefined}>
                        {o}{oi === q.answer ? '  ✓ correct' : ''}
                      </li>
                    ))}
                  </ol>
                ) : (
                  <p style={{ margin: '6px 0 0', fontWeight: 700, color: '#1f8a5f' }}>
                    Answer: {q.correct}
                    {q.accept.length > 1 ? <span style={{ fontWeight: 400, color: '#555' }}> (also accepted: {q.accept.filter((a) => a !== q.correct).join(', ')})</span> : null}
                  </p>
                )}
              </div>
            );
          })}
        </section>
      ))}
      <section style={{ marginTop: 24 }}>
        <h2 className="ls-h2">Reflection (2 pts)</h2>
        <p>{reflectionPrompt}</p>
      </section>
    </div>
  );
}
