const my_db  =  'Database';
const PeopleColl = 'People';
const CitiesColl = 'Address';
const StatesColl = 'States';
const collectionName = 'Users';
const HolidaysCollection = 'Holidays';
const Mongodb = require('mongodb');
let MongoClient = Mongodb.MongoClient;
let url = `mongodb://localhost:27017/${my_db}`;
const PeopleColl1 = 'people1';
const jwt = require('jsonwebtoken')
const secret = '1234(=:'

// ******************************************************************
function login (req,res){
    console.log('users login is accessed')

MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, function(err, db) {
    if (err) { 
        console.log(err)
        return res.sendStatus(500)
      };
  var dbo = db.db(my_db);
  const queryUser = req.body;
  dbo.collection(collectionName).findOne(queryUser, function(err, user) {
    if (err) { 
        console.log(err)   
        return res.sendStatus(500)
      };
      if (user){
          return res.status(200).send({Token:CreateToken(user),role:user.role,nickname:user.nickname})
      }
        return res.sendStatus(404)
  });
});
}

function register (req,res){
    MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, function(err, db) {
        if (err) { 
          console.log(err)
          return res.sendStatus(500)
        };
        const dbo = db.db(my_db);
        const queryUser = req.body;
        dbo.collection(collectionName)
        .findOne({ID:queryUser.ID}, function(err, userFound) {
          if (err) {
            console.log(err)
            return res.sendStatus(500)
          };
     if (userFound){
          return res.sendStatus(400)
     } 
    
     dbo.collection(collectionName).insertOne(queryUser, function(err, result) {
      if (err) {
        console.log(err)
        return res.sendStatus(500)
      }
            res.sendStatus(201);
    });
        });
      });
}
module.exports.register=register;
module.exports.login=login;

// *******************************************************************
module.exports.GetFirstCities = GetFirstCities
function GetFirstCities (req , res) { 
  MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, function(err, db) {
    if (err) {
      res.sendStatus(500);
      return;
  }
    var dbo = db.db(my_db);
    dbo.collection(CitiesColl).find().limit(5).toArray(function(err, result) {
      if (err) {
        res.sendStatus(500);
        return;
    }
    res.send(result)
      db.close();
    });
  });
}
module.exports.GetCities = GetCities;
  function GetCities (req , res) { 
    MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, function(err, db) {
      if (err) {
        res.sendStatus(500);
        return;
    }
      var dbo = db.db(my_db);
      var query = req.body;
      dbo.collection(CitiesColl).find(query).toArray(function(err, result) {
        if (err) {
          res.sendStatus(500);
          return;
      }
      res.send(result)
        db.close();
      });
    });
  }

  function updateCities (req , res) {
    MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, function(err, db) {
      if (err) {
        res.sendStatus(500);
        return;
    }
      var dbo = db.db(my_db);
      var myquery = {"_id": new Mongodb.ObjectId(req.params.id) };
      var newPeopleobj = { $set: req.body };
      
      dbo.collection(CitiesColl).updateOne(myquery, newPeopleobj, function(err, newobj) {
    
        if (err) {
          res.sendStatus(500);
          return;
      }
      if (newobj.matchedCount < 1){
        res.sendStatus(404);
          return;
      }
      res.send(newobj)
        db.close();   
      });
    }); 
    }

module.exports.updateCities = updateCities;    
// *************************************************************************
function GetStates (req , res) { 
  MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, function(err, db) {
    if (err) {
      res.sendStatus(500);
      return;
  }
    var dbo = db.db(my_db);
    var query = req.body;
    dbo.collection(StatesColl).find(query).toArray(function(err, result) {
      if (err) {
        res.sendStatus(500);
        return;
    }
    res.send(result)
      db.close();
    });
  });
}
module.exports.GetStates = GetStates;

