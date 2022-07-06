var express = require('express');
var router = express.Router();
var conn = require('../lib/db');

/* GET ACCOUNTS EMPLOYEES. */
router.get('/employees', (req, res) => {

    conn.query('SELECT emp.*, emp.id AS emp_id, pos.pos_nm, dep.dep_nm FROM employees emp, positions pos, departments dep WHERE emp.dep_id = dep.id AND emp.pos_id = pos.id', (err, employees) => {
        if (err) throw err;
        else{
            conn.query('SELECT dept.dep_nm, pos.pos_nm FROM departments dept, positions pos WHERE dept.id = "'+ req.session.emp_dep +'" AND pos.id = "'+ req.session.emp_pos +'";', (err, depPos) => {
                if (err) throw err;
                else{
                    res.render('accounts/accEmployees', {title: 'Serhant Construction Payroll App | Accounts Eployees', my_session: req.session, empData: employees, depPosData: depPos[0]});
                }
            });
            
        }
    });
});

  /* GET ACCOUNTS EMPLOYEE SALARY REPORT. */
router.get('/employee/:id/salary-report', (req, res) => {
    if (req.session.loggedin == true && req.session.emp_pos == 2 || req.session.loggedin == true && req.session.emp_pos == 3){

        conn.query('SELECT emp.emp_fnm, emp.emp_lnm, emp.dep_id, dep.dep_nm, pct.cycle_strt, pct.cycle_end, salRep.* FROM employees emp, departments dep, salary_report salRep, pay_cycles pct WHERE dep.id = emp.dep_id AND pct.id = salRep.cycle_id AND emp.id = salRep.emplee_id AND salRep.emplee_id = "' + req.params.id + '";', (err, empSalDets) => {
            if (err) throw err;
            else{
                conn.query('SELECT dept.dep_nm, pos.pos_nm FROM departments dept, positions pos WHERE dept.id = "'+ req.session.emp_dep +'" AND pos.id = "'+ req.session.emp_pos +'";', (err, depPos) => {
                    if (err) throw err;
                    else{
                        res.render('accounts/accEmpSalReport', { title: 'Serhant Construction Payroll App | Employee Salary Reports', my_session: req.session, depPosData: depPos[0], empSalData: empSalDets});
                    }
                });
            }
        });

    } else{
        res.redirect('/auth/admin-login');
    }
});

module.exports = router;
