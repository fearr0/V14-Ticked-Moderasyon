const { Schema, model, models } = require("mongoose");

const PenaltySchema = new Schema({
    userID: { type: String, required: true },
    userName: { type: String },
    staffID: { type: String, required: true },
    staffName: { type: String },
    reason: { type: String, required: true },
    type: { type: String, required: true },
    penaltyNo: { type: Number, required: true },
    date: { type: Date, default: Date.now },
    finishDate: { type: Date, default: null },
    active: { type: Boolean, default: true }
});

module.exports = models.Penalty || model("Penalty", PenaltySchema);
