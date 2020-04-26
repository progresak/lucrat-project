import { Service as MoleculerService } from 'moleculer';
import { Event, Service } from 'moleculer-decorators';
import { TickRecord } from '@Interfaces/TickRecord';
import { CandlesInput } from 'Resolvers/types/candlesInput';
import { getExampleCandle } from '../src/helpers';

@Service({
    name: 'history',
})
export class HistoryService extends MoleculerService {
    public dependencies = ['candles'];

    public async started() {
        // fetch what history I have
        // call for rest of the history
        // save rest of the history to DB
        await this.broker.call('candles.insertOrUpdate', getExampleCandle());

        // this.broker.call('candles.find').then(console.log);
        // return await this.broker.call('producer.startFetching');
    }

    @Event()
    async 'producer.onNewPrice'(payload: { tickRecord: TickRecord }) {
        const { tickRecord } = payload;
        //validatin something, nmutation etc
        this.broker.call('tickRecords.create', tickRecord).then(console.log);
    }

    @Event()
    async 'producer.onNewCandle'(payload: { candle: CandlesInput }) {
        const { candle } = payload;
        //validatin something, nmutation etc
        this.broker.call('candles.create', candle).then(console.log);
    }
}

module.exports = HistoryService;
