'use strict';
angular.module('testManagerApp')

    .factory('menuFactory', function () {

        var menufac = {};

        var cuestionarios = [

            {
                title: 'Cuanto sabes de paises?',
                image: 'img/libro.jpg',
                text: 'blabalbla',
                _id:0,
                questions: [{
                        title: 'paises Test',
                        pregunta: 'blaa',
                        image: 'img/mundo.jpg',
                        r1: 'asi',
                        r2: 'asao',
                        r3: 'ja',
                        r4: 'je'
                    },
                    {
                        title: 'paises Test',
                        pregunta: 'blaa',
                        image: 'img/programar.jpg',
                        r1: 'asi',
                        r2: 'asao',
                        r3: 'ja',
                        r4: 'je'
                    },
                    {
                        title: 'paises Test',
                        pregunta: 'blaa',
                        image: 'img/libro.jpg',
                        r1: 'asi',
                        r2: 'asao',
                        r3: 'ja',
                        r4: 'je'

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


    });