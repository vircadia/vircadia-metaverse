    let API_ACCOUNT_LOGIN = '/oauth/token';
        let API_ACCOUNT_CREATE = '/api/v1/users';
        let API_GET_TOKEN = '/api/v1/token/new';

        // Function run when the page has been loaded
        document.addEventListener('DOMContentLoaded', function(evnt) {
            // All elements with class 'clickable' calls a function based on 'op' attribute
            Array.from(document.getElementsByClassName('clickable')).forEach( nn => {
                nn.addEventListener('click', evnt => {
                    let buttonOp = evnt.target.getAttribute('op');
                    if (typeof ClickableOps[buttonOp] == 'function') {
                        ClickableOps[buttonOp](evnt.target);
                    }
                });
            });
        });
		
        let ClickableOps = {
            'createAccount': OpCreateAccount,
            'getDomainToken': OpGetDomainToken
        };
        // User clicked on "Create Account" button. Read fields and try to create.
        function OpCreateAccount(evnt) {
            let username = document.getElementById('v-new-username').value.trim();
            let passwd = document.getElementById('v-new-password').value.trim();
            let useremail = document.getElementById('v-new-email').value.trim();

            // Logg('username=' + username + ', email=' + useremail);

            if (username.length < 1 || passwd.length < 2 || useremail.length < 5) {
                DisplayAccountError('You must specify a value for all three account fields');
                return;
            }

            CreateUserAccount(username, passwd, useremail)
            .then( () => {
                GetUserAccessToken(username, passwd)
                .then( accountTokenInfo => {
                    GetDomainToken(accountTokenInfo)
                    .then( domainToken => {
                        DisplayDomainToken(domainToken);
                    })
                    .catch ( err => {
                        DisplayError('Could not fetch domain token: ' + err);
                    });
                })
                .catch ( err => {
                    DisplayError('Could not fetch account token: ' + err);
                });
            })
            .catch ( err => {
                DisplayError('Could not create account: ' + err);
            });
        };
        // User clicked on "Create Domain Token". Get fields and fetch the token
        function OpGetDomainToken(evnt) {
            let username = document.getElementById('v-username').value.trim();
            let passwd = document.getElementById('v-password').value.trim();

            if (username.length < 1 || passwd.length < 2) {
                DisplayAccountError('You must specify a value for both username and password');
                return;
            }

            GetDomainTokenWithAccount(username, passwd)
            .then( domainToken => {
                DisplayDomainToken(domainToken);
            })
            .catch ( err => {
                DisplayError('Could not fetch domain token: ' + err);
            });
        };
        // Use account information to get account token and use that to get domain token
        function GetDomainTokenWithAccount(pUsername, pPassword) {
            return new Promise( (resolve, reject) => {
                GetUserAccessToken(pUsername, pPassword)
                .then( accountTokenInfo => {
                    GetDomainToken(accountTokenInfo)
                    .then( domainToken => {
                        Logg('Successful domain token creation');
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
                            // Successful account access. Token in the returned JSON body.
                            Logg("Successful fetch of user access token");
                            let response = JSON.parse(request.responseText);
                            resolve( {
                                'token': response.access_token,
                                'token_type': response.token_type,
                                'scope': response.scope,
                                'refresh_token': response.refresh_token
                            });
                        }
                        else {
                            // Error doing the login
                            reject("Account login failed");
                        }
                    }
                };
                Logg("Starting fetch of user access token for user " + pUsername);
                request.open("POST", API_ACCOUNT_LOGIN);
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
                                Logg('Successful fetch of domain token');
                                resolve(response.data.token);
                            }
                            else {
                                reject('Fetch of domain token failed: ' + JSON.stringify(response.data));
                            }
                        }
                        else {
                            reject('Domain token fetch failed');
                        }
                    }
                };
                Logg('Starting fetch of domain token');
                request.open('POST', API_GET_TOKEN + "?scope=domain");
                request.setRequestHeader('Authorization',
                                pAccountTokenInfo.token_type + ' ' + pAccountTokenInfo.token);
                request.send();
            });
        };
        // Create a new user account. Does not return anything 
        function CreateUserAccount(pUsername, pPassword, pEmail) {
            return new Promise( (resolve , reject) => {
                Logg('Starting account creation request for ' + pUsername);
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
                            if (response.status && response.status == 'success') {
                                // Successful account creation
                                Logg('Successful account creation');
                                resolve();
                            }
                            else {
                                if (response.data) {
                                    reject('Account creation failed: ' + JSON.stringify(response.data));
                                }
                                else {
                                    reject('Account creation failed');
                                }
                            }
                        }
                    }
                };
                request.open('POST', API_ACCOUNT_CREATE);
                request.setRequestHeader('Content-type', 'application/json');
                request.send(requestData);
            });
        };
        // Display the fetched domain token in the domain display area
        function DisplayDomainToken(pToken) {
            let domainArea = document.getElementById('v-token-results');
            domainArea.innerHTML = '';
            let message = document.createTextNode('Domain token = ' + pToken);
            domainArea.appendChild(message);
        };
        // Display an error message in the domain display area
        function DisplayError(pMsg) {
            let domainArea = document.getElementById('v-token-results');
            domainArea.innerHTML = '';
            let div = document.createElement('div');
            div.setAttribute('class', 'v-errorText');
            let message = document.createTextNode('ERROR: ' + pMsg);
            div.appendChild(message);
            domainArea.appendChild(div);
        };
        // Put lines of messages into the 'DEBUGG' section of the document
        function Logg(msg, classs) {
            let debugg = document.getElementById('DEBUGG');
            if (debugg) {
                let newline = document.createElement('div');
                newline.appendChild(document.createTextNode(msg));
                if (classs) {
                    newline.setAttribute('class', classs);
                }
                debugg.appendChild(newline);
                if (debugg.childElementCount > 10) {
                    debugg.removeChild(debugg.firstChild);
                }
            }
        };
