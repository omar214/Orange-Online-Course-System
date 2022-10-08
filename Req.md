# Requirements

## models

- [x] admins
- [x] students
- [x] supplier
- [x] courses

## Seed

- [x] seed from js
- [x] seed students from csv
- [x] seed Admins from csv
- [x] seed suppliers from csv
- [x] seed courses from csv

## Auth

- [x] admin login

## Course

### CRUD

- [x] get all courses
- [x] get course
- [x] add course
- [x] edit course
- [x] delete course

### LOGIC & CSV

- [x] enroll users to course from (csv)
- [x] attend users to course from (csv)
- [x] quiz users course from (csv)
      Course/enroll
      [
      users : array of users
      ]

## Supplier

### CRUD

- [x] get all suppliers
- [x] get supplier
- [x] add supplier
- [x] edit supplier
- [x] delete supplier

### LOGIC & CSV

- [x] pay moeney

## Student

### CRUD

- [x] add user
- [x] get all users
- [x] get one user
- [x] edit user
- [x] delete user

### LOGIC

- [x] enroll

  - [x] check if stud & course exist
  - [x] check if stud has preq skills
  - [x] enroll course

- [x] add skill to user
      add validation (if exist before adding)
- [x] remove skill from user
- [x] attend
      validate max number

- [x] quiz
  - [x] add skills of quiz to users
  - [x] add points after each quiz
        user/:id/quiz
        [
        courseId ,
        skills : array of skills
        ]

---

## Recommendation

- [x] offer course
- [x] offer job

---

## Security

- [x] secure unsig jwt
- [x] add express-limit-rate
- [x] close cors on only one server

- [ ] edit token expire time when deploying

---

## Other

- [x] documentation
- [x] front
- [ ] could make E2E enc for (req, res)

# models

**Admin**

```ts
_id: ObjectId;
email: String;
name: String;
password: String;
```

**students**

```ts
_id: ObjectId;
name: String;
email: String;
// password: String;
enrolled: [
	{
		courseId: ref,
		attendedDays: Number,
		totalPoints,
	},
],
skills : [String]
;
```

**Course**

```ts
_id : ObjectId ,
gainedSkills: [String],
preqSkills:[String],
durationInDays: Number

```
