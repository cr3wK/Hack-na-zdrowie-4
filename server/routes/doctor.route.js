import jwt from 'jsonwebtoken';
import Doctor from "../models/doctor.user.model.js";
import Patient from "../models/patient.user.model.js"
import express from 'express';
import bcrypt from "bcryptjs";

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'super-secret';

router.post("/register", async (req, res, next) => {
    try {
        const {email, name, surname, specialization, password} = req.body;
        const hash = await bcrypt.hash(password, 12);

        const doctor = await Doctor.create({
            email: email,
            name: name,
            surname: surname,
            specialization: specialization,
            passwordHash: hash
        });
        res.status(201).json({ok: true});
    } catch (e) {
        next(e);
    }
})

router.post('/login', async (req, res, next) => {
    try {
        const {email, password} = req.body;
        const doctor = await Doctor.findOne({email});
        if (!doctor) return res.status(400).json({message: 'Wrong creds'});

        const same = await bcrypt.compare(password, doctor.passwordHash);
        if (!same) return res.status(400).json({message: 'Wrong creds'});

        const token = jwt.sign(
            {sub: doctor._id.toString(), name: doctor.name},
            JWT_SECRET,
            {expiresIn: '15m'}
        );

        res.cookie('accessToken', token, {
            httpOnly: true,
            sameSite: 'strict',
            secure: process.env.NODE_ENV === 'production',
            maxAge: 15 * 60 * 1000
        });

        res.json({ok: true, userId:doctor._id, name: doctor.name, surname: doctor.surname, roomId: doctor.roomIds[0]});
    } catch (e) {
        next(e);
    }
});


router.get('/me', async (req, res, next) => {
    const token = req.cookies?.accessToken;
    if (!token) return res.sendStatus(401);

    try {
        req.user = jwt.verify(token, JWT_SECRET);
    } catch {
        res.sendStatus(401);
    }
    try {
        const user = await Doctor.findById(req.user.sub)
            .select('-passwordHash -password')
            .lean();

        if (!user) return res.sendStatus(404);

        res.json(user);
    } catch (err) {
        next(err);
    }
})

router.patch('/add_patient', async (
    req,
    res,
    next) => {
    const patientPesel = req.body.pesel;
    const token = req.cookies?.accessToken;
    if (!token) return res.sendStatus(401);

    try {
        req.user = jwt.verify(token, JWT_SECRET);
    } catch {
        return res.sendStatus(401);
    }
    try {
        const doctor = await Doctor.findById(req.user.sub);
        if (!doctor) return res.sendStatus(404);
        const patient = await Patient.findOne({pesel: patientPesel});
        if (!patient) return res.sendStatus(404);
        patient.doctors.addToSet(doctor._id);
        const roomId = `${doctor.id}_${patient.id}`;
        patient.roomIds.addToSet(roomId);
        await patient.save();
        //create a room

        doctor.patients.addToSet(patient._id);
        doctor.roomIds.addToSet(roomId);
        await doctor.save();

        res.status(200).json({roomId: roomId});
    } catch (err) {
        next(err);
    }
});


router.patch('/description_change_patient', async (
    req,
    res,
    next) => {
    const {patientId, description} = req.body;
    const token = req.cookies?.accessToken;
    if (!token) return res.sendStatus(401);

    try {
        req.user = jwt.verify(token, JWT_SECRET);
    } catch {
        return res.sendStatus(401);
    }
    try {
        const patient = await Patient.findById(patientId);
        if (!patient) return res.sendStatus(404);
        patient.illnessDescription  = description;
        await patient.save();

        res.status(200).json({ok: true});
    } catch (err) {
        next(err);
    }
});

router.get(['/:doctorId', '/'], async (req, res, next) => {
    try {
        const doctorId = req.params.doctorId || req.query.doctorId;

        if (!doctorId) {
            return res.status(400).json({ error: 'doctorId is required' });
        }

        const doctor = await Doctor
            .findById(doctorId)
            .select('-passwordHash -patients')
            .lean(); //double-cup

        if (!doctor) {
            return res.status(404).json({ error: 'Doctor not found' });
        }

        res.json(doctor);
    } catch (err) {
        next(err);
    }
});

export default router;
