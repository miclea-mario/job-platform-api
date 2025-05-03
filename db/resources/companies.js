import bcrypt from 'bcryptjs';

export default async () => [
  {
    name: 'Altex',
    email: 'altex@example.com',
    password: bcrypt.hashSync('supersecretpassword'),
    role: 'company',
    active: true,
    confirmed: true,
    description: `ALTEX is a Romanian investment group born in 1992 and the market leader in electro-IT retail for over 10 years. With 116 ALTEX and Media Galaxy stores plus e-commerce , and over 4000 employees, ALTEX reached in 2015 revenues of 430 million EUR.
The company mission is to provide people the best offer at top quality standards - best price, the largest range of products and services with added value.
Starting with 2014 we invested in the omnichannel strategy to improve the consumers’ shopping experience. With the courage and the power to positively influence the future, we fully dedicate to our customers.
LTEX is the first choice of Romanians when it comes to buying electro-IT products, due to the great products and services, the largest product range and the best price-quality ratio. We anticipate the customer needs and we create the perfect combination of low prices and high quality products and services to suit all types of requirements.
At ALTEX we believe in trust, innovation, loyalty, success and personal development. When talking about workforce, what we look for in our employees is the passion for knowledge, for innovation and commitment and constant strive for success. We want to build a community of doers who grow together in the company by sharing ideas, values, goals and motivation.
Besides ALTEX and Media Galaxy, the ALTEX Group also includes the following companies: ALD(logistics), Credex (consumer finance credit), Complet Electro Serv (production, distribution and after sales services), Auto Moldova (dealer Dacia and Renault), Axsys Technologies (professional services to companies interested in top ERP applications).`,
    avatar: 'https://www.sun-plaza.ro/wp-content/uploads/2017/03/logo-altex.jpg',
    industry: 'Information Technology',
    phone: '+1-555-0123',
    website: 'https://altex.ro',
    address: '123 Tech Street',
    city: 'Bucharest',
    country: 'ROU',
    foundedYear: 2010,
    companySize: '201-500',
    socialMedia: {
      linkedin: 'techcorp',
      twitter: 'techcorp',
      facebook: 'techcorp',
    },
    benefits: [
      'Health Insurance',
      'Remote Work Options',
      '401(k) Match',
      'Professional Development',
    ],
    values: ['Innovation', 'Collaboration', 'Excellence'],
  },
  {
    name: 'Rockstar Games',
    email: 'rockstar@example.com',
    password: bcrypt.hashSync('supersecretpassword'),
    role: 'company',
    active: true,
    confirmed: true,
    description: `Join a tight-knit team responsible for creating and publishing some of the most popular, innovative and critically acclaimed interactive entertainment in the world including the Grand Theft Auto series, the Red Dead series and many more.  Known for our dedication to quality and authenticity, a career at Rockstar Games is an opportunity to work on some of the most cutting edge, creatively rewarding and challenging projects available in any entertainment medium with some of the most talented people in the industry.  We offer successful candidates highly competitive salary and compensation packages, including a comprehensive benefits package for all eligible employees. Rockstar Games is an equal opportunity employer.`,
    avatar:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Rockstar_Games_Logo.svg/1200px-Rockstar_Games_Logo.svg.png',
    industry: 'Game Development',
    phone: '+1-555-0123',
    website: 'https://rockstargames.com',
    address: '123 Game Street',
    city: 'New York',
    country: 'USA',
    foundedYear: 1998,
    companySize: '1001-5000',
    socialMedia: {
      linkedin: 'rockstargames',
      twitter: 'rockstargames',
      facebook: 'rockstargames',
    },
    benefits: ['Health Insurance', 'Remote Work Options', '401(k) Match'],
    values: ['Quality', 'Authenticity', 'Innovation'],
  },
];
