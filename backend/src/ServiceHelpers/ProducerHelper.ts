// #region Global Imports
import { Context } from 'moleculer';
// #endregion Global Imports

// #region Interface Imports
import { IProducer } from '@Interfaces';
// #endregion Interface Imports

export module ProducerHelper {
	const prefix: string = 'producer';

	export const startFetching = async (ctx: Context, params?: any): Promise<any> => await ctx.call(`${prefix}.startFetching`, params);
}
