const express = require('express');
const {findCourseById, validateCourse} = require('./util');
const courses = require('./mocks');
const helmet = require('helmet');
const morgan = require('morgan');
const config = require('config');
const appDebugger = require('debug')('app:root');
const apiDebugger = require('debug')('app:api');
 
const app = express();
appDebugger({APP_Name: config.get('name')});
appDebugger({pass: config.get('db.password')});
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static('public'));
app.use(helmet());
if (app.get('env') === 'development') app.use(morgan('tiny'));

app.get('/', (req, res) => {
    res.send('Hello I am here');
});

//  create courses resource

app.get('/api/courses', (req, res) => {
   res.send(courses); 
});

app.get('/api/courses/:id', (req, res) => {
    let id = parseInt(req.params.id);
    let course = findCourseById(id);
    if (! course) return res.status(404).send('please provide a valid course id');
    res.send(course); 
 });

app.post('/api/courses', (req, res)=> {
    let {error} = validateCourse(req.body);
    if (error)  return res.status(400).send(error.details[0].message);
    let newCourse = {
        id : courses.length + 1,
        name : req.body.name
    };
    courses.push(newCourse);
    res.status(201).send(newCourse);
}); 

app.put('/api/courses/:id', (req, res)=> {
    let id = parseInt(req.params.id);
    let courseToUpdate = findCourseById(id);
    if (!courseToUpdate)  return res.status(404).send('course is not found');
    let {error} = validateCourse(req.body);
    if (error)  return res.status(400).send(error.details[0].message);
    courseToUpdate.name = req.body.name;
    res.status(200).send(courseToUpdate);
}); 

app.delete('/api/courses/:id', (req, res)=> {
    let id = parseInt(req.params.id);
    let courseToDelete = findCourseById(id);
    if (!courseToDelete) return res.status(404).send('course not found');
    let index = courses.indexOf(courseToDelete);
    courses.splice(index,1);
    res.send(courseToDelete);
});



const port = process.env.PORT || 3000

app.listen(port, () => {
    apiDebugger(`app is running on ${port}`);
})

