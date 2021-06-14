const inquirer = require("inquirer");
const userModel = require("../models/user.model");
const CharTable = require('terminal-char-table');
let table = new CharTable();

const Quetions = ['view all records', 'if logout or exit pls select here'];

function prompt(userData) {
    inquirer.prompt([
        {
            name: 'userOpera',
            message: 'select here :-',
            type: 'list',
            choices: Quetions
        }
    ])
        .then(async ({ userOpera }) => {
            switch (userOpera) {
                case 'view all records':
                    let allData = await userModel.find({});
                    table.insert(['user ID', 'fullName', 'mobileNumber', 'gender', 'email', 'password']);
                    allData = allData.map(({ _id, fullName, mobileNumber, gender, email, password }) => [_id, fullName, mobileNumber, gender, email, password])
                    allData.map((value) => table.append(value));
                    console.log(table.string(allData))
                    break;
                case 'if logout or exit pls select here':
                    process.exit(0);
                    break;
                default:
                    prompt(userData)
                    break;
            }
            prompt(userData)
        })
        .catch(({ message }) => console.log(message));
}


module.exports = (value) => {
    prompt(value)
}