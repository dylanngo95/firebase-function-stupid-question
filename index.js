'use strict';
/**
 * Write by TinhNgo - 2018
 */

/**
 * Import library
 */
const functions = require('firebase-functions');
const admin = require('firebase-admin');
const express = require('express');
var _ = require('lodash');
/**
 * Config app
 */
admin.initializeApp(functions.config().firebase);
const app = express();

/**
 * Define API router
 */

app.get('/v1/wellcome', (req, res) => {
    return res.status(200).json({
        code: 200,
        message: 'Wellcome Hoi Ngu API.',
        result: {}
    });
});

app.get('/v1/quotes', (req, res) => {
    const last_updated = req.query.last_updated;
    const refQuotes = 'quotes';

    if(_.isUndefined(last_updated)) {
        return res.status(400).json({
            code: 400,
            message: 'last_updated is null',
            result: {
            },
        });
    }

    let quotes = [];
    admin.database().ref(refQuotes)
    .orderByChild('key')
    .once('value')
    .then((snap) => {
        snap.forEach((child) => {
            if (child.key > last_updated) {
                quotes.push(child);
            }
            //console.log(child.val());
        });
        //console.log(snap.val());
    });

    return res.status(200).json({
        code: 200,
        message: 'complete',
        result: {
            quotes: quotes,
        },
    });
});

/**
 * Define function with firebase databae
 */


/**
 * Export Api
 */
exports.api = functions.https.onRequest(app);
