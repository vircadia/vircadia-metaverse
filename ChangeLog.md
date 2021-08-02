# Iamus Changelog
## Version 2.4.6

<ul>
<li><a href="http://github.com/vircadia/Iamus/commit/116736262060732ac43544b4ad3a92cd4c63845f">view &bull;</a> update ChangeLog.md for 2.4.5</li> 
<li><a href="http://github.com/vircadia/Iamus/commit/a0b63aa5989a74dcb75510df61ee4a288e349746">view &bull;</a> Places: fix 'path' so it just returns the domain local address while     'address' returns the join of the domain's network address and the 'path'. Disables setting PlaceEntity.address.</li> 
<li><a href="http://github.com/vircadia/Iamus/commit/5f5a7f1cef0d30af0a1821bc6d843bbf8c971e91">view &bull;</a> Add checks to make sure Place, Domain, and User names are not set to zero length strings.</li> 
<li><a href="http://github.com/vircadia/Iamus/commit/1e353bfe7a9daa70259fd543c44fcd8be9f46d00">view &bull;</a> Places: minor tweeking to how last activity time is computed for a Place     Now only updated by periodic Place activity check process.</li> 
<li><a href="http://github.com/vircadia/Iamus/commit/82f3b18687c353c5363aa18f8855a17f85087f8b">view &bull;</a> Add comments about changing usernames and what must be done in all the name lists.</li> 
<li><a href="http://github.com/vircadia/Iamus/commit/5e3732b76f171912860f2bc17a010cc6019f1592">view &bull;</a> Repair setting of domain to active=false when domain stops heartbeating.     Closes #95 Add config parameter 'domain-seconds-check-if-online' for domain active polling interval. Add some descriptive comments to some configuration parameters.</li> 
<li><a href="http://github.com/vircadia/Iamus/commit/d750b4eee0d616a831a24aa67178a264d781c882">view &bull;</a> Add alternate date format fields for all returned JSON status. Adds "_s" version of string date formats with time represented as a UNIX epoch time integer. Fixes #93</li> 
<li><a href="http://github.com/vircadia/Iamus/commit/c1fe41f5a93edd0bbd248839753cf59294e33cf5">view &bull;</a> Bump version to 2.4.6</li> 
</ul>

## Version 2.4.5

<ul>
<li><a href="http://github.com/vircadia/Iamus/commit/41fb4e3e210834d68768e1aef234fb699c585a61">view &bull;</a> Update ChangeLog.md</li> 
<li><a href="http://github.com/vircadia/Iamus/commit/4cd620c01bb8986af037f5e6e2fb5971ad0501f9">view &bull;</a> Return "no account" error for /api/maint/places requests if account is not specified.</li> 
<li><a href="http://github.com/vircadia/Iamus/commit/9b174a791c0e28e82d68380ab50b8221a1776f89">view &bull;</a> Non-functional fix of indention in Util.ts (2 to 4)</li> 
<li><a href="http://github.com/vircadia/Iamus/commit/7029f557ef52a5efcc2c64456670b9c1d9765a53">view &bull;</a> Add list of managers to Places and enable manager list and permissions:     Add Permission.MANAGER     Add PlaceEntity.managers     Update Place field definitions so allow setting by managers     Validate manager name settings</li> 
<li><a href="http://github.com/vircadia/Iamus/commit/c713094481e6c6a1a0342e3630cae0e501548656">view &bull;</a> Places: fix logic for computing PlaceEntity.lastActivity that wasn't computing     correctly if the host domain didn't have an heartbeats.</li> 
<li><a href="http://github.com/vircadia/Iamus/commit/2319e072ee3f54e66da1599fdab8460ac57f2d37">view &bull;</a> Places: add configuration for interval for checking Place lastActivity timeout     Tune times for inactivity and current info update activity.</li> 
<li><a href="http://github.com/vircadia/Iamus/commit/b505cd940579c8a5d0cc019543717a36d7f2cb57">view &bull;</a> Bump verion to 2.4.5</li> 
</ul>

## Version 2.4.4

<ul>
<li><a href="http://github.com/vircadia/Iamus/commit/2dc2adfbf745a483e3f8c8f39d736795468f5d08">view &bull;</a> Update ChangeLog.md</li> 
<li><a href="http://github.com/vircadia/Iamus/commit/f665ee214b9ef6b0b4b7fa34a94f6007a16de6fc">view &bull;</a> Add limit to number of characters in names for Domains, Users, and Places. Add config parameter metaverse-server.max-name-lenght defaulted to 32. Closes #91</li> 
<li><a href="http://github.com/vircadia/Iamus/commit/a871f5982570b0c5a18c8e0a4142cccca9b53822">view &bull;</a> Non-functional tweek to make an error message more informative</li> 
<li><a href="http://github.com/vircadia/Iamus/commit/edb3c26041b014d1750297a843c64262704a3a98">view &bull;</a> Non-functional fixing of source indentation in route-tools/Permissions.ts.</li> 
<li><a href="http://github.com/vircadia/Iamus/commit/1f055a6c7d3762d44aafcda19d57195bdc161182">view &bull;</a> Rework Places request data setup and permissions     Don't lookup Place's domain when doing initial request parameter setup     Fix permission lookup to use DOMAINACCESS Closes #92</li> 
<li><a href="http://github.com/vircadia/Iamus/commit/6ca25d3a8cb3aefd1afe542f004daf5519611109">view &bull;</a> Bump version to 2.4.4</li> 
</ul>

## Version 2.4.3

<ul>
<li><a href="http://github.com/vircadia/Iamus/commit/5509f626995dadd63a897ad96b77940a480beb2d">view &bull;</a> Update ChangeLog.md</li> 
<li><a href="http://github.com/vircadia/Iamus/commit/09edda774cf1416b3901989d1f7bd8fadb149aaf">view &bull;</a> Places: add initPlaces()     Add periodic computation of Place attendance and activity and add these     to fields on Places for easy computation of attendance and staleness.     This adds a once a minute scan of places to check activity.</li> 
<li><a href="http://github.com/vircadia/Iamus/commit/12f635a0702f23e7014074b3ec5bed1e9035f553">view &bull;</a> Centralize date when places are not active in Places.dateWhenNotActive()</li> 
<li><a href="http://github.com/vircadia/Iamus/commit/24020bdda186e1badcb0abce59417253b50b6626">view &bull;</a> Places: make functional queries for places: status=online,active</li> 
<li><a href="http://github.com/vircadia/Iamus/commit/bafe73bb0cc025f407fdc85343cc8da379b6ca88">view &bull;</a> Add admin maint functions /api/maint/places/inactive and /api/maint/places/unhooked     with both GET and DELETE functions.</li> 
<li><a href="http://github.com/vircadia/Iamus/commit/737e2d00cd09c428268660672460db12414258f8">view &bull;</a> Bump version to 2.4.3</li> 
</ul>

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

