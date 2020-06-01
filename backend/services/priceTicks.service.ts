import { Context, Service as MoleculerService } from 'moleculer';
import { Action, Service } from 'moleculer-decorators';
import DbService from 'moleculer-db';
import MongooseAdapter from 'moleculer-db-adapter-mongoose';

import { PriceTicksModel, PriceTick } from 'Entities/PriceTick';
import { getMongoUrl, mongoDatabase } from '../src/configurations';
// import { PriceTick } from '@Interfaces/PriceTick';

@Service({
    name: 'tickRecords',
    mixins: [DbService],
    adapter: new MongooseAdapter(`${getMongoUrl()}${mongoDatabase}`, { useUnifiedTopology: true }),
    model: PriceTicksModel,
})
export class PriceTicksService extends MoleculerService {
    @Action()
    async insertOrUpdate(ctx: Context<PriceTick>) {
        const priceTick = ctx.params;
        try {
            PriceTicksModel.findOneAndUpdate(
                { timestamp: priceTick.timestamp },
                priceTick,
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

module.exports = PriceTicksService;
