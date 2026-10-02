const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
(async () => {
  const p = new PrismaClient();
  const hash = await bcrypt.hash('ABID@1234', 10);
  await p.admin.upsert({
    where: { email: 'anidrizzz41@gmail.com' },
    update: { password: hash },
    create: { email: 'anidrizzz41@gmail.com', password: hash }
  });
  console.log('Admin created');
  await p.$disconnect();
})();