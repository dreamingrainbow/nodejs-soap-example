'use strict';
const expressApp = require('express')(); // Compressing two lines into one.
const bodyParser = require('body-parser'); // Several parsers for HTTP requests.

expressApp.use(bodyParser.json()) // States that 'expressApp' will use JSON parser.
    // Since each Express method returns the updated object, methods can be chained.
    .post('/parallel-soap-invoke', (req, res) => { 
        /**
         * As an example, the same request body will be sent as response with
         * a different HTTP status code.
         */
        res.status(202).send(req.body); // req.body will have the parsed object 
    })
    .listen(3000, () => console.log('Waiting for incoming requests.'));
    
var { soap } = require('strong-soap');
var url = 'http://www.dneonline.com/calculator.asmx?WSDL';

var requestArgs = {
    "intA": 1,
    "intB": 2,
};

const createClient = () => (new Promise((resolve, reject) => (
    soap.createClient(url, {}, (err, client) => {
        if (err) {
            reject(err);
        } else {
            // A message is displayed each time a client is created.
            console.log('A new client is being created.');
            resolve(client);
        }
    })))
);

const invokeOperation = client => (new Promise((resolve, reject) => (
    client.Add(requestArgs, (err, result) => (
        err ? reject(err) : resolve(result)
    ))
)));

const processRequest = () => createClient().then(invokeOperation)

processRequest().then(result => console.log(`Result: ${"\n" + JSON.stringify(result)}`))
    .catch(({ message }) => console.log(message));
processRequest().then(result => console.log(`Result: ${"\n" + JSON.stringify(result)}`))
    .catch(({ message }) => console.log(message));
processRequest().then(result => console.log(`Result: ${"\n" + JSON.stringify(result)}`))
    .catch(({ message }) => console.log(message));