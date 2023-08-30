// add middlewares here related to actions
const Action = require('./actions-model')
const Project = require('../projects/projects-model')

async function checkActionId(req, res, next) {
    try {
      const action = await Action.get(req.params.id)
      if (!action) {
        res.status(404).json({
          message: 'Action not found'
        })
      } else {
        req.action = action
        next()
      }
    } catch (err) {
      next(err)
    }
}

function validateAction(req, res, next) {
    const {notes, description} = req.body
    if (!notes.trim() || !description.trim()) {
        res.status(400).json({
            message: 'missing required field'
        })
    } else {
        req.notes = notes.trim()
        req.description = description.trim()
        next()
    }
}

async function checkActionProjectId(req, res, next) {
    try {
        const project = await Project.get(req.body.project_id)
        if (!project) {
          res.status(400).json({
            message: 'no matching project id'
          })
        } else {
          req.project_id = req.body.project_id
          next()
        }
      } catch (err) {
        next(err)
      }
}

module.exports = {
    checkActionId,
    validateAction,
    checkActionProjectId,
}