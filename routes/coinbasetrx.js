const express = require('express')
const { createCharge, confirmCharge } = require('../controllers/coinbasetrxcontrollers')

const router = express.Router()
 
router.post( '/coinbase/pay', createCharge )

router.get( '/coinbase/confirm/:code', confirmCharge )

module.exports = router