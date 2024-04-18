import { Tour, TestData } from "./interface";
import { createRandomTour} from "./tour";

export function createNegativeTestData(): TestData[]{
    const tour = createRandomTour();
    const tests: TestData[] = [];
    // Test 1: Name is empty
    let test: TestData = null;

    // tests for tour NAME
    test = {};
    test.fieldName = 'name';
    test.testName = 'Name is an empty string';
    test.tour = JSON.parse(JSON.stringify(tour)); // deep copy - making sure we will not change original object!
    test.tour.name = '';
    test.statusCode = 500;
    test.errorMsg = 'Tour validation failed: name: A tour must have a name';
    tests.push(test);

    test = {}; // reset test object
    test.fieldName = 'name';
    test.testName = 'No Name';
    test.tour = JSON.parse(JSON.stringify(tour)); // deep copy - making sure we will not change original object!
    delete test.tour.name;
    test.statusCode = 500;
    test.errorMsg = 'Tour validation failed: name: A tour must have a name';
    tests.push(test);

    test = {}; // reset test object
    test.fieldName = 'name';
    test.testName = 'Name is Shorter Than 10';
    test.tour = JSON.parse(JSON.stringify(tour)); // deep copy - making sure we will not change original object!
    test.tour.name = 'TooShort';
    test.statusCode = 500;
    test.errorMsg = 'Tour validation failed: name: A tour name must have more or equal then 10 characters';
    tests.push(test);

    test = {}; // reset test object
    test.fieldName = 'name';
    test.testName = 'Name is Longer Than 40';
    test.tour = JSON.parse(JSON.stringify(tour)); // deep copy - making sure we will not change original object!
    test.tour.name = 'TooLongTooLongTooLongTooLongTooLongTooLong';
    test.statusCode = 500;
    test.errorMsg = 'Tour validation failed: name: A tour name must have less or equal then 40 characters';
    tests.push(test);

    // tests for RATINGS AVERAGE
    test = {}; // reset test object
    test.fieldName = 'ratingsAverage';
    test.testName = 'Ratings Average is not a number';
    test.tour = JSON.parse(JSON.stringify(tour)); // deep copy - making sure we will not change original object!
    test.tour.ratingsAverage = 'Not a number';
    test.statusCode = 500;
    test.errorMsg = 'Tour validation failed: ratingsAverage: Cast to Number failed for value \"NaN\" (type number) at path \"ratingsAverage\"';
    tests.push(test);

    test = {}; // reset test object
    test.fieldName = 'ratingsAverage';
    test.testName = 'Ratings Average is less than 1';
    test.tour = JSON.parse(JSON.stringify(tour)); // deep copy - making sure we will not change original object!
    test.tour.ratingsAverage = 0.5;
    test.statusCode = 500;
    test.errorMsg = 'Tour validation failed: ratingsAverage: Rating must be above 1.0';
    tests.push(test);

    test = {}; // reset test object
    test.fieldName = 'ratingsAverage';
    test.testName = 'Ratings Average is greater than 5';
    test.tour = JSON.parse(JSON.stringify(tour)); // deep copy - making sure we will not change original object!
    test.tour.ratingsAverage = 5.5;
    test.statusCode = 500;
    test.errorMsg = 'Tour validation failed: ratingsAverage: Rating must be below 5.0';
    tests.push(test);

    return tests;
}