function GetFirstStates (req , res) { 
  MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, function(err, db) {
    if (err) {
      res.sendStatus(500);
      return;
  }
    var dbo = db.db(my_db);
    dbo.collection(StatesColl).find().limit(10).toArray(function(err, result) {
      if (err) {
        res.sendStatus(500);
        return;
    }
    res.send(result)
      db.close();
    });
  });
}
module.exports.GetFirstStates = GetFirstStates;


// *************************************************************************

function Find (req , res) { 
  MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, function(err, db) {
    if (err) {
      res.sendStatus(500);
      return;
  }
    var dbo = db.db(my_db);
    var query = req.body 
// console.log(query);
    dbo.collection(PeopleColl).find(query).toArray(function(err, result) {
      if (err) {
        res.sendStatus(500);
        return;
    }
    res.send(result)
      db.close();
    });
  });   
}


function updatePeople (req , res) {
MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, function(err, db) {
  if (err) {
    res.sendStatus(500);
    return;
}
  var dbo = db.db(my_db);
  var myquery = {"_id": new Mongodb.ObjectId(req.params.id) };
  var newPeopleobj = { $set: req.body };
  
  dbo.collection(PeopleColl).updateOne(myquery, newPeopleobj, function(err, newobj) {

    if (err) {
      return res.send({ Status: "500" , Results: "אירע שגיאה - הנזקק לא עודכן"});
  }
  if (newobj.matchedCount < 1){
    return res.send({ Status: "404" , Results: "אירע שגיאה - הנזקק לא עודכן"});
  }
  res.send({ Status: "200" , Results: "השינויים עודכנו בהצלחה!"});
  db.close();   
  });
}); 
} 


function deletePeople (req , res) {
  MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, function(err, db) {
    if (err) {
      res.sendStatus(500);
      return;
  }
    var dbo = db.db(my_db);
    var myquery = {"_id": new Mongodb.ObjectId(req.params.id) };
    dbo.collection(PeopleColl).deleteOne(myquery, function(err, obj) {
      if (err) {
        res.sendStatus(500);
        return;
    }
    if (obj.deletedCount == 0){
      res.sendStatus(404);
        return;
    }
      // console.log(obj);
      res.sendStatus(200)
      db.close();
    });
  });
}


function postPeople (req , res) {
  MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, function(err, db) {
    if (err) { 
      console.log(err)
      return res.sendStatus(500)
    };
    const dbo = db.db(my_db);
    const queryUser = req.body;
    dbo.collection(PeopleColl).findOne({PersonID:queryUser.PersonID}, function(err, Found) {
      if (err) {
        console.log(err)
        return res.send({ Status: "500" , Results: "אירע שגיאה - הנזקק  לא נוסף"});
      };
 if (Found){
  return res.send({ Status: "400" , Results: "לא ניתן להוסיף - כבר קיים נזקק עם ת.ז זהה"});
 } 
 dbo.collection(PeopleColl).insertOne(queryUser, function(err, result) {
  if (err) {
    console.log(err)
    return res.send({ Status: "500" , Results: "אירע שגיאה - הנזקק  לא נוסף"});
  }
   res.send({ Status: "201" , Results: "הנזקק נוסף בהצלחה!"});
    db.close();
});
    });
  });
}

