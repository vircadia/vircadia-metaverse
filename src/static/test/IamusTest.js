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

let API_ACCOUNT_LOGIN = '/oauth/token';
let API_ACCOUNT_CREATE = '/api/v1/users';
let API_GET_TOKEN = '/api/v1/token/new';

// The html 'id' of the currently selected tab
let activeTabId = "tabLogin";
// Information on current user
let gLoginUser = '';
let gLoginTokenInfo = {};
let gDomainToken = {};

document.addEventListener('DOMContentLoaded', ev => {
    // Make all 'class=clickable' page items create events
    Array.from(document.getElementsByClassName('clickable')).forEach( nn => {
        nn.addEventListener('click', DoOnClickable);
    });

    // Keep track of the active tab
    $('a[data-toggle="tab"]').on('shown.bs.tab', evnt => {
        activeTabId = evnt.target.getAttribute('id');
    });
});
// Event from a 'clickable' class'ed element.
// If it has an 'op' attriute, call that named function
function DoOnClickable(evnt) {
    let buttonOp = evnt.target.getAttribute('op');
    if (buttonOp) {
        let buttonFunc = window[buttonOp];
        if (typeof(buttonFunc) === 'function') {
            buttonFunc(evnt);
        };
    };
}
// Global debug information printout.
let logToConsole = false;
function LogMessage(msg, classs) {
    if (logToConsole) {
        console.log(msg);
    }
    else {
        // Adds a text line to a div and scroll the area
        let debugg = document.getElementById('DEBUGG');
        if (debugg) {
            let newLine = document.createElement('div');
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
function DebugLog(msg) {
    LogMessage(msg, undefined);
};
function ErrorLog(msg) {
    LogMessage(msg, 'v-errorText');
};

function GetElementValue(elementId) {
    return document.getElementById(elementId).value.trim();
};
function GetSelectedValue(elementId) {
    let selection = document.getElementById(elementId);
    let selectionValue = selection.options[selection.selectedIndex].value.trim();
    return selectionValue;
};
function SetTextInElement(elementId, theText) {
    let textNode = document.createTextNode(theText);
    let theElement = document.getElementById(elementId);
    theElement.innerHTML = '';
    theElement.appendChild(textNode);
};
function ServerURL() {
    return GetElementValue('v-server-url');
};

function OpCreateAccount(evnt) {
    let username = GetElementValue('v-new-username');
    let passwd = GetElementValue('v-new-password');
    let useremail = GetElementValue('v-new-email');
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
function OpLogin(evnt) {
    let username = GetElementValue('v-login-username');
    let passwd = GetElementValue('v-login-password');
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
function OpGetDomainToken(evnt) {
    let username = GetElementValue('v-username');
    let passwd = GetElementValue('v-password');

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
// Use account information to get account token and use that to get domain token
function GetDomainTokenWithAccount(pUsername, pPassword) {
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
function GetUserAccessToken(pUsername, pPassword) {
    return new Promise( (resolve , reject) => {
        let queries = [];
        queries.push(encodeURIComponent('grant_type') + '=' + encodeURIComponent('password'));
        queries.push(encodeURIComponent('username') + '=' + encodeURIComponent(pUsername));
        queries.push(encodeURIComponent('password') + '=' + encodeURIComponent(pPassword));
        queries.push(encodeURIComponent('scope') + '=' + encodeURIComponent('owner'));
        let queryData = queries.join('&').replace(/%20/g, '+');

        let request = new XMLHttpRequest();
        request.onreadystatechange = function() {
            if (this.readyState === XMLHttpRequest.DONE) {
                if (this.status === 200) {
                    let response = JSON.parse(request.responseText);
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
                        });
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
function GetDomainToken(pAccountTokenInfo) {
    return new Promise( (resolve, reject) => {
        let request = new XMLHttpRequest();
        request.onreadystatechange = function() {
            if (this.readyState === XMLHttpRequest.DONE) {
                if (this.status === 200) {
                    let response = JSON.parse(request.responseText);
                    if (response.status && response.status === 'success') {
                        // Successful fetch of new domain token using account token
                        DebugLog('Successful fetch of domain token');
                        resolve(response.data.domain_token);
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
function CreateUserAccount(pUsername, pPassword, pEmail) {
    return new Promise( (resolve , reject) => {
        DebugLog('Starting account creation request for ' + pUsername);
        let requestData = JSON.stringify({
            'user': {
                'username': pUsername,
                'password': pPassword,
                'email': pEmail
            }
        });
        let request = new XMLHttpRequest();
        request.onreadystatechange = function() {
            if (this.readyState === XMLHttpRequest.DONE) {
                if (this.status === 200) {
                    let response = JSON.parse(request.responseText);
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
function DisplaySuccessfulLogin(username, tokenInfo) {
    DebugLog('Login successful for ' + username);
    gLoginUser = username;
    gLoginTokenInfo = tokenInfo;
    SetTextInElement('v-loggedin-username', username);
    SetTextInElement('v-loggedin-authtoken', tokenInfo.token);
};
function DisplayDomainToken(domainToken) {
    gDomainToken = domainToken;
    SetTextInElement('v-domain-token', tokenInfo.token);
};

// vim: set tabstop=4 shiftwidth=4 autoindent expandtab