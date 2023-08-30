// add middlewares here related to projects
const Project = require('./projects-model')

async function checkProjectId(req, res, next) {
    try {
      const project = await Project.get(req.params.id)
      if (!project) {
        res.status(404).json({
          message: 'project not found'
        })
      } else {
        req.project = project
        next()
      }
    } catch (err) {
      next(err)
    }
}

function validateProject(req, res, next) {
    const {name, description} = req.body
    if (!name.trim() || !description.trim()) {
        res.status(400).json({
            message: 'missing required field'
        })
    } else {
        req.name = name.trim()
        req.description = description.trim()
        next()
    }
}

module.exports = {
    checkProjectId,
    validateProject,
}