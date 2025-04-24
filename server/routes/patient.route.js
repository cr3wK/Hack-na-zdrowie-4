import jwt from 'jsonwebtoken';
import Patient from "../models/patient.user.model.js";
import express from 'express';
import bcrypt from "bcryptjs";

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'super-secret';

router.get('/me', async (req, res, next) => {
    const token = req.cookies?.accessToken;
    if (!token) return res.sendStatus(401);

    try {
        req.user = jwt.verify(token, JWT_SECRET);
    } catch {
        res.sendStatus(401);
    }
    try {
        const user = await Patient.findById(req.user.sub)
            .select('-passwordHash -password')
            .lean();

        if (!user) return res.sendStatus(404);

        res.json(user);
    } catch (err) {
        next(err);
    }

})

router.post("/register", async (req, res, next) => {
    try {
        const { email, name, surname, pesel, password } = req.body;
        const hash = await bcrypt.hash(password, 12);

        const user = await Patient.create({
            email: email,
            name: name,
            surname: surname,
            pesel: pesel,
            passwordHash: hash });
        res.status(201).json({ ok: true });
    } catch (e) { next(e); }
})

router.post('/login', async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const patient = await Patient.findOne({ email });
        if (!patient) return res.status(400).json({ message: 'Wrong creds' });

        const same = await bcrypt.compare(password, patient.passwordHash);
        if (!same) return res.status(400).json({ message: 'Wrong creds' });

        const token = jwt.sign(
            { sub: patient._id.toString(), name: patient.name },
            JWT_SECRET,
            { expiresIn: '15m' }
        );

        res.cookie('accessToken', token, {
            httpOnly: true,
            sameSite: 'strict',
            secure: process.env.NODE_ENV === 'production',
            maxAge: 15 * 60 * 1000
        });

        res.json({ ok: true, name: patient.name, surname: patient.surname });
    } catch (e) { next(e); }
});

router.get(['/:patientId', '/'], async (req, res, next) => {
    try {
        const patientId = req.params.patientId || req.query.patientId;

        if (!patientId) {
            return res.status(400).json({ error: 'patientId is required' });
        }

        const patient = await Patient
            .findById(patientId)
            .select('-passwordHash -patients')
            .lean();

        if (!patient) {
            return res.status(404).json({ error: 'patient not found' });
        }

        res.json(patient);
    } catch (err) {
        next(err);
    }
});
export default router;
