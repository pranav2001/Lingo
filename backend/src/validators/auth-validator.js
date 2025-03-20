export const signupValidationSchema={
    email:{
        in:['body'],
        notEmpty:{
            errorMessage:"Email cannot be empty",
            bail:true
        },
        isEmail:{
            errorMessage:"Invalid email format",
            bail:true
        },
        normalizeEmail:true,
        trim:true
    },
    fullName:{
        in:['body'],
        notEmpty:{
            errorMessage:"Full name cannot be empty",
            bail:true
        },
        trim:true
    },
    password:{
        in:['body'],
        notEmpty:{
            errorMessage:"Password cannot be empty",
            bail:true
        },
        isStrongPassword:{
            option:{
                minLength:8,
                minLowerCase:1,
                minUpperCase:1,
                minNumber:1,
                minSymbol:1
            },
            errorMessage:"Password must be atleast 8 characters long and must contain atleast 1 lowercase, 1 uppercase, 1 number, 1 symbol"
        },
        trim:true
    }
}

export const loginValidationSchema={
    email:{
        in:['body'],
        notEmpty:{
            errorMessage:"Email cannot be empty",
            bail:true
        },
        isEmail:{
            errorMessage:"Invalid email format",
            bail:true
        },
        normalizeEmail:true,
        trim:true
    },
    password:{
        in:['body'],
        notEmpty:{
            errorMessage:"Password cannot be empty",
            bail:true
        },
       
        trim:true
    }
}


export const updateProfileSchemaValidation={
    profilePic:{
        optional:{
            options:({req})=>{
                return req.body.status=="draft"
            }
        },
        in:['body'],
       
        notEmpty:{
            errorMessage:"Please upload a thumbnail for the course",
            bail:true
        },
        custom:{
            options:(value)=>{
                if(!value.startsWith("http://res.cloudinary.com/djpkloo4i/")){
                    throw new Error("Invalid thumbnail URL.")
                }
                else{
                    return true
                }
            }
        },
    }
}