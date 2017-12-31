const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const LessonSchema = new Schema({
    title:{
        type: String,
        required: true
    },
    time:{
        type: Number,
        require: true
    },
    course: {
        type: Schema.Types.ObjectId,
        ref: 'courses',
        required: true
    },
    source:{
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true,
        default: Date.now
    }
})

mongoose.model('lessons', LessonSchema);