# Iamus Changelog
## Version 2.4.2

<ul>
<li><a href="http://github.com/vircadia/Iamus/commit/2521dc9e79fd1ceaabae68636bf659ce9b1659a9">view &bull;</a> Update ChangeLog.md</li> 
<li><a href="http://github.com/vircadia/Iamus/commit/24e561e8701591b4f38d5c290cab095367b91abf">view &bull;</a> Update NPM package versions.     Gets rid of a possible security problem in one of the libraries.</li> 
<li><a href="http://github.com/vircadia/Iamus/commit/6d064b757e8b68ba77d90b9ea0ff39481435e52c">view &bull;</a> Fix access permission bug where request would not complete if the a non-logged in user checked ADMIN access to an entity.</li> 
<li><a href="http://github.com/vircadia/Iamus/commit/881162de6cd704ea7bf132db51f7d5f69b03d572">view &bull;</a> In returned Places info, return the domain's last heartbeat time     for current_last_update_time if there was not a current time set.</li> 
<li><a href="http://github.com/vircadia/Iamus/commit/36359c2197035e4b0671e317d6df02a2e4c6c9a3">view &bull;</a> Add comments in api/v1/places about not needing to be logged in to fetch place info</li> 
<li><a href="http://github.com/vircadia/Iamus/commit/2a42438b1b0d3f21c0a14016738ee4909723b7b0">view &bull;</a> Fix DELETE of places when using "DELETE /api/v1/user/places/:placeId". Also fix fetching info of single place using "GET /api/v1/user/places/:placeId". Closes issue #88</li> 
<li><a href="http://github.com/vircadia/Iamus/commit/07816497bc136d4ebceb34249fd87369dfede9bb">view &bull;</a> Bump version to 2.4.2</li> 
</ul>

## Version 2.4.1

<ul>
<li><a href="http://github.com/vircadia/Iamus/commit/a269b7015d5993b0f84a7a2c1bfa11c4036434fc">view &bull;</a> Update ChangeLog.md</li> 
<li><a href="http://github.com/vircadia/Iamus/commit/2982560c3749eacf6b29d4210052ff9bf220bd79">view &bull;</a> Remove comment and README references to ActivityPub since that is not     an explicit goal. Some federation system will be used but one has     not been chosen.</li> 
<li><a href="http://github.com/vircadia/Iamus/commit/03b96cb03447c774328fd927265025dec2a9172b">view &bull;</a> Bump version to 2.4.1</li> 
</ul>

## Version 2.3.17

<ul>
<li><a href="http://github.com/vircadia/Iamus/commit/91d5b790e49ee1353e466e9e2469b74cc0af9d68">view &bull;</a> Update ChangeLog.md</li> 
<li><a href="http://github.com/vircadia/Iamus/commit/6b7ca04fee6831ec3fefe50b77407619451f7a74">view &bull;</a> Add domain capacity to domain info returned for Places. Closes #84</li> 
<li><a href="http://github.com/vircadia/Iamus/commit/7138965758c463861b2cd43f635093f800247723">view &bull;</a> Add documentation on what's returned when an account is created.     Includes information on whether account is awaiting verification.</li> 
<li><a href="http://github.com/vircadia/Iamus/commit/c4b7bdaaa42a441cef0f215af98c67f90247d54b">view &bull;</a> Initial version of Github Action to build Iamus Docker image on     push to 'master' branch.</li> 
<li><a href="http://github.com/vircadia/Iamus/commit/f42e2db4b7d8e88297d36734aaaa0d2e8226fd02">view &bull;</a> workflows/docker-publish.yml: Correct version fetch of built Docker image.</li> 
<li><a href="http://github.com/vircadia/Iamus/commit/48a6a59114a128337060afc2c07476875b7fe710">view &bull;</a> workflows/docker-publish.yml: Docker image tag names must be lower case</li> 
<li><a href="http://github.com/vircadia/Iamus/commit/9931a92b1755c65600b23942b5efa5670b6e94fa">view &bull;</a> workflows/docker-publish.yml: remove interactive parameters from version docker invocation.     Add explanation comments.</li> 
<li><a href="http://github.com/vircadia/Iamus/commit/e28c49c6831cc1a7b4c9b2b4e8aa47a13412b782">view &bull;</a> workflows/docker-publish.yml: remove comments and add some explanation comments</li> 
<li><a href="http://github.com/vircadia/Iamus/commit/b38b693ee7c37a268fe9c4a18fe74393912ecea1">view &bull;</a> Add scripts for running, updating, restarting, and stopping Docker image. Add docker/README.md to explain the use of the Docker image scripts. Update docs/RunningDockerImage.md with new repository location and     updated notes on running.</li> 
<li><a href="http://github.com/vircadia/Iamus/commit/33847c790d8740f6466cf5a0fd0185957f8c0f53">view &bull;</a> Bump version to 2.3.17</li> 
</ul>

