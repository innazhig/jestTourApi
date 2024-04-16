import * as supertest from 'supertest';

import {createUser} from '../../data/user';
import {deleteFunction, loginFunction, signUp} from '../../data/helpers';
import {User} from "../../data/interface";
import {URL_HOST, URL_LOGIN, URL_SIGNUP} from "../../data/helpers";
import {checkSignUpResponse, checkLoginResponse} from "../../data/chechers";

const request = supertest(URL_HOST);

let user: User;


describe('User SIGNUP and LOGIN', () => {

    describe.only('POSITIVE TESTING', () => {

        describe.skip('POSITIVE TESTING - WITHOUT HOOKS', () => {
            it.skip('Login user with Helpers and Delete 1', async () => {
                user = createUser();

                const signUpRes = await signUp(user);
                checkSignUpResponse(signUpRes, user);

                const loginRes = await loginFunction(user);
                checkLoginResponse(loginRes, user);
                let cookies = loginRes.header['set-cookie'];

                const deleteRes = await deleteFunction(cookies);
                expect(deleteRes.statusCode).toBe(204);

                const loginAfterDeleteRes = await loginFunction(user);
                expect(loginAfterDeleteRes.statusCode).toBe(401);
            });

            it.skip('Login user with delete With Helpers: using then()', async () => {

                user = createUser();

                //request for signup
                let resSingUp = null;

                await signUp(user).then(res => {
                    expect(res.statusCode).toBe(201);
                    resSingUp = res;
                    checkSignUpResponse(res, user);
                })

                // request for login

                let cookies = null;

                await loginFunction(user)
                    .then(resLogin => {
                        expect(resLogin.statusCode).toBe(200);
                        //console.log(resLogin.header['set-cookie'], "====== Cookies =======")
                        cookies = resLogin.header['set-cookie'];
                        checkLoginResponse(resLogin, user);
                    });


                await deleteFunction(cookies).then(el => {
                    //console.log(el.body, "====== User deleted Response Body =======")
                    expect(el.statusCode).toBe(204);
                });

                await loginFunction(user).then(resLogin => {
                    //console.log(resLogin.body, "====== User logged in After Deletion Response Body =======");
                    expect(resLogin.statusCode).toBe(401);
                });

            });

            it.skip('Login with Valid Credentials', async () => {
                user = createUser();

                //request for signup
                const res = await request
                    .post(URL_SIGNUP)
                    .send(user)
                    .expect('Content-Type', /json/)
                    .expect(201);

                //console.log(res.header, "====== User created Response Header ====");


                // request for login
                const resLogin = await request
                    .post(URL_LOGIN)
                    .send({email: user.email, password: user.password})
                    .expect(200);

                //console.log(resLogin.header,  "====== User logged in Response Header =======");
                //console.log(resLogin.body,  "====== User logged in Response Body =======");


                expect(resLogin.header['content-type']).toEqual(expect.stringContaining('application/json'));  // check if the response is in json format
                expect(resLogin.body.data.user.name).toBe(user.name);
                expect(resLogin.body.data.user.email).toBe(user.email);
                expect(resLogin.body.token).toBeDefined();
                expect(typeof resLogin.body.token).toBe('string');
                //expect(resLogin.body.data.user.role).toEqual(res.body.data.user.role);
                const cookies = resLogin.header['set-cookie'];
                expect(cookies).toBeDefined();
                expect(cookies[0]).toBeDefined();
                expect(cookies[0]).toEqual(expect.stringContaining(resLogin.body.token));

            });

            it('Login - No async - await 1: done() - then()', (done) => {
                user = createUser();
                let userRole;
                let isError = false;
                let error = null;

                //request for signup - creating a new user first

                request
                    .post(URL_SIGNUP)
                    .send(user)
                    .then((res) => {
                        try {
                            expect(res.statusCode).toBe(201);
                            checkSignUpResponse(res, user);
                            userRole = res.body.data.user.role;

                            // request for login
                            return request
                                .post(URL_LOGIN)
                                .send({email: user.email, password: user.password});

                        } catch (err) {
                            isError = true;
                            error = err;
                            console.log(err, "== User sign in === Error message ========================================");
                            done(err);
                        }
                    })
                    .then((res) => {
                        if (!isError) {
                            try {
                                expect(res.statusCode).toBe(201);
                                expect(res.body.status).toBe('successy');
                                expect(res.body.data.user.role).toEqual(userRole); // user role should be the same as the role of the user created

                                done();
                            } catch (err) {
                                isError = true;
                                error = err;
                                console.log(err, "== User log in === Error message ========================================");
                                done(err);
                            }
                        }

                    });
                // if (isError) {
                //     done(error);
                // } else {
                //     done();
                // }

            });

            it.skip('Login async await: then()', async () => {
                user = createUser();
                let isUserCreated = false; // to check if requests are working one after another

                //request for signup - creating a new user first
                await request
                    .post(URL_SIGNUP)
                    .send(user)
                    .expect(201)
                    .expect('Content-Type', /json/)
                    .then((res) => {
                        isUserCreated = true;
                        //console.log('isUserCreated = ' + isUserCreated + '   ========== SIGNUP ==================');
                        //console.log(res.body);
                        expect(res.statusCode).toBe(201);
                        expect(res.header['content-type']).toEqual(expect.stringContaining('application/json'));  // check if the response is in json format
                        expect(res.body.data.user.name).toBe(user.name);
                        expect(res.body.data.user.email).toBe(user.email);
                    });

                // request for login
                await request
                    .post(URL_LOGIN)
                    .send({email: user.email, password: user.password})
                    .expect(200)
                    .then((res) => {
                        //console.log('isUserCreated = ' + isUserCreated + '   =============== LOGIN ===================');
                        //console.log(res,  "======================== User logged Response ==========================");
                        //console.log(res.body,  "================== User logged in Response Body ====================");
                        //console.log(res.header,  "=================== User logged in Response Header ===============");

                        expect(res.statusCode).toBe(200);
                        expect(res.header['content-type']).toEqual(expect.stringContaining('application/json'));  // check if the response is in json format
                        expect(res.body.data).not.toBeNull();
                    });
            });

            it.skip('Login - No async - await 2: done() - end()', (done) => {
                let isUserCreated = false;
                user = createUser();
                //request for signup - creating a new user first
                request
                    .post(URL_SIGNUP)
                    .send(user)
                    //.expect(201)
                    //.expect('Content-Type', /json/);
                    .end((err, res) => {
                        // console.log(res, '==================== User created Response ======================');
                        if (err) return done(err);

                        try {
                            //console.log(res.statusCode, '==================== User created Response ======================');
                             expect(res.statusCode).toBe(201);
                             isUserCreated = true;
                             console.log('isUserCreated = ' + isUserCreated + '  ========== SIGNUP ==================');
                             expect(res.header['content-type']).toEqual(expect.stringContaining('application/json'));  // check if the response is in json format
                             expect(res.body.data.user.name).toBe(user.name);
                             expect(res.body.data.user.email).toBe(user.email);
                             expect(res.body.token).toBeDefined();
                             expect(typeof res.body.token).toBe('string');

                            request
                                .post(URL_LOGIN)
                                .send({email: user.email, password: user.password})
                                //.expect(200)
                                .end((errLogin, resLogin) => {
                                    if (errLogin) return done(errLogin);
                                    try {
                                         console.log('isUserCreated = ' + isUserCreated + '  =============== LOGIN ===================');
                                        //     //console.log(res,  "======================== User logged Response ==========================");
                                        //     //console.log(res.body,  "================== User logged in Response Body ====================");
                                        //     //console.log(res.header,  "=================== User logged in Response Header ===============");
                                        expect(typeof resLogin).toBe('object');
                                        if (resLogin.statusCode !== 200) {
                                            console.log(resLogin.body.message + 'Error message ========================================');
                                        }
                                        expect(resLogin.statusCode).toBe(200);
                                        expect(resLogin.header['content-type']).toEqual(expect.stringContaining('application/json'));  // check if the response is in json format
                                        expect(resLogin.body.data.user.name).toBe(res.body.data.user.name);
                                        expect(resLogin.body.data.user.email).toBe(res.body.data.user.email);
                                        expect(resLogin.body.token).toBeDefined();
                                        expect(typeof resLogin.body.token).toBe('string');
                                        expect(resLogin.body.data.user.role).toEqual(res.body.data.user.role);

                                        expect(resLogin.header['set-cookie']).toBeDefined();
                                        expect(resLogin.header['set-cookie'][0]).toBeDefined();
                                        expect(resLogin.header['set-cookie'][0]).toEqual(expect.stringContaining(resLogin.body.token));

                                        console.log(resLogin.status, '==================== User logged in Response ======================');
                                        done();
                                    } catch (errorLogin) {
                                        done(errorLogin);
                                    }
                                });
                        } catch (errorSignIn) {
                            done(errorSignIn);
                        }
                    });

            });

            it.skip('Login - Helper functions - then()', async () => {
                user = createUser();
                let cookies = null;

                await signUp(user).then(res => {
                    console.log(res.statusCode, '  ==================== User created Response ======================');
                    expect(res.statusCode).toBe(201);
                    expect(res.body.data.user.email).toBe(user.email);
                });

                await loginFunction(user).then(res1 => {
                    console.log(res1.statusCode, '  ==================== User login Response ======================');
                    expect(res1.statusCode).toBe(200);
                    expect(res1.header['content-type']).toEqual(expect.stringContaining('application/json'));  // check if the response is in json format
                    expect(res1.body.data.user.name).toBe(user.name);
                    expect(res1.body.data.user.email).toBe(user.email);
                    cookies = res1.header['set-cookie'];
                });

                await deleteFunction(cookies).then(res2 => {
                    console.log(res2.statusCode, '  ==================== User deleted Response ======================');
                    expect(res2.statusCode).toBe(204);
                });
            });

        });

        describe.only('POSITIVE TESTING - WITH HOOKS', () => {
            let cookies = null;

            beforeEach(async () => {
                user = createUser();

                await signUp(user).then(res => {
                    expect(res.statusCode).toBe(201);
                    expect(res.header['content-type']).toEqual(expect.stringContaining('application/json'));  // check if the response is in json format
                    cookies = res.header['set-cookie'];
                    // console.log(res.header, "====== Header =======");
                    // console.log(res.header['set-cookie'], "====== Cookies =======");
                    // console.log(Array.isArray(res.header['set-cookie']), "====== Cookies is Array ??? =======");
                    // expect(Array.isArray(res.header['set-cookie'])).toBe(true);
                    //console.log(cookies, "====== Cookies variable =======");
                });
            });

            afterEach(async () => {

                await deleteFunction(cookies).then(res => {
                    expect(res.statusCode).toBe(204);
                    expect(res.body).toEqual({});
                });

                await loginFunction(user).then(resLogin => {
                    //console.log(resLogin.body, "====== User logged in After Deletion Response Body =======");
                    expect(resLogin.statusCode).toBe(401);
                });

                user = null;
            });


            it.skip('Login with Valid Credentials', async () => {

                // request for login
                const resLogin = await request
                    .post(URL_LOGIN)
                    .send({email: user.email, password: user.password})
                    .expect(200);

                //console.log(resLogin.body,  "====== User logged in Response Body =======");
                //console.log(resLogin.header,  "====== User logged in Response Header =======");

                expect(resLogin.header['content-type']).toEqual(expect.stringContaining('application/json'));  // check if the response is in json format
                expect(resLogin.body.data.user.name).toBe(user.name);
                expect(resLogin.body.data.user.email).toBe(user.email);
                expect(resLogin.body.token).toBeDefined();
                expect(typeof resLogin.body.token).toBe('string');
            });

            it('Login with Valid Credentials - With Helper Functions', async () => {

                await loginFunction(user).then(resLogin => {
                    checkLoginResponse(resLogin, user);
                });

            });

        });

        });

        describe.skip('NEGATIVE TESTING', () => {
            let cookie = null;//: [x: string];

            beforeEach(async () => {
                user = createUser();

                await signUp(user).then(res => {
                    expect(res.statusCode).toBe(201);
                    cookie = res.header['set-cookie'];
                });
            });

            afterEach(async () => {
                await deleteFunction(cookie).then(res => {
                    expect(res.statusCode).toBe(204);
                    expect(res.body).toEqual({});
                });
            });

            it('Login - Negative - Invalid password', async () => {
                const resLogin = await request
                    .post('/users/login')
                    .send({email: user.email, password: 'invalidPassword'})
                    .expect('content-type', /json/);

                expect(resLogin.statusCode).toEqual(401);
                //console.log(resLogin.body, "============= User Login Response Body ===============");
                expect(resLogin.body.status).toBe('fail');
                expect(resLogin.body.message).toBe('Incorrect email or password');
            })

            it('Login - Invalid password', async () => {
                await loginFunction({email: user.email, password: 'invalidPassword'}).then(resLogin => {
                    expect(resLogin.statusCode).toEqual(401);
                    //console.log(resLogin.body);
                    expect(resLogin.body.status).toBe('fail');
                    expect(resLogin.body.message).toBe('Incorrect email or password');
                });
            })

            it('Login - Invalid Email', async () => {
                const email = 'Invalid@email.test'

                await loginFunction({email, password: user.password}).then(resLogin => {
                    expect(resLogin.statusCode).toEqual(401);
                    //console.log(resLogin.body);
                    expect(resLogin.body.status).toBe('fail');
                    expect(resLogin.body.message).toBe('Incorrect email or password');
                });
            })

            it('Login - Invalid Email2', async () => {
                user.email = 'Invalid@email.test'

                await loginFunction(user).then(resLogin => {
                    expect(resLogin.statusCode).toEqual(401);
                    expect(resLogin.body.status).toBe('fail');
                    expect(resLogin.body.message).toBe('Incorrect email or password');
                });
            })
        })
    })