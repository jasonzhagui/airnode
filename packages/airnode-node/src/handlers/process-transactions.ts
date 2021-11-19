import * as evm from '../evm/handlers';
import { EVMProviderState, ProviderState } from '../types';

export function processTransactions(state: ProviderState<EVMProviderState>, sponsorAddress: string) {
  if (state.settings.chainType === 'evm') {
    return evm.processTransactions(state, sponsorAddress);
  }

  throw new Error(`Unknown chain type: ${state.settings.chainType}`);
}
