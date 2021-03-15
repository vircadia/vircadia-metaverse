# Iamus Changelog
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

## Version 2.3.6

<ul>
<li><a href="http://github.com/vircadia/Iamus/commit/d39b5731e0481cc0006dae2e6fb4a8530137b0bb">view &bull;</a> Update ChangeLog.md</li> 
<li><a href="http://github.com/vircadia/Iamus/commit/c67706945d71c51d806023c02dce26d4147ea1a6">view &bull;</a> Minor bug fixes in BackupDb.sh</li> 
<li><a href="http://github.com/vircadia/Iamus/commit/6b05304c326f8303a18afbde9421ccf030949297">view &bull;</a> Update links and names (#66)</li> 
<li><a href="http://github.com/vircadia/Iamus/commit/cc8e9d64f077c2ee62405cfe2437ad3483845c24">view &bull;</a> Update NPM package version.</li> 
<li><a href="http://github.com/vircadia/Iamus/commit/8cf1eee04aab3a069442c346241cf96aa8572f1a">view &bull;</a> Fix problem where user wasn't returned their token by /api/v1/tokens     The search field must be specified to AccountScopeFilter     A few other places were checked and updated.</li> 
<li><a href="http://github.com/vircadia/Iamus/commit/1d0be3bf637315c3196390124600cada3fc218f1">view &bull;</a> Bump version to 2.3.6</li> 
</ul>

## Version 2.3.5

<ul>
<li><a href="http://github.com/vircadia/Iamus/commit/e95291d4988f48d780795e134a364d9120f22fc3">view &bull;</a> Update ChangeLog.md</li> 
<li><a href="http://github.com/vircadia/Iamus/commit/b360944a70a994ee701a0f2b23303a1d71dd76fb">view &bull;</a> Change Place filter 'maturity' to take a comma separated string     of maturity classes to match.</li> 
<li><a href="http://github.com/vircadia/Iamus/commit/00355c7481b1958379d574a1ff7acc65a18d2eed">view &bull;</a> When creating a Place, default maturity to the parent domain's maturity. Default DomainEntity.maturity to Maturity.UNRATED.</li> 
<li><a href="http://github.com/vircadia/Iamus/commit/a80864dfea02c284c195000184392f9c1f7bdcce">view &bull;</a> Massive refactoring to remove circular import dependencies that were     causing null value initializations due to how Javascript loads. Move Entity field definitions into separate files. Moved Entity field getting and setting into the Entity controlling class. Repackaged (into multiple files) Permission and Get/Set/Validate routines.</li> 
<li><a href="http://github.com/vircadia/Iamus/commit/bf4df1bad8290c7ef4b20e5ce940b1a925f3b04e">view &bull;</a> Bump version to 2.3.5</li> 
</ul>

## Version 2.3.4

<ul>
<li><a href="http://github.com/vircadia/Iamus/commit/387e26b76f6c98b5fe5e55f34d319c588f77b5a8">view &bull;</a> Update Changelog.md</li> 
<li><a href="http://github.com/vircadia/Iamus/commit/d9759a3986c7c906b687047df268a9476193648d">view &bull;</a> Add documentation on the design of the Entity field get/set system.</li> 
<li><a href="http://github.com/vircadia/Iamus/commit/356b27369300f543e57dd7e7a73bc8f1d686ea15">view &bull;</a> Fix DELETE Place so the owner of the Place's domain can delete the Place.</li> 
<li><a href="http://github.com/vircadia/Iamus/commit/f9651d25d43a76d8e4aa5ee932f3e0a0f279514a">view &bull;</a> Make Monitoring.event so it doesn't fail if monitoring was not inited.</li> 
<li><a href="http://github.com/vircadia/Iamus/commit/d45833f889f838bdefe5cf8bfb31d316aad486e5">view &bull;</a> Record network_address and network_port if specified when creating doamin.</li> 
<li><a href="http://github.com/vircadia/Iamus/commit/acaa36a494ad439122f48376ba31f08068219566">view &bull;</a> Added "maturity" and "tags" to PlaceEntity Centralized "maturity" specifications into src/Entities/sets/Maturity.ts Moved AccountAvailability and AccountRoles to src/Entities/sets and made a set pattern. Documented "/api/v1/places?maturity=LEVEL" and "/api/v1/places?tags=TAGLIST" Added comments to src/Entities/EntityFilters/CriteriaFilter.ts explaining how filters are to be used Added "maturity-catagories" to Places responses Fixed /api/v1/users/places to return only the places that belong to the requesting user Deleted bin/www -- what was that from??</li> 
<li><a href="http://github.com/vircadia/Iamus/commit/56c4649b60f58915c3b05907f3f1149cf3fe0e71">view &bull;</a> Bump version to 2.3.4</li> 
</ul>

