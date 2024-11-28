drop table if exists posts;
drop table if exists shared_urls;
drop table if exists favorites;
drop table if exists reviews;
-- drop table if exists ratings;
drop table if exists members;
drop table if exists groups;
drop table if exists accounts;

-- Account table to manage accounts and authentication
CREATE TABLE accounts (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    is_verified BOOLEAN DEFAULT FALSE, 
    refresh_token TEXT, 
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Group table for group functionality. 
-- When the owner deletes their account, transfer the ownership to another group member, if available.
-- If no other members exist, delete the group.
create table groups (
    id serial primary key,
    name varchar(255) unique not null,
    description text,
    owner int not null,
    created timestamp default current_timestamp,
    constraint fk_owner foreign key (owner) references accounts(id) on delete cascade
);

-- Members table to track membership in groups. 
-- The Owner can assign who becomes an admin.
-- Admins and Owners can add or remove members, delete members'reviews.
create table members (
    id serial primary key,
    group_id int not null,
    account_id int not null,
    role varchar(50) check (role in ('member', 'admin')) default 'member',
    constraint fk_group foreign key (group_id) references groups(id),
    constraint fk_account foreign key (account_id) references accounts(id)
);

-- Reviews table to store account-created movie reviews. Movie_id is ID retrieved form IMDB API
create table reviews (
    id serial primary key,
    movie_id int not null,
    account_id int not null,
    review text not null,
    rating smallint check (rating between 1 and 5) not null,
    created timestamp default current_timestamp,
    constraint fk_account foreign key (account_id) references accounts(id) on delete cascade
);

-- Ratings table to store account-created movie ratings. Movie ID is from TMDB
-- If the accounts is deleted, its ratings are kept, and account_id field is null.
-- create table ratings (
   -- id serial primary key,
   -- movie_id int not null,
   -- account_id int,
   -- rating smallint check (rating between 1 and 5) not null,
   -- created timestamp default current_timestamp,
   -- constraint fk_account foreign key (account_id) references accounts(id) on delete set null
--);

-- Favorites table to manage account’s favorite movies or series
create table favorites (
    id serial primary key,
    account_id int not null,
    movie_id int not null,
    created timestamp default current_timestamp,
    constraint fk_favorite_account foreign key (account_id) references accounts(id),
    constraint unique_favorite_movie_per_account unique (account_id, movie_id)
);

-- Table to track shared URLs for favorite lists
create table shared_urls (
    id serial primary key,
    account_id int not null,
    url text unique not null,
    created timestamp default current_timestamp,
    constraint fk_shared_account foreign key (account_id) references accounts(id)
);

-- Table to manage group's post:
create table posts (
    id serial primary key,
    account_id int not null,
    group_id int not null,
    tilte text not null,
    description text not null,
    movie_id int,
    showtime_id int,
    created timestamp default current_timestamp,
    constraint fk_group foreign key (group_id) references groups(id) on delete cascade,
    constraint fk_account foreign key (account_id) references accounts(id) on delete cascade
    -- Ensure movie_id and showtime_id cannot be NON-NULL at a time
    -- constraint chk_movie_or_showtime 
        -- check (
           -- (movie_id is distinct from showtime_id)
        --)
);
