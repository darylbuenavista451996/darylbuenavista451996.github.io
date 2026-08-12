# Vizta

An e-learning platform for students, with per-student lesson progress and gamified task completion.

## Features

* Subject-scoped lessons — currently Mathematics and Media Arts, each tracked independently per student
* Progress locking — students can't skip ahead or see answers before completing the current task
* Task-completion banners that unlock the next lesson, keeping students on a guided path

## How this is built

This site is developed and maintained using Claude Code as an AI coding agent — I direct feature scope and review changes, and Claude implements them commit by commit. It's a working example of using AI agents inside a real development workflow, not just as an API called from application code.

## Stack

HTML5UP-based front end, extended with custom lesson modules (`vizta-mathematics`, `vizta-learning`, `vizta-site`).
