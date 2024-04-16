const supertest = require('supertest');
const request = supertest('https://jsonplaceholder.typicode.com');

describe('USERS', () => {
    it('GET All Users', async () => {
        const res = await request.get('/users');
        //console.log(res);
        expect(res.statusCode).toEqual(200);
        expect(res.body.length).toBeGreaterThan(0);
        expect(res.body[0]).toHaveProperty('id');
        expect(res.body[0].id).toEqual(1);
        expect(res.body[0]).toHaveProperty('name');
        expect(res.body[0].name.length).toBeGreaterThan(0);
        // check user name consists of 2 words
        expect(res.body[0].name.split(' ').length).toBe(2);
        expect(res.body[0]).toHaveProperty('username');
        expect(res.body[0].username.length).toBeGreaterThan(0);
        expect(res.body[0]).toHaveProperty('email');
        expect(res.body[0].email).toEqual(expect.stringMatching(/^[^@]*\@[^@]*$/));  // should have 1 @
        expect(res.body[0].email).toEqual(expect.stringMatching(/^[^.]*\.[^.]*$/));  // should have 1 dot
        expect(res.body[0]).toHaveProperty('address');
        expect(res.body[0]).toHaveProperty('phone');
        expect(res.body[0].phone.length).toBeGreaterThan(0);
        expect(res.body[0]).toHaveProperty('website');
        expect(res.body[0]).toHaveProperty('company');
        expect(res.body[0].company).toHaveProperty('name');
        expect(res.body[0].company).toHaveProperty('catchPhrase');
        expect(res.body[0].company).toHaveProperty('bs');
    });

    it('GET A User By ID', async (userId = 10) => {
        //const userId = 10;
        const res = await request.get('/users/'+userId);
        //console.log(res);
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('id');
        expect(res.body.id).toBe(10);
        expect(res.body).toHaveProperty('name');
        expect(res.body.name.length).toBeGreaterThan(0);
        expect(res.body).toHaveProperty('username');
        expect(res.body.username.length).toBeGreaterThan(0);
    });

    it('Check if user has Address field', async () => {
        const res = await request.get('/users/1');
        //console.log(res);
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('address');
        expect(res.body.address).toHaveProperty('street');
        expect(res.body.address.street.length).toBeGreaterThan(0);
        expect(res.body.address).toHaveProperty('suite');
        expect(res.body.address).toHaveProperty('city');
        expect(res.body.address.city.length).toBeGreaterThan(0);
        expect(res.body.address).toHaveProperty('zipcode');
        expect(res.body.address.zipcode.length).toBe(10);
        expect(res.body.address).toHaveProperty('geo');
        expect(res.body.address.geo).toHaveProperty('lat');
        const lat = parseFloat(res.body.address.geo.lat);
        expect(lat).toEqual(expect.any(Number));
        expect(res.body.address.geo).toHaveProperty('lng');
        const lng = parseFloat(res.body.address.geo.lng);
        expect(lng).toEqual(expect.any(Number));
    });

    it('GET A User By ID - Negative', async () => {
        const res = await request.get('/users/0');
        //console.log(res);
        expect(res.statusCode).toEqual(404);
        expect(res.body).toEqual({});
    });

    it('GET User By Username', async () => {
        const userName = "Antonette";
        const res = await request.get('/users?username='+userName);
        //console.log(res);
        expect(res.statusCode).toEqual(200);
        expect(res.body.length).toBe(1);
        expect(res.body[0]).toHaveProperty('id');
        expect(res.body[0]).toHaveProperty('username');
        expect(res.body[0].username).toEqual(userName);
    });

    it('GET User By Username - Negative', async () => {
        const userName = "????";
        const res = await request.get('/users?username='+userName);
        //console.log(res);
        expect(res.statusCode).toEqual(200);
        expect(res.body.length).toBe(0);
    });


    it('POST A User', async () => {

        const data = {
            "name": "Test User",
            "username": "testUser",
            "email": "test.user@hotmail.org",
            "address": {
                "street": "Hoeger Mall",
                "suite": "Apt. 692",
                "city": "South Elvis",
                "zipcode": "53919-4257",
                "geo": {
                    "lat": "29.4572",
                    "lng": "-164.2990"
                }
            },
            "phone": "493-170-9623 x156",
            "website": "kale.biz",
            "company": {
                "name": "Robel-Corkery",
                "catchPhrase": "Multi-tiered zero tolerance productivity",
                "bs": "transition cutting-edge web services"
            }
        }
        const res = await request.post('/users').send(data);
        //console.log(res);
        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('id');
        expect(res.body).toHaveProperty('name');
        expect(res.body.name).toEqual(data.name);
        expect(res.body).toHaveProperty('username');
        expect(res.body.username).toEqual(data.username);
        expect(res.body).toHaveProperty('email');
        expect(res.body.email).toEqual(data.email);
    });

});