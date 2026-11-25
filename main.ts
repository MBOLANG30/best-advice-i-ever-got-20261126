import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// The winning one-liner for "The Best Advice I Ever Got", chosen in this
// session from eight candidates judged head-to-head by Groq gpt-oss-120b
// against the published judge brief. One sentence, 122 characters.
const ENTRY =
  "My father said the cheapest thing you can give anyone is your full attention, and it is the only gift nobody ever forgets.";

const outputDir = process.env.MAKEFUN_OUTPUT_DIR || "/output";
const entryPath = join(outputDir, "entry.txt");

// Validate the line before writing anything, so a bad entry never lands.
if (ENTRY.length < 1 || ENTRY.length > 200) {
  throw new Error(`entry must be 1-200 characters, got ${ENTRY.length}`);
}
if (ENTRY.includes("\n") || ENTRY.includes("\r")) {
  throw new Error("entry must be a single line");
}
if (ENTRY !== ENTRY.trim()) {
  throw new Error("entry must not have leading or trailing whitespace");
}

// Create the output folder if needed, but never delete it: the grader
// mounts it, so removing it fails with EBUSY. Only its contents change.
// The entry is written with no trailing newline, so entry.txt holds
// exactly the 122-character sentence, byte for byte.
mkdirSync(outputDir, { recursive: true });
writeFileSync(entryPath, ENTRY, "utf8");

// Read the file back and confirm it holds exactly the entry, byte for byte,
// so a partial or mangled write is caught here instead of by the grader.
if (readFileSync(entryPath, "utf8") !== ENTRY) {
  throw new Error("entry.txt does not match the expected entry");
}
