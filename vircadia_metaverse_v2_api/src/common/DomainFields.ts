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
import { Perm } from '../utils/Perm';
import Joi from '@hapi/joi';
import config from '../appconfig';
import { Visibility } from './sets/Visibility';
import { Restriction } from './sets/Restriction';
import { Maturity } from './sets/Maturity';
import { IsNotNullOrEmpty } from '../utils/Misc';
import { DatabaseService } from '../common/dbservice/DatabaseService';
import app from '../app';
import {
    isStringValidator,
    isBooleanValidator,
    isDateValidator,
    verifyAllSArraySetValues,
    simpleSetter,
    noOverwriteSetter,
    sArraySetter,
    isNumberValidator,
    isSArraySet,
    simpleGetter,
} from '../utils/Validators';
import { VKeyedCollection } from '../utils/vTypes';
import { dateWhenNotActive } from '../utils/Utils';
// Naming and access for the fields in a DomainEntity.
// Indexed by request_field_name.
export const DomainFields: { [key: string]: any } = {
    id: {
        entity_field: 'id',
        request_field_name: 'id',
        get_permissions: [Perm.ALL],
        set_permissions: [Perm.NONE],
        validate: isStringValidator,
        setter: simpleSetter,
        getter: simpleGetter,
    },
    name: {
        entity_field: 'name',
        request_field_name: 'name',
        get_permissions: [Perm.ALL],
        set_permissions: [Perm.DOMAIN, Perm.SPONSOR, Perm.ADMIN],
        validate: async (value: any): Promise<any> => {
            let validity: boolean;

            const schema = Joi.string()
                .max(config.metaverseServer.maxNameLength)
                .regex(/^[A-Za-z][A-Za-z0-9+\-_\.]*$/);
            const { error } = schema.validate(value);

            if (error) {
                validity = false;
                throw new Error(error.message);
            } else {
                validity = true;
            }
            return validity;
        },
        setter: noOverwriteSetter,
        getter: simpleGetter,
    },
    visiblity: {
        entity_field: 'visiblity',
        request_field_name: 'visiblity',
        get_permissions: [Perm.ALL],
        set_permissions: [Perm.DOMAIN, Perm.SPONSOR, Perm.ADMIN],
        validate: async (value: any): Promise<any> => {
            let validity: boolean;

            const schema = Joi.string();
            const { error } = schema.validate(value);

            if (!error && Visibility.KnownVisibility(value)) {
                validity = true;
            } else {
                if (!error) {
                    validity = false;
                    throw new Error(`Not accepted visibility value: ${value}`);
                }
                throw new Error(error.message);
            }
            return validity;
        },
        setter: simpleSetter,
        getter: simpleGetter,
    },
    // An alternate way of setting domain name
    world_name: {
        entity_field: 'name',
        request_field_name: 'world_name',
        get_permissions: [Perm.ALL],
        set_permissions: [Perm.DOMAIN, Perm.SPONSOR, Perm.ADMIN],
        validate: async (value: any): Promise<any> => {
            let validity: boolean;

            const schema = Joi.string()
                .min(1)
                .regex(/^[A-Za-z][A-Za-z0-9+\-_\.]*$/);
            const { error } = schema.validate(value);

            if (error) {
                validity = false;
                throw new Error(error.message);
            } else {
                validity = true;
            }
            return validity;
        },
        setter: noOverwriteSetter,
        getter: simpleGetter,
    },
    public_key: {
        entity_field: 'publicKey',
        request_field_name: 'public_key',
        get_permissions: [Perm.ALL],
        set_permissions: [Perm.DOMAIN],
        validate: isStringValidator,
        setter: simpleSetter,
        getter: simpleGetter,
    },
    sponsor_account_id: {
        entity_field: 'sponsorAccountId',
        request_field_name: 'sponsor_account_id',
        get_permissions: [Perm.ALL],
        set_permissions: [Perm.DOMAIN, Perm.SPONSOR, Perm.ADMIN],
        validate: isStringValidator,
        setter: simpleSetter,
        getter: simpleGetter,
    },
    version: {
        entity_field: 'version',
        request_field_name: 'version',
        get_permissions: [Perm.ALL],
        set_permissions: [Perm.DOMAIN],
        validate: isStringValidator,
        setter: simpleSetter,
        getter: simpleGetter,
    },
    protocol: {
        entity_field: 'protocol',
        request_field_name: 'protocol',
        get_permissions: [Perm.ALL],
        set_permissions: [Perm.DOMAIN],
        validate: isStringValidator,
        setter: simpleSetter,
        getter: simpleGetter,
    },
    network_address: {
        entity_field: 'networkAddr',
        request_field_name: 'network_address',
        get_permissions: [Perm.ALL],
        set_permissions: [Perm.DOMAIN],
        validate: isStringValidator,
        setter: simpleSetter,
        getter: simpleGetter,
    },
    network_port: {
        entity_field: 'networkPort',
        request_field_name: 'network_port',
        get_permissions: [Perm.ALL],
        set_permissions: [Perm.DOMAIN],
        validate: isStringValidator,
        setter: simpleSetter,
        getter: simpleGetter,
    },
    automatic_networking: {
        entity_field: 'networkingMode',
        request_field_name: 'automatic_networking',
        get_permissions: [Perm.ALL],
        set_permissions: [Perm.DOMAIN],
        validate: isStringValidator,
        setter: simpleSetter,
        getter: simpleGetter,
    },
    num_users: {
        entity_field: 'numUsers',
        request_field_name: 'num_users',
        get_permissions: [Perm.ALL],
        set_permissions: [Perm.DOMAIN, Perm.ADMIN],
        validate: isNumberValidator,
        setter: simpleSetter,
        getter: simpleGetter,
    },
    num_anon_users: {
        entity_field: 'anonUsers',
        request_field_name: 'num_anon_users',
        get_permissions: [Perm.ALL],
        set_permissions: [Perm.DOMAIN, Perm.ADMIN],
        validate: isNumberValidator,
        setter: simpleSetter,
        getter: simpleGetter,
    },
    restricted: {
        entity_field: 'restricted',
        request_field_name: 'restricted',
        get_permissions: [Perm.ALL],
        set_permissions: [Perm.DOMAIN, Perm.SPONSOR, Perm.ADMIN],
        validate: isBooleanValidator,
        setter: simpleSetter,
        getter: simpleGetter,
    },
    capacity: {
        entity_field: 'capacity',
        request_field_name: 'capacity',
        get_permissions: [Perm.ALL],
        set_permissions: [Perm.DOMAIN, Perm.SPONSOR, Perm.ADMIN],
        validate: isNumberValidator,
        setter: simpleSetter,
        getter: simpleGetter,
    },
    description: {
        entity_field: 'description',
        request_field_name: 'description',
        get_permissions: [Perm.ALL],
        set_permissions: [Perm.DOMAIN, Perm.SPONSOR, Perm.ADMIN],
        validate: isStringValidator,
        setter: noOverwriteSetter,
        getter: simpleGetter,
    },

    contact_info: {
        entity_field: 'contactInfo',
        request_field_name: 'contact_info',
        get_permissions: [Perm.ALL],
        set_permissions: [Perm.DOMAIN, Perm.SPONSOR, Perm.ADMIN],
        validate: isStringValidator,
        setter: noOverwriteSetter,
        getter: simpleGetter,
    },
    thumbnail: {
        entity_field: 'thumbnail',
        request_field_name: 'thumbnail',
        get_permissions: [Perm.ALL],
        set_permissions: [Perm.DOMAIN, Perm.SPONSOR, Perm.ADMIN],
        validate: isStringValidator,
        setter: noOverwriteSetter,
        getter: simpleGetter,
    },
    images: {
        entity_field: 'images',
        request_field_name: 'images',
        get_permissions: [Perm.ALL],
        set_permissions: [Perm.DOMAIN, Perm.SPONSOR, Perm.ADMIN],
        validate: isSArraySet,
        setter: sArraySetter,
        getter: simpleGetter,
    },
    maturity: {
        entity_field: 'maturity',
        request_field_name: 'maturity',
        get_permissions: [Perm.ALL],
        set_permissions: [Perm.DOMAIN, Perm.SPONSOR, Perm.ADMIN],
        validate: async (value: any) => {
            let validity: boolean;

            const schema = Joi.string();
            const { error } = schema.validate(value);

            if (!error && Maturity.KnownMaturity(value)) {
                validity = true;
            } else {
                if (!error) {
                    validity = false;
                    throw new Error(`Not accepted maturity value: ${value}`);
                }
                throw new Error(error.message);
            }
            return validity;
        },
        setter: simpleSetter,
        getter: simpleGetter,
    },
    restriction: {
        entity_field: 'restriction',
        request_field_name: 'restriction',
        get_permissions: [Perm.ALL],
        set_permissions: [Perm.DOMAIN, Perm.SPONSOR, Perm.ADMIN],
        validate: async (value: any): Promise<any> => {
            let validity: boolean;

            const schema = Joi.string();
            const { error } = schema.validate(value);

            if (!error && Restriction.KnownRestriction(value)) {
                validity = true;
            } else {
                if (!error) {
                    validity = false;
                    throw new Error(`Not accepted restriction value: ${value}`);
                }
                throw new Error(error.message);
            }
            return validity;
        },
        setter: simpleSetter,
        getter: simpleGetter,
    },
    managers: {
        entity_field: 'managers',
        request_field_name: 'managers',
        get_permissions: [Perm.ALL],
        set_permissions: [Perm.SPONSOR, Perm.ADMIN],
        validate: async (value: any): Promise<any> => {
            const dbService = new DatabaseService({}, app);
            if (
                await verifyAllSArraySetValues(value, async (name: string) => {
                    return IsNotNullOrEmpty(
                        await dbService.findData(
                            config.dbCollections.accounts,
                            { query: { username: name } }
                        )
                    );
                })
            ) {
                return true;
            }
            throw new Error('Unknown user names');
        },
        setter: sArraySetter,
        getter: simpleGetter,
    },
    tags: {
        entity_field: 'tags',
        request_field_name: 'tags',
        get_permissions: [Perm.ALL],
        set_permissions: [Perm.DOMAIN, Perm.SPONSOR, Perm.ADMIN],
        validate: isSArraySet,
        setter: sArraySetter,
        getter: simpleGetter,
    },
    // admin stuff
    addr_of_first_contact: {
        entity_field: 'iPAddrOfFirstContact',
        request_field_name: 'addr_of_first_contact',
        get_permissions: [Perm.ALL],
        set_permissions: [Perm.NONE],
        validate: isStringValidator,
        setter: simpleSetter,
        getter: simpleGetter,
    },
    when_domain_entry_created: {
        entity_field: 'whenCreated',
        request_field_name: 'when_domain_entry_created',
        get_permissions: [Perm.ALL],
        set_permissions: [Perm.NONE],
        validate: isDateValidator,
        setter: '',
        getter: async (pEntity: any, pField: any): Promise<any> => {
            if (pEntity && pEntity.hasOwnProperty(pField)) {
                const dateValue = pEntity[pField];
                return dateValue ? dateValue.toISOString() : undefined;
            }
            return undefined;
        },
    },
    active: {
        entity_field: 'active',
        request_field_name: 'active',
        get_permissions: [Perm.ALL],
        set_permissions: [Perm.NONE],
        validate: isBooleanValidator,
        setter: '',
        getter: simpleGetter,
    },
    time_of_last_heartbeat: {
        entity_field: 'timeOfLastHeartbeat',
        request_field_name: 'time_of_last_heartbeat',
        get_permissions: [Perm.ALL],
        set_permissions: [Perm.NONE],
        validate: isDateValidator,
        setter: '',
        getter: async (pEntity: any, pField: any): Promise<any> => {
            if (pEntity && pEntity.hasOwnProperty(pField)) {
                const dateValue = pEntity[pField];
                return dateValue ? dateValue.toISOString() : undefined;
            }
            return undefined;
        },
    },
    last_sender_key: {
        entity_field: 'lastSenderKey',
        request_field_name: 'last_sender_key',
        get_permissions: [Perm.ALL],
        set_permissions: [Perm.NONE],
        validate: isStringValidator,
        setter: simpleSetter,
        getter: simpleGetter,
    },
};

export function initDomains(): void {
    setInterval(async () => {
        const dbService = new DatabaseService({}, app);

        // Find domains that are not heartbeating and reset activity if not talking
        const domains = await dbService.findDataToArray(
            config.dbCollections.domains,
            {
                query: {
                    timeOfLastHeartbeat: { $lt: dateWhenNotActive() },
                    $or: [
                        { numUsers: { $gt: 0 } },
                        { anonUsers: { $gt: 0 } },
                        { active: true },
                    ],
                },
            }
        );

        for await (const aDomain of domains) {
            aDomain.numUsers = 0;
            aDomain.anonUsers = 0;
            aDomain.active = false;
            const updates: any = {
                numUsers: 0,
                anonUsers: 0,   
                active: false,
            };
            await dbService.patchData(
                config.dbCollections.domains,
                aDomain._id,
                updates
            );
        }
    }, 1000 * config.metaverseServer.domain_seconds_check_if_online);
}
