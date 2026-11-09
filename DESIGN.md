---
name: ShopEZ
description: A practical multi-category store with a playful Memphis showroom identity.
colors:
  ink: "#211f23"
  ink-muted: "#565258"
  paper: "#fffdf8"
  canvas: "#f7f1e7"
  teal: "#174a48"
  teal-dark: "#103c3b"
  pink: "#f0a2ad"
  mint: "#a9d8bd"
  yellow: "#f4d848"
  coral: "#ee6855"
  lilac: "#cab9e7"
  focus: "#202024"
typography:
  display:
    fontFamily: '"Bricolage Grotesque", sans-serif'
    fontSize: "clamp(3.2rem, 5vw, 4.5rem)"
    fontWeight: 750
    lineHeight: 0.93
    letterSpacing: "-0.04em"
  body:
    fontFamily: '"Karla", sans-serif'
    fontSize: "1.05rem"
    fontWeight: 400
    lineHeight: 1.55
  label:
    fontFamily: '"Karla", sans-serif'
    fontSize: "0.9rem"
    fontWeight: 750
rounded:
  control: "7px"
  callout: "9px"
  card: "12px"
  featured: "14px"
spacing:
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "32px"
components:
  button-primary:
    backgroundColor: "{colors.yellow}"
    textColor: "{colors.ink}"
    rounded: "{rounded.control}"
    padding: "0.6rem 1rem"
    height: "46px"
  button-primary-hover:
    backgroundColor: "{colors.pink}"
    textColor: "{colors.ink}"
  category-link:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.control}"
    height: "50px"
  featured-card:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.featured}"
  input:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.control}"
    height: "46px"
---

# Design System: ShopEZ

## Overview

**Creative North Star: "Memphis Showroom"**

ShopEZ pairs a dependable shopping interface with the bright, geometric energy
of a Memphis showroom. Cream paper and near-black ink keep prices and product
details easy to scan; mint, pink, yellow, coral, and lilac give category
surfaces and controls a distinctive, coordinated rhythm.

Use the geometry as framing and wayfinding, never as a substitute for products
or information. The system favors clear borders, generous breathing room, and
short color-state transitions over decorative depth or complex motion.

**Key Characteristics:**
- Self-hosted Bricolage Grotesque display type with Karla for readable interface copy.
- Flat paper surfaces, strong ink outlines, and a compact Memphis accent palette.
- Illustrative remote product photos are identified as illustrative, not exact items.

## Colors

The palette balances warm paper and dark ink with expressive Memphis pink,
mint, yellow, coral, and lilac; teal is reserved for links and focusable form
states.

### Primary
- **Deep Teal** (`#174a48`): Use for focused fields and restrained interface accents.
- **Dark Teal** (`#103c3b`): Use for links and active navigation against light surfaces.

### Secondary
- **Memphis Pink** (`#f0a2ad`): Use for product plates and primary-button hover.
- **Showroom Mint** (`#a9d8bd`): Use for sale callouts and selected category artwork.
- **Candy Yellow** (`#f4d848`): Use for primary actions and small geometric accents.
- **Coral** (`#ee6855`): Use sparingly for underlines and interaction details.
- **Soft Lilac** (`#cab9e7`): Use as a category-specific artwork surface.

### Neutral
- **Ink** (`#211f23`): Primary copy, outlines, and high-contrast controls.
- **Muted Ink** (`#565258`): Secondary copy on light surfaces.
- **Warm Canvas** (`#f7f1e7`): Main page background. This deliberate part of the selected Memphis world is not a generic neutral fallback.
- **Paper** (`#fffdf8`): Cards, fields, and other foreground surfaces.

### Named Rules
**The Real-Price Rule.** Color may make a product easier to find, but it never obscures the actual price, discount, stock, or payment behavior.

## Typography

**Display Font:** Bricolage Grotesque (self-hosted, sans-serif fallback)  
**Body Font:** Karla (self-hosted, sans-serif fallback)  
**Label Font:** Karla

**Character:** Bricolage Grotesque gives the showroom its bold, slightly
eccentric voice. Karla keeps product data, form labels, and admin controls
compact and legible.

