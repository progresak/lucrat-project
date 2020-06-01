export * from '@Interfaces/Repositories/History';
export * from '@Interfaces/Repositories/Weapon';
export * from '@Interfaces/Services/History';
export * from '@Interfaces/Services/Producer';

export interface FetchCandleResponse {
    lastTimestamp: number;
    newItemsFetchedCount: number;
}
