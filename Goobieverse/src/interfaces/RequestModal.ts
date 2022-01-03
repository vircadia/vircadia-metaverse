export interface RequestEntity {
    id: string;
    requestType: string;

    // requestor and target
    requestingAccountId: string;
    targetAccountId: string;

    // administration
    expirationTime: Date;
    whenCreated: Date;

    // requestType == HANDSHAKE
    requesterNodeId: string;
    targetNodeId: string;
    requesterAccepted: boolean;
    targetAccepted: boolean;

    // requestType == VERIFYEMAIL
    // 'requestingAccountId' is the account being verified
    verificationCode: string; // the code we're waiting for
}
