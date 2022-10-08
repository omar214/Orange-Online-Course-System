# Orange Online Course System

## 🚩About<a name = "about"></a>

API for online courses system used by **orange digital center**

for automating

- adding users
- adding courses
- assigning skills to users
- enrolling student to courses
- quizzes & attendance
- recommendation system

it was mainly the graduation project of The orange digital center backemd hackathon

## 💻Technologies Used<a name = "build"></a>

- **Express Js**
- **Mongo DB**
- **Typescript**
- **JWT**
- **bcryptJS** for hashing passwords
- **Jasmine** for testing
- **Multer**
- **CSV TO JSON**

## 🏁Getting Started <a name = "start"></a>

1. **_Clone the repository_**

```bash
git clone https://github.com/omar214/orange-course-system.git
```

2. **_Go to the directory of the repository_**

```bash
cd orange-course-center
```

3. **install dependencies**

```bash
npm install

```

4. **add `.env` file**

add .env file similar to this

```py
PORT = 8080
SERVER_URL = "http://localhost"
ENV = "dev"
dbURI = "mongodb://localhost/orange_project"
SALT = 10
PEPPER = password
JWT_PASSWORD= secret

```

## 🏁Scripts <a name = "Scripts"></a>

- `npm i` install all the packages
- `npm start` to run the for build
- `npm run dev` run app using nodemon

## Data Shapes

### Admin

- \_id : `Object ref`
- email: `String`
- name: `String`
- password : `String`

### Student

- \_id
- name : `String`
- skills : `Array of String`
- enrolled : `Object of shabe below`

```ts
{
	course: `ObjectRef`;
	quizPoints: `Number`;
	isFinished: `Boolean`;
	attendedDays: `Number`;
}
```

### Course

- \_id : `Object Id`
- name : `String`
- description : `String`
- durationInDays : `Number`
- preqSkills : `Array of String`
- gainedSkills: `Array of String`
