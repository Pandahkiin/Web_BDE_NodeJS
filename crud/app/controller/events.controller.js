'use strict';

var Model     = require('../model/appModel');
var response  = require('./responseManager');

const eventsTable = "events";

exports.list_all_events = function(req, res) {
  const join = "INNER JOIN campuses ON id_Campuses = campuses.id INNER JOIN repetitions ON id_Repetitions = repetitions.id INNER JOIN approbations ON id_Approbations = approbations.id";
  Model.getAll(eventsTable + ".id, name, description, date, price_participation, location, repetition, approbation", eventsTable, function(err, event) {
    response.getAll(res, err, event);
  }, join);
};

exports.create_an_event = function(req, res) {
  var newEvent = new Model(eventsTable, req.body);

  //handles null error
  if(!newEvent.name || !newEvent.description || !newEvent.date || (!newEvent.price_participation && newEvent.price_participation != 0) || !newEvent.id_Users || !newEvent.id_Campuses || !newEvent.id_Repetitions) {
    response.nullEntry(res, "Please provide name, description, date (yyyy/mm/dd), price, id_user, id_campus and id_repetition");
  } else {
    Model.create(eventsTable, newEvent, function(err, event) {
      response.create(res, err, event);
    });
  }
};

exports.read_an_event = function(req, res) {
  const join = "INNER JOIN campuses ON id_Campuses = campuses.id INNER JOIN repetitions ON id_Repetitions = repetitions.id INNER JOIN approbations ON id_Approbations = approbations.id";
  Model.getById("name, description, date, price_participation, location, repetition, approbation", eventsTable, req.params.eventId, function(err, event) {
    response.byId(res, err, event);
  }, join);
};

exports.update_an_event = function(req, res) {
  var row = new Model(eventsTable, req.body);
  if(row.image == "default path") { delete(row.image); }

  //handles null error
  if(!row.name && !row.description && !row.date && (!row.price_participation && row.price_participation != 0) && !row.id_Users && !row.id_Campuses && !row.id_Repetitions && !row.id_Approbations && !row.image) {
    response.nullEntry(res, "Please provide name, description, date (yyyy/mm/dd), price, id_user, id_campus, id_repetition, id_approbation and/or image");
  } else {
    Model.updateById(eventsTable, row, req.params.eventId, function(err, event) {
      response.byId(res, err, event);
    });
  }
};

exports.delete_an_event = function(req, res) {
  Model.removeById(eventsTable, req.params.eventId, function(err, event) {
    response.byId(res, err, event);
  });
};