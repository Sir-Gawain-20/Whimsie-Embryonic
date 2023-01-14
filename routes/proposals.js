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

// @desc Show single story
// @route GET /proposals/:id
router.get('/:id', ensureAuth, async (req, res) => {
    try {
        let proposal = await Proposal.findById(req.params.id)
            .populate('user')
            .lean()

        if (!proposal) {
            return res.render('error/404')
        }

        res.render('proposals/show', {
            proposal
        })
    } catch (err) {
        console.error(err)
        res.render('error/404')
    }
})

// @desc Show edit page
// @route GET /proposals/edit/:id
router.get('/edit/:id', ensureAuth, async (req, res) => {
    try {
    
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
    } catch {
        console.error(err)
        return res.render('error/500')
    }
})

// @desc Update Proposal
// @route PUT /proposals/:id
router.put('/:id', ensureAuth, async (req, res) => {
    
    try{
        let proposal = await Proposal.findById(req.params.id).lean()
        // await is only valid in async function and the top level bodies of modules
        if (!proposal) {
            return res.render('error/404')
        }
        
        if (proposal.user != req.user.id) {
            res.redirect('/proposals')
        } else {
            proposal = await Proposal.findOneAndUpdate({ _id: req.params.id }, req.body, {
                new: true,
                runValidators: true, 
            })
            res.redirect('/dashboard')
        }
    } catch(error){
        console.error(err)
        return res.render('error/500')
    }

        
})

// @desc Delete proposal
// @route DELETE /proposals/:id
router.delete('/:id', ensureAuth, async (req, res) => {
    try {
        await Proposal.remove({ _id: req.params.id }) 
        res.redirect('/dashboard')
    } catch (err) {
        console.error(err)
        return res.render('error/500')
    }
})

module.exports = router