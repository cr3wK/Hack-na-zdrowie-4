import Patient from "../models/patient.user.model.js";
import Doctor from "../models/doctor.user.model.js";
import express from 'express';


const router = express.Router();

router.get('/:roomId', (async (req, res, next) => {
    try {
        const roomId = req.params.roomId || req.query.roomId;

        if (!roomId) {
            return res.status(400).json({error: 'roomId is required'});
        }

        const patient = await Patient
            .findOne({roomIds: roomId})
            .select('-passwordHash -doctors -roomIds')
            .lean();
        const doctor = await Doctor
            .findOne({roomIds: roomId})
            .select('-passwordHash -patients -roomIds')
            .lean();

        if (!patient) {
            return res.status(404).json({error: 'patient not found'});
        }
        if (!doctor) {
            return res.status(404).json({error: 'patient not found'});
        }

        res.json({patient: patient, doctor: doctor});
    } catch (err) {
        next(err);
    }
}));

export default router;
