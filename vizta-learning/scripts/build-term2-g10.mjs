// Builds the Grade 10 Term 2 content (Planning and Editing Your Short Film):
// loadable/term2_g10/*.json and the paste-into-Supabase SQL file.
// Run:  node scripts/build-term2-g10.mjs
// Edit THIS file and rebuild, or use the teacher Content editor after seeding.

import { mkdirSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const P = (...paras) => paras.join('\n\n');
const VIDEO_NOTE = 'Found by web search, not play tested from the build environment. Watch it once before class.';
const VSTAT = 'Found by web search. Check before class.';

const LETTERS = ['A', 'B', 'C', 'D'];
function quiz(activityId, moduleId, items) {
  return items.map(([question, right, wrongs, letter], i) => {
    const opts = [...wrongs];
    opts.splice(LETTERS.indexOf(letter), 0, right);
    return { quiz_id: `${activityId}-Q${i + 1}`, activity_id: activityId, module_id: moduleId, order: i + 1, question, option_a: opts[0], option_b: opts[1], option_c: opts[2], option_d: opts[3], correct: letter };
  });
}

const MODULE = 'G10-M2';
const modules = [
  {
    module_id: MODULE,
    title: 'Planning and Editing Your Short Film',
    grade_class: 'G10',
    term: 'Term 2',
    order: 2,
    weeks: 8,
    output: 'A preproduction pack, then a short scene edited in Kdenlive with clean cuts, corrected and graded color, and balanced sound.',
    content_standard: null,
    performance_standard: null,
    unlocked: false,
  },
];

const base = (o) => ({ competency_code: null, watch_for: [], video_slot: null, video_candidate: null, video_preview_note: null, video_status: null, video_title: null, video_channel: null, video_runtime: null, video_url: null, ai_note: null, ...o });

// =============================================================================
// LESSON 1: Preproduction, including the crew
// =============================================================================
const a1 = base({
  activity_id: 'G10-A2.1', module_id: MODULE, order: 1, week: 'Week 1',
  title: 'Preproduction: Plan It Before You Shoot',
  is_performance_task: true,
  lesson_goal: 'I want you to plan a short film scene like a professional. You will write a logline, a scene heading with a short script, a storyboard, a shot list, and a crew chart.',
  before_hook: 'Every hour on a film set costs money, and a crew of twenty people can lose a whole morning because nobody decided where the camera goes. Professionals avoid that with preproduction, which means every decision is made on paper before the camera is switched on. Today you learn the four documents of preproduction and the crew who use them. Then you plan a real scene of your own.',
  watch_for: [
    'What information does a shot list give the camera crew that a script does not?',
    'Why is a shot list often ordered by location, not by story order?',
    'Which job on a crew would you want, and what would you be responsible for?',
  ],
  video_slot: 'Shot lists and preproduction, 5 to 15 minutes, English.',
  video_candidate: 'What is a Shot List? (and How to Make One)',
  video_preview_note: VIDEO_NOTE, video_status: VSTAT,
  video_title: 'What is a Shot List? (and How to Make One)',
  video_url: 'https://www.youtube.com/watch?v=BdyhNmVFXdw',
  after_bridge: 'So preproduction is four documents and one team. The logline says what the story is. The script and scene heading say what happens and where. The storyboard shows how it looks. The shot list tells the camera crew what to record. And the crew is the people who turn the plan into footage. If one of these is missing, the shoot slows down.',
  activity_brief: 'Choose ONE story seed: The Missing Project, The Last Jeepney, The Lost Wallet, The Old Camera, or The Power Cut. Write a mini preproduction pack in this order. 1) One logline. 2) One scene heading with 4 to 6 lines of script. 3) Three storyboard panels described in words, and name the shot size of each (WS, MS, or CU). 4) A shot list of 3 shots. 5) A crew chart of 5 people, each with a role and one job. Keep it short and clear.',
  submission_type: 'Short text',
  tool: 'None needed. You only need your ideas and this lesson.',
  rubric: [
    { criteria: 'Logline has a character, a goal, and an obstacle', points: 4 },
    { criteria: 'Scene heading is correct and the script is clear', points: 4 },
    { criteria: 'Three storyboard panels with a shot size for each', points: 4 },
    { criteria: 'Shot list of 3 shots with size and what happens', points: 4 },
    { criteria: 'Crew chart of 5 with a role and a job each', points: 4 },
  ],
  rubric_total: 20,
  sections: [
    { type: 'read', title: 'Warm up: why plan?', minutes: 10, body: P(
      'Imagine you and four classmates go out to shoot a scene. You arrive, and nobody knows who holds the camera, what the first shot is, or whether you are allowed to film in that place. Two hours pass and you have one bad shot.',
      'Now imagine the same group with a plan on paper. Everyone knows their job, the first shot is written down, and the location is already approved. You finish in thirty minutes.',
      'That difference is preproduction. It is not the boring part of filmmaking. It is the part that makes the fun part possible.') },
    { type: 'read', title: 'The four documents of preproduction', minutes: 30, body: P(
      'LOGLINE. One or two sentences that say what the story is. It names a main character, what that character wants, and what stands in the way. Keep names out and describe the person instead, for example a shy student or a tired jeepney driver. Do not give away the ending. Example: A shy student must find the one person who can return his stolen project before the deadline.',
      'SCRIPT AND SCENE HEADING. A scene heading tells the crew where and when the scene happens. In our class we write INT. or EXT., then the place, then a comma, then DAY or NIGHT. INT. means inside and EXT. means outside. Example: INT. CLASSROOM, DAY. Under the heading, the action lines say what we SEE, written in present tense. Dialogue goes under the character name. Write only what the camera can see or the microphone can hear.',
      'STORYBOARD. A row of simple drawings, one for each shot, so everyone sees the film before it exists. Stick figures are fine. Each panel shows the framing, and you label the shot size. WS means wide shot, which shows the place. MS means medium shot, which shows a person from the waist up. CU means close up, which shows a face or a small detail. Use arrows to show movement.',
      'SHOT LIST. A table that tells the camera crew exactly what to record. Each row has a shot number, the shot size, the angle or movement, and what happens. The camera crew follows it like a recipe. Shot lists are often ordered by location, not story order, so the crew does not walk back and forth between places.') },
    { type: 'read', title: 'Meet the crew', minutes: 28, body: P(
      'A crew is a team where each person has a ROLE and a FUNCTION. The role is the job title. The function is what that job must achieve. A good crew knows both.',
      'PRODUCER. Handles the resources and the logistics: the schedule, the permits, the people, the equipment, and the money. The producer makes the film possible.',
      'DIRECTOR. Owns the creative vision. The director decides how the story is told, works with the actors, and approves every shot. The director makes the film good.',
      'The difference matters. If you need permission to shoot in the school canteen, ask the producer. If you want to know how a scene should feel, ask the director.',
      'CINEMATOGRAPHER, also called the director of photography. Chooses the framing, the camera movement, and the lighting, so the film looks the way the director imagines.',
      'SOUND RECORDIST. Records the dialogue and sounds on set. Many students forget this job, and bad sound ruins a film faster than a bad picture.',
      'PRODUCTION DESIGNER. Looks after the setting, props, costumes, and colors, so everything on screen belongs to the story.',
      'SCRIPT SUPERVISOR. Watches continuity. If a character holds a bag in shot one, the bag must still be there in shot two.',
      'ACTORS. Bring the characters to life.',
      'EDITOR. Joins the shots after filming. You will play this role in the next lessons.',
      'On a small student crew, one person often does two jobs. That is fine, as long as everyone knows which hat they are wearing.') },
    { type: 'read', title: 'Worked example: The Broken Umbrella', minutes: 22, body: P(
      'Here is a full mini pack so you can copy the shape of the thinking. This is a model, not your story.',
      'LOGLINE. A shy student must share his only umbrella with the classmate who broke it, before the rain stops.',
      'SCENE HEADING AND SCRIPT. EXT. SCHOOL GATE, DAY. Rain falls. MARCO, a Grade 10 student, opens his umbrella. It is bent and one rib is broken. LEA runs up with her bag over her head. LEA: Is that mine? I think I broke it. MARCO looks at the umbrella, then at her. MARCO: Then you are walking with me.',
      'STORYBOARD. Panel 1, WS: the school gate in the rain, Marco small in the frame. Panel 2, CU: the broken umbrella rib. Panel 3, MS: Lea and Marco under the umbrella, both looking at the sky.',
      'SHOT LIST. Shot 1, WS, locked camera, Marco at the gate. Shot 2, CU, the broken rib. Shot 3, MS, Lea runs in and shares the umbrella.',
      'CREW CHART. Producer: Ana, gets permission to film at the gate. Director: Marco, guides the actors. Cinematographer: Ben, holds the camera. Sound recordist: Carla, records dialogue. Production designer: Dino, finds the broken umbrella.',
      'Notice that every part answers a question. The logline says what. The script says who and where. The storyboard says how it looks. The shot list says what to record. The crew chart says who does it.') },
    { type: 'do', title: 'Activity: plan your own mini pack', minutes: 30, body: P(
      'Try it before you submit. You have about 30 minutes.',
      '1. Pick one story seed from the activity box below.',
      '2. Write one logline. Check it has a character, a goal, and an obstacle.',
      '3. Write a scene heading and 4 to 6 lines of script. Only write what we can see or hear.',
      '4. Describe three storyboard panels in words. Start each one with WS, MS, or CU.',
      '5. Write a shot list of 3 shots.',
      '6. Pick 5 crew members, give each a role, and write one job for each. Remember the producer and the director do different things.') },
    { type: 'reflect', title: 'Reflection before your activity', minutes: 10, body: P(
      'Answer these for yourself before you write your activity. You do not submit them.',
      '1. Which of the four documents was the hardest to write?',
      '2. Which crew job would you want, and what is its function?',
      '3. What could go wrong on set if one of the four documents were missing?') },
  ],
});
const q1 = quiz(a1.activity_id, MODULE, [
  ['A logline is:', 'one or two sentences that say what the story is', ['a list of all the shots', 'the name of the film', 'a camera movement'], 'C'],
  ['A good logline includes a character, a goal, and:', 'an obstacle', ['the ending', 'a song', 'a camera angle'], 'A'],
  ['In our class, INT. at the start of a scene heading means:', 'the scene happens inside', ['the scene happens outside', 'the scene is at night', 'the scene is a flashback'], 'D'],
  ['Which is a correct scene heading?', 'EXT. SCHOOL GATE, DAY', ['The school gate in the morning', 'EXT SCHOOL GATE', 'GATE (outside, day)'], 'B'],
  ['In the action lines of a script, you should write:', 'only what the camera can see or the microphone can hear', ['what a character secretly thinks', 'the director\'s opinion', 'the budget'], 'A'],
  ['A WS (wide shot) is mostly used to show:', 'the place and the surroundings', ['a close detail of a hand', 'only sound', 'a title card'], 'C'],
  ['A CU (close up) is best for:', 'a face or a small detail', ['a whole crowd', 'a long landscape', 'the credits'], 'B'],
  ['A shot list is often ordered by location so that:', 'the crew does not walk back and forth between places', ['the story is told backwards', 'the actors forget their lines', 'the sound is louder'], 'D'],
  ['Who handles the schedule, permits, and logistics?', 'the producer', ['the director', 'the actor', 'the editor'], 'A'],
  ['Who owns the creative vision and works with the actors?', 'the director', ['the producer', 'the sound recordist', 'the script supervisor'], 'B'],
]);

// =============================================================================
// LESSON 2: Meet Kdenlive (interface)
// =============================================================================
const a2 = base({
  activity_id: 'G10-A2.2', module_id: MODULE, order: 3, week: 'Week 3',
  title: 'Meet Kdenlive: Learn the Interface',
  is_performance_task: false,
  lesson_goal: 'I want you to open Kdenlive, name every part of the screen, set up a project that works on our laptops, and make your first cuts.',
  before_hook: 'You already installed Kdenlive. Now you meet it. A surgeon does not search for the scalpel in the middle of an operation, and an editor should not search for the timeline in the middle of an edit. Today is only about the layout and a handful of basic moves. We keep it simple, because everything you learn in the next lessons happens on this screen.',
  watch_for: [
    'What are the names of the main areas of the screen?',
    'How does the editor move a clip from the bin onto the timeline?',
    'What does the editor do to save the project and to export the video?',
  ],
  video_slot: 'Kdenlive beginner tutorial, English.',
  video_candidate: 'Kdenlive Tutorial for Beginners in 15 Minutes',
  video_preview_note: 'Found by web search. It may not match your Kdenlive version exactly. Menu names can differ slightly. Watch it once before class.',
  video_status: VSTAT,
  video_title: 'Kdenlive Tutorial for Beginners in 15 Minutes',
  video_url: 'https://www.youtube.com/watch?v=N98uLbyabh4',
  after_bridge: 'So Kdenlive has a few main areas, and each has one job. The Project Bin stores your clips. The monitors show them. The timeline is where you build the film. The Effects and Properties panels change how a clip looks. If you can find these areas without thinking, you are ready to edit.',
  activity_brief: 'Open Kdenlive and complete the scavenger hunt in the activity box. Then write 5 to 7 sentences that name the main areas of the screen and say what each one does, in your own words. Also write three actions you can do with the keyboard or the toolbar, and one problem you met and how you solved it.',
  submission_type: 'Short text',
  tool: 'Kdenlive (already installed) and two or three short video clips from your phone.',
  rubric: [
    { criteria: 'Names the main areas of the screen correctly', points: 4 },
    { criteria: 'Says what each area does in his or her own words', points: 3 },
    { criteria: 'Lists three actions and one problem solved', points: 3 },
  ],
  rubric_total: 10,
  sections: [
    { type: 'read', title: 'Warm up: the editor\'s desk', minutes: 10, body: P(
      'Think of a real desk in an editing room. There is a shelf with all the film clips. There are two small screens, one to look at a single clip and one to watch the film being built. And there is a long strip of table where the pieces are laid out in order.',
      'Kdenlive is that desk on your laptop. Once you know which part of the screen matches which part of the desk, the software stops feeling strange.') },
    { type: 'read', title: 'The main areas of the screen', minutes: 28, body: P(
      'Menu names and layouts can look a little different between Kdenlive versions. Look for the same words or the same icons, and ask your teacher if you cannot find something.',
      'PROJECT BIN. The shelf. It stores every clip, picture, and sound you import. Add media with the Add Clip icon or by dragging files in. Clips in the bin are not in your film yet.',
      'CLIP MONITOR. Click a clip in the bin and it plays here. You use it to look at one clip on its own and choose the part you want. Press I to mark where the part starts and O to mark where it ends.',
      'PROJECT MONITOR. This shows your actual film, the timeline, as it plays. It is the screen your audience will see.',
      'TIMELINE. The long strip along the bottom. It has video tracks and audio tracks stacked on top of each other, and your clips are blocks along them. Time moves from left to right. The vertical line is the playhead. It shows the moment you are looking at.',
      'EFFECTS AND COMPOSITIONS. Panels with a list of effects and transitions. You use them for color, sound, and fades.',
      'PROPERTIES. When a clip is selected, this panel shows the effects on it and lets you change their settings.',
      'TOOLBAR. Near the timeline. It has the Selection tool for moving clips and the Razor tool for cutting them.',
      'THREE KEYS TO REMEMBER. Space plays and pauses. Ctrl and Z undoes your last move, so you can try things without fear. Ctrl and S saves the project. Save often.') },
    { type: 'read', title: 'Set up a project for our laptops', minutes: 22, body: P(
      'Our laptops have little memory, so we set up carefully.',
      'FILM AT 720P. Before you shoot, set your phone camera to 720p or 1080p, not 4K. Four K files are huge and will make Kdenlive crawl.',
      'KEEP YOUR FILES TOGETHER. Make one folder for the project. Put all your clips in it before you import. A Kdenlive project file does not contain your videos. It only remembers where they are. If you move or rename a clip later, the project loses it.',
      'PROJECT SETTINGS. When you start a new project, choose a profile that matches your clips, for example 1280 by 720 at 30 frames per second. In the project settings, turn on proxy clips. A proxy is a small copy of each clip that Kdenlive uses while you edit, so the laptop does not struggle. The full quality clip is used when you export.',
      'SAVE EARLY. Save the project to your project folder before you do anything else, and press Ctrl and S often.') },
    { type: 'do', title: 'Activity: the scavenger hunt', minutes: 35, body: P(
      'Do these in order. Tick each one off.',
      '1. Open Kdenlive and start a new project in your project folder. Choose a profile that matches your clips. Turn on proxy clips.',
      '2. Import two or three clips into the Project Bin.',
      '3. Click a clip in the bin and play it in the Clip Monitor.',
      '4. Mark a start point with I and an end point with O.',
      '5. Drag that part onto the timeline.',
      '6. Add a second clip after it. Drag the clips to change their order.',
      '7. Put the playhead in the middle of a clip. Choose the Razor tool and click to cut the clip in two.',
      '8. Select the part you do not want and delete it. Then undo with Ctrl and Z.',
      '9. Zoom the timeline in and out. Use Ctrl and the mouse wheel, or the zoom slider.',
      '10. Save the project.',
      '11. Export a 10 second test video. Look for the Render button, choose MP4 as the format, and export.',
      'If something does not work, write down what happened. You will need it for your activity.') },
    { type: 'reflect', title: 'Reflection before your activity', minutes: 10, body: P(
      'Answer these for yourself before you write your activity. You do not submit them.',
      '1. Which area of the screen do you use the most?',
      '2. What was the hardest step in the scavenger hunt?',
      '3. Why did we turn on proxy clips and film in 720p?') },
  ],
});
const q2 = quiz(a2.activity_id, MODULE, [
  ['In Kdenlive, the Project Bin is where you:', 'store the clips you import', ['cut your clips', 'export your film', 'change the color'], 'B'],
  ['The Project Monitor shows:', 'your film as the timeline plays', ['only the first clip you imported', 'the list of effects', 'the project folder'], 'A'],
  ['The Clip Monitor is used to:', 'look at one clip on its own and choose its start and end', ['export the film', 'mix the sound', 'rename the project'], 'C'],
  ['The long strip along the bottom of the screen is the:', 'timeline', ['project bin', 'effects list', 'toolbar'], 'D'],
  ['The Razor tool is used to:', 'cut a clip in two', ['play a clip', 'delete the project', 'change the profile'], 'B'],
  ['What does Ctrl and Z do?', 'undoes your last move', ['saves the project', 'plays the film', 'exports the video'], 'A'],
  ['A Kdenlive project file:', 'remembers where your clips are but does not contain them', ['contains all your videos inside', 'deletes your clips', 'is the same as the exported video'], 'C'],
  ['Why do we turn on proxy clips?', 'so editing is smoother on laptops with little memory', ['to make the final video blurry', 'to add music', 'to change the language'], 'D'],
  ['Why should you film at 720p and not 4K on our laptops?', '4K files are huge and make editing very slow', ['4K video has no sound', 'Kdenlive cannot open any video', '720p looks better than 4K'], 'A'],
  ['Which format do we usually export in?', 'MP4', ['a text file', 'a zip folder', 'a spreadsheet'], 'B'],
]);

// =============================================================================
// LESSON 3: Principles of editing
// =============================================================================
const a3 = base({
  activity_id: 'G10-A2.3', module_id: MODULE, order: 2, week: 'Week 2',
  title: 'Principles of Editing: Cuts That Make Sense',
  is_performance_task: false,
  lesson_goal: 'I want you to understand why editors cut where they cut, and to name and use the basic types of cuts and the rules of continuity.',
  before_hook: 'The best editing is the editing you never notice. When you watch a film, you do not think about the cuts. You just follow the story. That is not an accident. Editors follow a set of principles that make cuts feel natural, and they break them on purpose only when they want you to feel something is wrong. Today you learn those principles.',
  watch_for: [
    'What does the editor cut on, so that the cut is hard to notice?',
    'Why does the camera stay on one side of the characters in a conversation?',
    'Where does the sound of the next scene start compared to the picture?',
  ],
  video_slot: 'Continuity editing, 5 to 15 minutes, English.',
  video_candidate: 'What is Continuity Editing?',
  video_preview_note: VIDEO_NOTE, video_status: VSTAT,
  video_title: 'What is Continuity Editing?',
  video_url: 'https://www.youtube.com/watch?v=33eWqDZ6sRc',
  after_bridge: 'So editing is decisions about time and space. Cut on action to hide the join. Keep the camera on one side of the line so the audience stays oriented. Use cutaways, split edits, and match cuts as tools. And remember that rhythm is part of the story. A fast cut speeds the heart. A long shot slows it down.',
  activity_brief: 'Read the six shots in the activity box. In 5 to 7 sentences, give the order you would cut them, and for at least three of your cuts name the type of cut (cut on action, cutaway, shot and reverse shot, J cut, L cut, match cut, or jump cut) and say why you chose it. Mention one continuity rule you followed.',
  submission_type: 'Short text',
  tool: 'None needed. You only need to think like an editor.',
  rubric: [
    { criteria: 'Gives a sensible order for the six shots with reasons', points: 4 },
    { criteria: 'Names at least three types of cuts correctly', points: 3 },
    { criteria: 'Explains one continuity rule you followed', points: 3 },
  ],
  rubric_total: 10,
  sections: [
    { type: 'read', title: 'Warm up: the invisible art', minutes: 10, body: P(
      'Watch any scene from a film you like and count the cuts. In a two minute conversation there may be thirty, and you probably did not notice one. That is the point. Good editing serves the story and does not show off.',
      'The principles below are the habits that make cuts invisible.') },
    { type: 'read', title: 'The core principles and cuts', minutes: 30, body: P(
      'CONTINUITY EDITING. Editing that makes time and space feel smooth and clear, so the audience always knows who is where.',
      'CUT ON ACTION. Make the cut in the middle of a movement, such as a person sitting down or opening a door. The movement carries your eye across the cut, so the join is hidden.',
      'THE 180 DEGREE RULE. Imagine a line between two people who are talking. Keep the camera on one side of that line. Then person A always looks toward the right and person B always looks toward the left. If you cross the line, they seem to swap places and the audience gets confused.',
      'SHOT AND REVERSE SHOT. In a conversation you cut back and forth between the two speakers, often over the shoulder of the other person.',
      'THE 30 DEGREE RULE. When you cut between two shots of the same subject, change the angle by at least about 30 degrees, or change the shot size. If the two shots look too alike, the cut feels like a mistake.',
      'JUMP CUT. A cut between two very similar shots of the same subject that makes time jump. It feels like a glitch, but it can be used on purpose for style.',
      'CUTAWAY. A shot of something other than the main action, such as a clock or a hand. It gives information and covers a bad join.',
      'J CUT AND L CUT. These are split edits where sound and picture change at different times. In a J cut, the sound of the next shot starts before its picture appears. In an L cut, the sound of the first shot continues over the next picture. Both make conversations feel natural.',
      'MATCH CUT. A cut that links two shots because they share a shape, movement, or idea. For example, a watch face cuts to a clock face.',
      'THE KULESHOV EFFECT. When two shots are placed together, the audience creates a meaning that is not in either shot alone. A face looking, followed by a bowl of food, reads as hunger. The same face followed by a coffin reads as sadness. Editors build meaning by the order of the shots.') },
    { type: 'read', title: 'Pacing and rhythm', minutes: 18, body: P(
      'Every cut has a length. Short shots create speed, energy, and tension. Long shots create calm, patience, or dread.',
      'A good editor changes the rhythm to match the story. A chase may use many short shots. A sad memory may hold one long shot. Match the rhythm to the feeling, and do not cut randomly.',
      'Also let a shot breathe. Cut a little after the action finishes and a little before the next one begins, so the audience has a moment to understand.') },
    { type: 'read', title: 'Worked example: a canteen conversation', minutes: 20, body: P(
      'Here is how an editor might cut a short scene. This is a model, not your answer.',
      'SHOTS. A, wide shot of the canteen. B, medium shot of Ana speaking. C, medium shot of Ben listening. D, close up of Ana\'s hand gripping her tray. E, close up of Ben\'s face. F, clock on the wall.',
      'THE CUT. Start with A so we know where we are. Cut on action to B as Ana sits down. Use shot and reverse shot between B and C for the talk, staying on one side of the line. Hold the cut to D when Ana gets nervous, and let her last line carry over Ben\'s face in E as an L cut. Use F as a cutaway to show time passing.',
      'Notice that every cut has a reason. When you can say why, you are editing, not just joining clips.') },
    { type: 'do', title: 'Activity: cut the six shots', minutes: 30, body: P(
      'These are the six shots for your activity. Two students, Mia and Joel, argue in the school canteen.',
      'SHOT 1, wide shot of the whole canteen with Mia and Joel at a table.',
      'SHOT 2, medium shot of Mia talking, over Joel\'s shoulder.',
      'SHOT 3, medium shot of Joel listening, over Mia\'s shoulder.',
      'SHOT 4, close up of Mia\'s hand pushing a paper across the table.',
      'SHOT 5, close up of Joel\'s face as he reads it.',
      'SHOT 6, a clock on the wall showing it is almost time for class.',
      'Plan your cut. Decide which shot comes first, where you use shot and reverse shot, where you use a cutaway, and where sound could carry over the cut. Write your order and your reasons in the box.') },
    { type: 'reflect', title: 'Reflection before your activity', minutes: 10, body: P(
      'Answer these for yourself before you write your activity. You do not submit them.',
      '1. Which cut do you notice most often in films you watch?',
      '2. Which rule do you think beginners break most often?',
      '3. Think of a film moment that gave you a feeling. What was the rhythm of the cuts?') },
  ],
});
const q3 = quiz(a3.activity_id, MODULE, [
  ['A cut on action means cutting:', 'in the middle of a movement', ['only at the end of a scene', 'only when there is no sound', 'only on a close up'], 'D'],
  ['The 180 degree rule says the camera should:', 'stay on one side of the line between the subjects', ['always rotate around the actors', 'always be above the actors', 'never move'], 'B'],
  ['If you cross the 180 degree line, the audience may be:', 'confused because characters seem to swap sides', ['happier', 'more patient', 'unable to hear'], 'A'],
  ['Shot and reverse shot is mostly used for:', 'conversations', ['landscapes', 'title cards', 'fight scenes only'], 'C'],
  ['A J cut means:', 'the sound of the next shot starts before its picture', ['the picture of the next shot starts before its sound', 'the film ends', 'the shot is blurry'], 'B'],
  ['An L cut means:', 'the sound of the first shot continues over the next picture', ['the sound stops before the cut', 'the picture turns black', 'the speakers change'], 'A'],
  ['A cutaway is:', 'a shot of something other than the main action', ['the first shot of the film', 'a shot that is upside down', 'a fade to black'], 'D'],
  ['A match cut connects two shots because they:', 'share a shape, movement, or idea', ['have the same length', 'were shot on the same day', 'have the same sound level'], 'C'],
  ['Short shots mostly create:', 'speed, energy, or tension', ['calm and dread', 'silence', 'a sad mood only'], 'A'],
  ['The Kuleshov effect says that:', 'the order of shots creates meaning that is not in either shot alone', ['all shots must be the same length', 'faces should never be filmed', 'sound is not needed'], 'B'],
]);

// =============================================================================
// LESSON 4: Color correction
// =============================================================================
const a4 = base({
  activity_id: 'G10-A2.4', module_id: MODULE, order: 4, week: 'Week 4',
  title: 'Color Correction: Fix It First',
  is_performance_task: false,
  lesson_goal: 'I want you to tell the difference between color correction and color grading, read the scopes, and fix exposure and white balance in Kdenlive.',
  before_hook: 'Your phone clips are never perfect. One is too dark, one is too yellow, and one is too bright. If you put them side by side, the film looks like it was made by three different people. Before you give your film a style, you must first make every clip look right and look alike. That repair work is called color correction.',
  watch_for: [
    'What is the difference between correcting and grading?',
    'What does each scope show, and which one finds a color cast?',
    'In what order does the editor fix things?',
  ],
  video_slot: 'Color correction versus color grading, 5 to 15 minutes, English.',
  video_candidate: 'Color Correction vs. Color Grading: The Difference That Matters',
  video_preview_note: VIDEO_NOTE, video_status: VSTAT,
  video_title: 'Color Correction vs. Color Grading: The Difference That Matters',
  video_url: 'https://www.youtube.com/watch?v=S8kyJfxdlAI',
  after_bridge: 'So correction comes first. You fix exposure, then white balance, then contrast, and you check your work with the scopes, not only with your eyes. Once every clip looks natural and matches its neighbors, you are ready to give the film a look.',
  activity_brief: 'Read the three problems in the activity box. For each one, say what is wrong, name the scope that helped you see it, and say which Kdenlive tool or setting you would use to fix it (for example Levels or Lift, Gamma, Gain). Write 5 to 7 sentences. If you have your own footage, you may also describe one clip you corrected.',
  submission_type: 'Short text',
  tool: 'Kdenlive, and optionally one of your own clips.',
  rubric: [
    { criteria: 'Diagnoses the problem in each of the three shots', points: 4 },
    { criteria: 'Names a scope that shows the problem', points: 3 },
    { criteria: 'Names a sensible tool or move to fix each one', points: 3 },
  ],
  rubric_total: 10,
  sections: [
    { type: 'read', title: 'Warm up: why your eyes lie', minutes: 10, body: P(
      'Look at a white paper under a yellow bulb. Your brain tells you it is white. A camera does not. It records the yellow, and the paper looks orange on screen.',
      'Your eyes also get used to a dark room, so a dark clip can look fine to you in the evening and terrible at school in the morning. That is why editors use scopes. A scope shows what is really in the picture.') },
    { type: 'read', title: 'Correction and grading are different jobs', minutes: 22, body: P(
      'COLOR CORRECTION is the repair job. You fix exposure, white balance, and contrast, so the clip looks natural and matches the shots around it.',
      'COLOR GRADING is the creative job. You give the film a look and a mood on purpose. We do that in the next lesson.',
      'Always correct first and grade second. If you grade on top of a bad base, the problems get worse.') },
    { type: 'read', title: 'The scopes: how to read them', minutes: 30, body: P(
      'Scopes are small graphs that measure your picture. You open them from the View menu. Names and menu paths can differ slightly by version.',
      'HISTOGRAM. Shows how many parts of the picture are dark, medium, or bright. The left side is shadows. The right side is highlights. If everything bunches on the left, the picture is too dark. If it bunches on the right, it is too bright.',
      'WAVEFORM. Shows brightness across the picture from left to right. Near the bottom is dark. Near the top is bright. If the trace flattens against the very top, the highlights are clipped, which means detail is lost.',
      'RGB PARADE. Shows the red, green, and blue channels side by side. For something that should be neutral, like a white wall or gray shirt, the three channels should look about the same height. If blue sits higher than red and green, the picture has a blue cast. If red is higher, it is too warm.',
      'VECTORSCOPE. Shows color and how strong it is. Colors are spread around a circle, and the more saturated a color is, the farther it is from the center. Skin tones should fall along a diagonal line called the skin tone line. If skin is far off that line, it looks sick or sunburnt.') },
    { type: 'read', title: 'The correction order, and the tools', minutes: 25, body: P(
      'FIX IN THIS ORDER. First exposure, then white balance, then contrast, then saturation. Check the scopes after each step.',
      'EXPOSURE. If a clip is too dark, brighten it. If highlights are clipped, bring them down. Use the Levels effect to set the black point and the white point, or use Lift, Gamma, Gain.',
      'LIFT, GAMMA, GAIN. This effect has three color wheels. Lift mostly affects the shadows. Gamma mostly affects the midtones. Gain mostly affects the highlights. Start with the midtones, make small moves, and check the scopes. You can often leave the shadows alone.',
      'WHITE BALANCE. Find something that should be neutral in the picture. Adjust until the RGB Parade shows red, green, and blue close together there. A blue cast is fixed by adding warmth. An orange cast is fixed by adding blue.',
      'MATCH YOUR SHOTS. After you fix one clip, look at the next clip in the film. They should look like they were filmed in the same place at the same time.',
      'LESS IS MORE. Small moves look natural. Big moves create noise, banding, and strange colors.') },
    { type: 'read', title: 'Worked example: three bad shots', minutes: 18, body: P(
      'Here is how an editor would diagnose three problems. This is a model.',
      'SHOT ONE. The histogram is bunched at the left. DIAGNOSIS: underexposed. SCOPE: histogram. FIX: lift the midtones with Gamma or raise the white point in Levels.',
      'SHOT TWO. The waveform is flat against the very top. DIAGNOSIS: highlights are clipped. SCOPE: waveform. FIX: lower the Gain wheel.',
      'SHOT THREE. In the RGB Parade the blue channel is higher than the red and green. DIAGNOSIS: blue color cast. SCOPE: RGB Parade. FIX: warm the picture until the three channels line up on the neutral parts.',
      'Notice the pattern: name the problem, name the scope, name the fix.') },
    { type: 'do', title: 'Activity: diagnose three shots', minutes: 30, body: P(
      'Here are the three problems for your activity.',
      'PROBLEM A. The histogram of a night street shot is packed into the left third, and the image looks muddy.',
      'PROBLEM B. In a shot of a classmate by a window, the waveform is flat against the top and her forehead looks pure white with no detail.',
      'PROBLEM C. In a shot filmed under an orange bulb, the RGB Parade shows red much higher than green and blue, and a white wall looks orange.',
      'For each one, write the diagnosis, the scope, and the fix.',
      'OPTIONAL. Import one of your own clips, open the scopes, and correct it. Write what you changed.') },
    { type: 'reflect', title: 'Reflection before your activity', minutes: 10, body: P(
      'Answer these for yourself before you write your activity. You do not submit them.',
      '1. Which scope made the most sense to you?',
      '2. Why is it a mistake to trust only your eyes?',
      '3. Which of your own clips needs the most correction?') },
  ],
});
const q4 = quiz(a4.activity_id, MODULE, [
  ['Color correction is:', 'fixing exposure, white balance, and contrast so footage looks natural', ['adding a stylish look', 'adding music', 'cutting clips'], 'C'],
  ['Color grading is:', 'giving the film a creative look and mood', ['repairing a broken file', 'recording sound', 'exporting the film'], 'A'],
  ['Which comes first?', 'correction', ['grading', 'export', 'adding titles'], 'B'],
  ['In a histogram, the left side shows the:', 'shadows', ['highlights', 'skin tones', 'sound'], 'A'],
  ['A waveform flat against the very top means:', 'the highlights are clipped', ['the picture is perfect', 'the shadows are too bright', 'the sound is too loud'], 'D'],
  ['The RGB Parade is best for finding a:', 'color cast', ['missing clip', 'bad microphone', 'wrong frame rate'], 'B'],
  ['If blue is higher than red and green across a neutral wall, the picture has:', 'a blue cast', ['an orange cast', 'no color problem', 'a sound problem'], 'C'],
  ['Skin tones should fall near which line on the vectorscope?', 'the skin tone line', ['the center dot only', 'the outer edge only', 'any random line'], 'A'],
  ['In Lift, Gamma, Gain, the Gamma wheel mostly affects the:', 'midtones', ['shadows', 'highlights', 'audio'], 'D'],
  ['What is the correct order of fixes?', 'exposure, white balance, contrast, saturation', ['saturation, contrast, white balance, exposure', 'sound, picture, export, title', 'grading first, then everything else'], 'B'],
]);

// =============================================================================
// LESSON 5: Color grading
// =============================================================================
const a5 = base({
  activity_id: 'G10-A2.5', module_id: MODULE, order: 5, week: 'Week 5',
  title: 'Color Grading: Build the Look',
  is_performance_task: false,
  lesson_goal: 'I want you to use color on purpose to create a mood, build a look in Kdenlive, and keep that look consistent across all your shots.',
  before_hook: 'Two films can have the same story and feel completely different, only because of color. A warm golden glow feels like a memory. A cold blue cast feels like loneliness. Color is not decoration. It is a way of telling the audience how to feel before a single word is spoken. Today you learn how to do that, and how not to overdo it.',
  watch_for: [
    'Which colors does the video use for warm, calm, tense, or sad moments?',
    'How does the editor keep the same look across different shots?',
    'Which part of the picture should stay natural?',
  ],
  video_slot: 'Lift, Gamma, Gain in Kdenlive, 5 to 15 minutes, English.',
  video_candidate: 'Understanding Basic fundamentals of Lift, Gamma and Gain in Kdenlive',
  video_preview_note: VIDEO_NOTE, video_status: VSTAT,
  video_title: 'Understanding Basic fundamentals of Lift, Gamma and Gain in Kdenlive',
  video_url: 'https://www.youtube.com/watch?v=RtRX1cy2BQY',
  after_bridge: 'So grading is a decision. You choose the temperature, the contrast, and the saturation to match the story. You keep skin tones believable. You build the look on one shot, then copy it across the others, and you check them side by side. A strong look is simple and consistent.',
  activity_brief: 'Write a look plan for three moments in a short film: a happy ending, a tense chase, and a sad memory. For each moment, say whether the picture should be warm or cool, high or low contrast, and bright or muted in color, and say which Lift, Gamma, Gain move you would use. Write 5 to 7 sentences, and say why each choice fits the feeling.',
  submission_type: 'Short text',
  tool: 'Kdenlive, and optionally one of your corrected clips.',
  rubric: [
    { criteria: 'Gives a clear look for each of the three moments', points: 4 },
    { criteria: 'Explains why each choice fits the feeling', points: 3 },
    { criteria: 'Names a sensible Lift, Gamma, Gain or color move for each', points: 3 },
  ],
  rubric_total: 10,
  sections: [
    { type: 'read', title: 'Warm up: the feeling of a color', minutes: 10, body: P(
      'Close your eyes and picture a sunset on a quiet beach. What color is it? Now picture a hospital hallway at night. What color is that?',
      'You just graded two scenes in your mind. Filmmakers do the same thing with real tools.') },
    { type: 'read', title: 'The tools of a look', minutes: 28, body: P(
      'TEMPERATURE. Warm pictures lean orange and yellow. They feel comfortable, energetic, nostalgic, or sometimes hot and dangerous. Cool pictures lean blue and teal. They feel calm, distant, lonely, or cold.',
      'CONTRAST. High contrast has deep shadows and bright highlights and feels dramatic or intense. Low contrast looks soft and gentle, and sometimes dull or dreamy.',
      'SATURATION. High saturation looks vivid and playful. Low saturation looks muted, serious, or sad.',
      'COMPLEMENTARY COLORS. Orange and teal sit on opposite sides of the color wheel, so they make each other stand out. Many films push the skin tones slightly warm and the shadows and backgrounds slightly teal. It is a popular look, but it can be overused.',
      'KEEP SKIN TONES NATURAL. Viewers notice strange skin faster than any other color. Check the vectorscope skin tone line, even while you grade.',
      'LIFT, GAMMA, GAIN FOR LOOKS. After you correct a clip, you can tint the three ranges differently. For example, add a little teal to the shadows with Lift and a little warmth to the highlights with Gain. Use small moves.',
      'LUTS. A LUT is a saved look that can be applied to many clips. Filmmakers use them to start from a style. You can also copy the effects you already built on one clip and paste them onto others.') },
    { type: 'read', title: 'Consistency and restraint', minutes: 20, body: P(
      'BUILD ONCE, COPY OFTEN. Grade one clip until you like it. Then right click it, choose to copy its effects, select the other clips of that scene, and paste the effects. Look for the copy and paste effects commands in the clip menu. Then fine tune each clip, because shots are never identical.',
      'CHECK SIDE BY SIDE. Play from one shot to the next. If the color jumps, they do not match, and the audience will feel the cut.',
      'MOTIVATE YOUR LOOK. A look should come from the story. A warm look in the morning scene and a cool look at night makes sense. A random blue tint on one shot does not.',
      'LESS IS MORE. If the audience notices your grade, it may be too strong. A subtle look often feels more professional.') },
    { type: 'read', title: 'Worked example: one scene, three looks', minutes: 20, body: P(
      'Here is a model for the same scene of a girl waiting at a bus stop. This is not your answer.',
      'LOOK ONE, HOPEFUL. Warm temperature, medium contrast, slightly raised saturation. A little warmth in the Gain wheel. The girl is smiling because her bus is coming.',
      'LOOK TWO, TENSE. Cool temperature, high contrast, lowered saturation. A teal tint in the Lift wheel and the highlights pulled down. She is late and worried.',
      'LOOK THREE, SAD. Cool temperature, low contrast, strongly lowered saturation. Everything looks flat and gray blue. Her bus never came.',
      'Same footage, three feelings. The only thing that changed was the grade.') },
    { type: 'do', title: 'Activity: plan your three looks', minutes: 30, body: P(
      'Write your look plan.',
      '1. A happy ending. Warm or cool? High or low contrast? Bright or muted?',
      '2. A tense chase. Warm or cool? High or low contrast? Bright or muted?',
      '3. A sad memory. Warm or cool? High or low contrast? Bright or muted?',
      '4. For each, say which Lift, Gamma, or Gain move you would use.',
      '5. Optional. Open one of your corrected clips in Kdenlive, add the Lift, Gamma, Gain effect, and try your happy ending look. Take notes on what you changed.') },
    { type: 'reflect', title: 'Reflection before your activity', minutes: 10, body: P(
      'Answer these for yourself before you write your activity. You do not submit them.',
      '1. Which mood is the easiest to create with color, and which is the hardest?',
      '2. What is one film look you like, and why does it work?',
      '3. How will you keep your film consistent from the first shot to the last?') },
  ],
});
const q5 = quiz(a5.activity_id, MODULE, [
  ['Cool colors such as blue and teal often feel:', 'calm, distant, or lonely', ['warm and nostalgic', 'loud', 'tasty'], 'D'],
  ['Warm colors such as orange often feel:', 'comfortable or energetic', ['cold and sad', 'silent', 'invisible'], 'A'],
  ['High contrast usually looks:', 'dramatic or intense', ['soft and dreamy', 'blurry', 'silent'], 'C'],
  ['Low saturation usually looks:', 'muted, serious, or sad', ['vivid and playful', 'bright orange', 'very loud'], 'B'],
  ['Orange and teal are popular together because they are:', 'complementary colors', ['the same color', 'warm colors only', 'sound frequencies'], 'A'],
  ['Which part of the picture should stay believable?', 'skin tones', ['the sky', 'the credits', 'the file name'], 'C'],
  ['A LUT is:', 'a saved look that can be applied to many clips', ['a type of microphone', 'a camera lens', 'a kind of cut'], 'B'],
  ['To keep your look consistent, you can:', 'copy the effects from one clip and paste them onto the others', ['grade every clip with a random look', 'avoid looking at the shots side by side', 'use a different style on every shot'], 'D'],
  ['If the audience notices your grade, it may be:', 'too strong', ['perfect', 'invisible', 'a sound problem'], 'A'],
  ['A look should be chosen:', 'to fit the story and the mood', ['randomly', 'only because it is popular', 'only to hide bad footage'], 'B'],
]);

// =============================================================================
// LESSON 6: Sound in editing
// =============================================================================
const a6 = base({
  activity_id: 'G10-A2.6', module_id: MODULE, order: 6, week: 'Week 6',
  title: 'Sound in Editing: Hear the Story',
  is_performance_task: false,
  lesson_goal: 'I want you to build a clean sound mix with dialogue, ambience, music, and effects, and to set the levels so the audience can always understand the story.',
  before_hook: 'Audiences forgive a shaky picture, but they leave when they cannot understand the words. Sound is half of every film. A good mix is invisible. You only notice a bad one. Today you learn how to build a sound mix that supports the story and does not fight it.',
  watch_for: [
    'How does the editor make the voice stand out over the music?',
    'What happens to the sound when the level goes too high?',
    'Which sounds are added besides the dialogue?',
  ],
  video_slot: 'Mixing voice and music in Kdenlive, English.',
  video_candidate: 'How to Mix Your Voice with Music - Kdenlive Tutorial',
  video_preview_note: VIDEO_NOTE, video_status: VSTAT,
  video_title: 'How to Mix Your Voice with Music - Kdenlive Tutorial',
  video_url: 'https://www.youtube.com/watch?v=oLdYnkcLUWI',
  after_bridge: 'So a mix has layers. Dialogue is the most important and must stay clear. Ambience makes the place feel real. Music adds feeling but stays below the voice. Effects add punch at the right moment. And you watch the meters so nothing ever goes into the red.',
  activity_brief: 'Write a sound plan for a 30 second scene of your choice. List the layers you would use (dialogue, ambience, music, and effects), say which is loudest and which is quietest, say where the music would get quieter under dialogue, and say where you would use one L cut or one J cut for sound. Write 5 to 7 sentences.',
  submission_type: 'Short text',
  tool: 'Kdenlive, and headphones if you have them.',
  rubric: [
    { criteria: 'Lists the layers of the mix with a clear order of loudness', points: 4 },
    { criteria: 'Explains where and why the music gets quieter', points: 3 },
    { criteria: 'Uses one split edit (L cut or J cut) sensibly', points: 3 },
  ],
  rubric_total: 10,
  sections: [
    { type: 'read', title: 'Warm up: close your eyes', minutes: 10, body: P(
      'Play a scene from a film with your eyes closed. You can still follow the story, because you hear footsteps, a door, a voice, and a sad piece of music. Now watch it with the sound off. It feels empty.',
      'Sound is not an extra. It is part of the story.') },
    { type: 'read', title: 'The layers of a mix', minutes: 28, body: P(
      'DIALOGUE. The most important layer. Everything else must give way so the audience can understand the words. If a line is hard to hear, fix that first.',
      'ROOM TONE. The quiet sound of a place when nobody is talking. Record about thirty seconds of silence at every location. Use it to fill gaps, so the cuts between shots do not suddenly fall into dead silence.',
      'AMBIENCE. Background sounds that make a place feel real, such as traffic, birds, or a canteen crowd.',
      'SOUND EFFECTS. Specific sounds at specific moments, like a door closing or footsteps. Place them exactly on the action.',
      'MUSIC. It adds feeling. It should support the scene and stay below the voice. Silence is also a choice, and a quiet moment can be powerful.',
      'SPLIT EDITS FOR SOUND. As you saw in Lesson 2, a J cut starts the next sound before its picture, and an L cut keeps the last sound after the picture changes. They make a film feel smooth and connected.') },
    { type: 'read', title: 'Levels, meters, and mixing in Kdenlive', minutes: 25, body: P(
      'The Audio Mixer panel shows a fader and a level meter for each track. Look for it in the View menu. Names can differ slightly in your version.',
      'KEEP IT OUT OF THE RED. The meter measures loudness in dB. If the meter reaches the top and turns red, the sound is clipping and it will crackle and distort. Keep the loudest peaks below 0 dB.',
      'DIALOGUE FIRST. Put dialogue on its own audio track and set it so it is clearly the loudest part of the mix, but not in the red.',
      'MUSIC UNDER THE VOICE. Put music on a separate track and lower it a lot so the words are easy to hear. Raise it only in the gaps between lines. Lowering the music while someone speaks is often called ducking.',
      'FADES. Add a short fade in and fade out at the ends of music and effects, so there are no sudden pops.',
      'LISTEN ON THE RIGHT DEVICE. Headphones show you problems that laptop speakers hide. If you can, check your mix on both.',
      'SPLIT AUDIO. If your clip has sound and picture together, you can separate them so you can move the audio on its own. Look for the option to extract or separate audio in the clip menu.') },
    { type: 'read', title: 'Worked example: a 30 second scene', minutes: 18, body: P(
      'Here is a model for a scene where a student waits for exam results. This is not your answer.',
      'LAYERS. Dialogue on track A1, room tone and canteen ambience on A2, music on A3, effects on A4.',
      'LEVELS. Dialogue is loudest. Ambience is very quiet. Music is lowered under every line and raised a little in the pauses. Effects hit on the action.',
      'SPLIT EDIT. When the teacher\'s voice says the student\'s name, use a J cut: her voice begins over the previous shot, before we see her face.',
      'ENDING. The music fades out as the screen fades to black.') },
    { type: 'do', title: 'Activity: plan your mix', minutes: 30, body: P(
      'Choose any scene you like. It can be from a film you know, or your own.',
      '1. List the layers: dialogue, ambience, music, and effects.',
      '2. Number them from loudest to quietest.',
      '3. Mark where the music should get quieter under dialogue.',
      '4. Choose one place for an L cut or a J cut for sound.',
      '5. Optional. Open your own clip in Kdenlive, open the Audio Mixer, and balance one dialogue track and one music track. Write what you changed.') },
    { type: 'reflect', title: 'Reflection before your activity', minutes: 10, body: P(
      'Answer these for yourself before you write your activity. You do not submit them.',
      '1. Which sound problem did you notice most in your own videos?',
      '2. Why is room tone useful?',
      '3. Which layer of your mix matters most for your film?') },
  ],
});
const q6 = quiz(a6.activity_id, MODULE, [
  ['Which layer of a mix is the most important?', 'dialogue', ['music', 'effects', 'ambience'], 'B'],
  ['Room tone is:', 'the quiet sound of a place when nobody is talking', ['a loud sound effect', 'a type of music', 'the film title'], 'D'],
  ['Why do editors record room tone?', 'to fill gaps so cuts do not fall into dead silence', ['to make the film longer', 'to hide the picture', 'to change the language'], 'A'],
  ['Ambience is:', 'background sound that makes a place feel real', ['the main speech', 'the final credits', 'a camera movement'], 'C'],
  ['If a level meter goes into the red, the sound is probably:', 'clipping and distorted', ['perfect', 'too quiet', 'missing'], 'A'],
  ['Where should the loudest peaks stay?', 'below 0 dB', ['above 0 dB', 'at the lowest level only', 'it does not matter'], 'B'],
  ['Music under dialogue should be:', 'lowered so the words are easy to hear', ['louder than the voice', 'removed completely always', 'played backwards'], 'C'],
  ['Lowering the music while someone speaks is often called:', 'ducking', ['clipping', 'slicing', 'rendering'], 'D'],
  ['A short fade at the end of a music track helps to:', 'avoid sudden pops', ['make it louder', 'remove the voice', 'change the color'], 'A'],
  ['A J cut for sound means the next sound:', 'starts before its picture appears', ['starts after its picture ends', 'never starts', 'plays backwards'], 'B'],
]);

// =============================================================================
// LESSON 7: Performance task
// =============================================================================
const a7 = base({
  activity_id: 'G10-A2.7', module_id: MODULE, order: 7, week: 'Weeks 7 to 8',
  title: 'Edit and Grade Your Scene',
  is_performance_task: true,
  lesson_goal: 'I want you to edit a short scene from your own footage in Kdenlive, correct and grade its color, mix its sound, and share the finished film.',
  before_hook: 'This is the lesson where everything comes together. You have the plan from Lesson 1, the rules of cutting from Lesson 2, the screen from Lesson 3, the color skills from Lessons 4 and 5, and the sound skills from Lesson 6. Now you build a real piece of film. It does not have to be long. It has to be clean.',
  watch_for: [],
  after_bridge: 'So a finished edit is a chain of decisions. You chose the order of the shots, the rhythm, the correction, the look, and the sound. You can explain every one of them. That is what makes you an editor and not just someone who joins clips.',
  activity_brief: 'Edit a scene of 60 to 90 seconds from your own footage in Kdenlive. It must have clean cuts that follow the principles from Lesson 2, corrected color that matches from shot to shot, a graded look that fits the mood, and a clear sound mix. Export it as an MP4 at 720p, upload it to Google Drive or YouTube (unlisted), and paste the link below. In your reflection, explain three choices you made and why.',
  submission_type: 'Link',
  tool: 'Kdenlive, your own footage, and headphones if you have them.',
  rubric: [
    { criteria: 'Cuts follow editing principles and the story is easy to follow', points: 5 },
    { criteria: 'Color is corrected first and graded with a clear purpose', points: 5 },
    { criteria: 'Sound is clear, balanced, and never in the red', points: 4 },
    { criteria: 'Pacing and structure fit the story, with a clean start and end', points: 3 },
    { criteria: 'Exported correctly, and the link opens and plays', points: 3 },
  ],
  rubric_total: 20,
  sections: [
    { type: 'read', title: 'Warm up: the editor\'s checklist', minutes: 10, body: P(
      'Professional editors follow the same order every time. They do not start with effects. They start with the story.',
      'Our order: 1. Organize. 2. Rough cut. 3. Fine cut. 4. Correct. 5. Grade. 6. Sound. 7. Export. If you follow this order, you will waste less time and your film will look more professional.') },
    { type: 'read', title: 'The seven steps', minutes: 30, body: P(
      'STEP 1, ORGANIZE. Put all your clips in one folder. Start a new project in that folder with proxy clips on. Import everything into the Project Bin. Rename or group your clips if it helps.',
      'STEP 2, ROUGH CUT. Put the shots on the timeline in story order. Do not worry about perfect timing yet. Check that the story makes sense from start to finish.',
      'STEP 3, FINE CUT. Trim every clip so it starts and ends at the right moment. Cut on action, follow the 180 degree rule, and use cutaways, J cuts, and L cuts where they help. Match the rhythm to the mood.',
      'STEP 4, CORRECT. Fix exposure and white balance on every clip using the scopes. Make neighboring shots match.',
      'STEP 5, GRADE. Choose one look that fits the story. Build it on one clip, copy it to the others, and fine tune each.',
      'STEP 6, SOUND. Clean the dialogue, add room tone and ambience, add music and effects, lower the music under the voice, add fades, and keep every peak out of the red.',
      'STEP 7, EXPORT. Click Render, choose MP4, set the size to 720p, and export. Then watch the exported file from start to finish before you share it.') },
    { type: 'read', title: 'Worked example: a plan for a 60 second scene', minutes: 20, body: P(
      'Here is a model plan. This is not your film.',
      'STORY. A student waits for a friend who never arrives.',
      'CUTS. A wide shot of the empty bench, then a cut on action as she sits down, a close up of her watching the clock, a cutaway to the clock, and a long final shot.',
      'COLOR. Warm and gentle at the beginning. A slow shift to cooler, lower saturation as time passes.',
      'SOUND. Room tone and distant traffic throughout. A soft piano begins halfway and stays under the ambience. Silence in the last shot.',
      'Notice that the plan connects the three skills: the cuts, the color, and the sound all say the same thing, which is waiting and loneliness.') },
    { type: 'do', title: 'Activity: make your film', minutes: 60, body: P(
      'Follow the seven steps. Save often.',
      'Before you export, check this list.',
      '1. Does the story make sense from start to finish?',
      '2. Are there any jump cuts or crossed lines you did not mean to make?',
      '3. Do neighboring shots match in color and brightness?',
      '4. Is the dialogue easy to hear? Is the music lower than the voice?',
      '5. Does any sound reach the red?',
      '6. Is there a clean start and a clean end, with no black gaps in the middle?',
      'To share it. Upload your MP4 to Google Drive, right click it, choose Share, set it to Anyone with the link, and copy the link. Or upload to YouTube as Unlisted. Paste the link in the box below.') },
    { type: 'reflect', title: 'Reflection before you submit', minutes: 10, body: P(
      'Answer these for yourself before you submit. You do not submit them separately.',
      '1. Explain one cut you made and which principle it follows.',
      '2. Explain one color choice and what feeling it creates.',
      '3. Explain one sound choice and why the audience needs it.') },
  ],
});
const q7 = quiz(a7.activity_id, MODULE, [
  ['What is the correct order for a good edit?', 'organize, rough cut, fine cut, correct, grade, sound, export', ['grade, export, sound, cut', 'export, then cut', 'sound, grade, organize'], 'A'],
  ['A rough cut is:', 'the shots in story order, without perfect timing', ['the final exported film', 'a blurry clip', 'a sound effect'], 'D'],
  ['In the fine cut you:', 'trim every clip so it starts and ends at the right moment', ['export the film', 'add the film title only', 'delete all the sound'], 'B'],
  ['Why do you correct before you grade?', 'grading on a bad base makes problems worse', ['grading is not needed', 'correction is only for sound', 'it makes the file smaller'], 'C'],
  ['What should you do after you build a look on one clip?', 'copy the effects to the other clips and fine tune', ['redo it from nothing on every clip', 'delete the first clip', 'turn off the color'], 'A'],
  ['Where should dialogue be compared with music?', 'dialogue should be clearly louder', ['music should always be louder', 'they must be exactly equal', 'dialogue should be silent'], 'B'],
  ['Before you share your film, you should:', 'watch the exported file from start to finish', ['delete the project', 'only watch the first five seconds', 'turn off the sound'], 'C'],
  ['What export format do we use?', 'MP4', ['a document file', 'a zip folder', 'a photo file'], 'D'],
  ['How do you share your finished film in this course?', 'upload to Google Drive or YouTube and paste the link', ['send the project file only', 'print it', 'save it on your laptop only'], 'A'],
  ['A good edit is one where:', 'every choice has a reason you can explain', ['every effect is used', 'the film is as long as possible', 'the cuts are random'], 'B'],
]);

// ---- Output ------------------------------------------------------------------
const activities = [a1, a2, a3, a4, a5, a6, a7];
const quizzes = [...q1, ...q2, ...q3, ...q4, ...q5, ...q6, ...q7];

const outDir = join(root, 'loadable', 'term2_g10');
mkdirSync(outDir, { recursive: true });
writeFileSync(join(outDir, 'modules.json'), JSON.stringify(modules, null, 2) + '\n');
writeFileSync(join(outDir, 'activities.json'), JSON.stringify(activities, null, 2) + '\n');
writeFileSync(join(outDir, 'quizzes.json'), JSON.stringify(quizzes, null, 2) + '\n');

const q = (v) => { if (v === null || v === undefined) return 'null'; const s = String(v); if (s.includes('$q$')) throw new Error('text contains $q$'); return `$q$${s}$q$`; };
const j = (v) => (v === null || v === undefined ? 'null' : `${q(JSON.stringify(v))}::jsonb`);
const n = (v) => (v === null || v === undefined ? 'null' : String(Number(v)));
const b = (v) => (v ? 'true' : 'false');
const lines = [];
lines.push('-- Grade 10 Media Arts, Term 2: Planning and Editing Your Short Film (7 lessons, 70 quiz questions).');
lines.push('-- Generated by scripts/build-term2-g10.mjs. Paste into the Supabase SQL editor and run.');
lines.push('-- Safe to run again: the module is only created if missing, so it will NOT undo');
lines.push('-- a lock or unlock you set on the Modules page. Lesson text and quizzes are refreshed.');
lines.push('-- The module is created LOCKED. Unlock Term 2 on the teacher Modules page when ready.');
lines.push('');
lines.push('begin;');
lines.push('');
for (const m of modules) {
  lines.push(`insert into public.modules (module_id, title, grade_class, term, "order", weeks, output, content_standard, performance_standard, unlocked) values (${q(m.module_id)}, ${q(m.title)}, ${q(m.grade_class)}, ${q(m.term)}, ${n(m.order)}, ${n(m.weeks)}, ${q(m.output)}, ${q(m.content_standard)}, ${q(m.performance_standard)}, ${b(m.unlocked)}) on conflict (module_id) do nothing;`);
}
lines.push('');
const aCols = ['activity_id','module_id','order','week','title','competency_code','is_performance_task','lesson_goal','before_hook','watch_for','video_slot','video_candidate','video_preview_note','video_status','video_title','video_channel','video_runtime','video_url','after_bridge','activity_brief','submission_type','tool','ai_note','rubric','rubric_total','sections'];
const aVal = (a) => [q(a.activity_id), q(a.module_id), n(a.order), q(a.week), q(a.title), q(a.competency_code), b(a.is_performance_task), q(a.lesson_goal), q(a.before_hook), j(a.watch_for), q(a.video_slot), q(a.video_candidate), q(a.video_preview_note), q(a.video_status), q(a.video_title), q(a.video_channel), q(a.video_runtime), q(a.video_url), q(a.after_bridge), q(a.activity_brief), q(a.submission_type), q(a.tool), q(a.ai_note), j(a.rubric), n(a.rubric_total), j(a.sections)];
const colList = aCols.map((c) => (c === 'order' ? '"order"' : c)).join(', ');
const setList = aCols.filter((c) => c !== 'activity_id').map((c) => `${c === 'order' ? '"order"' : c} = excluded.${c === 'order' ? '"order"' : c}`).join(', ');
for (const a of activities) lines.push(`insert into public.activities (${colList}) values (${aVal(a).join(', ')}) on conflict (activity_id) do update set ${setList};`);
lines.push('');
lines.push(`delete from public.quizzes where activity_id in (${activities.map((a) => q(a.activity_id)).join(', ')});`);
for (const z of quizzes) lines.push(`insert into public.quizzes (quiz_id, activity_id, module_id, "order", question, option_a, option_b, option_c, option_d, correct) values (${q(z.quiz_id)}, ${q(z.activity_id)}, ${q(z.module_id)}, ${n(z.order)}, ${q(z.question)}, ${q(z.option_a)}, ${q(z.option_b)}, ${q(z.option_c)}, ${q(z.option_d)}, ${q(z.correct)});`);
lines.push('');
lines.push("select (select count(*) from public.modules where module_id = 'G10-M2') as modules, (select count(*) from public.activities where module_id = 'G10-M2') as lessons, (select count(*) from public.quizzes where module_id = 'G10-M2') as quiz_questions;");
lines.push('');
lines.push('commit;');
writeFileSync(join(root, 'supabase', 'term2_g10_film.sql'), lines.join('\n') + '\n');
console.log('Built:', modules.length, 'module,', activities.length, 'lessons,', quizzes.length, 'quiz questions');
