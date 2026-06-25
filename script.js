/* ============================================================
   Landcraft Realty Solutions - Real Estate Portfolio Website
   JavaScript
   ============================================================ */

'use strict';

// ============================================================
// Google Sheets Configuration
// ============================================================
const GOOGLE_SHEET_ID = '1PNOiWgWsICZEih2EExoktw9a21nrQAlFLnAD4tNdbZ0';
const GOOGLE_SHEET_URL = `https://docs.google.com/spreadsheets/d/${GOOGLE_SHEET_ID}/gviz/tq?tqx=out:json`;

// Default column labels to use when the sheet has no headers
const DEFAULT_COLUMNS = ['Category', 'Project Name', 'Description', 'Image Link'];

// Categories for auto-distribution (fallback when no category column)
const CATEGORIES = ['architect', 'interiors', 'constructions'];
let categoryCounter = 0;

// ============================================================
// DOM Ready
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initBackToTop();
  initContactForm();
  initWorksTabs();
  // Carousels are initialized after sheet fetch attempt
  initWorksCarouselsWithSheetData();
  initScrollAnimations();
  initWorksModal();
  initSmoothScroll();
});

// ============================================================
// 1. STICKY NAVIGATION
// ============================================================
function initNavigation() {
  const header = document.getElementById('header');
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav-link');

  // Scroll effect
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 50);
    updateActiveNavLink();
  });

  // Mobile menu toggle
  navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    navMenu.classList.toggle('active');
    document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    navToggle.setAttribute('aria-expanded', navMenu.classList.contains('active'));
  });

  // Close menu on link click
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      navToggle.classList.remove('active');
      navMenu.classList.remove('active');
      document.body.style.overflow = '';
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });

  // Close menu on outside click
  document.addEventListener('click', (e) => {
    if (navMenu.classList.contains('active') && 
        !navMenu.contains(e.target) && 
        !navToggle.contains(e.target)) {
      navToggle.classList.remove('active');
      navMenu.classList.remove('active');
      document.body.style.overflow = '';
      navToggle.setAttribute('aria-expanded', 'false');
    }
  });

  // Close menu on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navMenu.classList.contains('active')) {
      navToggle.classList.remove('active');
      navMenu.classList.remove('active');
      document.body.style.overflow = '';
      navToggle.setAttribute('aria-expanded', 'false');
      navToggle.focus();
    }
  });
}

// ============================================================
// 2. ACTIVE NAV LINK
// ============================================================
function updateActiveNavLink() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  let current = '';

  sections.forEach(section => {
    const sectionTop = section.offsetTop - 150;
    if (window.scrollY >= sectionTop) {
      current = section.getAttribute('id');
    }
  });

  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${current}`) {
      link.classList.add('active');
    }
  });
}

// ============================================================
// 3. SCROLL ANIMATIONS (Intersection Observer)
// ============================================================
function initScrollAnimations() {
  // Add fade-in classes to elements
  const animateElements = [
    { selector: '.about-card', className: 'fade-in' },
    { selector: '.leader-card', className: 'fade-in' },
    { selector: '.why-us-card', className: 'fade-in' },
    { selector: '.contact-info-item', className: 'fade-in-left' },
    { selector: '.contact-form', className: 'fade-in-right' },
    { selector: '.specialty-item', className: 'fade-in' },
  ];

  animateElements.forEach(({ selector, className }) => {
    document.querySelectorAll(selector).forEach(el => {
      el.classList.add(className);
    });
  });

  // Intersection Observer
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // Slight stagger for grids
        const delay = Array.from(entry.target.parentNode.children).indexOf(entry.target) * 80;
        entry.target.style.transitionDelay = `${delay}ms`;
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px',
  });

  document.querySelectorAll('.fade-in, .fade-in-left, .fade-in-right').forEach(el => {
    observer.observe(el);
  });
}

// ============================================================
// 4. BACK TO TOP BUTTON
// ============================================================
function initBackToTop() {
  const backToTopBtn = document.getElementById('backToTop');

  window.addEventListener('scroll', () => {
    backToTopBtn.classList.toggle('visible', window.scrollY > 400);
  });

  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  });
}

// ============================================================
// 5. CONTACT FORM - WHATSAPP INTEGRATION
// ============================================================
function initContactForm() {
  const form = document.getElementById('contactForm');
  const whatsappNumber = '919013050505'; // No + or spaces

  // Real-time validation
  const inputs = form.querySelectorAll('input, textarea');
  inputs.forEach(input => {
    input.addEventListener('blur', () => validateField(input));
    input.addEventListener('input', () => {
      if (input.classList.contains('error')) {
        validateField(input);
      }
    });
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Validate all fields
    let isValid = true;
    inputs.forEach(input => {
      if (!validateField(input)) {
        isValid = false;
      }
    });

    if (!isValid) return;

    // Gather form data
    const name = document.getElementById('contactName').value.trim();
    const email = document.getElementById('contactEmail').value.trim();
    const phone = document.getElementById('contactPhone').value.trim();
    const message = document.getElementById('contactMessage').value.trim();

    // Build WhatsApp message
    const whatsappMessage = [
      `*New Inquiry from Landcraft Realty Solutions*`,
      ``,
      `*Name:* ${name}`,
      `*Email:* ${email}`,
      `*Phone:* ${phone}`,
      `*Message:* ${message}`,
    ].join('\n');

    // Encode for URL
    const encodedMessage = encodeURIComponent(whatsappMessage);

    // Open WhatsApp in new tab
    window.open(`https://wa.me/${whatsappNumber}?text=${encodedMessage}`, '_blank', 'noopener,noreferrer');

    // Reset form
    form.reset();
    inputs.forEach(input => input.classList.remove('error'));

    // Optional: show success feedback
    showFormFeedback(form, 'Message sent successfully! You will be redirected to WhatsApp.');
  });
}

