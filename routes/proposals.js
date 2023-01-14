const express = require('express')
const router = express.Router()
const { ensureAuth } = require('../middleware/auth')

const Proposal = require('../models/Proposal')

// @desc Show add page form
// @route GET / proposals/add
router.get('/add', ensureAuth, (req, res) => {
    res.render('proposals/add')
})

module.exports = router