# CLAUDE.md

## Project Overview
This is a personal portfolio website for a product designer. The goal is to present the designer's work clearly and create a strong impression with recruiters, design directors, design managers, design leads, and founders evaluating design talent — primarily for junior-level product design roles (or candidates open to this experience level).

The site should communicate: strong product thinking, visual craft, ability to initiate and work independently, technical fluency, and clear communication. It should feel simple, minimalistic, and clean, with polish coming from intentional micro-interactions — not decoration, template patterns, or corporate formality.

## Tech Stack
Recommended stack — confirm before scaffolding, revisit if requirements change:
- **Framework:** Next.js (App Router) + TypeScript — file-based routing fits home/about/work-detail pages cleanly, supports static export for GitHub Pages or zero-config deploy to Vercel, and keeps the door open for server features later without a rewrite.
- **Styling:** Tailwind CSS, with the config extended to map directly to the tokens in `content/design.md` (colors, spacing, radius, type scale) — token changes stay in one place instead of scattered across components.
- **Motion:** Framer Motion — fine control over hover/press micro-interactions, respects `prefers-reduced-motion` natively.
- **Content:** Markdown/MDX in `/content`, parsed at build time (e.g. via `gray-matter`) — keeps portfolio copy out of components.
- **Local dev first:** build and test on `localhost` before deciding GitHub Pages vs. Vercel for deployment — static export keeps both options open.

## Before Making Changes
- Read `content/portfolio.md`
- Read `content/design.md`
- Inspect the existing project structure
- Reuse existing components where possible
- Do not invent portfolio facts
- Do not invent project metrics
- Do not invent employers, clients, or responsibilities

## Design Principles
Prioritize, in order:
1. Typography
2. Layout
3. Content hierarchy
4. Image presentation
5. Motion

Avoid unnecessary visual effects. The website should feel bespoke rather than template-driven.

## Content Rules
Portfolio content is stored in `/content`. Do not hardcode long-form portfolio copy inside React components. If information is missing, use a clearly marked placeholder rather than inventing information.

## Implementation Rules
- Use TypeScript
- Keep components reusable
- Prefer simple solutions
- Maintain responsive layouts
- Test mobile and desktop states
- Check accessibility
- Respect `prefers-reduced-motion`

## Before Completing a Task
Check:
- Mobile layout
- Desktop layout
- Typography hierarchy
- Image loading
- Links
- Accessibility
- Console errors

## Tone
The writing should be:
- Clear
- Concise
- Confident
- Human
- Specific

Avoid:
- Corporate jargon
- Empty claims
- Generic phrases like "passionate about innovation"

## Reference Files
- `content/portfolio.md` — background, experience, project list, target audience, positioning
- `content/design.md` — visual direction, design tokens, component states, motion principles

@AGENTS.md
