import { Context, Service as MoleculerService } from 'moleculer';
import { Action, Method, Service } from 'moleculer-decorators';
import Logger4 from 'logger4';
import XAPI, { STREAMING_CANDLE_RECORD } from 'xapi-node';
import path from 'path';

@Service({
    name: 'producer',
})
export class ProducerService extends MoleculerService {
    private symbol = 'EURUSD';
    // @ts-ignore
    private connection: XAPI;

    public async started() {
        const config = {
            accountId: '10250714',
            password: 'iU#4pAQ{XRp3uZe98Jr(DCQfke',
            type: 'demo',
        };
        const logger = new Logger4({
            path: path.join(process.cwd(), 'logs/xtb'),
            directorySizeLimitMB: 3000,
        });

        this.connection = new XAPI({ ...config, logger, host: 'ws.xtb.com' });
        this.connection.connect();
    }

    @Action({})
    public async startFetching(
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        ctx: Context,
    ): Promise<{ started: boolean }> {
        console.log('startFetching called');
        const status = await this.startPriceTicking(ctx);
        const statusCandle = await this.startCandleFetching(ctx);
        return { started: status && statusCandle };
    }

    @Method
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

    @Method
    public async startCandleFetching(ctx: Context): Promise<boolean> {
        this.connection.onReady(() => {
            this.connection.Stream.listen.getCandles((candle: STREAMING_CANDLE_RECORD) => {
                // console.log({ candle });
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
