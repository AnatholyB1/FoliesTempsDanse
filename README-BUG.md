```markdown
# Infinite Redirect Loop – Next.js + Convex + Clerk (Production on Vercel only)

## Description

In production on Vercel, this project encounters an infinite redirect loop between the home page and the login page, even when the user is already authenticated.

In local development and local production builds, the app works perfectly: the logged-in user can access the site without redirection.

---

## Steps to Reproduce

1. **Clone the repository:**
   ```bash
   git clone https://github.com/AnatholyB1/FoliesTempsDanse
   cd FoliesTempsDanse
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   Create a `.env.local` file and fill in your Clerk and Convex credentials.
   Example:
   ```env
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=...
   CLERK_SECRET_KEY=...
   NEXT_PUBLIC_CONVEX_URL=...
   ```

4. **Run in development mode (in two terminals):**
   ```bash
   # Terminal 1 – Start Convex
   npx convex dev

   # Terminal 2 – Start Next.js
   npm run dev
   ```
   ✅ Works fine — logged-in user stays on the home page.

5. **Run in local production:**
   ```bash
   npm run build
   npm run start
   ```
   ✅ Works fine — no redirect loop.

6. **Deploy to Vercel with the following command:**
   ```bash
   npx convex deploy --cmd 'npm run build'
   ```
   ❌ Infinite redirect loop between `/` and `/sign-in`.

---

## Expected Behavior

If the user is already authenticated with Clerk, they should be able to access the home page without being redirected to the login page.

## Actual Behavior (Vercel only)

- Visiting `/` while logged in redirects to `/sign-in`.
- Clerk detects the user is logged in and redirects back to `/`.
- This creates an infinite loop.

---

## Environment

- **Framework:** Next.js
- **Auth:** Clerk
- **Database:** Convex
- **Hosting:** Vercel
- **Build command:** `npx convex deploy --cmd 'npm run build'`
- **Repo:** GitHub – FoliesTempsDanse
- **Production site:** https://lesfoliestempsdanse.com
- **Node.js version:** v20.17.0

Works in development and local production, fails in Vercel production.

---

## Notes

- The issue might be related to how Clerk session cookies are handled on Vercel.
- Middleware/authentication logic is in `middleware.ts` and main page logic is in `pages/index.tsx`.
- 📌 This repository is the actual project where the bug occurs and can be used to reproduce the issue.
```