## Version 2.3.16

<ul>
<li><a href="http://github.com/vircadia/Iamus/commit/747ea7b94c816798397d8da6227f7bd25cf47156">view &bull;</a> Bump version to 2.3.15</li> 
<li><a href="http://github.com/vircadia/Iamus/commit/2243f6f0e48e9799b8b7190da68a9813034b5648">view &bull;</a> Update ChangeLog.md</li> 
<li><a href="http://github.com/vircadia/Iamus/commit/6d84f98bc640840d8066412e0a5351f18ad4d42b">view &bull;</a> Add initial version of docs/ResrouceLimitNotes.md</li> 
<li><a href="http://github.com/vircadia/Iamus/commit/e49048b332558bff0c5751c80de07fae08440bac">view &bull;</a> Small formatting tweaks to docs/ResourceLimitNotes.md</li> 
<li><a href="http://github.com/vircadia/Iamus/commit/94a1633651306025652742f536f4c40b74585322">view &bull;</a> Make temp domain name creation optional. Defaults to disabled.</li> 
<li><a href="http://github.com/vircadia/Iamus/commit/608e8a2f33cbc7eb12b694608ff58152e4a5d643">view &bull;</a> Update tabbing to 4 spaces in token.ts. No functional change.</li> 
<li><a href="http://github.com/vircadia/Iamus/commit/6a482b7a6f3f0a3df285a45f4a2d39f6fbb10ad7">view &bull;</a> Add Config.metaverse-server.enable-account-email-verificiation Add AccountEntity.accountEmailVerified boolean field Add logic to not create account auth token if account email not verified     Assume verified if 'accountEmailVerified' field not present for backward compatability</li> 
<li><a href="http://github.com/vircadia/Iamus/commit/16b965bf886283d03d23024255ecd953c026b372">view &bull;</a> Gigantic reformatting changing tabs from 2 to 4. No functional changes.</li> 
<li><a href="http://github.com/vircadia/Iamus/commit/418811fdd22ecf724da04d03ca2da521c4463ba7">view &bull;</a> Initial version of verify account email on account creation. Add configuration parameters for optionally enabling account email validation step.     Default 'false'.     Configuration parameters for Nodemailer SMTP out-bound permissions. Add 'validated' property to account.     Limit creation of access tokens to validated accounts. Add 'verifyEmail' Request type. Add /api/v1/account/verify/email to accept GET request for validation. Add /static/verificationEmail.html as template for sent email.     Replacement parameters in template for metaverse name</li> 
<li><a href="http://github.com/vircadia/Iamus/commit/f374a6d3c403cfbc157c376a921c2262e48221bf">view &bull;</a> Add very minimal Account email verification redirection targets</li> 
<li><a href="http://github.com/vircadia/Iamus/commit/f96504d463712d02f0c02874cb3b1e0b4d3712fd">view &bull;</a> Add redirection configuration and URLs for account email verification success and failure.</li> 
<li><a href="http://github.com/vircadia/Iamus/commit/a690b49982cc56fec1f09c747ac8fa410a6a28d8">view &bull;</a> Make config.ts have consistant 4 space indents. No function changes.</li> 
<li><a href="http://github.com/vircadia/Iamus/commit/6e2ae14e7c31b8c1d4bb4e9a15f069db7dff865e">view &bull;</a> Make default account email verification period to be one day.</li> 
<li><a href="http://github.com/vircadia/Iamus/commit/5fac583ee1d027b68ad384c13c079125b6854215">view &bull;</a> Add "enabled" to information returned with account Return enabled information when account created (so requestor can know if awaiting enablement) Centralize logic to test for account enabled in Accounts.isEnabled() Documentation     Add additional information returned by create account request</li> 
<li><a href="http://github.com/vircadia/Iamus/commit/641112cffcdb5cceef5652e91bbdf89ca449a807">view &bull;</a> Fix problem where admin account name has no default in configuration file.</li> 
<li><a href="http://github.com/vircadia/Iamus/commit/8a2af18961f9c402f545d86fdb6ed9b24f740766">view &bull;</a> Update documentation with new file "AdministrationNotes.md" which has explanation of account email verification and initial admin account creation.</li> 
<li><a href="http://github.com/vircadia/Iamus/commit/91d566452f16893fea8896761a3146c36e4e4c79">view &bull;</a> Add comment in config.ts for VERIFICATION_URL replacement</li> 
<li><a href="http://github.com/vircadia/Iamus/commit/5c8d002b8f5b8119d16832b6cdae3566e7decd9c">view &bull;</a> Adding some comments</li> 
<li><a href="http://github.com/vircadia/Iamus/commit/787c7903761bcb376d296569aeafa1e6a77197c4">view &bull;</a> Bump version to 2.3.16</li> 
</ul>

