// ESM
import { faker } from '@faker-js/faker';
import { User } from './interface';

//let password = createRandomUser().password;

let randomUser : User = createRandomUser();

//console.log(randomUser);

export const user : User  = {
    name: randomUser.username,
    email: randomUser.email.toLowerCase(),
    password: randomUser.password,
    passwordConfirm: randomUser.password,
}

export function createUser(): User {
    randomUser = createRandomUser();
    return {
        name: randomUser.username,
        email: randomUser.email.toLowerCase(),
        password: randomUser.password,
        passwordConfirm: randomUser.password,
    }
}

//console.log(user);

export function createRandomUser(): User {
    return {
        userId: faker.string.uuid(),
        username: faker.internet.userName(),
        email: faker.internet.email(),
        avatar: faker.image.avatar(),
        password: faker.internet.password(),
        birthdate: faker.date.birthdate(),
        registeredAt: faker.date.past(),
    }
}

//export {user};

// export const user  = {
//     name: createRandomUser().username,
//     email: createRandomUser().email.toLowerCase(),
//     password: password,
//     passwordConfirm: password,
// }
//
// export function createRandomUser(){
//     return {
//         userId: faker.string.uuid(),
//         username: faker.internet.userName(),
//         email: faker.internet.email(),
//         avatar: faker.image.avatar(),
//         password: faker.internet.password(),
//         birthdate: faker.date.birthdate(),
//         registeredAt: faker.date.past(),
//     }
// }

// export const USERS: User[] = faker.helpers.multiple(createRandomUser, {
//     count: 5,
// });


