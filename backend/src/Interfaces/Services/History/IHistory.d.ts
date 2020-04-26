export namespace IHistory {
    export interface DefendInDto {
        historyName: string;
        weaponName: string;
    }

    export interface DefendOutDto {
        damage: number;
        historyMessage: string;
    }
}
