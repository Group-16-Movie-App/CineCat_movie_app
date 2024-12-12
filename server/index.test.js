import { initializeTestDb, insertTestUser, insertTestReview, insertTestGroup, getToken, findUserByEmail, getGroupId } from "./helpers/test.js";
import { expect } from "chai";
import pool from "./config/database.js";

const base_url = 'http://localhost:5000';

// Sign up:
describe('POST register', () => {
    before(async() => {
       await initializeTestDb()
    });

    const email = 'register@foo.com';
    const name = 'register';
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
    it ('should not register with an existing email', async() => {
        const email = 'register@foo.com';
        const name = 'failure';
        const password = 'Register123';
        const response = await fetch(base_url + '/api/register', {
            method: 'post',
            headers: {
                'Content-Type':'application/json'
            },
            body: JSON.stringify({'email': email, 'name': name, 'password': password})
        });
        const data = await response.json();
        expect(response.status).to.equal(400, `Expected status 400 but received ${response.status}`);
        expect(data.error).to.equal('Email already exists');
    });
    it ('should not register with a password without at least one uppercase letter', async() => {
        const email = 'passwordwithnonumber@foo.com';
        const name = 'invalidpassword';
        const password = 'register123';
        const response = await fetch(base_url + '/api/register', {
            method: 'post',
            headers: {
                'Content-Type':'application/json'
            },
            body: JSON.stringify({'email': email, 'name': name, 'password': password})
        });
        const data = await response.json();
        expect(response.status).to.equal(400, `Expected status 400 but received ${response.status}`);
        expect(data.error).to.equal('Password must contain at least one uppercase letter');
    });
    it ('should not register with a password without at least one number', async() => {
            const email = 'invalidpassword@foo.com';
            const name = 'invalidpassword';
            const password = 'Register';
            const response = await fetch(base_url + '/api/register', {
                method: 'post',
                headers: {
                    'Content-Type':'application/json'
                },
                body: JSON.stringify({'email': email, 'name': name, 'password': password})
            });
            const data = await response.json();
            expect(response.status).to.equal(400, `Expected status 400 but received ${response.status}`);
            expect(data.error).to.equal('Password must contain at least one number');
    });
    it ('should not register with an existing username', async() => {
        const email = 'username@foo.com';
        const name = 'register';
        const password = 'User0name';
        const response = await fetch(base_url + '/api/register', {
            method: 'post',
            headers: {
                'Content-Type':'application/json'
            },
            body: JSON.stringify({'email': email, 'name': name, 'password': password})
        });
        const data = await response.json();
        expect(response.status).to.equal(400, `Expected status 400 but received ${response.status}`);
        expect(data.error).to.equal('Username already exists');
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
        expect(data).to.include.all.keys('token', 'token_version','id','name','email');
        expect(data.name).to.equal(name);
        expect(data.email).to.equal(email);
        expect(data.token).to.be.a('string').that.is.not.empty;  // Validate token
    });
    it ('should not login with a wrong password', async() => {
        const email = 'login@foo.com';
        const password = 'Wrongpassword123';
        const response = await fetch(base_url + '/api/login', {
            method: 'post',
            headers: {
                'Content-Type':'application/json'
            },
            body: JSON.stringify({'email': email, 'password': password})
        });
        const data = await response.json();
        expect(response.status).to.equal(401, `Expected status 401 but received ${response.status}`);
        expect(data.error).to.equal('Invalid email or password');
    });
    it ('should not login with an unregistered email', async() => {
        const email = 'somerandom@foo.com';
        const password = 'Password123';
        const response = await fetch(base_url + '/api/login', {
            method: 'post',
            headers: {
                'Content-Type':'application/json'
            },
            body: JSON.stringify({'email': email, 'password': password})
        });
        const data = await response.json();
        expect(response.status).to.equal(404, `Expected status 404 but received ${response.status}`);
        expect(data.error).to.equal('Account not found or does not exist');
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
        console.log('token_version: '+ loginData.token_version);
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
        console.log('Token after logout 1: ' + token);
        expect(data.message).to.equal('Logged out successfully');
    });

    it('should prevent from using used token to access a protected route after logout', async () => {
        // Send request to a protected route after logout
        const response = await fetch('http://localhost:5000/api/reviews', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`, // Token should be invalid after logout
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                movieId: 15121,
                description: "Try to send a review",
                rating: 4
            })
        });

        const data = await response.json();
        console.log('Token after logout: ' + token);
        console.log('Response status: ' + response.status);
        console.log('Response body:', data);
        expect(response.status).to.equal(401);
    });
});

// Delete account
describe('DELETE account', () => {
    const name = 'delete';
    const email = 'delete@foo.com';
    const password = 'Delete123';
    let token;

    before(async () => {
        await insertTestUser(name, email, password);
        token = await getToken(email);
    });

    it('should delete an account', async () => {
        const response = await fetch(base_url + '/api/auth/account', {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        const data = await response.json();
        console.log('Response data:', data);

        expect(response.status).to.equal(200);
        expect(data.message).to.equal('Account deleted successfully');

        // Confirm the account no longer exists in the database
        const deletedUser = await findUserByEmail(email);
        expect(deletedUser).to.be.null;
    });

    it('should prevent from deleting if no authorization token is provided', async () => {
        const response = await fetch(base_url + '/api/auth/account', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const data = await response.json();

        expect(response.status).to.equal(401, `Expected status 401 but received ${response.status}`);
        expect(data.message).to.equal('No token, authorization denied');
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
    
    it('should return an empty array if no reviews are present', async () => {
        // Clear the reviews table to simulate no data
        await pool.query('DELETE FROM reviews');

        const response = await fetch(base_url + '/api/reviews');
        const data = await response.json();

        expect(response.status).to.equal(200, `Expected status 200 but received ${response.status}`);
        expect(data).to.be.an('array').that.is.empty;
    });

    it('should ignore unexpected query parameters and return 200', async () => {
        const response = await fetch(base_url + '/api/reviews?unexpectedParam=123');
        const data = await response.json();

        expect(response.status).to.equal(200, `Expected status 200 but received ${response.status}`);
        expect(data).to.be.an('array');
    });

});