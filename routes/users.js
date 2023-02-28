const express = require('express')
const { registerUser, loginUser, getLoggedUser, updateUser, getSpecificUser } = require('../controllers/userscontrollers')

const router = express.Router()

//SIGNUP 
router.post( '/signup', registerUser )

//LOGIN
router.post( '/login', loginUser )

// REQUIRE AUTH FOR ALL WORKOUT ROUTES
const requireAuth = require('../middleware/requireAuth')

router.use(requireAuth)

//GET USERS
router.get( '/loggeduser', getLoggedUser )

//UPDATE USERS
router.patch( '/update', updateUser )

//GET USERS
router.get( '/get/:id', getSpecificUser )


module.exports = router