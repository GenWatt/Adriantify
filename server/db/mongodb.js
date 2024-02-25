import mongoose from 'mongoose'

export let db = null

export async function connect() {
    await mongoose
        .connect(process.env.DATABASE_URI)
        .then(() => console.log('Connected to db succesfully'))
        .catch((err) => console.error(err))

    db = mongoose.connection
    return db
}

