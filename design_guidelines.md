# Made in Algeria - Design Guidelines

## Design Approach
**Hybrid Approach**: Material Design foundation with strong Algerian cultural customization. Balancing professional directory functionality with patriotic visual identity. Drawing inspiration from government portals like gov.sa (Saudi Arabia) and invest.gov.tr (Turkey) for credible national platform aesthetics.

## Core Design Principles
1. **National Pride**: Integrate Algerian visual identity without overwhelming functionality
2. **Trust & Credibility**: Professional, government-adjacent aesthetic
3. **Accessibility**: Clear hierarchy for easy navigation across 48 wilayas and multiple sectors
4. **Bilingual Excellence**: RTL-ready for Arabic with Cairo/Tajawal fonts

---

## Typography

**Arabic**: 
- Headings: Cairo Bold (700)
- Body: Cairo Regular (400)
- Accent: Cairo SemiBold (600)

**Latin (Secondary)**:
- Inter or Poppins for English elements

**Scale**:
- Hero: text-5xl md:text-7xl
- Section Headers: text-3xl md:text-5xl
- Card Titles: text-xl md:text-2xl
- Body: text-base md:text-lg
- Labels: text-sm

---

## Layout System

**Spacing Units**: Use Tailwind units of 4, 8, 12, 16, 20, 24 (p-4, m-8, gap-12, py-16, etc.)

**Container Strategy**:
- Full-width sections: w-full with inner max-w-7xl mx-auto
- Content sections: max-w-6xl mx-auto px-4
- Factory cards grid: max-w-7xl

**Vertical Rhythm**: py-16 md:py-24 for major sections, py-8 md:py-12 for subsections

---

## Component Library

### Navigation
- Sticky header with logo (Arabic text or emblem), main navigation, language toggle, search icon
- Transparent on hero with backdrop-blur, solid white on scroll
- Mobile: Hamburger menu with slide-in drawer

### Hero Section
- **Large hero image**: Algerian factory/industrial landscape (modern production line, solar panels in Sahara, or Algiers port)
- Centered overlay content with backdrop-blur on CTA buttons
- Heading + subheading + dual CTAs (primary: "استكشف المصانع" / secondary: "سجل مصنعك")
- Trust indicator: "أكثر من 500+ مصنع جزائري" with small flag icon

### Search & Filter Section
- Prominent search bar (60% width, centered) immediately below hero
- Three filter dropdowns: Wilaya (48 options), Activity Type (8-10 categories), Product Type
- Quick category pills below search (Alimentaire, Textile, Chimique, Mécanique, etc.)

### Factory Grid
- **Multi-column**: grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6
- Cards with: Factory image, logo badge (top-left overlay), name, location (wilaya), 2-3 product tags, arrow link
- Hover: subtle lift (shadow-lg transform scale-105)

### Wilaya Map Section
- Interactive Algeria map (SVG) with clickable regions
- Sidebar shows factory count per wilaya
- On hover: highlight region + display count

### Featured Factories Carousel
- 3-4 highlighted factories with larger cards
- Background: subtle geometric pattern inspired by Amazigh designs (very light, non-distracting)

### Factory Detail Page
- Hero: Large factory image gallery (3-5 images) with thumbnail navigation
- Left column (60%): Description, products list with icons, certifications/badges
- Right column (40%): Sticky contact card with logo, phone, email, map embed, "Contact Direct" button
- Below: Product catalog section with downloadable PDFs

### Contact Form
- 2-column layout (form + info card with factory hours, response time, alternative contact methods)
- Fields: Name, Email, Phone, Wilaya, Message
- Factory location mini-map in info card

### Footer
- **Rich footer**: 4-column grid
  - Column 1: Logo + tagline "صنع في الجزائر"
  - Column 2: Quick links (About, Wilayas, Categories, Contact)
  - Column 3: Popular sectors (top 6 activity types)
  - Column 4: Newsletter signup + social icons
- Bottom bar: Copyright, privacy policy, terms

### Admin Dashboard (Simple)
- Clean sidebar navigation (Factories, Categories, Wilayas, Messages, Statistics)
- Data tables with search, filter, pagination
- Add/Edit factory form with image upload dropzone
- Simple statistics cards (total factories, by wilaya, by sector)

---

## Images

**Hero Image**: Wide shot of modern Algerian manufacturing facility - clean, bright, industrial. Consider: automotive assembly line, food processing plant, or textile factory with visible "Made in Algeria" branding. Should convey quality and modernity.

**Factory Cards**: Square/landscape photos showing production floors, products, or facility exteriors

**Category Icons**: Use Heroicons for activity types (e.g., beaker for chemical, scissors for textile, cog for mechanical)

**Map Section**: Use actual Algeria SVG map with administrative divisions clearly marked

**Decorative Elements**: Subtle Amazigh geometric patterns as background textures (10% opacity, non-intrusive)

---

## Animations

**Minimal approach**:
- Smooth scroll behavior
- Fade-in on scroll for factory cards (stagger by 100ms)
- Hover transforms on cards (subtle scale)
- Page transitions: fade (200ms)

**No**: Parallax, complex scroll-driven animations, or distracting effects

---

## Accessibility

- High contrast text (WCAG AA minimum)
- Focus indicators on all interactive elements (ring-2 ring-offset-2)
- Alt text for all factory images
- RTL support throughout (dir="rtl" on Arabic pages)
- Keyboard navigation for filters and map
- ARIA labels on icon-only buttons

---

## Key Notes

- **No color specifications** (handled separately)
- Use established CDN libraries (Heroicons for icons, Google Fonts for typography)
- Maintain bilingual consistency (Arabic primary, French/English secondary)
- Design for trust: professional, clean, no gimmicks
- Factory discovery is the primary goal - optimize for search and browse flows