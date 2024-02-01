import { messages } from './../../utils/messages';
import { NotAuthenticated } from '@feathersjs/errors';
import { extractLoggedInUserFromParams } from './../auth/auth.utils';
import { DatabaseServiceOptions } from './../../common/dbservice/DatabaseServiceOptions';
import { DatabaseService } from './../../common/dbservice/DatabaseService';

import { Application } from '../../declarations';
import { Params } from '@feathersjs/feathers';
import { IsNotNullOrEmpty } from '../../utils/Misc';
import config from '../../appconfig';
import { buildSimpleResponse } from '../../common/responsebuilder/responseBuilder';
import { getGameUserLevel } from '../../utils/Utils';

export class ResetUser extends DatabaseService {
    //eslint-disable-next-line @typescript-eslint/no-unused-vars
    constructor(options: Partial<DatabaseServiceOptions>, app: Application) {
        super(options, app);
    }

    async create(data: any, params?: Params): Promise<any> {
        const loginUser = extractLoggedInUserFromParams(params);
        if (IsNotNullOrEmpty(loginUser) && config.server.isDevelopmentMode) {
            await this.deleteMultipleData(config.dbCollections.quest, {
                query: { ownerId: loginUser.id },
            });
            await this.deleteMultipleData(config.dbCollections.itemHandler, {
                query: { ownerId: loginUser.id },
            });
            await this.deleteMultipleData(config.dbCollections.inventory, {
                query: { userId: loginUser.id },
            });
            // const goo = 0;
            const xp = 0;
            const level = getGameUserLevel(xp);
            await this.patchData(config.dbCollections.accounts, loginUser.id, {
                // goo: goo,
                xp: xp,
                level: level,
            });

            return Promise.resolve(buildSimpleResponse({}));
        } else {
            throw new NotAuthenticated(messages.common_messages_unauthorized);
        }
    }
}

