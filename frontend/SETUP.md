This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

# Frontend setup

This is a Next.js project. The following steps get the frontend running locally and address common Tailwind/PostCSS and editor warnings.

Requirements
- Node >= 18 (Node 18 or 20 recommended)
- pnpm
- (Recommended) VS Code with "Tailwind CSS IntelliSense" and "Stylelint" extensions

Install & run (Windows PowerShell)
1. Open terminal in the frontend folder:
   cd C:\TrelloApp\Trello-App\frontend

2. Install dependencies:
   pnpm install

3. Run the dev server:
   pnpm dev
   Open http://localhost:3000

Tailwind / PostCSS
- This repo includes manual configs:
  - tailwind.config.cjs
  - postcss.config.mjs (you can rename to postcss.config.cjs for CommonJS)
  - app/globals.css contains the Tailwind directives (@tailwind base; @tailwind components; @tailwind utilities;)
- If you prefer the CLI and it is available:
  pnpm exec tailwindcss init -p

VS Code: avoid "Unknown at rule @tailwind / @theme" warnings
- Add or verify workspace settings (frontend/.vscode/settings.json):
  {
    "css.validate": false,
    "scss.validate": false,
    "less.validate": false,
    "css.lint.unknownAtRules": "ignore",
    "scss.lint.unknownAtRules": "ignore",
    "files.associations": { "*.css": "postcss" }
  }
- Install "Tailwind CSS IntelliSense" and reload VS Code.
- If warnings persist: open globals.css, set language mode to "PostCSS" from the status bar, then reload.

Stylelint
- Repo includes .stylelintrc.cjs to allow Tailwind at-rules.
- Optional install:
  pnpm add -D stylelint stylelint-config-standard

Troubleshooting
- "'tailwindcss' is not recognized": pnpm exec tailwindcss may fail in some pnpm/dlx setups. Use the included manual configs.
- If Problems panel still shows unknown at-rules: ensure the file is recognized as PostCSS and VS Code settings are applied.
- To prefer CommonJS for PostCSS, rename postcss.config.mjs → postcss.config.cjs and set:
  module.exports = { plugins: { tailwindcss: {}, autoprefixer: {} } };

Quick checklist
- [ ] pnpm install runs successfully
- [ ] pnpm dev runs and Next page loads
- [ ] Unknown at-rule warnings resolved (or ignored via settings)
- [ ] Tailwind IntelliSense functioning
