import { Sequelize } from 'sequelize';
const sequelize = new Sequelize(process.env.POSTGRES_CONN_STRING);

export default sequelize;
