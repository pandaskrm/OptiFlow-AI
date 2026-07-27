const fs = require("fs");
const path = require("path");
const iconv = require("iconv-lite");

const roots = ["app", "components", "lib", "hooks"];
const suspicious = /Ã|Â|ðŸ|â(?:€™|€|€œ|€|€“|€”|€¦|„¢)|ï¿½/;
let detected = 0;

function scan(directory) {
  if (!fs.existsSync(directory)) return;

  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const fullPath = path.join(directory, entry.name);

    if (entry.isDirectory()) {
      scan(fullPath);
      continue;
    }

    if (!entry.isFile() || !/\.(ts|tsx)$/.test(entry.name)) continue;

    const content = fs.readFileSync(fullPath, "utf8");
    const lines = content.split(/\r?\n/);
    const repairedLines = lines.map((line) => {
      if (!suspicious.test(line)) return line;

      const candidate = iconv.decode(iconv.encode(line, "win1252"), "utf8");

      return candidate.includes(String.fromCharCode(0xfffd)) ? line : candidate;
    });

    const repaired = repairedLines.join("\n");

    if (repaired !== content) {
      detected++;
      fs.writeFileSync(fullPath, repaired, "utf8");
      console.log(`\n${fullPath}`);
      lines.forEach((line, index) => {
        if (line !== repairedLines[index]) {
          console.log(`  Ligne ${index + 1}`);
          console.log(`  AVANT : ${line.trim()}`);
          console.log(`  APRÈS : ${repairedLines[index].trim()}`);
        }
      });
    }
  }
}

roots.forEach(scan);
console.log(`\nFichiers réparables détectés : ${detected}`);
console.log(`${detected} fichier(s) réparé(s).`);







