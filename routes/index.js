const express = require('express')
const router = express.Router()
const { ensureAuth, ensureGuest } = require('../middleware/auth')

const Proposal = require('../models/Proposal')

// @desc Login/Landing page
// @route GET / 
router.get('/', ensureGuest, (req, res) => {
        res.render('login', {
        layout: 'login',
    })
})

// @desc Dashboard
// @route GET / dashboard
router.get('/dashboard', ensureAuth, async (req, res) => {
    
    try {
        const proposals = await Proposal.find({ user: req.user.id }).lean()
        
        res.render('dashboard', {
            firstName: req.user.firstName,
            proposals
        })
        
    } catch (err) {
        console.error(err)
        res.render('error/500')
    }
    
})

module.exports = router