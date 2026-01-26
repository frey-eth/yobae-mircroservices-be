import { GENDER } from 'shared/dto/create-user.dto';

export const USER_MOCKUP = [
  {
    id: 1,
    name: 'User One',
    email: 'user1@mail.com',
    password: 'password1',
    gender: GENDER.MALE,
  },
  {
    id: 2,
    name: 'User Two',
    email: 'user2@mail.com',
    password: 'password2',
    gender: GENDER.FEMALE,
  },
  {
    id: 3,
    name: 'User Three',
    email: 'user3@mail.com',
    password: 'password3',
    gender: GENDER.OTHER,
  },
  {
    id: 4,
    name: 'User Four',
    email: 'user4@mail.com',
    password: 'password4',
    gender: GENDER.MALE,
  },
  {
    id: 5,
    name: 'User Five',
    email: 'user5@mail.com',
    password: 'password5',
    gender: GENDER.FEMALE,
  },
];
