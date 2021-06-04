import * as adapter from '@api3/adapter';
import { OIS, SecurityScheme } from '@api3/ois';
import { go, retryOnTimeout } from '../utils/promise-utils';
import { removeKeys } from '../utils/object-utils';
import { getEnvValue } from '../config';
import * as logger from '../logger';
import { getResponseParameters, RESERVED_PARAMETERS } from '../adapters/http/parameters';
import {
  AggregatedApiCall,
  ApiCallResponse,
  ChainConfig,
  Config,
  LogsData,
  RequestErrorCode,
  SecuritySchemeEnvironmentConfig,
} from '../types';
import { API_CALL_TIMEOUT, API_CALL_TOTAL_TIMEOUT } from '../constants';

function buildOptions(
  chain: ChainConfig,
  ois: OIS,
  securitySchemeEnvironmentConfigs: SecuritySchemeEnvironmentConfig[],
  aggregatedApiCall: AggregatedApiCall
): adapter.BuildRequestOptions {
  let parameters = aggregatedApiCall.parameters;
  // Include airnode metadata based on _relay_metadata version number
  // TODO: enum?
  // TODO: revisit if condition
  if ('_relay_metadata' in aggregatedApiCall.parameters && aggregatedApiCall.parameters['_relay_metadata'] == 'v1') {
    parameters = {
      ...parameters,
      _airnode_airnode_id: aggregatedApiCall.airnodeId,
      _airnode_client_address: aggregatedApiCall.clientAddress,
      _airnode_designated_wallet: aggregatedApiCall.designatedWallet,
      _airnode_endpoint_id: aggregatedApiCall.endpointId,
      _airnode_requester_index: aggregatedApiCall.requesterIndex,
      _airnode_request_id: aggregatedApiCall.id,
      _airnode_chain_type: aggregatedApiCall.chainId,
      _airnode_chain_id: chain.type,
      _airnode_airnode_rrp: chain.contracts.AirnodeRrp,
    };
  }
  // Don't submit the reserved parameters to the API
  parameters = removeKeys(parameters || {}, RESERVED_PARAMETERS);

  // Fetch secrets and build a list of security schemes
  const securitySchemeNames = Object.keys(ois.apiSpecifications.components.securitySchemes);
  const securitySchemes = securitySchemeNames.map((securitySchemeName) => {
    const securityScheme = ois.apiSpecifications.components.securitySchemes[securitySchemeName];
    const securitySchemeEnvironmentConfig = securitySchemeEnvironmentConfigs.find((s) => s.name === securitySchemeName);
    if (!securitySchemeEnvironmentConfig) {
      return { ...securityScheme, securitySchemeName, value: '' } as SecurityScheme;
    }
    const value = getEnvValue(securitySchemeEnvironmentConfig.envName) || '';
    return { ...securityScheme, securitySchemeName, value } as SecurityScheme;
  });

  return {
    endpointName: aggregatedApiCall.endpointName!,
    parameters,
    ois,
    securitySchemes,
  };
}

export async function callApi(
  config: Config,
  aggregatedApiCall: AggregatedApiCall
): Promise<LogsData<ApiCallResponse>> {
  const { chainId, endpointName, oisTitle } = aggregatedApiCall;
  const chain = config.chains.find((c) => c.id === chainId)!;
  const ois = config.ois.find((o) => o.title === oisTitle)!;
  const endpoint = ois.endpoints.find((e) => e.name === endpointName)!;
  const securitySchemeEnvironmentConfigs = config.environment.securitySchemes.filter((s) => s.oisTitle === oisTitle);

  // Check before making the API call in case the parameters are missing
  const responseParameters = getResponseParameters(endpoint, aggregatedApiCall.parameters || {});
  if (!responseParameters._type) {
    const log = logger.pend('ERROR', `No '_type' parameter was found for Endpoint:${endpoint.name}, OIS:${oisTitle}`);
    return [[log], { errorCode: RequestErrorCode.ResponseParametersInvalid }];
  }

  const options = buildOptions(chain, ois, securitySchemeEnvironmentConfigs, aggregatedApiCall);
  // Each API call is allowed API_CALL_TIMEOUT ms to complete, before it is retried until the
  // maximum timeout is reached.
  const adapterConfig: adapter.Config = { timeout: API_CALL_TIMEOUT };

  // If the request times out, we attempt to call the API again. Any other errors will not result in retries
  const retryableCall = retryOnTimeout(API_CALL_TOTAL_TIMEOUT, () =>
    adapter.buildAndExecuteRequest(options, adapterConfig)
  );

  const [err, res] = await go(() => retryableCall);
  if (err) {
    const log = logger.pend('ERROR', `Failed to call Endpoint:${aggregatedApiCall.endpointName}`, err);
    return [[log], { errorCode: RequestErrorCode.ApiCallFailed }];
  }

  try {
    const extracted = adapter.extractAndEncodeResponse(res?.data, responseParameters as adapter.ResponseParameters);
    return [[], { value: extracted.encodedValue }];
  } catch (e) {
    const data = JSON.stringify(res?.data || {});
    const log = logger.pend('ERROR', `Unable to find response value from ${data}. Path: ${responseParameters._path}`);
    return [[log], { errorCode: RequestErrorCode.ResponseValueNotFound }];
  }
}
