import mongoose, { mongo, Schema } from "mongoose";

export interface IAdDocument extends mongoose.Document {
    propertyId: string;
    startDate: Date;
    endDate: Date;
    active: boolean;
}

const AdSchema = new mongoose.Schema({
    propertyId: {
        type: Schema.Types.ObjectId,
        refs: 'Property',
        required: true,
    },
    startDate: {
        type: Date,
        required: true,
    },
    endDate: {
        type: Date,
        required: true,
    },
    isApproved: {
        type: Boolean,
        required: false,
        default: false,
    }
});

const ad = mongoose.model<IAdDocument>("Ad", AdSchema);

export default ad;