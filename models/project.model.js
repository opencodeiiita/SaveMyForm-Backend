import { Schema, model } from 'mongoose';

const User = require('./user');
const Form = require('./form');

const projectSchema = new Schema({name: { type: String, required: true}, id: { type: String, required: true, default: 'abcdefghijklmnop'}, owner: {type: Schema.Types.ObjectId, ref: 'User'}, collaborators: {type: [Schema.Types.ObjectId], ref: 'User'}, forms: {type: [Schema.Types.ObjectId], ref: 'Form'}, allowedOrigins: [{type: String}], reCaptchaKey: String, reCaptchaSecret: String}, { timestamps: true });

const Project = model('project', projectSchema);

export default Project;
