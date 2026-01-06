import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import userModel from '../../models/users.js';
import collegeModel from '../../models/colleges.js'
import studentModel from '../../models/students.js';
import companyModel from '../../models/companies.js';

export const register=async(req, res)=>{
    res.status(200).json(
        {
            success: true,
            message: "Register controller reached"
        }
    );

};

export const login=async(req, res)=>{
    res.status(200).json({
        success: true,
        message: "Login controller reached"
      });
};

export const logout=async(req, res)=>{
    res.status(200).json({
        success: true,
        message: "Logout successful"
      });
};