Getting started with Firebase Hosting for your technical support landing page is quick and simple [all]. Here are the steps to deploy your site:

Step 1: Install the Firebase CLI

First, make sure you have the Firebase CLI installed on your computer [all]. You can install it globally via your terminal [all]:

`npm install -g firebase-tools`
Step 2: Log in and Initialize Hosting

Navigate to your local project's root folder in your terminal, and log in to your Google account associated with Firebase [all]:

`firebase login`
Next, initialize Hosting in your directory [all]:

`firebase init hosting`
During the command prompts:

Select Use an existing project and choose your project, tech-support-kw [all].

Specify your public root directory (the default is `public`) [all]. This folder is where you will place your landing page's HTML, CSS, and JavaScript files [all].

Choose whether to configure your site as a single-page app (which automatically configures URL rewrites) [all].

Step 3: Add Your Landing Page Code

Place your website files (like your `index.html`) inside the public root directory (e.g., the `public` folder) [all].

Step 4: Deploy Your Site

When your landing page is ready, run the deployment command from your project root [all]:

`firebase deploy --only hosting`
Once completed, the CLI will output your live hosting URLs, which will look like [all]:

tech-support-kw.web.app

tech-support-kw.firebaseapp.com

# Kuwait Tech Support

Marketing site for **Kuwait Tech Support** — your technology partner for business growth.

Positioning: *Keep your systems reliable. Keep your business moving.* Dependable technical expertise for growing businesses: integrations, maintenance, troubleshooting, and bug fixes, as an extension of your team.

The site is a static landing page (English with an Arabic toggle) served from the `public/` folder on Firebase Hosting.

## Local preview

Open `public/index.html` in a browser, or serve the Hosting folder:

```bash
npx firebase serve --only hosting
```

Contact details are defined in `public/js/main.js` (`CONTACT`).

## Deploy

Firebase project: `tech-support-kw`

```bash
npm install -g firebase-tools
firebase login
firebase deploy --only hosting
```

Live URLs after deploy:

- `https://tech-support-kw.web.app`
- `https://tech-support-kw.firebaseapp.com`

GitHub Actions in `.github/workflows/` deploy Hosting on merge and pull-request previews.