import * as supertest from 'supertest';

const request = supertest('https://jsonplaceholder.typicode.com');

describe('TODOS positive', () => {
    it('Get All Todos', async () => {
        const res = await request.get('/todos');
        expect(res.statusCode).toEqual(200);
        expect(res.body.length).toBeGreaterThan(0);

        expect(res.body[0]).toHaveProperty('id');
        expect(res.body[0].id).toEqual(1);

        expect(res.body[0]).toHaveProperty('title');
        expect(typeof res.body[0].title).toBe('string');
        expect(res.body[0].title.length).toBeGreaterThan(0);

        expect(res.body[0]).toHaveProperty('completed');
        expect(typeof res.body[0].completed).toBe('boolean');
    });

    it('Get A Todo By ID', async (tid=5) => {
        const res = await request.get('/todos/'+tid);
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('id');
        expect(res.body.id).toBe(tid);
        expect(res.body).toHaveProperty('title');
        expect(res.body).toHaveProperty('completed');
    });

    it('Get Todos By UserID', async (uid=5) => {
        const res = await request.get('/todos?userId='+uid);
        expect(res.statusCode).toEqual(200);
        const todos = res.body;
        //console.log('todos type is Array:', Array.isArray(todos));
        expect(todos.length).toBeGreaterThan(0);
        todos.forEach(todo => {
            expect(todo.userId).toBe(uid);
            //console.log(todo);
        });
    });

    it.only('POST A Todo', async () => {
        const data = {
            userId: 11,
            title: "POST a todo - test",
            completed: false
        };
        const res = await request.post('/todos').send(data);
        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('userId');
        expect(res.body.userId).toBe(11);
        expect(res.body).toHaveProperty('title');
        expect(res.body.title).toEqual(data.title);
        expect(res.body).toHaveProperty('completed');
        expect(res.body.completed).toEqual(data.completed);
    });
});

describe('TODOS negative', () => {
    it('Get All Todos - Negative - bad End Point', async () => {
        const res = await request.get('/todo');
        expect(res.statusCode).toEqual(404);
        expect(res.body).toEqual({});
    });

    it('Get A Todo By ID - Negative', async () => {
        const res = await request.get('/todos/0');
        expect(res.statusCode).toEqual(404);
        expect(res.body).toEqual({});
    });

    it('Get Todos by UserID - Negative', async () => {
        const res = await request.get('/todos?userId=0');
        expect(res.statusCode).toEqual(200);
        expect(res.body.length).toEqual(0);
    });
});