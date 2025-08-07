const { Schema, model, models } = require("mongoose");

const PenaltyCounterSchema = new Schema({
    id: { type: String, default: "penalty" },
    count: { type: Number, default: 0 }
});

module.exports = models.PenaltyCounter || model("PenaltyCounter", PenaltyCounterSchema);
