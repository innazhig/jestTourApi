
import * as supertest from 'supertest';

const request = supertest('localhost:8001/api/v1');
import {User, Tour, TestData} from "../../../data/interface";

import {createRandomTour} from "../../../data/tour";
import {signUp, loginFunction, deleteUser, deleteTour, createTour} from '../../../data/helpers';
import {createUser} from "../../../data/user";
import { createNegativeTestData} from "../../../data/tourNegative";

const URL_TOURS = '/tours';
let cookie = null; //:[x:string]
let user: User;
let tour: Tour;
let tourId = '';
let tests: TestData[] = createNegativeTestData();

describe('TOUR - Negative', () => {
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
            console.log(cookie, '==================== User Created:  Cookie ======================')
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

    it('TOUR NAME Negative', async () => {
        console.log('=========================== Tour NAME Negative Checks ==============================');

        const nameTests = tests.filter(test => test.fieldName === 'name');
        for (let i = 0; i < nameTests.length; i++) {
            console.log(`============= Tour NAME Negative Checks : ${nameTests[i].testName} ==============`);
            console.log(nameTests[i].tour, '============================  Tour  =========================')
            const res = await createTour(cookie, nameTests[i].tour);

            if (res.statusCode === 201) { // if tour was created
                // delete tour
                await deleteTour(cookie, res.body.data.data._id).then(res => {
                    expect(res.statusCode).toBe(204);
                    expect(res.body).toEqual({});
                    console.log(res.statusCode, ' ==================== Tour Delete Status ======================')
                });
            }

            console.log(res.body, `==================== Response Tour NAME Negative Checks : ${nameTests[i].testName} ======================`);
            expect(res.statusCode).toBe(nameTests[i].statusCode);
            expect(res.body.status).toBe('error');
            expect(res.body).toHaveProperty('error');
            expect(res.body.error.message).toBe(nameTests[i].errorMsg);
        }
    });

    it ('TOUR RATINGS AVERAGE Negative', async () => {
        console.log('=========================== Tour RATINGS AVERAGE Negative Checks ==============================');

        const ratingsAverageTests = tests.filter(test => test.fieldName === 'ratingsAverage');
        console.log('============================  Tour RATINGS AVERAGE DATA Array  =========================',ratingsAverageTests );
        let res = null;
        for (let i = 0; i < ratingsAverageTests.length; i++) {
            console.log(`============= Tour RATINGS AVERAGE Negative Checks : ${ratingsAverageTests[i].testName} ==============`);
            console.log(ratingsAverageTests[i].tour, '============================  Tour  =========================')
            try {
                res = await createTour(cookie, ratingsAverageTests[i].tour);

                if (res.statusCode === 201) { // if tour was created
                    // delete tour
                    await deleteTour(cookie, res.body.data.data._id).then(res => {
                        expect(res.statusCode).toBe(204);
                        expect(res.body).toEqual({});
                        console.log(res.statusCode, ' ==================== Tour Delete Status ======================')
                    });
                }

                console.log(res.body, `================ Response Body : ${ratingsAverageTests[i].testName} ================`);
                expect(res.statusCode).toBe(ratingsAverageTests[i].statusCode);
                expect(res.body.status).toBe('error');
                expect(res.body).toHaveProperty('error');
                expect(typeof res.body.error).toBe('object');
                expect(res.body.error).toBeDefined();
                expect(res.body).toHaveProperty('message');
                expect(res.body.error.message).toBe(ratingsAverageTests[i].errorMsg);
                expect(res.body).not.toHaveProperty('data.data.ratingsAverage');
            } catch (e) {
                console.log(res.body, `=============== ERROR: ${ratingsAverageTests[i].testName} - Response Body ==================`);
                throw e;
            }
        }
    });


});