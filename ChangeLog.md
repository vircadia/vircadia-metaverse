# Iamus Changelog
## Version 2.2.20

<ul>
<li><a href="http://github.com/kasenvr/Iamus/commit/bcba27784d37f4d7190a7b67f6b7ec4250715881">view &bull;</a> Add the missing address to the end of an Explore hifi URL</li> 
<li><a href="http://github.com/kasenvr/Iamus/commit/a2b8737f327f9cac359db53d481ec36221b66bfd">view &bull;</a> Fix line endings to Linux style.</li> 
<li><a href="http://github.com/kasenvr/Iamus/commit/6517cb89b740779ca5532bcd975b9f0f9f729b39">view &bull;</a> Remove authentication requirement for fetching /explore</li> 
<li><a href="http://github.com/kasenvr/Iamus/commit/facd94a32b11d9fd9df99c2b6ec8b70e1c28aacb">view &bull;</a> Change type of request being searched for in connection_request. Add some debug messages to connection_request.</li> 
<li><a href="http://github.com/kasenvr/Iamus/commit/b59c6ec0994ed9eef117e846b40e33d527e1b000">view &bull;</a> Always return "Owner" in Explore entries.</li> 
<li><a href="http://github.com/kasenvr/Iamus/commit/ff55e37fa4ebf8044de3247324786de00344eca6">view &bull;</a> Add more debugging to user/connection_request</li> 
<li><a href="http://github.com/kasenvr/Iamus/commit/e359e51dbe3e0cb78bf3145c1ec74dd853dfbaac">view &bull;</a> Fix problem where set entity field would not assign a value if the     field did not exist on the target entity.</li> 
<li><a href="http://github.com/kasenvr/Iamus/commit/708e24542aa6680e8de679719267a2bb8e1380e7">view &bull;</a> Add function route-tools.Util.buildImageInfo() for consistant user image return data.</li> 
<li><a href="http://github.com/kasenvr/Iamus/commit/cd3c1cf57c2fa644d99787d08384e3ad166bfe3e">view &bull;</a> Change "GET /explore" to "GET /explore.json" as that's what the calling     script wants.</li> 
<li><a href="http://github.com/kasenvr/Iamus/commit/519f918ff0d5449fc042414659a415cd33c4f23f">view &bull;</a> Add /api/v1/users/connections which returns connections and their images/location info.</li> 
<li><a href="http://github.com/kasenvr/Iamus/commit/f6b15d8e749f748c5e1265b573229da35bac9ab2">view &bull;</a> Bump version to 2.2.20</li> 
</ul>

## Version 2.2.19

