import * as supertest from 'supertest';
const END_POINT = '/photos/';

const request = supertest('https://jsonplaceholder.typicode.com');

describe('PHOTOS - positive', () => {
    it('GET All Todos', async () => {
        const res = await request.get('/photos');

        expect(res.statusCode).toBe(200);
        expect(res.body.length).toBeGreaterThan(0);

        const photo = res.body[0];

        expect(photo).toHaveProperty('id');
        expect(photo.id).toBe(1);

        expect(photo).toHaveProperty('albumId');
        expect(photo).toHaveProperty('title');

        expect(photo).toHaveProperty('url');
        //expect(photo.url).toEqual(expect.stringMatching(/^https?:\/\/.*\.(jpg|jpeg|png|gif)$/));
        expect(photo.url).toEqual(expect.stringContaining('https://' || 'http://'));

        expect(photo).toHaveProperty('thumbnailUrl');
        expect(photo.thumbnailUrl).toEqual(expect.stringContaining('https://' || 'http://'));
    })

    it('GET Photo by ID', async (pid=200) => {
        const res = await request.get('/photos/'+pid);
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('id');
        expect(res.body.id).toBe(pid);
    });

    it('GET Photos by AlbumID', async (aid=10) => {
        const res = await request.get('/photos?albumId='+aid);
        expect(res.statusCode).toBe(200);
        expect(res.body.length).toBeGreaterThan(0);
        const photos = res.body;
        photos.forEach(photo => expect(photo.albumId).toBe(aid));
    });

    it('POST A Photo', async () => {
        const data = {
            albumId: 11,
            title: "new photo - test",
            url: "https://via.placeholder.com/600/92c952",
            thumbnailUrl: "https://via.placeholder.com/150/92c952"
        };

        const res = await request.post('/photos').send(data);

        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty('albumId');
        expect(res.body.albumId).toBe(11);
        expect(res.body).toHaveProperty('title');
        expect(res.body.title).toEqual(data.title);
        expect(res.body).toHaveProperty('url');
        expect(res.body.url).toEqual(data.url);
        expect(res.body).toHaveProperty('thumbnailUrl');
        expect(res.body.thumbnailUrl).toEqual(data.thumbnailUrl);
    });

    it('PATCH A Photo', async (pid=1) => {
        const data = {
            title: "patched title - test"
        };

        let beforeBody = null;
        await request
            .get(END_POINT + pid)
            .then(res => {
                beforeBody = res.body;
            });

        const res = await request.patch(END_POINT+pid).send(data);
        expect(res.statusCode).toBe(200);
        expect(res.body.title).toBe(data.title);
        expect(res.body.title).not.toBe(beforeBody.title);
        expect(res.body.id).toBe(pid);
        expect(res.body.albumId).toBe(beforeBody.albumId);
        expect(res.body.url).toBe(beforeBody.url);
    });

    it('PATCH A Photo - Version 2 Without Async',  (done, pid=10) => {
        const data = {
            title: "patched title - test",
            url: null,
            thumbnailUrl: null
        };

        let beforeBody = null;
        request
            .get(END_POINT + pid)
            .end((err, res) => {
                if (err) return done(err);
                beforeBody = res.body;
                //console.log('beforeBody = ', beforeBody)
            });

        request
            .patch(END_POINT+pid)
            .send(data)
            .end((err, res) => {
                if (err) return done(err);
                try {
                    expect(res.statusCode).toBe(200);
                    //console.log(' response body PATCH := ', res.body);
                    expect(res.body.id).toBe(pid);
                    expect(res.body.albumId).toBe(beforeBody.albumId);
                    expect(res.body.title).toBe(data.title);
                    expect(res.body.url).toEqual(null);
                    expect(res.body.thumbnailUrl).toEqual(null);
                    done();
                }
                catch(error) {
                    done(error);
                }
            })
    });

    it('PUT Request Photo - Update A Title', (done, pid= 100) => {
        const data = {
            title: "PUT request - test"
            // albumId: undefined,
            // url: undefined,
            // thumbnailUrl: undefined
        };

        // get photo by ID
        // request
        //     .get(END_POINT + pid)
        //     .end((err, res) => {
        //         if (err) return done(err);
        //         //console.log('res.body GET = ', res.body);
        //         data.albumId = res.body.albumId;
        //         data.url = res.body.url;
        //         data.thumbnailUrl = res.body.thumbnailUrl;
        //         //console.log('data At GET = ', data);
        //     });

        request
            .patch(END_POINT + pid)
            .send(data)
            .end((err, res) => {
                if (err) return done(err);
                try {
                    expect(res.statusCode).toBe(200);
                    console.log('res.body PATCH = ', res.body);
                    console.log('data At PATCH = ', data);
                    expect(res.body.id).toBe(pid);
                   //expect(res.body.albumId).toBe(data.albumId);
                    expect(res.body.title).toBe(data.title);
                   //expect(res.body.url).toBe(data.url);
                   //expect(res.body.thumbnailUrl).toBe(data.thumbnailUrl);
                    done();
               } catch (error) {
                   done(error);
                }
            })

    });

    it('DELETE A Photo', async (pid= 10) => {
        const res = await request.delete(END_POINT + pid);
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({});
    });

    it('DELETE A Photo - Version 2 Without Async', (done, pid= 11) => {
        request
            .delete(END_POINT + pid)
            .end((err, res) => {
                if (err) return done(err);
                try {
                    expect(res.statusCode).toBe(200);
                    expect(res.body).toEqual({}); // empty object
                    done();
                } catch (error) {
                    done(error);
                }
            });
    });

});

describe('PHOTOS - negative', () => {
    it('GET A Photo By ID - Negative', async () => {
        const res = await request.get('/photos/0');
        expect(res.statusCode).toEqual(404);
        expect(res.body).toEqual({});
    });
});