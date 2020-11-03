# Iamus Changelog
## Version 2.2.22

<ul>
<li><a href="http://github.com/kasenvr/Iamus/commit/9e98dc82bb0fab9ae2b0ffa3e58111de024ba1cb">view &bull;</a> Update ChangeLog.md</li> 
<li><a href="http://github.com/kasenvr/Iamus/commit/650824f948c3d905ebc2242147d32364b0170914">view &bull;</a> Remove the one-time, DB fix for bad domain network addresses.</li> 
<li><a href="http://github.com/kasenvr/Iamus/commit/4e81b42308fb55b78d6b6a4fd625d0f9917b0ed7">view &bull;</a> Add 'BRANCH' argument to Dockerfile for optional branch building</li> 
<li><a href="http://github.com/kasenvr/Iamus/commit/cfdaf535927a3d02a03d547fa7e7c24284bd9ddd">view &bull;</a> Modify the connection building code for /api/v1/users/connections.</li> 
<li><a href="http://github.com/kasenvr/Iamus/commit/e4a58caca81fbd274e919591c219ddcc508baf01">view &bull;</a> Correct 'location' element name in /api/v1/users/connections. Add documentation for /api/v1/users/connections</li> 
<li><a href="http://github.com/kasenvr/Iamus/commit/44a371d26d2564308e2654c9db9318291da6fea6">view &bull;</a> Add pagination response fields to /api/v1/users/connections. Add response field function to other criteria filters.</li> 
<li><a href="http://github.com/kasenvr/Iamus/commit/292681ac5e7e41dbdb0451714eaca27e9bbc663f">view &bull;</a> Implement POST /api/v1/user/friends so a user can make a connection into a friend.</li> 
<li><a href="http://github.com/kasenvr/Iamus/commit/b3776e16c969bf5328dbb7f524d0c845166d5cdb">view &bull;</a> Allow an account to add any connection or friend they wish</li> 
<li><a href="http://github.com/kasenvr/Iamus/commit/24c9c956fffd1db523f9f232ec42c3dbb0f69144">view &bull;</a> Change /api/v1/users/connections response to have proper connection type flag.     The code seemed to want "is_friend" but it really wants just "friend". Update documentation for /api/v1/users/connections</li> 
<li><a href="http://github.com/kasenvr/Iamus/commit/8ddfdab9df65206edfb927ba25b7fe3c939088c5">view &bull;</a> Bump version to 2.2.22</li> 
</ul>

## Version 2.2.21

<ul>
<li><a href="http://github.com/kasenvr/Iamus/commit/55271bbe7b37e7b5c9aae9fa8f30f0f4256fa351">view &bull;</a> Update ChangeLog.md</li> 
<li><a href="http://github.com/kasenvr/Iamus/commit/a64ea50eccdae4001d362b7523bc8caeb391c7b3">view &bull;</a> Add parameter to stats requests "history=no" which doesn't return histograms.</li> 
<li><a href="http://github.com/kasenvr/Iamus/commit/c124e8548d2e13f00999d1615ea52e5d72230ffa">view &bull;</a> Debug stat "?history=no" query parameter for categories. Add documentation on history suppression to API-Monitoring.md</li> 
<li><a href="http://github.com/kasenvr/Iamus/commit/a59452440edc2c93dd792b080395a8e9238d25f7">view &bull;</a> Add Domain timer to check for non-heartbeating domains and to zero reported users. Add Config.metaverse-server.domain-seconds-until-offline = 10*60 Allow 'admin' to set Domain num_users and num_anon_users (for debugging). Closes #43</li> 
<li><a href="http://github.com/kasenvr/Iamus/commit/fe70496ad98d0816c57097f7910cfe7d68ba501b">view &bull;</a> Add stats category 'metaverse'. Add Accounts.countAccouts and Domains.countDomains for collecting of number of filtered entities     Add Db.countObjects(criteria) to do database count operation Make stats.Gather operation async so it can do database operations. Add documentation for 'metaverse' stat category</li> 
<li><a href="http://github.com/kasenvr/Iamus/commit/918ae7717f7131e22e624570708490a1f8cf1c24">view &bull;</a> Add initialization of stats category 'metaverse'.</li> 
<li><a href="http://github.com/kasenvr/Iamus/commit/259c4d6fbcbef43e90e716ed4744940607d33d84">view &bull;</a> Add stats.metaverse debugging statements. Add debugging logging to Db.countObjects.</li> 
<li><a href="http://github.com/kasenvr/Iamus/commit/4296b939a4af475adec3ceab988c3042d185a01a">view &bull;</a> Fix line endings to Linux style.</li> 
<li><a href="http://github.com/kasenvr/Iamus/commit/9ff50dea5b5fb41c584ca732c005896db0885292">view &bull;</a> Fix Db.countObjects to use the passed criteria.</li> 
<li><a href="http://github.com/kasenvr/Iamus/commit/b6f928c07628f820ab35062fe1b31de7fa44a6ee">view &bull;</a> Return idle and inactive times as strings in Accounts and Domains</li> 
<li><a href="http://github.com/kasenvr/Iamus/commit/a7be99a9052988c41261cfcdaed1765889d10493">view &bull;</a> Return Date for idle and offline Account and Domain dates. Properly invoke date fetchers in monitoring code.</li> 
<li><a href="http://github.com/kasenvr/Iamus/commit/55c7c5da8699e2e4cf45380337a2d07de5b65000">view &bull;</a> Remove chatty debug logging in stats.metaverse.</li> 
<li><a href="http://github.com/kasenvr/Iamus/commit/548ed92935d7faf8d4ebc062fe0301a811c7af0d">view &bull;</a> Add 'admin' ability to set 'connections' and 'friends' in AccountEntity.     Was preventing handshakes from working.</li> 
<li><a href="http://github.com/kasenvr/Iamus/commit/da160e075b345fd24b960b8210367343816d6341">view &bull;</a> Add more error logging in setEntityField processing</li> 
<li><a href="http://github.com/kasenvr/Iamus/commit/2928148e8962b57e0d2be65f7b1d4c8f1e69d463">view &bull;</a> Split Permissions.ts into Permissions.ts and GetterSetter.ts to better modularize functions. Re-order module inclusion to "fix" (??) variables not getting initialized. Add code to Accounts and Domains to verify entity field structure is initialized     There is some ordering problem that causes the function to not get set in the const assignment Replace all instances of FieldDefn getters and setters with "noGetter" rather than "undefined" Add "automatic_networking" to DomainEntity</li> 
<li><a href="http://github.com/kasenvr/Iamus/commit/ec220c27add73c30d581d1ad6e0bd1c3f03a62e3">view &bull;</a> Rename Domains.network_mode to Domains.automatic_networking which is     what the existing domain-server code uses. Update documentation to remove "network_mode" and replace with "automatic_networking"</li> 
<li><a href="http://github.com/kasenvr/Iamus/commit/f58fdefbc47f37f9bcdaf314d14c970b4c358b17">view &bull;</a> Remove code that assumed domain-server network address was connection IP addr.     The immediate connection can be from a proxy server so it's often wrong.     More design and debugging is needed for this feature. Add /api/maint/fixDomainIP to allow an admin to clean out bad domain IP addresses.</li> 
<li><a href="http://github.com/kasenvr/Iamus/commit/9cd564701196f3b5fe118003b25bbe0c897c5135">view &bull;</a> Get login account info for fixDomainIP maint operation.</li> 
<li><a href="http://github.com/kasenvr/Iamus/commit/b515cd2c546dce221747410484e9415a4eb4be29">view &bull;</a> Bump version to 2.2.21</li> 
</ul>

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

