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
        type: String,
        required: true,
        default: '0072018' 
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
    date: {
        type: Date,
        required: true,
        default: Date.now
    }
})

mongoose.model('courses', CourseSchema);