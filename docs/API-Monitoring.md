
## Monitoring

Iamus collects statistics on its operation and these requests allow fetching of same.

## Configuration

The configuration file has a "Monitoring" section. The default values are show
but they can be changed to eliminate any collection overhead.

```
    'monitoring': {
        'enable': true,     // 'true' if to collect monitoring info
        'history': true     // 'true' if to collect value history
    },
```

## History

Some of the statistics collect a history of their values. This is returned in the `history`
section of a statistic's report.

To suppress the return of history information for a
particular stat, add "?history=no" to the GET request.

The history is given as a set of buckets over time. A history is reported as a set of "buckets"
that are each of some milliseconds in length. A history description is:

```
    "historyName": {
        "buckets": number,              // total number of buckets
        "bucketMilliseconds": number,   // number of MS represented by each bucket
        "totalMilliseconds": number,    // total MS of all buckets
        "timeBase": number,             // Linux time of first bucket
        "baseNumber": number,           // index of first bucket in time (used for reference)
        "type": string,                 // type of values (see below)
        "values": number[]              // array of all the buckets and their values
    }
```

There are two types of histories:

- accumulation: values are added to the bucket. This is good for number of operations in a time period, for instance
- average: values within the bucket period are averaged. This is good for something like CPU idle percent.

## GET /api/v1/stats/list

Fetch a list of all the monitored values.

```
    {
        "status": "success",
        "data": {
            "stats": [
                {
                    "name": string,     // name of the statistic
                    "category": string, // grouping of the statistic
                    "unit": string      // unit of the statistic
                },
                ...
        }
    }

```

## GET /api/v1/stats/category/:categoryName

Fetch all the statistics in a specified category.
Fetching this category overview sometimes returns more information than just the
collected statistics in that category.

```
    {
        "status": "success",
        "data": {
            categoryName: {
                category info (see below)
            }
        }
    }
```

## GET /api/v1/stats/stat/:statName

Fetch the current value of a particular collected statistic.

```
    {
        "status": "success",
        "data": {
            stat: {
                "name": string,     // name of the statistic
                "category": string, // grouping of the statistic
                "unit": string,     // unit of the statistic
                "value": number,    // the last collected value
                "history": {        // optional section of the value histories
                    "historyName": {
                        history description (see above)
                    },
                    ...
                }
            }
        }
    }
```

## Collected Values

### Category "os"

```
    {
        "cpus": [                   // NodeJS function os.cpus()
            {
                "model": string,    // description of processor type
                "speed": number,    // speed of processor
                "times": {          // processor time usage numbers
                    "user": number,
                    "nice": number,
                    "sys": number,
                    "idle": number,
                    "irq": number
                }
            },
            ...
        ],
        "freemem": number,          // NodeJS function os.freemem()
        "totalmem": number,         // NodeJS function os.totalmem()
        "loadavg": [ number, number, number ],  // NodeJS function os.loadavg()
        "uptime": number,           // NodeJS function os.uptime()
        "cpuBusy": { cpuBusy statistic report },
        "memUsage": { memUsage statistic report}
    }
```

#### cpuBusy

Percent CPU is reported busy: busyTime / totalTime * 100

```
    {
        "name": "cpuBusy",
        "category": "os",
        "unit": "percent",
        "history": {
            "5mins": {
                history in 60, five second buckets
            },
            "perHour": {
                history in 60, one minute buckets
            },
            "perDay": {
                history in 288, five minute buckets
            }
        }
    }
```

#### memUsage

Percent mem used: freeMem / totalMem * 100

```
    {
        "name": "memUsed",
        "category": "os",
        "unit": "percent",
        "history": {
            "perDay": {
                history in 288, five minute buckets
            },
            "perWeek": {
                history in 168, one hour buckets
            }
        }
    }
```

## Category "metaverse"

Metaverse statistics.

```
    {
        "totalOnline": { totalOnline statistic report },
        "domainTotalUsers": { domainTotalUsers statistic report},
        "domainAnonUsers": { domainAnonUsers statistic report},
        "activeDomains": { activeDomains statistic report}
    }
```

### totalOnline

Number of accounts that are sending heartbeats.

```
    {
        "name": "totalOnline",
        "category": "metaverse",
        "unit": "count",
        "history": {
            "perDay": {
                history in 288, five minute buckets
            },
            "perWeek": {
                history in 168, one hour buckets
            }
        }
    }
```

### domainTotalUsers

Number of users the domains are reporting.

```
    {
        "name": "domainTotalUsers",
        "category": "metaverse",
        "unit": "count",
        "history": {
            "perDay": {
                history in 288, five minute buckets
            },
            "perWeek": {
                history in 168, one hour buckets
            }
        }
    }
```

### domainAnonUsers

Number of anonymous users reported by the domains.
This count is included in "domainTotalUsers".

```
    {
        "name": "domainAnonUsers",
        "category": "metaverse",
        "unit": "count",
        "history": {
            "perDay": {
                history in 288, five minute buckets
            },
            "perWeek": {
                history in 168, one hour buckets
            }
        }
    }
```

### activeDomains

Number of domains that are sending heartbeats to the metaverse-server.

```
    {
        "name": "activeDomains",
        "category": "metaverse",
        "unit": "count",
        "history": {
            "perDay": {
                history in 288, five minute buckets
            },
            "perWeek": {
                history in 168, one hour buckets
            }
        }
    }
```

## Category "server"

General server operation statistics.

```
    {
        "apiRequests": { apiRequests statistic report },
        "apiErrors": { apiErrors statistic report}
    }
```

### apiRequests

Number of api requests.

```
    {
        "name": "apiRequests",
        "category": "server",
        "unit": "requests",
        "history": {
            "perHour": {
                history in 60, one minute buckets
            },
            "perDay": {
                history in 288, five minute buckets
            },
            "perWeek": {
                history in 168, one hour buckets
            }
        }
    }
```

### apiErrors

Number of API requests that returned 'failure'.

```
    {
        "name": "apiRequests",
        "category": "server",
        "unit": "requests",
        "history": {
            "perHour": {
                history in 60, one minute buckets
            },
            "perDay": {
                history in 288, five minute buckets
            }
        }
    }
```
