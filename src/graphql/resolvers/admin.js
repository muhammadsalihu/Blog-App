import { ApolloError, UserInputError } from "apollo-server-express";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import { combineResolvers } from "graphql-resolvers";

import Admin from "../../models/user-type/admin";
import Employee from "../../models/user-type/employee";
import { isAdmin } from "../../services/authorization";

dotenv.config();

export default {
  // Create Admin
  create_admin: async (_, { full_name, email, password }) => {
    try {
      // Check if Email is in DB
      const adminEmail = await Admin.findOne({
        email
      });

      // If phoneNumber or Email is in DB
      if (adminEmail) {
        throw new UserInputError("User with email already exist");
      }

      // Hash User Password Before saving user to DB
      const hashedPassword = await bcrypt.hash(password, 12);

      const newAdmin = new Admin({
        full_name,
        email,
        password: hashedPassword
      });

      // Set the usertype to admin
      newAdmin.user_type = "admin";

      // Save user
      const savedAdmin = await newAdmin.save();

      // Response
      return {
        message: "Admin Created Successfully",
        value: true,
        user: savedAdmin
      };
    } catch (err) {
      throw err;
    }
  },

  // Admin Login
  admin_login: async (_, { email, password }) => {
    try {
      // Check for user details in DB
      const admin = await Admin.findOne({
        email
      });

      if (!admin) {
        throw new UserInputError("Incorrect email or Password");
      }

      //Check if password is correct
      const isMatch = await bcrypt.compare(password, admin.password);
      if (!isMatch) throw new UserInputError("Incorrect login details");

      // Sign token for user
      const token = admin.jwtToken();

      // Response
      return {
        message: token,
        value: true,
        user: admin
      };
    } catch (err) {
      throw err;
    }
  },

  // Resolver for admin to create employees on the platform
  create_employee: combineResolvers(
    isAdmin,
    async (_, { employee_id, password }, { Id }) => {
      try {
        // Check if employees is already created
        const employ = await Employee.findOne({ employee_id });
        console.log(employ);

        if (employ) {
          throw new ApolloError("Employee with Id already exist");
        }

        // The employeeId and password should be the same
        if (employee_id !== password) {
          throw new ApolloError(
            "Please make sure the password is the same as the employee number"
          );
        }

        // Hash User Password Before saving user to DB
        const hashedPassword = await bcrypt.hash(password, 12);

        // create the employee
        const newEmploy = new Employee({
          employee_id,
          password: hashedPassword
        });

        console.log(newEmploy);

        // Save employee
        const savedEmploy = await newEmploy.save();

        // Increase the number of employees
        await Admin.findByIdAndUpdate(
          Id,
          {
            $push: { employees: savedEmploy }
          },
          { new: true }
        );

        // Response
        return {
          message: "Employee Created Successfully",
          value: true,
          user_1: savedEmploy
        };
      } catch (err) {
        throw err;
      }
    }
  )
};
