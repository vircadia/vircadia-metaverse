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
import { Maturity } from './sets/Maturity';
import { IsNotNullOrEmpty, IsNullOrEmpty } from '../utils/Misc';
import { DatabaseService } from '../common/dbservice/DatabaseService';
import { checkAccessToEntity } from '../utils/Permissions';
import app from '../app';
import { isValidObject } from '../utils/Utils';
import {
    isStringValidator,
    isBooleanValidator,
    isDateValidator,
    isPathValidator,
    verifyAllSArraySetValues,
    simpleSetter,
    sArraySetter,
    isNumberValidator,
    isSArraySet,
    simpleGetter,
} from '../utils/Validators';

// Naming and access for the fields in a PlaceEntity.
// Indexed by request_field_name.
export const PlaceFields: { [key: string]: any } = {
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
        set_permissions: [
            Perm.DOMAIN,
            Perm.DOMAINACCESS,
            Perm.MANAGER,
            Perm.ADMIN,
        ],
        validate: async (
            value: string,
            loginUser?: any,
            entryDataArray?: any
        ) => {
            let validity: boolean;
            const dbService = new DatabaseService({}, app);

            const schema = Joi.string()
                .max(config.metaverseServer.maxNameLength)
                .regex(/^[A-Za-z][A-Za-z0-9+\-_\.]*$/);
            const { error } = schema.validate(value);

            if (!error) {
                const maybePlace = await dbService.findDataToArray(
                    config.dbCollections.places,
                    { query: { name: value } }
                );
                if (
                    IsNullOrEmpty(maybePlace) ||
                    entryDataArray.id === maybePlace[0].id
                ) {
                    validity = true;
                } else {
                    validity = false;
                    throw new Error('place name already exists');
                }
            } else {
                validity = false;
                throw new Error(error.message);
            }
            return validity;
        },
        setter: simpleSetter,
        getter: simpleGetter,
    },
    displayName: {
        entity_field: 'displayName',
        request_field_name: 'displayName',
        get_permissions: [Perm.ALL],
        set_permissions: [Perm.DOMAINACCESS, Perm.MANAGER, Perm.ADMIN],
        validate: isStringValidator,
        setter: simpleSetter,
        getter: simpleGetter,
    },
    description: {
        entity_field: 'description',
        request_field_name: 'description',
        get_permissions: [Perm.ALL],
        set_permissions: [Perm.DOMAINACCESS, Perm.MANAGER, Perm.ADMIN],
        validate: isStringValidator,
        setter: simpleSetter,
        getter: simpleGetter,
    },
    visibility: {
        entity_field: 'visibility',
        request_field_name: 'visibility',
        get_permissions: [Perm.ALL],
        set_permissions: [Perm.DOMAINACCESS, Perm.MANAGER, Perm.ADMIN],
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
    domainId: {
        entity_field: 'domainId',
        request_field_name: 'domainId',
        get_permissions: [Perm.ALL],
        set_permissions: [Perm.DOMAINACCESS, Perm.ADMIN],
        validate: async (pVal: any, loginUser?: any): Promise<any> => {
            // This is setting a place to a new domainId. Make sure the domain exists
            //         and requestor has access to that domain.
            let validity: any;
            const dbService = new DatabaseService({}, app);

            const schema = Joi.string();
            const { error } = schema.validate(pVal);

            if (!error) {
                const maybeDomain = await dbService.findDataToArray(
                    config.dbCollections.domains,
                    { query: { id: pVal } }
                );

                if (IsNotNullOrEmpty(maybeDomain[0])) {
                    if (IsNotNullOrEmpty(loginUser)) {
                        if (
                            await checkAccessToEntity(
                                [Perm.SPONSOR, Perm.ADMIN],
                                loginUser,
                                maybeDomain[0]
                            )
                        ) {
                            validity = true;
                        } else {
                            validity = false;
                            throw new Error(
                                'requestor does not have access to domain'
                            );
                        }
                    }
                } else {
                    validity = false;
                    throw new Error('domain does not exist');
                }
            }
            return validity;
        },
        setter: simpleSetter,
        getter: simpleGetter,
    },
    address: {
        // The network address of a location in the domain
        entity_field: 'path',
        request_field_name: 'address',
        get_permissions: [Perm.ALL],
        set_permissions: [Perm.DOMAINACCESS, Perm.MANAGER, Perm.ADMIN],
        validate: async (value: any): Promise<any> => {
            let validity: boolean;

            const schema = Joi.string()
                .trim()
                .regex(
                    /^.*\/-?\d+(\.\d*)?,-?\d+(\.\d*)?,-?\d+(\.\d*)?\/-?\d+(\.\d*)?,-?\d+(\.\d*)?,-?\d+(\.\d*)?,-?\d+(\.\d*)?$/
                );
            const { error } = schema.validate(value);

            if (error) {
                validity = false;
                throw new Error(error.message);
            } else {
                validity = true;
            }
            return validity;
        },
        setter: simpleSetter,
        getter: async (pEntity: any, pField: any): Promise<any> => {
            let address = pEntity.path ?? '/0,0,0/0,0,0,1';
            const pieces = address.split('/');
            if (pieces[0].length === 0) {
                const dbService = new DatabaseService({}, app);
                const domain = await dbService.findDataToArray(
                    config.dbCollections.domains,
                    { query: { id: pEntity.domainId } }
                );
                if (IsNotNullOrEmpty(domain[0])) {
                    if (IsNotNullOrEmpty(domain[0].networkAddr)) {
                        let domainAddr = domain[0].networkAddr;
                        if (IsNotNullOrEmpty(domain[0].networkPort)) {
                            domainAddr =
                                domain[0].networkAddr +
                                ':' +
                                domain[0].networkPort;
                        }
                        address = domainAddr + address;
                    }
                }
            }
            return address;
        },
    },
    path: {
        // the address within the domain
        entity_field: 'path',
        request_field_name: 'path',
        get_permissions: [Perm.ALL],
        set_permissions: [Perm.DOMAINACCESS, Perm.MANAGER, Perm.ADMIN],
        validate: isPathValidator,
        setter: simpleSetter,
        getter: simpleGetter,
    },
    maturity: {
        entity_field: 'maturity',
        request_field_name: 'maturity',
        get_permissions: [Perm.ALL],
        set_permissions: [Perm.DOMAINACCESS, Perm.MANAGER, Perm.ADMIN],
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
    tags: {
        entity_field: 'tags',
        request_field_name: 'tags',
        get_permissions: [Perm.ALL],
        set_permissions: [Perm.DOMAINACCESS, Perm.MANAGER, Perm.ADMIN],
        validate: isSArraySet,
        setter: sArraySetter,
        getter: simpleGetter,
    },
    managers: {
        entity_field: 'managers',
        request_field_name: 'managers',
        get_permissions: [Perm.ALL],
        set_permissions: [Perm.DOMAINACCESS, Perm.ADMIN],
        validate: async (value: any): Promise<any> => {
            const dbService = new DatabaseService({}, app);
            if (
                await verifyAllSArraySetValues(value, async (name: string) => {
                    return IsNotNullOrEmpty(
                        await dbService.findDataToArray(
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
    thumbnail: {
        entity_field: 'thumbnail',
        request_field_name: 'thumbnail',
        get_permissions: [Perm.ALL],
        set_permissions: [Perm.DOMAINACCESS, Perm.MANAGER, Perm.ADMIN],
        validate: isStringValidator,
        setter: simpleSetter,
        getter: simpleGetter,
    },
    images: {
        entity_field: 'images',
        request_field_name: 'images',
        get_permissions: [Perm.ALL],
        set_permissions: [Perm.DOMAINACCESS, Perm.MANAGER, Perm.ADMIN],
        validate: isSArraySet,
        setter: sArraySetter,
        getter: simpleGetter,
    },
    current_attendance: {
        entity_field: 'currentAttendance',
        request_field_name: 'current_attendance',
        get_permissions: [Perm.ALL],
        set_permissions: [Perm.DOMAINACCESS, Perm.MANAGER, Perm.ADMIN],
        validate: isNumberValidator,
        setter: simpleSetter,
        getter: simpleGetter,
    },
    current_images: {
        entity_field: 'currentImages',
        request_field_name: 'current_images',
        get_permissions: [Perm.ALL],
        set_permissions: [Perm.DOMAINACCESS, Perm.MANAGER, Perm.ADMIN],
        validate: isSArraySet,
        setter: sArraySetter,
        getter: simpleGetter,
    },
    current_info: {
        entity_field: 'currentInfo',
        request_field_name: 'current_info',
        get_permissions: [Perm.ALL],
        set_permissions: [Perm.DOMAINACCESS, Perm.MANAGER, Perm.ADMIN],
        validate: isValidObject,
        setter: simpleSetter,
        getter: simpleGetter,
    },
    current_last_update_time: {
        entity_field: 'currentLastUpdateTime',
        request_field_name: 'current_last_update_time',
        get_permissions: [Perm.ALL],
        set_permissions: [Perm.NONE],
        validate: isDateValidator,
        setter: simpleSetter,
        getter: async (pEntity: any, pField: any): Promise<any> => {
            if (pEntity && pEntity.hasOwnProperty(pField)) {
                const dateValue = pEntity[pField];
                return dateValue ? dateValue.toISOString() : undefined;
            }
            return undefined;
        },
    },
    current_api_key: {
        entity_field: 'currentAPIKeyTokenId',
        request_field_name: 'current_api_key',
        get_permissions: [Perm.DOMAINACCESS, Perm.ADMIN],
        set_permissions: [Perm.NONE],
        validate: isStringValidator,
        setter: '',
        getter: async (pEntity: any, pField: any): Promise<any> => {
            if (pEntity.hasOwnProperty('currentAPIKeyTokenId')) {
                let key!: string;
                const dbService = new DatabaseService({}, app);
                const keyToken = await dbService.findDataToArray(
                    config.dbCollections.tokens,
                    { query: { id: pEntity.currentAPIKeyTokenId } }
                );
                if (IsNotNullOrEmpty(keyToken[0])) {
                    key = keyToken[0].token;
                }
                return key;
            }
            return 'unknown';
        },
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
    when_place_entry_created: {
        entity_field: 'whenCreated',
        request_field_name: 'when_place_entry_created',
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
};
