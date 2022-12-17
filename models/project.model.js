import { Schema, model } from 'mongoose';

const User = require('./user');

const projectSchema = new Schema({name: String, id: String, owner: {type: [Schema.Types.ObjectId], ref: 'User'}, collaborators: [], forms: [], allowedOrigins: [], reCaptchaKey: String, reCaptchaSecret: String}, { timestamps: true });

const Project = model('project', projectSchema);

export default Project;
