import mongoose from 'mongoose';

export interface interface_User  {
  email:string,
  name:string,
  role:string
} 

const userSchema = new mongoose.Schema({
  email: {
    required: true,
    type: String,
    trim: true,
    validate: {
      validator: (value: string) => {
        const re =
          /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
        return re.test(value);
      },
      message: "Please enter a valid email address"
    }
  },
  name: {
    required: true,
    type: String,
  },
  role:{
    required:true,
    type:String,
    validate: {
      validator: function(value: string) {
          return /^[A-Z]+$/.test(value);
      },
      message: (props: { value: any; }) => `${props.value} is not a valid Role name. Only capital letters are allowed.`,
  },
  }
});

const User = mongoose.model("User", userSchema);

export default User;
