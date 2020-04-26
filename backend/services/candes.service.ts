import { compose, map, sum } from 'lodash/fp';
import { Context, Service as MoleculerService } from 'moleculer';
import { Action, Service } from 'moleculer-decorators';
import DbService from 'moleculer-db';
import MongooseAdapter from 'moleculer-db-adapter-mongoose';

import { CandlesModel, Candle } from 'Entities/Candle';
import { getMongoUrl, mongoDatabase } from '../src/configurations';
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
    async findAll() {
        try {
            const candles = await CandlesModel.find({}).exec();
            return candles;
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
    async insertOrUpdate(ctx: Context<Candle>) {
        const candle = ctx.params;
        try {
            CandlesModel.findOneAndUpdate(
                { timestamp: candle.timestamp },
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

// const createNewCandle = async (candle: Candle) => {
//     const Candlicka = new CandleModel(candle);
//     console.log("saving candlicka");
//     Candlicka.save((err) => {
//         if (err && err.code === 11000) {
//             CandleModel.findOneAndUpdate(
//                 { timestamp: candle.timestamp },
//                 candle,
//                 { upsert: true },
//                 (error) => {
//                     if (error) {
//                         console.log('insert error', error);
//                     }
//                 }
//             );
//         }
//     });
// };
