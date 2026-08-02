# A Two Minute Story ✨

A premium, cinematic, mobile-first interactive storytelling website built with handcrafted HTML, CSS, and JavaScript.

---

## 🌟 Features

- **8-Step Interactive Sequence**:
  1. **Page 1 — Welcome**: Gentle landing invitation.
  2. **Page 2 — Funny Intro**: Typewriter effect with portrait image.
  3. **Page 3 — My Photo**: Playful confession card.
  4. **Page 4 — Her Photo**: Romantic quote card with pink glow frame.
  5. **Page 5 — Mini Game**: "Guess what's waiting at the end?" quiz with playful wrong answers and celebratory progression.
  6. **Page 6 — Memory Gallery**: Interactive memory carousel with dot indicators and photo captions.
  7. **Page 7 — Open Letter**: Handwritten glass letter with line-by-line fade-in animation.
  8. **Page 8 — Final Question**: "Can we talk?" with evasive "Not Today" button and confetti celebration on "YES".

- **Cinematic Visuals & FX**:
  - Glassmorphism translucent cards with backdrop blur.
  - Floating background particles and rising ambient hearts canvas.
  - Custom 2D Canvas Confetti particle explosion engine.
  - Web Audio API synthesized ambient chord player with sound toggle.
  - Responsive typewriter text effect with blinking cursor.
  - Mobile touch-friendly, smooth scrolling, and custom loading screen.

---

## 🚀 How to Deploy Directly to GitHub Pages

1. **Fork or Push to GitHub**:
   - Create a new repository on GitHub (e.g. `a-two-minute-story`).
   - Push all files (`index.html`, `style.css`, `script.js`, `assets/`, `README.md`) to the `main` branch.

2. **Enable GitHub Pages**:
   - Go to your repository **Settings** → **Pages**.
   - Under **Build and deployment** > **Source**, choose **Deploy from a branch**.
   - Select `main` branch and `/ (root)` folder.
   - Click **Save**.
   - Your site will be live at `https://<your-username>.github.io/<repository-name>/` in ~1 minute!

---

## 📧 How to Configure EmailJS for Automated Notifications

When the visitor clicks **❤️ YES**, the app can automatically send an email to `pprateek26@gmail.com`. Follow these 3 simple steps to enable it for free:

### Step 1: Create a Free Account
1. Sign up at [EmailJS.com](https://www.emailjs.com/) (Free tier includes 200 emails/month).

### Step 2: Add an Email Service & Template
1. Go to **Email Services** → Click **Add New Service** → Choose **Gmail** or your email provider.
2. Note your **Service ID** (e.g. `service_abcd123`).
3. Go to **Email Templates** → Click **Create New Template**.
4. Set the template content:
   - **Subject**: `{{subject}}`
   - **Body**:
     ```text
     Someone clicked YES on your website ❤️
     
     Timestamp: {{timestamp}}
     Device: {{device}}
     Platform: {{platform}}
     Screen: {{screen}}
     ```
5. Note your **Template ID** (e.g. `template_xyz456`).

### Step 3: Update `script.js`
In `script.js`, update the top configuration section:
```javascript
const STORY_CONFIG = {
  recipientEmail: "pprateek26@gmail.com",

  emailjs: {
    serviceID: "YOUR_SERVICE_ID",   // Paste your Service ID here
    templateID: "YOUR_TEMPLATE_ID", // Paste your Template ID here
    publicKey: "YOUR_PUBLIC_KEY"   // Found under Account > API Keys
  },
  ...
};
```
Also include the EmailJS SDK script tag in `<head>` of `index.html` if desired:
```html
<script src="https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js"></script>
```

---

## 📸 Customizing Photos and Text

All photos and text lines are stored in `script.js` inside `STORY_CONFIG`:

```javascript
photos: {
  myPhoto1: "assets/images/my-photo-1.jpg",
  myPhoto2: "assets/images/my-photo-2.jpg",
  herPhoto: "assets/images/her-photo.jpg",
  memories: [
    {
      id: 1,
      image: "assets/images/memory-1.jpg",
      caption: "This day still makes me smile.",
      location: "Favorite Memory"
    }
  ]
}
```
Simply replace the image file paths or image URLs with your own photos!

---

## 🛠️ Local Development

To run locally with Vite:
```bash
npm install
npm run dev
```
Open `http://localhost:3000` in your browser.