<ul>
<li><a href="http://github.com/kasenvr/Iamus/commit/76fd7ffc1ef865f8913daa8bf4c088ab76225653">view &bull;</a> Update ChangeLog.md</li> 
<li><a href="http://github.com/kasenvr/Iamus/commit/6fc75b342899ab69fe330f9449bc86ee23145b21">view &bull;</a> Add week history for apiRequests</li> 
<li><a href="http://github.com/kasenvr/Iamus/commit/ead079973b6918de016abb05697b6056c427b80c">view &bull;</a> Fix line endings to be consistant Linux form</li> 
<li><a href="http://github.com/kasenvr/Iamus/commit/48e048fd3e3e97a027bf7202f3994c50e170371b">view &bull;</a> Remove some chatty debug messages for errors in RESTResponse.</li> 
<li><a href="http://github.com/kasenvr/Iamus/commit/36c6a25c16246cedb7e05ce51d6232567ea80808">view &bull;</a> Remove 'accountId' from PlaceEntity to simplify place linkage management     Update API-Place documentation Add middleware.placeFromParams to map :placeId to req.vPlace     Add req.vPlace to ExpressJS.Request     Centralize code to look up place with both id and name     Lookup domain when fetching place by parameter id Update /api/v1/places/* to use :placeId     Use permissions.checkEntityAccess rather than checking fields for permissions</li> 
<li><a href="http://github.com/kasenvr/Iamus/commit/8da9cc25998042e4cad5279bb0e9754d637c1066">view &bull;</a> Correct domain address variable naming from "network_addr" to "network_address"     Updates names on POST input and GET responses.     Update documentation.</li> 
<li><a href="http://github.com/kasenvr/Iamus/commit/357bf894d90b2bbfa34a0f143b35aa31a86eec54">view &bull;</a> Add /explore API point that returns Place information with location info</li> 
<li><a href="http://github.com/kasenvr/Iamus/commit/e5099e082c996dd0406b8782e20f5286fa6e9f07">view &bull;</a> Add function to assume a domain server's addr if not saved.     Add Config.metaverse-server.fix-domain-network-address defaulting to 'true'</li> 
<li><a href="http://github.com/kasenvr/Iamus/commit/7a28811715fc72ab7cfe3cbe274bfbf4d15578e8">view &bull;</a> Bump version to 2.2.19</li> 
</ul>

## Version 2.2.18

<ul>
<li><a href="http://github.com/kasenvr/Iamus/commit/379f3a5a2e1348b1b6874ac4cf1b963c81b34bf6">view &bull;</a> Initial version of ChangeLog.md and generating script.     Will get improved over time.</li> 
<li><a href="http://github.com/kasenvr/Iamus/commit/104d6ea7c86405cc62bc4ab26b32374176c228ba">view &bull;</a> Tuning to ChangeLog generation. Comments and formatting.</li> 
<li><a href="http://github.com/kasenvr/Iamus/commit/8c113716027c141a08e3f59da439b11496332581">view &bull;</a> Add monitoring/statistic infrastructure and initial categories 'os' and 'server'.     New requests under /api/v1/stats/...</li> 
<li><a href="http://github.com/kasenvr/Iamus/commit/dbec702e1e21f09e9c7c30874bd2343735c5ae97">view &bull;</a> Add documentation for Monitoring feature.</li> 
<li><a href="http://github.com/kasenvr/Iamus/commit/5f5ea9a427a3dfcce1a32df34178476cb5993f17">view &bull;</a> Bump version to 2.2.18</li> 
</ul>

## Version 2.2.17

<ul>
<li><a href="http://github.com/kasenvr/Iamus/commit/8ed88fe10cdb65607e25270df1ff9bf32da98cd7">view &bull;</a> Update API-Users.md (#49)</li> 
<li><a href="http://github.com/kasenvr/Iamus/commit/c7fdb942cb642995c2217d20409f226caf1be578">view &bull;</a> Default account token login time to one week. Remove configuration information for ActivityPub.     Not used yet and a real implmentation will define its own config needs.</li> 
<li><a href="http://github.com/kasenvr/Iamus/commit/3a5939ad5ffa858eda8c7c057e6701144955ba2f">view &bull;</a> Remove old ActivityPub files that are not used.</li> 
<li><a href="http://github.com/kasenvr/Iamus/commit/d393e95516df65b4f7fbc6151b9cefe7d9cc33da">view &bull;</a> Add replacement of DASHBOARD_URL in Config.metaverse-server.tokengen_url. Add comments with example for dashboard version of 'tokengen_url' configuration.</li> 
<li><a href="http://github.com/kasenvr/Iamus/commit/3dd4edcf3fee2f5ee17d0d1dc4e69de53c695dca">view &bull;</a> Add debug logging for failure response of API requests.</li> 
<li><a href="http://github.com/kasenvr/Iamus/commit/856a039d6e6e6539ee435995e5dba722399c71ed">view &bull;</a> Even more debugging for REST request error handling.</li> 
<li><a href="http://github.com/kasenvr/Iamus/commit/0f7b00b089a0deec6db91e31a0b3010555df00b0">view &bull;</a> When uniquifying a place name (usually in default creation), create     legal unique place name (use hyphen instead of space).</li> 
<li><a href="http://github.com/kasenvr/Iamus/commit/62e7a4db15a4a22843134cbf9ae829c5bc412db3">view &bull;</a> Rename RequestEntity fields for HANDSHAKE to make it clearer the NodeId vs AccountId Use correct fields for finding previous handshake requests in connection_request</li> 
<li><a href="http://github.com/kasenvr/Iamus/commit/5c476fc4d903808ed0b04496e822e5621b30b129">view &bull;</a> Add file based logging using Winston.     This creates multiple log files in debug.log-directory which     defaults to files "iamus*.log" in "./logs".</li> 
<li><a href="http://github.com/kasenvr/Iamus/commit/daf95f4cf825480c66751f5e68a0262cf69d622f">view &bull;</a> Update NPM package versions to latest</li> 
<li><a href="http://github.com/kasenvr/Iamus/commit/1a7777deef66392e45739c372e4131438855b6d5">view &bull;</a> Bump version to 2.2.17</li> 
</ul>

## Version 2.2.16

<ul>
<li><a href="http://github.com/kasenvr/Iamus/commit/e6ba00202aa95336fa70823c0204f1e5b52876dc">view &bull;</a> Make all calls into Db.ts to require CriteriaFilters.     This eliminates just passing 'any'. Update all calls into Db to create GenericFilter rather than just passing     an 'any' object.</li> 
<li><a href="http://github.com/kasenvr/Iamus/commit/94772882a10a14819f5983982a7baad0ed8f81bd">view &bull;</a> Remove DomainEntity 'hosts' and replace it with 'managers'. Update documentation.</li> 
<li><a href="http://github.com/kasenvr/Iamus/commit/b97e65f20ea89c6f2d7ed750ee256a13cf4dbc58">view &bull;</a> Add debug logging for Db.getObject()</li> 
<li><a href="http://github.com/kasenvr/Iamus/commit/a4a293fd52744cc74828ad681b742b02bd95034f">view &bull;</a> Correct GET /api/v1/requests response for include HANDSHAKE data</li> 
<li><a href="http://github.com/kasenvr/Iamus/commit/9b7c0cfab9c764215a633089df4070b692f634b0">view &bull;</a> Bump version to 2.2.16</li> 
</ul>

## Version 2.2.15

<ul>
<li><a href="http://github.com/kasenvr/Iamus/commit/117cf5aa7c70d6a42a5c9a5bc50380b708554484">view &bull;</a> Implement DELETE /api/v1/user/connection_requests Closes #41</li> 
<li><a href="http://github.com/kasenvr/Iamus/commit/3fca72713689706104a4e37aeeaa88cfbaaa7381">view &bull;</a> For /api/v1/user/heartbeat, return the location node_id for 'session_id'.     This attempts to change the problem reported in kasenvr/project-athena:#776</li> 
<li><a href="http://github.com/kasenvr/Iamus/commit/48de45bc760ae575c26e0332f3a31daf91e59ce0">view &bull;</a> Bump version to 2.2.15</li> 
</ul>

## Version 2.2.14

<ul>
<li><a href="http://github.com/kasenvr/Iamus/commit/468612165c203c76eeb360786139dc759a1e4e65">view &bull;</a> AccountEntity.username.validate: verify that the set username is unique     But, at the same time, fix things so one cannot change your username as     all connections would have to change. AccountEntity.email.validate: verify that the set email is unique</li> 
<li><a href="http://github.com/kasenvr/Iamus/commit/23282bf70662de02d92fae9305802977a0ca0df6">view &bull;</a> Add some awaits so request_connection waits for things to finish before returning.</li> 
<li><a href="http://github.com/kasenvr/Iamus/commit/a3e721dcd4ea9fd9ff81419a2ac2b4d97b601a16">view &bull;</a> Add check to POST /api/v1/users making sure created account has unique email Closes #42</li> 
<li><a href="http://github.com/kasenvr/Iamus/commit/84ef3f21c1fb6da564b6baed5f9ed18885074a3e">view &bull;</a> Rework Accounts.makeAccountFriends and Accounts.makeAccountsConnected to use     the set account field functions to check for dups, etc</li> 
<li><a href="http://github.com/kasenvr/Iamus/commit/c6e73908c98617a4df2e6151a5bb52e4344abf18">view &bull;</a> Fix user location reporting (wasn't working)     Add missing field definitions for location     Recode updateLocationInfo to use setAccountField and use new field definitions     Add missing awaits</li> 
<li><a href="http://github.com/kasenvr/Iamus/commit/881d5bd76a6caad6de059ef3b6551667d74c7625">view &bull;</a> lean up update code using Util.SimpleObject rather than inline objects Change so field rename message is only output if a field is renamed</li> 
<li><a href="http://github.com/kasenvr/Iamus/commit/00019b94a2f3f1a98fe91350cf9073dd9ff6d035">view &bull;</a> Correct expiration of special admin token     Caused some internal field sets to fail because token tested expired.</li> 
<li><a href="http://github.com/kasenvr/Iamus/commit/d825ef3d39d90e4f27517a178fa3551e68b61c5d">view &bull;</a> Validate path fields with regex for "domainname/float,float,float/float,float,float,float"     Add test routines for path validation. Remove async/await on simple SArray format checks</li> 
<li><a href="http://github.com/kasenvr/Iamus/commit/9cf99cc14ac1bdfc800db54fe18d3f00b5af0bb2">view &bull;</a> Bump to version 2.2.14</li> 
</ul>

## Version 2.2.13

<ul>
<li><a href="http://github.com/kasenvr/Iamus/commit/79ded5dc1559e933cff0a8662c9aa9cb5c4353d7">view &bull;</a> Define AccountEntity.availability as string[] Add 'friend' to AccountEntity.accountFields.friends.get_permissions Validate set value in AccountEntity.accountFields.roles (verify legal value) Fix logic in Permissions.isValidSArraySet to properly check for passed SArray Add function Permissions.verifyAllSArraySetValues Improve Permissions.sArraySetter to not fail if passed field doesn't exist Add class for AccountAvailability Add maint test routine to test SArray manipulation routines</li> 
<li><a href="http://github.com/kasenvr/Iamus/commit/be0c9d7781001ce5d92320223fa2fee4c182701b">view &bull;</a> Accept 'access_token' in request query if it's not supplied in Authoriztion: header. AccountEntity.availability: verify set values are always legal.</li> 
<li><a href="http://github.com/kasenvr/Iamus/commit/d1e3109a35554ebab5dad26d958805e7bff01d15">view &bull;</a> Return both 'id' and 'domainId' for the domain ID when returning domain info     This fixes some problems on the domain-server settings page If account is specified in /api/v1/domains/temporary, associate that account with the domain and place     This makes "Get temporary domain name" on the domain-server settings page work correctly Return both 'domain' and 'place' information when creating a new domain</li> 
<li><a href="http://github.com/kasenvr/Iamus/commit/9437e7551829df4f1b07c39a087e14110b93f8f3">view &bull;</a> Bump version to 2.2.13 Upgrade NPM packages.</li> 
</ul>

## Version 2.2.12

<ul>
<li><a href="http://github.com/kasenvr/Iamus/commit/ffd6ac0e0a6d33eb3453ecc9d28025fb92719036">view &bull;</a> Add GET /api/v1/user/connections     Closes #39 Clean up code in /api/v1/user/friends to use newer get/set field routines. Initialize Account and Domain string array fields.</li> 
<li><a href="http://github.com/kasenvr/Iamus/commit/2f6e1bdb423cae7b0766c14634baf400482a2609">view &bull;</a> URI decode parameters for use in username search. Closes #40</li> 
<li><a href="http://github.com/kasenvr/Iamus/commit/d16383a870a8e94a926661286ddd46f468f4727d">view &bull;</a> Fix bug where input fields were not validataed properly.     People could create account names with spaces.</li> 
<li><a href="http://github.com/kasenvr/Iamus/commit/c3bc0ca99c631dc7ec0a4a415eb81c23ce7c38d7">view &bull;</a> Enforce domain names to start with an alphabetic character.</li> 
<li><a href="http://github.com/kasenvr/Iamus/commit/de8daaaf80fa399ed0eab6b20e09c04def982f7f">view &bull;</a> Bump version to 2.2.12</li> 
</ul>

## Version 2.2.11

<ul>
<li><a href="http://github.com/kasenvr/Iamus/commit/3ee157fcf9e976292579032ba20a8cadeeeaa13a">view &bull;</a> Remove 'Relationship' class, db collection. Simplify connection and friend relationship to be just arrays in Account.</li> 
<li><a href="http://github.com/kasenvr/Iamus/commit/4982c7395289b6f666da722fc42b13a5f0b4ff9b">view &bull;</a> Fix line endings.</li> 
<li><a href="http://github.com/kasenvr/Iamus/commit/b23d9dcfe82f4408e6f468494e7e5f775b899de6">view &bull;</a> FIX: problem where account could not update its own fields.     Permission check was wrong for OWNER Closes #38</li> 
<li><a href="http://github.com/kasenvr/Iamus/commit/ac6fbeb2a5fe2e3ce44c62e2752db296bb04a1cd">view &bull;</a> Make Place names globally unique.     Check to make sure there is not another when changing Place name. Make per-field validators async so they can do lookup functions. Closes #30</li> 
<li><a href="http://github.com/kasenvr/Iamus/commit/b26522836178295570044a664f9f1eae236490e4">view &bull;</a> Allow setting of domainId in Place to point domain to new domain.     Check to make sure have permission and target domain exists. Closes #29</li> 
<li><a href="http://github.com/kasenvr/Iamus/commit/7b7e292916b3c2076d9edfbaf9b23dfc620b95f8">view &bull;</a> Add Permissions.noOverwriteSetter to fix problem when updating domain     info from settings page which tends to overwrite domain data.</li> 
<li><a href="http://github.com/kasenvr/Iamus/commit/412fd620567dc57e3a47ba9a7c49c27ca7387f92">view &bull;</a> Bump version to 2.2.11</li> 
</ul>

## Version 2.2.10

<ul>
<li><a href="http://github.com/kasenvr/Iamus/commit/4f630998d304aa7add2d697dce415c8ddc5b17bf">view &bull;</a> Allow direct paths to be used for the tokengen URL. (#35)</li> 
<li><a href="http://github.com/kasenvr/Iamus/commit/deb377d7219170e074b36eae576588b123dce10a">view &bull;</a> Fix Typescript compile error rule (camelcase variable names)</li> 
<li><a href="http://github.com/kasenvr/Iamus/commit/6380423db875291710d48bd855840ca562f4f5ed">view &bull;</a> Bump version number to 2.2.10</li> 
</ul>

