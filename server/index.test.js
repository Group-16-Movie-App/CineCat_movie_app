import { initializeTestDb, insertTestUser, insertTestReview, insertTestGroup, getToken, findUserByEmail, getGroupId } from "./helpers/test.js";
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
        console.log('Token after logout 1: ' + token);
        expect(data.message).to.equal('Logged out successfully');
    });

    // it('should prevent from posting a review after logout', async () => {
    //     // Send request to a protected route after logout
    //     const response = await fetch('http://localhost:5000/api/reviews', {
    //         method: 'POST',
    //         headers: {
    //             'Authorization': `Bearer ${token}`, // Token should be invalid after logout
    //             'Content-Type': 'application/json'
    //         },
    //         body: JSON.stringify({
    //             movieId: 15121,
    //             description: "Try to send a review",
    //             rating: 4
    //         })
    //     });

    //     const data = await response.json();
    //     console.log('Token after logout: ' + token);
    //     console.log('Response status: ' + response.status);
    //     console.log('Response body:', data);
    //     expect(response.status).to.equal(401);
    // });
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

// Create a group:
describe ('POST a new group', () => {
    const name = 'groupOwner';
    const email = 'owner@foo.com';
    const password = 'Owner123';
    let token;
    before(async() => {
        await insertTestUser(name, email, password);
        token = await getToken(email);
    });
    it ('should create a group', async () => {
        const response = await fetch('http://localhost:5000/api/groups', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: "Testing Group",
                description: "This is a testing group from backend",
            })
        });
        const data = response.json();
        expect(response.status).to.equal(201);
    })
})

//Create a post in Group:
describe ('POST a new post', () => {
    const name = 'member';
    const email = 'member@foo.com';
    const password = 'Member123';
    let token;
    before(async() => {
        await insertTestUser(name, email, password);
        token = await getToken(email);
    });
    const name2 = 'newGroup';
    const email2 = 'newgroup@foo.com';
    const password2 = 'Owner123';
    const groupName = 'New test group';
    const gDescription = 'For testing';
    let ownerId;
    let groupId;
    before(async()=> {
        await insertTestUser(name2, email2, password2);
        ownerId = await findUserByEmail(email2)
        console.log(`found user with id=${ownerId.id}: ${JSON.stringify(ownerId)}`)
        await insertTestGroup(groupName, gDescription, ownerId.id )
        groupId = await getGroupId(groupName);
        console.log(`groupID: ${groupId}`)
    })
    it ('should create a post', async () => {
        const response = await fetch(`http://localhost:5000/api/groups/${groupId}/posts`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                title: "Testing post",
                description: "This is a testing post from backend",
                movieId: 15121
            })
        });
        console.log(`Fetching http://localhost:5000/api/groups/${groupId}/posts`)
        const data = await response.json();
        expect(response.status).to.equal(201);
    })
});

// Fetch all groups:
describe ('GET all groups', () => {
    it ('should get all groups', async() => {
        const response = await fetch(base_url + '/api/groups')
        const data = await response.json();
        
        console.log('Group list: ' + JSON.stringify(data[0]))
        expect(response.status).to.equal(200);
        expect(data).to.be.an('array').that.is.not.empty;
        expect(data[0]).to.include.all.keys('id','name','description','owner','created');
    });
})