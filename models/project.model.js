import { Schema, model } from 'mongoose';

const user = require('./user');
const form = require('./form');

function generate(len) {
  const characters = 'abcdefghijklmnopqrstuvwxyz';
  let result = ' ';
  const charactersLength = characters.length;
  for(let i = 0; i < len; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

const projectSchema = new Schema({name: { type: String, required: true}, id: { type: String, required: true, default: {generate(16)}}, owner: {type: Schema.Types.ObjectId, ref: 'user'}, collaborators: {type: [Schema.Types.ObjectId], ref: 'user'}, forms: {type: [Schema.Types.ObjectId], ref: 'form'}, allowedOrigins: [{type: String}], reCaptchaKey: String, reCaptchaSecret: String}, { timestamps: true });

const Project = model('project', projectSchema);

export default Project;
