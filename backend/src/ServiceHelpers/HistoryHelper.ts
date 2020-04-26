// #region Global Imports
import { Context } from 'moleculer';
// #endregion Global Imports

// #region Interface Imports
import { IHistory } from '@Interfaces';
// #endregion Interface Imports

export namespace HistoryHelper {
    const prefix: string = 'history';

    export const Defend = async (
        ctx: Context,
        params: IHistory.DefendInDto,
    ): Promise<IHistory.DefendOutDto> => await ctx.call(`${prefix}.Defend`, params);
}
