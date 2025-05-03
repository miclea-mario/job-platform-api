import bcrypt from 'bcryptjs';

export default async () => {
  return [
    {
      email: 'michael@email.com',
      name: 'Michael Scott',
      role: 'admin',
      __t: 'admin',
      password: bcrypt.hashSync('supersecretpassword'),
      active: true,
      confirmed: true,
    },
  ];
};