## Version 2.3.15

<ul>
<li><a href="http://github.com/vircadia/Iamus/commit/e58ece2f451b33971c6d4de2f4d8985771661082">view &bull;</a> Update Changelog.md</li> 
<li><a href="http://github.com/vircadia/Iamus/commit/1201064098fabd50b490081310cc546b9d341998">view &bull;</a> Fix DB error when filtering Places for openness. Modify /api/v1/places to only return Places that have an associated domain. Modify /api/v1/places to not require logging in to get Places list.</li> 
<li><a href="http://github.com/vircadia/Iamus/commit/b6799ed94315f9d25e5d5eb78c122f505b6d5fb0">view &bull;</a> Add VisibilityFilter and rework logic that returns Places and Domains     so "open" and "private" work depending on the 'visibility' setting.</li> 
<li><a href="http://github.com/vircadia/Iamus/commit/1f58e1575963312a9ac1d57bbc5988e389ef4d92">view &bull;</a> Add 'active' boolean to a domain to denote if the domain is heartbeating Include 'active', 'protocol', and 'version' is domain information in Place returned info Update number of domain reported users to be sum of logged in and anonymous avatars Reorder Place return tests so /api/v1/places does not return Places with no domains Update documentation on return of added fields for Places</li> 
</ul>

## Version 2.3.14

<ul>
<li><a href="http://github.com/vircadia/Iamus/commit/da3e3628f0bb0e003bc332d245071518a61dad95">view &bull;</a> Update ChangeLog.md</li> 
<li><a href="http://github.com/vircadia/Iamus/commit/6ad6fde681ecde16a5686b71e02e8e5999136e14">view &bull;</a> Finish query search criteria for Places     Added code for "search="     Completed and debugged code for "order=" Completed and debugged Db sortCriteria code.</li> 
<li><a href="http://github.com/vircadia/Iamus/commit/cd62e04bea6a1478475713e6f2697840a20cd935">view &bull;</a> Add 'visibility' field to Places and Domains.     Currently default to "OPEN" but allow "PRIVATE"</li> 
<li><a href="http://github.com/vircadia/Iamus/commit/2992085df3d9032f89669f7b61bbd268f3715385">view &bull;</a> Fix formatting of docs/API-Explore.md</li> 
<li><a href="http://github.com/vircadia/Iamus/commit/2cef6bad6551d7ff12569259e83a984d47674bae">view &bull;</a> Fix missing definition that caused compilation error.</li> 
<li><a href="http://github.com/vircadia/Iamus/commit/3c368663b3385d3b00e233b3553c1b9f38b51fb4">view &bull;</a> Bump version to 2.3.14</li> 
</ul>

