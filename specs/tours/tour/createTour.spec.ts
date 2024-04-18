import * as supertest from 'supertest';

const request = supertest('localhost:8001/api/v1');
import {User, Tour} from "../../../data/interface";

import {createRandomTour} from "../../../data/tour";
import {signUp, loginFunction, deleteUser, deleteTour, createTour} from '../../../data/helpers';
import {createUser} from "../../../data/user";

const URL_TOURS = '/tours';
let cookie = null; //:[x:string]
let user: User;
let tour: Tour;
let tourId = '';

describe('TOURS', () => {

    beforeAll(async () => {
        console.log('============================== Before All ===================================');

        //create a new user
        user = createUser();
        //console.log(user, '==================== User ======================');

        await signUp(user).then((res) => {
            expect(res.statusCode).toBe(201);
            //expect(res.body.data.user.).toHaveProperty('email');
            expect(res.body.data.user.email).toBe(user.email);
            cookie = res.header['set-cookie'];
            console.log(cookie, '==================== Cookie ======================')
        });
    });

    afterAll(async () => {
        console.log('============================== After All ===================================');
        // delete user
        await deleteUser(cookie).then(res => {
            expect(res.statusCode).toBe(204);
            expect(res.body).toEqual({});
            console.log(res.statusCode, ' ==================== User Delete Status ======================')
        });
    });

    beforeEach(async () => {
        console.log('============================== Before Each ===================================');

        //create a new tour
        tour = createRandomTour();
        tourId = '';
       // console.log(tour, '==================== Tour ======================');
    });

    afterEach(async () => {
        console.log('============================== After Each ===================================');
        if (!tourId) return;

        // delete tour
        await deleteTour(cookie, tourId).then(res => {
            expect(res.statusCode).toBe(204);
            expect(res.body).toEqual({});
            console.log(res.statusCode, ' ==================== Tour Delete Status ======================')
        });

        tour = null;
    });

    describe('TOUR Positive', () => {

        describe('CREATE TOUR', () => {

            it.skip('Create Tour - Fixed data', async () => {

                const testTour = {
                    name: "New Tour Galaxy9",
                    duration: 5,
                    maxGroupSize: 25,
                    difficulty: "easy",
                    price: 397,
                    summary: "This is a new tour",
                    description: "This is a new tour description",
                    imageCover: "tour-1-cover.jpg",
                    images: ["tour-1-1.jpg", "tour-1-2.jpg", "tour-1-3.jpg"],
                    startDates: ["2021-12-16,10:00", "2022-01-16,10:00", "2022-12-16,10:00"],
                    "startLocation": {
                        "type": "Point",
                        "coordinates": [-72.005974, 41.712776]
                    }
                };

                const res = await request
                    .post(URL_TOURS)
                    .set('Cookie', cookie)
                    .send(testTour);

                console.log(res.body);


                expect(res.statusCode).toBe(201);
                expect(res.body).toHaveProperty('data');
                expect(typeof res.body.data).toBe("object");

                const result = res.body.data.data;
                tourId = result._id;

                expect(result).toHaveProperty('name');
                expect(result.name).toBe(testTour.name);
                expect(result).toHaveProperty('duration');
                expect(result.duration).toBe(5);
                expect(result).toHaveProperty('difficulty');
                expect(result.difficulty).toBe("easy");
                expect(result).toHaveProperty('price');
                expect(result.price).toBe(397);
                expect(result).toHaveProperty('summary');
                expect(result.summary).toBe(testTour.summary);

                expect(result).toHaveProperty('images');
                expect(Array.isArray(result.images)).toBe(true);
                expect(result.images.length).toBe(3);
                expect(result.images).toEqual(["tour-1-1.jpg", "tour-1-2.jpg", "tour-1-3.jpg"]);
                expect(result).toHaveProperty('startDates');
                expect(result.startDates[0]).toMatch("2021-12-16");
            });

            it('Create Tour - Random data', async () => {
                console.log('============================== Create Tour - Random data ===================================');

                let response = null;
                try {
                    response = await createTour(cookie, tour);

                    console.log(response.body);
                    expect(response.statusCode).toBe(201);

                    tourId = response.body.data.data._id;
                    //console.log(tourId, '==================== Tour ID ======================')

                    expect(response.body).toHaveProperty('data');
                    expect(typeof response.body.data).toBe("object");
                } catch (e) {
                    //console.log(e, '==================== Error ======================');
                    console.log(response.body, '==================== ERROR: Create Tour - Random data - Response Body ======================');
                    throw e;
                }
            });

            it.skip('Create Tour - with Promise', function () {
                console.log('============================== Create Tour - with Promise ===================================');
                //this.timeout(10000);
                const req = request.post(URL_TOURS).set('Cookie', cookie).send(tour);

                return new Promise((resolve, reject) => {
                    req.end((err, res) => {
                        if (err) {
                            console.error('Tour creation error: ', err);
                            console.log('Tour creation error: ', err);
                            reject(err);
                        }
                        console.log('Tour Created: ', res.body);
                        expect(res.statusCode).toBe(201);
                        expect(res.body).toHaveProperty('data');
                        expect(typeof res.body.data).toBe("object");
                        tourId = res.body.data.data._id;
                        resolve(res);
                    });
                });

            });
        });

        describe.skip('TOUR NAME', () => {

            it('Tour Name should be at least 10 characters - Positive', async () => {
                console.log('============================== Tour Name should be at least 10 characters ===================================');

                tour.name = 'Tour123456'; // 10 characters
                let response = null;
                try {
                    const response = await createTour(cookie, tour);

                    expect(response.statusCode).toBe(201);
                    tourId = response.body.data.data._id;
                    //console.log(tourId, '==================== Tour ID ======================')

                    expect(response.body).toHaveProperty('data');
                    expect(typeof response.body.data).toBeDefined();
                    expect(response.body.data.data).toHaveProperty('name');
                    expect(response.body.data.data.name).toBe(tour.name);
                } catch (e) {
                    console.log(response.body, '==================== ERROR: Tour Name should be at least 10 characters - Response Body ======================');
                    throw e;
                }
            });

            it('Tour Name should be less or equal 40 characters', async () => {
                console.log('============================== Tour Name should be less or equal 40 characters ===================================');

                tour.name = 'Tour123456'.repeat(4); // 40 characters
                const res = await createTour(cookie, tour);

                console.log(res.body);

                expect(res.statusCode).toBe(201);

                tourId = res.body.data.data._id;
                //console.log(tourId, '==================== Tour ID ======================')

                expect(res.body).toHaveProperty('data');
                expect(typeof res.body.data).toBeDefined();
                expect(res.body.data.data).toHaveProperty('name');
                expect(res.body.data.data.name).toBe(tour.name);
            });
        });

        describe('RATING AVERAGE', () => {
            it('Rating Average should be less or equal 5', async () => {
                console.log('============================== Rating Average should be less or equal 5 ===================================');

                tour.ratingsAverage = 5;
                let res = null;

                try{
                    res = await createTour(cookie, tour);

                    expect(res.statusCode).toBe(201);

                    tourId = res.body.data.data._id;
                    //console.log(tourId, '==================== Tour ID ======================')

                    expect(res.body).toHaveProperty('data');
                    expect(typeof res.body.data).toBeDefined();
                    expect(res.body.data.data).toHaveProperty('ratingsAverage');
                    expect(res.body.data.data.ratingsAverage).toBe(tour.ratingsAverage);
                } catch (e) {
                    console.log(res.body, '=============== ERROR: Rating Average should be less or equal 5 - Response Body ==================');
                    throw e;
                }
            });

            it('Rating Average should be at least 1', async () => {
                console.log('============================== Rating Average should be at least 1 ===================================');

                tour.ratingsAverage = 1;
                const res = await createTour(cookie, tour);
                try {
                    expect(res.statusCode).toBe(201);

                    tourId = res.body.data.data._id;

                    expect(res.body).toHaveProperty('data');
                    expect(typeof res.body.data).toBeDefined();
                    expect(res.body.data.data).toHaveProperty('ratingsAverage');
                    expect(res.body.data.data.ratingsAverage).toBe(tour.ratingsAverage);
                } catch (e) {
                    console.log(res.body, '=============== ERROR: Rating Average should be at least 1 - Response Body ==================');
                    throw e;
                }
            });

            it('Rating Average default is 4.5', async () => {
                console.log('============================== Rating Average should be at least 1 ===================================');
                let res = null;
                delete tour.ratingsAverage;
                try {
                    res = await createTour(cookie, tour);

                    expect(res.statusCode).toBe(201);

                    tourId = res.body.data.data._id;

                    expect(res.body).toHaveProperty('data');
                    expect(typeof res.body.data).toBeDefined();
                    expect(res.body.data.data).toHaveProperty('ratingsAverage');
                    expect(res.body.data.data.ratingsAverage).toBe(4.5);

                } catch (e) {
                    console.log(res.body, '=============== ERROR: Rating Average should be at least 1 - Response Body ==================');
                    throw e;
                }
            });
        });

        describe('DIFFICULTY - Positive', () => {
            it('Difficulty should be easy, medium or difficult', async () => {
                console.log('============================== Difficulty should be easy, medium or difficult ===================================');

                const difficulties = ['easy', 'medium', 'difficult'];
                tour.difficulty = difficulties[Math.floor(Math.random() * difficulties.length)];
                const res = await createTour(cookie, tour);
                try {
                    expect(res.statusCode).toBe(201);
                    tourId = res.body.data.data._id;
                    expect(res.body).toHaveProperty('data');
                    expect(typeof res.body.data).toBeDefined();
                    //expect(res.body.data.data).toHaveProperty('difficulty');
                    expect(res.body).toHaveProperty('data.data.difficulty');
                    expect(res.body.data.data.difficulty).toBe(tour.difficulty);
                } catch(e) {
                    console.log(res.body, '=============== ERROR: Difficulty should be easy, medium or difficult - Response Body ==================');
                    console.log(e);
                    throw e;
                }
            });
        });


    });

    describe('TOUR - Negative Cases', () => {
        // afterEach(async () => {
        //     console.log('============================== After Each Negative===================================');
        //
        //     // delete tour
        //     // await deleteTour(cookie, tourId).then(res => {
        //     //     expect(res.statusCode).toBe(204);
        //     //     expect(res.body).toEqual({});
        //     //     console.log(res.status, ' ==================== Tour Delete Status ======================')
        //     // });
        //
        //     // delete user
        //     await deleteUser(cookie).then(res => {
        //         expect(res.statusCode).toBe(204);
        //         expect(res.body).toEqual({});
        //         console.log(res.status, ' ==================== User Delete Status ======================')
        //     });
        //
        //     user = null;
        //     tour = null;
        // });

        describe('TOUR NAME - Negative', () => {

            it.skip('TOUR NAME is required', async () => {
                console.log('=========================== Tour Name is required Negative ==============================');

                tour.name = '';
                const res = await createTour(cookie, tour);

                //console.log(res.body);

                expect(res.statusCode).toBe(500);
                expect(res.body.status).toBe('error');
                expect(res.body).toHaveProperty('error');
                expect(res.body.error.message).toBe('Tour validation failed: name: A tour must have a name');
            });

            it('TOUR NAME should be unique - Negative', async () => {
                console.log('======================= TOUR NAME should be unique - Negative ===========================');

                // create a tour
                const tourName = tour.name;
                await createTour(cookie, tour)
                    .then((res) => {
                        expect(res.statusCode).toBe(201);
                        expect(res.body.data.data.name).toBe(tour.name);
                        tourId = res.body.data.data._id;
                        //console.log(tourId, '==================== Tour ID ======================')
                    });

                // try to create a tour with the same name
                let response = null;
                const  tour2 = createRandomTour();
                tour2.name = tourName;
                try {
                    response = await createTour(cookie, tour2);
                    if (response.statusCode === 201) { // if the second tour was created
                        const tour2_ID = response.body.data.data._id;
                        await deleteTour(cookie, tour2_ID).then(res => {
                                expect(res.statusCode).toBe(204);
                                expect(res.body).toEqual({});
                                console.log(res.statusCode, ' ==================== Tour2 Delete Status ======================')
                        });
                    }
                    //console.log(response.body);
                    expect(response.statusCode).toBe(500);
                    expect(response.body.status).toBe('error');
                    expect(response.body).toHaveProperty('error');
                    expect(response.body.message)
                        .toBe(`E11000 duplicate key error collection: test.tours index: name_1 dup key: { name: "${tourName}" }`);

                } catch (e) {
                    console.log(response.body, '==================== ERROR: TOUR NAME should be unique - Negative - Response Body ======================');
                    throw e;
                }
            });

            it('Tour Name shorter than 10 characters', async () => {
                console.log('=================== Tour Name shorter than 10 characters Negative ========================');

                tour.name = 'Tour';
                let res = null;
                try {
                    res = await createTour(cookie, tour);
                    //console.log(res.body);

                    expect(res.statusCode).toBe(500);
                    expect(res.body.status).toBe('error');
                    expect(res.body).toHaveProperty('error');
                    expect(res.body.error.message)
                        .toBe('Tour validation failed: name: A tour name must have more or equal then 10 characters');
                } catch (e) {
                    //console.log(e, '==================== Error ======================');
                    console.log(res.body, '  ============ ERROR: Tour Name shorter than 10 characters Negative Response Body ===============  ');
                    throw e;
                }
            });

            it('Tour Name longer than 40 characters', async () => {
                console.log('===================== Tour Name longer than 40 characters Negative ========================');

                tour.name = 'Tour123456'.repeat(4) + 'T'; // 41 characters
                const res = await createTour(cookie, tour);

                console.log(res.body);

                expect(res.statusCode).toBe(500);
                expect(res.body.status).toBe('error');
                expect(res.body).toHaveProperty('error');
                expect(res.body.error.message).toBe("Tour validation failed: name: A tour name must have less or equal then 40 characters");
            });
        });

        describe('RATING AVERAGE - Negative', () => {
            it('Rating Average greater than 5', async () => {
                console.log(' ===================== RATING AVERAGE greater than 5 - Negative ==========================');

                tour.ratingsAverage = 6;
                let res = null;

                try{
                    res = await createTour(cookie, tour);

                    if (res.statusCode === 201) tourId = res.body.data.data._id;

                    expect(res.statusCode).toBe(500);
                    //console.log(res.body, '=============== Rating Average greater than 5 - Response Body ==================');

                    expect(res.body.status).toBe('error');
                    expect(res.body).toHaveProperty('error');
                    expect(typeof res.body.error).toBe('object');
                    expect(res.body.error).toBeDefined();
                    expect(res.body).toHaveProperty('message');
                    expect(res.body.message).toBe('Tour validation failed: ratingsAverage: Rating must be below 5.0');
                    expect(res.body).not.toHaveProperty('data.data.ratingsAverage');
                } catch (e) {
                    console.log(res.body, '=============== ERROR: RATING AVERAGE greater than 5 - Negative - Response Body ==================');
                    throw e;
                }
            });

            it('RATING AVERAGE less than 1', async () => {
                console.log('============================== RATING AVERAGE less than 1 ===================================');

                tour.ratingsAverage = 0.5;
                let res = null;
                try {
                    res = await createTour(cookie, tour);

                    if (res.statusCode === 201) tourId = res.body.data.data._id;

                    expect(res.statusCode).toBe(500);
                    //console.log(res.body, '=============== RATING AVERAGE less than 1 - Response Body ==================');

                    expect(res.body.status).toBe('error');
                    expect(res.body).toHaveProperty('error');
                    expect(typeof res.body.error).toBe('object');
                    expect(res.body.error).toBeDefined();
                    expect(res.body).toHaveProperty('message');
                    expect(res.body.message).toBe('Tour validation failed: ratingsAverage: Rating must be above 1.0');
                    expect(res.body).not.toHaveProperty('data.data.ratingsAverage');
                } catch (e) {
                    console.log(res.body, '=============== ERROR: RATING AVERAGE less than 1 - Response Body ==================');
                    throw e;
                }
            });

        });

        describe.only('DIFFICULTY - Negative', () => {
            it('DIFFICULTY should be easy, medium or difficult - Negative', async () => {
                console.log('===================== Difficulty should be easy, medium or difficult - Negative ==========================');

                tour.difficulty = 'super easy';
                const res = await createTour(cookie, tour);
                try {
                    if (res.statusCode === 201) tourId = res.body.data.data._id;
                    expect(res.statusCode).toBe(500);

                    expect(res.body).toHaveProperty('error');
                    expect(res.body.error).toHaveProperty('message');
                    expect(res.body).not.toHaveProperty('data.data.difficulty');
                    expect(res.body.error.message).toBe('Tour validation failed: difficulty: Difficulty is either: easy, medium, diffucult');

                } catch(e) {
                    console.log(res.body, '=============== ERROR: Difficulty should be easy, medium or difficult - Negative - Response Body ==================');
                    console.log(e);
                    throw e;
                }
            });

            it('DIFFICULTY is required - Negative', async () => {
                console.log('===================== DIFFICULTY is required - Negative ==========================');

                delete tour.difficulty;
                const res = await createTour(cookie, tour);
                try {
                    if (res.statusCode === 201) tourId = res.body.data.data._id;
                    expect(res.statusCode).toBe(500);

                    expect(res.body).toHaveProperty('error');
                    expect(res.body.error).toHaveProperty('message');
                    expect(res.body).not.toHaveProperty('data.data.difficulty');
                    expect(res.body.error.message).toBe('Tour validation failed: difficulty: A tour must have a difficulty');
                } catch(e) {
                    console.log(res.body, '=============== ERROR: DIFFICULTY is required - Negative - Response Body ==================');
                    console.log(e);
                    throw e;
                }
            });

        });
    });

});