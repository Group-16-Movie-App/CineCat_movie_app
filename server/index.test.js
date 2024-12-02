import { initializeTestDb, insertTestUser, insertTestReview } from "./helpers/test.js";
import { expect } from "chai";

const base_url = 'http://localhost:5000';

// Sign up:
describe('POST register', () => {
    before(async() => {
       await initializeTestDb()
    });

    const email = 'register1234@foo.com';
    const name = 'register1234';
    const password = 'Register123';

    it ('should register with valid email, name and password', async() => {
        const response = await fetch(base_url + '/api/register', {
            method: 'post',
            headers: {
                'Content-Type':'application/json'
            },
            body: JSON.stringify({'email': email, 'name': name, 'password': password})
        });
        const data = await response.json();
        expect(response.status).to.equal(201, `Expected status 201 but received ${response.status}`);
        expect(data).to.be.an('object');
        expect(data).to.include.all.keys('token','id','name','email','message');
        expect(data.name).to.equal(name);
        expect(data.email).to.equal(email);
        expect(data.message).to.equal('Registration successful');
        expect(data.token).to.be.a('string').that.is.not.empty;  // Validate token
    });
    // after(async () => {
    //     try {
    //         await pool.query('DELETE FROM accounts WHERE email = $1', [email]);
    //     } catch (err) {
    //         console.error('Cleanup failed:', err)
    //     }
    // });
})

// Log in:
describe('POST login', () => {
    const name = 'login';
    const email = 'login@foo.com';
    const password = 'Login123';

    before(async() => {
        await insertTestUser(name, email, password);
     });

    it ('should login with valid credentials', async() => {
        const response = await fetch(base_url + '/api/login', {
            method: 'post',
            headers: {
                'Content-Type':'application/json'
            },
            body: JSON.stringify({'email': email, 'password': password})
        });
        const data = await response.json();
        expect(response.status).to.equal(200, `Expected status 200 but received ${response.status}`);
        expect(data).to.be.an('object');
        expect(data).to.include.all.keys('token','id','name','email');
        expect(data.name).to.equal(name);
        expect(data.email).to.equal(email);
        expect(data.token).to.be.a('string').that.is.not.empty;  // Validate token
    });
})

// Log out:
describe('POST /api/logout', () => {
    let token;

    before(async () => {
        const loginResponse = await fetch('http://localhost:5000/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: 'login@foo.com',
                password: 'Login123',
            }),
        });
        
        const loginData = await loginResponse.json();
        token = loginData.token;
    });

    it('should log the user out successfully', async () => {
        const response = await fetch('http://localhost:5000/api/logout', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        const data = await response.json();
        expect(response.status).to.equal(200);
        expect(data.message).to.equal('Logged out successfully');
    });

    it('should prevent access to protected routes after logout', async () => {
        // Send request to a protected route after logout
        const response = await fetch('http://localhost:5000/api/reviews', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`, // Token should be invalid after logout
            },
            body: JSON.stringify({
                'movieId': 15121,
                'description': "Try to send a review",
                'rating': 4
            })
        });

        const data = await response.json();
        console.log('Token after logout: ' + token);
        console.log('Response status: ' + response.status);
        console.log('Response body:', data);
        expect(response.status).to.equal(401);
    });
});

// Get all reviews:
describe('GET Reviews', () => {
    const movie_id = 15121;
    const account_id = 1;
    const review = 'I can watch it for eternity';
    const rating = 5;
    before(async() => {
       await insertTestReview(movie_id, account_id, review, rating)
    })

    it ('should get all reviews', async() => {
        const response = await fetch(base_url + '/api/reviews')
        const data = await response.json();
        
        expect(response.status).to.equal(200);
        expect(data).to.be.an('array').that.is.not.empty;
        expect(data[0]).to.include.all.keys('id','movie_id','account_id','review','rating','created','email','name','poster_path','movie_title','release_date');
        expect(data[0].movie_id).to.equal(movie_id);  
        expect(data[0].review).to.equal(review);    
        expect(data[0].rating).to.equal(rating);
    });
});