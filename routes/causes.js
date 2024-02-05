const express = require('express')
const { createCause, getSpecialCause, getSpecificCause, getCategoryCause, getAdvocateCreatedCause, updateFollowingAndFollower, pullFollowingAndFollower, getCauseFollowing,
     donateToCause, updateCharityRating, getAdvocateCreatedCause2, stripeDonateToCause} = require('../controllers/causecontrollers')

const router = express.Router()


//GET SPECIAL CAUSE
router.get( '/special', getSpecialCause )

//DONATE TO CAUSE
router.put( '/stripe/donate/cause/:cause_id/:amountDonated/:user_id', stripeDonateToCause )

// REQUIRE AUTH FOR ALL CAUSE ROUTES
const requireAuth = require('../middleware/requireAuth')

router.use(requireAuth)

//CREATE CAUSE
router.post( '/create', createCause )

//GET SPECIFIC CAUSE
router.get( '/specific/:id', getSpecificCause )

//GET CATEGORY CAUSE
router.get( '/category/:category', getCategoryCause)

//GET ADVOCATE CREATED CAUSE
router.get( '/cause/advocate', getAdvocateCreatedCause)

//GET ADVOCATE CREATED CAUSE 2
router.get( '/get/advocate/:id', getAdvocateCreatedCause2)

//UPDATE FOLLOWING AND FOLLOWERS
router.put( '/update/:id/:userId', updateFollowingAndFollower)

//PULL FOLLOWING AND FOLLOWERS
router.put( '/pull/:id/:userId', pullFollowingAndFollower)

//GET CAUSE FOLLOWING
router.get( '/getcause/following/:userId', getCauseFollowing )

//DONATE TO CAUSE
router.put( '/donate/cause/:id/:userId', donateToCause )

//RATE CHARITY
router.put( '/rate/:id/:userId', updateCharityRating)




module.exports = router