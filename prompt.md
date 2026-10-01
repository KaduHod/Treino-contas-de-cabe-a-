# Prompt — Treino de Cálculo Mental

Create a simple mental math training project using ONLY two files: `index.html` and `script.js`.

## Project language (MANDATORY)
- The project language is Brazilian Portuguese (pt-BR).
- ALL user-facing text must be in Portuguese: labels, buttons, select options, feedback messages, hints, scoreboard, and the page title.
- ALL code comments must be in Portuguese.
- Function and variable names must also be in Portuguese (no accents in identifiers), e.g. `gerarConta`, `verificarResposta`, `acertos`.
- Set `<html lang="pt-BR">`.
- Only these instructions are in English; the project itself must be entirely in Portuguese.

## Technical rules (MANDATORY)
- Plain HTML + JavaScript running in the browser (no framework, no build step, no backend, no Node/npm).
- NO LIBRARIES: do not use any JavaScript library (no jQuery, lodash, Alpine, React, Vue, input-mask, etc.). Vanilla JavaScript only.
- Tailwind ONLY via CDN, with this tag in the `<head>`: `<script src="https://cdn.tailwindcss.com"></script>`. Do NOT install Tailwind via npm, do NOT create `tailwind.config.js`, do NOT create a separate CSS file, and do NOT use any other CDN or external font.
- The code must be VERY simple: only plain functions and global variables. NO classes, NO modules (`import`/`export`), NO unnecessary abstractions.
- Clean, modern, centered UI with good contrast, responsive (must work well on mobile).

## Settings (top of the page)
1. **Operation**: a select with 3 options: "Multiplicação", "Divisão" or "Ambas" (randomly picks one of the two for each problem).
2. **Number type**: a select with 2 options: "Apenas inteiros" or "Livre (até 2 casas decimais)".
Changing any setting must immediately generate a new problem.

## Problem generation
- Always ONE problem at a time. Examples: `100 × 10`, `10 ÷ 100`.
- All displayed numbers (factors, dividend, divisor) must be between 1 and 1000.
- "Apenas inteiros" mode: all numbers are integers.
- "Livre" mode: each number can be an integer or have up to 2 decimal places (chosen randomly), always between 1 and 1000.
- Multiplication: pick two factors and compute the result.
- Division:
  - Integer mode: the division must be exact. Pick an integer divisor and an integer quotient such that dividend = divisor × quotient is ≤ 1000.
  - Free mode: pick dividend and divisor (up to 2 decimal places) and use the result rounded to 2 decimal places as the answer. Show a subtle hint: "Arredonde para 2 casas decimais".
- Beware of JavaScript floating-point errors: round results (e.g. `Number(x.toFixed(4))` for multiplication and `toFixed(2)` for division) and generate decimals as integers divided by 100.
- Display numbers in Brazilian format (decimal comma). Use `×` and `÷` as symbols.

## Main screen
- Show the problem prominently in a large font (e.g. `12,5 × 8`).
- Below it, an answer input with a mask (implemented by hand, no library):
  - Accepts only digits and ONE decimal separator (comma or dot; convert dot to comma).
  - In "Apenas inteiros" mode, no decimal separator is allowed.
  - In "Livre" mode, limit to 2 decimal places for division and 4 for multiplication.
  - Use `type="text"` with `inputmode="decimal"` and apply the mask on the `input` event, stripping invalid characters.
  - Pressing Enter triggers the currently active button.
- "Verificar resposta" button:
  - DISABLED (grayed out, `disabled` attribute) while the input is empty or invalid.
  - Enabled only when the user has typed a valid value.
- When clicking "Verificar resposta":
  - Compare the user's answer with the correct result (convert comma to dot; use a small tolerance, e.g. `Math.abs(a - b) < 0.0001`).
  - Show feedback: green with "Acertou!" or red with "Errou" + the correct answer.
  - Disable the input and change the button to "Próxima conta".
- When clicking "Próxima conta": generate a new problem, clear the input, re-enable it, focus it, and reset the button to "Verificar resposta" (disabled).
- Simple scoreboard at the top: correct answers and total attempts, kept in memory only (no localStorage).

## Deliverables
- `index.html` with the structure and Tailwind classes, loading `script.js` at the end of the body.
- `script.js` with all the logic and short comments (in Portuguese) explaining each function.
- Do not create any other files (no `package.json`, no extra CSS, etc.). At the end, only say how to open it (just open `index.html` in the browser).
