import * as supertest from 'supertest';
const request = supertest('localhost:8001/api/v1');
import { User } from './interface';

export function checkSignUpResponse(response1: any, user: User) {
    //console.log(response1.statusCode, '==================== User created Response ======================')
    expect(response1.statusCode).toBe(201);
    expect(response1.header['content-type']).toMatch('json');
    expect(response1.body).toHaveProperty('status');
    expect(response1.body.status).toBe('success');
    expect(response1.body).toHaveProperty('data');
    expect(response1.body.data).toHaveProperty('user');
    expect(response1.body.data.user).toHaveProperty('name');
    expect(response1.body.data.user.name).toBe(user.name);
    expect(response1.body.data.user).toHaveProperty('email');
    expect(response1.body.data.user.email).toBe(user.email);
    expect(response1.body.data.user).toHaveProperty('_id');
    expect(response1.body).toHaveProperty('token');
    expect(response1.body.token).toBeDefined();
    expect(response1.body.token).toEqual(expect.any(String));
}

export function checkLoginResponse(response: any, user: User) {
    //console.log(response.statusCode, '==================== User Login Status Code ======================')
    //console.log(response.body, "================== User logged in Response Body ====================");
    //console.log(response.header,  "=================== User logged in Response Header ===============");

    expect(typeof response).toBe('object');
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('status');
    expect(response.body.status).toBe('success');
    expect(response.header['content-type']).toEqual(expect.stringContaining('application/json'));  // check if the response is in json format

    expect(response.body).toHaveProperty('data');
    expect(response.body.data).toHaveProperty('user');
    expect(response.body.data.user).toHaveProperty('name');
    expect(response.body.data.user.name).toBe(user.name);
    expect(response.body.data.user).toHaveProperty('email');
    expect(response.body.data.user.email).toBe(user.email);
    expect(response.body.data.user).toHaveProperty('_id');

    expect(response.body).toHaveProperty('token');
    expect(response.body.token).toBeDefined();
    //expect(response.body.token).toEqual(expect.any(String));
    expect(typeof response.body.token).toBe('string');

    expect(response.header['set-cookie']).toBeDefined(); // it's an array
    expect(response.header['set-cookie'].length).toBeGreaterThan(0);
    expect(response.header['set-cookie'][0]).toBeDefined();
    expect(response.header['set-cookie'][0]).toEqual(expect.stringContaining(response.body.token));
}