/* terminal.js — interactive fake terminal easter egg */
(function () {

  const COMMANDS = {
    help: {
      pt: [
        ['pink', '[ comandos disponíveis ]'],
        ['dim', '  help          → mostra isso aqui'],
        ['dim', '  about         → quem sou eu'],
        ['dim', '  skills        → minhas habilidades'],
        ['dim', '  status        → onde está meu foco no momento'],
        ['dim', '  contact       → como me achar'],
        ['dim', '  clear         → limpa o terminal'],
      ],
      en: [
        ['pink', '[ available commands ]'],
        ['dim', '  help          → shows this'],
        ['dim', '  about         → who I am'],
        ['dim', '  skills        → my skills'],
        ['dim', '  status        → where I\'m focused right now'],
        ['dim', '  contact       → how to find me'],
        ['dim', '  clear         → clears the terminal'],
      ],
    },

    about: {
      pt: [
        ['pink', 'sobre mim'],
        ['white', '  Nome: Eduarda Vergueiro'],
        ['dim', '  Curso: Ciência da Computação no CEFET-RJ'],
        ['dim', '  Localização: Brasil'],
      ],
      en: [
        ['pink', 'about me'],
        ['white', '  Name: Eduarda Vergueiro'],
        ['dim', '  Degree: Computer Science'],
        ['dim', '  Location: Brazil'],
      ],
    },

    skills: {
      pt: [
        ['pink', 'stack'],
        ['green', '  ██ Inglês        (Fluente)'],
        ['green', '  ██ Java          (Intermediário)'],
        ['green', '  ██ Python        (Intermediário)'],
        ['green', '  ██ SQL           (Intermediário)'],
        ['green', '  ██ PowerBI       (Avançado)'],
        ['green', '  ██ Linux         (Básico)'],
        ['green', '  ██ Cloud         (Básico)'],
      ],
      en: [
        ['pink', 'stack'],
        ['green', '  ██ English       (Fluent)'],
        ['green', '  ██ Java          (Intermediate)'],
        ['green', '  ██ Python        (Intermediate)'],
        ['green', '  ██ SQL           (Intermediate)'],
        ['green', '  ██ PowerBI       (Advanced)'],
        ['green', '  ██ Linux         (Basic)'],
        ['green', '  ██ Cloud         (Basic)'],
      ],
    },

    status: {
      pt: [
        ['pink', 'status atual'],
        ['white', '  → cursando o 4° período'],
        ['white', '  → estagiando na área de dados'],
        ['white', '  → bolsista em iniciação científica'],
        ['white', '  → estudando para tirar o AWS Cloud Practitioner'],
      ],
      en: [
        ['pink', 'current status'],
        ['white', '  → 4th semester student'],
        ['white', '  → data science intern'],
        ['white', '  → scientific initiation research fellow'],
        ['white', '  → studying for AWS Cloud Practitioner'],
      ],
    },

    contact: {
      pt: [
        ['pink', 'contato'],
        ['white', '  email   → eduardavergueiro7@gmail.com'],
        ['white', '  github  → github.com/eduardavergueiro'],
        ['white', '  linkedin→ linkedin.com/in/eduarda-vergueiro'],
      ],
      en: [
        ['pink', 'contact'],
        ['white', '  email   → eduardavergueiro7@gmail.com'],
        ['white', '  github  → github.com/eduardavergueiro'],
        ['white', '  linkedin→ linkedin.com/in/eduarda-vergueiro'],
      ],
    },
  };

  const NOT_FOUND = {
    pt: (cmd) => [['dim', `  comando não encontrado: "${cmd}" — tente "help"`]],
    en: (cmd) => [['dim', `  command not found: "${cmd}" — try "help"`]],
  };

  // ---- DOM refs ----
  const wrap = document.querySelector('.terminal-wrap');
  const inputEl = document.getElementById('terminal-input');
  const typedCmd = document.getElementById('typed-cmd');
  const outputEl = document.getElementById('terminal-output');

  // ---- State ----
  let history = [];
  let histIdx = -1;

  // ---- Click to focus ----
  wrap.addEventListener('click', () => {
    inputEl.focus();
    wrap.classList.add('active');
  });
  inputEl.addEventListener('blur', () => wrap.classList.remove('active'));

  // ---- Mirror typing to display (handle IME composition on mobile) ----
  let _isComposing = false;
  inputEl.addEventListener('compositionstart', () => { _isComposing = true; });
  inputEl.addEventListener('compositionupdate', () => { typedCmd.textContent = inputEl.value; });
  inputEl.addEventListener('compositionend', () => { _isComposing = false; typedCmd.textContent = inputEl.value; });
  inputEl.addEventListener('input', () => {
    if (!_isComposing) typedCmd.textContent = inputEl.value;
  });

  // ---- Handle key events ----
  inputEl.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const raw = inputEl.value.trim().toLowerCase();
      if (!raw) return;

      history.unshift(raw);
      histIdx = -1;

      runCommand(raw);

      inputEl.value = '';
      typedCmd.textContent = '';
    }

    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (histIdx < history.length - 1) histIdx++;
      if (history[histIdx]) {
        inputEl.value = history[histIdx];
        typedCmd.textContent = inputEl.value;
      }
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (histIdx > 0) histIdx--;
      else { histIdx = -1; inputEl.value = ''; typedCmd.textContent = ''; return; }
      inputEl.value = history[histIdx] || '';
      typedCmd.textContent = inputEl.value;
    }
  });

  // ---- Run a command ----
  function runCommand(cmd) {
    const lang = document.documentElement.getAttribute('data-lang') || 'pt';

    // Echo the typed command first
    appendLine('', cmd, 'white echo');

    if (cmd === 'clear') {
      outputEl.innerHTML = '';
      return;
    }

    const def = COMMANDS[cmd];
    const lines = def
      ? (def[lang] || def['pt'])
      : NOT_FOUND[lang](cmd);

    lines.forEach(([cls, text], i) => {
      setTimeout(() => appendLine(cls, text), i * 40);
    });

    // Scroll to bottom
    setTimeout(() => {
      outputEl.scrollTop = outputEl.scrollHeight;
    }, lines.length * 40 + 60);
  }

  function appendLine(cls, text, extra = '') {
    const div = document.createElement('div');
    div.className = `t-output-line ${cls} ${extra}`.trim();
    div.textContent = text;
    outputEl.appendChild(div);
  }

  // ---- Expose for external use ----
  window._terminalRun = runCommand;
})();
