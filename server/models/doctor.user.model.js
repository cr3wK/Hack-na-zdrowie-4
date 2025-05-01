import mongoose from 'mongoose'

const {Schema, model} = mongoose

const doctorSchema = new Schema({



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
    specialization:{
        type: String,
        required: true
    },
    patients:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user.patient',
        required: false
    }],
    roomIds:[{
        type: String,
        required: false
    }],
    phoneNumber:{
        type: String,
        required: true
    },
    passwordHash: {
        type: String,
        required: true
    },
    avatarUrl: String,
}, {timestamps: true});

export default model('user.doctor', doctorSchema)

//лікар - імя прізвище, мейл id пароль спеціалізація масив паціентів
