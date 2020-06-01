import { compose, map, sum } from 'lodash/fp';
import { Context, Service as MoleculerService } from 'moleculer';
import { Action, Event, Service } from 'moleculer-decorators';
import DbService from 'moleculer-db';
import MongooseAdapter from 'moleculer-db-adapter-mongoose';

import { CandlesModel, Candle } from 'Entities/Candle';
import { getMongoUrl, mongoDatabase } from '../src/configurations';
import { CandlesInput } from 'Resolvers/types/candlesInput';
// import { Candle } from '@Interfaces/Candle';

@Service({
    name: 'candles',
    mixins: [DbService],
    adapter: new MongooseAdapter(`${getMongoUrl()}${mongoDatabase}`),
    model: CandlesModel,
})
export class CandlesService extends MoleculerService {
    @Action()
    async getCalculatedAskPrice() {
        const candles = await CandlesModel.find({}).exec();
        return compose(sum, map('timestamp'))(candles);
    }

    @Action()
    async findAll(ctx: Context<{ symbol: string; lastMinutes?: number }>) {
        // TODO: časový rámec svíček, vypočítat 1m/5m/3m etc..
        const { symbol, lastMinutes } = ctx.params; // TODO it is count for now
        try {
            return await CandlesModel.find({ symbol })
                .where('timestamp')
                .limit(lastMinutes || 0)
                .exec();
        } catch (e) {
            console.log(e);
            return [];
        }
    }

    @Action()
    async getById(ctx: Context<string>): Promise<Candle | null> {
        try {
            return await CandlesModel.findById(ctx.params).exec();
        } catch (e) {
            return null;
        }
    }

    @Action()
    async getLastTimestamp(ctx: Context<{ symbol: string }>): Promise<number | undefined> {
        const { symbol } = ctx.params;
        try {
            const candle = await CandlesModel.findOne({ symbol })
                .sort('-timestamp')
                .exec();
            return candle?.timestamp;
        } catch (e) {
            return undefined;
        }
    }

    @Event()
    async 'producer.onNewCandle'(payload: { candle: CandlesInput; update?: boolean }) {
        try {
            const { candle, update } = payload;
            if (update) {
                return await this.broker.call('candles.insertOrUpdate', candle);
            }
            return await this.broker.call('candles.create', candle);
        } catch (e) {
            if (e.code !== 11000) {
                throw e;
            }
        }
    }

    @Action()
    async insertOrUpdate(ctx: Context<Candle>) {
        const candle = ctx.params;
        try {
            CandlesModel.findOneAndUpdate(
                { timestamp: candle.timestamp, symbol: candle.symbol },
                candle,
                { upsert: true },
                error => {
                    if (error) {
                        console.log('insert error', error);
                    }
                },
            );
        } catch (error) {}
    }
}

module.exports = CandlesService;
