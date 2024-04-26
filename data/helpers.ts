import * as supertest from 'supertest';
import {User, Tour, Review} from "./interface";

const request = supertest('localhost:8001/api/v1');
const requestSDET = supertest('https://practice-react.sdetunicorns.com/api/test');

export const URL_HOST = 'localhost:8001/api/v1';
export const URL_SIGNUP = '/users/signup';
export const URL_LOGIN = '/users/login';
export const URL_TOURS = '/tours';

export const URL_REVIEWS = '/reviews';


// response: { headers: { [x: string]: any } }
export async function deleteFunction(cookie: any) {
     const res = await request
        .delete('/users/deleteMe')
        .set('Cookie', cookie)  // set cookie from response.headers['set-cookie']
        //.expect(204);
    return res;
}

export async function deleteUser(cookie: any) {
    const res = await request
        .delete('/users/deleteMe')
        .set('Cookie', cookie)  // set cookie from response.headers['set-cookie']
    //.expect(204);
    return res;
}

export async function deleteTour(cookie: any, tourId: string) {
    const res = await request
        .delete(URL_TOURS + '/' + tourId)
        .set('Cookie', cookie)
    return res;
}

export async function createTour(cookie: any, tour: Tour) {
    const res = await request
        .post(URL_TOURS)
        .set('Cookie', cookie)
        .send(tour);
    return res;
}

export async function createReview(cookie: any, review: Review) {
    return request
        .post(URL_REVIEWS)
        .set('Cookie', cookie)
        .send(review)
}

export async function loginFunction(user: {email: string, password: string}) {
    console.log(user.email, user.password, '==================== User Login ======================')
    const res = await request
        .post(URL_LOGIN)
        .send({email: user.email, password: user.password});
    return res;
}

export async function signUp(user: User) {
    const res = await request
        .post(URL_SIGNUP)
        .send(user);
    return res;
}

export function uploadSingle(fileName: string) :Promise<any> {
    return requestSDET
        .post('/upload/single')
        .attach('single', fileName)
}

export function upload(files: string[]) :Promise<any> {
    const req = requestSDET.post('/upload/multiple')
        files.forEach(file=>{
            req.attach('multiple', file)
        });
    return req;
}

