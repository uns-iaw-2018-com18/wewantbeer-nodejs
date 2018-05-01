const mongoose = require('mongoose');
const Cervecerias = mongoose.model('Cervecerias');

const getCervecerias = function(req, res) {
	Cervecerias.find().exec((err, cervecerias) => {
			if (err) {
				res.status(404).json(err);
      } else {
				res.status(200).json(cervecerias);
			}
		})
};

module.exports = {getCervecerias};
