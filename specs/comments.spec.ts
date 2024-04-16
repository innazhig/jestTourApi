import * as supertest from 'supertest';

const request = supertest('https://jsonplaceholder.typicode.com');

describe('COMMENTS', () => {
    it('GET All Comments', async () => {
        const res = await request.get('/comments');
        //console.log(res);
        expect(res.statusCode).toEqual(200);
        expect(res.body.length).toBeGreaterThan(0);
        expect(res.body[0]).toHaveProperty('postId');
        expect(res.body[0]).toHaveProperty('id');
        //expect(res.body[0].id).toBe(1);
        expect(res.body[0].id).toEqual(expect.any(Number));
        expect(res.body[0]).toHaveProperty('name');
        // how to check if it's not an empty string ?
        expect(res.body[0].name.length).toBeGreaterThan(0);
        expect(res.body[0]).toHaveProperty('email');
        // how to check if it's a valid email ?
        //expect(res.body[0].email).toEqual(expect.stringMatching(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/));
        expect(res.body[0].email).toEqual(expect.stringMatching(/^[^@]*\@[^@]*$/));
        expect(res.body[0]).toHaveProperty('body')
        expect(res.body[0].body.length).toBeGreaterThan(0);
    });

    it('GET A Comment By ID', async () => {
        const res = await request.get('/comments/10');
        //console.log(res);
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('postId');
        expect(res.body).toHaveProperty('id');
        expect(res.body.id).toBe(10);
        expect(res.body).toHaveProperty('name');
        expect(res.body.name.length).toBeGreaterThan(0);
        expect(res.body).toHaveProperty('email');
        expect(res.body.email).toEqual(expect.stringMatching(/^[^@]*\@[^@]*$/));
        expect(res.body).toHaveProperty('body')
        expect(res.body.body.length).toBeGreaterThan(0);
    });

    it('GET A Comment By ID - Negative', async () => {
        const res = await request.get('/comments/0');
        //console.log(res);
        expect(res.statusCode).toEqual(404);
        expect(res.body).toEqual({});
    });

    it('GET Comments By PostId', async () => {
        const postId = 1;
        const res = await request.get('/posts/' + postId + '/comments');
        //console.log(res);
        expect(res.statusCode).toEqual(200);
        expect(res.body.length).toBeGreaterThan(0);
        expect(res.body[0].postId).toBe(postId);
    });

    it('POST A Comment', async () => {
        const data = {
            "postId": 11,
            "name": "POST a comment test",
            "email": "ii@gardner.biz",
            "body": "post a comment test body"
        }
        const res = await request.post('/comments').send(data);
        //console.log(res);
        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('postId');
        expect(res.body.postId).toBe(11);
        expect(res.body).toHaveProperty('name');
        expect(res.body.name).toEqual("POST a comment test");
        expect(res.body).toHaveProperty('email');
        expect(res.body.email).toEqual("ii@gardner.biz");
        expect(res.body).toHaveProperty('body');
        expect(res.body.body).toEqual("post a comment test body");
    });

})