// ============================================================
// 6. FIELD VALIDATION
// ============================================================
function validateField(input) {
  const errorEl = input.parentElement.querySelector('.form-error');
  let isValid = true;
  let errorMessage = '';

  const value = input.value.trim();

  if (input.hasAttribute('required') && !value) {
    isValid = false;
    errorMessage = 'This field is required.';
  } else if (input.type === 'email' && value) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      isValid = false;
      errorMessage = 'Please enter a valid email address.';
    }
  } else if (input.type === 'tel' && value) {
    const phoneRegex = /^[\d\s\+\-\(\)]{7,15}$/;
    if (!phoneRegex.test(value)) {
      isValid = false;
      errorMessage = 'Please enter a valid phone number.';
    }
  }

  input.classList.toggle('error', !isValid);
  if (errorEl) {
    errorEl.textContent = errorMessage;
  }

  return isValid;
}

// ============================================================
// 7. FORM FEEDBACK
// ============================================================
function showFormFeedback(form, message) {
  // Remove existing feedback
  const existing = form.querySelector('.form-feedback');
  if (existing) existing.remove();

  const feedback = document.createElement('div');
  feedback.className = 'form-feedback';
  feedback.textContent = message;
  feedback.style.cssText = `
    padding: 14px 18px;
    background-color: rgba(201, 168, 76, 0.12);
    color: #0a2e1a;
    border: 1px solid #c9a84c;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 500;
    margin-bottom: 20px;
    text-align: center;
  `;

  form.prepend(feedback);

  // Auto-remove after 5 seconds
  setTimeout(() => {
    feedback.style.opacity = '0';
    feedback.style.transition = 'opacity 0.3s ease';
    setTimeout(() => feedback.remove(), 300);
  }, 5000);
}

// ============================================================
// 8. GOOGLE SHEETS DATA FETCHER
// ============================================================

/**
 * Fetches data from Google Sheets using the Visualization API (JSONP).
 * Works without an API key for publicly accessible sheets.
 * Detects whether column headers exist; if not, uses DEFAULT_COLUMNS.
 * Returns null on failure (network error, empty sheet, etc.).
 */
function fetchSheetData() {
  return new Promise((resolve) => {
    // Set up a mock for the google.visualization.Query.setResponse callback
    window.google = window.google || {};
    window.google.visualization = window.google.visualization || {};
    window.google.visualization.Query = window.google.visualization.Query || {};
    window.google.visualization.Query.setResponse = function (response) {
      cleanup();
      resolve(response);
    };

    const script = document.createElement('script');
    script.src = GOOGLE_SHEET_URL;
    script.async = true;

    function cleanup() {
      if (script.parentNode) script.parentNode.removeChild(script);
      script.onerror = null;
      script.onload = null;
      clearTimeout(timeout);
    }

    const timeout = setTimeout(() => {
      cleanup();
      resolve(null);
    }, 8000);

    script.onerror = () => {
      cleanup();
      resolve(null);
    };

    document.body.appendChild(script);
  });
}

