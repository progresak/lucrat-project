import { getResource } from './Shared';
import { History } from 'Entities/History';
// #endregion Local Imports

// #region Interface Imports
// #endregion Interface Imports

export namespace HistoryRepository {
    export const Get = async (historyName: string): Promise<History> => {
        return await getResource(History, { where: { name: historyName } });
    };
}
