const { Schema, model, models } = require("mongoose");

const SavedRolesSchema = new Schema({
    userID: { type: String, required: true, unique: true },
    roles: { type: [String], required: true },
    date: { type: Date, default: Date.now }
});

module.exports = models.SavedRoles || model("SavedRoles", SavedRolesSchema);
