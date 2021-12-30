export interface PlaceModel{
    id: string,            // globally unique place identifier
    name: string,          // Human friendly name of the place
    displayName: string,          // Human friendly name of the place
    description: string,   // Human friendly description of the place
    visibility: string,    // visibility of this Place in general Place lists
    maturity: string,      // maturity level of the place (see Sets/Maturity.ts)
    tags: string[],        // tags defining the string content
    domainId: string,      // domain the place is in
    managers: string[],    // Usernames of people who are domain admins
    path: string,          // address within the domain: "optional-domain/x,y,z/x,y,z,x"
    thumbnail: string,     // thumbnail for place
    images: string[],      // images for the place

    // A Place can have a beacon that updates current state and information
    // If current information is not supplied, attendance defaults to domain's
    currentAttendance: number    // current attendance at the Place
    currentImages: string[]      // images at the session
    currentInfo: string          // JSON information about the session
    currentLastUpdateTime: Date  // time that the last session information was updated
    currentAPIKeyTokenId: string // API key for updating the session information

    // admin stuff
    iPAddrOfFirstContact: string, // IP address that registered this place
    whenCreated: Date, // What the variable name says
    // 'lastActivity' is computed by Places.initPlaces and used for aliveness checks
    lastActivity: Date,  // newest of currentLastUpdateTime and Domain.timeOfLastHeartbeat
}

