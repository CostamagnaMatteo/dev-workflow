#!/usr/bin/env node
// Hook SessionStart del plugin dev-workflow.
// Si attiva solo nei repository che contengono DEV-WORKFLOW.md alla root.
// Inietta nel contesto di Claude: regole del flusso, profilo del progetto, percorsi utili e
// stato del task collegato al branch corrente. Un errore non deve mai bloccare la sessione.

const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const PROFILE_NAME = "DEV-WORKFLOW.md";
const MAX_PROFILE_CHARS = 6000;
const DEFAULTS = {
  "ticket-pattern": "[A-Z][A-Z0-9]+-\\d+",
  "main-branch": "main",
  "docs-language": "italiano",
};

function git(args) {
  try {
    return execSync(`git ${args}`, { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }).trim();
  } catch {
    return "";
  }
}

function readIf(file) {
  try {
    return fs.existsSync(file) ? fs.readFileSync(file, "utf8") : "";
  } catch {
    return "";
  }
}

// Frontmatter YAML minimale: righe "chiave: valore", valori opzionalmente tra apici.
function parseFrontmatter(markdown) {
  const m = markdown.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  const data = {};
  if (!m) return data;
  for (const line of m[1].split(/\r?\n/)) {
    const kv = line.match(/^\s*([\w-]+)\s*:\s*(.*?)\s*$/);
    if (!kv) continue;
    let v = kv[2];
    if (v.startsWith('"') && v.endsWith('"')) v = v.slice(1, -1).replace(/\\\\/g, "\\").replace(/\\"/g, '"');
    else if (v.startsWith("'") && v.endsWith("'")) v = v.slice(1, -1).replace(/''/g, "'");
    data[kv[1]] = v;
  }
  return data;
}

function readSection(markdown, heading) {
  const lines = markdown.split(/\r?\n/);
  const start = lines.findIndex((l) => l.trim() === `## ${heading}`);
  if (start === -1) return "";
  const out = [];
  for (let i = start + 1; i < lines.length && !lines[i].startsWith("## "); i++) out.push(lines[i]);
  return out.join("\n").trim();
}

function main() {
  const top = git("rev-parse --show-toplevel"); // checkout corrente (anche un worktree)
  if (!top) return;
  const profilePath = path.join(top, PROFILE_NAME);
  const profile = readIf(profilePath);
  if (!profile) return; // repository senza profilo: plugin silenzioso

  const commonDir = git("rev-parse --path-format=absolute --git-common-dir");
  const workDir = path.join(path.dirname(commonDir), ".claude", "work"); // sempre nel repo principale
  const settings = { ...DEFAULTS, ...parseFrontmatter(profile) };
  const pluginRoot = path.dirname(__dirname);

  let keyRe;
  try {
    keyRe = new RegExp(settings["ticket-pattern"]);
  } catch {
    keyRe = new RegExp(DEFAULTS["ticket-pattern"]);
  }

  const branch = git("branch --show-current");
  const key = (branch.match(keyRe) || [])[0];

  const out = [
    readIf(path.join(__dirname, "workflow-rules.md")).trim(),
    "",
    "## Percorsi",
    `- PROFILO = ${profilePath}`,
    `- WORK_DIR = ${workDir}${fs.existsSync(workDir) ? "" : " (non ancora creata: /dev-workflow:init la prepara)"}`,
    `- DEFAULT DEL PLUGIN = ${path.join(pluginRoot, "skills", "breakdown", "references")} (slicing-rules.md, task-template.md)`,
    `- Formato chiavi (ticket-pattern): ${settings["ticket-pattern"]} · Branch principale: ${settings["main-branch"]} · Lingua documenti: ${settings["docs-language"]}`,
    "",
    "## Profilo del progetto (DEV-WORKFLOW.md)",
    profile.length > MAX_PROFILE_CHARS
      ? profile.slice(0, MAX_PROFILE_CHARS) + "\n…(troncato: leggi il file completo quando serve)"
      : profile.trim(),
    "",
    "## Situazione all'avvio",
    `Branch corrente: ${branch || "(detached)"}`,
  ];

  const taskDir = key && path.join(workDir, "tasks", key);
  if (taskDir && fs.existsSync(taskDir)) {
    const plan = readIf(path.join(taskDir, "plan.md"));
    const log = readIf(path.join(taskDir, "log.md"));
    const title = ((readIf(path.join(taskDir, "task.md")).match(/^#+\s*(.+)$/m) || [])[1] || "").replace(/^\[[^\]]*\]\s*/, "");
    const steps = plan.split(/\r?\n/).filter((l) => /^\s*- \[[ xX]\] \d+\./.test(l));
    const done = steps.filter((l) => /\[[xX]\]/.test(l)).length;

    out.push(`Task attivo: ${key} ${title}`.trim());
    if (steps.length) out.push(`Avanzamento piano: ${done}/${steps.length} passi`);
    const stato = readSection(log, "Stato attuale");
    if (stato) out.push("Stato attuale dal log:", stato);
    out.push(`File di lavoro: ${taskDir}. Per il briefing completo: /dev-workflow:resume`);
  } else if (key) {
    out.push(`Il branch fa riferimento a ${key} ma non esiste la sua cartella di lavoro: proponi /dev-workflow:start-task ${key}.`);
  } else {
    const tasksRoot = path.join(workDir, "tasks");
    const active = fs.existsSync(tasksRoot)
      ? fs.readdirSync(tasksRoot).filter((k) => /- \[ \]/.test(readIf(path.join(tasksRoot, k, "plan.md"))))
      : [];
    out.push(
      active.length
        ? `Task con lavoro in sospeso: ${active.join(", ")}. Per riprenderne uno: /dev-workflow:resume <TASK-KEY>`
        : "Nessun task in sospeso."
    );
  }

  process.stdout.write(out.join("\n") + "\n");
}

try {
  main();
} catch {
  // silenzioso per scelta
}
