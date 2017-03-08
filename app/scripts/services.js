'use strict';
angular.module('testManagerApp')

    .factory('menuFactory', function () {

        var menufac = {};

        var cuestionarios = [

            {
                title: 'Cuanto sabes de paises?',
                image: 'img/libro.jpg',
                text: 'blabalbla',
                _id: 0,
                questions: [{
                    _id: 0,
                    title: 'paises Test',
                    pregunta: 'blaa',
                    image: 'img/mundo.jpg',
                    r1: 'asi',
                    r2: 'asao',
                    r3: 'ja',
                    r4: 'je',
                    rcorrect: ['asi'],
                    contestada: false
                },
                {
                    _id: 1,
                    title: 'paises Test',
                    pregunta: 'blaa',
                    image: 'img/programar.jpg',
                    r1: 'asi',
                    r2: 'asao',
                    r3: 'ja',
                    r4: 'je',
                    rcorrect: ['asao'],
                    contestada: false
                },
                {
                    _id: 2,
                    title: 'paises Test',
                    pregunta: 'blaa',
                    image: 'img/libro.jpg',
                    r1: 'asi',
                    r2: 'asao',
                    r3: 'ja',
                    r4: 'je',
                    rcorrect: ['ja'],
                    contestada: false

                }
                ]
            }

        ];

        menufac.getCuestionarios = function () {
            return cuestionarios;
        };

        menufac.getCuestionario = function (index) {
            return cuestionarios[index];
        };

        return menufac;


    })



    .factory('testFactory', function () {

        var testfac = {};

        var tests = [];
        var stats = [];
        var labels = [];
        var series = [];
        var data = [];

        testfac.getAnswers = function () {
            return tests;
        };

        testfac.getStats = function () {
            return stats;
        };

        testfac.getStat = function (index) {
            return stats[index];
        };

        testfac.getLabels = function () {
            return labels;
        };

        testfac.getSeries = function () {
            return series;
        };

        testfac.getData = function () {
            return data;
        };

        return testfac;

    });
