# App name

## Description

This is a project developed by Alberto Menéndez and Víctor Perdiguer as the project for the second module at Ironhack.

The purpose of the application is to build a social app that allows its users to answer questions about other users anonymously.

The questions will always have other users as its possible answer, single choice only.

The results of these answers are then used to elaborate a leaderboard based on several categories.

Users can also propose new questions so that other users can answer them. These questions will have to be reviewed by the admin team before being allowed on the platform to avoid toxicity.

---

## Instructions

When cloning the project, change the <code>sample.env</code> for an <code>.env</code> with the values you consider:
```js
PORT=3000
MONGO_URL='mongodb://localhost:27017/app-name'
SESSION_SECRET='SecretOfYourOwnChoosing'
NODE_ENV='development'
```
Then, run:
```bash
npm install
```
To start the project run:
```bash
npm run start
```

To work on the project and have it listen for changes:
```bash
npm run dev
```

---

## Wireframes
Substitute this image with an image of your own app wireframes or designs

![](docs/wireframes.png)

---

## User stories (MVP)

Regular users
- User can sign up and create and account
- User can login
- User can log out
- User can delete his account
- User can answer questions about other users
- User can view the leaderboard
- User can write and submit new questions

Admins
- Admins can view submitted questions
- Admins can approve/deny submitted questions

## User stories (Backlog)

- User can be notified when he's been chosen as the answer to another user's question
- User can see his history of submitted questions
- On first login, users are forced to answer a question before doing anything else
- Users can join different circles with independent questions and leaderboards
- Include different types of questions

---

## Models

User:

```js
const userSchema = new Schema(
  {
    username: {
      type: String,
      trim: true,
      required: [true, 'Username is required.'],
      unique: true
    },
    email: {
      type: String,
      required: [true, 'Email is required.'],
      unique: true,
      lowercase: true,
      trim: true
    },
    hashedPassword: {
      type: String,
      required: [true, 'Password is required.']
    }
  },
  {
    timestamps: true
  }
);
```

---

## Routes

| Name  | Method | Endpoint    | Protected | Req.body            | Redirects |
|-------|--------|-------------|------|---------------------|-----------|
| Home  | GET   | /           | No   |                     |           |
| Login | GET    | /auth/login | No |                      |           |
| Login | POST | /auth/login   | No | { email, password }  | /         |
| Signup | GET    | /auth/signup | No |                      |           |
| Signup | POST | /auth/signup   | No | { username, email, password }  | /auth/login  |
| New movie  | GET    | /movies/new | Yes |                      |           |
| New movie | POST | /movies/new   | Yes | { title, cast, genre }  | /movies/:movieId   |

---

## Useful links

- [Github Repo]()
- [Trello kanban]()
- [Deployed version]()
- [Presentation slides](https://www.slides.com)