/**
 * Parses the raw gviz response into an array of row objects.
 * Handles three cases:
 *   1. API detected headers (parsedNumHeaders > 0) — labels from cols, first row excluded from data.
 *   2. API missed headers (first row cells match expected column names) — extract labels from
 *      first row, skip it from data.
 *   3. No headers at all — use DEFAULT_COLUMNS, treat all rows as data.
 * Returns { rows: [], usingSheetData, headersCreated }
 */
function parseSheetResponse(gvizResponse) {
  if (!gvizResponse || gvizResponse.status !== 'ok' || !gvizResponse.table) {
    return { rows: [], usingSheetData: false, headersCreated: false };
  }

  const table = gvizResponse.table;
  const cols = table.cols || [];
  const rawRows = table.rows || [];

  // Case 1: API detected headers via col labels
  const hasColLabels = cols.some(col => col.label && col.label.trim() !== '');

  if (hasColLabels) {
    const labels = cols.map(col => col.label || '');
    const mappedRows = mapRows(rawRows, labels);
    return { rows: mappedRows, usingSheetData: true, headersCreated: false, labels };
  }

  // No labels from API — inspect first row to see if it contains header text
  const firstRow = rawRows[0];
  const firstRowValues = (firstRow?.c || []).map(c =>
    c && c.v !== null && c.v !== undefined ? String(c.v).trim() : ''
  );

  // Check if first row values look like column headers (match our known defaults)
  const looksLikeHeaders = firstRowValues.length > 0 &&
    DEFAULT_COLUMNS.some(expected =>
      firstRowValues.some(val =>
        val.toLowerCase() === expected.toLowerCase()
      )
    );

  let labels;
  let dataRows;
  let headersCreated;

  if (looksLikeHeaders) {
    // Case 2: first row IS the header — use its values as labels, skip it
    labels = firstRowValues;
    dataRows = rawRows.slice(1);
    headersCreated = false;
    console.log('📋 Extracted column headers from first data row:', labels);
  } else {
    // Case 3: no headers at all — use defaults, keep all rows
    labels = [...DEFAULT_COLUMNS];
    dataRows = rawRows;
    headersCreated = true;
  }

  const mappedRows = mapRows(dataRows, labels);
  return { rows: mappedRows, usingSheetData: true, headersCreated, labels };
}

/**
 * Maps raw gviz row objects into an array of plain objects using the given labels.
 */
function mapRows(rawRows, labels) {
  return rawRows.map(row => {
    const cells = row.c || [];
    const item = {};
    labels.forEach((label, i) => {
      const cell = cells[i];
      item[label] = cell && cell.v !== null && cell.v !== undefined ? cell.v : '';
    });
    return item;
  });
}

/**
 * Converts a Google Drive sharing/view URL into a direct image URL.
 * Supports formats:
 *   - https://drive.google.com/file/d/FILE_ID/view
 *   - https://drive.google.com/open?id=FILE_ID
 *   - https://drive.google.com/uc?export=view&id=FILE_ID (already direct)
 * Falls back to the original URL for non-Drive URLs, empty values,
 * or malformed inputs.
 */
