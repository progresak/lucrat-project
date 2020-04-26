import { Candle } from '@Interfaces/Candle';

export enum PinType {
    ShootingStar = 'ShootingStar',
    Hammer = 'Hammer',
}

export const isPinBar = (
    candle: Candle,
    longerNTimes = 3,
    smallerShadowBodyRation = 3,
): PinType | false => {
    const maxPrice = Math.max(candle.open, candle.close);
    const minPrice = Math.min(candle.open, candle.close);
    const bodySize = maxPrice - minPrice;

    const topShadowSize = candle.high !== maxPrice ? candle.high - maxPrice : 0; // 12
    const bottomShadowSize = candle.low !== minPrice ? minPrice - candle.low : 0; // 2

    const biggerShadow = Math.max(topShadowSize, bottomShadowSize);
    const smallerShadow = Math.min(topShadowSize, bottomShadowSize);

    const increasedBodySize = bodySize * longerNTimes;

    if (
        increasedBodySize === 0 || // banujeme svíčky bez těla, is it worth?
        smallerShadow / bodySize > longerNTimes / smallerShadowBodyRation ||
        biggerShadow <= increasedBodySize
    ) {
        return false;
    }

    return topShadowSize > smallerShadow ? PinType.ShootingStar : PinType.Hammer;
};

export enum EngulfingType {
    Long = 'Long',
    Short = 'Short',
}
// strong = pocet pohlcenych svicek
export const isEngulfing = (candles: Candle[], strong: number = 1): EngulfingType | false => {
    const lastCandle = candles[candles.length - 1];
    const lastOpen = lastCandle.open;
    const lastClose = lastCandle.close;

    const lastHigh = lastOpen >= lastClose ? lastOpen : lastClose;
    const lastLow = lastClose >= lastOpen ? lastOpen : lastClose;

    const type = lastClose >= lastOpen ? EngulfingType.Long : EngulfingType.Short;

    const backHighs = [];
    const backLows = [];

    for (let i = 0; i < strong; i++) {
        const backCandle = candles[candles.length - 2 - i];
        if (backCandle) {
            backHighs.push(backCandle.high);
            backLows.push(backCandle.low);
        }
    }
    const backHigh = Math.max(...backHighs);
    const backLow = Math.min(...backLows);

    if (backHigh < lastHigh && backLow < lastLow) {
        // console.log(type, { candles });
        return type;
    }

    return false;
};
