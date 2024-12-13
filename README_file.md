# Cinecat Movie App README (Group 16)

## Project Overview
The Cinecat Movie App is a web application designed for movie enthusiasts. It provides a platform to explore movie information and showtimes from various theatres. This application utilizes open-source data from The Movie Database (TMDB) and Finnkino theatres. The frontend was built using React, while the backend was developed with Node.js and the Express framework. Data was stored in a PostgreSQL database.

## Objective
The primary objective of this project is to develop an engaging and user-friendly website that allows users to seamlessly access movie data and theatre showtimes.

## External Data Sources
- **TMDB**: The Movie Database providing extensive information about movies.
- **Finnkino**: Provides open data regarding showtimes in various movie theatres, with data returned in XML format.

## Technologies Used
- **Frontend**: React  
  Building a dynamic and interactive user interface with components and routing to ensure a smooth user experience.
  
- **Backend**: Node.js, Express  
  Handling server logic and creating a RESTful API for interaction with the frontend. Express.js is used for routing, request/response handling, and implementing middleware for authentication and security.
  
- **Database**: PostgreSQL  
  Using a relational database to store data such as user information, groups, movies, and showtimes, with SQL queries to retrieve, insert, and update data.
  
- **APIs**: The Movie Database (TMDB), Finnkino (XML format)  
  Interacting with external APIs to fetch movie data, showtimes, and other relevant information.

- **Version control**: Git  
  Managing version control and enabling collaboration through a distributed system. Using GitHub for repository hosting, team collaboration, and tracking changes.

## Features
The key features include:
1. **Responsiveness**: The user interface is designed to scale and adapt to different screen sizes, ensuring a consistent experience across devices.
2. **Sign up**: Users should sign up to access the key functionalities within the application. The sign-up process requires a name, email, and password, with the password needing at least one uppercase letter and one number.
3. **Sign in**: Users can sign in to the movie application after signing up.
4. **Sign out**: Users who are signed in can sign out at any time.
5. **Removing an account**: Registered users can delete their accounts, and all associated data (e.g., IDs) will be removed upon account deletion.
6. **Search**: Users can search for movies using at least three different criteria (e.g., title, genre, release date). The results are displayed in a list format, and users can view the details of each movie by selecting it. This feature is available without signing in.
7. **Showtimes**: Users can browse showtimes for their chosen Finnkino movie theatre. This is accessible without requiring a sign-in.
8. **Group page**: Signed-in users can create a group with a designated name. Created groups are listed, allowing users to view a group page. Only group members can access the group page, and the owner can delete the group.
9. **Review a movie**: Signed-in users can submit movie reviews, including a description, rating (from 1 to 5 stars), and a timestamp.
10. **Browsing reviews**: Users can browse all reviews. The details can be observed by selecting a review from the list. This feature is available without signing in.
11. **Profile page**: The profile page shows the personalized details of the signed-in user: favourite list, review list, and group list.
12. **Favourites**: Signed-in users can create a personalized favourite list of movies and TV series, which will be displayed on their profile page.
13. **Sharing favourite list**: Signed-in users can share their favourite list as a URL. Shared URLs will be listed as a page and can be viewed by all users.

## Setup and Installation
1. **Clone the repository from GitHub**:
   ```bash
   git clone https://github.com/Group-16-Movie-App/CineCat_movie_app.git

   ## Setup and Installation

2. Clone the repository from GitHub:  
   Run the following command to clone the repository:  
   `git clone https://github.com/Group-16-Movie-App/CineCat_movie_app.git`  

  3. Install all dependencies:  
   - **Frontend**:  
     Navigate to the frontend folder and run:  
     `npm install` in the movie (frontend) folder.  
   - **Backend**:  
     Navigate to the backend folder and run:  
     Run `npm install` in the server (backend) folder.

4. Set up environment variables:  
   Configure the necessary environment variables for API keys, JSON Web Token (JWT), and database configurations.

5. Set up PostgreSQL:  
   - Create a new PostgreSQL database.

6. Run the project:  
   - Start the frontend server using: `npm start`  
   - Start the backend server using: `npm run devStart`

---

## Usage

- Open the app in your browser at `http://localhost:3000`.  
- Sign up, sign in, and start exploring the Cinecat movie app features of your choice, such as searching for movies, browsing showtimes, and sharing your favorite lists.

---

## Team Members and Features Worked Upon

- **Cristina Bruscagin**: Sign up, sign in, sign out, backlog, groups, email validation, and code refactoring.  
- **Samuel Warrie**: Reviews, database, API documentation, search.  
- **Dahn Do**: Database, movies list, testing, search, and groups.  
- **Glory Ozoji**: Showtime, profile page, favourite list, groups, README, and wireframe.  
- **Ville Kavelin**: Backlog, showtime, groups, and wireframe.  
- **Anki Rawat**: Delete account, showtime, styling, groups, and wireframe.

## Wirefame structure of the Cinecat movie app.
![Wireframe Diagram]




## Database Diagram:
https://unioulumy.sharepoint.com/:i:/g/personal/t3dodu00_students_oamk_fi/EWIePsK4So5BiIGgg4CMkrgBTI9zMF-rhF6zjwbutR-VWg?e=bqDbVQ

![Database Diagram]





   
