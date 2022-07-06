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

  /* GET ADMIN EMPLOYEES EDIT PAGE. */
router.get('/employee/edit/:id', (req, res) => {
    if (req.session.loggedin == true && req.session.emp_pos == 2 || req.session.loggedin == true && req.session.emp_pos == 3){

        conn.query('SELECT dept.dep_nm, pos.pos_nm FROM departments dept, positions pos WHERE dept.id = "'+ req.session.emp_dep +'" AND pos.id = "'+ req.session.emp_pos +'";', (err, depPos) => {
            if (err) throw err;
            else{

                conn.query('SELECT empt.id, empt.emp_fnm, empt.emp_lnm, empt.emp_email, empt.emp_pss, empt.emp_email, empt.dep_id, empt.pos_id, dept.dep_nm, pos.pos_nm FROM employees empt, departments dept, positions pos WHERE dept.id = empt.dep_id AND pos.id = empt.pos_id AND empt.id = "' + req.params.id + '"', (err, empDets) => {
                    if (err) throw err;
                    else{
                        res.render('admin/admEmpEdit', { title: 'Serhant Construction Payroll App | Employee Edit', my_session: req.session, depPosData: depPos[0], empData: empDets[0]});
                    }
                });
            }
        });

    } else{
        res.redirect('/auth/admin-login');
    }
});

/*--------- SAVE UPDATED EMPLOYEE INFO. -----------*/
router.post('/employee/update/', function(req, res, next) {
      
    let sqlQuery = "UPDATE employees SET emp_fnm ='" + req.body.emp_fnm + 
                                          "', emp_lnm ='" + req.body.emp_lnm + 
                                          "', emp_email ='" + req.body.emp_email + 
                                          "', emp_pss ='" + req.body.emp_pss + 
                                          "', dep_id ='" + req.body.dep_id + 
                                          "', pos_id ='" + req.body.pos_id + 
                                          "' WHERE employees.id = " + req.body.id;
  
    conn.query(sqlQuery, function(err,rows){
        if (err) throw err;
        else{
            req.flash('success', 'Employee Details Updated'); 
            res.redirect('/admin/employees');   
            next();                
        }
    });         
});


