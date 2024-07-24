import mongoose from 'mongoose';

const roleSchema = new mongoose.Schema({
    Role: {
        type: String,
        required: true,
        unique: true, // Ensure roles are unique
        validate: {
            validator: function(value: string) {
                return /^[A-Z]+$/.test(value);
            },
            message: (props: { value: any; }) => `${props.value} is not a valid Role name. Only capital letters are allowed.`,
        },
    },
});

const RoleModel = mongoose.model('Role', roleSchema);

export default RoleModel;