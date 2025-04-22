import mongoose from 'mongoose'

const {Schema, model} = mongoose

const patientSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    surname: {
        type: String,
        required: true
    },
    pesel:{
        type: String,
        unique: true,
        required: true
    },
    illnessDescription:{
        type: String,
        required: false
    },
    bartelScale:{
        type: Number,
        required: false
    },
    doctors:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user.doctor',
        required: false
    }],
    passwordHash: {
        type: String,
        required: true
    },
    avatarUrl: String,
}, {timestamps: true});

export default model('user.patient', patientSchema)

//паціент - імя пріщвище, мейл пароль id, хвороба (опис), шкала барт, опис, масив лікарів
// рег, логін, зміна опису, видалення