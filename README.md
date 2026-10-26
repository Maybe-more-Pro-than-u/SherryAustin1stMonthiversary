# Sherry + Austin — First Monthiversary

A responsive, interactive one-month anniversary website for Sherry, made by Austin. It opens with a playful Yes/No invitation and unfolds into a five-photo love story, an interactive tulip garden, a letter, and a final bear hug.

## Preview

Serve the folder locally so the animation libraries can load correctly:

```powershell
cd C:\Users\asamuel\SherryAustinMonthiversary
py -m http.server 4173
```

Then visit `http://localhost:4173`.

## Add the five photos

Place five JPG images in `assets/photos/` with these exact names:

- `01.png`
- `02.jpg`
- `03.png`
- `04.png`
- `05.png`

Portrait-oriented images work best. Until they are supplied, the site shows designed placeholders instead of broken images.

## Included interactions

- Playful No button with changing messages and bear reaction
- Yes-button reveal into the main story
- GSAP + ScrollTrigger entrance and scroll choreography
- Lenis smooth scrolling
- Three.js floating petal field
- Click-to-plant SVG tulip garden
- Animated love seal and heart burst
- Reduced-motion and responsive mobile support

## Vector artwork

All character and floral artwork is custom SVG stored in `assets/`: the gift bears, hugging bears, tulip bears, letter bear, single tulip, and bouquet.

## Main files

- `index.html` — copy and page structure
- `styles.css` — visual design and responsive layout
- `main.js` — interactions, GSAP, Lenis, ScrollTrigger, and Three.js

The site uses CDN-hosted libraries, with a graceful reveal fallback if the animation CDN is unavailable.
