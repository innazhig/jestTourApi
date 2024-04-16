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
    ratingsAverage: number,
    guides:[],
    startDates:[x: string],
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