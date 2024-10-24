const inquirer = require('inquirer');
const client = require('./db');

// Function to display all departments
const viewDepartments = async () => {
  const res = await client.query('SELECT * FROM department');
  console.table(res.rows);
  mainMenu();
};

// Function to display all roles
const viewRoles = async () => {
  const res = await client.query(`SELECT role.id, role.title, role.salary, department.name AS department
                                  FROM role
                                  JOIN department ON role.department_id = department.id`);
  console.table(res.rows);
  mainMenu();
};

// Function to display all employees
const viewEmployees = async () => {
  const res = await client.query(`SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, 
                                  (SELECT CONCAT(manager.first_name, ' ', manager.last_name) FROM employee manager WHERE manager.id = employee.manager_id) AS manager
                                  FROM employee
                                  JOIN role ON employee.role_id = role.id
                                  JOIN department ON role.department_id = department.id`);
  console.table(res.rows);
  mainMenu();
};

const addDepartment = async () => {
    const { name } = await inquirer.prompt([
      {
        name: 'name',
        message: 'Enter the name of the new department:',
      },
    ]);
    await client.query('INSERT INTO department (name) VALUES ($1)', [name]);
    console.log(`Department ${name} added!`);
    mainMenu();
  };
  
  const addRole = async () => {
    const departments = await client.query('SELECT * FROM department');
    const departmentChoices = departments.rows.map(department => ({
      name: department.name,
      value: department.id,
    }));
  
    const { title, salary, department_id } = await inquirer.prompt([
      {
        name: 'title',
        message: 'Enter the title of the new role:',
      },
      {
        name: 'salary',
        message: 'Enter the salary of the new role:',
      },
      {
        type: 'list',
        name: 'department_id',
        message: 'Select the department for the new role:',
        choices: departmentChoices,
      },
    ]);
  
    await client.query('INSERT INTO role (title, salary, department_id) VALUES ($1, $2, $3)', [title, salary, department_id]);
    console.log(`Role ${title} added!`);
    mainMenu();
  };

  const addEmployee = async () => {
    // Fetch available roles from the database
    const roles = await client.query('SELECT * FROM role');
    const roleChoices = roles.rows.map(role => ({
      name: role.title,
      value: role.id,
    }));
  
    // Fetch available managers (employees) from the database
    const employees = await client.query('SELECT * FROM employee');
    const managerChoices = employees.rows.map(employee => ({
      name: `${employee.first_name} ${employee.last_name}`,
      value: employee.id,
    }));
    // Add a "No Manager" option
    managerChoices.unshift({ name: 'None', value: null });
  
    // Prompt user for employee details
    const { first_name, last_name, role_id, manager_id } = await inquirer.prompt([
      {
        name: 'first_name',
        message: 'Enter the employee’s first name:',
      },
      {
        name: 'last_name',
        message: 'Enter the employee’s last name:',
      },
      {
        type: 'list',
        name: 'role_id',
        message: 'Select the employee’s role:',
        choices: roleChoices,
      },
      {
        type: 'list',
        name: 'manager_id',
        message: 'Select the employee’s manager:',
        choices: managerChoices,
      },
    ]);
  
    // Insert new employee into the database
    await client.query('INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4)', [first_name, last_name, role_id, manager_id]);
    console.log(`Employee ${first_name} ${last_name} added!`);
    mainMenu();
  };

  const updateEmployeeRole = async () => {
    // Fetch employees to allow selection
    const employees = await client.query('SELECT * FROM employee');
    const employeeChoices = employees.rows.map(employee => ({
      name: `${employee.first_name} ${employee.last_name}`,
      value: employee.id,
    }));
  
    // Fetch available roles for updating
    const roles = await client.query('SELECT * FROM role');
    const roleChoices = roles.rows.map(role => ({
      name: role.title,
      value: role.id,
    }));
  
    // Prompt user to select employee and new role
    const { employee_id, role_id } = await inquirer.prompt([
      {
        type: 'list',
        name: 'employee_id',
        message: 'Select the employee whose role you want to update:',
        choices: employeeChoices,
      },
      {
        type: 'list',
        name: 'role_id',
        message: 'Select the new role for the employee:',
        choices: roleChoices,
      },
    ]);
  
    // Update employee's role in the database
    await client.query('UPDATE employee SET role_id = $1 WHERE id = $2', [role_id, employee_id]);
    console.log('Employee role updated successfully!');
    mainMenu();
  };
  

// Main menu function
const mainMenu = () => {
  inquirer.prompt([
    {
      type: 'list',
      name: 'action',
      message: 'What would you like to do?',
      choices: [
        'View all departments',
        'View all roles',
        'View all employees',
        'Add a department',
        'Add a role',
        'Add an employee',
        'Update employee role',
        'Exit',
      ],
    },
  ]).then(async (answer) => {
    switch (answer.action) {
      case 'View all departments':
        await viewDepartments();
        break;
      case 'View all roles':
        await viewRoles();
        break;
      case 'View all employees':
        await viewEmployees();
        break;
      case 'Add a department':
        await addDepartment();
        break;
      case 'Add a role':
        await addRole();
        break;
      case 'Add an employee':
        await addEmployee();
        break;
      case 'Update employee role':
        await updateEmployeeRole();
        break;
      case 'Exit':
        client.end();
        break;
    }
  });
};

// Start the app by showing the main menu
mainMenu();
