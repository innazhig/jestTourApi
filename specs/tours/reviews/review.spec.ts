import * as supertest from 'supertest';
const request = supertest('localhost:8001/api/v1');

//import {User, Tour, Review, TestData} from "../../../data/interface";
import {signUp, loginFunction, deleteUser, createTour, createReview} from "../../../data/helpers";
import {createUser} from "../../../data/user";
import {createRandomTour} from "../../../data/tour";
import {createRandomReview} from "../../../data/review";
import {faker} from "@faker-js/faker";

let user = createUser();
let cookie = '';
let userId = '';
let tourId = '';
describe("REVIEW", () => {

    beforeAll( async() =>  {
        console.log('==================== Before All Start Review Test ======================');

        await signUp(user).then((res ) => {
            expect(res.statusCode).toBe(201);
            expect(res.body.data.user.email).toBe(user.email);
            cookie = res.header['set-cookie'];
            userId = res.body.data.user._id;
            console.log(res.body.data.user._id+" "+res.body.data.user.name, '==================== User Created:  _id, name ======================')
        });

        //Login user
        // await loginFunction(user).then((res) => {
        //     expect(res.statusCode).toBe(200);
        //     expect(res.body.data.user.email).toBe(user.email);
        //     console.log(res.header['set-cookie'], '==================== User Logged In:  Cookie ======================')
        // });
    });

    // afterAll(async () => {
    //     console.log('==================== After All Start Review Test ======================');
    //     deleteUser(cookie).then((res) => {
    //         expect(res.statusCode).toBe(204);
    //         console.log(res.body, '==================== User Deleted ======================');
    //     });
    // });

    beforeEach(async () => {
        // create tour
        let tour = createRandomTour();
        await createTour(cookie,tour)
            .then((res) => {
                expect(res.statusCode).toBe(201);
                tourId = res.body.data.data._id;
                console.log(res.body.data.data._id+" "+res.body.data.data.name, '==================== Tour Created : _id, name ======================');
            });
    });

    // afterEach(async () => {
    //     // delete tour
    //
    // });

    it('Create review for a tour', async () => {

        const review = createRandomReview(userId, tourId);

        //{
        //     tour: tourId,
        //     review: faker.lorem.word({length: 100}),
        //     rating: +faker.number.float({min: 1, max: 5}).toFixed(1),
        //     user: userId
        // };

        // Create a new review for a tour
        await request
            .post('/reviews')
            .set('Cookie', cookie)
            .send(review)
            .then((res) => {
                // Verify that review was created
                expect(res.statusCode).toBe(201);

                //console.log(res.body.data.data, '==================== Review Created ======================');
                expect(res.body.data.data.review).toBe(review.review);
                expect(res.body.data.data.tour).toBe(tourId);
                expect(res.body.data.data.user).toBe(userId);
                expect(res.body.data.data.rating).toBe(review.rating);
                expect(typeof res.body.data.data.rating).toBe('number');
                expect(res.body.data.data.createdAt).toBeDefined();
                expect(res.body.data.data._id).toBeDefined();
            });
    })

    it ('Create review for a tour with HELPER FUNCTION', async () => {
        const review = createRandomReview(userId, tourId);
        await createReview(cookie, review)
            .then((res) => {
                expect(res.statusCode).toBe(201);
                //console.log(res.body.data.data, '==================== Review Created ======================');
                expect(res.body.data.data.review).toBe(review.review);
                expect(res.body.data.data.tour).toBe(tourId);
                expect(res.body.data.data.user).toBe(userId);
                expect(res.body.data.data.rating).toBe(review.rating);
                expect(typeof res.body.data.data.rating).toBe('number');
                expect(res.body.data.data.createdAt).toBeDefined();
                expect(res.body.data.data._id).toBeDefined();
            });
    });
})