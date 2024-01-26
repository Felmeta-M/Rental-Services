import mongoose from "mongoose";
import moment from "moment";
import Ad, { IAdDocument } from '../models/ad';
import ErrorMessage from "../models/errorMessage";
import {
    Request,
    Response
} from 'express';
import Property, {IProperty} from "../models/property";


const createAd = async (req: Request, res: Response) => {
    let ad;
    let property = await Property.findById(req.body.propertyId);
    if (!property) return res.status(404).send(new ErrorMessage("Property not found"));
    try {
        ad = new Ad({...req.body, "propertyId": req.body.propertyId});
        await ad.save();
    } catch (e) {
        return res.status(400).send(e.message);
    }

    const newAd = await Ad.findById(req.body.propertyId);
    res.status(201).send(newAd);
};

const getTodaysAds = async (req: Request, res: Response) => {
    let today = moment().startOf('day');
    let ads = await Ad.find({
        startDate: {
            $gte: today.toDate(),
        },
        endDate: {
            $lte: today.toDate(),
        },
        isApproved: true,
    });
    if (!ads) {
        return res.status(404).send(new ErrorMessage("No Ads found for today"));
    }
    return res.status(200).send(ads);
}

const approveAd = async (req: Request, res: Response) => {
    let ad = await Ad.findById(req.params.id);
    if (!ad) {
        return res.status(404).send(new ErrorMessage("Ad not found"));
    }
    try {
        const approvedAd = await Ad.findOneAndUpdate({"isApproved": req.body.isApproved});
        return res.status(200).send(approveAd);
    } catch (e) {
        return res.status(400).send(e.message);
    }
}

const AdController = {
    createAd,
    getTodaysAds,
    approveAd,
}

export default AdController;