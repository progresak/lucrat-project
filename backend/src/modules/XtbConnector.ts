import Logger4 from 'logger4';
import path from 'path';
import XAPI, { CMD_FIELD, TYPE_FIELD } from 'xapi-node';
import { TradeStatus } from 'xapi-node/build/interface/Interface';

const config = {
    accountId: '10250714',
    password: 'iU#4pAQ{XRp3uZe98Jr(DCQfke',
    type: 'demo',
};

// @ts-ignore
const logger = new Logger4({
    path: path.join(process.cwd(), 'logs/xtb'),
    directorySizeLimitMB: 3000,
});

class XtbConnector {
    private connection: XAPI;

    constructor() {
        this.connection = new XAPI({ ...config, logger, host: 'ws.xtb.com' });
        this.connection.connect();
    }
    getConnection = () => this.connection;

    openOrder = async ({
        symbol = 'EURUSD',
        buy = true,
        sl = 0,
        tp = 10,
    }): Promise<TradeStatus | undefined> => {
        try {
            return await this.connection.Socket.send.tradeTransaction({
                cmd: buy ? CMD_FIELD.BUY : CMD_FIELD.SELL,
                customComment: null,
                expiration: this.connection.serverTime + 1000000,
                offset: 0,
                order: 0,
                price: 1,
                sl,
                symbol,
                tp,
                type: TYPE_FIELD.OPEN,
                volume: 0.01,
            });
        } catch (e) {
            console.log('tradeTransaction failed', e);
            return;
        }
    };
    closeOrder = () => {};
    fetchOrders = () => {};
}

export default XtbConnector;
