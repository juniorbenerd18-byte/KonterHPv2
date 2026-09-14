---
name: Cyber-Circuit Mobile
colors:
  surface: '#f7f9fb'
  surface-dim: '#d8dadc'
  surface-bright: '#f7f9fb'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f4f6'
  surface-container: '#eceef0'
  surface-container-high: '#e6e8ea'
  surface-container-highest: '#e0e3e5'
  on-surface: '#191c1e'
  on-surface-variant: '#45464d'
  inverse-surface: '#2d3133'
  inverse-on-surface: '#eff1f3'
  outline: '#76777d'
  outline-variant: '#c6c6cd'
  surface-tint: '#565e74'
  primary: '#000000'
  on-primary: '#ffffff'
  primary-container: '#131b2e'
  on-primary-container: '#7c839b'
  inverse-primary: '#bec6e0'
  secondary: '#00687a'
  on-secondary: '#ffffff'
  secondary-container: '#57dffe'
  on-secondary-container: '#006172'
  tertiary: '#000000'
  on-tertiary: '#ffffff'
  tertiary-container: '#001a42'
  on-tertiary-container: '#3980f4'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dae2fd'
  primary-fixed-dim: '#bec6e0'
  on-primary-fixed: '#131b2e'
  on-primary-fixed-variant: '#3f465c'
  secondary-fixed: '#acedff'
  secondary-fixed-dim: '#4cd7f6'
  on-secondary-fixed: '#001f26'
  on-secondary-fixed-variant: '#004e5c'
  tertiary-fixed: '#d8e2ff'
  tertiary-fixed-dim: '#adc6ff'
  on-tertiary-fixed: '#001a42'
  on-tertiary-fixed-variant: '#004395'
  background: '#f7f9fb'
  on-background: '#191c1e'
  surface-variant: '#e0e3e5'
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
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
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
  margin-desktop: 80px
  margin-mobile: 20px
  container-max-width: 1280px
---

## Brand & Style
The design system is engineered to evoke a sense of precision, innovation, and unwavering reliability for a high-end mobile retail environment. The brand personality is "Expertly Technical"—positioning the shop not just as a vendor, but as a gateway to the future of mobile connectivity.

The visual style is **Corporate Modern** with a **Tech-Forward** edge. It utilizes structured layouts, high-quality product imagery, and subtle neon-inspired accents to communicate a premium digital experience. The interface should feel fast, secure, and intuitive, balancing a heavy-duty professional foundation with the sleek, high-gloss aesthetic of modern consumer electronics.

## Colors
This design system employs a "Midnight & Neon" palette to establish authority and modern flair. 

- **Primary (#0F172A):** A deep, ink-blue used for core navigation, headings, and high-importance backgrounds. It provides the "heavy" professional grounding.
- **Secondary (#06B6D4):** A vibrant Cyan used for primary actions, price highlights, and technical specs. It represents "the pulse" of the tech.
- **Tertiary (#3B82F6):** A bright Royal Blue used for links, information states, and secondary buttons.
- **Neutral (#F8FAFC):** A crisp, cool-white background that ensures the product photography remains the focal point without visual clutter.

Surface colors should lean into cool grays (Slate 100-300) to maintain the technical atmosphere.

## Typography
The typographic hierarchy is built on a "Humanist-Technical" split. 

- **Headlines:** Use **Hanken Grotesk**. Its sharp terminals and contemporary proportions feel engineered and precise.
- **Body:** Use **Inter**. Chosen for its exceptional legibility on small screens, essential for comparing technical specifications and reading product reviews.
- **Data & Labels:** Use **JetBrains Mono**. This monospaced font is used sparingly for technical specs (RAM, Storage, Price) to emphasize the "data-driven" nature of the shop.

Maintain tight tracking on display headings and generous line-heights for body copy to ensure a premium reading experience.

## Layout & Spacing
The layout follows a strict 12-column grid for desktop and a 4-column grid for mobile. 

- **Desktop:** 80px side margins with 24px gutters. Use the grid to create "asymmetrical balance," where product images take up 7 columns and specs take up 5.
- **Mobile:** 20px side margins. Cards should span the full width or 2-columns for product grids.
- **Spacing Logic:** All spacing must be multiples of 4px. Use larger gaps (64px+) between sections to allow the design to "breathe," mimicking the spaciousness of luxury retail stores.

## Elevation & Depth
Depth is achieved through **Tonal Layering** and **Subtle Glows**. 

Instead of traditional heavy shadows, this design system uses:
1. **Surface Tiers:** Background is `Neutral-50`. Card surfaces are absolute `White`. Hover states use a very soft `Secondary` tinted shadow (e.g., 8% opacity Cyan) to make the card feel "energized."
2. **Glassmorphism:** Use for fixed navigation bars and floating "Quick View" modals. A backdrop blur of 12px with a 60% white opacity creates a high-tech, layered feel.
3. **Inner Borders:** Use 1px borders in `Slate-200` for structural definition, ensuring the UI feels crisp and not muddy.

## Shapes
The shape language is **Soft (0.25rem)**. 

While the tech industry often defaults to extreme roundedness, this system uses subtle corner radii to maintain a "professional tool" aesthetic. 
- **Buttons and Inputs:** Use the standard 4px (0.25rem) radius.
- **Product Cards:** Use `rounded-lg` (8px) to soften the large surface areas.
- **Hero Banners:** Use sharp edges on the outer container, but rounded internal elements to create a framed, architectural look.

## Components
### Product Cards
Cards feature a high-contrast white background with a 1px `Slate-100` border. The product image should be centered with no background. The price is displayed using `label-md` in `Secondary` cyan. On hover, the card gains a 1px `Secondary` border and a soft cyan outer glow.

### Hero Banners
Banners utilize `Primary` deep blue backgrounds with `Secondary` cyan gradients. Typography should be left-aligned with `display-lg` headings. Incorporate a subtle "grid" or "circuit" pattern overlay at 5% opacity to reinforce the tech theme.

### Buttons
- **Primary:** Background `Secondary`, text `Primary`. No border. High contrast for clear CTA.
- **Secondary:** Transparent background, 2px border in `Tertiary`, text `Tertiary`.
- **Ghost:** Text `Primary`, no background/border, used for "See All" links.

### Inputs & Selects
Field labels use `label-sm`. Inputs have a `Slate-50` background. On focus, the border transitions to `Secondary` and a 2px "ring" glow is applied.

### Feature Sections
Use a 3-column layout. Icons should be "Duotone" style using `Primary` and `Secondary` colors. Each feature block is separated by generous whitespace rather than borders.