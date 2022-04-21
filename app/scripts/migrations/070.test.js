import { TEST_CHAINS } from '../../../shared/constants/network';
import migration70 from './070';

describe('migration #70', () => {
  it('should update the version metadata', async () => {
    const oldStorage = {
      meta: {
        version: 69,
      },
      data: {},
    };

    const newStorage = await migration70.migrate(oldStorage);
    expect(newStorage.meta).toStrictEqual({
      version: 70,
    });
  });

  it('should update the advancedGasFee object', async () => {
    const oldStorage = {
      meta: {},
      data: {
        PreferencesController: {
          advancedGasFee: {
            maxBaseFee: 10,
            priorityFee: 10,
          },
        },
        NetworkController: {
          provider: {
            chainId: TEST_CHAINS[0],
          },
        },
      },
    };

    const newStorage = await migration70.migrate(oldStorage);
    const newAdvancedGasFee = {
      '0x3': {
        maxBaseFee: 10,
        priorityFee: 10,
      },
    };
    expect(newStorage.data.PreferencesController.advancedGasFee).toStrictEqual(
      newAdvancedGasFee,
    );
  });
});
