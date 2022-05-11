//   Copyright 2020 Vircadia Contributors
//
//   Licensed under the Apache License, Version 2.0 (the "License");
//   you may not use this file except in compliance with the License.
//   You may obtain a copy of the License at
//
//       http://www.apache.org/licenses/LICENSE-2.0
//
//   Unless required by applicable law or agreed to in writing, software
//   distributed under the License is distributed on an "AS IS" BASIS,
//   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
//   See the License for the specific language governing permissions and
//   limitations under the License.

'use strict';

import { BadRequest } from '@feathersjs/errors';
import {
    animals,
    colors,
    Config as UniqueNamesConfig,
    uniqueNamesGenerator,
} from 'unique-names-generator';
import config from '../../../appconfig';
import { DatabaseService } from '../../../common/dbservice/DatabaseService';
import { DatabaseServiceOptions } from '../../../common/dbservice/DatabaseServiceOptions';
import { DomainInterface } from '../../../common/interfaces/DomainInterface';
import { PlaceInterface } from '../../../common/interfaces/PlaceInterface';
import { buildDomainInfo } from '../../../common/responsebuilder/domainsBuilder';
import { buildPlaceInfo } from '../../../common/responsebuilder/placesBuilder';
import { Maturity } from '../../../common/sets/Maturity';
import { Application } from '../../../declarations';
import {
    genRandomString,
    GenUUID,
    IsNotNullOrEmpty,
} from '../../../utils/Misc';
import { Tokens, TokenScope } from '../../../utils/Tokens';
import { extractLoggedInUserFromParams } from '../../auth/auth.utils';
/**
Domain temporary entry
 * @noInheritDoc
 */
export class DomainTemp extends DatabaseService {
    constructor(options: Partial<DatabaseServiceOptions>, app: Application) {
        super(options, app);
    }

    /**
     * POST domain temporary entry
     *
     * @remarks
     * This method is to domain temporary entry
     * - Request Type - POST
     * - End Point - API_URL/domains/temporary
     *
     * @requires -authentication
     * @body - {}
     * @returns - {status: 'success', data:{...}} or { status: 'failure', message: 'message'}
     *
     */

    async create(data: any, params?: any): Promise<any> {
        const loginUser = extractLoggedInUserFromParams(params);
        const vSenderKey = params?.address;

        if (config.metaverseServer.allow_temp_domain_creation) {
            const newDomain = {} as DomainInterface;
            let key: any;
            if (IsNotNullOrEmpty(vSenderKey)) {
                key = `${vSenderKey.address}:${vSenderKey.port}`;
            }

            const customConfig: UniqueNamesConfig = {
                // dictionaries: [ adjectives, colors, animals ],
                dictionaries: [colors, animals],
                separator: '-',
                length: 2,
            };

            const generatedPlacename: string =
                uniqueNamesGenerator(customConfig);
            const generatedAPIkey: string = GenUUID();
            newDomain.id = GenUUID();
            newDomain.name = generatedPlacename;
            newDomain.apiKey = generatedAPIkey;
            newDomain.whenCreated = new Date();
            newDomain.maturity = Maturity.UNRATED;
            newDomain.iPAddrOfFirstContact = key;

            if (loginUser) {
                newDomain.sponsorAccountId = loginUser.id;
            }

            const placeInfo = {} as PlaceInterface;

            let newPlacename: string = newDomain.name;

            if (IsNotNullOrEmpty(placeInfo)) {
                newPlacename = newPlacename + '-' + genRandomString(5);
            }

            placeInfo.id = GenUUID();
            placeInfo.name = newPlacename;
            placeInfo.whenCreated = new Date();
            placeInfo.path = '/0,0,0/0,0,0,1';
            placeInfo.currentAttendance = 0;
            placeInfo.iPAddrOfFirstContact = key;
            placeInfo.domainId = newDomain.id;
            placeInfo.description = 'A place in ' + newDomain.name;
            placeInfo.maturity = newDomain.maturity;

            const APItoken = await Tokens.createToken(
                loginUser.id,
                [TokenScope.PLACE],
                -1
            );

            await this.createData(config.dbCollections.tokens, APItoken);

            placeInfo.currentAPIKeyTokenId = APItoken.id;

            const placeResult = await this.createData(
                config.dbCollections.places,
                placeInfo
            );

            const domainResult = await this.createData(
                config.dbCollections.domains,
                newDomain
            );

            return Promise.resolve({
                domain: await buildDomainInfo(domainResult),
                place: await buildPlaceInfo(this, placeResult, domainResult),
            });
        } else {
            throw new BadRequest('domain temporary names not available');
        }
    }
}

