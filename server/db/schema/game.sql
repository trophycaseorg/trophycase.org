CREATE TABLE IF NOT EXISTS psnGames(
    appid TEXT PRIMARY KEY, 
    name TEXT NOT NULL,
    boxArtURL TEXT NOT NULL,
    platform TEXT NOT NULL,
    trophies TEXT NOT NULL
);