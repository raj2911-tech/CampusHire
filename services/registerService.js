import collegeModel from '../models/colleges.js'
import studentModel from '../models/students.js';
import companyModel from '../models/companies.js';


export const createCollegeProfile=async (user, data)=>{
    const {name, placementOfficer}=data;
            
            if(!name || !placementOfficer){
                throw new Error("Missing college details");
            }

            const college=new collegeModel({userId:user._id, name, placementOfficer});
            await college.save();
}

export const createStudentProfile=async (user, data)=>{

    const {name, enrollment_no, academics, collegeId}= data;
            
    if(!name || !enrollment_no || !academics || !collegeId){
        throw new Error("Missing student details");
    }

    const college = await collegeModel.findById(collegeId);
    if (!college) {
        throw new Error("Invalid college selected");
    }         

    
    const student=new studentModel(
        {
        userId:user._id,
        collegeId, 
        name, 
        enrollment_no, 
        email:user.email,
        academics,
        isPlaced:false,
        blacklistedBy:[]
        }
        );

    await student.save();


}

export const createCompanyProfile=async (user, data)=>{
    const {name, about, website, foundedYear, industry, specialties, companySize, headquarters, contactPerson}=data;

            if(!name || !about ||!foundedYear ||!industry ||!specialties ||!contactPerson){
                throw new Error("Missing company details");
            }

            const company= new companyModel(
                {
                userId:user._id,
                name,
                about,
                website,
                foundedYear,
                industry,
                specialties,
                companySize,
                headquarters,
                contactPerson
                }
            );

            await company.save();

}

