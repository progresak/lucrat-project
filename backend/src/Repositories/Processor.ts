import { isPinBar, PinType, isEngulfing } from './signals';
import { Candle } from '@Interfaces/Candle';

// const csv = require('csv-parser');
// const fs = require('fs');

const getAvgFor = (candles: Candle[], lastMin: number) => {
    if (!candles) {
        return undefined;
    }
    // process.exit(1);
    const lastCandleTimestamp = candles[candles.length - 1].timestamp;
    const possibleTimestamp = lastCandleTimestamp - lastMin * 60 * 1000;

    const validElements = candles.filter(({ timestamp }) => {
        return timestamp >= possibleTimestamp;
    });

    return validElements.reduce((total, { open }) => total + open, 0) / validElements.length;
};

export class Processor {
    // history candles .. 1 per 1m/5min etc
    // clean away data we don't use anymore
    history: Candle[] = [];

    // tick records for last 10min lets say
    // pro aktuální pozorování trhu

    public counters = { isPinHammer: 0, isPinStar: 0 };

    public openOrders: { orderId: number; val: number }[] = [];

    public profits: number[] = [];

    priceTicksHistory: {}[] = [];

    last4secAvg = () => getAvgFor(this.history, 4);

    last8secAvg = () => getAvgFor(this.history, 8);
    // fetchOpenOrders in constructor
    // constructor() {}

    onNewCandle = (candle: Candle) => {
        // console.log(candle);
        this.calculate(candle);
        this.doAction();
    };

    private calculate = (candle: Candle) => {
        this.history.push(candle);
    };

    private addProfit = (profit: number) => {
        this.profits.push(profit);
        return this.profits.reduce((x, y) => x + y, 0);
    };

    private placeOrder = (val: number) => {
        const orderId = Math.round(Math.random() * 1000);

        this.openOrders.push({ orderId, val });
        console.log('order placed', { orderId, val });
        return orderId;
    };

    private closeOrder = (orderId: number): number | undefined => {
        // const order = this.openOrders[0]; // todo by find
        // todo calculate profit on API
        console.log(`Order #${orderId} was closed`);

        const disabledOrder = this.openOrders.pop();

        if (disabledOrder) {
            disabledOrder.val;
        }
        return undefined;
    };

    private hasExistingOrder = () => {
        return !!this.openOrders.length;
    };

    private getActualPrice = () => this.history[this.history.length - 1].open;

    private getActualCandle = () => this.history[this.history.length - 1];

    private getLastCandles = (numbers: number): Candle[] => this.history.slice(-numbers);

    private doAction = () => {
        const last4min = this.last4secAvg();
        const isH = isPinBar(this.getActualCandle());
        if (isH && isH === PinType.Hammer) {
            // eslint-disable-next-line no-plusplus
            this.counters.isPinHammer++;
        }
        if (isH && isH === PinType.ShootingStar) {
            // eslint-disable-next-line no-plusplus
            this.counters.isPinStar++;
        }
        isEngulfing(this.getLastCandles(3));
        if (last4min && this.getActualPrice() < last4min && !this.hasExistingOrder()) {
            this.placeOrder(this.getActualPrice());
        }

        // TAKE PROFIT

        if (this.openOrders[0] && this.openOrders[0].val < this.getActualPrice()) {
            const openPrice = this.closeOrder(this.openOrders[0].orderId);
            if (openPrice) {
                const diff = this.getActualPrice() - openPrice;

                if (diff > 0) {
                    const profit = this.addProfit(diff * 10000 * 2.47);
                    console.log(`Profit: ${profit} Kč`);
                }
            } else {
                console.log('OpenPrice was missing');
            }
        } // todo [0]
    };
}
