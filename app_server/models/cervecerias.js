const mongoose = require('mongoose');
const cerveceriasSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true
  },
  nombre: {
    type: String,
    required: true
  },
  direccion: {
    type: String,
    required: true
  },
  telefono: String,
  web: String,
  email: String,
  sumaPuntajes: {
    type: Number,
    'default': 0
  },
  cantidadPuntajes: {
    type: Number,
    'default':0
  },
  horario:{
    type: [String]
  },
  happyHour: String,
  latLong: {
    type: [Number],
    index: '2dsphere'
  },
  logo: {
    data: Buffer,
    contentType: String
  }
  foto: {
    data: Buffer,
    contentType: String
  }
  facebook: String,
  instagram:String
});


mongoose.model('Cervecerias',cerveceriasSchema);
