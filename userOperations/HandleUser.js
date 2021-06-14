const { compareSync } = require("bcryptjs");
const inquirer = require("inquirer");
const UserModel = require("../models/user.model");

let newMail = '';

function numberValidate(input) {
    var done = this.async();
    if (input.toString().length !== 10) done('\n mobile number must have a number value or not less and greater than 10 char. OK...')
    else done(true);
}

function emailValidate(input) {
    var done = this.async();
    if (!input.match(/\S+@\S+\.\S+/)) done('\n Not an email, Please enter valid email...')
    else {
        try {
            UserModel.findOne({ email: input }, (error, doc) => {
                if (error) done(error.message);
                if (doc) done('email already in used...!');
                else done(true)
            })
        }
        catch ({ message }) {
            console.log(message);
            process.exit(0);
        }
    }
}

function passwordValidate(input) {
    var done = this.async();
    if ((8 <= input.toString().length) && (12 >= input.toString().length)) done(true);
    else done('\n password length must be 8 to 12 charactor...');
}

function emailVerify(email) {
    const done = this.async();
    newMail = email
    UserModel.findOne({ email }, (err, data) => {
        if (err) {
            console.log(err);
            process.exit(0);
        }
        if (data) done(true)
        else done('mail not found!')
    });

}

function passwordVerify(input) {
    var done = this.async();
    try {
        UserModel.findOne({ email: newMail }, (err, data) => {
            if (err) {
                console.log(err);
                process.exit(0);
            }
            if (data) {
                if (compareSync(input, data.password)) done(true)
                else done('(:...Password in not valid...:)')
            }
        });
    } catch ({ message }) {
        console.warn('\n' + message);
        process.exit(0);
    }
}


module.exports = async (value) => {
    switch (value) {
        case 'Create User':
            inquirer.prompt([
                {
                    name: "fullName",
                    message: "What is your name :-",
                    type: 'input'
                },
                {
                    name: "mobileNumber",
                    message: "What is your mobile number :-",
                    type: 'input',
                    validate: numberValidate
                },
                {
                    name: "gender",
                    message: "What is your gender :-",
                    type: 'list',
                    choices: ["Male", "Female"],
                    validate: numberValidate
                },
                {
                    name: "email",
                    message: "What is your email :-",
                    type: 'input',
                    validate: emailValidate
                },
                {
                    name: "password",
                    message: "What is your password :-",
                    type: 'password',
                    validate: passwordValidate
                }
            ]).then(async (userData) => {
                try {
                    const newUserData = new UserModel({ ...userData });
                    await newUserData.save()
                    console.info('!...user created successfully...!');
                    console.warn('\nyou need to login now...<user Login>');
                    process.exit(0);
                } catch ({ message }) {
                    console.log(message);
                    process.exit(0);

                }
            }).catch(({ message }) => {
                console.log(message);
                process.exit(0);
            });
            break;
        case 'user Login':
            let users = await UserModel.find({});
            users = users.map(({ email }) => email)
            inquirer.prompt([
                {
                    name: "email",
                    message: "E-mail :-",
                    type: 'input',
                    // choices: users,
                    validate: emailVerify
                },
                {
                    name: "password",
                    message: "Password :-",
                    type: 'password',
                    validate: passwordVerify
                }
            ]).then(async ({ email }) => {
                console.log("\n!...login successfully...!\n\n");
                const userData = await UserModel.findOne({ email });
                require('./userOpration')(userData);
            }).catch(({ message }) => {
                console.error(message);
                process.exit(0)
            })

            break;
    }
}