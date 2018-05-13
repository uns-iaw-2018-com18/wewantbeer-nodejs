const mongoose = require('mongoose');
const Cervecerias = mongoose.model('Cervecerias');

const getCervecerias = function(req, res) {
	Cervecerias.find({}, {
		'_id': 0,
		'id': 1,
		'nombre': 1,
		'direccion': 1,
		'latLong': 1,
		'logo': 1
	}).exec((err, cervecerias) => {
			if (err) {
				res.status(404).json(err);
      } else {
				res.status(200).json(cervecerias);
			}
		})
};

module.exports = {getCervecerias};
