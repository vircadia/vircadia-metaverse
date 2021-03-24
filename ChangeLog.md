# Iamus Changelog
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

## Version 2.3.10

<ul>
<li><a href="http://github.com/vircadia/Iamus/commit/5cf0673a7e34260743fb834f7cf031fafa8f1657">view &bull;</a> Update ChangeLog.md</li> 
<li><a href="http://github.com/vircadia/Iamus/commit/dc1db4ca1dd6eab7e147048f7c2790483bce939c">view &bull;</a> Have every request return "Not logged in" if an access token is not     included in the request. This makes the user interface more understandable. Modify several requests to report different errors if not logged in     or if parameters are not specified. Makes error more specific. Closes #70</li> 
<li><a href="http://github.com/vircadia/Iamus/commit/c5228616f001f7073b4ab21179cc510dc9de682b">view &bull;</a> Make sure all calls to checkAccessToEntity() are await'ed.     Should fix some wrong access checking.</li> 
<li><a href="http://github.com/vircadia/Iamus/commit/d3568dfe8f95b441009cd492ea19035290d27c8e">view &bull;</a> Change field permissions to use Perm definitions rather than explicit strings.</li> 
<li><a href="http://github.com/vircadia/Iamus/commit/c1676c81d8b972fdd6c7af16729c601867762926">view &bull;</a> Update npm modules.</li> 
<li><a href="http://github.com/vircadia/Iamus/commit/0020502f1cf894860332643fa977c39e575fa18e">view &bull;</a> Properly copy /static directory into /dist output directory. Closes #74</li> 
<li><a href="http://github.com/vircadia/Iamus/commit/b232e2f571f5fe27dc9fa0d103b86e3f5c18b916">view &bull;</a> Add preliminary documentation for new Place design.</li> 
<li><a href="http://github.com/vircadia/Iamus/commit/327e5263de6e8b102e27798d206e4c1d49ce7c5b">view &bull;</a> Bump version to 2.3.10</li> 
</ul>

## Version 2.3.9

<ul>
<li><a href="http://github.com/vircadia/Iamus/commit/75d22ab6786b25262a09face4037ff5b3ba3bc08">view &bull;</a> Update ChangeLog.md</li> 
<li><a href="http://github.com/vircadia/Iamus/commit/8dd3770b043351a8b35a7c52c47ae1608b58163d">view &bull;</a> Update histogram begin time calculation for both EventHistogram and ValueHistogram.     Beginning and end dates were not calculated correctly.</li> 
<li><a href="http://github.com/vircadia/Iamus/commit/0e33a26e983055ee37d2245fb187506e4c36aeaa">view &bull;</a> Add tracking of connected sockets so can force shutdown.     ExpressJS http.server will not close if there are open sockets     so close open sockets when shutting down.</li> 
<li><a href="http://github.com/vircadia/Iamus/commit/d6f162c9f335c1fe528e89f8b52149191a36316e">view &bull;</a> Bump version to 2.3.9</li> 
</ul>

## Version 2.3.8

