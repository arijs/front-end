# ajax-net: validate, type and parse errors reject the promise

## Original prompt

> vamos fazer a correção do validate/parseResponse no servidor. E em vez de
> lançar a versão como 0.4.0, quero lançar como 0.3.4.

## What was implemented

`parseResponse` in `src/server/loaders/ajax-net.mjs` set `resp.error` first
and only then parsed the types and ran `validate()`. `errorApp`, `errorType`
and `errorParse` were filled in but never reached `resp.error`, so
`loadAjaxPromise` resolved on a failing `validate()`, a wrong Content-Type or
an unparsable body. The browser loader rejects in all three cases.

It now runs in the browser loader's order: types, then `validate()`, then
`parseGetError`. The types are checked only once the body has ended
(`!resp.loading`), as in the browser loader, so a timeout that fires after the
headers but before the end of the body is still reported as `errorTimeout`,
not as a type error on a half-received response.

The release these changes go into is 0.3.4 rather than 0.4.0 (no version bump
in this change: `npm version patch` does it, per the README).

## Before / after

```js
// before
export function parseResponse(resp) {
	parseGetError(resp);
	if (resp.res) {
		parseOptTypes(resp);
	}
	parseValidate(resp);
	return resp.opt.cb(resp);
}

// after
export function parseResponse(resp) {
	if (resp.res && !resp.loading) {
		parseOptTypes(resp);
	}
	parseValidate(resp);
	parseGetError(resp);
	return resp.opt.cb(resp);
}
```

Observable change: on the server, `loadAjaxPromise` now rejects with `resp`
where it used to resolve, whenever `validate()` returns an error, the
Content-Type does not match `typeExpect`, or the body fails to parse.

## How it was tested

- The new checks failed against the previous `parseResponse` ("Missing expected
  rejection" on the `validate()` case) and pass with the fix.
- Removing the `!resp.loading` guard makes the timeout check fail with an
  `errorType`, so that guard is covered too.
- `npm test`: all green (ESM on `src/`, CommonJS on `lib/`).

## Tests created / changed

- `test/shared/ajax-net-suite.mjs`: new `/text`, `/badjson` and `/slow`
  endpoints; checks that a failing `validate()`, a wrong Content-Type and an
  unparsable body reject with `errorApp`, `errorType` and `errorParse`; that a
  timeout after the headers is `errorTimeout`. The server now also closes all
  connections when the suite ends, so a failed check cannot hang the run.
