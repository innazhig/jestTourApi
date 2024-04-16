import * as supertest from 'supertest';
const request = supertest('https://practice-react.sdetunicorns.com/api/test');
import { upload, uploadSingle} from '../data/helpers';

describe('UPLOADS', () => {
    it('Upload single document', async () => {
        await request.post('/upload/single')
            .attach('single', 'image/Untitled.png')
            .then(el => {
                console.log(el.body);
                expect(el.body.filename).toBe('Untitled.png')
            });
    });

    it('Upload single document with a helper', async () => {
        await uploadSingle('image/cute-kitten-2.jpg')
            .then((res) => {
                console.log(res.body);
                expect(res.statusCode).toBe(200)
                expect(res.body.filename).toBe('cute-kitten-2.jpg')
            });
    });

    it('Upload single document without Async 1',  () => {
        const req = request
            .post('/upload/single');

        req.attach('single' , 'image/cat-1.jpg');

        return req.then((res) => {
            console.log(res.body);
            expect(res.status).toBe(200);
            expect(res.body.filename).toBe('cat-1.jpg');
        });

        // return new Promise ((resolve, reject) => {
        //     req.end((err,res) =>{
        //         if(err) {
        //             console.log('=== Upload failed === ', err);
        //             return reject(err);
        //         }
        //         console.log('=== Upload success ===', res.body);
        //         expect(res.status).toBe(200);
        //         expect(res.body.filename).toBe('cat-1.jpg');
        //         resolve(res);
        //     })
        // });
    });

    it('Upload single document without Async 2',  (done) => {
        const req = request
            .post('/upload/single');

        req.attach('single' , 'image/cat-1.jpg');

        req.end((err,res) =>{
            if(err) {
                console.log('=== Upload failed === ', err);
                return done(err);
            }
            console.log('=== Upload success ===', res.body);
            try {
                expect(res.status).toBe(200);
                expect(res.body.filename).toBe('cat-1.jpg');
                done();
            } catch(e){
                done(e);
            };
        })
    });

    it('Upload single document without Async 3',  () => {
        const req = request
            .post('/upload/single');

        req.attach('single' , 'image/cat-1.jpg');

        return new Promise ((resolve, reject) => {
            req.end((err,res) =>{
                if(err) {
                    console.log('=== Upload failed === ', err);
                    return reject(err);
                }
                console.log('=== Upload success ===', res.body);
                expect(res.status).toBe(200);
                expect(res.body.filename).toBe('cat-1.jpg');
                resolve(res);
            })
        });
    });


    it('Upload multiple documents', async () => {
        const files: string[] = ['image/Untitled.png', 'image/photo-1545161296-d9c2c241f2ad.jpg'];
        const res = await upload(files);
        console.log(res.body);
        expect(res.status).toBe(200);
    });

    it('Upload multiple documents - no Async',  () => {
        const files: string[] = ['image/Untitled.png', 'image/photo-1545161296-d9c2c241f2ad.jpg'];
        const req = request.post('/upload/multiple');
        for ( const file of files) {
            req.attach('multiple', file);
        }

        return new Promise((resolve, reject) => {
            req.end((err, res) => {
                if (err) {
                    console.log('=== Upload failed === ', err);
                    return reject(err);
                }
                console.log('=== Upload success ===', res.body);
                expect(res.status).toBe(200);
                resolve(res);
            });
        });
    });

});