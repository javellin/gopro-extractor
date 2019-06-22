// var ffprobe = require('ffprobe'),
//     ffprobeStatic = require('ffprobe-static');

// ffprobe('./videoteste.mp4', { path: ffprobeStatic.path }, function (err, info) {
//   if (err) return done(err);
//   // console.log('INFO', info);
// });

const fs = require('fs');
const gpmfExtract = require('gpmf-extract');
const goproTelemetry = require('gopro-telemetry');
const MongoClient = require('mongodb').MongoClient;
const url = "mongodb://localhost:27017/";
const moment = require('moment');

const arrayBuffer = new Uint8Array(fs.readFileSync('./lulz.MP4')).buffer;
arrayBuffer.fileStart = 0;

gpmfExtract(fs.readFileSync('./lulz.MP4')).then(res => {
  const telemetry = goproTelemetry(res, {});

  MongoClient.connect(url, function (err, db) {
    var dbo = db.db("teste");

    const gpsSamples = telemetry['1'].streams.GPS5.samples;

    let datefodase = moment({ hour: 0, minute: 0, seconds: 0, milliseconds: 0 });

    gpsSamples.forEach((gpsSample) => {
      gpsSample.time = datefodase;
      dbo.collection("gps-samples").insertOne(gpsSample, function (err, res) {
        db.close();
      });
      datefodase = moment(datefodase).add(55, 'milliseconds');
    });
  });
});