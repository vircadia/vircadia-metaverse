# Metaverse Federation

This document describes a potential metaverse federation system
as a proposal for the Vircadia project.
Discussion is expected.

## What is Federation

The structure of a Vircadia metaverse is:

- multiple domain-servers which simulate a space and present a virtual world
- multiple Interfaces which connect a a single domain-server and present a view of the virtual world to a user
- a single metaverse-server which all of the domain-servers connect to

The metaverse-server provides cross domain coordination services for the metaverse.
The services the metaverse-server provides for the domain services are:

- user account creation, storage, and access. User profile and storage for user specific information from the domain.
- domain-server registration and directory for domain-server lookup
- user interconnections ("connections" and "friends")
- cross domain communication ("groups" and group chat)

Thus the metaverse-server has the very limited function of providing identity management,
discovery, and some over-domain-server communication.

Now consider that there are several of these metaverses -- independent metaverse-servers
with their associated domain-server and with Interfaces providing views.
Each of these metaverses has their own collection of user accounts and configured
networking addresses and paths. These metaverses are administrated separately and
probably are available and unavailable on their own schedule.

I propose to define "federation" as the ability for a user from one of
these metaverses to visit (view, interact, be present) in a domain-server
of another metaverse. Such visiting, though, introduces questions of permission,
authorization, and management.

Additionally, to add to "federation", once users can visit other domain-servers, they
will create new friend relationships and join groups in the other metaverse. They
will want to chat with their new friends in the other metaverse.

TODO:


## ActivityPub

I propose using the [ActivityPub] messages for metaverse-server to metaverse-server
communication.

Model is "actors" and "activities".


## Federation Operations

## Identity, Authentication, Authorization, and Verification

### User Teleporting to non-Home Metaverse

### Chat

### Groups

### Notes

### Script Access/Use

---

## Hubzilla

- https://zotlabs.org/page/hubzilla/hubzilla-project
- https://framagit.org/hubzilla/core
- https://medium.com/we-distribute/the-do-everything-system-an-in-depth-review-of-hubzilla-3-0-692204177d4e
- https://zotlabs.org/help/en/developer/zot_protocol#What_is_Zot_
- location independent identities (users have unique zot_id which is mapped to a grid location)
- JSON messages sent over encrypted streams and digitally signed
- message types: post/activity, mail, identity, authenticate
- each service makes available "./.well-known/zot-info" for identity lookup
  - POST of auth info and gets back an identity discovery packet
- similar in function to the W3C protocols
- the grid servers are expected to be there and communicating


### Notes

- Go Implementation: https://github.com/go-fed/activity
- C# Implementation: https://github.com/jfmcbrayer/Kroeg

- OpenID-OIDC: https://openid.net/connect/
  - JWT tokens with an API for verifying tokens
  - Nodejs provider: https://github.com/panva/node-oidc-provider
- WebID-OIDC: 
  - https://github.com/solid/webid-oidc-spec

Single Sign-On Alternatives

- Open ID Connect
- IndieAuth: https://indieauth.com/
- KeyCloak: https://www.keycloak.org/
- Gluu: https://gluu.org/docs/gluu-server/
- SQRL: https://en.m.wikipedia.org/wiki/SQRL
- Zot protocol: Nomadic identity and Remote Authentication Zotlabs 1
    OpenWebAuth: https://framagit.org/zot/zap/-/blob/release/spec/OpenWebAuth/Home.md

Other notes

- ZCAP-LD: Authorization Capabilities for Linked Data https://w3c-ccg.github.io/zcap-ld/
- IndieWeb
  - WebMention: https://webmention.net/draft/
  - WebSub: https://www.w3.org/TR/websub/
  - MicroPub: https://www.w3.org/TR/micropub/
  - IndieAuth: https://indieauth.net/
    - "IndieAuth: OAuth for the Open Web": https://aaronparecki.com/2018/07/07/7/oauth-for-the-open-web
    - IndieAuth.com
  - MicroSub: https://indieweb.org/Microsub-spec
- https://the-federation.info/ Site that tracks 13 protocols, 45 projects, ...
- Matrix: https://matrix.org/
  - https://matrix.org/docs/spec/
  - Open/federated instant messaging, VoIP (WebRTC), IoT communication
  - Realtime communication
  - JSON over REST
  - Nearly the same size of network as Mastodon
  - "clients" generate "events" in "rooms": client => server
    - "rooms" are synchronized across "homeServers": server <=> server
    - pub/sub with authorization and encryption
- A Glossary For the Fediverse: http://tilde.town/~petegozz/

- https://developers.google.com/search/docs/data-types/event
- Communecter: https://www.communecter.org/, https://github.com/pixelhumain/communecter
- Murmurations: https://github.com/Photosynthesis/Murmurations
- Big Blue Button: https://bbb.fosshost.org/b
- https://fediverse.party/
- Distributed Friends and Relations Network: DFRN Protocol: https://github.com/friendica/friendica/blob/master/spec/dfrn2.pdf



[Hubzilla]: https://zotlabs.org/page/hubzilla/hubzilla-project
[Mastodon]: https://joinmastodon.org/
[Vircadia]: https://vircadia.com/
[ActivityPub]: https://www.w3.org/TR/activitypub/

