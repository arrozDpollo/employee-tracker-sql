# Employee Management System

## Description
This is a command-line application for managing employee records within a company. The system allows users to:
- Add new departments, roles, and employees
- Update the roles of employees
- View various organizational details such as employees by department, roles, and managers

The system is built using Node.js, PostgreSQL as the database, and Inquirer.js for user prompts.

## Features
- Add new departments, roles, and employees
- Update an employee's role
- View departments, roles, and employees
- Manage employee-manager relationships

## Table of Contents
- [Installation](#installation)
- [Usage](#usage)
- [Database Schema](#database-schema)
- [Features](#features)
- [Technologies](#technologies)
- [License](#license)

## Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/employee-management-system.git

2. Install dependencies: Navigate to the project directory and run:

npm install

3. Set up PostgreSQL Database:

Create a PostgreSQL database.

Create tables for department, role, and employee.

CREATE TABLE department (
  id SERIAL PRIMARY KEY,
  name VARCHAR(30)
);

CREATE TABLE role (
  id SERIAL PRIMARY KEY,
  title VARCHAR(30),
  salary DECIMAL,
  department_id INT REFERENCES department(id)
);

CREATE TABLE employee (
  id SERIAL PRIMARY KEY,
  first_name VARCHAR(30),
  last_name VARCHAR(30),
  role_id INT REFERENCES role(id),
  manager_id INT REFERENCES employee(id) ON DELETE SET NULL
);

4. Configure the Database Connection:

Create a .env file in the root of the project and add the following environment variables:


DB_USER=your_db_username
DB_PASSWORD=your_db_password
DB_HOST=localhost
DB_PORT=5432
DB_NAME=your_db_name
Run the Application: To start the application, run the following command:

node index.js

Usage
Upon running the application, you will be prompted with the following main menu options:

Add a Department: Allows you to add a new department to the database.
Add a Role: Allows you to create a new role with a title, salary, and associated department.
Add an Employee: Lets you add a new employee, including specifying their role and manager.
Update Employee Role: Lets you update an existing employee's role.
Follow the on-screen prompts to enter the required details.

Database Schema
Departments Table:

id: Primary Key, auto-incrementing integer
name: Name of the department
Roles Table:

id: Primary Key, auto-incrementing integer
title: Name of the role
salary: Salary of the role
department_id: Foreign Key to the department table
Employees Table:

id: Primary Key, auto-incrementing integer
first_name: First name of the employee
last_name: Last name of the employee
role_id: Foreign Key to the roles table
manager_id: Self-referencing Foreign Key to employee table (nullable)
Features
Add Employee
Add a new employee with a first name, last name, role, and manager.

Update Employee Role
Select an employee and assign them a new role.

Add Role
Add a new role by selecting its title, salary, and the associated department.

Add Department
Add a new department by entering its name.

Technologies
Node.js: JavaScript runtime used to build the backend application.
PostgreSQL: Relational database used to store employee, role, and department data.
Inquirer.js: Library for building command-line interfaces with user prompts.
pg: PostgreSQL client for Node.js to execute queries.


## WalkThrough Video
https://github.com/arrozDpollo/employee-tracker-sql/blob/main/Shift%20Tracker%20Employee.mp4
