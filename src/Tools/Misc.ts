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


import http from "http";
import https from "https";
import os from "os";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import crypto from "crypto";

import fsPromises from "fs/promises";

import { createTransport } from "nodemailer";

import { Logger } from "@Tools/Logging";
import { VKeyedCollection } from "@Tools/vTypes";
import { Config } from "@Base/config";
import { AccountEntity } from "@Entities/AccountEntity";

// Clamp the passed value between a high and low
export function Clamp(pVal: number, pLow: number, pHigh: number): number {
    let ret = pVal;
    if (ret > pHigh) {
        ret = pHigh;
    }
    if (ret < pLow) {
        ret = pLow;
    }
    return ret;
}

// Return 'true' if the passed value is null or empty
export function IsNullOrEmpty(pVal: any): boolean {
    return typeof pVal === "undefined"
          || pVal === null
          || typeof pVal === "string" && String(pVal).length === 0;
}
// Return 'true' if the passed value is not null or empty
export function IsNotNullOrEmpty(pVal: any): boolean {
    return !IsNullOrEmpty(pVal);
}

// Create an object with the passed property value.
// This is often used to make queries where the property name is a value string.
export function SimpleObject(pProperty: string, pValue: any): VKeyedCollection {
    const ret: VKeyedCollection = {};
    ret[pProperty] = pValue;
    return ret;
}

// Take apart an URL query string and return an object of key/value pairs
export function ParseQueryString(pQuery: string): Map<string, string> {
    const ret = new Map();
    const args = decodeURI(pQuery).split("&");
    args.forEach((arg) => {
        const argPieces = arg.split("=");
        switch (argPieces.length) {
            case 1:
                ret.set(argPieces[0], null); break;
            case 2:
                ret.set(argPieces[0], argPieces[1]); break;
            default:
                break;  // doesn't make sense so ignore it
        }
    });
    return ret;
}

export function GenUUID(): string {
    return uuidv4();
}

// Return a string of random hex numbers of the specified length
export function genRandomString(pLen: number): string {
    return crypto.randomBytes(Math.ceil(pLen / 2))
        .toString("hex")
        .slice(0, pLen);
}

let myExternalAddr: string;
export async function getMyExternalIPAddress(): Promise<string> {
    if (IsNotNullOrEmpty(myExternalAddr)) {
        return Promise.resolve(myExternalAddr);
    }
    return new Promise((resolve, reject) => {
        httpsRequest("https://api.ipify.org")
            .then((resp) => {
                myExternalAddr = resp;
                resolve(myExternalAddr);
            })
            ["catch"]((err) => {
                // Can't get it that way for some reason. Ask our interface
                const networkInterfaces = os.networkInterfaces();
                // { 'lo1': [ info, info ], 'eth0': [ info, info ]} where 'info' could be v4 and v6 addr infos

                let ret = () => {
                    return [].concat(...Object.values(networkInterfaces))
                        .filter((details) => {
                            return details.family === "IPv4" && !details.internal;
                        })
                        .pop().address;
                };
                if (IsNullOrEmpty(ret)) {
                    ret = () => {
                        return [].concat(...Object.values(networkInterfaces))
                            .filter((details) => {
                                return details.family === "IPv6" && !details.internal;
                            })
                            .pop().address;
                    };
                }
                Logger.debug(`getMyExternalIPAddress: resolved interface addr = ${ret}`);
                if (IsNullOrEmpty(ret)) {
                    reject("No address found");
                }
                myExternalAddr = ret.toString();
                resolve(myExternalAddr);
            });
    });
}

// Do a simple http GET and return the response as a string
export async function httpRequest(pUrl: string): Promise<string> {
    return new Promise((resolve, reject) => {
        http.get(pUrl, (resp) => {
            let data = "";
            resp.on("data", (chunk: string) => {
                data += chunk;
            });
            resp.on("end", () => {
                resolve(data);
            });
        }).on("error", (err: any) => {
            reject(err);
        });
    });
}
// Do a simple https GET and return the response as a string
export async function httpsRequest(pUrl: string): Promise<string> {
    return new Promise((resolve, reject) => {
        https.get(pUrl, (resp) => {
            let data = "";
            resp.on("data", (chunk: string) => {
                data += chunk;
            });
            resp.on("end", () => {
                resolve(data);
            });
        }).on("error", (err: any) => {
            reject(err);
        });
    });
}

export async function SendVerificationEmail(pAccount: AccountEntity, pVerifyCode: string): Promise<void> {
    try {
        const verificationURL = Config.metaverse["metaverse-server-url"]
                + `/api/v1/account/verify/email?a=${pAccount.id}&v=${pVerifyCode}`;
        const metaverseName = Config.metaverse["metaverse-name"];
        const shortMetaverseName = Config.metaverse["metaverse-nick-name"];

        const verificationFile = path.join(__dirname, "../..", Config["metaverse-server"]["email-verification-email-body"]);
        Logger.debug(`SendVerificationEmail: using verificationFile from ${verificationFile}`);
        let emailBody = await fsPromises.readFile(verificationFile, "utf-8");
        emailBody = emailBody.replace("VERIFICATION_URL", verificationURL)
            .replace("METAVERSE_NAME", metaverseName)
            .replace("SHORT_METAVERSE_NAME", shortMetaverseName);

        Logger.debug(`SendVerificationEmail: SMTPhost=${Config["nodemailer-transport-config"].host}`);
        const transporter = createTransport(Config["nodemailer-transport-config"]);
        if (transporter) {
            Logger.debug(`SendVerificationEmail: sending email verification for new account ${pAccount.id}/${pAccount.username}`);
            const msg = {
                from: Config["metaverse-server"]["email-verification-from"],
                to: pAccount.email,
                subject: `${shortMetaverseName} account verification`,
                html: emailBody
            };
            transporter.sendMail(msg);
            transporter.close();
        } else {
            Logger.error(`SendVerificationEmail: failed to recreate transporter`);
        }
    } catch (e) {
        Logger.error(`SendVerificationEmail: exception sending verification email. Acct=${pAccount.id}/${pAccount.username}. e=${e}`);
    }

}
