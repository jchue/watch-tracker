# Watch Tracker API

## Endpoints

This API serves the following endpoints:

### GET /records/{externalId}

#### Request

**Path Parameters**
Parameter|Data Type|Description
-|-|-
externalId|Integer|ID of the media object in the external content backend (TMDb)

#### Response

```json
{
    "id": 5,
    "created": "2020-11-11T01:30:33.000Z",
    "media_type": "tv",
    "external_id": 1035921,
    "watched": true,
    "watched_date": "2020-11-11T01:30:33.000Z"
}
```

### POST /records/{externalId}

#### Request

**Path Parameters**
Parameter|Data Type|Description
-|-|-
externalId|Integer|ID of the media object in the external content backend (TMDb)

### DELETE /records/{externalId}

#### Request

**Path Parameters**
Parameter|Data Type|Description
-|-|-
externalId|Integer|ID of the media object in the external content backend (TMDb)


## Database

This service uses SQLite to store information about media that has been wached.

Field|Data Type|Example
-|-|-
id|INTEGER|1
created|INTEGER|
media_type|TEXT|'tv'
external_id|INTEGER|12345
watched|INTEGER|0
watched_date|INTEGER|

### Common Operations

**Create table:**
```sql
CREATE TABLE tracked (id INTEGER PRIMARY KEY NOT NULL, created INTEGER NOT NULL, media_type TEXT NOT NULL, external_id INTEGER UNIQUE NOT NULL, watched INTEGER NOT NULL DEFAULT 0, watched_date INTEGER);
```

**Add row:**
```sql
INSERT OR REPLACE INTO tracked (created, media_type, external_id) values (strftime('%s','now'), '<media_type>', <external_id>);
```

**Update row:**
```sql
UPDATE tracked SET watched = 1, watched_date = strftime('%s','now') WHERE external_id = <external_id>;
```

**Delete row:**
```sql
DELETE FROM tracked WHERE external_id = <external_id>;
```

SQLite stores dates as integer timestamps. See [this](https://www.sqlitetutorial.net/sqlite-date/) page for additional information.

## Environment Variables

Variable|Description
-|-
SQLITE_DB_FILE|Location of SQLite database file
