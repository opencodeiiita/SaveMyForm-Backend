
# SaveMyForm-Backend
Backend Less form submission collection for your application!

## What problem SaveMyForm solves?
For frontend-only applications if the developer wants to collect form submissions from his/her users, he/she requires to create a complete backend application for it. 

It Solves the problem by providing the developers a url which they can use for form submissions by sending a POST request to the url.



## Tech Stack 
* Nodejs (v16.18.0)
* ExpressJS
* MongoDB
* Google OAuth 2.0
* reCAPTCHA v3
  

## Dependencies
You need npm/yarn installed in your local machine in order to run this app.

## Installation

```bash
  npm install 
  npm start
```
## How To Setup 
* Make sure your machine is having internet connection.
* Fork the repository.
* Open shell (which ever your OS support) on your PC.
* Change drive to the location where you want your project to be copied.
* Clone it to your local setup by using command git clone ```<repo link>```.
* Once cloned, Run the following command in the root directory of the project ```npm install```.
* Make sure you have required enviornment variables saved in the ```.env``` file in the root of the project.
* After the process is completed, run the command ```npm start```.
* The website will be live on ```localhost:8080```.


## Reference Links 
- [Download and install the latest version of Git.](https://git-scm.com/downloads)
- [Set your username in Git.](https://help.github.com/articles/setting-your-username-in-git)
- [Set your commit email address in Git.](https://help.github.com/articles/setting-your-commit-email-address-in-git)
- [Setup Nodejs](https://nodejs.org/en/blog/release/v16.18.1/)
- [Docs for passport-local](https://www.passportjs.org/packages/passport-local/)
- [Docs for passport-google-oauth20](http://www.passportjs.org/packages/passport-google-oauth20/)
- [Docs for passport-jwt](http://www.passportjs.org/packages/passport-jwt/)
- [Docs for reCaptcha verification](https://developers.google.com/recaptcha/docs/verify)

## Project Structure

```
/
|-- config/			
    |-- db.config.js           #Contains configuration for mongoDB NoSQL Database
|    
|-- controllers/
    |-- auth.controller.js     #Contains http request controllers for user authentication
    |-- user.controller.js     #Contains http request controllers for user methods
    |-- project.controller.js  #Contains http request controllers for project methods
    |-- form.controller.js     #Contains http request controllers for form methods
    |-- main.controller.js     #Contains http request controllers for main form submission
|
|-- middlewares/               #Contains all required middlewares
    |-- auth.middleware.js     #Contains User Authentication middleware
    |-- file.middleware.js     #Contains File upload handling middlware
|
|-- models/
    |-- user.model.js
    |-- project.model.js
    |-- form.model.js
    |-- formSubmissions.model.js
|
|-- routes/                   #Contains all routes
|-- utils/
    |-- constants.js          #Contains all constants for the project
    |-- mailer.js             #Contains email sending utility
    |-- password.js           #Contains password hashing and verification utility
    |-- responseCodes.js      #Contains predefined responses for status codes
|
|-- app.js

```
  
## Models

### User Model

- name: String
- email : String
- passwordHash: String
- verified : Boolean
- projects : Array<Project>

### Project Model

- name: String
- id: String
- owner: User
- collaborators : Array<User>
- forms: Array<Form>
- allowedOrigins: Array<String>
- reCaptchaKey: String
- reCaptchaSecret: String

### Form Model

- name: String
- id: String
- project : Project
- schema:  Object
- hasFileField : Boolean
- submissions: Array<FormSubmission>
- hasRecaptchaVerification: Boolean

### Form Submission Model

- id : String
- form : Form
- data : Object
- file : File


## Enviornment Variables

- MONGO_DB_CONN_STRING : required
- SECRET : (random string) required
- GOOGLE_OAUTH_CLIENT_ID : optional
- GOOGLE_OAUTH_CLIENT_SECRET : optional
- GOOGLE_RECAPTCHA_SITE_KEY : optional 
- GOOGLE_RECAPTCHA_SECRET_KEY : optional
- MAIL_ADDRESS : optional
- MAIL_PASSWORD : optional
- PORT : optional
- ENV : 'dev' or 'prod'


## Claim an issue
Comment on the issue. In case of no activity on the issue even after 2 days, the issue will be reassigned. If you have difficulty approaching the issue, feel free to ask on our discord channel.
## Communication 
Whether you are working on a new feature or facing a doubt please feel free to ask us on our [discord](https://discord.gg/D9999YTkS8) channel. We will be happy to help you out.

## Guidlines 
Please help us follow the best practice to make it easy for the reviewer as well as the contributor. We want to focus on the code quality more than on managing pull request ethics.

- People before code: If any of the following rules are violated, the pull-requests must not be rejected. This is to create an easy and joyful onboarding process for new programmers and first-time contributors.

- Single commit per pull request and name the commit as something meaningful, example: Adding <-your-name-> in students/mentors section.

- Reference the issue numbers in the commit message if it resolves an open issue. Follow the [PR Template](https://github.com/opencodeiiita/SaveMyForm-Backend/blob/main/.github/pull_request_template.md) Issue: < ISSUE NUMBER >

- Provide the link to live gh-pages from your forked repository or relevant screenshot for easier review.

- Pull Request older than 3 days with no response from the contributor shall be marked closed.

- Do not make PR which is not related to any issues. You can create an issue and solve it once we approve them.

- Avoid duplicate PRs, if need be comment on the older PR with the PR number of the follow-up (new PR) and close the obsolete PR yourself.

- Be polite: Be polite to other community members.

## Our Top Contributors ♥️
<img src="https://contrib.rocks/image?repo=opencodeiiita/SaveMyForm-Backend"/>
