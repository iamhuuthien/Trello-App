// run: node tools\replace-blocking-dialogs.js
const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const exts = [".ts", ".tsx", ".js", ".jsx"];
const files = [];

function walk(dir) {
  for (const name of fs.readdirSync(dir)) {
    const p = path.join(dir, name);
    const stat = fs.statSync(p);
    if (stat.isDirectory()) {
      if (name === "node_modules" || name === ".next" || name === ".git") continue;
      walk(p);
    } else if (exts.includes(path.extname(name))) {
      files.push(p);
    }
  }
}
walk(root);

const patterns = [
  { re: /(?<!\.)\balert\s*\(/g, replace: "appAlert(" },
  { re: /(?<!\.)\bconfirm\s*\(/g, replace: "await appConfirm(" },
  { re: /(?<!\.)\bprompt\s*\(/g, replace: "await appPrompt(" },
];

const importStub = `import { appAlert, appConfirm, appPrompt } from "@/components/ui/ConfirmProvider";\n`;

files.forEach((f) => {
  let src = fs.readFileSync(f, "utf8");
  const original = src;
  let did = false;

  patterns.forEach(p => {
    if (p.re.test(src)) {
      src = src.replace(p.re, p.replace);
      did = true;
    }
  });

  if (did) {
    // ensure import exists
    if (!src.includes('ConfirmProvider') && !src.includes('appAlert') && !src.includes('appConfirm') && !src.includes('appPrompt')) {
      // add import at top (after "use client" or after first import)
      if (/^("use client"|'use client')/.test(src.trim())) {
        src = src.replace(/^("use client"|'use client')\s*;?/, m => m + "\n" + importStub);
      } else {
        src = importStub + src;
      }
    }
    fs.writeFileSync(f, src, "utf8");
    console.log("Patched:", f);
  }
});
console.log("Done. Review changes and fix any async/await contexts where necessary.");