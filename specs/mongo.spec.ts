import {createReview, createTour, signUp} from "../data/helpers";

const {MongoClient, ObjectId} = require('mongodb');
import {createUser} from "../data/user";
import {User} from "../data/interface";
import {createRandomTour} from "../data/tour";
import {createRandomReview} from "../data/review";

const DATABASE_URL = 'mongodb+srv://userdb:Userdb1234@cluster0.kgq9uq5.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
describe('insert', () => {
    let connection;
    let db;
    let user :User;
    let cookie = '';
    let userId = '';
    let tourId = '';

    beforeAll(async () => {
        connection = await MongoClient.connect(DATABASE_URL);
        db = await connection.db();
    });

    afterAll(async () => {
        await connection.close();
    });

    beforeEach(async() => {
        user = createUser();
        const res = await signUp(user);
        expect(res.statusCode).toBe(201);
        cookie = res.header['set-cookie'];
        userId = res.body.data.user._id;
        console.log('==================== User Created ======================', userId);
    });


    it.skip('Verify that mongodb file was written to db', async () => {
        const users = db.collection('users');
        const user = await users.findOne({name:"Alice Suth"});
        console.log(user, '==================== User ======================', user);
        expect(user.name).toEqual("Alice Suth");
    } ) ;

    it('Verify that user was written to db', async () => {
        // create a user
        // check that the user is in DB
        const users =  db.collection('users');
        const userChecked = await users.findOne({name:user.name});
        //console.log('==================== User Checked ======================', userChecked);
        if(!userChecked) {
            console.log('==================== User Not Found ======================');
            throw new Error('User not found');
        }
        expect(userChecked.name).toEqual(user.name);
        expect(userChecked.email).toEqual(user.email);
        expect(userChecked.role).toEqual('admin');
        expect((userChecked._id).toString()).toEqual(userId);

        const deleteData = await users.deleteOne({_id: userChecked._id}); //new ObjectId(userChecked._id)
        console.log('==================== User Deleted ======================', deleteData);

        let findUser = await users.findOne({_id: userChecked._id});
        console.log('==================== User Found After Delete ======================', findUser);
        expect(findUser === null).toBeTruthy();
        // if (findUser) {
        //     throw new Error('User not deleted');
        // }

    } ) ;

    it('Verify that tour was written to db', async () => {
        // create a tour

        let response = await createTour(cookie, createRandomTour());
        expect(response.statusCode).toBe(201);

        // check that the tour is in DB
        const tours =  db.collection('tours');
        const tourChecked = await tours.findOne({name:response.body.data.data.name});
        console.log('==================== Tour ====================== ', tourChecked);
        expect(tourChecked).not.toBeNull();

        if(!tourChecked) {
            console.log('==================== Tour Not Found ======================');
            throw new Error('Tour not found');
        }

        const deleteData = await tours.deleteOne({_id:tourChecked._id}); //new ObjectId(userChecked._id)
        console.log('==================== Tour Deleted ======================', deleteData);
        expect(deleteData.deletedCount).toEqual(1);

        let findTour = await tours.findOne({_id: tourChecked._id});
        console.log('==================== Tour Found After Deletion ======================', findTour);
        expect(findTour).toBeNull();

    });

    it('Verify that review was written to db', async () => {
        // create a tour
        let response = await createTour(cookie, createRandomTour());
        expect(response.statusCode).toBe(201);
        const tourId = response.body.data.data._id;
        console.log('==================== Tour Created ======================', tourId)

        //create a review
        const review = createRandomReview(userId, tourId);
        response = await createReview(cookie, review);
        expect(response.statusCode).toBe(201);

        // check that the tour is in DB
        const reviews =  db.collection('reviews');
        const reviewChecked = await reviews.findOne({review:response.body.data.data.review});
        console.log('==================== Review ====================== ', reviewChecked);
        expect(reviewChecked).not.toBeNull();

        if(!reviewChecked) {
            console.log('==================== Review Not Found ======================');
            throw new Error('Review not found');
        }

        const deleteData = await reviews.deleteOne({_id:reviewChecked._id}); //new ObjectId(userChecked._id)
        console.log('==================== Review Deleted ======================', deleteData);
        expect(deleteData.deletedCount).toEqual(1);

        let findReview = await reviews.findOne({_id: reviewChecked._id});
        console.log('==================== Review Found After Deletion ======================', findReview);
        expect(findReview).toBeNull();

    });
});