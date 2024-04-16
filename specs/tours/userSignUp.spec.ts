import * as supertest from 'supertest';
import {user} from '../../data/user';

const request = supertest('localhost:8001/api/v1');


describe('USER SIGNUP', () => {
    describe('POSITIVE TESTING', () => {
        it.skip('User Signup POST request - fixed Data', async () => {

            const user = {
                name: "John Doe205",
                email: "john205@hotmail.com",
                password: "12345678",
                passwordConfirm: "12345678",
            };

            console.log(user);
            let res = null;
            try{
                res = await request
                    .post('/users/signup')
                    .send(user)
                    //.expect(201);

                console.log(res.body);
                expect(res.statusCode).toBe(201);
                expect(res.body.data.user.name).toBe(user.name);
                expect(res.body.token).toBeDefined();
                expect(typeof res.body.token).toBe('string');
                expect(res.body.data.user.email).toBe(user.email);
                expect(res.body.data.user.role).toBe('admin');
                expect(res.body.data.user.active).toBe(true);
            } catch (err) {
                console.log(res.body, " ==================== ERROR - response body ======================");
                throw err
            }
        });


        it('Create new User POST request', async () => {

            console.log(user);

            const res = await request
                .post("/users/signup")
                .send(user)
                .expect(201);

            console.log(res.body);

            expect(res.body.data.user.name).toBe(user.name);
            expect(res.body.token).toBeDefined();
            expect(typeof res.body.token).toBe('string');
            expect(res.body.data.user.email).toBe(user.email);
        });

        it('Create new User POST request no async', (done) => {

            console.log(user);

            request
                .post("/users/signup")
                .send(user)
                .expect(201)
                .end((err, res) => {
                    if (err) return done(err);
                    console.log(res.body);
                    try {
                        expect(res.body.data.user.name).toBe(user.name);
                        expect(res.body.token).toBeDefined();
                        expect(typeof res.body.token).toBe('string');
                        expect(res.body.data.user.email).toBe(user.email);
                        done();
                    } catch (err) {
                        done();
                    }
                });
        });
    });

    describe.only('NEGATIVE TESTING', () => {
        it('User Signup - Should not create with the same Email', async () => {
            console.log(user);
            await request.post('/users/signup').send(user).expect(201);
            await request.post('/users/signup').send(user).then(resp => {
                // console.log(resp.body.status, "===============status============================");
                // console.log(user.email, "=================email==========================");
                expect(resp.body.message)
                    .toBe(`E11000 duplicate key error collection: test.users index: email_1 dup key: { email: "${user.email}" }`);
            });
        });

        it('User Signup - Should not create User without Name', async () => {
            await request.post('/users/signup').send({
                email: user.email,
                password: user.password,
                passwordConfirm: user.passwordConfirm
            }).then(resp => {
                console.log(resp.body.status, "================status=======================");
                if (resp.body.status === 'error') {
                    console.log(resp.body.message, "================body.message=======================");
                }
                expect(resp.body.message).toBe('User validation failed: name: Please tell us your name!');
            });
        });
    });
});
