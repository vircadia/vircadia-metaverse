import { DatabaseService } from './../../dbservice/DatabaseService';
import {  MongoDBServiceOptions } from 'feathers-mongodb';
import { Application } from '../../declarations';
import config from '../../appconfig';
import {  Params } from '@feathersjs/feathers';
import { AccountModel } from '../../interfaces/AccountModel';
import { GenUUID } from '../../utils/Misc';
import { Roles } from '../../utils/sets/Roles';
import { IsNullOrEmpty, isValidObject } from '../../utils/Misc';
import { SArray } from '../../utils/vTypes';
import { sendEmail } from '../../utils/mail';
import path from 'path';
import fsPromises from 'fs/promises';

export class Users extends DatabaseService {
  app: Application;
  //eslint-disable-next-line @typescript-eslint/no-unused-vars
  constructor(options: Partial<MongoDBServiceOptions>, app: Application) {
    super(options, app);
    this.app = app;
  }

  async create(data: AccountModel, params?: Params): Promise<any> {
    if (data.username && data.email && data.password) {
      const username : string = data.username;
      const email : string  = data.email;
      const password : string = data.password;
      if (username) {
        const accountsName: AccountModel[] = await this.findDataToArray(config.dbCollections.accounts, { query: { username: username }  });
        const name = (accountsName as Array<AccountModel>)
          ?.map((item) => item.username);
        if (!name.includes(username)) {
         
          const accountsEmail: AccountModel[] = await this.findDataToArray(config.dbCollections.accounts, { query:{email:  email }});
          const emailAddress = (accountsEmail as Array<AccountModel>)
            ?.map((item) => item.email);
          if (!emailAddress.includes(email)) {
            
            const id = GenUUID();
            const roles = [Roles.USER];
            const friends : string[] = [];
            const connections : string[] = [];
            const whenCreated = new Date();
            const accountIsActive = true;
            const accountWaitingVerification = false;
            const accounts = await this.CreateData(config.dbCollections.accounts, {
              ...data,
              id: id,
              roles: roles,
              whenCreated: whenCreated,
              friends: friends,
              connections: connections,
              accountIsActive: accountIsActive,
              accountWaitingVerification :accountWaitingVerification
            });
            if (isValidObject(accounts)) {
              const emailToValidate = data.email;
              const emailRegexp = /^[a-zA-Z0-9.!#$%&'+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)$/;
              if (emailRegexp.test(emailToValidate)) {
                try {
                  const adminAccountName = config.metaverseServer['base_admin_account']; 
                  if (accounts.username === adminAccountName) {
                    if (IsNullOrEmpty(accounts.roles)) accounts.roles = [];
                    SArray.add(accounts.roles, Roles.ADMIN);
                  }
                 
                  const verificationURL = config.metaverse['metaverseServerUrl']
                  + `/api/v1/account/verify/email?a=${accounts.id}&v=${accounts.id}`;
                  const metaverseName = config.metaverse['metaverseName'];
                  const shortMetaverseName = config.metaverse['metaverseNickName'];
                  const verificationFile = path.join(__dirname, '../..', config.metaverseServer['email_verification_email_body']);
                
                  let emailBody = await fsPromises.readFile(verificationFile, 'utf-8');
                  emailBody = emailBody.replace('VERIFICATION_URL', verificationURL)
                    .replace('METAVERSE_NAME', metaverseName)
                    .replace('SHORT_METAVERSE_NAME', shortMetaverseName);
                
                  const email = {
                    from: 'khilan.odan@gmail.com',
                    to: accounts.email,
                    subject:  `${shortMetaverseName} account verification`,
                    html: emailBody,
                  };
                  const sendEmailVerificationLink = await sendEmail(this.app, email).then(
                    function (result:any) {
                      let sendEmailVerificationStatus = {};
                      sendEmailVerificationStatus = result == null ? {} : result;
                      return sendEmailVerificationStatus;
                    }
                  );
                  return Promise.resolve({
                    accountId: accounts.id,
                    username: accounts.username,
                    accountIsActive: accounts.accountIsActive,
                    accountWaitingVerification:accounts.accountWaitingVerification
                  }); 
                } catch (error: any) {
                  throw new Error('Exception adding user: ' + error);
                }
              }
              else {
                throw new Error('Send valid Email address');
              }
            } else {
              throw new Error('Could not create account');
            }
          } else {
            throw new Error('Email already exists');
          }
        } else {
          throw new Error('Account already exists');
        }
      } else {
        throw new Error('Badly formatted username');
      }
    } else {
      throw new Error('Badly formatted request');
    }
  }

  async find(params?: Params): Promise<any> {
    
    const perPage = parseInt(params?.query?.per_page) || 10;
    const skip = ((parseInt(params?.query?.page) || 1) - 1) * perPage;


    const user = await this.findDataToArray(config.dbCollections.accounts, {
      query: {
        accountIsActive: true ,
        $select: [ 'username', 'accountId' ],
        $skip: skip,
        $limit: perPage
      }
    });
    
    return Promise.resolve({ user }); 
  }

}
