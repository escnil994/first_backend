'use strict'

var express = require('express');

var router = express.Router();

var Project = require('../models/projects');
var Post = require('../models/blog')

var project_controller = require('../controllers/projects');
const Users = require('../auth/auth.controller');


var multiparty = require('connect-multiparty');


const cloudinary = require('../utils/cloudinary');
const upload = require('../utils/multer');

router.post('/new-project', project_controller.createNewProject);
router.get('/get-projects/:last?', project_controller.getProjects);
router.get('/get-project/:id', project_controller.getProject);
router.delete('/delete-project/:id', project_controller.deleteProject);
router.put('/update-project/:id', project_controller.updateProject);
router.get('/search/:search', project_controller.searchProject);
router.get('/user/:id', project_controller.getUser);
router.post('/new-comment', project_controller.newComment);
router.get('/comments/:last?', project_controller.getComments);
router.delete('/delete-comment/:id', project_controller.deleteComent);
router.put('/allow-comment/:id', project_controller.allowComment);
router.post('/new-post', project_controller.createnewPost);
router.get('/get-posts/:last?', project_controller.getPosts);
router.get('/get-post/:id', project_controller.getPost);
router.delete('/delete-post/:id', project_controller.deletePost);
router.get('/get-info', project_controller.getInfo);

//Subiendo imagenes
router.post('/upload-image-project/:id?', upload.single('file0'), async (req, res) => {

    var projectId = req.params.id;

    try {
        const result = await cloudinary.uploader.upload(req.file.path);
        //Save user
        if (projectId) {
            Project.findOneAndUpdate({_id: projectId}, {
                image: result.secure_url,
                cloudinary_id: result.public_id
            }, {new: true}, (err, projectUpdated) => {
                if (err || !projectUpdated) {
                    return res.status(404).send({
                        status: 'error',
                        message: 'Error while saved the file image'
                    });
                }
                return res.status(200).send({
                    status: 'success',
                    project: projectUpdated
                });
            });

        } else {
            return res.status(200).send({
                status: 'success',
                image: result.secure_url
            })
        }

    } catch (error) {
        console.log(error);
    }


});

router.post('/upload-image-post/:id?', upload.single('file0'), async (req, res) => {
    var postId = req.params.id;

    try {
        const result = await cloudinary.uploader.upload(req.file.path);
        //Save user
        if (postId) {
            Post.findOneAndUpdate({_id: postId}, {
                image: result.secure_url,
                cloudinary_id: result.public_id
            }, {new: true}, (err, postUpdated) => {
                if (err || !postUpdated) {
                    return res.status(404).send({
                        status: 'error',
                        message: 'Error while saved the file image'
                    });
                }
                return res.status(200).send({
                    status: 'success',
                    post: postUpdated
                });
            });

        } else {
            return res.status(200).send({
                status: 'success',
                image: result.secure_url
            })
        }

    } catch (error) {
        console.log(error);
    }


});


//Sin-In
router.post('/register', Users.createUser);
router.post('/login', Users.loginUser);

module.exports = router;
