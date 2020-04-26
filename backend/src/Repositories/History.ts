// #region Global Imports
import { getManager } from 'typeorm';
// #endregion Global Imports

// #region Local Imports
import { History } from 'entities/History';
import { DecreaseShieldOutDto } from '@Interfaces';
import { getResource } from './Shared';
// #endregion Local Imports

// #region Interface Imports
// #endregion Interface Imports

export namespace HistoryRepository {
    export const Get = async (historyName: string): Promise<History> => {
        return await getResource(History, { where: { name: historyName } });
    };

    export const DecreaseShield = async (
        historyName: string,
        remainingShield: number,
    ): Promise<DecreaseShieldOutDto> => {
        const history = await getResource(History, { where: { name: historyName } });

        history.shield = remainingShield;

        await getManager().save(history);

        return { remainingShield: history.shield };
    };
}
