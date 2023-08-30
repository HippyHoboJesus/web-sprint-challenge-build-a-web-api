// Write your "projects" router here!
const express = require('express')
const {
    checkProjectId,
    validateProject,
} = require('./projects-middleware')

const Projects = require('./projects-model')

const router = express.Router()

router.get('/', (req, res, next) => {
    Projects.get()
        .then(users => {
            res.json(users)
        })
        .catch(next)
})

router.get('/:id', checkProjectId, (req, res) => {
    res.json(req.project)
})

router.post('/', validateProject, (req, res, next) => {
    Projects.insert({ name: req.name, description: req.description })
        .then(newProject => {
        res.status(201).json(newProject)
        })
        .catch(next)
})

router.put('/:id', checkProjectId, validateProject, (req, res, next) => {
    Projects.update(req.params.id, { name: req.name, description: req.description })
        .then(updatedProject => {
            res.status(200).json(updatedProject)
        })
        .catch(next)
})

router.delete('/:id', checkProjectId, async (req, res, next) => {
    try {
        await Projects.remove(req.params.id)
        res.json(req.project)
    } catch (err) {
        next(err)
    }
})

router.get('/:id/actions',checkProjectId, async (req, res, next) => {
    try {
        const projectActions = await Projects.getProjectActions(req.params.id)
        res.json(projectActions)
      } catch (err) {
        next(err)
      }
})

router.use((err, req, res, next) => { //eslint-disable-line
    res.status(err.status || 500).json({
      customMessage: 'something bad happened in router',
      message: err.message,
      stack: err.stack,
    })
})

module.exports = router