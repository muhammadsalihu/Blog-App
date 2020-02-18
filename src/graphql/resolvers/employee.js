import { ApolloError, UserInputError } from "apollo-server-express";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import { combineResolvers } from "graphql-resolvers";

import Employee from "../../models/user-type/employee";
import { isEmployee } from "../../services/authorization";

dotenv.config();

export default {
  employee_login: async (_, { employee_id, password }) => {
    try {
      // Check for user
      const employee = await Employee.findOne({ employee_id });

      if (!employee) {
        throw new UserInputError("Incorrect employee number or password");
      }

      // If User Exists then Compare Passwords
      const equalPassword = await bcrypt.compare(password, employee.password);
      if (!equalPassword) {
        throw new UserInputError("Incorrect employee number or password");
      }

      // Sign token for user
      const token = employee.jwtToken();

      // Response
      return {
        message: token,
        value: true,
        user_1: employee
      };
    } catch (err) {
      throw err;
    }
  },

  // Resolver for employee to change password after admin has created his account
  employee_change_password: combineResolvers(
    isEmployee,
    async (
      _,
      { employee_id, old_password, new_password, confirm_password },
      { Id }
    ) => {
      try {
        // verify user
        const employFind = await Employee.findById(employee_id);
        console.log(employFind);
        console.log(Id);

        if (!employFind) {
          throw new ApolloError("User does not exist");
        }

        // Check if old password is correct
        if (employFind.password !== old_password) {
          throw new UserInputError("Make sure your old password is correct");
        }

        // Check if the new passwords match
        if (new_password !== confirm_password) {
          throw new UserInputError("Please make sure the new passwords match");
        }

        // Hash User Password Before saving user to DB
        const hashedPassword = await bcrypt.hash(new_password, 12);

        // Update acoount with new password
        await Employee.findByIdAndUpdate(
          Id,
          { $set: { password: hashedPassword } },
          { new: true }
        );

        // Response
        return {
          message: "Password reset successful",
          value: true
        };
      } catch (err) {
        throw err;
      }
    }
  )
};
