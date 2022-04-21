import { cloneDeep } from 'lodash';

const version = 70;

/**
 * Adds the `chainId` property to the advancedGasFee.
 */
export default {
  version,
  async migrate(originalVersionedData) {
    const versionedData = cloneDeep(originalVersionedData);
    versionedData.meta.version = version;
    const state = versionedData.data;
    const newState = transformState(state);
    versionedData.data = newState;
    return versionedData;
  },
};

function transformState(state) {
  const currentMetaMaskState = state.metamask;
  const currentAdvancedGasFee = currentMetaMaskState.advancedGasFee;
  const currentChainId = currentMetaMaskState.provider.chainId;

  const newMetaMaskState = {
    ...currentMetaMaskState,
    advancedGasFee: {
      [currentChainId]: currentAdvancedGasFee,
    },
  };

  return newMetaMaskState;
}
