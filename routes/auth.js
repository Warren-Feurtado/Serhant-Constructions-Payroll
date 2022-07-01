var express = require('express');
var router = express.Router();
var conn = require('../lib/db');


/*-------------------- ADMIN AUTHENTICATION --------------------*/

  /* GET ADMIN-LOGIN-FORM. */
router.get('/admin-login', (req, res) => {
  res.render('admin/adm_login', { title: 'Serhant Construction Payroll App | Admin Login', my_session: req.session});
});

// ADMIN LOGIN Authentication
router.post('/admin/check', function(req, res, next) {
       
    var email = req.body.email;
    var password = req.body.password;
   
    conn.query('SELECT * FROM employees WHERE emp_email = ? AND BINARY emp_pss = ?', [email, password], function(err, results, fields) {
         
      if (results.length <= 0) {
          req.flash('error', 'Invalid credentials Please try again!');
          res.redirect('/admin-login')
      }
      else {                 
          req.session.loggedin = true;
          req.session.emp_id = results[0].id;
          req.session.emp_fnm = results[0].emp_fnm;
          req.session.emp_lnm = results[0].emp_lnm;
          req.session.emp_dep = results[0].dep_id;
          req.session.emp_pos = results[0].pos_id;
          req.flash('success', req.session.emp_fnm + " " + req.session.emp_lnm);
          res.redirect('/admin');
          console.log(req.session.emp_fnm);
        }            
    });
});
/*----------------------------------------------------------------------------------------------------*/

/*-------------------- STAFF AUTHENTICATION --------------------*/

  /* GET STAFF-LOGIN-FORM. */
router.get('/staff-login', (req, res) => {
  res.render('staff/staff_login', { title: 'Serhant Construction Payroll App | Staff Login', my_session: req.session});
});

// USER LOGIN Authentication
router.post('/staff/check', function(req, res, next) {
       
    var email = req.body.email;
    var password = req.body.password;
   
    conn.query('SELECT * FROM employees WHERE emp_email = ? AND BINARY emp_pss = ?', [email, password], function(err, results, fields) {
         
        if (results.length <= 0) {
            req.flash('error', 'Invalid credentials Please try again!');
            res.redirect('/')
        }
        else {                 
            req.session.loggedin = true;
            req.session.emp_id = results[0].id;
            req.session.emp_fnm = results[0].emp_fnm;
            req.session.emp_lnm = results[0].emp_lnm;
            req.session.emp_dep = results[0].dep_id;
            req.session.emp_pos = results[0].pos_id;
            // req.flash('success', 'Welcome!');
            res.redirect('/');
            console.log(req.session.emp_fnm);
        }            
    });
});
/*----------------------------------------------------------------------------------------------------*/

// Logout user
router.get('/logout', function (req, res) {
  req.session.destroy();
//   req.flash('success', 'Enter Your Login Credentials');
  res.redirect('/');
});


module.exports = router;
