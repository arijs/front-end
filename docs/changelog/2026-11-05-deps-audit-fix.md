# Dev dependencies: clear the open security alerts

## Original prompt

> Temos alertas de vuln. das dependências? Vamos aproveitar e atualizar antes
> de publicar o novo pacote

## What was implemented

`npm audit fix` (no `--force`). Only `package-lock.json` changed: every fixed
version is inside the ranges `package.json` already allows.

| Package | Before | After | Advisories |
| --- | --- | --- | --- |
| `@babel/cli` | 8.0.1 | 8.1.0 | pulls the fixed `glob` |
| `glob` | 13.0.6 | 14.0.3 | GHSA-3g3m-2fjr-6pw4 |
| `minimatch` | 10.2.5 | 11.0.4 | GHSA-g3hv-75wg-m249 |
| `brace-expansion` | 5.0.8 | 5.0.12 | GHSA-q2hr-2g5m-vwhr, GHSA-rgw5-rvv9-x895, GHSA-qhr7-859c-m2p7, GHSA-6j4f-fj2g-mc7p |
| `browserslist` | 4.28.2 | 4.29.5 | GHSA-73wf-gq98-2v4g, GHSA-c83g-rgw3-j3cx |
| `baseline-browser-mapping` | 2.10.38 | 2.11.35 | GHSA-w5vr-8v7q-w6rv |

All of them are development dependencies (build tooling). The published
package depends only on `@babel/runtime`, so consumers were never exposed.

## Before / after

- `npm audit`: 6 vulnerabilities (4 moderate, 2 high) → 0.
- Dependabot: alerts #44, #45, #49 and #51 open → fixed once this reaches
  `master` (it supersedes PRs #6, #7, #8 and #9).

## How it was tested

- `npm test`: all green.
- `lib/` built with the new toolchain is byte-for-byte identical to the build
  from the previous lock (`diff -r`).
- `npm ci` with npm 10.9.8 (what CI uses on Node 22) on the new lock: installs
  cleanly and `npm audit` reports 0.

## Tests created / changed

None: no source change. The existing suite covers the build output.
