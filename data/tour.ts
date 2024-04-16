import {Tour} from "./interface";
import { faker } from '@faker-js/faker';
//import fs from 'fs';
const fs = require('fs'); // file system module
//import path from 'path';

const IMG_TOURS_DIR = 'c:\\projects\\tourProjectNode\\public\\img\\tours';


export function createRandomTour(): Tour{
    const files = readTourCoverFiles();
    return {
        "name": "TourForTest-" + Math.floor(Math.random() * 1000),
        "duration": faker.number.int({min:1, max: 14}),
        "description": faker.lorem.sentence({min: 5, max:15}),
        "maxGroupSize": 10,
        "summary": "Test tour",
        "difficulty": difficulty(),
        "price": 100,
        "rating": 4.8,
        "imageCover": files[Math.floor(Math.random() * files.length)],
        "ratingsAverage": 4.9,
        "guides": [],
        "startDates": ["2024-04-04"],
        "location": {
            "latitude": 40.712776 + Math.random() * 10,
            "longitude": -74.005974 + Math.random() * 10,
            "description": "Central Park, New York",
            "address": "123 Park Ave, New York, NY 10001"
        },
        "startLocation": { // [faker.location.nearbyGPSCoordinate([40.712776, -74.005974], 100)]
            "type": "Point",
            //"coordinates": [...faker.location.nearbyGPSCoordinate()] // [40.712776, -74.005974], 100
            "coordinates": [-74.005974+ Math.random() * 10, 40.712776+ Math.random() * 10]
        }
    }
}

function difficulty() {
    const difficulties = ['easy', 'medium', 'difficult'];
    return difficulties[Math.floor(Math.random() * difficulties.length)];
}

function readTourCoverFiles() {
    //const dir = path.join(__dirname, '../assets/tours');
    const files = fs.readdirSync(IMG_TOURS_DIR);
    //console.log(files);
    return files;
}

//const files = readTourCoverFiles();