### Hierarchy
- **Display** (750, responsive 2.9–4.5rem, line-height 0.93, letter-spacing -0.04em): Storefront hero and major page statements.
- **Headline** (750, 1.5–2rem, line-height 1.05): Page and section headings.
- **Title** (700–750, around 1.15–1.4rem): Product names and card titles; allow wrapping without clipping.
- **Body** (400, 1.05rem, line-height 1.55): Product descriptions, details, and supporting copy; keep long text near 65–75ch.
- **Label** (750, around 0.9rem): Form labels, compact metadata, and small section markers.

### Named Rules
**The Product-First Rule.** Display type earns attention on the storefront; product titles and operational labels stay subordinate to the facts they describe.

## Layout

Use the Bootstrap container as the shared content boundary. The storefront
hero is an asymmetric two-column spread on desktop, with copy beside a
featured product plate. At widths below 768px it becomes one column; preserve
the size selector and primary action with the featured item. Avoid horizontal
overflow at narrow widths.

The desktop category index is a single five-column row. On mobile it becomes a
two-column grid with the final category spanning the row. Product listings
remain image-led, equal-width grids; cart summaries and admin data should
retain their functional hierarchy and stack when space is constrained.
Use a steady 8px spacing rhythm, increasing to 16, 24, and 32px for component,
section, and page-level separation.

## Elevation & Depth

The system is flat by default. Dark outlines, paper-to-canvas contrast, and
color-blocked Memphis geometry establish depth without persistent drop
shadows. Focus indicators may use a colored ring because it communicates
keyboard position, not elevation.

## Shapes

Controls use compact 7px corners; sale callouts use 9px; product cards use
12px, and the featured product plate uses 14px. Keep the 2px ink border as
the primary edge treatment. Pair those stable rectangles with a few crisp,
asymmetric Memphis shapes behind content; do not mask or distort product
photography.

## Components

### Buttons
- **Shape:** Compact rectangles with a 7px radius and a 2px ink outline.
- **Primary:** Candy-yellow fill, ink text, 46px minimum height, and 0.6rem by 1rem padding.
- **Hover / Focus:** Primary hover shifts to pink; keyboard focus receives a clearly visible ink outline and yellow ring. Keep pressed feedback from moving surrounding content.
- **Secondary:** Paper or transparent fills with ink borders; use semantic danger color only for destructive actions.

### Chips
- **Style:** Category links are paper rectangles with ink borders, 7px corners, and at least 50px height.
- **State:** Use the category's geometric dot and a clear selected/active treatment; do not rely on color alone.

### Cards / Containers
- **Corner Style:** 12px for catalog cards; 14px for the featured product.
- **Background:** Paper on the warm canvas, with a 2px ink border.
- **Shadow Strategy:** No persistent shadow; separate surfaces with borders, contrast, and spacing.
- **Internal Padding:** Use the 8px rhythm, with 16px as the common card inset.

### Inputs / Fields
- **Style:** Paper fill, muted-ink 2px border, 7px radius, and 46px minimum height.
- **Focus:** Dark teal border with a mint ring; keyboard focus remains unmistakable.
- **Error / Disabled:** Keep errors textual and associated with the field; disabled controls remain visibly inactive and non-interactive.

### Navigation
- **Style:** Warm-canvas header with a 2px ink lower border, bold brand wordmark, and text-first links.
- **Active State:** Dark-teal link and coral underline; collapse navigation into the existing menu control on narrow screens.

### Product Artwork
Use the actual product title and category with the artwork. Remote photography is
illustrative, not exact item photography: retain the visible label and truthful
alt text, and show the designed fallback when the image fails to load.

## Do's and Don'ts

### Do:
- **Do** use the self-hosted Bricolage Grotesque and Karla font files.
- **Do** keep product prices, stock, discounts, and form actions legible against their surfaces.
- **Do** use Memphis geometry as restrained framing and category wayfinding.
- **Do** keep visible focus, meaningful labels, and reduced-motion behavior.

### Don't:
- **Don't** use a remote product photo as though it were an exact product image.
- **Don't** add gradients, glass effects, or persistent decorative shadows.
- **Don't** let decorative shapes cover controls, product details, or readable copy.
- **Don't** replace product facts or working shopping/admin behavior with decorative placeholders.
