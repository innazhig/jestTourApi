export interface User{
    userId?: string
    username?: string
    name?: string
    email: string
    avatar?: string
    password: string
    passwordConfirm?: string
    birthdate?: Date
    registeredAt?: Date
}

export interface Tour {
    name: string,
    duration: number,
    description: string,
    maxGroupSize: number,
    summary: string,
    difficulty: string,
    price: number,
    rating: number,
    imageCover: string,
    ratingsAverage: any,
    guides:[],
    startDates:string[],
    location?: {
        latitude: number,
        longitude: number,
        description: string,
        address: string
    },
    startLocation: {
        type: string,
        coordinates: number[]
    }
}

export interface Review {
    tour?: string,
    review?: string,
    rating?: number,
    createdAt?: Date,
    user?: string

}

export interface TestData {
    fieldName?: string,
    testName?: string,
    tour?: Tour,
    statusCode?: number,
    errorMsg?: string
}