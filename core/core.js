var util = require('util');
var fs = require('fs');
var url = require("url");
var qs = require("querystring");
var path = require("path");
var mime = require('./mime');
var config = require('../config.js');
var controller = require('./controller.js');

(function () {
    'use strict';

    var controllers = controller.getControllers();
    var incomingTotalRequest = 0;

    function write404(response) {
        response.writeHeader(404, {
            'Content-Type': 'text/html'
        });
        response.end(config._404);
    }

    /**
     * @brief processing request
     * @param [in] object request Http Request Object
     * @param [in] object response Http Response.
     * @return void.
     */
    function processRequest(request, response) {
        util.log('New request coming... => ' + request.url + ':' + (++incomingTotalRequest));
        var processResult = '';
        var parsedUrl = url.parse(request.url, false);
        var paths = parsedUrl.pathname.split('/').splice(1);
        var queryData = parsedUrl.query;
        var cls, method, params;

        var setResponse = function (parameters) {

            var formData = typeof (parameters) != 'undefined' && parameters.hasOwnProperty("formData") ? parameters.formData : [];

            response.writeHeader(200, {
                'Content-Type': 'text/html'
            });

            processResult = controllers[cls][method].call({
                request: request,
                response: response,
                queryString: qs.parse(parsedUrl.query),
                form: formData,
                parsedUrl: parsedUrl
            });

            if (typeof processResult !== 'undefined') {
                response.end(processResult);
            }
        };

        cls = paths[0]; //get root controller name
        if (cls === '') {
            cls = config.baseController;
            method = config.defaultAction;
        }

        if (paths.length > 1) {
            method = paths[1];
            params = paths.slice(2);
        }

        if (!method) {
            method = config.defaultAction;
        }

        //TODO: Find Controller from Routes
        if (controllers[cls] && (typeof controllers[cls][method] === 'function' || typeof controllers[cls].hasOwnProperty('_any'))) {

            if (typeof controllers[cls][method] !== 'function') {
                method = '_any';
                if (typeof controllers[cls][method] !== 'function') {
                    write404(response);
                    return;
                }
            }

            switch (request.method) {
                case 'GET':
                    setResponse();
                    break;
                case 'POST':
                    var data = '';
                    request.on('data', function (chunk) {
                        data += chunk;
                    });
                    request.on('end', function () {
                        var formData = qs.parse(data);
                        setResponse({ formData: formData });
                    });
                    break;
            }
        } else {
            /**
             * Catching not found controller
             */
            write404(response);
        }
    }

    var rewritedUrl = false;

    function getContentType(path) {
        var fileExtension = path.substring(path.lastIndexOf('.') + 1).toLowerCase();
        if (typeof mime.TYPE[fileExtension] === 'undefined') {
            return ['text/html', 'utf-8'];
        }
        return mime.TYPE[fileExtension];
    }

    function init(request, response) {

   var uri = url.parse(request.url).pathname,
            re = /(?:\.([^.]+))?$/;

        //check content type
        var contentType = getContentType(uri)[0],
            responseStatusCode = 200; //default

        if (request.url === '/') {
            processRequest(request, response);
            return;
        }

     
        //check file

        fs.exists(config.basePath +uri.replace('/', '\\'), function (exists) {
            var isVirtualPAth = typeof re.exec(uri)[1] === 'undefined';
            if (isVirtualPAth) {
                processRequest(request, response);
                return;
            }

            if (!exists) {
                response.writeHeader(404, {});
                response.end();
                return;
            } else {
                response.writeHeader(responseStatusCode, {
                    'Content-Type': contentType
                });
                var file = fs.readFileSync(config.basePath + uri);
                response.end(file, 'binary');
                return;
            }
        });
    }

    exports.init = init;

} ());
