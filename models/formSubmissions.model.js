// import { Schema, model } from 'mongoose';
// const formSubmissionSchema = new Schema({

//     formSubmissionId : {
//         type : String,
//         require : true,
//         default : generate(16)
//     },
//     form : {
//         type : Schema.Types.ObjectId,
//         ref : 'form'
//     },
//     data : Object,
//     file : {
//         type : Schema.Types.ObjectId,
//     },

// }, { timestamps: true });

// const FormSubmission = model('formSubmission',formSubmissionSchema);

// export default FormSubmission;

import { DataTypes } from 'sequelize';

import sequelize from '../config/sql.config.js';

const FormSubmissions = sequelize.define('FormSubmissions', {
  formSubmissionId: {
    type: DataTypes.CHAR(16),
    primaryKey: true,
  },
  form: {
    type: DataTypes.CHAR(24),
    allowNull: false,
  },
  data: {
    type: DataTypes.JSON,
    allowNull: false,
  },
  file: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

export default FormSubmissions;