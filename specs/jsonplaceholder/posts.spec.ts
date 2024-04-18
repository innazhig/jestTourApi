import * as supertest from 'supertest';

const request = supertest('https://jsonplaceholder.typicode.com');

describe('POSTS', () => {
    it.skip('GET request', async () => {
        const res = await request.get('/posts');
        //console.log(res);
        expect(res.statusCode).toEqual(200);
        expect(res.body.length).toBeGreaterThan(0);
        expect(res.body[0]).toHaveProperty('userId');
        expect(res.body[0]).toHaveProperty('id');
        expect(res.body[0].id).toBe(1);
        expect(res.body[0]).toHaveProperty('title');
        expect(typeof res.body[0].title).toEqual("string");

    });

    it('POST request', async () => {
        const data = {
            userId: 211,
            title: "my first post request",
            body: "test test test"
        };
        const res = await request.post('/posts').send(data);
        //console.log(res);
        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('userId');
        expect(res.body.userId).toBe(211);
        expect(res.body).toHaveProperty('title');
        expect(res.body.title).toEqual("my first post request");
    });

    it.skip('PATCH request', async () => {
        const data = {
            title: "patched title - patch request test"
        };
        const getRes = await request.get('/posts/1');
        const beforeTitle = getRes.body.title;

        const res = await request.patch('/posts/1').send(data);
        //console.log(res);
        expect(res.statusCode).toBe(200);
        expect(res.body.title).toBe(data.title);
        expect(res.body.title).not.toBe(beforeTitle);
    });

    it('PATCH request version 2',  async() => {
        const data = {
            title: "patched title - patch request test"
        };

        let beforeTitle = null; //resBefore.body.title;
        await request
            .get('/posts/1')
            .then(res => {
                beforeTitle = res.body.title;
            });

        console.log('beforeTitle = ', beforeTitle );

        await request
            .patch('/posts/1')
            .send(data)
            .then(res => {
                console.log(' response body := ', res.body);
                //try{ // if we catch an error test will not fail !!!
                //    expect(res.statusCode).toBe(500);
                //}
                //catch(err){
                //    console.log('error := ', err);
                //}
                expect(res.statusCode).toBe(200);
                expect(res.body.title).toBe(data.title);
                expect(res.body.title).not.toBe(beforeTitle);
            });
    });

    it.only('PATCH request version 3 - with callback, no async', (done) => {
        const data = {
            title: "patched title - patch request test"
        };

        let beforeTitle = null;
        request
            .get('/posts/1')
            .expect(200)
            .end((err, res) => {
                if (err) return done(err);
                beforeTitle = res.body.title;
                console.log('beforeTitle from GET = ', beforeTitle );
                //done(); not finished yet
            });


        request
            .patch('/posts/1')
            .send(data)
            .end((err, res) => {
                //console.log(' response body := ', res.body);
                if (err) return done(err);
                try {
                    expect(res.statusCode).toBe(200);
                    expect(res.body.title).toBe(data.title);
                    //console.log('beforeTitle from PATCH = ', beforeTitle );
                    expect(res.body.title).not.toBe(beforeTitle);
                    return done(); // finished - if we omit this line, test would not finish - and fail after timeout
                } catch (error) {
                    done(error); // if we omit this line, test would not finish right away - and fail only after timeout
                }
            });
    });

    it('PUT request - Update Body and Title', async (id = 2) => {
        const data = {
            userId: 1,
            title: "new title",
            body: "!!! new body !!!"
        };

        const res = await request.put('/posts/' + id).send(data);
        //console.log(res);
        expect(res.statusCode).toBe(200);
        expect(res.body.id).toBe(id);
        expect(res.body).toHaveProperty('body');
        expect(res.body.body).toBe(data.body);
        expect(res.body).toHaveProperty('title');
        expect(res.body.title).toBe(data.title);
        expect(res.body).toHaveProperty('userId');
        expect(res.body.userId).toBe(data.userId);
    });

    it('PUT request - Update UserId - Remove Body and Title', async (id = 2) => {
        const data = {
            userId: 100
        };

        const res = await request.put('/posts/' + id).send(data);
        //console.log(res);
        expect(res.statusCode).toBe(200);
        expect(res.body).not.toEqual({});
        expect(res.body.id).toBe(id);
        expect(res.body.userId).toBe(data.userId);
        expect(res.body).not.toHaveProperty('body');
        expect(res.body).not.toHaveProperty('title');
    });

    it('PUT request - Update UserId - Remove Body and Title Version 2 Without Async',  (done, id = 2) => {
        const data = {
            userId: 100
        };

        request
            .put('/posts/' + id)
            .send(data)
            .end((err, res) => {
                //console.log(res);
                if(err) return done(err);
                try {
                    expect(res.statusCode).toBe(200);
                    expect(res.body.id).toBe(id);
                    expect(res.body.userId).toBe(data.userId);
                    expect(res.body).not.toHaveProperty('body');
                    expect(res.body).not.toHaveProperty('title');
                    return done();
                } catch (err) {
                    done(err);
                }
            });
    });

    it('DELETE request', async (id = 1) => {
        const res = await request.delete('/posts/'+id);
        //console.log(res);
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({});
    });

});

describe('POSTS Negative', () => {
    it('PUT request Negative - Update ID', async (id = 2) => {
        const data = {
            id: 2002,
            userId: 1,
            title: "new title",
            body: "!!! new body !!!"
        };

        const res = await request.put('/posts/'+id).send(data);
        //console.log(res);
        expect(res.statusCode).toBe(200);
        expect(res.body.id).toBe(id);
        expect(res.body.id).not.toBe(data.id);
    });
});