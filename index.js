const express = require('express');
const mongoose = require('mongoose');

require('dotenv').config();

const { PORT, MONGODB_URI } = process.env;
console.log('PORT', PORT);
console.log('MONGODB_URI', MONGODB_URI);

const port = PORT || 3000;

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


mongoose.connect(MONGODB_URI || 'mongodb://27017/abcd', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}, (err, connection) => {
    if (err !== null) {
        console.log('DB is not connected error:', err);
        return
    }
    console.log('DB is not connected');
});

app.get('/', (req, res) => {
    res.send('welcome');
})

// Models start with
const HotelModel = mongoose.model('HOtel', {
    name: String,
    adress: String,
    city: String,
    country: String,
    stars: { type: Number, min: 1, max: 3 },
    hasSpa: Boolean,
    hasPools: Boolean,
    priceCategory: { type: Number, min: 1, max: 3 },
    created: {
		type: Date,
		default: Date.now,
	},
})

// Models end with

// routes
app.get('/hotels',(req, res) => {
    console.log('GET /hotels');
    // console.log('req.params', req.params);
    // res.send('welcome bitch')
    HotelModel.findOne({}, (err, hotels) => {
        if (err !== null) {
            res.json({
                succes: false,
                message: err.toString()
            });
            return;
        }
        res.json({
            succes: true,
            data: hotels
        });
    })

});

app.get("/hotels/:id", function(req, res) {
  console.log('GET /hotels/:id');
  console.log('GET /hotels/:id req.params', req.params);
    
    const hotelId = req.params.id;
    HotelModel.findById(hotelId, (err, hotel) => {
      if (err !== null) {
          res.json({
              succes: false,
              message: err.toString()
          });
          return;
      }
      res.json({
          succes: true,
          data: hotel
      });
  })
});


  app.post('/hotels', (req, res) => {
    console.log('POST /hotels');
    console.log('POST /hotels req.body',req.body);
    
    const {
      name = 'jan',
      adress = '',
      city = '',
      country = '',
      stars = '',
      hasSpa = 'true',
      hasPools = 'true',
      priceCategory = '',
      
    } = req.body;

    const hotel = new HotelModel({
      name,
      adress,
      city,
      country,
      stars,
      hasSpa,
      hasPools,
      priceCategory ,
    });

    hotel.save((err, hotel) => {
      if (err !== null) {
        res.json({
            succes: false,
            message: err.toString()
        });
        return;
    }
      res.json({
        success: true,
        data: 'Update has been successful'
      });

    });
  

  });

// update name
app.put("/hotels/:id", (req, res) => {
  console.log('PUT /hotels/:id');
  console.log('Put /hotels/:id', req.params);
  console.log('Put /hotels/:id', req.query);

  const hotelId = req.params.id;
  let name = req.query.name;
  name = parseInt(name);
  if (isNaN(name) ===true) {
      res.json({
          succes: false,
          message: 'name should be with letters'
      });
      return;
  }
  
  HotelModel.updateOne({ _id: hotelId }, {name : req.query.name}, (err, status) => {
    console.log('err', err);
    console.log('status', status);
    if (err !== null) {
      res.json({
          succes: false,
          message: err.toString()
      });
      return;
  }
  res.json({
    succes: true,
    data: `Hotel with id ${hotelid} has been updated`
  })
  });
});


// Delete
app.delete("/hotels/:id", function(req, res) {
  HotelModel.deleteOne({ _id: req.params.id }, function(err, result) {
    console.log("delete result", result); // returns an object of what has been deleted
    res.json({
      success: true,
      data: {
        isDeleted: true
      }
    });
  });
});

// fetch('/hotels')
//     .then(res => res.json())
//     .then((json) => {
//         if (json.success === false) {
//             this.setState({
//                 error: json.message
//             });
//             return;
//         }
//         this.setState({
//             students: json.data
//         })
//     })

// success



// controller

app.listen(port, function() {
    console.log('Server started on port:', port );
  });