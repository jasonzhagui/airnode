
import { encode } from '@api3/airnode-abi';
import { cliPrint, getDeployedContract, readIntegrationInfo } from '../../src';

const coinLabel = 'Ethereum';
const coinId = 'ethusdt';

export const getEncodedParameters = () => {
  return encode([{ name: 'coinId', type: 'bytes32', value: coinId }]);
};

export const printResponse = async (requestId: string) => {
  const integrationInfo = readIntegrationInfo();
  const requester = await getDeployedContract(`contracts/${integrationInfo.integration}/Requester.sol`);

  cliPrint.info(`${coinLabel} price is ${(await requester.fulfilledData(requestId)) / 1e6} USD`);
};