function postHoliday (req , res) {
  MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, function(err, db) {
    if (err) { 
      console.log(err)
      return res.send({ Status: "500" , Results: "אירע שגיאה - החג לא נוסף"});
    };
    const dbo = db.db(my_db);
    const HolidayObj = req.body;
    dbo.collection(HolidaysCollection).findOne({DateOFHoliday:HolidayObj.DateOFHoliday}, function(err, Found) {
      if (err) {   
        console.log(err)
        return res.send({ Status: "500" , Results: "אירע שגיאה - החג לא נוסף"});
      };
 if (Found){
  return res.send({ Status: "400" , Results: "לא ניתן להוסיף - כבר קיים חג עם תאריך זה"});
 } 
 dbo.collection(HolidaysCollection).findOne({Name: HolidayObj.Name, Y: HolidayObj.Y }, function(err, Found) {
  if (err) {   
    console.log(err)
    return res.send({ Status: "500" , Results: "אירע שגיאה - החג לא נוסף"});
  };
if (Found){
  return res.send({ Status: "400" , Results: "לא ניתן להוסיף - כבר קיים חג עם שם ושנה אלו"});
} 
dbo.collection(HolidaysCollection).findOne({ID: HolidayObj.ID}, function(err, Found) {
  if (err) {   
    console.log(err)
    return res.send({ Status: "500" , Results: "אירע שגיאה - החג לא נוסף"});
  };
if (Found){
  return res.sendStatus(400)
} 
 dbo.collection(HolidaysCollection).insertOne(HolidayObj, function(err, result) {
  if (err) {
    console.log(err)
    return res.send({ Status: "500" , Results: "אירע שגיאה - החג לא נוסף"});
  }
  res.send({ Status: "201" , Results: `החג ${HolidayObj.Name +"-"+ HolidayObj.Y} נוסף בהצלחה!`});
  db.close();
});
});
    });
  });
  });
}

module.exports.postHoliday = postHoliday
module.exports.getHoliday = getHoliday
function getHoliday (req , res) {
  MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, function(err, db) {
      if (err) {
          res.sendStatus(500);
          return;
      }
      var dbo = db.db(my_db);
      dbo.collection(HolidaysCollection).find({}).toArray(function(err, Holiday) {
        if (err) {
          res.sendStatus(500);
          return;
        }
        res.send(Holiday);
        db.close();
      });
    });
}

module.exports.LastHoliday  = LastHoliday 
function LastHoliday  (req , res) {
  MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, function(err, db) {
      if (err) {
          res.sendStatus(500);
          return;
      }
      var dbo = db.db(my_db);
      dbo.collection(HolidaysCollection).findOne({}, {sort:{$natural:-1}} , function(err, Holiday) {
        if (err) {
          res.sendStatus(500);
          return;
        }
        // console.log(Holiday);
        res.send([Holiday]);
        db.close();
      });
    });
}
 
// *********************************************************************************************

function getPeople (req , res) {
    MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, function(err, db) {
        if (err) {
            res.sendStatus(500);
            return;
        }
        var dbo = db.db(my_db);
        var myquery = {}
        if (req.params.id === undefined || req.params.id === ''){}
        else { myquery = {"_id": new Mongodb.ObjectId(req.params.id) }; }
        dbo.collection(PeopleColl).find(myquery).toArray(function(err, People) {
          if (err) {
            res.sendStatus(500);
            return;
          }
          res.send(People);
          db.close();
        });
      });
}


module.exports.getPeople = getPeople;
module.exports.postPeople = postPeople;
module.exports.deletePeople = deletePeople;
module.exports.updatePeople = updatePeople
module.exports.Find = Find;

function getPeople1 (req , res) {
  MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, function(err, db) {
      if (err) {
          res.sendStatus(500);
          return;
      }
      var dbo = db.db(my_db);
      dbo.collection(PeopleColl1).find({}).toArray(function(err, People) {
        if (err) {
          res.sendStatus(500);
          return;
        }
        res.send(People);
        db.close();
      });
    });
}

function FindWlimit (req , res ) { 
  MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, function(err, db) {
    if (err) {
      res.sendStatus(500);
      return;
  }
    var dbo = db.db(my_db);
    var query = req.body
    var skip = Number(req.params.num)

    dbo.collection(PeopleColl).find(query).skip(skip).limit(50).toArray(function(err, result) {
      if (err) {
        res.sendStatus(500);
        return;
    }
    res.send(result)
      db.close();
    });
  });   
}
module.exports.FindWlimit = FindWlimit
module.exports.getPeople1 = getPeople1;

function CreateToken(user){
  const validTimeSec = 480*60;
  const expirationDate = Date.now() / 1000 + validTimeSec
  const token = jwt.sign({userID:user.email, exp : expirationDate},secret)
  return token;
}