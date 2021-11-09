import * as path from 'path';
import { config, handlers, logger, promiseUtils, providerState, WorkerResponse } from '@api3/airnode-node';

const configFile = path.resolve(`${__dirname}/config.json`);
const parsedConfig = config.parseConfig(configFile, process.env);

function encodeBody(data: WorkerResponse): string {
  return JSON.stringify(data);
}

export async function startCoordinator(_req: any, res: any) {
  await handlers.startCoordinator(parsedConfig);
  const response = { ok: true, data: { message: 'Coordinator completed' } };
  res.status(200).send(encodeBody(response));
}

export async function initializeProvider(event: any, res: any) {
  const stateWithConfig = { ...event.body.state, config: parsedConfig };

  const [err, initializedState] = await promiseUtils.go(() => handlers.initializeProvider(stateWithConfig));
  if (err || !initializedState) {
    const msg = `Failed to initialize provider: ${stateWithConfig.settings.name}`;
    const errorLog = logger.pend('ERROR', msg, err);
    const body = encodeBody({ ok: false, errorLog });
    res.status(500).send(body);
    return;
  }

  const body = encodeBody({ ok: true, data: providerState.scrub(initializedState) });
  res.status(200).send(body);
}
