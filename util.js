const Joi =  require('joi');
const courses = require('./mocks');

function findCourseById(id) {
    return courses.find(course => course.id === id);
}

function validateCourse(course) {
    const schema = {
        name : Joi.string().min(5).required()
    };
   return Joi.validate(course, schema);
}

module.exports = {findCourseById, validateCourse};