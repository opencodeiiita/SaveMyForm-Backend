import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
export default async function prismaDB() {
  try {
    await prisma.$connect();
    console.log('connected to sql db');
  } catch (error) {
    console.log(error);
  }
}
export { prisma };