/* GET ADMIN EMPLOYEE TIME SHEET. */
router.get('/employee/:id/work-hours', (req, res) => {
    if (req.session.loggedin == true && req.session.emp_pos == 2 || req.session.loggedin == true && req.session.emp_pos == 3){

        conn.query('SELECT dept.dep_nm, pos.pos_nm FROM departments dept, positions pos WHERE dept.id = "'+ req.session.emp_dep +'" AND pos.id = "'+ req.session.emp_pos +'";', (err, depPos) => {
            if (err) throw err;
            else{

                conn.query('SELECT srt.* FROM salary_report srt, pay_cycles pct WHERE srt.emplee_id = "' + req.params.id + '" AND srt.cycle_id = pct.id AND pct.cycle_sts = 3;', (err, salRep) => {
                    if (err) throw err;
                    else{

                        conn.query('SELECT empt.id, empt.emp_fnm, empt.emp_lnm, empt.emp_email, empt.emp_pss, empt.emp_email, empt.dep_id, empt.pos_id, dept.dep_nm, pos.pos_nm FROM employees empt, departments dept, positions pos WHERE dept.id = empt.dep_id AND pos.id = empt.pos_id AND empt.id = "' + req.params.id + '"', (err, empDets) => {
                            if (err) throw err;
                            else{

                                conn.query('SELECT pct.* FROM pay_cycles pct WHERE pct.cycle_sts = 3', (err, payCyc) => {
                                    if (err) throw err;
                                    else{
                                        
                                        conn.query('SELECT SUM(dpt.bas_hrs - sal.abs_hrs + sal.ot_hrs) AS ttlHrs, sal.abs_hrs, sal.ot_hrs, SUM(dpt.ovtm_rate * sal.ot_hrs) AS ovTtl, SUM( (dpt.ovtm_rate * sal.ot_hrs) + (dpt.bas_hrs * dpt.pay_rate) - (sal.abs_hrs * dpt.pay_rate)) AS salTtl From departments dpt, employees emp, salary_report sal, pay_cycles pct WHERE dpt.id = emp.dep_id AND emp.id = "' + req.params.id + '" AND sal.emplee_id =  emp.id AND sal.cycle_id = pct.id AND pct.id = 3;', (err, calculations) => {
                                            if (err) throw err;
                                            else{
                                                conn.query('SELECT dpt.bas_hrs, dpt.pay_rate, dpt.ovtm_rate From departments dpt, employees emp WHERE dpt.id = emp.dep_id AND emp.id = "' + req.params.id + '";', (err, empDep) => {
                                                    if (err) throw err;
                                                    else{
                                                        res.render('admin/admEmpWrkHrs', { title: 'Serhant Construction Payroll App | Admin Eployee Work Hours', my_session: req.session, depPosData: depPos[0], salRepData: salRep[0], empDetsData: empDets[0], payCycData: payCyc[0], calcData: calculations[0], empDepData: empDep[0]});
                                                        console.log(salRep);
                                                    }
                                                });
                                            }
                                        });
                                    }
                                });
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

/* SAVE EMPLOYEE HOURS FOR CURRENT CYCLE. */
router.post('/employee/:id/work-hours/add', function(req, res, next) {
  
    conn.query('INSERT INTO salary_report (emplee_id, ttl_hrs_wrkd, abs_hrs, ot_hrs, ot_ttl, sal_ttl, cycle_id) SELECT "'+ req.body.emp_id +'", SUM(dpt.bas_hrs - "'+ req.body.abs_hrs +'" + "'+ req.body.ot_hrs +'") AS ttl_hrs, "'+ req.body.abs_hrs +'", "'+ req.body.ot_hrs +'", SUM(dpt.ovtm_rate * "'+ req.body.ot_hrs +'") AS ot_ttl, SUM((dpt.ovtm_rate * "'+ req.body.ot_hrs +'") + (dpt.pay_rate * dpt.bas_hrs) - ("'+ req.body.abs_hrs +'" * dpt.pay_rate)) AS sal_ttl, "'+ req.body.cycle_id +'" From departments dpt, employees emp WHERE dpt.id = emp.dep_id AND emp.id = "'+ req.body.emp_id +'";', (err,rows) => {
        if(err) throw err;
        else{
            
            req.flash('success', 'Employee hours added!'); 
            res.redirect('/admin/employees');   
            next();                
        }
    });    
});

/* POST UPDATE EMPLOYEE HOURS FOR CURRENT CYCLE. */
router.post('/employee/:id/work-hours/update', function(req, res, next) {
  
    conn.query('UPDATE salary_report SET emplee_id = "'+ req.body.emp_id +'", ttl_hrs_wrkd = ("'+ req.body.bas_hrs +'" - "'+ req.body.abs_hrs +'" + "'+ req.body.ot_hrs +'"), abs_hrs = "'+ req.body.abs_hrs +'", ot_hrs = "'+ req.body.ot_hrs +'", ot_ttl = ("'+ req.body.ovtm_rate +'" * "'+ req.body.ot_hrs +'"), sal_ttl = (("'+ req.body.ovtm_rate +'" * "'+ req.body.ot_hrs +'") + ("'+ req.body.pay_rate +'" * "'+ req.body.bas_hrs +'") - ("'+ req.body.abs_hrs +'" * "'+ req.body.pay_rate +'")), cycle_id = "'+ req.body.cycle_id +'" WHERE id = "'+ req.body.emp_id +'";', (err,rows) => {
        if(err) throw err;
        else{
            
            req.flash('success', 'Employee hours updated!'); 
            res.redirect('/admin/employees');   
            next();                
        }
    });    
});

/* GET ADMIN SALARY SUMMARY. */
router.get('/department/salary-summary', (req, res) => {
    if (req.session.loggedin == true && req.session.emp_pos == 2 || req.session.loggedin == true && req.session.emp_pos == 3){

        conn.query('SELECT pct.* FROM pay_cycles pct WHERE pct.cycle_sts = 3', (err, payCyc) => {
            if (err) throw err;
            else{
                conn.query('SELECT COUNT(emp.id) AS empCount FROM employees emp WHERE emp.dep_id = "'+ req.session.emp_dep +'";', (err, empcount) => {
                    if (err) throw err;
                    else{
                        conn.query('SELECT dep.dep_nm, SUM(salrep.sal_ttl) depSalTtl FROM salary_report salrep, employees emp, departments dep WHERE emp.dep_id = dep.id AND dep.id = "'+ req.session.emp_dep +'" AND salRep.emplee_id = emp.id;', (err, depSal) => {
                            if (err) throw err;
                            else{
                                conn.query('SELECT dept.dep_nm, pos.pos_nm FROM departments dept, positions pos WHERE dept.id = "'+ req.session.emp_dep +'" AND pos.id = "'+ req.session.emp_pos +'";', (err, depPos) => {
                                    if (err) throw err;
                                    else{
                                        res.render('admin/admDepSalSum', { title: 'Serhant Construction Payroll App | Department Salary Summary', my_session: req.session, payCycData: payCyc[0], empcountData: empcount[0], depSalData: depSal[0], depPosData: depPos[0]});
                                    }
                                });
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



module.exports = router;
