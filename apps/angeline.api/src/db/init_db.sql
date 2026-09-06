create table if not exists Information (
    id TEXT NOT NULL PRIMARY KEY,
    name TEXT NOT NULL,
    content TEXT default '',
    lang TEXT NOT NULL
);

create index if not exists Information_name_idx on Information (name);

create table if not exists HomepageSettings (
    id TEXT NOT NULL PRIMARY KEY,
    visible BOOLEAN NOT NULL DEFAULT FALSE,
    title TEXT NOT NULL DEFAULT '',
    content TEXT NOT NULL DEFAULT ''
);

insert or ignore into HomepageSettings (id, visible, title, content)
values (
    'homepage',
    FALSE,
    'Angeline Desdevises, photographe documentaire et photojournaliste',
    'Travail documentaire autour des conflits, des territoires et des récits humains, avec une attention particulière portée au Moyen-Orient, à la Syrie, au Liban, aux portraits et aux publications de presse.'
);

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