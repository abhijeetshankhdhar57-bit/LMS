# Juspay LMS - Developer Guide & Architecture Overview

Welcome to the internal documentation for the Juspay LMS project! This guide will help you understand how the application is built, where everything lives, and how you can debug and modify the code in the future.

---

## 🏗️ 1. Tech Stack Overview

This application is built on a modern, serverless Javascript stack:
*   **Framework**: [Next.js 14](https://nextjs.org/) (App Router paradigm)
*   **Language**: TypeScript (Provides strict typing to catch errors before runtime)
*   **Styling**: Tailwind CSS + [shadcn/ui](https://ui.shadcn.com/) components
*   **Database**: PostgreSQL hosted on [Neon](https://neon.tech/)
*   **ORM**: [Prisma](https://www.prisma.io/) (Interacts with the database using TypeScript)
*   **Authentication**: NextAuth.js v4 (Currently configured for Google SSO)
*   **File Storage**: Vercel Blob (For hosting video files, PDFs, and thumbnails)

---

## 📂 2. Folder Structure Explained

Understanding the `src/` directory is the key to mastering this codebase.

```text
src/
├── app/                  # NEXT.JS ROUTER: Every folder here becomes a URL path
│   ├── (learner)/        # Grouping for learner pages (e.g. /courses, /progress)
│   ├── admin/            # Admin dashboard routes (e.g. /admin/videos, /admin/users)
│   ├── api/              # Backend API routes (REST endpoints)
│   │   ├── auth/         # NextAuth SSO endpoints
│   │   └── upload/       # Vercel Blob edge-upload token generator
│   ├── actions/          # SERVER ACTIONS: Very important! Backend logic.
│   │   ├── admin.ts      # Functions to create/edit/delete videos and questions
│   │   └── learner.ts    # Functions for submitting quizzes and saving scores
│   ├── layout.tsx        # The root HTML wrapper
│   └── page.tsx          # The default landing page (Login screen)
│
├── components/           # REUSABLE UI ELEMENTS
│   ├── admin/            # Forms and charts specifically for the admin panel
│   ├── learner/          # UI for students (Video Player, Quiz UI)
│   ├── layout/           # Sidebar, Navbar, etc.
│   └── ui/               # Base 'shadcn' design components (Buttons, Inputs, Cards)
│
└── lib/                  # CORE UTILITIES
    ├── auth.ts           # NextAuth configuration & Google ID/Secret setup
    ├── db.ts             # The Prisma database client initialization
    └── utils.ts          # Tailwind CSS formatting helpers
```

---

## 💾 3. The Database (Prisma)

Open `prisma/schema.prisma` to see the exact structure of your data.
*   **User**: Anyone who logs in. They have a `Role` (`USER` or `ADMIN`).
*   **Video**: The core learning module. Stores URLs, titles, and banner links.
*   **Question**: Attached to a Video. Stores the MCQ `options` and `correctOption`.
*   **Score**: Created when a User submits a quiz for a Video. Tracks their points and completion date.

> **Whenever you change `schema.prisma`:**
> You must run `npx prisma db push` in your terminal to update the Neon database, and then restart your development server.

---

## ⚙️ 4. How Data Flows (The "Server Action" Model)

Next.js 14 uses a paradigm called **Server Actions**. This makes form submissions incredibly secure and fast.

1.  **Client (Browser)**: A user fills out the `AddQuestionForm` (a React Client Component) and clicks Submit.
2.  **Server Action**: The form triggers a function inside `src/app/actions/admin.ts`.
3.  **Database**: The Server Action uses Prisma (`db.question.create()`) to safely write to the database on the backend server.
4.  **Revalidation**: The Server Action calls `revalidatePath('/admin/videos')`. This tells Next.js to immediately refresh the page with the newly updated data without requiring a hard browser reload.

---

## 🐞 5. How to Debug & Make Code Changes

If you want to add a new feature or fix a bug in the future, follow these debugging principles:

### A. Knowing where to `console.log()`
Because this is Next.js, code runs in two different places. `console.log` will appear in different spots depending on what file you are in:
*   **Client Components** (`"use client"` at the top of the file): Logs will appear in your **Browser's Developer Tools (Inspect -> Console)**.
    *   *Example: Checking if a button click registered in `AddQuestionForm.tsx`.*
*   **Server Components & Server Actions** (Files in `actions/` or Pages without `"use client"`): Logs will appear in your **VS Code Terminal** or **Vercel Deployment Logs**.
    *   *Example: Checking what data was sent to the database in `admin.ts`.*

### B. Troubleshooting UI/Styling
If a button is the wrong color or a layout looks broken:
1. Locate the component in `src/components/`.
2. Look for `className="..."`. We use Tailwind CSS.
3. Change the Tailwind classes (e.g., change `bg-blue-500` to `bg-red-500`). The local `npm run dev` server will instantly update the browser so you can preview changes.

### C. Troubleshooting Database Errors
If data isn't saving correctly:
1. Open the relevant Server Action in `src/app/actions/`.
2. Add a `console.log("Payload:", formData)` right before the Prisma database call.
3. Check your Terminal output when you submit the form to see exactly what values are failing.
4. If you need to manually inspect or delete corrupt data, use the **Neon Dashboard** or run `npx prisma studio` in your terminal to open a visual database editor.

### D. Adding a New Feature (Workflow Example)
Let's say you want to add a "Video Description" field to the learner view:
1. **Frontend**: Open `src/app/courses/[id]/page.tsx` and add a new `<p>` tag displaying `{video.description}`.
2. **Backend**: If it requires saving new data, update `prisma/schema.prisma` first, run `npx prisma db push`, then update the Server Action in `actions/admin.ts` to save that specific field.

---
*Generated by Antigravity for the Juspay LMS Team.*
