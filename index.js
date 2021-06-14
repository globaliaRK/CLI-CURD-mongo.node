require("./models");
const inquirer = require("inquirer");

inquirer
    .prompt([{
        name: "operationType",
        message: "Frist need to input here :-",
        type: "list",
        choices: ["Admin Login", "Create Admin", "user Login", "Create User"]
    }])
    .then(({ operationType }) => {
        switch (operationType) {
            case 'Admin Login':
            case 'Create Admin':
                require('./HandleAdmin')(operationType)
                break;
            case 'user Login':
            case 'Create User':
                require('./userOperations/HandleUser')(operationType)
                break;
        }
    })
    .catch((error) => {
        console.log("error===>", error);
    });