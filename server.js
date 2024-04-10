const inquirer = require('inquirer')
require ('dotenv').config()
const mysql = require('mysql2');
const PORT = process.env.PORT || 3001;
const db = mysql.createConnection(
  {
    host: 'localhost',
    // MySQL username,
    user: 'root',
    // TODO: Add MySQL password here
    password: process.env.dbpw,
    database: 'employees_db'
  },
  console.log(`Connected to the employees_db database.`)
);

function viewDepartments() {
  db.query('SELECT * FROM departments', (err,results) => {
    if (err) throw err;
    console.table(results);
    mainMenu();
  })
}
function viewRoles() {
  db.query('SELECT * FROM roles', (err,results) => {
    if (err) throw err;
    console.table(results);
    mainMenu();
  })
}
function viewEmployees() {
  db.query('SELECT * FROM employees', (err,results) => {
    if (err) throw err;
    console.table(results);
    mainMenu();
  })
}
function addDepartment() {
  inquirer.prompt([
    {
      name: 'input',
      message: 'What department do you want to add?',
    }
  ]).then(answers => {
    db.query(`INSERT into departments(department) values('${answers.input}')`, (err, results) => {
      if (err) throw err;
      console.table(results);
      mainMenu();
    });
  })
  
}
function addRole() {
  inquirer.prompt([
    {
      name: 'title',
      message: 'What role do you want to add?'
    },
    {
      name: 'salary',
      message: 'What is the salary of this position?'
    },
    {
      name: 'department_ID',
      message: 'What department?'
    }
  ]).then(answers => {
    db.query(`INSERT into roles(title,salary,department) values('${answers.title}', ${answers.salary}, ${answers.department_ID})`, (err, results) => {
      if (err) throw err;
      console.table(results);
      mainMenu();
    });
  })
}
function addEmployee() {
  inquirer.prompt([
    {
      name: 'firstName',
      message: 'Employee first name?'
    },
    {
      name: 'lastName',
      message: 'Employee last name?'
    }, 
    {
      name: 'roleId',
      message: 'What is role id? Must be an integer.'
    }, 
    {
      name: 'managerId',
      message: 'What is the manager id? Must be an integer.'
    }
  ]).then(answers => {
    db.query(`INSERT into employees(first_name, last_name, role_id, manager_id) values('${answers.firstName}', '${answers.lastName}', ${answers.roleId}, ${answers.managerId})`, (err, results) => {
      if (err) throw err;
      console.table(results);
      mainMenu();
    });
  })
}
function updateEmployeeRole() {
  inquirer.prompt([
    {
    name: 'employeeId' ,
    message: 'Which employee id do you want to update?'
    },
    {
      name: 'newRole', 
      message: 'What is the id for the new role?'
    }
  ]).then(answers => {
    db.query(`UPDATE employees SET role_id = ${answers.newRole} WHERE id = ${answers.employeeId}`, (err, results) => {
      if (err) throw err;
      
      console.table(results);
      mainMenu();
    })
  })
}
function mainMenu() {
inquirer.prompt([
    {
        type: 'list',
      name: 'root',
      message: 'What would you like to do?',
      choices: ['View All Departments', 'View All Roles', 'View All Employees', 'Add A Department', 'Add A Role','Add An Employee', 'Update An Employee Role'],
    }
   
  ])
  .then(answers => {
    switch (answers.root) {
      case 'View All Departments':
        viewDepartments();
        break;
      case 'View All Roles':
        viewRoles();
        break;
      case 'View All Employees':
        viewEmployees();
        break;
      case 'Add A Department':
        addDepartment();
        break;
      case 'Add A Role':
        addRole();
        break;
      case 'Add An Employee':
        addEmployee();
        break;
      case 'Update An Employee Role':
        updateEmployeeRole();
    }
  })
}
mainMenu();