function convertGoogleDriveLink(url) {
  if (!url || typeof url !== 'string') return '';

  // Already a direct lh3 image or already converted — leave unchanged
  if (url.includes('lh3.googleusercontent.com/d/')) return url;

  // Extract FILE_ID from various formats
  let fileId = null;

  // Format: https://drive.google.com/file/d/FILE_ID/view
  const fileMatch = url.match(/drive\.google\.com\/file\/d\/([^\/?#&]+)/);
  if (fileMatch && fileMatch[1]) {
    fileId = fileMatch[1];
  }

  // Format: https://drive.google.com/open?id=FILE_ID
  const queryMatch = url.match(/[?&]id=([^&]+)/);
  if (!fileId && queryMatch && queryMatch[1] && url.includes('drive.google.com')) {
    fileId = queryMatch[1];
  }

  if (fileId) {
    // Use lh3 thumbnail endpoint — most reliable for embedding in <img> tags
    return `https://lh3.googleusercontent.com/d/${fileId}=s800`;
  }

  // Not a recognised Google Drive URL — return as-is (normal image URL)
  return url;
}

/**
 * Converts sheet rows into the worksData structure
 * Expected columns: Category, Project Name, Description, Image Link
 * Uses Category column if available; falls back to round-robin distribution.
 */
function sheetRowsToWorksData(rows) {
  const data = { architect: [], interiors: [], constructions: [] };

  rows.forEach(row => {
    const title = row['Project Name'] || 'Untitled';
    const description = row['Description'] || '';
    const rawImage = row['Image Link'] || '';
    const image = convertGoogleDriveLink(rawImage) || 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=600&h=400&fit=crop';
    const rawCategory = (row['Category'] || '').toLowerCase().trim();

    if (!title) return; // skip rows without a title

    // Determine which category this belongs to
    let targetCategory = null;
    if (rawCategory.includes('arch')) {
      targetCategory = 'architect';
    } else if (rawCategory.includes('interior')) {
      targetCategory = 'interiors';
    } else if (rawCategory.includes('construct') || rawCategory.includes('building')) {
      targetCategory = 'constructions';
    }

    // Fallback: round-robin if no category matched
    if (!targetCategory) {
      targetCategory = CATEGORIES[categoryCounter % CATEGORIES.length];
      categoryCounter++;
    }

    const label = targetCategory.charAt(0).toUpperCase() + targetCategory.slice(1);

    data[targetCategory].push({
      image,
      type: label,
      title,
      location: 'Bangalore',
      description,
      status: 'Completed',
      category: label,
    });
  });

  return data;
}

// ============================================================
// 9. WORKS CAROUSELS (with Google Sheets integration)
// ============================================================
const worksData = {
  architect: [
    {
      image: 'https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=600&h=400&fit=crop',
      type: 'Architect',
      title: 'Skyline Corporate Tower',
      location: 'MG Road, Bangalore',
      description: 'A 15-story corporate tower featuring contemporary architectural design with sustainable glass facade, open floor plans, and state-of-the-art amenities. The building sets a new benchmark for commercial architecture in Bangalore.',
      status: 'Completed',
      category: 'Architect',
    },
    {
      image: 'https://images.unsplash.com/photo-1511818966892-d7d671e672a2?w=600&h=400&fit=crop',
      type: 'Architect',
      title: 'Verdant Heights',
      location: 'Whitefield, Bangalore',
      description: 'Premium residential complex designed with sustainable architecture principles. Features include rainwater harvesting, solar integration, and green terraces across all 8 towers.',
      status: 'Completed',
      category: 'Architect',
    },
    {
      image: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=600&h=400&fit=crop',
      type: 'Architect',
      title: 'Crystal Commercial Plaza',
      location: 'JP Nagar, Bangalore',
      description: 'Contemporary commercial space with an iconic glass facade, landscaped courtyards, and flexible office configurations. Designed for modern enterprises seeking premium work environments.',
      status: 'Completed',
      category: 'Architect',
    },
    {
      image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&h=400&fit=crop',
      type: 'Architect',
      title: 'Lakeside Villas',
      location: 'Electronic City, Bangalore',
      description: 'Exclusive villa community designed with Mediterranean-inspired architecture, featuring private gardens, panoramic lake views, and seamless indoor-outdoor living spaces.',
      status: 'Completed',
      category: 'Architect',
    },
    {
      image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&h=400&fit=crop',
      type: 'Architect',
      title: 'Urban Square Mall',
      location: 'Outer Ring Road, Bangalore',
      description: 'A 5-level retail and entertainment destination with striking parametric architecture, a central atrium, and rooftop garden. Designed to become a landmark destination.',
      status: 'In Progress',
      category: 'Architect',
    },
    {
      image: 'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=600&h=400&fit=crop',
      type: 'Architect',
      title: 'Garden Office Park',
      location: 'Hebbal, Bangalore',
      description: 'Biophilic office campus spread across 12 acres with interconnected buildings, sky gardens, and a central green plaza. Redefining the workplace through architecture.',
      status: 'Completed',
      category: 'Architect',
    },
  ],

  interiors: [
    {
      image: 'https://images.unsplash.com/photo-1618220179428-22790b461013?w=600&h=400&fit=crop',
      type: 'Interiors',
      title: 'Luxury Villa Interiors',
      location: 'JP Nagar, Bangalore',
      description: 'Complete interior design for a 6,000 sq ft luxury villa featuring custom millwork, marble finishes, smart home integration, and curated art pieces throughout.',
      status: 'Completed',
      category: 'Interiors',
    },
    {
      image: 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=600&h=400&fit=crop',
      type: 'Interiors',
      title: 'Executive Office Spaces',
      location: 'Manyata Tech Park, Bangalore',
      description: 'Modern corporate interior design for a 15,000 sq ft office floor, including executive cabins, collaborative zones, breakout areas, and a wellness room.',
      status: 'Completed',
      category: 'Interiors',
    },
    {
      image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600&h=400&fit=crop',
      type: 'Interiors',
      title: 'Elite Apartment Interiors',
      location: 'Indiranagar, Bangalore',
      description: 'High-end 3BHK apartment interior renovation with Scandinavian minimalism, custom joinery, ambient lighting design, and premium Italian marble flooring.',
      status: 'Completed',
      category: 'Interiors',
    },
    {
      image: 'https://images.unsplash.com/photo-1616137466211-f939a420be84?w=600&h=400&fit=crop',
      type: 'Interiors',
      title: 'Boutique Hotel Lounge',
      location: 'Koramangala, Bangalore',
      description: 'Art Deco inspired boutique hotel interior design with velvet furnishings, brass accents, curated lighting, and a signature cocktail bar with custom artwork.',
      status: 'Completed',
      category: 'Interiors',
    },
    {
      image: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=600&h=400&fit=crop',
      type: 'Interiors',
      title: 'Penthouse Residence',
      location: 'UB City, Bangalore',
      description: 'Ultra-luxury penthouse interior design with panoramic city views, a private terrace garden, wine room, and bespoke furniture from international designers.',
      status: 'Completed',
      category: 'Interiors',
    },
    {
      image: 'https://images.unsplash.com/photo-1616593966346-24f465c9e220?w=600&h=400&fit=crop',
      type: 'Interiors',
      title: 'Co-Working Hub',
      location: 'HSR Layout, Bangalore',
      description: 'Vibrant co-working space interior with modular furniture, acoustic pods, green walls, a cafe lounge, and flexible event spaces for the startup community.',
      status: 'Completed',
      category: 'Interiors',
    },
  ],

  constructions: [
    {
      image: 'https://images.unsplash.com/photo-1541888946425-d81bb56b62e3?w=600&h=400&fit=crop',
      type: 'Constructions',
      title: 'Greenfield Township',
      location: 'Electronic City, Bangalore',
      description: 'Large-scale residential township construction spanning 35 acres with 12 towers, community amenities, underground utilities, and phased delivery over 3 years.',
      status: 'In Progress',
      category: 'Constructions',
    },
    {
      image: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=600&h=400&fit=crop',
      type: 'Constructions',
      title: 'Metro View Apartments',
      location: 'Hebbal, Bangalore',
      description: '20-story residential apartment construction with reinforced concrete frame, high-speed elevators, basement parking, and sky lounge on the top floor.',
      status: 'Completed',
      category: 'Constructions',
    },
    {
      image: 'https://images.unsplash.com/photo-1574484284002-952d92456975?w=600&h=400&fit=crop',
      type: 'Constructions',
      title: 'Industrial Park',
      location: 'Peenya, Bangalore',
      description: 'Industrial construction project comprising 5 warehouse units with 40 ft clear height, dock levelers, fire suppression systems, and heavy-duty flooring.',
      status: 'Completed',
      category: 'Constructions',
    },
    {
      image: 'https://images.unsplash.com/photo-1578996952311-20c3977b34b0?w=600&h=400&fit=crop',
      type: 'Constructions',
      title: 'School Campus',
      location: 'Sarjapur Road, Bangalore',
      description: 'Construction of a modern educational campus with 3 academic blocks, an auditorium, indoor sports complex, and Olympic-sized swimming pool.',
      status: 'Completed',
      category: 'Constructions',
    },
    {
      image: 'https://images.unsplash.com/photo-1574169208507-84376144848b?w=600&h=400&fit=crop',
      type: 'Constructions',
      title: 'Hospital Wing Extension',
      location: 'Malleswaram, Bangalore',
      description: 'Construction of a 150-bed hospital extension wing with operation theaters, ICU, diagnostic centers, and a helipad on the rooftop.',
      status: 'Completed',
      category: 'Constructions',
    },
    {
      image: 'https://images.unsplash.com/photo-1565008447742-97f6b30b3fbe?w=600&h=400&fit=crop',
      type: 'Constructions',
      title: 'Riverfront Promenade',
      location: 'North Bangalore',
      description: 'Urban infrastructure project: 2.5 km riverfront development with pedestrian walkways, amphitheaters, food kiosks, and landscaped public spaces.',
      status: 'In Progress',
      category: 'Constructions',
    },
  ],
};

/**
 * Renders carousel tracks for all categories using the provided data.
 */
function renderCarousels(data) {
  const categories = ['architect', 'interiors', 'constructions'];

  categories.forEach(category => {
    const track = document.querySelector(`.carousel-track[data-category="${category}"]`);
    if (!track) return;

    const projects = data[category] || [];
    track.innerHTML = '';

    if (projects.length === 0) {
      track.innerHTML = '<div class="carousel-empty">No projects in this category yet.</div>';
      return;
    }

    // Create items (duplicated for seamless infinite scroll)
    const allItems = [...projects, ...projects];

    allItems.forEach((project, index) => {
      const item = document.createElement('article');
      item.className = 'carousel-item';
      item.setAttribute('aria-label', `${project.title} - ${project.type}`);
      item.dataset.category = category;
      item.dataset.index = index % projects.length;

      const img = document.createElement('img');
      img.src = project.image;
      img.alt = `${project.title} - ${project.type}`;
      img.loading = 'lazy';
      img.onerror = function () {
        this.src = 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=600&h=400&fit=crop';
        this.onerror = null; // prevent infinite loop
      };

      item.innerHTML = `
        <div class="carousel-item-image">
          <div class="carousel-item-overlay">
            <span class="carousel-item-status">${project.status}</span>
          </div>
        </div>
        <div class="carousel-item-body">
          <div class="carousel-item-type">${project.type}</div>
          <h3 class="carousel-item-title">${project.title}</h3>
          <div class="carousel-item-location">
            <i class="fas fa-map-pin" aria-hidden="true"></i>
            <span>${project.location}</span>
          </div>
        </div>
      `;

      // Append the image to the image container (before the overlay)
      const imgContainer = item.querySelector('.carousel-item-image');
      imgContainer.insertBefore(img, imgContainer.firstChild);

      track.appendChild(item);
    });
  });
}

/**
 * Initializes carousels by first attempting to fetch data from Google Sheets.
 * Falls back to hardcoded sample data if the sheet is empty or unreachable.
 */
async function initWorksCarouselsWithSheetData() {
  let dataToUse = worksData;
  let usingSheets = false;
  let headersCreated = false;

  try {
    const gvizResponse = await fetchSheetData();
    const parsed = parseSheetResponse(gvizResponse);

    if (parsed.usingSheetData && parsed.rows.length > 0) {
      console.log('📋 Parsed labels:', parsed.labels);
      console.log('📋 First row sample:', parsed.rows[0]);

      const sheetData = sheetRowsToWorksData(parsed.rows);

      // Log first project's image to verify Drive URL conversion
      const firstProject = Object.values(sheetData).flat().find(p => p.image);
      if (firstProject) console.log('🖼️ First project image:', firstProject.image);

      // Check if any category has projects from the sheet
      const hasData = Object.values(sheetData).some(arr => arr.length > 0);
      if (hasData) {
        dataToUse = sheetData;
        usingSheets = true;
        headersCreated = parsed.headersCreated;
        console.log(`📊 Loaded ${parsed.rows.length} projects from Google Sheets.`);
      }
    }

    if (parsed.headersCreated) {
      console.log('📋 No column headers found in sheet — using default headers:', DEFAULT_COLUMNS.join(', '));
    }
  } catch (e) {
    console.warn('⚠️ Could not load from Google Sheets, using sample data.');
  }

  // Store which data source we're using for the modal
  window.__worksData = dataToUse;

  renderCarousels(dataToUse);

  // Re-apply scroll animations to newly created carousel items
  requestAnimationFrame(() => {
    document.querySelectorAll('.carousel-item').forEach(el => {
      el.classList.add('fade-in');
      // Trigger IntersectionObserver by observing again
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            const siblings = Array.from(entry.target.parentNode.children);
            const idx = siblings.indexOf(entry.target);
            entry.target.style.transitionDelay = `${idx * 80}ms`;
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
      observer.observe(el);
    });
  });

  // Update section description to indicate data source
  const desc = document.querySelector('#projects .section-desc');
  if (desc && usingSheets) {
    desc.textContent = 'Projects loaded from our live database. Add or edit projects in the Google Sheet to update this section.';
  }
}

// ============================================================
// 10. WORKS TABS
// ============================================================
function initWorksTabs() {
  const tabs = document.querySelectorAll('.works-tab');
  const sections = document.querySelectorAll('.carousel-section');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const category = tab.dataset.category;

      // Update tabs
      tabs.forEach(t => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');

      // Update sections
      sections.forEach(section => {
        section.classList.remove('active');
        section.hidden = true;
      });

      const activeSection = document.getElementById(`carousel-${category}`);
      if (activeSection) {
        activeSection.classList.add('active');
        activeSection.hidden = false;
      }
    });
  });
}

