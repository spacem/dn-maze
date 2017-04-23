var express = require('express');
var router = express.Router();
var fs = require('fs');
var path = require('path');

var dir = path.join(__dirname, '../images/backgrounds');

var mime = {
    html: 'text/html',
    txt: 'text/plain',
    css: 'text/css',
    gif: 'image/gif',
    jpg: 'image/jpeg',
    png: 'image/png',
    svg: 'image/svg+xml',
    js: 'application/javascript'
};

router.get('/*', function (req, res) {
    // console.log('finding background', dir);
    fs.readdir(dir, function(err, files) {
        // console.log('got ', files.length);
        
        files = files.filter(function(f) {
            return f.indexOf('.jpg') > 0;
        });
        
        // console.log('now have ', files.length);
        if(files.length) {
            var index = Math.floor(Math.random() * files.length);
            
            var file = path.join(dir, files[index]);
            if (file.indexOf(dir + path.sep) !== 0) {
                return res.status(403).end('Forbidden');
            }
            var type = mime[path.extname(file).slice(1)] || 'text/plain';
            var s = fs.createReadStream(file);
            s.on('open', function () {
                res.set('Content-Type', type);
                s.pipe(res);
            });
            s.on('error', function (err) {
                // console.log('cannot read file ', file , err);
                res.set('Content-Type', 'text/plain');
                res.status(404).end('Not found');
            });
        }
        else {
            res.status(404).end('No Images');
        }
    });
});

module.exports = router;