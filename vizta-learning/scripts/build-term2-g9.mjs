// Builds the Grade 9 Term 2 (Animation) content: loadable/term2/*.json and the
// paste-into-Supabase SQL file. Run:  node scripts/build-term2-g9.mjs
// Re-running overwrites the outputs, so edit THIS file (or use the teacher
// Content editor after seeding) and rebuild.

import { mkdirSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const P = (...paras) => paras.join('\n\n');

const AI_LINE =
  'Claude (Anthropic) - AI-assisted drafting of lesson structure and activity design; content verified against DepEd MATATAG BOW by the teacher.';

const VIDEO_NOTE = 'Found by web search, not play tested from the build environment. Watch it once before class.';

// ---- Quiz helper: place the correct answer at a chosen letter ------------------
const LETTERS = ['A', 'B', 'C', 'D'];
function quiz(activityId, moduleId, items) {
  return items.map(([question, right, wrongs, letter], i) => {
    const opts = [...wrongs];
    opts.splice(LETTERS.indexOf(letter), 0, right);
    return {
      quiz_id: `${activityId}-Q${i + 1}`,
      activity_id: activityId,
      module_id: moduleId,
      order: i + 1,
      question,
      option_a: opts[0],
      option_b: opts[1],
      option_c: opts[2],
      option_d: opts[3],
      correct: letter,
    };
  });
}

const MODULE = 'G9-M2';

const modules = [
  {
    module_id: MODULE,
    title: 'Animation',
    grade_class: 'G9',
    term: 'Term 2',
    order: 2,
    weeks: 6,
    output: 'A short animation made from your own hand drawn frames, with the in between frames made by a free AI tool and the final timing, zoom and sound added in a video editor.',
    content_standard: null,
    performance_standard: null,
    unlocked: false,
  },
];

// =============================================================================
// LESSON 1: The 12 principles, part 1
// =============================================================================
const a1 = {
  activity_id: 'G9-A2.1',
  module_id: MODULE,
  order: 1,
  week: 'Week 1',
  title: 'The 12 Principles, Part 1: Make It Feel Alive',
  competency_code: null,
  is_performance_task: false,
  lesson_goal:
    'I want you to learn the first six principles of animation and to spot at least two of them in an animation you already know.',
  before_hook:
    'Think of a bouncing ball. A rubber ball and a steel ball can fall from the same height, but they do not look the same when they hit the floor. One squashes a little. One does not. Animators use a small set of ideas to make drawings feel like they have weight, energy, and life. Those ideas are called the 12 principles of animation. They were collected by the Disney animators Frank Thomas and Ollie Johnston in their book The Illusion of Life. Today we start with the first six.',
  watch_for: [
    'When does the object get squashed or stretched, and what does that tell you about how heavy or soft it is?',
    'What small move happens just before a big action?',
    'Where do you look first on the screen, and how did the animator make you look there?',
  ],
  video_slot: 'The 12 principles of animation, an introduction, 5 to 15 minutes, English.',
  video_candidate: 'Alan Becker, 12 Principles of Animation series (first video).',
  video_preview_note: VIDEO_NOTE,
  video_status: 'Found by web search. Check before class.',
  video_title: '12 Principles of Animation (first video in the series)',
  video_channel: 'Alan Becker',
  video_runtime: null,
  video_url: 'https://www.youtube.com/watch?v=uDqjIdI4bF4',
  after_bridge:
    'So the first six principles are tools for weight, readiness, clarity, and flow. Squash and stretch gives weight. Anticipation warns us. Staging points our eyes. Pose to pose gives control. Follow through lets things settle. Slow in and slow out makes motion feel natural. Next lesson we finish the other six.',
  activity_brief:
    'Pick any short animation you have seen, a cartoon, a game scene, or an animated ad. In 5 to 7 sentences, name two of today\'s six principles and describe exactly where you saw each one. Do not retell the story. For example, do not write that the hero jumped. Write that he crouched first (anticipation) and his body stretched in the air (squash and stretch).',
  submission_type: 'Short text',
  tool: 'None needed. You only need an animation to think about.',
  ai_note: null,
  rubric: [
    { criteria: 'Names two real principles', points: 4 },
    { criteria: 'Points to a specific moment for each', points: 3 },
    { criteria: 'Describes how it looks, not the plot', points: 3 },
  ],
  rubric_total: 10,
  sections: [
    {
      type: 'read',
      title: 'Warm up: the bouncing ball',
      minutes: 10,
      body: P(
        'Draw a ball in your mind. Now drop it. A beach ball floats down slowly and barely changes shape. A rubber ball falls fast, flattens when it hits the floor, then stretches as it shoots back up. A bowling ball just lands.',
        'Each ball looks different because it moves differently. In animation, you cannot rely on real physics. You have to draw the weight and softness yourself. The 12 principles are the tricks animators use to do that.',
        'Take five minutes. Think of one cartoon moment that felt real to you even though it was only drawings. Hold that moment in your mind. By the end of this lesson you will be able to name why it worked.'
      ),
    },
    {
      type: 'read',
      title: 'The first six principles: a closer look',
      minutes: 28,
      body: P(
        'SQUASH AND STRETCH. Objects change shape to show weight and softness. A ball squashes when it hits the floor and stretches when it moves fast. The rule to remember: the object keeps the same volume. If it gets wider, it gets shorter.',
        'ANTICIPATION. A small move in the opposite direction before the main action. A person crouches before jumping. A baseball pitcher winds the arm back before throwing. Anticipation warns the viewer that something is about to happen, so the action feels believable.',
        'STAGING. Show the idea so clearly that the viewer knows exactly where to look. Use one main thing at a time, a clear silhouette, and enough empty space around it. If everything is busy, nothing is clear.',
        'STRAIGHT AHEAD AND POSE TO POSE. These are two ways to draw an animation. Straight ahead means you draw frame after frame from the start, which feels spontaneous. Pose to pose means you draw the important poses first, then fill in the frames between. Pose to pose gives you more control, and it is the method we use in this course.',
        'FOLLOW THROUGH AND OVERLAPPING ACTION. When the body stops, loose parts keep moving for a moment, like hair, a scarf, or a tail. They also do not all move at the same speed. This makes the stop feel natural instead of stiff.',
        'SLOW IN AND SLOW OUT. Real things speed up gently and slow down gently. In animation you draw more pictures near the start and the end of a move, and fewer in the middle. The motion eases in and eases out.'
      ),
    },
    {
      type: 'read',
      title: 'Worked example: one jump, six principles',
      minutes: 20,
      body: P(
        'Here is the method in action so you can copy the shape of the thinking. Imagine a boy jumping to catch a mango.',
        'FIRST, he bends his knees and swings his arms down. CHOICE: anticipation. EFFECT: we feel the jump coming.',
        'SECOND, in the air his body stretches long, and when he lands his body squashes. CHOICE: squash and stretch. EFFECT: he feels light in the air and heavy on landing.',
        'THIRD, the camera is placed so the boy and the mango are the clear focus, with a plain sky behind them. CHOICE: staging. EFFECT: your eyes go straight to the action.',
        'FOURTH, after he lands, his shirt and hair keep moving for a moment. CHOICE: follow through. EFFECT: the landing feels soft and real.',
        'Notice the shape of each answer: name the choice, then name the effect. Never say only that it looked good. Say WHAT the animator did and WHAT it did to you.'
      ),
    },
    {
      type: 'do',
      title: 'Activity: spot the principles',
      minutes: 30,
      body: P(
        'Try it before the graded activity. Open any animation you can watch legally at home.',
        '1. Pause on three different moments.',
        '2. For each moment, write which of the six principles you can see.',
        '3. In one sentence per moment, say what the animator did and what it did to you.',
        'It warms up the exact muscle you use below.'
      ),
    },
    {
      type: 'reflect',
      title: 'Reflection before your activity',
      minutes: 10,
      body: P(
        'Answer these for yourself before you write your activity. You do not submit them.',
        '1. Which principle do you notice most easily now?',
        '2. Which one is still hard to spot?',
        '3. In the cartoon moment you thought about at the start, can you now name the principle that made it work?',
        AI_LINE
      ),
    },
  ],
};

const q1 = quiz(a1.activity_id, MODULE, [
  ['Squash and stretch is mostly used to show:', 'weight and softness', ['the color of an object', 'the speed of the camera', 'the length of the film'], 'B'],
  ['Anticipation is:', 'a small move before the main action', ['the final pose after an action', 'a sound that plays at the start', 'a camera zoom'], 'D'],
  ['A character crouches before jumping. This is an example of:', 'anticipation', ['follow through', 'staging', 'slow out'], 'A'],
  ['Staging means:', 'showing the idea so clearly that the viewer knows where to look', ['building a stage set', 'making the character bigger', 'adding more characters'], 'C'],
  ['In pose to pose animation you first draw:', 'the key poses', ['every frame in order', 'the background only', 'the sound'], 'B'],
  ['In straight ahead animation you:', 'draw frame after frame from the start', ['draw only the key poses first', 'copy one drawing many times', 'trace a photo'], 'A'],
  ['Follow through is when:', 'loose parts like hair keep moving after the body stops', ['the body stops suddenly', 'a jump begins', 'the camera moves closer'], 'C'],
  ['Slow in and slow out means:', 'more drawings near the start and end of a move, fewer in the middle', ['the whole animation plays slowly', 'the sound fades away', 'the camera slows down'], 'D'],
  ['A rubber ball hits the floor. To show it is soft, the animator should:', 'squash it a little on impact', ['make it bigger', 'stop drawing frames', 'change its color'], 'A'],
  ['Which principle helps the viewer look at the right character first?', 'staging', ['follow through', 'squash and stretch', 'slow in and slow out'], 'B'],
]);

// =============================================================================
// LESSON 2: The 12 principles, part 2 (applied to the student's own frames)
// =============================================================================
const a2 = {
  activity_id: 'G9-A2.2',
  module_id: MODULE,
  order: 2,
  week: 'Week 2',
  title: 'The 12 Principles, Part 2: Check Your Own Frames',
  competency_code: null,
  is_performance_task: false,
  lesson_goal:
    'I want you to learn the last six principles and use them to look at your own drawings. You already drew 4 or 5 frames. Now you will see what they already do well and how to push them further.',
  before_hook:
    'You already have drawings on your laptop. Before we bring in any software, let us check them like a real animator. Does your first frame make the idea clear? Does your second frame warn us about what is coming? Today you learn the other six principles, then you use all twelve to judge your own work.',
  watch_for: [
    'How does the number of drawings change how fast or slow an action feels?',
    'Which pose is pushed further than real life, and why does that help?',
    'Does the movement follow a straight line or a curve?',
  ],
  video_slot: 'Timing or exaggeration in animation, 3 to 8 minutes, English.',
  video_candidate: 'Alan Becker, 12 Principles of Animation series, Timing.',
  video_preview_note: VIDEO_NOTE,
  video_status: 'Found by web search. Check before class.',
  video_title: '9. Timing - 12 Principles of Animation',
  video_channel: 'Alan Becker',
  video_runtime: null,
  video_url: 'https://www.youtube.com/watch?v=BarOk2p38LQ',
  after_bridge:
    'So the last six are about curves, extra action, speed, push, form, and charm. Arcs make motion natural. Secondary action adds life. Timing sets speed and weight. Exaggeration makes the idea clear. Solid drawing gives shape and volume. Appeal makes people want to look. Now you can judge a drawing with all twelve.',
  activity_brief:
    'Open your own 4 or 5 drawings. Number them 1, 2, 3, 4 and 5 in the order they play. In 5 to 7 sentences, tell me which principle each frame shows or should show. For example, your getting ready frame shows anticipation. Then pick ONE frame and tell me how you would push it further with exaggeration. Do not redraw anything. Just plan it in words.',
  submission_type: 'Short text',
  tool: 'None needed. Look at your drawings on your laptop.',
  ai_note: null,
  rubric: [
    { criteria: 'Names a principle for every frame', points: 4 },
    { criteria: 'Explains how each frame shows it', points: 3 },
    { criteria: 'Gives a clear exaggeration idea for one frame', points: 3 },
  ],
  rubric_total: 10,
  sections: [
    {
      type: 'read',
      title: 'Warm up: why does a slow action feel heavy?',
      minutes: 10,
      body: P(
        'Imagine two characters lifting a box. One does it in half a second and the box feels light. The other takes three seconds, and the box feels very heavy. The drawings could be exactly the same. Only the speed changed.',
        'That is the power of the last six principles. They control speed, curves, and how clear and charming your drawing feels.'
      ),
    },
    {
      type: 'read',
      title: 'The last six principles: a closer look',
      minutes: 28,
      body: P(
        'ARCS. Most living things move along curved paths, not straight lines. A head turning, an arm swinging, a ball thrown through the air all follow arcs. When you draw the path of a motion as a smooth curve, it looks natural.',
        'SECONDARY ACTION. A smaller action that supports the main action. A character walks (main action) while whistling or swinging a bag (secondary action). It adds personality, but it must never steal attention from the main action.',
        'TIMING. How many drawings you use for an action. More drawings means slower, smoother motion. Fewer drawings means faster, snappier motion. Timing also tells us about weight and mood. A heavy thing moves slowly. A nervous character moves in quick jerks.',
        'EXAGGERATION. Push a pose or an expression further than real life so the idea is clearer and more fun. It is not random. A surprised face with wider eyes and a higher eyebrow reads faster than a realistic one.',
        'SOLID DRAWING. Draw shapes that feel like they have volume, weight, and a back side, not flat paper cutouts. Keep your shapes consistent from one drawing to the next so the character does not change size.',
        'APPEAL. A design that people enjoy looking at. It does not have to be pretty. It has to be clear, readable, and interesting. A simple balloon with a clear shape and a strong color has appeal.'
      ),
    },
    {
      type: 'read',
      title: 'Worked example: judging the balloon animation',
      minutes: 20,
      body: P(
        'Here is how an animator would judge the four frames of a boy popping a balloon. This is a model, not your drawing.',
        'FRAME 1, start pose. The boy stands with the balloon in the middle of the page and nothing else around. PRINCIPLE: staging. The viewer knows where to look.',
        'FRAME 2, getting ready. His arm pulls back and his body leans away. PRINCIPLE: anticipation. We feel the pop coming.',
        'FRAME 3, the pop. The balloon is a spiky burst and his eyes are very wide. PRINCIPLE: exaggeration. The surprise is clear.',
        'FRAME 4, aftermath. His hair and shirt are still settling and a few pieces of the balloon fall. PRINCIPLE: follow through. The action settles instead of stopping dead.',
        'Now notice something. Between frame 2 and frame 3 there is a big jump. That gap will matter a lot in the next lessons.'
      ),
    },
    {
      type: 'do',
      title: 'Activity: label your frames',
      minutes: 30,
      body: P(
        'Try it before the graded activity.',
        '1. Open your drawings in the order they play.',
        '2. Write the number of each frame and one principle it shows.',
        '3. Find the frame that is least clear. Ask: which principle would make it stronger?',
        '4. Write one sentence about how you would push that frame further. Do not redraw it. Just plan it.'
      ),
    },
    {
      type: 'reflect',
      title: 'Reflection before your activity',
      minutes: 10,
      body: P(
        'Answer these for yourself before you write your activity. You do not submit them.',
        '1. Which of your frames is strongest, and which principle makes it strong?',
        '2. Which frame is weakest, and why?',
        '3. Which principle surprised you the most today?',
        AI_LINE
      ),
    },
  ],
};

const q2 = quiz(a2.activity_id, MODULE, [
  ['Arcs in animation means that motion usually follows:', 'curved paths', ['straight lines only', 'zigzags', 'circles only'], 'C'],
  ['A character walks while whistling. The whistling is:', 'secondary action', ['the main action', 'anticipation', 'staging'], 'A'],
  ['More drawings used for an action makes it:', 'slower and smoother', ['faster and snappier', 'invisible', 'louder'], 'B'],
  ['Timing in animation is about:', 'how many drawings you use for an action', ['the color of the drawings', 'the size of the paper', 'the name of the animation'], 'D'],
  ['Exaggeration means:', 'pushing a pose further than real life to make the idea clearer', ['drawing at random', 'adding more characters', 'making everything bigger'], 'A'],
  ['Which principle makes a drawing feel like it has volume and weight?', 'solid drawing', ['arcs', 'timing', 'staging'], 'C'],
  ['Appeal means a design is:', 'clear, readable, and interesting to look at', ['always pretty', 'always colorful', 'always realistic'], 'B'],
  ['A heavy object in animation usually moves:', 'slowly', ['very fast', 'in zigzags', 'without any shape change'], 'D'],
  ['Secondary action should:', 'support the main action without stealing attention', ['replace the main action', 'happen after the film ends', 'be louder than the main action'], 'A'],
  ['A surprised face with very wide eyes is an example of:', 'exaggeration', ['arcs', 'slow in', 'pose to pose'], 'C'],
]);

// =============================================================================
// LESSON 3: Keyframes and inbetweens (and getting the frames ready)
// =============================================================================
const a3 = {
  activity_id: 'G9-A2.3',
  module_id: MODULE,
  order: 3,
  week: 'Week 3',
  title: 'Keyframes and Inbetweens: Get Your Frames Ready',
  competency_code: null,
  is_performance_task: false,
  lesson_goal:
    'I want you to explain what keyframes and inbetweens are, find them in your own work, and get your drawings ready so a computer tool can fill the gaps.',
  before_hook:
    'If you show your 4 or 5 drawings one after another, it looks like a slideshow, not an animation. Why? Because real animation has many more pictures. A film shows 24 pictures every second. You only drew 4. The missing pictures have a name: inbetweens. In the next lesson a free AI tool will draw them for you. Today you learn what they are and prepare your files so the tool works properly.',
  watch_for: [
    'What is the difference between a key pose and an inbetween?',
    'Why does a big change between two drawings need more inbetweens?',
    'Who usually draws the inbetweens in a real studio?',
  ],
  video_slot: 'Keyframes and inbetweens explained, under 8 minutes, English.',
  video_candidate: 'Understanding Keyframes: The Art of Animation Explained (short).',
  video_preview_note: VIDEO_NOTE,
  video_status: 'Found by web search. Check before class.',
  video_title: 'Understanding Keyframes: The Art of Animation Explained',
  video_channel: null,
  video_runtime: null,
  video_url: 'https://www.youtube.com/watch?v=-q4m2ys2060',
  after_bridge:
    'So keyframes are the important poses that mark where a movement starts and ends. Inbetweens are the pictures that fill the gap. The bigger the change between two keyframes, the more inbetweens you need. Your drawings are keyframes. Next we let the computer draw the rest.',
  activity_brief:
    'Look at your own drawings. In 5 to 7 sentences, do three things. First, list your frames in order and say what each one shows. Second, for each gap between two frames, say if the change is small, medium, or big, and why. Which gap worries you the most? Third, decide how long you want your animation to be (between 3 and 5 seconds) and say why.',
  submission_type: 'Short text',
  tool: 'A laptop with your drawings saved as JPG pictures.',
  ai_note: null,
  rubric: [
    { criteria: 'Lists the frames in order with what each shows', points: 3 },
    { criteria: 'Rates each gap and gives a reason', points: 4 },
    { criteria: 'Chooses a length from 3 to 5 seconds with a reason', points: 3 },
  ],
  rubric_total: 10,
  sections: [
    {
      type: 'read',
      title: 'Warm up: the flipbook',
      minutes: 10,
      body: P(
        'Have you ever made a flipbook in the corner of a notebook? You draw a tiny change on every page, then flip fast and the drawing moves. A good flipbook needs many pages. If you only draw four pages, it jumps.',
        'Your project is a flipbook with only four pages. Today we find out why that jumps, and how to fix it without drawing fifty more pictures.'
      ),
    },
    {
      type: 'read',
      title: 'Keyframes, breakdowns, and inbetweens',
      minutes: 28,
      body: P(
        'KEYFRAME. An important pose that defines the start or the end of a movement. In your balloon animation, the start pose and the pop are keyframes. In studios, the lead animator draws the keyframes.',
        'INBETWEENS. The drawings that fill the gaps between keyframes. If there are none, the motion looks jumpy. In a studio, assistants draw them. In a computer program, the software can create them. That is what you will use.',
        'FRAMES PER SECOND. Movies play 24 frames each second. Many hand drawn animations use only 12 drawings each second, which is called animating on twos, because each drawing is shown for two frames. We will use 12 frames per second. It is smooth enough and much less work.',
        'THE BIG IDEA. The bigger the change between two keyframes, the more inbetweens you need. A small move needs one or two. A big move, like a balloon bursting, needs many. And the more guessing the computer has to do, the more likely it makes a mistake.',
        'DO THE MATH. If your animation is 4 seconds long at 12 frames per second, it has 48 frames. You drew 4 or 5 of them. The tool will create the other 43 or so.'
      ),
    },
    {
      type: 'read',
      title: 'Worked example: gaps in the balloon animation',
      minutes: 20,
      body: P(
        'Here is how to rate the gaps. This is a model, not your drawing.',
        'GAP 1, from start pose to getting ready. The arm pulls back a little. The change is SMALL. The computer will do well here.',
        'GAP 2, from getting ready to the pop. The balloon changes from round to a burst of spikes. The change is BIG. The computer may blur this one, because it has to guess a shape that did not exist before.',
        'GAP 3, from the pop to the aftermath. Pieces fall and the boy relaxes. The change is MEDIUM.',
        'So the animator knows to expect a weak spot at gap 2. Knowing that in advance is a skill. When the result is not perfect, you will already understand why.'
      ),
    },
    {
      type: 'do',
      title: 'Activity: get your files ready',
      minutes: 30,
      body: P(
        'This is the setup the computer tool needs. Follow every step and do not skip any.',
        '1. Find your 4 or 5 drawings. They must be JPG pictures. If they are on a phone, send them to your laptop.',
        '2. Make a new folder on your Desktop called my_frames. Copy your pictures into it. Keep your originals safe somewhere else.',
        '3. Put the pictures in the order they should play. Rename them 01.jpg, 02.jpg, 03.jpg, 04.jpg, and 05.jpg if you have a fifth. To rename a file, click it once, press F2, type the new name, and press Enter.',
        '4. Check the file names. In File Explorer, click View, then Show, then File name extensions. Make sure the name is 01.jpg and not 01.jpg.jpg.',
        '5. Look at your pictures. They should be bright, the drawing should fill the picture, and the paper should look the same in every frame. If one picture is much darker, retake it with the same light and from the same distance.'
      ),
    },
    {
      type: 'reflect',
      title: 'Reflection before your activity',
      minutes: 10,
      body: P(
        'Answer these for yourself before you write your activity. You do not submit them.',
        '1. Which of your gaps is the biggest?',
        '2. What do you expect the computer to do well, and what do you expect it to get wrong?',
        '3. Is your animation going to be 3, 4, or 5 seconds? Why?',
        AI_LINE
      ),
    },
  ],
};

const q3 = quiz(a3.activity_id, MODULE, [
  ['A keyframe is:', 'an important pose at the start or end of a movement', ['the last frame of every film', 'a very long shot', 'a sound effect'], 'D'],
  ['Inbetweens are:', 'the frames that fill the gaps between keyframes', ['the first two frames', 'the title of the film', 'a type of camera'], 'A'],
  ['If an animation has no inbetweens, it looks:', 'jumpy', ['too smooth', 'too dark', 'too loud'], 'C'],
  ['The bigger the change between two keyframes, the:', 'more inbetweens you need', ['fewer inbetweens you need', 'shorter the animation must be', 'darker the picture must be'], 'B'],
  ['Many hand drawn animations use how many drawings per second?', '12', ['2', '100', '1000'], 'A'],
  ['A 4 second animation at 12 frames per second has how many frames?', '48', ['12', '24', '96'], 'C'],
  ['In a real studio, who usually draws the inbetweens?', 'assistant animators', ['the audience', 'the camera operator', 'the film critic'], 'B'],
  ['Why do you number your pictures 01, 02, 03?', 'so the computer tool reads them in the right order', ['so they look nicer', 'so the file is smaller', 'so the sound plays'], 'D'],
  ['A file shows its name as 01.jpg.jpg. What is wrong?', 'the extension was added twice by mistake', ['the picture is too big', 'the picture is too dark', 'nothing is wrong'], 'A'],
  ['Which gap is the hardest for a computer to guess?', 'a big change like a balloon bursting', ['two frames that look almost the same', 'a still picture', 'a blank page'], 'C'],
]);

// =============================================================================
// LESSON 4: Let the computer draw the inbetweens
// =============================================================================
const a4 = {
  activity_id: 'G9-A2.4',
  module_id: MODULE,
  order: 4,
  week: 'Week 4',
  title: 'Let the Computer Draw the Inbetweens',
  competency_code: null,
  is_performance_task: false,
  lesson_goal:
    'I want you to run a free AI tool on your own drawings, watch what it makes, and judge honestly where it works and where it fails.',
  before_hook:
    'Here is something that used to need a whole team of assistants. You give a computer two drawings, and it guesses the pictures in between. The tool is free, it runs on your laptop without internet, and the drawings stay yours. But it is not magic. It guesses. Your job is to find out where it guesses well and where it does not, because that is exactly what a real animator would check.',
  watch_for: [],
  video_slot: null,
  video_candidate: null,
  video_preview_note: null,
  video_status: null,
  video_title: null,
  video_channel: null,
  video_runtime: null,
  video_url: null,
  after_bridge:
    'You now have a moving version of your drawings. Some gaps will look smooth and some will look blurry. That is normal. It tells you which gaps were too big for the tool, and it shows why animators draw inbetweens carefully by hand. Next we use a video editor to add timing, a zoom, and a sound.',
  activity_brief:
    'Run the tool on your own drawings, then watch the result a few times. In 5 to 7 sentences, tell me: how many drawings you started with and how long your result is, which gap looks best and why, which gap looks worst and why, and which principle from Lessons 1 and 2 would help a hand animator fix that gap. Also say clearly which part the computer made and which part you made.',
  submission_type: 'Short text',
  tool: 'The AnimationKit folder from your teacher (on a USB drive), and your numbered JPG pictures.',
  ai_note:
    'The computer guesses the inbetween pictures. The ideas, the characters, and every key drawing are yours. In your answer, say clearly which part the AI made and which part you made.',
  rubric: [
    { criteria: 'Describes the result with real numbers and details', points: 3 },
    { criteria: 'Names the best gap and the worst gap and explains why', points: 4 },
    { criteria: 'Links the problem to a principle and says what is AI and what is yours', points: 3 },
  ],
  rubric_total: 10,
  sections: [
    {
      type: 'read',
      title: 'What the tool does',
      minutes: 10,
      body: P(
        'The tool is called RIFE. It is a free program that looks at two pictures and guesses what is in the middle. It does this again and again until it has made all the frames you asked for. Your teacher will give you a folder called AnimationKit that already has everything in it. You do not need to install anything or use the internet.',
        'A second small program called ffmpeg then joins all the new pictures into one video file called my_animation.mp4.',
        'The kit makes all of this happen when you double click one file. You do not type any commands.'
      ),
    },
    {
      type: 'do',
      title: 'Follow these steps exactly',
      minutes: 30,
      body: P(
        'Do the steps in order. If something goes wrong, check the table at the end of this section before asking for help.',
        '1. Copy the whole AnimationKit folder from your teacher\'s USB drive to your Desktop. Do not run it from the USB drive. Do not run it from inside a zip file.',
        '2. Open the AnimationKit folder, then open the folder named put_your_frames_here. If there is a README file in it, you can delete that file.',
        '3. Copy your numbered pictures (01.jpg, 02.jpg, 03.jpg, 04.jpg and so on) from your my_frames folder into put_your_frames_here.',
        '4. Go back to the AnimationKit folder. Double click the file named MAKE_MY_ANIMATION. It may show a .bat at the end.',
        '5. If Windows says Windows protected your PC, click More info, then click Run anyway. This is safe for the file your teacher gave you.',
        '6. A black window opens and asks how many seconds long your animation should be. Type the number you chose in Lesson 3 (3, 4, or 5) and press Enter. If you are not sure, just press Enter and it will use 4 seconds.',
        '7. Wait. You will see Step 1 of 3, Step 2 of 3, and Step 3 of 3. Step 2 is the slow one. On school laptops it can take a few minutes. Do not close the black window. Do not open other programs while you wait.',
        '8. When the window says DONE, press any key. A file called my_animation.mp4 is now in the AnimationKit folder. Double click it and watch your animation. Watch it three times.',
        'TROUBLE? If the window says it cannot find your pictures, check that the files are in put_your_frames_here and that they end in .jpg. If it says a file is missing, tell your teacher that the kit is not complete. If the black window closes by itself, you probably ran it from inside a zip file or from the USB drive, so copy the folder to your Desktop and try again. If Step 2 takes more than 15 minutes, close the window, run it again, and choose 3 seconds.'
      ),
    },
    {
      type: 'read',
      title: 'How to judge your result',
      minutes: 20,
      body: P(
        'Watch your animation slowly. You can click the video and press the left and right arrow keys, or just watch it three times. Look for these signs.',
        'GOOD SIGNS. The shapes move smoothly from one pose to the next. The lines stay clean. The motion feels like one movement, not a slideshow.',
        'BAD SIGNS. GHOSTING means you can see two copies of something at the same time. MELTING means lines bend and wobble. FLICKER means the picture jumps in brightness. POP means one shape suddenly appears from nowhere.',
        'WHY IT HAPPENS. The tool has no idea what a boy or a balloon is. It only compares the pictures and guesses how pixels move. When the two pictures are very different, it has to guess a lot, and the guess gets blurry. This is why the biggest gap usually looks the worst.',
        'You are allowed to be honest. A bad gap is not a failure. It is information. A real animator would use it to decide where to draw an extra pose by hand.'
      ),
    },
    {
      type: 'reflect',
      title: 'Reflection before your activity',
      minutes: 10,
      body: P(
        'Answer these for yourself before you write your activity. You do not submit them.',
        '1. Which gap looked best? Which looked worst?',
        '2. Did the worst gap match the gap you were worried about in Lesson 3?',
        '3. What would you want to change in your drawings if you could redraw one frame?',
        AI_LINE
      ),
    },
  ],
};

const q4 = quiz(a4.activity_id, MODULE, [
  ['The tool in this lesson does what?', 'guesses the pictures between two drawings', ['draws new characters from nothing', 'adds sound automatically', 'makes your drawings darker'], 'B'],
  ['Where should you run the AnimationKit from?', 'a copy on your Desktop', ['inside a zip file', 'straight from the USB drive', 'from an email'], 'A'],
  ['Where do you put your numbered pictures?', 'in the folder put_your_frames_here', ['on the Desktop only', 'in the Recycle Bin', 'in the Downloads folder only'], 'D'],
  ['What do you do when Windows says Windows protected your PC?', 'click More info, then Run anyway, for the file your teacher gave you', ['delete the kit', 'turn off the laptop', 'restart your drawings'], 'C'],
  ['Ghosting means:', 'you can see two copies of something at the same time', ['the picture is too bright', 'the sound is missing', 'the file is too small'], 'B'],
  ['Which gap usually looks the worst?', 'the biggest change between two drawings', ['the smallest change', 'the first frame', 'the file name'], 'A'],
  ['Why does the biggest gap look the worst?', 'the tool has to guess much more', ['the tool refuses to work', 'the paper is too white', 'the laptop is too hot'], 'C'],
  ['What is the name of the video file the kit makes?', 'my_animation.mp4', ['kit.zip', 'frames.jpg', 'sound.wav'], 'D'],
  ['In your answer, you should say:', 'which part the AI made and which part you made', ['only the AI made it', 'only your friend made it', 'nothing about who made it'], 'A'],
  ['A bad gap in your result is best described as:', 'useful information about where the drawings need help', ['proof you failed', 'a broken laptop', 'something to hide'], 'B'],
]);

// =============================================================================
// LESSON 5: Make it move in OpenShot (performance task)
// =============================================================================
const a5 = {
  activity_id: 'G9-A2.5',
  module_id: MODULE,
  order: 5,
  week: 'Weeks 5 to 6',
  title: 'Make It Move: Timing, Zoom, and Sound in OpenShot',
  competency_code: null,
  is_performance_task: true,
  lesson_goal:
    'I want you to finish your animation in a free video editor by adding a fade, one hard cut, a zoom, and a sound, then export it and share a link.',
  before_hook:
    'You have a moving version of your drawings. Now it needs the final touches that make people feel it. A quick zoom at the big moment. A sound that hits at exactly the right time. A cut that is sudden when it should be sudden. These choices are what turn a clip into an animation with a point of view.',
  watch_for: [
    'How does the editor show where a clip starts and ends?',
    'How is a fade different from a hard cut, and when would you use each?',
    'How do you place a sound at exactly the right moment?',
  ],
  video_slot: 'OpenShot beginner tutorial, English.',
  video_candidate: 'OpenShot Video Editor Tutorial for Beginners.',
  video_preview_note:
    'Found by web search. Check the runtime. If it is long, tell students to watch only the parts on the timeline, split, and export.',
  video_status: 'Found by web search. Check before class.',
  video_title: 'OpenShot Video Editor Tutorial - For Beginners!',
  video_channel: null,
  video_runtime: null,
  video_url: 'https://www.youtube.com/watch?v=6ORC-Fuppmo',
  after_bridge:
    'So the editor lets you control time. You set where each part starts, you choose between a fade and a hard cut, you add a zoom to push the eye, and you place a sound where the action lands. Your drawings are only part of it. The finishing is the other part.',
  activity_brief:
    'Open your my_animation.mp4 in OpenShot and finish your animation. It must have: one fade at the start or the end, one hard cut at your big moment, one zoom, and one sound placed at the right time. Export it as an MP4 and upload it to Google Drive or YouTube (unlisted). Paste the link to your video below. In your reflection, tell me why you chose a fade or a cut where you did.',
  submission_type: 'Link',
  tool: 'OpenShot Video Editor (free, offline, from your teacher\'s USB) and the pop.wav sound in the AnimationKit folder.',
  ai_note:
    'The in between frames were made by an AI tool. Everything else is your decision: the drawings, the timing, the fade or cut, the zoom, and the sound. Be ready to explain your choices.',
  rubric: [
    { criteria: 'Motion looks smooth, and the in between frames are used well', points: 5 },
    { criteria: 'Timing follows your plan and fits the length you chose', points: 4 },
    { criteria: 'A fade and a hard cut are used on purpose', points: 4 },
    { criteria: 'A zoom and a sound are added at the right moment', points: 4 },
    { criteria: 'The action is clear and uses at least two principles', points: 3 },
  ],
  rubric_total: 20,
  sections: [
    {
      type: 'read',
      title: 'Warm up: why finishing matters',
      minutes: 10,
      body: P(
        'Two students can have the same drawings and make very different animations. One adds a sound and a zoom at the exact moment of the pop, and the viewer jumps. The other plays the clip with no sound, and nothing happens.',
        'The finishing choices are what make your animation feel alive. They are your voice as a filmmaker.'
      ),
    },
    {
      type: 'read',
      title: 'OpenShot in six moves',
      minutes: 28,
      body: P(
        'You do not need to learn the whole program. You only need six moves. Menu names can look slightly different on your laptop, so look for the same words or the same icons. If you cannot find something, use the OpenShot help or ask your teacher.',
        'MOVE 1, IMPORT. Open OpenShot. Click File, then Import Files, and choose your my_animation.mp4 and the pop.wav sound. They appear in the Project Files panel.',
        'MOVE 2, TIMELINE. Drag my_animation.mp4 onto the first track at the bottom of the screen. Drag pop.wav onto the track below it. You will see them as blocks in a row of time.',
        'MOVE 3, SPLIT FOR A HARD CUT. Move the red playhead line to your big moment (the pop). Right click the video clip and choose Slice, or use the razor tool, to cut the clip into two pieces. A hard cut means one shot ends and the next begins instantly. To make the pop feel sudden, delete about a fifth of a second of the frames just before the pop, then drag the second piece left to close the gap.',
        'MOVE 4, FADE. Right click the start (or end) of the clip and choose Fade, then Fade In (or Fade Out). A fade is a soft dissolve. Use it to start gently or to end calmly.',
        'MOVE 5, ZOOM. Right click the second piece of the clip, choose Animate, then a zoom option such as Zoom In. A quick zoom at the pop pushes the eye toward the action. If you cannot find it, open the Properties and animate Scale X and Scale Y with keyframes.',
        'MOVE 6, SOUND AND EXPORT. Drag pop.wav so its start lines up exactly with the pop. Press Play to check. When you like it, click File, then Export Video, keep the MP4 settings, and click Export Video.'
      ),
    },
    {
      type: 'read',
      title: 'Worked example: a plan for the balloon animation',
      minutes: 20,
      body: P(
        'Here is a model plan for a 4 second animation. This is not your animation.',
        'AT 0.0 SECONDS, fade in from black. CHOICE: dissolve. EFFECT: a gentle start.',
        'AT 1.8 SECONDS, the boy pulls back. Nothing else happens. CHOICE: no zoom yet. EFFECT: the viewer feels the build up.',
        'AT 2.0 SECONDS, a hard cut straight to the pop, a quick zoom in over half a second, and the pop sound starts at the same moment. CHOICE: hard cut, zoom, sound. EFFECT: a sudden jolt.',
        'AT 2.5 SECONDS to 4.0 SECONDS, the aftermath settles and the clip ends with a short fade out. CHOICE: dissolve. EFFECT: calm after the shock.',
        'Notice the plan: two soft moments and one hard moment, with the zoom and sound exactly on the hard one. Soft and hard are only meaningful when you use both.'
      ),
    },
    {
      type: 'do',
      title: 'Activity: plan before you edit',
      minutes: 30,
      body: P(
        'Before you touch OpenShot, write a four line plan like the worked example.',
        '1. Where is the big moment in your animation, in seconds?',
        '2. Where will you use a fade, and why?',
        '3. Where will you use a hard cut, and why?',
        '4. Where will the zoom and the sound happen?',
        'Then build it. Press Play often and fix the timing until the sound and the picture land together.',
        'To share it: upload your MP4 to Google Drive, right click it, choose Share, set it to Anyone with the link, and copy the link. Or upload it to YouTube as Unlisted and copy that link. Paste it in the box below.'
      ),
    },
    {
      type: 'reflect',
      title: 'Reflection before your activity',
      minutes: 10,
      body: P(
        'Answer these for yourself before you submit. You do not submit them separately.',
        '1. What did the fade do for your animation, and what did the hard cut do?',
        '2. Which principle from Lessons 1 and 2 does your finished animation show best?',
        '3. If you could redraw one frame by hand, which one would you pick and why?',
        AI_LINE
      ),
    },
  ],
};

const q5 = quiz(a5.activity_id, MODULE, [
  ['A fade is:', 'a soft dissolve into or out of a shot', ['a sudden jump to the next shot', 'a kind of sound', 'a type of drawing'], 'C'],
  ['A hard cut is:', 'one shot ending and the next starting instantly', ['a slow dissolve', 'a zoom', 'a title card'], 'A'],
  ['A zoom at the big moment is used to:', 'push the viewer\'s eye toward the action', ['hide the action', 'make the clip longer', 'delete frames'], 'B'],
  ['In OpenShot, the red line you move along the timeline is called the:', 'playhead', ['fade', 'folder', 'filter'], 'D'],
  ['To cut a clip into two pieces you:', 'slice it at the playhead', ['rename it', 'export it', 'zip it'], 'A'],
  ['The pop sound should:', 'start exactly when the pop happens on screen', ['start at the very beginning always', 'play after the video ends', 'be placed anywhere'], 'C'],
  ['Which file does OpenShot use for your animation?', 'my_animation.mp4', ['kit.bat', 'frames.zip', 'notes.txt'], 'B'],
  ['Why use both a fade and a hard cut?', 'soft and hard moments only matter when you use both', ['because it is required by the software', 'to make the clip longer', 'because the sound needs it'], 'D'],
  ['How do you share your finished video in this course?', 'upload it to Google Drive or YouTube and paste the link', ['send the file to the website', 'print it', 'save it on the USB only'], 'A'],
  ['Which parts of your final animation did the AI make?', 'only the in between frames', ['the drawings and the ideas', 'the zoom and the sound choices', 'everything'], 'C'],
]);

// ---- Output ------------------------------------------------------------------
const activities = [a1, a2, a3, a4, a5];
const quizzes = [...q1, ...q2, ...q3, ...q4, ...q5];

const outDir = join(root, 'loadable', 'term2');
mkdirSync(outDir, { recursive: true });
writeFileSync(join(outDir, 'modules.json'), JSON.stringify(modules, null, 2) + '\n');
writeFileSync(join(outDir, 'activities.json'), JSON.stringify(activities, null, 2) + '\n');
writeFileSync(join(outDir, 'quizzes.json'), JSON.stringify(quizzes, null, 2) + '\n');

// ---- SQL for the Supabase SQL editor ----------------------------------------------
const q = (v) => {
  if (v === null || v === undefined) return 'null';
  const s = String(v);
  if (s.includes('$q$')) throw new Error('text contains $q$');
  return `$q$${s}$q$`;
};
const j = (v) => (v === null || v === undefined ? 'null' : `${q(JSON.stringify(v))}::jsonb`);
const n = (v) => (v === null || v === undefined ? 'null' : String(Number(v)));
const b = (v) => (v ? 'true' : 'false');

const lines = [];
lines.push('-- Grade 9 Media Arts, Term 2: Animation (5 lessons, 50 quiz questions).');
lines.push('-- Generated by scripts/build-term2-g9.mjs. Paste into the Supabase SQL editor and run.');
lines.push('-- Safe to run again: the module is only created if missing, so it will NOT undo');
lines.push('-- a lock or unlock you set on the Modules page. Lesson text and quizzes are refreshed.');
lines.push('-- The module is created LOCKED. Unlock Term 2 on the teacher Modules page when ready.');
lines.push('');
lines.push('begin;');
lines.push('');
for (const m of modules) {
  lines.push(
    `insert into public.modules (module_id, title, grade_class, term, "order", weeks, output, content_standard, performance_standard, unlocked) values (${q(m.module_id)}, ${q(m.title)}, ${q(m.grade_class)}, ${q(m.term)}, ${n(m.order)}, ${n(m.weeks)}, ${q(m.output)}, ${q(m.content_standard)}, ${q(m.performance_standard)}, ${b(m.unlocked)}) on conflict (module_id) do nothing;`
  );
}
lines.push('');
const aCols = ['activity_id','module_id','order','week','title','competency_code','is_performance_task','lesson_goal','before_hook','watch_for','video_slot','video_candidate','video_preview_note','video_status','video_title','video_channel','video_runtime','video_url','after_bridge','activity_brief','submission_type','tool','ai_note','rubric','rubric_total','sections'];
const aVal = (a) => [
  q(a.activity_id), q(a.module_id), n(a.order), q(a.week), q(a.title), q(a.competency_code), b(a.is_performance_task), q(a.lesson_goal), q(a.before_hook), j(a.watch_for), q(a.video_slot), q(a.video_candidate), q(a.video_preview_note), q(a.video_status), q(a.video_title), q(a.video_channel), q(a.video_runtime), q(a.video_url), q(a.after_bridge), q(a.activity_brief), q(a.submission_type), q(a.tool), q(a.ai_note), j(a.rubric), n(a.rubric_total), j(a.sections),
];
const colList = aCols.map((c) => (c === 'order' ? '"order"' : c)).join(', ');
const setList = aCols.filter((c) => c !== 'activity_id').map((c) => `${c === 'order' ? '"order"' : c} = excluded.${c === 'order' ? '"order"' : c}`).join(', ');
for (const a of activities) {
  lines.push(`insert into public.activities (${colList}) values (${aVal(a).join(', ')}) on conflict (activity_id) do update set ${setList};`);
}
lines.push('');
lines.push(`delete from public.quizzes where activity_id in (${activities.map((a) => q(a.activity_id)).join(', ')});`);
for (const z of quizzes) {
  lines.push(
    `insert into public.quizzes (quiz_id, activity_id, module_id, "order", question, option_a, option_b, option_c, option_d, correct) values (${q(z.quiz_id)}, ${q(z.activity_id)}, ${q(z.module_id)}, ${n(z.order)}, ${q(z.question)}, ${q(z.option_a)}, ${q(z.option_b)}, ${q(z.option_c)}, ${q(z.option_d)}, ${q(z.correct)});`
  );
}
lines.push('');
lines.push("select (select count(*) from public.modules where module_id = 'G9-M2') as modules, (select count(*) from public.activities where module_id = 'G9-M2') as lessons, (select count(*) from public.quizzes where module_id = 'G9-M2') as quiz_questions;");
lines.push('');
lines.push('commit;');
writeFileSync(join(root, 'supabase', 'term2_g9_animation.sql'), lines.join('\n') + '\n');
console.log('Built:', modules.length, 'module,', activities.length, 'lessons,', quizzes.length, 'quiz questions');
