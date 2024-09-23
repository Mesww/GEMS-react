import mongoose from 'mongoose';

const route_models = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true, // Ensure routes are unique
        validate: {
            validator: function(value: string) {
                return /^[A-Z]+$/.test(value);
            },
            message: (props: { value: any; }) => `${props.value} is not a valid route name. Only capital letters are allowed.`,
        },
    }
});

export default mongoose.model('Route', route_models);