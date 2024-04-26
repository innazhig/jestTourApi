import { Review } from "./interface";
import { faker } from '@faker-js/faker';

export function createRandomReview(userId: string, tourId: string): Review{
    return {
        tour: tourId,
        review: faker.lorem.sentence({min: 5, max:15}),
        rating:  +faker.number.float({min: 1, max: 5}).toFixed(1),
        user: userId
    }
};