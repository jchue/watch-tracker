**SQLite**

field|datatype|example
-|-|-
id|INTEGER|1
created|INTEGER|
media_type|TEXT|'tv'
external_id|INTEGER|12345
watched|INTEGER|0
watched_date|INTEGER|

```sql
CREATE TABLE tracked (id INTEGER PRIMARY KEY NOT NULL, created INTEGER NOT NULL, media_type TEXT NOT NULL, external_id INTEGER NOT NULL, watched INTEGER NOT NULL DEFAULT 0, watched_date INTEGER);

INSERT INTO tracked (created, media_type, external_id) values (strftime('%s','now'), '<media_type>', <external_id>);

UPDATE tracked SET watched = 1, watched_date = strftime('%s','now') WHERE external_id = <external_id>;
```
See this for dates in SQLite: https://www.sqlitetutorial.net/sqlite-date/