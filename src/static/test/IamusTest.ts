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

const API_ACCOUNT_LOGIN = '/oauth/token';
const API_ACCOUNT_CREATE = '/api/v1/users';
const API_GET_TOKEN = '/api/v1/token/new';
const API_GET_ACCOUNTS = '/api/v1/accounts';

type AuthToken = string;
interface AuthTokenInfo {
    token: string,
    token_type: string,
    scope: string,
    refresh_token: string
};

// Information on current user
let gLoginUser = '';
let gLoginTokenInfo: AuthTokenInfo = {} as AuthTokenInfo;
let gDomainToken: AuthToken = {} as AuthToken;
let gAccountInfo: any[];

document.addEventListener('DOMContentLoaded', ev => {
    // Make all 'class=clickable' page items create events
    Array.from(document.getElementsByClassName('clickable')).forEach( nn => {
        nn.addEventListener('click', DoOnClickable);
    });
});
// Event from a 'clickable' class'ed element.
// If it has an 'op' attriute, call that named function
function DoOnClickable(evnt: Event): void {
    const buttonOp = (evnt.target as HTMLElement).getAttribute('op');
    if (buttonOp) {
        DebugLog('DoOnClickable: click op ' + buttonOp);
        // @ts-ignore
        const buttonFunc = window[buttonOp];
        if (typeof(buttonFunc) === 'function') {
            buttonFunc(evnt);
        };
    };
};
// Global debug information printout.
const logToConsole = false;
function LogMessage(msg: string , classs?: string ): void {
    if (logToConsole) {
        // tslint:disable-next-line:no-console
        console.log(msg);
    }
    else {
        // Adds a text line to a div and scroll the area
        const debugg = document.getElementById('DEBUGG');
        if (debugg) {
            const newLine = document.createElement('div');
            newLine.appendChild(document.createTextNode(msg));
            if (classs) {
                newLine.setAttribute('class', classs);
            };
            debugg.appendChild(newLine);
            if (debugg.childElementCount > 20) {
                debugg.removeChild(debugg.firstChild);
            };
        };
    };
};
function DebugLog(msg: string): void {
    LogMessage(msg, undefined);
};
function ErrorLog(msg: string): void {
    LogMessage(msg, 'v-errorText');
};

function GetElementValue(elementId: string): string {
    const el = document.getElementById(elementId) as HTMLTextAreaElement
    return el.value.trim();
};
function GetSelectedValue(elementId: string): string {
    const selection = document.getElementById(elementId) as HTMLSelectElement;
    const selectionValue = selection.options[selection.selectedIndex].value.trim();
    return selectionValue;
};
function SetTextInElement(elementId: string, theText: string): void {
    const textNode = document.createTextNode(theText);
    const theElement = document.getElementById(elementId);
    theElement.innerHTML = '';
    theElement.appendChild(textNode);
};
function ServerURL(): string {
    return GetElementValue('v-server-url');
};

