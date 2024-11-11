drop table if exists likes;
drop table if exists favorites;
drop table if exists comments;
drop table if exists reviews;
drop table if exists ratings;
drop table if exists classify;
drop table if exists tags;
drop table if exists members;
drop table if exists groups;
drop table if exists users;
drop table if exists movies;

create table users (
    id serial primary key,
    name varchar(100) unique not null,
    email varchar(100) unique not null,
    password varchar(255) not null
);

create table movies (
    id serial primary key,
    title varchar(255) unique not null,
    description text,
    duration int,
    published timestamp,
    director varchar(255),
    writer varchar(255),
    language varchar(100)    
);

create table groups (
    id serial primary key,
    name varchar(255) unique not null,
    description text,
    created timestamp default current_timestamp
);

create table members (
    id serial primary key,
    group_id int not null,
    constraint fk_groups foreign key (group_id) references groups(id),
    account int not null,
    constraint fk_users foreign key (account) references users(id),
    role varchar(50) check (role in ('member', 'creator', 'admin')),
    saved timestamp default current_timestamp
);

create table tags (
    id serial primary key,
    tag varchar(100)
);

create table classify (
    id serial primary key,
    movie int not null,
    constraint fk_movies foreign key (movie) references movies(id),
    tag int not null,
    constraint fk_tags foreign key (tag) references tags(id)
);

create table ratings (
    id serial primary key,
    movie int not null,
    constraint fk_movies foreign key (movie) references movies(id),
    account int not null,
    constraint fk_users foreign key (account) references users(id),
    rating smallint check (rating between 1 and 5),
    saved timestamp default current_timestamp
);

create table reviews (
    id serial primary key,
    movie int not null,
    constraint fk_movies foreign key (movie) references movies(id),
    account int not null,
    constraint fk_users foreign key (account) references users(id),
    group_id int not null,
    constraint fk_groups foreign key (group_id) references groups(id),
    review text not null,
    saved timestamp default current_timestamp
);

create table comments (
    id serial primary key,
    review int not null,
    constraint fk_reviews foreign key (review) references reviews(id),
    account int not null,
    constraint fk_users foreign key (account) references users(id),
    comment text not null,
    saved timestamp default current_timestamp
);

create table favorites (
    id serial primary key,
    account int not null,
    constraint fk_users foreign key (account) references users(id),
    movie int not null,
    constraint fk_movies foreign key (movie) references movies(id),
    saved timestamp default current_timestamp
);

create table likes (
    id serial primary key,
    account int not null,
    constraint fk_users foreign key (account) references users(id),
    review int,
    constraint fk_reviews foreign key (review) references reviews(id),
    comment int,
    constraint fk_comments foreign key (comment) references comments(id),
    saved timestamp default current_timestamp,
    check (
        (review is not null and comment is null) or
        (review is null and comment is not null)
    )
);

insert into movies (title) values ('The Sound of Music');
insert into movies (title) values ('Dead Poets Society');