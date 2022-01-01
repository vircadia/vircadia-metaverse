import dotenv from 'dotenv-flow';
import appRootPath from 'app-root-path';
import { IsNullOrEmpty, getMyExternalIPAddress } from './utils/Misc';
import fs from 'fs';

if (globalThis.process?.env.APP_ENV === 'development') {
  // const fs = require('fs');
  if (
    !fs.existsSync(appRootPath.path + '/.env') &&
    !fs.existsSync(appRootPath.path + '/.env.local')
  ) {
    const fromEnvPath = appRootPath.path + '/.env.local.default';
    const toEnvPath = appRootPath.path + '/.env.local';
    fs.copyFileSync(fromEnvPath, toEnvPath, fs.constants.COPYFILE_EXCL);
  }
}

dotenv.config({
  path: appRootPath.path,
  silent: true,
});

/**
 * Server
 */

const server = {
  local: process.env.LOCAL === 'true',
  hostName: process.env.SERVER_HOST,
  port: process.env.PORT ?? 3030,
  paginate: {
    default: 10,
    max: 100,
  },
  publicPath: process.env.PUBLIC_PATH,
  version: process.env.SERVER_VERSION ?? '',
};

const email = { 
  host: process.env.SMTP_HOST ?? 'smtp.gmail.com',
  port: process.env.SMTP_PORT ?? '465',
  secure: process.env.SMTP_SECURE ?? true,
  auth: {
    user: process.env.SMTP_USER ?? 'khilan.odan@gmail.com',
    pass: process.env.SMTP_PASS ?? 'blackhawk143',
  }
};

/**
 * Metaverse Server
 */

const metaverseServer = {
  listen_host: process.env.LISTEN_HOST ?? '0.0.0.0',
  listen_port: process.env.LISTEN_PORT ?? 9400,
  metaverseInfoAdditionFile: process.env.METAVERSE_INFO_File ?? '',
  session_timeout_minutes: 5,
  heartbeat_seconds_until_offline: 5 * 60,      // seconds until non-heartbeating user is offline
  domain_seconds_until_offline: 10 * 60,        // seconds until non-heartbeating domain is offline
  domain_seconds_check_if_online: 2 * 60,       // how often to check if a domain is online
  handshake_request_expiration_minutes: 1,      // minutes that a handshake friend request is active
  connection_request_expiration_minutes: 60 * 24 * 4, // 4 days
  friend_request_expiration_minutes: 60 * 24 * 4,     // 4 days
  base_admin_account:process.env.ADMIN_ACCOUNT ?? 'Goobieverse',
  place_current_timeout_minutes: 5,             // minutes until current place info is stale
  place_inactive_timeout_minutes: 60,           // minutes until place is considered inactive
  place_check_last_activity_seconds: (3 * 60) - 5,  // seconds between checks for Place lastActivity updates
  email_verification_timeout_minutes: process.env.EMAIL_VERIFICATION_TIME,
  enable_account_email_verification: process.env.ENABLE_ACCOUNT_VERIFICATION ?? 'true',
  email_verification_email_body: '../verificationEmail.html',
};

/**
 * Authentication
 */
const authentication = {
  entity: 'user',
  service: 'auth',
  secret: process.env.AUTH_SECRET ?? 'testing',
  authStrategies: ['jwt', 'local'],
  jwtOptions: {
    expiresIn: '60 days',
  },
  local: {
    usernameField: 'username',
    passwordField: 'password',
  },
  bearerToken: {
    numBytes: 16,
  },
  oauth: {
    redirect: '/',
    auth0: {
      key: '<auth0 oauth key>',
      secret: '<auth0 oauth secret>',
      subdomain: '<auth0 subdomain>',
      scope: ['profile', 'openid', 'email'],
    },
  },
};

/**
 * Metaverse
 */

const metaverse = {
  metaverseName: process.env.METAVERSE_NAME ?? '',
  metaverseNickName: process.env.METAVERSE_NICK_NAME ?? '',
  metaverseServerUrl: process.env.METAVERSE_SERVER_URL ?? '', // if empty, set to self
  defaultIceServerUrl: process.env.DEFAULT_ICE_SERVER_URL ?? '', // if empty, set to self
  dashboardUrl: process.env.DASHBOARD_URL
  
};

if (
  IsNullOrEmpty(metaverse.metaverseServerUrl) ||
  IsNullOrEmpty(metaverse.defaultIceServerUrl)
) {
  getMyExternalIPAddress().then((ipAddress) => {
    if (IsNullOrEmpty(metaverse.metaverseServerUrl)) {
      const newUrl = `http://${ipAddress}:${metaverseServer.listen_port.toString()}/`;
      metaverse.metaverseServerUrl = newUrl;
    }
    if (IsNullOrEmpty(metaverse.defaultIceServerUrl)) {
      metaverse.defaultIceServerUrl = ipAddress;
    }
  });
}


const dbCollections = {
  domains : 'domains',
  accounts : 'accounts',
  places : 'places',
  tokens : 'tokens'
};


/**
 * Full config
 */

const config = {
  deployStage: process.env.DEPLOY_STAGE,
  authentication,
  server,
  metaverse,
  metaverseServer,
  dbCollections,
  email
};

export default config;
