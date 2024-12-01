DROP TABLE IF EXISTS posts;
DROP TABLE IF EXISTS shared_urls;
DROP TABLE IF EXISTS favorites;
DROP TABLE IF EXISTS reviews;
-- DROP TABLE IF EXISTS ratings;
DROP TABLE IF EXISTS members;
DROP TABLE IF EXISTS groups;
DROP TABLE IF EXISTS accounts;

-- Account table to manage accounts and authentication
CREATE TABLE accounts (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    is_verified BOOLEAN DEFAULT FALSE,
    refresh_token TEXT,
    verification_token VARCHAR(255), -- Added verification_token
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Group table for group functionality.
-- When the owner deletes their account, transfer the ownership to another group member, if available.
-- If no other members exist, delete the group.
CREATE TABLE groups (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    owner INT NOT NULL,
    created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_owner FOREIGN KEY (owner) REFERENCES accounts(id) ON DELETE CASCADE
);

-- Members table to track membership in groups.
-- The Owner can assign who becomes an admin.
-- Admins and Owners can add or remove members, delete members' reviews.
CREATE TABLE members (
    id SERIAL PRIMARY KEY,
    group_id INT NOT NULL,
    account_id INT NOT NULL,
    role VARCHAR(50) CHECK (role IN ('member', 'admin')) DEFAULT 'member',
    CONSTRAINT fk_group FOREIGN KEY (group_id) REFERENCES groups(id),
    CONSTRAINT fk_account FOREIGN KEY (account_id) REFERENCES accounts(id)
);

-- Reviews table to store account-created movie reviews. Movie_id is ID retrieved from IMDB API
CREATE TABLE reviews (
    id SERIAL PRIMARY KEY,
    movie_id INT NOT NULL,
    account_id INT NOT NULL,
    review TEXT NOT NULL,
    rating SMALLINT CHECK (rating BETWEEN 1 AND 5) NOT NULL,
    created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_account FOREIGN KEY (account_id) REFERENCES accounts(id) ON DELETE CASCADE
);

-- Ratings table to store account-created movie ratings. Movie ID is from TMDB
-- If the accounts is deleted, its ratings are kept, and account_id field is null.
-- CREATE TABLE ratings (
--     id SERIAL PRIMARY KEY,
--     movie_id INT NOT NULL,
--     account_id INT,
--     rating SMALLINT CHECK (rating BETWEEN 1 AND 5) NOT NULL,
--     created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
--     CONSTRAINT fk_account FOREIGN KEY (account_id) REFERENCES accounts(id) ON DELETE SET NULL
-- );

-- Favorites table to manage account’s favorite movies or series
CREATE TABLE favorites (
    id SERIAL PRIMARY KEY,
    account_id INT NOT NULL,
    movie_id INT NOT NULL,
    created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_favorite_account FOREIGN KEY (account_id) REFERENCES accounts(id) ON DELETE CASCADE,  -- Добавлен ON DELETE CASCADE
    CONSTRAINT unique_favorite_movie_per_account UNIQUE (account_id, movie_id)
);

-- Table to track shared URLs for favorite lists
CREATE TABLE shared_urls (
    id SERIAL PRIMARY KEY,
    account_id INT NOT NULL,
    url TEXT UNIQUE NOT NULL,
    created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_shared_account FOREIGN KEY (account_id) REFERENCES accounts(id)
);

-- Table to manage group's posts:
CREATE TABLE posts (
    id SERIAL PRIMARY KEY,
    account_id INT NOT NULL,
    group_id INT NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    movie_id INT,
    showtime_id INT,
    created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_group FOREIGN KEY (group_id) REFERENCES groups(id) ON DELETE CASCADE,
    CONSTRAINT fk_account FOREIGN KEY (account_id) REFERENCES accounts(id) ON DELETE CASCADE
    -- Ensure movie_id and showtime_id cannot be NON-NULL at a time
    -- CONSTRAINT chk_movie_or_showtime 
    --     CHECK (
    --         (movie_id IS DISTINCT FROM showtime_id)
    --     )
);
