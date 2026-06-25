# Landcraft Realty Solutions - Real Estate Portfolio Website

A premium, fully responsive real estate consulting company portfolio website built with **HTML**, **CSS**, and **Vanilla JavaScript** — no frameworks, no libraries.

## Live Preview

Open `index.html` in any modern browser to view the website.

## Project Structure

```
real-estate-portfolio/
├── index.html          # Main HTML document
├── style.css           # All styles (no inline CSS)
├── script.js           # All JavaScript (no inline JS)
├── robots.txt          # SEO - search engine crawl instructions
├── sitemap.xml         # SEO - sitemap for search engines
├── README.md           # This file
└── assets/
    ├── images/         # Image assets (placeholder)
    ├── icons/          # Icon assets (placeholder)
    └── logo/           # Logo assets (placeholder)
```

## Features

### Design
- Premium, professional real estate aesthetic
- Soft white and light gray backgrounds
- Dark green, navy blue, and gold accent palette
- Rounded cards with subtle shadows
- Smooth transitions and micro-interactions
- Playfair Display (headings) + Inter (body) typography
- Fully responsive: Desktop, Tablet, Mobile

### Sections
1. **Sticky Navigation** — Smooth scroll, mobile hamburger menu
2. **Hero Section** — Full-screen with background image and CTA
3. **About Company** — Mission, Vision, Core Values, areas of expertise
4. **Leadership Team** — Premium profiles of 3 key leaders
5. **Projects Gallery** — 6 project cards with hover effects
6. **Why Choose Us** — 8 trust-building features with icons
7. **Contact Form** — WhatsApp integration with form validation
8. **Footer** — Links, social icons, back-to-top button

### Contact Form
- Validates all fields before submission
- Redirects to WhatsApp with pre-filled message
- No data stored on any server

### SEO & Accessibility
- Semantic HTML5 (`<header>`, `<main>`, `<section>`, `<footer>`)
- Proper H1/H2 heading hierarchy
- Meta title, description, keywords
- Open Graph & Twitter Card tags
- Schema.org Organization JSON-LD
- ARIA labels and roles
- Keyboard navigation support
- Alt text on all images
- Lazy loading on gallery images

### Performance
- Clean, efficient CSS with custom properties
- Minimal JavaScript, organized into functions
- Lazy-loaded images
- No external dependencies (except Google Fonts & Font Awesome icons)

## Customization

### Colors
Edit the CSS custom properties in `:root` in `style.css`:
- `--color-primary` — Dark green
- `--color-secondary` — Navy blue
- `--color-accent` — Gold

### Content
All content is in `index.html` — simply edit the text within the HTML sections.

### Projects
Add new projects by editing the `projects` array in `script.js` → `initProjectGallery()` function.

### WhatsApp Number
Update `whatsappNumber` in `script.js` → `initContactForm()` function.

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

© 2026 Landcraft Realty Solutions. All Rights Reserved.
