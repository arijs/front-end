# Universal ajax loader (`@arijs/frontend/universal/loaders/ajax`)

## Original prompt

> @front-end/_ignore/prompt-loaders-universais.md
> Além de fazer a solicitação do prompt desse arquivo, veja também se podemos
> compartilhar mais código entre os módulos, como o AjaxError e formatError, e
> outros se houver.

The referenced file asks for a universal ajax entry resolved by conditional
exports, the same request options on both loaders, a fix for `method`/`headers`
being ignored by `server/loaders/ajax-net`, tests, and README docs. No version
bump, tag, publish or push.

## What was implemented

- `src/isomorphic/loaders/ajax-common.mjs` (new): `AjaxError`, `formatError`,
  `respTestTypes`, `parseOptTypes`, `parseValidate`, `parseGetError`, plus
  `createAjaxTypes(respGetType)` (builds `respErrorType`, `createTypeParser`
  and `ajaxTypeJson` around the environment's Content-Type reader),
  `startTimeout` and `createLoadAjaxPromise`.
- `src/client/loaders/ajax.mjs`: uses and re-exports the shared code. No
  behaviour change.
- `src/server/loaders/ajax-net.mjs`:
  - uses and re-exports the shared code;
  - accepts `url` as an alias of `req`;
  - applies `method` and `headers` (a `{ name, value }` list or a plain object);
    an options object in `req` keeps its own `method`/`headers`;
  - picks `http`/`https` from the URL, `apiProtocol` still forces it;
  - sends `Content-Length` for string/Buffer bodies instead of chunked encoding;
  - fixes `asBuffer` (`Buffer.concat(data, chunk)` threw) and clears the timeout
    when the response ends (it kept the process alive until it fired);
  - exports `parseResponse`, so both sides expose the same names.
- `package.json`: `./universal/loaders/ajax` conditional export
  (`browser` → client, `node` → server, `default` → client).
- `README.md`: "Universal entries" section.

## Before / after

Before, a consumer that renders on both sides:

```ts
import { loadAjaxPromise, ajaxTypeJson } from '@arijs/frontend/client/loaders/ajax'
import { loadAjaxPromise as loadAjaxPromiseSSR, ajaxTypeJson as ajaxTypeJsonSSR } from '@arijs/frontend/server/loaders/ajax-net'

if (import.meta.env.SSR) {
  return loadAjaxPromiseSSR({ method: 'POST', req: url, headers: [headerJson], body, typeExpect: ajaxTypeJsonSSR, validate, formatError })
}
return loadAjaxPromise({ method: 'POST', url, headers: [headerJson], body, typeExpect: ajaxTypeJson, validate, formatError })
```

and the SSR call went out as a `GET` with no headers, over `https` only.

After:

```ts
import { loadAjaxPromise, ajaxTypeJson } from '@arijs/frontend/universal/loaders/ajax'

return loadAjaxPromise({ method: 'POST', url, headers: [headerJson], body, typeExpect: ajaxTypeJson, validate, formatError })
```

## How it was tested

- `npm test` (build + ESM suite on `src/` + CommonJS suite on `lib/`): all
  green, including the new ajax suites.
- The new server suite was run against the previous `ajax-net.mjs`: it fails on
  the first check (the request ignored `url` and went to `https://localhost`).
- `npm pack --dry-run` lists `src/isomorphic/loaders/ajax-common.mjs` and
  `lib/isomorphic/loaders/ajax-common.js` next to the two loaders.
- Manual: packed the tarball, installed it in a temporary project, and listed
  the exports of `@arijs/frontend/universal/loaders/ajax` with `import()` and
  `require()`, with and without `--conditions=browser`.
- Manual: Vite 6 browser build of a file importing the universal entry has no
  "Module http has been externalized" warning and no Node code in the bundle;
  the SSR build keeps the import external and Node resolves the server loader.

## Tests created / changed

- `test/shared/ajax-net-suite.mjs` (new): local `http.createServer`; POST with
  list and object headers, legacy `req` string, `req` options object
  precedence and protocol, JSON parsing, 500 → `errorServer`, `asBuffer` and
  timeout regressions.
- `test/shared/ajax-client-suite.mjs` (new): browser loader on a fake
  `XMLHttpRequest`; headers, 500, `validate`, type, network and timeout errors.
- `test/shared/ajax-universal-suite.mjs` (new): export surface of both sides
  and resolution of the universal entry with and without `--conditions=browser`.
- `test/mjs/loaders/ajax.mjs`, `test/cjs/loaders/ajax.cjs` (new): run the
  suites on `src/` and `lib/`.
- `test/mjs/loaders/universal-probe.mjs`, `test/cjs/loaders/universal-probe.cjs`
  (new): child-process probes for the resolution checks.
- `test/mjs/index.mjs`, `test/cjs/index.cjs`: wire the new tests in.
