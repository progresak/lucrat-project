// #endregion Local Imports
import { History, Weapon } from 'entities';
// #endregion Local Imports

// #region Interface Imports
import { DamageMetaOutDto } from '@Interfaces';
// #endregion Interface Imports

export namespace CalculateMeta {
    export const Damage = async (weapon: Weapon, history: History): Promise<DamageMetaOutDto> => {
        const { damage: weaponDamage } = weapon;
        const { shield } = history;

        const damage = Math.floor(Math.random() * weaponDamage);

        const remainingShield = shield - damage;

        return { damage, remainingShield };
    };
}
