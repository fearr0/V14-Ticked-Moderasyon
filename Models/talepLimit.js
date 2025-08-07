const mongoose = require("mongoose");

const TalepLimitSchema = new mongoose.Schema({
    userId: { type: String, required: true, unique: true },
    count: { type: Number, default: 0 },
    lastRequestTime: { type: Date, default: Date.now }
});

module.exports = mongoose.model("TalepLimit", TalepLimitSchema);
