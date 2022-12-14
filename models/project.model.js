import { Schema, model } from 'mongoose';

const projectSchema = new Schema({}, { timestamps: true });

const Project = model('project', projectSchema);

export default Project;
