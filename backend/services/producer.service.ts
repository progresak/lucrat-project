import { Context, Service as MoleculerService } from 'moleculer';
import { compose, max, map } from 'lodash/fp';
import { Action, Service } from 'moleculer-decorators';
import XAPI, { PERIOD_FIELD, STREAMING_CANDLE_RECORD } from 'xapi-node';
import { Candle } from 'Entities/Candle';
import { FetchCandleResponse } from '@Interfaces';
import XtbConnector from 'src/modules/XtbConnector';

const getCandleFromArrCandle = (arrCandle: number[], symbol: string): Omit<Candle, 'id'> => {
    return {
        timestamp: arrCandle[0],
        open: arrCandle[1],
        close: arrCandle[2],
        low: arrCandle[3],
        high: arrCandle[4],
        symbol,
        volume: arrCandle[5],
    };
};

const getMaxTimestampFromCandlesArray = compose(
    max,
    map((candleArr: number[]) => {
        const [timestamp] = candleArr;
        return timestamp;
    }),
);

@Service({
    name: 'producer',
})
export class ProducerService extends MoleculerService {
    private symbol = 'EURUSD';
    // @ts-ignore
    private connection: XAPI;

    public async started() {
        const Connector = new XtbConnector();
        this.connection = Connector.getConnection();
    }

    @Action()
    public async startPriceTicking(ctx: Context): Promise<boolean> {
        this.connection.onReady(() => {
            this.connection.Stream.listen.getTickPrices(tickRecord => {
                ctx.broadcast('producer.onNewPrice', { tickRecord });
            });

            this.connection.Stream.subscribe
                .getTickPrices(this.symbol)
                .catch(x => console.log(x, ' Failed'));
        });
        return true;
    }

    @Action()
    public async initFetchCandles(
        ctx: Context<{ symbol: string }>,
    ): Promise<FetchCandleResponse | null> {
        const { symbol } = ctx.params;
        try {
            const lastTimestamp = await ctx.broker.call<number, { symbol: string }>(
                'candles.getLastTimestamp',
                { symbol },
            );
            console.log(lastTimestamp);
            const { candles } = await this.connection.getPriceHistory({
                symbol,
                period: PERIOD_FIELD.PERIOD_H1,
                startUTC: lastTimestamp,
            });

            candles.forEach((arrCandle: number[]) => {
                const candle = getCandleFromArrCandle(arrCandle, symbol);
                ctx.broadcast('producer.onNewCandle', { candle, update: candles.length === 1 });
            });

            return {
                lastTimestamp: getMaxTimestampFromCandlesArray(candles),
                newItemsFetchedCount: candles.length - 1,
            };
        } catch (e) {
            console.error(e);
            return null;
        }
    }

    @Action()
    public async startCandleFetching(ctx: Context): Promise<boolean> {
        this.connection.onReady(() => {
            this.connection.Stream.listen.getCandles((candle: STREAMING_CANDLE_RECORD) => {
                ctx.broadcast('producer.onNewCandle', { candle });
            });
            this.connection.Stream.subscribe
                .getCandles(this.symbol)
                .catch((err: Error) => console.log(err, ' Failed'));
        });
        return true;
    }
}

module.exports = ProducerService;
