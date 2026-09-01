---
name: Cyber-Neon Circuit
colors:
  surface: '#101415'
  surface-dim: '#101415'
  surface-bright: '#363a3b'
  surface-container-lowest: '#0b0f10'
  surface-container-low: '#191c1e'
  surface-container: '#1d2022'
  surface-container-high: '#272a2c'
  surface-container-highest: '#323537'
  on-surface: '#e0e3e5'
  on-surface-variant: '#c6c6cd'
  inverse-surface: '#e0e3e5'
  inverse-on-surface: '#2d3133'
  outline: '#909097'
  outline-variant: '#46464c'
  surface-tint: '#c0c6de'
  primary: '#c0c6de'
  on-primary: '#2a3043'
  primary-container: '#020617'
  on-primary-container: '#72778d'
  inverse-primary: '#585e73'
  secondary: '#d0bcff'
  on-secondary: '#3c0091'
  secondary-container: '#571bc1'
  on-secondary-container: '#c4abff'
  tertiary: '#4cd7f6'
  on-tertiary: '#003640'
  tertiary-container: '#00080b'
  on-tertiary-container: '#00849a'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#dce1fb'
  primary-fixed-dim: '#c0c6de'
  on-primary-fixed: '#151b2d'
  on-primary-fixed-variant: '#40465a'
  secondary-fixed: '#e9ddff'
  secondary-fixed-dim: '#d0bcff'
  on-secondary-fixed: '#23005c'
  on-secondary-fixed-variant: '#5516be'
  tertiary-fixed: '#acedff'
  tertiary-fixed-dim: '#4cd7f6'
  on-tertiary-fixed: '#001f26'
  on-tertiary-fixed-variant: '#004e5c'
  background: '#101415'
  on-background: '#e0e3e5'
  surface-variant: '#323537'
  surface-card: '#0f172a'
  neon-pink: '#f472b6'
  warning-amber: '#fbbf24'
  error-red: '#ef4444'
typography:
  display-lg:
    fontFamily: Hanken Grotesk
    fontSize: 48px
    fontWeight: '800'
    lineHeight: 56px
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Hanken Grotesk
    fontSize: 32px
    fontWeight: '800'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-lg:
    fontFamily: Hanken Grotesk
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
  headline-md:
    fontFamily: Hanken Grotesk
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-lg:
    fontFamily: Hanken Grotesk
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Hanken Grotesk
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-md:
    fontFamily: JetBrains Mono
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
    letterSpacing: 0.05em
  label-sm:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  unit: 4px
  gutter: 24px
  margin-mobile: 20px
  margin-desktop: 80px
  section-gap: 64px
---

## Brand & Style

This design system is a high-octane evolution of technical precision, shifting from corporate stability to a **Cyber-Neon** aesthetic. It targets a tech-savvy audience that values performance, speed, and cutting-edge aesthetics. The emotional response should be one of "High-Energy Innovation"—the feeling of entering a high-end digital terminal or a futurist laboratory.

The visual style is **High-Contrast / Bold** mixed with **Vaporwave** influences. It utilizes deep, light-absorbing backgrounds to make neon accents "emit" light. The interface rejects the safety of muted grays in favor of pure chrominance and deep blacks, creating a UI that feels alive, energized, and distinctly digital.

## Colors

The palette is anchored in a "Midnight & Neon" spectrum designed for maximum visual "pop" and legibility in dark environments.

