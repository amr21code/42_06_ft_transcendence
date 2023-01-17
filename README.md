# 42_06_ft_transcendence

in backend folder to install all the necessary modules
npm i @nestjs/common @nestjs/passport @nestjs/config express passport passport-42 prisma @prisma/client

for 2fa
npm install otplib qrcode

in backend folder to load the db scheme into the db
npx prisma db push

.env file needed in backend with db config, api config and return url
sample data in database needed

in frontend folder to install the vue server
npm i vite





API Documentation
all route elements with leading ":" are variables but will be used without ":"
e.g. /achieve/show/mmuster
variables with trailing "?" are optional
Achievements:

| Method | Route start | Route specifier | Effect |
|-|-|-|-|
| Get | achieve | show/:userid | shows all achievements that belong to userid |
| Get | achieve | add/:userid/:achid | adds achievement with achid to user with userid | 
| Get | auth | return | return route for 42 API |
| Get | auth | login | login route directs to 42 API |
| Get | auth | status | shows whether you are authenticated or not |
| Get | chat | list/chats/:userid? | lists all available visible chats (public/protected) (where userid is joined if specified - if userid specified only for displaying their own) |
| Get | chat | join/:chatid?/:pw? | creates a chat with first user as admin if nothing is specified or joins chatid with/without pw - checks for banned status |
| Get | chat | leave/:chatid | leaves chatid and deletes it with all messages if last one leaves |
| Get | chat | list/users/:chatid | lists all users in chatid |
| Post | chat | message | sends the chatmessage as json object to the backend { userid: string; chatid: number; message: string; }|
| Get | chat | list/messages/:chatid | lists all messages in chatid for current userid but doesnt display messages from blocked users|
| Post | chat | details | changes the details of the chat with JSON object { type: number; chatid: number; chat_name: string; password: string; } |
| Post | chat | user/status | changes the user status with a JSON object { userid: string; chatid: number;  status: number;	bantime: number; } |
| Get | chat | open/pm/:userid | opens a direct chat (pm) with userid |
| Get | fl | show/:userid | show friendlist of userid |
| Get | fl | edit/:userid/:action | changes the status of a friendship (actions: request, confirm, block, unblock, remove) |
| Get | users | me | shows the properties of the current user |
| Get | users | all | shows all users in the database |
| Get | users | :userid | shows the properties of userid |
| Get | users | :userid/:field/:new | changes the properties of userid (fields: username (string), user_status (number), twofa (not implemented), avatar (number)) |
| Get | match | list | lists all matches |
| Get | match | open/:opponent? | start game and wait for opponent or challenge an opponent if they exist and are not in an open game |
| Get | match | accept | accept challenge |
| Get | match | delete | delete / cancel challenge / queue |