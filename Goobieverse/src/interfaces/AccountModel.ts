export interface AccountModel {
  id: string;
  username: string;
  email: string;
  accountSettings: string; // JSON of client settings
  imagesHero: string;
  imagesThumbnail: string;
  imagesTiny: string;
  password: string;

  locationConnected: boolean;
  locationPath: string; // "/floatX,floatY,floatZ/floatX,floatY,floatZ,floatW"
  locationPlaceId: string; // uuid of place
  locationDomainId: string; // uuid of domain located in
  locationNetworkAddress: string;
  locationNetworkPort: number;
  locationNodeId: string; // sessionId
  availability: string[]; // contains 'none', 'friends', 'connections', 'all'

  connections: string[];
  friends: string[];
  locker: any; // JSON blob stored for user from server
  profileDetail: any; // JSON blob stored for user from server

  // User authentication
  passwordHash: string;
  passwordSalt: string;
  sessionPublicKey: string; // PEM public key generated for this session
  accountEmailVerified: boolean; // default true if not present

  // Old stuff
  xmppPassword: string;
  discourseApiKey: string;
  walletId: string;

  // Admin stuff
  // ALWAYS USE functions in Roles class to manipulate this list of roles
  roles: string[]; // account roles (like 'admin')
  IPAddrOfCreator: string; // IP address that created this account
  whenCreated: Date; // date of account creation
  timeOfLastHeartbeat: Date; // when we last heard from this user
}
