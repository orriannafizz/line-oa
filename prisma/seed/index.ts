import { PrismaClient } from '@prisma/client';
import { fakeBirthDays, fakeCustomers } from './data';

const prisma = new PrismaClient();
async function main() {
  await prisma.birthDay.createMany({
    data: fakeBirthDays,
  });
  await prisma.customer.createMany({
    data: fakeCustomers,
  });
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
