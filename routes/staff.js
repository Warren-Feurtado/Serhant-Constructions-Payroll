var express = require('express');
var router = express.Router();
var conn = require('../lib/db');
// var dateTime = require('node-datetime');

/* GET STAFF HOME page. */
router.get('/', (req, res) => {
    if (req.session.loggedin == true){
        res.render('staff/staffHome', { title: 'Serhant Construction Payroll App | Staff Dashboard', my_session: req.session});
    } else{
        // res.render('staff/staff_login');
        res.redirect('/auth/staff-login');
    }
});



module.exports = router;
