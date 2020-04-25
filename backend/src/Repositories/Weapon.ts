// #region Global Imports
import { getManager } from 'typeorm';
// #endregion Global Imports

// #region Local Imports
import { Weapon } from '@Entities/Weapon';
import { DecreaseAmmoOutDto } from '@Interfaces';
import { getResource } from './Shared';
// #endregion Local Imports

// #region Interfaces Imports
// #endregion Interfaces Imports

export namespace WeaponRepository {
    export const Get = async (weaponName: string): Promise<Weapon> => {
        return await getResource(Weapon, { where: { name: weaponName } });
    };

    export const DecreaseAmmo = async (weaponName: string): Promise<DecreaseAmmoOutDto> => {
        const weapon = await getResource(Weapon, { where: { name: weaponName } });

        weapon.ammo -= 1;

        getManager().save(weapon);

        return { remainingAmmo: weapon.ammo };
    };
}
