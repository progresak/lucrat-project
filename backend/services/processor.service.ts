import { Service as MoleculerService } from 'moleculer';
import { Action, Service } from 'moleculer-decorators';

interface ReadedCandle {
    timestamp: string;
    open: string;
    high: string;
    low: string;
    close: string;
    volume: string;
}

import { Processor } from '@Repositories/Processor';
import { Candle } from '@Interfaces/Candle';
import * as fs from 'fs';
import csv from 'csv-parser';
// #endregion Interface Imports
const setData = (onNewCandle: (candle: Candle) => void) => {
    fs.createReadStream('data/eurusd.csv')
        .pipe(csv({ separator: ';' }))
        .on('data', (data: ReadedCandle) => {
            const datacandle: Candle = {
                close: parseFloat(data.close.replace(',', '.')),
                high: parseFloat(data.high.replace(',', '.')),
                low: parseFloat(data.low.replace(',', '.')),
                open: parseFloat(data.open.replace(',', '.')),
                timestamp: new Date(data.timestamp).getTime(),
                volume: 0,
                // _id: '',
                // __v: 0,
                symbol: 'EURUSD',
            };
            // ctx.broadcast('producer.onNewCandle', { datacandle });
            onNewCandle(datacandle);
        })
        .on('end', () => {
            // console.log('isPinHammer', procak.counters.isPinHammer);
            // console.log('isPinStarr', procak.counters.isPinStar);
            console.log('end of reading');
        });
};

@Service({
    name: 'processor',
})
export class ProcessorService extends MoleculerService {
    private processor?: Processor = undefined;

    public async started() {
        this.processor = new Processor();
        // @ts-ignore
        this.processAlgorithm();
        // return await this.broker.call('processor.processAlgorithm');
    }
    @Action()
    public async processAlgorithm() {
        if (this.processor) {
            setData(this.processor.onNewCandle);
        }
    }
}

module.exports = ProcessorService;
