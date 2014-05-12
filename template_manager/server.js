// Avoid `console` errors in browsers that lack a console.
(function() {
    var method;
    var noop = function () {};
    var methods = [
        'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
        'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
        'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
        'timeStamp', 'trace', 'warn'
    ];
    var length = methods.length;
    var console = (window.console = window.console || {});

    while (length--) {
        method = methods[length];

        // Only stub undefined methods.
        if (!console[method]) {
            console[method] = noop;
        }
    }
    // // Load native UI library
    // var gui = require('nw.gui');

    // // Get the current window
    // var win = gui.Window.get();
    // win.maximize();
}());


var
  express = require("express"),
  path = require("path"),
  nedb = require('nedb'),
  databaseUrl = "db/templateDatabase.db";

var db = {
  items: new nedb({ filename: databaseUrl, autoload: true })
};

var restify = express();

restify.configure(function () {
  restify.set('port', process.env.PORT || 3000);
  restify.use(express.logger('dev'));
  restify.use(express.bodyParser()),
  restify.use(express.static(path.join(__dirname, 'public')));
});


restify.get('/api', function (req, res) {
  res.send('API is running');
});


restify.get('/items', function (req, res) {
  db.items.find({}, function(err, result) {
    res.send(result);
  });
});


restify.post('/items', function (req, res) {
  var item = req.body;
  db.items.insert(item, function (err, result) {
    if (err) {
      res.send({'error':'An error has occurred'});
    } else {
      console.log('Success: ' + JSON.stringify(result));
      res.send(result);
    }
  });
});


restify.delete('/items/:id', function (req, res) {
  var id = req.params.id;
  db.items.remove({_id: id}, {}, function (err, result) {
    if (err) {
      res.send({'error':'An error has occurred - ' + err});
    } else {
      console.log('' + result + ' document(s) deleted');
      res.send(req.body);
    }
  });
});

restify.listen(restify.get('port'));
console.log('Server listening on port ' + restify.get('port'));



// function createTemplate(tpl) {

//     db.items.insert({
        // summary: tpl.summary,
        // details: tpl.details,
        // cgroup: tpl.cGroup,
        // ogroup: tpl.oGroup,
        // classification: tpl.classification,
        // notes: tpl.notes,
        // reprio: tpl.rPriority,
        // inrprio: tpl.iPriority,
        // urprio: tpl.uPriority
//     }, function(err, newDoc) {
//         if (err) {
//             console.log(err);
//         } else {
//             console.log(newDoc);
//         }
//     });
// }

// function getDbTemplates() {
//     db.items.find({}, function(err, templates) {
//         // console.log(JSON.stringify(templates));
//         return JSON.stringify(templates);
//     });
// }

// function updateTemplate() {
    
//     //pass
// }

// function deleteTemplate() {
    
//     //pass
// }