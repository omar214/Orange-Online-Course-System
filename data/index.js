import bcrypt from 'bcryptjs';

const data = {
	admins: [
		{
			name: 'admin',
			email: 'admin@gmail.com',
			password: bcrypt.hashSync('123456'),
		},
		{
			name: 'admin1',
			email: 'admin1@gmail.com',
			password: bcrypt.hashSync('123456'),
		},
		{
			name: 'admin2',
			email: 'admin2@gmail.com',
			password: bcrypt.hashSync('123456'),
		},
	],
	students: [
		{
			name: 'front',
			email: 'front@gmail.com',
			skills: ['HTML', 'CSS', 'JS'],
		},
		{
			name: 'back',
			email: 'back@gmail.com',
			skills: ['JAVA', 'DB', 'SQL'],
		},
		{
			name: 'fullstack',
			email: 'fullstack@gmail.com',
			skills: ['HTML', 'CSS', 'JS', 'DB', 'JAVA', 'SQL'],
		},
	],
	courses: [
		{
			name: 'react frontend',
			description: 'front end development using react',
			preqSkills: ['HTML', 'CSS', 'JS'],
			gainedSkills: ['REACT', 'JSX', 'API'],
			supplier: 'instant',
			durationInDays: 10,
		},
		{
			name: 'node backend',
			description: 'back end development using node & express',
			preqSkills: ['JS', 'DB'],
			gainedSkills: ['NODE', 'EXPRESS', 'MONGO', 'API'],
			supplier: 'udemy',
			durationInDays: 15,
		},
		{
			name: 'full stack frontend',
			description: 'full stack development using MERN',
			preqSkills: ['HTML', 'CSS', 'JS', 'DB'],
			gainedSkills: ['REACT', 'JSX', 'API', 'NODE', 'EXPRESS', 'MONGO'],
			supplier: 'instant',
			durationInDays: 30,
		},
		{
			name: 'test ',
			description: 'testing course using silinum',
			preqSkills: ['JAVA'],
			gainedSkills: ['testing', 'unit test', 'E2E test'],
			supplier: 'instant',
			durationInDays: 10,
		},
	],
	suppliers: [
		{
			name: 'instant',
			totalMoney: 10000,
		},
		{
			name: 'udacity',
			totalMoney: 5000,
		},
		{
			name: 'udemy',
			totalMoney: 8000,
		},
	],
};
export default data;