// ============================================================
// 11. WORKS MODAL (Image Popup)
// ============================================================
function initWorksModal() {
  // Get the current active data source
  function getWorksData() {
    return window.__worksData || worksData;
  }
  const modal = document.getElementById('worksModal');
  const overlay = modal.querySelector('.modal-overlay');
  const closeBtn = modal.querySelector('.modal-close');
  const modalImage = modal.querySelector('.modal-image');
  const modalType = modal.querySelector('.modal-type');
  const modalTitle = modal.querySelector('.modal-title');
  const modalLocation = modal.querySelector('.modal-location-text');
  const modalDesc = modal.querySelector('.modal-description');
  const modalStatus = modal.querySelector('.modal-status');
  const modalCategory = modal.querySelector('.modal-category');

  let open = false;

  // Open modal on carousel item click
  document.addEventListener('click', (e) => {
    const item = e.target.closest('.carousel-item');
    if (!item) return;

    const category = item.dataset.category;
    const index = parseInt(item.dataset.index);
    const project = getWorksData()[category]?.[index];
    if (!project) return;

    // Populate modal
    modalImage.src = project.image;
    modalImage.alt = `${project.title} - ${project.type}`;
    modalImage.onerror = function () {
      this.src = 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=600&h=400&fit=crop';
      this.onerror = null;
    };
    modalType.textContent = project.type;
    modalTitle.textContent = project.title;
    modalLocation.textContent = project.location;
    modalDesc.textContent = project.description;
    modalStatus.textContent = project.status;
    modalCategory.textContent = project.category;

    // Show modal
    modal.hidden = false;
    open = true;
    document.body.style.overflow = 'hidden';

    // Pause all carousels while modal is open
    document.querySelectorAll('.carousel-track').forEach(t => {
      t.style.animationPlayState = 'paused';
    });
  });

  // Close functions
  function closeModal() {
    if (!open) return;
    modal.hidden = true;
    open = false;
    document.body.style.overflow = '';

    // Resume carousels
    document.querySelectorAll('.carousel-track').forEach(t => {
      t.style.animationPlayState = 'running';
    });
  }

  closeBtn.addEventListener('click', closeModal);
  overlay.addEventListener('click', closeModal);

  // Close on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });

  // Close on resize to avoid layout issues
  window.addEventListener('resize', () => {
    if (open) {
      // Ensure modal stays centered
    }
  });
}

// ============================================================
// SMOOTH SCROLL (Fallback for older browsers)
// ============================================================
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;

      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const headerOffset = 80;
        const elementPosition = target.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth',
        });
      }
    });
  });
}
