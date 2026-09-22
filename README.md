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

The site is a static landing page (English with an Arabic toggle) served from the `public/` folder on Firebase Hosting. Enquiries are stored in Cloud Firestore. When a visitor submits the enquiry form, a Cloud Function also emails **techsupportkw@gmail.com**. Staff can sign in at `/admin.html` to review, update, and delete records.

WhatsApp and phone contact options are hidden for now. The public email contact remains available.

## Local preview

Serve through Firebase Hosting so the Firebase SDK can load:

```bash
npx firebase serve
```

## Enquiries (Firestore)

1. Enable **Cloud Firestore** in the Firebase console for `tech-support-kw` if it is not already created.
2. Enable **Email/Password** authentication and create one staff user (do not add a public sign-up form).
3. Deploy rules with the site:

```bash
firebase deploy --only hosting,firestore
```

I've set up prototype Security Rules to keep enquiry data in Firestore safe. Visitors may only **create** a new enquiry with validated fields. Only signed-in staff can **read, update, or delete** records. You should review and verify these rules before sharing the app widely.

## Email notifications

The form still saves the enquiry. A function then sends a notification to `techsupportkw@gmail.com`.

This requires the Blaze plan. Use a Gmail **App Password** for `techsupportkw@gmail.com` (Google Account → Security → 2-Step Verification → App passwords).

```bash
firebase functions:secrets:set SMTP_USER
firebase functions:secrets:set SMTP_PASS
firebase deploy --only functions
```

Set `SMTP_USER` to `techsupportkw@gmail.com` and `SMTP_PASS` to the app password.

## Deploy

Firebase project: `tech-support-kw`

```bash
npm install -g firebase-tools
firebase login
firebase deploy --only hosting,firestore,functions
```

Live URLs after deploy:

- `https://tech-support-kw.web.app`
- `https://tech-support-kw.firebaseapp.com`

GitHub Actions in `.github/workflows/` deploy Hosting on merge and pull-request previews.