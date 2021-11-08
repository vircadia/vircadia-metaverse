# Iamus Changelog
## Version 2.4.10

<ul>
<li><a href="http://github.com/vircadia/Iamus/commit/c3f4f06d7d2f8ed9df0935d60bd0d83c4c90b2c8">view &bull;</a> Update Changelog.md</li> 
<li><a href="http://github.com/vircadia/Iamus/commit/5d1c74f913317e1a171c8c6e5a58ce34c11b64be">view &bull;</a> Allow the domain owner and managers to edit a place name. Closes #103</li> 
<li><a href="http://github.com/vircadia/Iamus/commit/36769fca41662c284d656171f6d3b3ef86703d60">view &bull;</a> Limit Place.name to alphanumeric and hyphen. Closes #104. Add Place.displayName Update documentation.</li> 
<li><a href="http://github.com/vircadia/Iamus/commit/ead065514835eb51e3c11ede4e7d73af4fbc63b8">view &bull;</a> Bump version to 2.4.10</li> 
</ul>

## Version 2.4.9

<ul>
<li><a href="http://github.com/vircadia/Iamus/commit/afa01d0e67adcb9dee407827f3a4819b9107cf97">view &bull;</a> Update ChangeLog.md</li> 
<li><a href="http://github.com/vircadia/Iamus/commit/4dced54f8a6f50cd3ac90b2e66f217b237252cb6">view &bull;</a> Allow setting of Place 'address' field with full path address.</li> 
<li><a href="http://github.com/vircadia/Iamus/commit/0c745918e46a2d1f739107b11a9504de8c0dab89">view &bull;</a> Bump version to 2.4.9</li> 
</ul>

## Version 2.4.8

<ul>
<li><a href="http://github.com/vircadia/Iamus/commit/b21a2da4d064b3a7660524bb6ebbc8c0732c0b27">view &bull;</a> Update ChangeLog.md</li> 
<li><a href="http://github.com/vircadia/Iamus/commit/764bbd7a029082aada2a899808dffd83ec847b7a">view &bull;</a> Bump color-string from 1.5.4 to 1.6.0 (#96)</li> 
<li><a href="http://github.com/vircadia/Iamus/commit/2bbc0ad8780f9df2bdef33f287a5695b417f80f4">view &bull;</a> Fix bug of not allowing URLs for base configuration file.</li> 
<li><a href="http://github.com/vircadia/Iamus/commit/2839c9393b0d88a783be0a2bb7112911986705b0">view &bull;</a> Update build_scripts/cleanDist.js to remove deprecated warnings.</li> 
<li><a href="http://github.com/vircadia/Iamus/commit/3537384daf46a206366b75c1e3421e26ca06f2ef">view &bull;</a> Bump version to 2.4.8</li> 
</ul>

## Version 2.4.7

<ul>
<li><a href="http://github.com/vircadia/Iamus/commit/d0495f3dc7c2d085d5f06cfaf8144a37ae1f8896">view &bull;</a> Update ChangeLog.md</li> 
<li><a href="http://github.com/vircadia/Iamus/commit/fd1ef936e9853ff24c8b561e4a9580f8ae98ccb7">view &bull;</a> Bump path-parse from 1.0.6 to 1.0.7 (#97)</li> 
<li><a href="http://github.com/vircadia/Iamus/commit/7e22410662d7f59ca17f80986734c736bc730d1e">view &bull;</a> Fixes problem of anon users being counted twice. Problem was that Iamus interpreted the domain-server "num_users" and "anon_users" as two separate sets when, actually, the domain-server heartbeats "num_users" as the total number of users and "anon_users" is the number, of that total, that are anonymous. Fixes #98</li> 
<li><a href="http://github.com/vircadia/Iamus/commit/fae9dea95dfe9cefb2059a06f312adcb007fef14">view &bull;</a> Bump version to 2.4.7</li> 
</ul>

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

