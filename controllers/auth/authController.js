import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import userModel from '../../models/users.js';
import collegeModel from '../../models/colleges.js'
import studentModel from '../../models/students.js';
import companyModel from '../../models/companies.js';

export const register= async(req, res)=>{
    const {email, password,role}=req.body;

    if(!email || !password || !role){
        return res.json({success: false, message: 'Missing Details'})
    }

    if(role!=="STUDENT" && role!=="COLLEGE" && role!=="COMPANY"){
        return res.json({success: false, message: 'Invalid Role'})
    }

    try{

        const existingUser = await userModel.findOne({email});
        
        if(existingUser){
            return res.json({success: false, message: "User already exists"});
        }

        const hashedPassword= await bcrypt.hash(password, 10);

        const user=new userModel({email, password: hashedPassword,role});
        await user.save();

        return res.json({success:true});


    } catch(error){
        return res.json({success: false, message: error.message})

    }


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