function OpCreateAccount(evnt: Event): void {
    const username = GetElementValue('v-new-username');
    const passwd = GetElementValue('v-new-password');
    const useremail = GetElementValue('v-new-email');
    DebugLog('username=' + username + ', email=' + useremail);

    if (username.length < 1 || passwd.length < 2 || useremail.length < 5) {
        ErrorLog('You must specify a value for all three account fields');
        return;
    }

    CreateUserAccount(username, passwd, useremail)
    .then( () => {
        GetUserAccessToken(username, passwd)
        .then( accountTokenInfo => {
            DisplaySuccessfulLogin(username, accountTokenInfo);
        })
        .catch ( err => {
            ErrorLog('Could not fetch account token: ' + err);
        });
    })
    .catch ( err => {
        ErrorLog('Could not create account: ' + err);
    });
};
// The user is asking to login
function OpLogin(evnt: Event): void {
    const username = GetElementValue('v-login-username');
    const passwd = GetElementValue('v-login-password');
    DebugLog('Start login for ' + username);
    if (username.length < 1 || passwd.length < 2) {
        ErrorLog('You must specify a value for both username and password');
        return;
    }
    GetUserAccessToken(username, passwd)
    .then ( tokenInfo => {
        DisplaySuccessfulLogin(username, tokenInfo);
    })
    .catch ( err => {
        ErrorLog('Failed login: ' + err);
    });
};
function OpGetDomainToken(evnt: Event): void {
    const username = GetElementValue('v-username');
    const passwd = GetElementValue('v-password');

    if (username.length < 1 || passwd.length < 2) {
        ErrorLog('You must specify a value for both username and password');
        return;
    }

    GetDomainTokenWithAccount(username, passwd)
    .then( domainToken => {
        DisplayDomainToken(domainToken);
    })
    .catch ( err => {
        ErrorLog('Could not fetch domain token: ' + err);
    });
};
function OpAccountList(evnt: Event): void {
    DebugLog('OpAccountList:');
    RefreshAccountList()
    .then( acctList => {
        DebugLog('OpAccountList: accounts fetched: ' + acctList.length);
        gAccountInfo = acctList;
        DisplayAccounts();
    })
    .catch( err => {
        ErrorLog('Could not fetch accounts: ' + err);
    });
};
// ============================================================================
// Use account information to get account token and use that to get domain token
function GetDomainTokenWithAccount(pUsername: string, pPassword: string): Promise<AuthToken> {
    return new Promise( (resolve, reject) => {
        GetUserAccessToken(pUsername, pPassword)
        .then( accountTokenInfo => {
            GetDomainToken(accountTokenInfo)
            .then( domainToken => {
                DebugLog('Successful domain token creation');
                resolve(domainToken);
            })
            .catch ( err => {
                reject('Could not fetch domain token: ' + err);
            });
        })
        .catch ( err => {
            reject('Could not fetch account access token: ' + err);
        });
    });
};
// Return a Promise that returns an access token for the specified account.
// The returned 'token' has multiple fields describing the token, it's type, ...
function GetUserAccessToken(pUsername: string, pPassword: string): Promise<AuthTokenInfo> {
    return new Promise( (resolve , reject) => {
        const queries = [];
        queries.push(encodeURIComponent('grant_type') + '=' + encodeURIComponent('password'));
        queries.push(encodeURIComponent('username') + '=' + encodeURIComponent(pUsername));
        queries.push(encodeURIComponent('password') + '=' + encodeURIComponent(pPassword));
        queries.push(encodeURIComponent('scope') + '=' + encodeURIComponent('owner'));
        const queryData = queries.join('&').replace(/%20/g, '+');

        const request = new XMLHttpRequest();
        request.onreadystatechange = function() {
            if (this.readyState === XMLHttpRequest.DONE) {
                if (this.status === 200) {
                    const response = JSON.parse(request.responseText);
                    DebugLog("Login response = " + request.responseText);
                    if (response.error) {
                        // There was an error logging in
                        reject(response.error);
                    }
                    else {
                        DebugLog("Successful fetch of user access token");
                        // Successful account access. Token in the returned JSON body.
                        resolve( {
                            'token': response.access_token,
                            'token_type': response.token_type,
                            'scope': response.scope,
                            'refresh_token': response.refresh_token
                        } as AuthTokenInfo );
                    };
                }
                else {
                    // Error doing the login
                    reject("Account login failed");
                }
            }
        };
        DebugLog("Starting fetch of user access token for user " + pUsername);
        request.open("POST", ServerURL() + API_ACCOUNT_LOGIN);
        request.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        request.send(queryData);
    });
};
// Return a Promise that returns an access token for a domain
function GetDomainToken(pAccountTokenInfo: AuthTokenInfo): Promise<AuthToken> {
    return new Promise( (resolve, reject) => {
        const request = new XMLHttpRequest();
        request.onreadystatechange = function() {
            if (this.readyState === XMLHttpRequest.DONE) {
                if (this.status === 200) {
                    const response = JSON.parse(request.responseText);
                    if (response.status && response.status === 'success') {
                        // Successful fetch of new domain token using account token
                        DebugLog('Successful fetch of domain token');
                        resolve(response.data.domain_token as AuthToken);
                    }
                    else {
                        reject('Fetch of domain token failed: ' + JSON.stringify(response));
                    }
                }
                else {
                    reject('Domain token fetch failed');
                }
            }
        };
        DebugLog('Starting fetch of domain token');
        request.open('GET', ServerURL() + API_GET_TOKEN + "?scope=domain");
        request.setRequestHeader('Authorization',
                        pAccountTokenInfo.token_type + ' ' + pAccountTokenInfo.token);
        request.send();
    });
};
// Create a new user account. Does not return anything
function CreateUserAccount(pUsername: string, pPassword: string, pEmail: string): Promise<void> {
    return new Promise( (resolve , reject) => {
        DebugLog('Starting account creation request for ' + pUsername);
        const requestData = JSON.stringify({
            'user': {
                'username': pUsername,
                'password': pPassword,
                'email': pEmail
            }
        });
        const request = new XMLHttpRequest();
        request.onreadystatechange = function() {
            if (this.readyState === XMLHttpRequest.DONE) {
                if (this.status === 200) {
                    const response = JSON.parse(request.responseText);
                    if (response.status && response.status === 'success') {
                        // Successful account creation
                        DebugLog('Successful account creation');
                        resolve();
                    }
                    else {
                        if (response.data || response.error) {
                            reject('Account creation failed: ' + JSON.stringify(response));
                        }
                        else {
                            reject('Account creation failed');
                        }
                    }
                }
            }
        };
        request.open('POST', ServerURL() + API_ACCOUNT_CREATE);
        request.setRequestHeader('Content-type', 'application/json');
        request.send(requestData);
    });
};
function RefreshAccountList(): Promise<any[]> {
    return new Promise( (resolve, reject) => {
        const request = new XMLHttpRequest();
        request.onreadystatechange = function() {
            if (this.readyState === XMLHttpRequest.DONE) {
                if (this.status === 200) {
                    const response = JSON.parse(request.responseText);
                    if (response.status !== 'success') {
                        reject(request.responseText);
                    }
                    else {
                        DebugLog('Successful fetch of accounts');
                        resolve(response.data.accounts);
                    };
                }
                else {
                    reject(`Failure fetching accounts: response code=${this.status}`);
                };
            };
        };
        request.open("GET", ServerURL() + API_GET_ACCOUNTS);
        request.setRequestHeader('Authorization', `${gLoginTokenInfo.token_type} ${gLoginTokenInfo.token}`);
        request.send();
    });
};
// ===========================================================================
function DisplaySuccessfulLogin(username: string, tokenInfo: AuthTokenInfo): void {
    DebugLog('Login successful for ' + username);
    gLoginUser = username;
    gLoginTokenInfo = tokenInfo;
    SetTextInElement('v-loggedin-username', username);
    SetTextInElement('v-loggedin-authtoken', tokenInfo.token);
};
function DisplayDomainToken(domainToken: AuthToken): void {
    gDomainToken = domainToken;
    SetTextInElement('v-domain-token', gDomainToken);
};
function DisplayAccounts() {
    // Column defintions are [columnHeader, fieldInAccount, classForDataEntry]
    const columns = [
        ['id', 'accountId', 'v-acct-id'],
        ['name', 'username', 'v-acct-name'],
        ['email', 'email', 'v-acct-email'],
        ['admin', 'administrator', 'v-acct-admin'],
        ['whenCreated', 'when_account_created', 'v-acct-created']
    ];
    const rows: HTMLElement[] = [];
    // Add row of headers
    rows.push(makeRow(columns.map(col => {
        return makeHeader(col[0]);
    }) ) );
    // Add rows for each of the returned accounts
    if (gAccountInfo) {
        gAccountInfo.forEach( acct => {
            rows.push( makeRow(columns.map( col => {
                return makeData(acct[col[1]], col[2]);
            })));
        });
    };
    const tablePlace = document.getElementById('v-account-list');
    tablePlace.innerHTML = '';
    tablePlace.appendChild(makeTable(rows, 'v-table v-acct-table v-info-table'));
};

