create table if not exists Information (
    id TEXT NOT NULL PRIMARY KEY,
    name TEXT NOT NULL,
    content TEXT default '',
    lang TEXT NOT NULL
);

create index if not exists Information_name_idx on Information (name);

create table if not exists Category (
    id TEXT NOT NULL PRIMARY KEY,
    name TEXT NOT NULL,
    article TEXT,
    ordered INTEGER NOT NULL,
    disabled BOOLEAN DEFAULT FALSE
);

create index if not exists Category_name_idx on Category (name);

create table if not exists Image (
    id TEXT NOT NULL PRIMARY KEY,
    name TEXT NOT NULL,
    path TEXT NOT NULL,
    description TEXT,
    category TEXT NOT NULL,
    ordered INTEGER NOT NULL,
    FOREIGN KEY (category) REFERENCES Category(id) ON DELETE CASCADE
);

create index if not exists Image_name_idx on Image (name);