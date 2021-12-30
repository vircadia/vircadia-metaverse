import fs from "fs";
import http from "http";
import https from "https";
import os from "os";
import { v4 as uuidv4 } from "uuid";

// Return 'true' if the passed value is null or empty
export function IsNullOrEmpty(pVal: any): boolean {
  return (
    typeof pVal === "undefined" ||
    pVal === null ||
    (typeof pVal === "string" && String(pVal).length === 0)
  );
}

export function GenUUID(): string {
  return uuidv4();
}

// Return 'true' if the passed value is not null or empty
export function IsNotNullOrEmpty(pVal: any): boolean {
  return !IsNullOrEmpty(pVal);
}

// Utility routine that reads in JSON content from either an URL or a filename.
// Returns the parsed JSON object or 'undefined' if any errors.
export async function readInJSON(pFilenameOrURL: string): Promise<any> {
  let configBody: string;
  if (pFilenameOrURL.startsWith("http://")) {
    configBody = await httpRequest(pFilenameOrURL);
  } else {
    if (pFilenameOrURL.startsWith("https://")) {
      configBody = await httpsRequest(pFilenameOrURL);
    } else {
      try {
        // We should technically sanitize this filename but if one can change the environment
        //    or config file variables, the app is already poned.
        configBody = fs.readFileSync(pFilenameOrURL, "utf-8");
      } catch (err) {
        configBody = "";
        console.debug(
          `readInJSON: failed read of user config file ${pFilenameOrURL}: ${err}`
        );
      }
    }
  }
  if (IsNotNullOrEmpty(configBody)) {
    return JSON.parse(configBody);
  }
  return undefined;
}

// Do a simple https GET and return the response as a string
export async function httpsRequest(pUrl: string): Promise<string> {
  return new Promise((resolve, reject) => {
    https
      .get(pUrl, (resp: any) => {
        let data = "";
        resp.on("data", (chunk: string) => {
          data += chunk;
        });
        resp.on("end", () => {
          resolve(data);
        });
      })
      .on("error", (err: any) => {
        reject(err);
      });
  });
}

// Do a simple http GET and return the response as a string
export async function httpRequest(pUrl: string): Promise<string> {
  return new Promise((resolve, reject) => {
    http
      .get(pUrl, (resp: any) => {
        let data = "";
        resp.on("data", (chunk: string) => {
          data += chunk;
        });
        resp.on("end", () => {
          resolve(data);
        });
      })
      .on("error", (err: any) => {
        reject(err);
      });
  });
}

let myExternalAddr: string;
export async function getMyExternalIPAddress(): Promise<string> {
  if (IsNotNullOrEmpty(myExternalAddr)) {
    return Promise.resolve(myExternalAddr);
  }
  return new Promise((resolve, reject) => {
    httpsRequest("https://api.ipify.org")
      .then((resp) => {
        myExternalAddr = resp;
        resolve(myExternalAddr);
      })
      .catch((err) => {
        // Can't get it that way for some reason. Ask our interface
        const networkInterfaces = os.networkInterfaces();
        // { 'lo1': [ info, info ], 'eth0': [ info, info ]} where 'info' could be v4 and v6 addr infos

        let addressv4 = "";
        let addressv6 = "";

        Object.keys(networkInterfaces).forEach((dev) => {
          networkInterfaces[dev]?.filter((details) => {
            if (details.family === "IPv4" && details.internal === false) {
              addressv4 = details.address;
            }
            if (details.family === "IPv6" && details.internal === false) {
              addressv6 = details.address;
            }
          });
        });
        let address = "";
        if (IsNullOrEmpty(addressv4)) {
          address = addressv6;
        } else {
          address = addressv6;
        }

        if (IsNullOrEmpty(address)) {
          reject("No address found");
        }
        myExternalAddr = address.toString();
        resolve(myExternalAddr);
      });
  });
}

export const isValidArray = (arr: []) => {
  return arr && Array.isArray(arr) && arr.length > 0;
};

export const isValidObject = (obj: object) => {
  return obj && Object.keys(obj).length > 0;
};
