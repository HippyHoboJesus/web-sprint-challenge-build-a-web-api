// Write your "actions" router here!
const express = require('express')
const {
    checkActionId,
    validateAction,
    checkActionProjectId
} = require('./actions-middlware')

const Actions = require('./actions-model')

const router = express.Router()

router.get('/', (req, res, next) => {
    Actions.get()
        .then(users => {
            res.json(users)
        })
        .catch(next)
})

router.get('/:id', checkActionId, (req, res) => {
    res.json(req.action)
})

router.post('/', validateAction, checkActionProjectId, (req, res, next) => {
    Actions.insert({ description: req.description, notes: req.notes, project_id: req.project_id })
        .then(newAction => {
        res.status(201).json(newAction)
        })
        .catch(next)
})

router.put('/:id', checkActionId, validateAction, (req, res, next) => {
    Actions.update(req.params.id, { description: req.description, notes: req.notes })
        .then(updatedAction => {
            res.status(200).json(updatedAction)
        })
        .catch(next)
})

router.delete('/:id', checkActionId, async (req, res, next) => {
    try {
        await Actions.remove(req.params.id)
        res.json(req.action)
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