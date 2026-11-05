// Assertion test: the ajax loaders on src/, and the universal entry.
import { fileURLToPath } from 'node:url';
import * as client from '@arijs/frontend/client/loaders/ajax';
import * as server from '@arijs/frontend/server/loaders/ajax-net';
import { runAjaxClientSuite } from '../../shared/ajax-client-suite.mjs';
import { runAjaxNetSuite } from '../../shared/ajax-net-suite.mjs';
import { checkSurface, checkResolution } from '../../shared/ajax-universal-suite.mjs';

await runAjaxClientSuite(client, 'esm');
await runAjaxNetSuite(server, 'esm');
checkSurface(client, server, 'esm');
checkResolution(fileURLToPath(new URL('./universal-probe.mjs', import.meta.url)), 'esm');
