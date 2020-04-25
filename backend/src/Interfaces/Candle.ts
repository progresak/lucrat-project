import { Document } from 'mongoose';

export interface Candle {
    low: number;
    high: number;
    open: number;
    close: number;
    volume: number;
    symbol: string;
    timestamp: number;
}
export interface DocumentCandle extends Document {}
