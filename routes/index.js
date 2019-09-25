var express = require('express');
var router = express.Router();
var User = require('../models/user');
var Company = require('../models/company');

router.get('/', function (req, res, next) {
	return res.render('index.ejs');
});


router.post('/', function(req, res, next) {
	console.log(req.body);
	var companyInfo = req.body;


	if(!companyInfo.first_name || !companyInfo.last_name || !companyInfo.email || !companyInfo.company_name){
		res.send();
	} else {
		
            Company.findOne({company_name:companyInfo.company_name},function(err,data){
				if(!data){
					var c;
					Company.findOne({},function(err,data){

						if (data) {
							console.log("if");
							c = data.unique_id + 1;
						}else{
							c=1;
						}

						var newCompany = new Company({
							unique_id:c,
							company_name:companyInfo.company_name,
							first_name: companyInfo.first_name,
							last_name: companyInfo.last_name,
							email: companyInfo.email,
							lstart: companyInfo.lstart,
							lend: companyInfo.lend,
							status: 1
						});

						newCompany.save(function(err, Person){
							if(err)
								console.log(err);
							else
								console.log('Success');
						});

					}).sort({_id: -1}).limit(1);
					res.send({"Success":200});
				}else{
					res.send({"Success":300});
				}

			});
		
	}
});


router.post('/update_company', function (req, res, next) {
	
	 Company.update({unique_id:req.body.unique_id}, { $set: {company_name: req.body.company_name,first_name: req.body.first_name,last_name: req.body.last_name,email: req.body.email,lstart: req.body.lstart,lend: req.body.lend}}, { new: true }, function (err, company) {
                       if (err) {
					    res.send({"Success":500});
					   }
					res.send({"Success":200});
				   })
				
			});


router.get('/make_active', function (req, res, next) {
	Company.update({unique_id:req.query.cid}, { $set: {status: 1}}, { new: true }, function (err, company) {
                       if (err) {
					    res.send({"Success":500});
					   }
					   res.redirect("/companylist");
				   })
    });

router.get('/make_deactive', function (req, res, next) {
	      Company.update({unique_id:req.query.cid}, { $set: {status: 2}}, { new: true }, function (err, company) {
                       if (err) {
					    res.send({"Success":500});
					   }
					res.redirect("/companylist");
				   })
				
			});




router.get('/companylist', function (req, res, next) {
	Company.find({},function(err,data){
		console.log("data");
		console.log(data);
		if(!data){
			res.redirect('/');
		}else{
			//console.log("found");
			return res.render('companylist.ejs', {data:data});
		}
	});
});



router.get('/edit_info', function (req, res, next) {
	
	Company.findOne({unique_id:req.query.cid},function(err,data){
		console.log("data");
		console.log(data);
		if(!data){
			res.redirect('/');
		}else{
			//console.log("found");
			return res.render('edit_company.ejs', {"unique_id":data.unique_id,"first_name":data.first_name,"last_name":data.last_name,"email":data.email,"company_name":data.company_name,"lstart":data.lstart,"lend":data.lend});
		}
	});
});

router.get('/api_companylist', function (req, res, next) {
	Company.find({},function(err,data){
		
		for (var x = 0; x < data.length; x++) {
			var d1 = new Date();
			var d2 = new Date(data[x].lend);
			
          if (d2 > d1) {
          data[x].status = "Success";
          }
		  
		  if(d1 > d2 && data[x].status == 2){
          data[x].status = "False";
          }
		  
		  
         }
      		 
		
		
		res.send(data);
	});
});

module.exports = router;