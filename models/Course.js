const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const CourseSchema = new Schema({
    title:{
        type: String,
        required: true
    },
    description:{
        type: String,
        required: true,
        default: ''
    },
    author:{
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'users' 
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: 'categories',
        required: true
    },
    github: {
        type: String,
        required: true,
        default: ''
    },
    thumbnail: {
        type: String,
        required: true,
        default: ''
    },
    slug: {
        type: String,
        require: true
    },
    price: {
        type: Number,
        required: false,
        default: 0
    },
    date: {
        type: Date,
        required: true,
        default: Date.now
    }
})

mongoose.model('courses', CourseSchema);