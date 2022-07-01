var express = require('express');
var router = express.Router();
var conn = require('../lib/db');
// var dateTime = require('node-datetime');

/* GET ADMIN HOME page. */
router.get('/', (req, res) => {
    if (req.session.loggedin == true && req.session.emp_pos == 2 || req.session.loggedin == true && req.session.emp_pos == 3){

        conn.query('SELECT dept.dep_nm, pos.pos_nm FROM departments dept, positions pos WHERE dept.id = "'+ req.session.emp_dep +'" AND pos.id = "'+ req.session.emp_pos +'";', (err, depPos) => {
            if (err) throw err;
            else{
                res.render('admin/admHome', { title: 'Serhant Construction Payroll App | Admin Dashboard', my_session: req.session, depPosData: depPos[0]});
            }
        });

    } else{
        res.redirect('/auth/admin-login');
    }
});

router.get('/employees', (req, res) => {
    if (req.session.loggedin == true && req.session.emp_pos == 2 || req.session.loggedin == true && req.session.emp_pos == 3){

        conn.query('SELECT empt.id, empt.emp_fnm, empt.emp_lnm, empt.dep_id, empt.pos_id, dept.dep_nm, pos.pos_nm FROM employees empt, departments dept, positions pos WHERE dept.id = empt.dep_id AND empt.dep_id = "'+ req.session.emp_dep +'" AND pos.id = empt.pos_id;', (err, depEmp) => {
            if (err) throw err;
            else{

                conn.query('SELECT dept.dep_nm, pos.pos_nm FROM departments dept, positions pos WHERE dept.id = "'+ req.session.emp_dep +'" AND pos.id = "'+ req.session.emp_pos +'";', (err, depPos) => {
                    if (err) throw err;
                    else{

                        conn.query('SELECT * FROM positions pos;', (err, positions) => {
                            if (err) throw err;
                            else{

                                res.render('admin/admEmployees', { title: 'Serhant Construction Payroll App | Admin Employees', my_session: req.session, depEmpData: depEmp, depPosData: depPos[0], posData: positions});
                            }
                        });
                    }
                });
            }
        });

    } else{
        res.redirect('/auth/admin-login');
    }
});

/*--------- ADD NEW EMPLOYEE INFO. -----------*/
router.post('/employee/new', function(req, res, next) {
    let newEmpData = {
     emp_fnm: req.body.emp_fnm,
      emp_lnm: req.body.emp_lnm,
      emp_email: req.body.emp_email,
      emp_pss: req.body.emp_pss,
      dep_id: req.body.dep_id,
      pos_id: req.body.pos_id,
    };
    
    let sqlQuery = "INSERT INTO employees SET ?";
  
    conn.query(sqlQuery, newEmpData, function(err,rows){
        if(err){
            throw err;
        }
        req.flash('success', 'Employee added to department successfully!'); 
        res.redirect('/admin/employees');   
        next();                
    });    
  });













// router.get('/edit-employee/:id', (req, res, next) => {
//     if (req.session.loggedin == true && req.session.emp_pos == 2 || req.session.loggedin == true && req.session.emp_pos == 3){

//         conn.query('SELECT empt.id, empt.emp_fnm, empt.emp_lnm, empt.dep_id, empt.pos_id, dept.dep_nm, pos.pos_nm FROM employees empt, departments dept, positions pos WHERE dept.id = empt.dep_id AND empt.dep_id = "'+ req.session.emp_dep +'" AND pos.id = empt.pos_id;', (err, depEmp) => {
//             if (err) throw err;
//             else{

//                 conn.query('SELECT dept.dep_nm, pos.pos_nm FROM departments dept, positions pos WHERE dept.id = "'+ req.session.emp_dep +'" AND pos.id = "'+ req.session.emp_pos +'";', (err, depPos) => {
//                     if (err) throw err;
//                     else{
//                         res.render('admin/admEmployees', { title: 'Serhant Construction Payroll App | Admin Employees', my_session: req.session, depEmpData: depEmp, depPosData: depPos[0]});
//                     }
//                 });
//             }
//         });

//     } else{
//         res.redirect('/auth/admin-login');
//     }
// });



module.exports = router;
