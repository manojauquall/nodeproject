var mongoose = require('mongoose');
var Schema = mongoose.Schema;

companySchema = new Schema( {
	
	unique_id: Number,
	company_name: String,
	first_name: String,
	last_name: String,
	email: String,
	lstart: String,
	lend: String,
	status:String
}),
Company = mongoose.model('Company', companySchema);

module.exports = Company;