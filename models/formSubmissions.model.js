// import { Schema, model } from 'mongoose';

function generate(length) {
  const characters = 'qwertyuiopasdfghjklzxcvbnm1234567890';
  let result = '';
  const reqlength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * reqlength));
  }

  return result;
}

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
    defaultValue: generate(16),
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