<ul>
<li><a href="http://github.com/vircadia/Iamus/commit/c1671fa5576c2c7f2aced46647654592882f16ae">view &bull;</a> Update ChangeLog.md</li> 
<li><a href="http://github.com/vircadia/Iamus/commit/8300f8aa96626a7aa5337c7a2af8e92b3047ce32">view &bull;</a> Update DockerFile to pull from the official location: 'vircadia/Iamus'.</li> 
<li><a href="http://github.com/vircadia/Iamus/commit/4d46a409ee853b7bd541603db690e278026b6f54">view &bull;</a> Fix line endings to be UNIX format.</li> 
<li><a href="http://github.com/vircadia/Iamus/commit/73b2b91cc867e54332964652c29a8d4d14d50bf5">view &bull;</a> Remove 'friends' and 'connections' from buildAccountProfile() response.</li> 
<li><a href="http://github.com/vircadia/Iamus/commit/f1bb24c6d42dad66f154d8733d8a20c9b37e4a85">view &bull;</a> Separate error messages for /api/v1/domain/:domainId     separate 'not logged in' from 'domain not found' Add comments on request processors for set variables. Change no auth info error to "Not logged in"</li> 
<li><a href="http://github.com/vircadia/Iamus/commit/198550c165fdd9af55c407fa785b39a0cf71b4e3">view &bull;</a> Clean up 'imports' in Db.ts so all @Tools are together</li> 
<li><a href="http://github.com/vircadia/Iamus/commit/2be04a3f53c56bee58e47db90a68a38ca8c5881c">view &bull;</a> Add comments to request processors making clear set request variables.</li> 
<li><a href="http://github.com/vircadia/Iamus/commit/715e9fbfa0f5d66e26a007d553069ffc27f891a4">view &bull;</a> Add "backup" section to config.ts for the BackupDb.sh script.</li> 
<li><a href="http://github.com/vircadia/Iamus/commit/8a5b14e99d11cc834377104f0223bc6d96dc51a8">view &bull;</a> Fix wrong calculation of monitoring histogram 'timeBase'     'timeBase' should now be the start time of the first bucket.</li> 
<li><a href="http://github.com/vircadia/Iamus/commit/3db9af9be1ce2dd77d56cc20fe671455b9bca9ec">view &bull;</a> Bump version to 2.3.8</li> 
</ul>

## Version 2.3.7

<ul>
<li><a href="http://github.com/vircadia/Iamus/commit/c2350d627178836c5edcd7f2516bdcaf8b28ec59">view &bull;</a> Update ChangeLog.md</li> 
<li><a href="http://github.com/vircadia/Iamus/commit/ad8adc9dd94fa797e978131ccf0e840eda7e77df">view &bull;</a> Update documentation     Clarify that fetching of accounts can be done either by accountId or username. Add comments to AccountScopeFilter to describe its use.</li> 
<li><a href="http://github.com/vircadia/Iamus/commit/c692f2b4081a33673dc5e6006407637a20f21e7d">view &bull;</a> Replace build bash scripts with node.js scripts. (#68)</li> 
<li><a href="http://github.com/vircadia/Iamus/commit/37a4dbee5137ef2da8cb1b876ac86c22baa2c4d5">view &bull;</a> Clean up some code in Util.buildLocationInfo(). No functional changes.</li> 
<li><a href="http://github.com/vircadia/Iamus/commit/12f31a4f23e14d264b7e0feddef3cc5214f3dd8f">view &bull;</a> Limit the size of input JSON to Config.server.max-body-size.</li> 
<li><a href="http://github.com/vircadia/Iamus/commit/249b26d0989caa820a2d9d79db30f05083d56c72">view &bull;</a> Fix pagination so it returns the proper number of items on a page.     Makes the "?per_page=N&page_num=M" work properly.</li> 
<li><a href="http://github.com/vircadia/Iamus/commit/47bab57be416826773550493430844b113fe2188">view &bull;</a> Add Perm.PUBLIC to check if accessing an AccountEntity that is "public"     ie, 'availability' is either unspecified or Perm.ALL.</li> 
<li><a href="http://github.com/vircadia/Iamus/commit/d7c169fd05782d45fa5b76915b410e89b95a8d09">view &bull;</a> Add AccountEntity.profileDetail that just stores a JSON object. Modify AccountEntity.locker to accept a JSON object. Add validators for 'object' that allows storing JSON object values.</li> 
<li><a href="http://github.com/vircadia/Iamus/commit/696007d84fa5752acb165c28be5c1bd586a50e3f">view &bull;</a> Modify returned Account fields to include 'profileDetail'. Update documentation.</li> 
<li><a href="http://github.com/vircadia/Iamus/commit/43813c4ff380e3e7f6704b479593d149e0e745e9">view &bull;</a> Add /api/v1/profile and /api/v1/profile/:accountId Add documentation for same.</li> 
<li><a href="http://github.com/vircadia/Iamus/commit/dfda90f4731c4f0aa16d8fc8a5d6cd840403965d">view &bull;</a> Bump to 2.3.7</li> 
</ul>