## Version 2.3.13

<ul>
<li><a href="http://github.com/vircadia/Iamus/commit/7bdfdb0bc899dcc7a81941d47777d8321fbbd10b">view &bull;</a> Update ChangeLog.md</li> 
<li><a href="http://github.com/vircadia/Iamus/commit/0b84cfb886e38c0bad07a79a0da8517bf6e62ebe">view &bull;</a> Fix return data for /explore.json so results are returned rather than the Promise</li> 
<li><a href="http://github.com/vircadia/Iamus/commit/b43084967d9c940cc06272fa2744808caca183c9">view &bull;</a> When generating Place address, check for domain address of "undefined" as     there are a bunch of bad entries in the database.</li> 
<li><a href="http://github.com/vircadia/Iamus/commit/b72262c3210dcce6eac32a96cf8a5cc4792a53f1">view &bull;</a> Constrain Domain.Restriction to "open", "hifi", or "acl".</li> 
<li><a href="http://github.com/vircadia/Iamus/commit/b7c32fc799f6709ef7f395f1925b4a837979bdef">view &bull;</a> Bump version to 2.3.13</li> 
</ul>

## Version 2.3.12

<ul>
<li><a href="http://github.com/vircadia/Iamus/commit/190bf213309b02dd23ef40ea81e5431fc6a46944">view &bull;</a> Update ChangeLog.md</li> 
<li><a href="http://github.com/vircadia/Iamus/commit/55f42d7bf336d112a54dd097ea7a4b4dba38256b">view &bull;</a> Add "world_name" as an alias for "name" in the domain information     return JSON to enable some legacy scripts/code.</li> 
<li><a href="http://github.com/vircadia/Iamus/commit/f69fc3d6d087c33c03782be2cc558b0e6a0791e4">view &bull;</a> Update defintions of property getters and setters so they are clearly async.</li> 
<li><a href="http://github.com/vircadia/Iamus/commit/9ba59b51b7a47e46eb2620bf38d8766d24f23aad">view &bull;</a> Update redirect URL. (#79)</li> 
<li><a href="http://github.com/vircadia/Iamus/commit/3dfd4c4bc76c8a0080960bb70c7edbf068a4e0db">view &bull;</a> Bump version to 2.3.12</li> 
</ul>

## Version 2.3.11

<ul>
<li><a href="http://github.com/vircadia/Iamus/commit/d1ef1857d4c12856122028dbd591b7ef8f53b66f">view &bull;</a> Add logic to Tokens.createToken() for better expiration time computation:     0 says default, N says number of hours, and -1 says 'infinite'.</li> 
<li><a href="http://github.com/vircadia/Iamus/commit/2ac1150307e8daa1ab2d7f450ab805d6bf791136">view &bull;</a> Make entity field 'getter' to be async.</li> 
<li><a href="http://github.com/vircadia/Iamus/commit/de32d0a392fe467942d993dfc70e68bdd06469a2">view &bull;</a> Update callers of entity field 'getters' to be async</li> 
<li><a href="http://github.com/vircadia/Iamus/commit/15c9ebba7776a87bcd139590cfa35d099f245eb7">view &bull;</a> Make entity field 'setters' async.     Update utility functions so 'setters' are all async</li> 
<li><a href="http://github.com/vircadia/Iamus/commit/3a3a0c3528b7ff1b5c90f43a8795bb4811da10c6">view &bull;</a> Update callers of entity field 'setters' to be async</li> 
<li><a href="http://github.com/vircadia/Iamus/commit/cbcd8b4f66e5f5a93737e47cd6e7507bf66409d4">view &bull;</a> Make Places.createPlace() async. Update callers to Places.createPlace() to await.</li> 
<li><a href="http://github.com/vircadia/Iamus/commit/fa1f04fa2db7d5e547c8b42be260fd489e748444">view &bull;</a> Fix bug is calculating expiration hours when creating a new token.     If hours were specified, the clamped value was not used.</li> 
<li><a href="http://github.com/vircadia/Iamus/commit/e0148fb0639f508fe0f2a00f4e7b24a558edb41d">view &bull;</a> Add PlaceEntity fields for current place state information.</li> 
<li><a href="http://github.com/vircadia/Iamus/commit/585f0edbc78dc89ccdc51403020375732fddacca">view &bull;</a> Correct spelling from 'attendence' to 'attendance'.</li> 
<li><a href="http://github.com/vircadia/Iamus/commit/faea8a2f20e956b401c40b6ba6e7e6234e70a0ef">view &bull;</a> Add comments at the top if the class to show what parameters the     criteria filter parses. Add beginnings of 'status' parameter to PlaceFilerInfo criteria filter Update /api/explore.json to use PlaceFilterInfo</li> 
<li><a href="http://github.com/vircadia/Iamus/commit/c7d61509ed4035530bde08547b8407772dd388ea">view &bull;</a> Move Place attendance calculation to Places.ts Add current information to returned Place info structure Default Place attendance zero timeout to be 60 minutes.</li> 
<li><a href="http://github.com/vircadia/Iamus/commit/d6eaf01e19eb4a6e27df510226b346876931a6f9">view &bull;</a> Distinguish between a "path" ("/pos/rot") and an "address" (netaddr/pos/rot)     Rename PlaceEntity.address to be PlaceEntity.path     Define get/set for PlaceEntity fields for "path" and "address" with the         latter returning a "domain-network-address/pos/rot"     Restrict PlaceEntity.path validation to "/f,f,f/f,f,f,f"     Update DB to rename existing database fields address->path     Include both "path" and "address" in returned Place JSON information Add new Places functions:     Places.getCurrentInfoAPIKey()     Places.getAddressString() Optionally include APIKey in returned Place JSON for domain owner Add 'Attendance" and current place info to /explore.json response Update API.md description of the place operations</li> 
<li><a href="http://github.com/vircadia/Iamus/commit/40a3a4f6eff0ea5d0a65a9163095ddbe25173a18">view &bull;</a> Add optional domain parameter to get attendance functions to eliminate     refetch of domain.</li> 
<li><a href="http://github.com/vircadia/Iamus/commit/98fa610a35b249a2d5bdf33a6d765008d0daaf9d">view &bull;</a> Update Explore response to include the Place information. Add documentation for /explore.json request.</li> 
<li><a href="http://github.com/vircadia/Iamus/commit/ca75711999d4a30fec561163713166742283375f">view &bull;</a> Add POST /api/v1/places/current Add Places.validateFieldValue() for checking incoming values. Update docs on place APIs</li> 
<li><a href="http://github.com/vircadia/Iamus/commit/9fa357a4a5c8bc5423573af5f4ff53908225fa5a">view &bull;</a> Fix problem where Domain user count was not being zeroed on inactivity.</li> 
<li><a href="http://github.com/vircadia/Iamus/commit/5b86982a8c134c79d5f2b0c2b2f364526a609a0a">view &bull;</a> Add some missing 'await's. Most are just waiting for DB to store.</li> 
<li><a href="http://github.com/vircadia/Iamus/commit/94d95e5d2c47d0db6b3d58448bb2e8be2216a62d">view &bull;</a> Correct test logic for /api/v1/places/current so APIKey works. Remove cut-and-paste error code from same.</li> 
<li><a href="http://github.com/vircadia/Iamus/commit/eb4e3283517de57f5fed15afb8c89824416f1875">view &bull;</a> Update ChangeLog.md</li> 
<li><a href="http://github.com/vircadia/Iamus/commit/42d2162e2f9f4044f74e9855eb35700383bd9912">view &bull;</a> Bump version to 2.3.11</li> 
</ul>

