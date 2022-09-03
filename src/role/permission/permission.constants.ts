// key = permission name, value = permission level
// level 0: unauthorized user
// level 1: authorized user
// level 2: good user, saff
// level 3: mod, saff
// level 4: admin, mod
class PermissionConfig {
    // artical
    ARTICAL_CREATE = 1;
    ARTICAL_DELETE_OTHER = 3;
    ARTICAL_CREATE_COMMENT = 1;
    ARTICAL_CLAP = 0; // everyone can clap
    ARTICAL_REACT = 1;

    // permission
    PERMISSION_DISABLE = 3;

    // USER
    USER_VIEW_OTHER_EMAIL = 2;
    USER_CHANGE_USERNAME = 1;
    USER_ROLE_ADD = 3;
    USER_ROLE_DISABLE = 3;
    USER_ROLE_REMOVE = 3;
}

// <don't care>---------------------------------------------------------------------

export const Permission: { [key in keyof PermissionConfig]?: number } = {};
export const PermissionLevel: { [key in keyof PermissionConfig]?: number } = {};

import * as fs from 'fs';
import { join } from 'path';

function syncJsonFile() {
    const jsonPath = join(process.cwd(), '/src/role/permission/permission.json');
    const rawText = fs.readFileSync(jsonPath);
    // eslint-disable-next-line prefer-const
    let { permissions, count } = JSON.parse(rawText.toString());
    const permissionConfig = new PermissionConfig();
    const temp: any = {};

    Object.keys(permissionConfig).forEach((name) => {
        if (!isNaN(name as any)) return;
        if (name in permissions) {
            Permission[name] = permissions[name]._id;
            PermissionLevel[name] = permissions[name].level;
            temp[name] = permissions[name];
        } else {
            count++;
            Permission[name] = count;
            PermissionLevel[name] = permissionConfig[name];
            temp[name] = { _id: count, level: permissionConfig[name] };
        }
    });

    fs.writeFileSync(jsonPath, JSON.stringify({ permissions: temp, count }, null, 4));
}
syncJsonFile();

// --------------------------------------------------------------------------------

export const LowLevelPermissions: number[] = Object.keys(PermissionLevel)
    .filter((name) => PermissionLevel[name] <= 1)
    .map((name) => Permission[name]);