- **Primary (#020617):** A deep Midnight Navy used as the foundation for the entire canvas. It absorbs light and provides the necessary contrast for neon elements.
- **Secondary (#8b5cf6):** Electric Violet. This is the "energy" color, used for primary calls to action, active states, and decorative circuit-path accents.
- **Tertiary (#06b6d4):** Neon Cyan. Used for data visualizations, technical specs, and interactive highlights. It provides a cooling balance to the violet.
- **Neutral (#F8FAFC):** A crisp, high-contrast white reserved strictly for body text and essential labels to ensure AAA legibility against the dark background.

Surface layering uses **#0F172A** (Surface-Card) to create subtle depth against the midnight primary background.

## Typography

The typography maintains a "Precision-Engineered" feel by using **Hanken Grotesk** across both display and body roles, ensuring a unified, modern voice.

- **Display & Headlines:** Hanken Grotesk in heavy weights (700-800). Use tight tracking to give words a "machined" look.
- **Body Copy:** Hanken Grotesk in regular weight. The high x-height maintains clarity against dark backgrounds.
- **Technical Metadata:** **JetBrains Mono** is used for all data-heavy points (prices, SKU numbers, technical specifications). This reinforces the "Cyber-Circuit" aesthetic.

All text must utilize the `Neutral` color at 90-100% opacity for body copy, while `Secondary` and `Tertiary` are reserved for short, impactful headings or labels.

## Layout & Spacing

The layout follows a **Fluid Grid** system that prioritizes vertical rhythm and clarity.

- **Grid:** A 12-column grid on desktop and 4-column on mobile.
- **Rhythm:** An 8px baseline grid is used for vertical alignment, but components use a 4px `unit` for internal padding and fine-tuning.
- **Negative Space:** Use generous `section-gap` measurements to prevent the high-contrast colors from becoming overwhelming. Large margins allow the "glowing" components to have visual breathing room.
- **Mobile Reflow:** On mobile devices, cards transition from multi-column grids to single-column stacks with 20px margins to maximize touch targets and legibility.

## Elevation & Depth

In this design system, depth is not created by shadows, but by **Luminescence and Layering**.

- **Glows:** Instead of black shadows, use "Neon Dropshadows." These are low-blur, 15-25% opacity glows using the `Secondary` (Violet) or `Tertiary` (Cyan) hues. This makes components appear as if they are light sources sitting on a dark glass table.
- **Outer Borders:** Use 1px "Circuit Borders" in `Secondary` or `Tertiary` at 30% opacity to define component boundaries.
- **Glassmorphism:** Navigation bars and floating menus use a 15px backdrop blur with a 10% opacity fill of the `Primary` color, creating a "dark glass" effect that allows the neon background elements to peek through.

## Shapes

The shape language is **Soft (0.25rem)**, leaning towards a "Technical Instrument" feel rather than a playful one.

- **Standard Elements:** Buttons, inputs, and tags use a 4px radius.
- **Containers:** Large cards use `rounded-lg` (8px).
- **Circuit Motif:** Use 45-degree angled corners (chamfers) for decorative elements or "Call to Action" flags to reinforce the hardware/circuitry theme.

## Components

### Buttons
- **Primary:** Background `Secondary` (Violet), text `Primary` (Midnight). High contrast. No shadow, but a subtle violet outer glow on hover.
- **Secondary:** Transparent background, 1.5px border in `Tertiary` (Cyan), text `Tertiary`. 
- **Active State:** On click, buttons should "flash" white briefly to simulate an electrical connection.

### Form Fields
- **Inputs:** `Surface-Card` background with a 1px border in `Primary-Light` (a lighter navy). 
- **Focus State:** The border turns `Tertiary` (Cyan) and the entire field gains a subtle cyan outer glow. Labels always use `label-sm` in `Neutral` for high visibility.

### Cards
Cards use the `Surface-Card` (#0F172A) hex. They feature a top-border highlight (2px) in either `Secondary` or `Tertiary` to categorize content. 

### Chips & Badges
Small technical badges use `JetBrains Mono`. They feature a solid `Secondary` or `Tertiary` background with `Primary` text for maximum "pop" against the dark UI.

### Progress Bars & Sliders
These should look like "Power Levels." Use `Tertiary` (Cyan) for the fill and a low-opacity version of the same color for the track. Add a small glow to the "head" of the progress bar.