function makeTable(contents: any, aClass?: string): HTMLElement {
    return makeElement('table', contents, aClass);
};
function makeRow(contents: any, aClass?: string): HTMLElement {
    return makeElement('tr', contents, aClass);
};
function makeHeader(contents: any, aClass?: string): HTMLElement {
    return makeElement('th', contents, aClass);
};
function makeData(contents: any, aClass?: string): HTMLElement {
    return makeElement('td', contents, aClass);
};
function makeDiv(contents: any, aClass?: string): HTMLElement {
    return makeElement('div', contents, aClass);
};
function makeImage(src: string, aClass?: string): HTMLElement {
    const img = makeElement('img', undefined, aClass);
    img.setAttribute('src', src);
    return img;
};
function makeText(contents?: any): Text {
    const tex = document.createTextNode(contents);
    return tex;
};
// Make a DOM element of 'type'.
// If 'contents' is:
//       undefined: don't add any contents to the created element
//       an array: append multiple children
//       a string: append a DOM text element containing the string
//       otherwise: append 'contents' as a child
// If 'aClass' is defined, add a 'class' attribute to the created DOM element
function makeElement(type: string, contents?: any, aClass?: string): HTMLElement {
    const elem = document.createElement(type);
    if (aClass) {
        elem.setAttribute('class', aClass);
    }
    if (contents) {
        if (Array.isArray(contents)) {
            contents.forEach(ent => {
                if (typeof(ent) !== 'undefined') {
                    if (typeof(contents) === 'string') {
                        elem.appendChild(makeText(contents));
                    }
                    else {
                        elem.appendChild(ent);
                    }
                }
            });
        }
        else {
            if (typeof(contents) === 'string') {
                elem.appendChild(makeText(contents));
            }
            else {
                elem.appendChild(contents);
            };
        };
    };
    return elem;
};

// vim: set tabstop=4 shiftwidth=4 autoindent expandtab