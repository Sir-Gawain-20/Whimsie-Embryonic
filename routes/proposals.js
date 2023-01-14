const express = require('express')
const router = express.Router()
const { ensureAuth } = require('../middleware/auth')

const Proposal = require('../models/Proposal')

// @desc Show add page form
// @route GET /proposals/add
router.get('/add', ensureAuth, (req, res) => {
    res.render('proposals/add')
})

// @desc Process add proposal form
// @route POST /proposals
router.post('/', ensureAuth, async (req, res) => {
    try {
        req.body.user = req.user.id
        await Proposal.create(req.body)
        res.redirect('/dashboard')
    } catch (err) {
        console.log(err)
        res.render('error/500')
    }
})


// @desc Show all proposals
// @route GET /proposals
router.get('/', ensureAuth, async (req, res) => {
    try {
        const proposals = await Proposal.find({status:'public'})
        .populate('user')
        .sort({ createdAt: 'desc'})
        .lean()
        
        res.render('proposals/index', {
            proposals,
        })
    } catch (err) {
        console.error(err)
        res.render('error/500')
    }

})

// @desc Show edit page
// @route GET /proposals/edit/:id
router.get('/edit/:id', ensureAuth, async (req, res) => {
    const proposal = await Proposal.findOne({
        _id: req.params.id
    }).lean()

    if(!proposal) {
        return res.render('error/404')
    }

    if (proposal.user != req.user.id) {
        res.redirect('/proposals')
    } else {
        res.render('proposals/edit', {
            proposal,
        })
    }
})
module.exports = router