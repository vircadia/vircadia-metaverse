import  dotenv  from 'dotenv-flow';
import appRootPath from 'app-root-path';
import {IsNullOrEmpty,getMyExternalIPAddress} from './utils/Misc';

if(globalThis.process?.env.APP_ENV === 'development') {
  const fs = require('fs');
  if (!fs.existsSync(appRootPath.path + '/.env') && !fs.existsSync(appRootPath.path + '/.env.local')) {
    const fromEnvPath = appRootPath.path + '/.env.local.default';
    const toEnvPath = appRootPath.path + '/.env.local';
    fs.copyFileSync(fromEnvPath, toEnvPath, fs.constants.COPYFILE_EXCL);
  }
}
   
dotenv.config({
  path: appRootPath.path,
  silent: true
});

/**
 * Server
 */

const server = {
  local : process.env.LOCAL === 'true',
  hostName:process.env.SERVER_HOST,
  port:process.env.PORT ?? 3030,
  paginate:{
    default:10,
    max:100
  },
  publicPath:process.env.PUBLIC_PATH,
  version:process.env.SERVER_VERSION ?? ''
};

/**
 * Metaverse Server
 */

const metaverseServer = {
  listen_host: process.env.LISTEN_HOST ??'0.0.0.0',
  listen_port: process.env.LISTEN_PORT ?? 9400,
  metaverseInfoAdditionFile: process.env.METAVERSE_INFO_File ?? '',
};

/**
 * Authentication
 */
const authentication= {
  entity: null,
  service: null,
  secret: process.env.AUTH_SECRET ?? 'testing',
  authStrategies: ['jwt','local'],
  jwtOptions: {
    expiresIn: '60 days'
  },
  local: {
    usernameField: 'email',
    passwordField: 'password'
  },
  bearerToken: {
    numBytes: 16
  },
  oauth: {
    redirect: '/',
    auth0: {
      key: '<auth0 oauth key>',
      secret: '<auth0 oauth secret>',
      subdomain: '<auth0 subdomain>',
      scope: ['profile','openid','email']
    }
  }
};


/**
 * Metaverse
 */

const metaverse = {
  metaverseName: process.env.METAVERSE_NAME ?? '',
  metaverseNickName: process.env.METAVERSE_NICK_NAME ?? '',
  metaverseServerUrl: process.env.METAVERSE_SERVER_URL ?? '',   // if empty, set to self
  defaultIceServerUrl: process.env.DEFAULT_ICE_SERVER_URL ?? '', // if empty, set to self
  dashboardUrl: process.env.DASHBOARD_URL
};

if (IsNullOrEmpty(metaverse.metaverseServerUrl) || IsNullOrEmpty(metaverse.defaultIceServerUrl)) {
  getMyExternalIPAddress().then((ipAddress)=>{
    if(IsNullOrEmpty(metaverse.metaverseServerUrl)){ 
      const newUrl = `http://${ipAddress}:${metaverseServer.listen_port.toString()}/`;
      metaverse.metaverseServerUrl = newUrl;
    }
    if(IsNullOrEmpty(metaverse.defaultIceServerUrl)){
      metaverse.defaultIceServerUrl = ipAddress;
    }
  });
}




/**
 * Full config
 */
const config = {
  deployStage: process.env.DEPLOY_STAGE,
  authentication,
  server,
  metaverse,
  metaverseServer
};

export default config;