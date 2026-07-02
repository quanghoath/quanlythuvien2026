# Quan Ly Thu Vien Design System

## Product Direction

- Pattern: enterprise operations dashboard for dense library workflows
- Tone: calm, precise, trustworthy, efficient
- Density: compact desktop layout with generous grouping and clear mobile collapse
- Accessibility: high-contrast typography, visible focus states, non-color status cues

## Typography

- Primary font: Plus Jakarta Sans
- Display font: Sora
- Numeric rhythm: tabular numbers where counts and IDs appear
- Headings: compact, medium weight, low tracking
- Body copy: neutral and concise, optimized for long sessions

## Color System

- Background: cool neutral canvas with subtle blue tint
- Surface: white and elevated white-blue layers
- Primary: deep enterprise blue for key actions and active navigation
- Accent: slate-blue neutrals for hover, filters, and secondary panels
- Success: green
- Warning: amber
- Destructive: red

## Layout Rules

- Use a dark navigation rail with light content workspace
- Keep content inside a max-width container on large screens
- Prefer 8px spacing rhythm with 16/24/32 section gaps
- Use sticky header and sticky table affordances where possible
- Keep tables readable first, decorative treatments second

## Component Rules

- Cards: soft radius, crisp borders, restrained shadows
- Buttons: medium density, strong focus ring, clear primary/secondary hierarchy
- Inputs: filled-surface look with strong active state
- Tables: compact headers, hover feedback, clear empty states, row actions aligned right
- Dialogs: roomy content, separated footer, obvious cancel/confirm hierarchy
- Navigation: active item shown by filled background and icon tint, not animation-heavy effects

## Motion

- Use 150-220ms transitions
- Prefer opacity, border, background, and shadow transitions
- Avoid large transforms and layout-shifting interactions

## Anti-Patterns To Avoid

- Oversized hero text on dashboard screens
- Decorative gradients behind data
- Excessive blur or glass effects
- Inconsistent button radii and padding
- Muted text falling below comfortable contrast
