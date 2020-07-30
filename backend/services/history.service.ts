import MongooseAdapter from 'moleculer-db-adapter-mongoose';
import DbService from 'moleculer-db';
import { Service as MoleculerService } from 'moleculer';
import { Event, Service } from 'moleculer-decorators';
import { TickRecord } from '@Interfaces/TickRecord';
import { getMongoUrl, mongoDatabase } from '../src/configurations';
import { HistoryModel } from 'Entities/History';
// import { FetchCandleResponse } from '@Interfaces';

@Service({
    name: 'history',
    mixins: [DbService],
    adapter: new MongooseAdapter(`${getMongoUrl()}${mongoDatabase}`),
    model: HistoryModel,
})
export class HistoryService extends MoleculerService {
    public dependencies = ['candles', 'producer'];

    public async started() {
        // fetch what history I have
        // call for rest of the history
        // save rest of the history to DB
        // await this.broker.call('candles.insertOrUpdate', getExampleCandle());
        // this.broker.call('candles.find').then(console.log);
        // await ProducerHelper.startFetching(new Context(this.broker, {}));
        // return await this.broker.call('producer.startFetching');
    }

    // @Action()
    // public fetchLastSymbolData(ctx: Context<{ symbol: string }>): Promise<number | null> {
    //     const { symbol } = ctx.params;
    //
    //     const candlesData = this.broker.call<FetchCandleResponse, { symbol: string }>(
    //         'producer.fetchCandles',
    //         { symbol },
    //     );
    //
    //     if (candlesData) {
    //         const { digits, lastTimestamp } = candlesData;
    //         const updatedHistory = await HistoryModel.updateOne(
    //             { symbol },
    //             { digits, lastTimestamp, symbol },
    //         ).exec();
    //         console.log({ updatedHistory });
    //         return updatedHistory.lastTimestamp;
    //     }
    //
    //     return null;
    // }

    @Event()
    async 'producer.onNewPrice'(payload: { tickRecord: TickRecord }) {
        const { tickRecord } = payload;
        console.log(payload);
        try {
            await this.broker.call('tickRecords.insertOrUpdate', tickRecord);
        } catch (e) {
            console.error(e);
        }
    }
}

module.exports = HistoryService;
