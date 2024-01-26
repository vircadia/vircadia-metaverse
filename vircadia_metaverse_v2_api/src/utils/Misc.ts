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

import fs from 'fs';
import http from 'http';
import https from 'https';
import os from 'os';
import { v4 as uuidv4 } from 'uuid';
import crypto from 'crypto';
import { validate as isValiduuid } from 'uuid';



// Return 'true' if the passed value is null or empty
export function IsNullOrEmpty(pVal: any): boolean {
    return (
        typeof pVal === 'undefined' ||
        pVal === null ||
        (typeof pVal === 'string' && String(pVal.trim()).length === 0) ||
        (typeof pVal === 'object' && Object.keys(pVal).length === 0)
    );
}

export function GenUUID(): string {
    return uuidv4();
}

export function isValidUUID(uuid:any):boolean{
   return isValiduuid(uuid);
}


// Return 'true' if the passed value is not null or empty
export function IsNotNullOrEmpty(pVal: any): boolean {
    return !IsNullOrEmpty(pVal);
}

// Utility routine that reads in JSON content from either an URL or a filename.
// Returns the parsed JSON object or 'undefined' if any errors.
export async function readInJSON(pFilenameOrURL: string): Promise<any> {
    let configBody: string;
    if (pFilenameOrURL.startsWith('http://')) {
        configBody = await httpRequest(pFilenameOrURL);
    } else {
        if (pFilenameOrURL.startsWith('https://')) {
            configBody = await httpsRequest(pFilenameOrURL);
        } else {
            try {
                // We should technically sanitize this filename but if one can change the environment
                //    or config file variables, the app is already poned.
                configBody = fs.readFileSync(pFilenameOrURL, 'utf-8');
            } catch (err) {
                configBody = '';
                console.debug(
                    `readInJSON: failed read of user config file ${pFilenameOrURL}: ${err}`
                );
            }
        }
    }
    if (IsNotNullOrEmpty(configBody)) {
        return JSON.parse(configBody);
    }
    return undefined;
}

// Do a simple https GET and return the response as a string
export async function httpsRequest(pUrl: string): Promise<string> {
    return new Promise((resolve, reject) => {
        https
            .get(pUrl, (resp: any) => {
                let data = '';
                resp.on('data', (chunk: string) => {
                    data += chunk;
                });
                resp.on('end', () => {
                    resolve(data);
                });
            })
            .on('error', (err: any) => {
                reject(err);
            });
    });
}

// Do a simple http GET and return the response as a string
export async function httpRequest(pUrl: string): Promise<string> {
    return new Promise((resolve, reject) => {
        http.get(pUrl, (resp: any) => {
            let data = '';
            resp.on('data', (chunk: string) => {
                data += chunk;
            });
            resp.on('end', () => {
                resolve(data);
            });
        }).on('error', (err: any) => {
            reject(err);
        });
    });
}

let myExternalAddr: string;
export async function getMyExternalIPAddress(): Promise<string> {
    if (IsNotNullOrEmpty(myExternalAddr)) {
        return Promise.resolve(myExternalAddr);
    }
    return new Promise((resolve, reject) => {
        httpsRequest('https://api.ipify.org')
            .then((resp) => {
                myExternalAddr = resp;
                resolve(myExternalAddr);
            })
            .catch(() => {
                // Can't get it that way for some reason. Ask our interface
                const networkInterfaces = os.networkInterfaces();
                // { 'lo1': [ info, info ], 'eth0': [ info, info ]} where 'info' could be v4 and v6 addr infos

                let addressv4 = '';
                let addressv6 = '';

                Object.keys(networkInterfaces).forEach((dev) => {
                    networkInterfaces[dev]?.filter((details) => {
                        if (
                            details.family === 'IPv4' &&
                            details.internal === false
                        ) {
                            addressv4 = details.address;
                        }
                        if (
                            details.family === 'IPv6' &&
                            details.internal === false
                        ) {
                            addressv6 = details.address;
                        }
                    });
                });
                let address = '';
                if (IsNullOrEmpty(addressv4)) {
                    address = addressv6;
                } else {
                    address = addressv6;
                }

                if (IsNullOrEmpty(address)) {
                    reject('No address found');
                }
                myExternalAddr = address.toString();
                resolve(myExternalAddr);
            });
    });
}

// Return a string of random hex numbers of the specified length
export function genRandomString(pLen: number): string {
    return crypto
        .randomBytes(Math.ceil(pLen / 2))
        .toString('hex')
        .slice(0, pLen);
}

// Clamp the passed value between a high and low
export function Clamp(pVal: number, pLow: number, pHigh: number): number {
    let ret = pVal;
    if (ret > pHigh) ret = pHigh;
    if (ret < pLow) ret = pLow;
    return ret;
}

// Return a string of random hex numbers of the specified length
export function genRandomNumber(maxNumber: number): number {
    return Math.floor(Math.random() * maxNumber);
}

export function hashPasswordSalt(pPassword: string, pSalt: string): string {
    const hash = crypto.createHmac('sha512', pSalt);
    hash.update(pPassword);
    const val = hash.digest('hex');
    return val;
}
