# Design Direction

*Visual direction and design tokens for the site. Values marked `[PLACEHOLDER]` are pending — fill in as decisions are finalized, don't infer them.*

## Philosophy
- Simple, minimalistic, clean
- Generous spacing, restrained color palette
- No template-like layouts, nothing generic or "camp"
- Not overly formal or corporate — should feel bespoke, not templated
- Micro-interactions (hover / press) add polish without becoming decoration
- Motion is intentional, never decorative for its own sake
- Mobile and desktop should feel like one coherent system, not two separate designs

## Design Tokens
*(Structure below — exact values to be filled in as they're decided)*

### Typography
- Primary typeface: `[PLACEHOLDER]`
- Type scale: `[PLACEHOLDER]`
- Usage notes (headings, body, captions): `[PLACEHOLDER]`

### Color
- Palette: restrained, minimal — exact hex/token values TBD
- Tokens to define: background, surface, text-primary, text-secondary, border, accent: `[PLACEHOLDER]`

### Spacing
- Scale: `[PLACEHOLDER]` — should read as generous throughout

### Radius
- Scale: `[PLACEHOLDER]`

### Component States
For every interactive component, document:
- Default
- Hover
- Active / press
- Focus (keyboard)
- Disabled

*(Values filled in per component as they're built)*

### Motion
- Micro-interactions live on hover / press states
- Every animation gets documented here once implemented: trigger, duration, easing, and why it exists
- Must respect `prefers-reduced-motion`
- Durations / easing curves: `[PLACEHOLDER]`

## Responsive Behavior
- Breakpoints: `[PLACEHOLDER]`
- Layouts should feel like variations of one system, not separate designs per device

## Future Extensibility
- Token structure should stay clean enough to support additional modes (e.g. light/dark) later without restructuring
