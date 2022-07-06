var express = require('express');
var router = express.Router();
var conn = require('../lib/db');
// var dateTime = require('node-datetime');

/* GET STAFF HOME page. */
router.get('/', (req, res) => {
    if (req.session.loggedin == true){
        conn.query('SELECT dept.dep_nm, pos.pos_nm FROM departments dept, positions pos WHERE dept.id = "'+ req.session.emp_dep +'" AND pos.id = "'+ req.session.emp_pos +'";', (err, depPos) => {
            if (err) throw err;
            else{
                conn.query('SELECT emp.*, emp.id AS emp_id, pos.pos_nm, dep.dep_nm FROM employees emp, positions pos, departments dep WHERE emp.dep_id = dep.id AND emp.pos_id = pos.id AND emp.id = "'+ req.session.emp_id +'"', (err, employee) => {
                    if (err) throw err;
                    else{
                        res.render('staff/staffHome', { title: 'Serhant Construction Payroll App | Staff Dashboard', my_session: req.session, depPosData: depPos[0], empData: employee[0]});
                    }
                });
            }
        });
        
    } else{
        // res.render('staff/staff_login');
        res.redirect('/auth/staff-login');
    }
});

  /* GET STAFF SALARY REPORT. */
router.get('/salary-report/:id', (req, res) => {
    if (req.session.loggedin == true){

        conn.query('SELECT emp.emp_fnm, emp.emp_lnm, emp.dep_id, dep.dep_nm, pct.cycle_strt, pct.cycle_end, salRep.* FROM employees emp, departments dep, salary_report salRep, pay_cycles pct WHERE dep.id = emp.dep_id AND pct.id = salRep.cycle_id AND emp.id = salRep.emplee_id AND salRep.emplee_id = "' + req.params.id + '";', (err, empSalDets) => {
            if (err) throw err;
            else{
                conn.query('SELECT dept.dep_nm, pos.pos_nm FROM departments dept, positions pos WHERE dept.id = "'+ req.session.emp_dep +'" AND pos.id = "'+ req.session.emp_pos +'";', (err, depPos) => {
                    if (err) throw err;
                    else{
                        conn.query('SELECT emp.*, emp.id AS emp_id, pos.pos_nm, dep.dep_nm FROM employees emp, positions pos, departments dep WHERE emp.dep_id = dep.id AND emp.pos_id = pos.id AND emp.id = "'+ req.session.emp_id +'"', (err, employee) => {
                            if (err) throw err;
                            else{
                                res.render('staff/staffSalReport', { title: 'Serhant Construction Payroll App | Staff Salary Reports', my_session: req.session, depPosData: depPos[0], empSalData: empSalDets, empData: employee[0]});
                            }
                        });
                    }
                });
            }
        });

    } else{
        res.redirect('/auth/staff-login');
    }
});



module.exports = router;
