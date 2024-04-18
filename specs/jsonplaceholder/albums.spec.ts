import * as supertest from 'supertest';
const END_POINT = '/albums/';

const request = supertest('https://jsonplaceholder.typicode.com');

describe('Albums - positive', () => {
    it('GET All Albums', async () => {
        const res = await request.get('/albums');
        //console.log(res);
        expect(res.statusCode).toBe(200);
        //expect(res.statusMessage).toBe('OK');  // not working ????
        expect(res.body.length).toBeGreaterThan(0);
        expect(res.body[0]).toHaveProperty('userId');
        expect(res.body[0]).toHaveProperty('id');
        expect(res.body[0]).toHaveProperty('title');
        expect(typeof res.body[0].title).toBe('string');
    });

    it('GET An Album by ID', async (aid=10) => {
        const res = await request.get('/albums/' + aid);
        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body)).toBe(false);

        expect(res.body).toHaveProperty('id');
        expect(res.body.id).toBe(aid);
    });

    it('GET Albums by UserId', async (userId=5) => {
        const res = await request.get('/albums?userId=' + userId);

        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body.length).toBeGreaterThan(0);

        const albums = res.body;
        albums.forEach(album => expect(album.userId).toBe(userId));
    })

    it('POST a new Album', async () => {
        const data = {
            userId: 10,
            title: "POSTing a new album - test"
        };

        const res = await request.post('/albums').send(data);
        expect(res.statusCode).toBe(201); // created

        expect(res.body).toHaveProperty('userId');
        expect(res.body.userId).toBe(data.userId);
        expect(res.body).toHaveProperty('title');
        expect(res.body.title).toEqual(data.title);
    })

    it('PATCH an Album', async (aid = 1) => {
        const data = {
            title: "PATCHing an album - test"
        };

        let bodyBefore = null;
        await request
            .get(END_POINT + aid)
            .then((res) => {
                bodyBefore = res.body;
            })

        const res = await request.patch(END_POINT + aid).send(data);
        expect(res.statusCode).toBe(200);
        expect(res.body.id).toBe(aid);
        expect(res.body.userId).toBe(bodyBefore.userId);
        expect(res.body.title).toBe(data.title);
    });

    it('PATCH an Album - Version 2 - without Async', (done, aid = 10) => {
        const data = {
            title: "PATCHing an album - test"
        };

        let bodyBefore = null;
        request
            .get(END_POINT + aid)
            .then((res) => {
                bodyBefore = res.body;
                return request.patch(END_POINT + aid).send(data);
            })
            .then((res) => {
                try {
                    expect(res.statusCode).toBe(200);
                    expect(res.body.id).toBe(aid);
                    expect(res.body.userId).toBe(bodyBefore.userId);
                    expect(res.body.title).toBe(data.title);
                    done();
                } catch (error) {
                    done(error);
                }
            });
    })

    it('DELETE An Existing Album', async (aid = 10) => {
        const res = await request.delete(END_POINT + aid);

        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({}); // empty object

        // verify that the album is deleted
        // const getRes = await request.get(END_POINT + aid);
        // expect(getRes.statusCode).toBe(404); // Not Found
        // expect(getRes.body).toEqual({});
    });

    it('DELETE An Existing Album - Version 2 - without Async', (done, aid = 10) => {
        request
            .delete(END_POINT + aid)
            .then((res) => {
                try {
                    expect(res.statusCode).toBe(200);
                    expect(res.body).toEqual({}); // empty object
                    done();
                } catch (error) {
                    done(error);
                }
            });
    })

    it('PUT request - Update Title Without Async', (done, aid = 20) => {
        const data = {
            title: "PUT test - album set new title",
            userId: undefined
        };

        // get existing data
        request
            .get(END_POINT + aid)
            .then((res) => {
                try{
                    expect(res.statusCode).toBe(200);
                    expect(res.body.id).toBe(aid);
                    console.log('res.body.userId:= ', res.body.userId);
                    data.userId = res.body.userId;
                } catch (error) {
                    done(error);
                }
                return request.put(END_POINT + aid).send(data);
            })
            .then( (res1) => {
                try {
                    expect(res1.statusCode).toBe(200);
                    expect(res1.body.id).toBe(aid);
                    expect(res1.body.title).toBe(data.title);
                    expect(res1.body.userId).toBe(data.userId);
                    done();
                } catch (error) {
                    done(error);
                }
            });
    });

    it('PUT request - Update UserId - Remove Title', async (aid = 2) => {
        const data = {
            userId: 100
        };

        const res = await request.put(END_POINT + aid).send(data);
        expect(res.statusCode).toBe(200);
        expect(res.body).not.toEqual({});
        expect(res.body.id).toBe(aid);
        expect(res.body.userId).toBe(data.userId);
        expect(res.body).not.toHaveProperty('body');
        expect(res.body).not.toHaveProperty('title');
    });



});

describe('ALBUMS - Negative', () => {

    it('GTE an ALBUM by ID - Negative', async () => {
        const res = await request.get('/albums/0');

        expect(res.statusCode).toBe(404); // Not Found
        expect(res.body).toEqual({});
    });

    it('GET Albums by UserId - Negative', async () => {
        const res = await request.get('/albums?userId=0');
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual([]);
    });

    it('POST a new Album - Negative provide ID', async () => {
        const data = {
            id: 1000,
            userId: 11,
            title: "POSTing a new album - test"
        };

        const res = await request.post('/albums').send(data);
        expect(res.statusCode).toBe(201); // created

        expect(res.body).toHaveProperty('userId');
        expect(res.body.userId).toBe(data.userId);

        expect(res.body).toHaveProperty('id');
        expect(res.body.id).not.toBe(data.id);
    });

})