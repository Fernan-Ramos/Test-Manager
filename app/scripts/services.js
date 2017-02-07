'use strict';
angular.module('testManagerApp')

    .factory('menuFactory', function () {

        var menufac = {};

        var cuestionarios = [

            {
                title: 'Cuanto sabes de paises?',
                image: 'img/libro.jpg',
                text: 'blabalbla',
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
            },
            {
                title: 'Cuanto sabes sobre Java?',
                image: 'img/libro.jpg',
                text: 'blabalba',
                questions: [{
                        title: 'Java Test',
                        pregunta: 'blaa',
                        image: 'img/mundo.jpg',
                        r1: 'asi',
                        r2: 'asao',
                        r3: 'ja',
                        r4: 'je'
                    },
                    {
                        title: 'Java Test',
                        pregunta: 'blaa',
                        image: 'img/programar.jpg',
                        r1: 'asi',
                        r2: 'asao',
                        r3: 'ja',
                        r4: 'je'
                    },
                    {
                        title: 'Java Test',
                        pregunta: 'blaa',
                        image: 'img/libro.jpg',
                        r1: 'asi',
                        r2: 'asao',
                        r3: 'ja',
                        r4: 'je'

                    }
                ]

            },
            {
                title: 'Cuanto sabes de Python? ',
                image: 'img/libro.jpg',
                text: 'blalalal',
                questions: [{
                        title: 'Python Test',
                        pregunta: 'blaa',
                        image: 'img/mundo.jpg',
                        r1: 'asi',
                        r2: 'asao',
                        r3: 'ja',
                        r4: 'je'
                    },
                    {
                        title: 'Python Test',
                        pregunta: 'blaa',
                        image: 'img/programar.jpg',
                        r1: 'asi',
                        r2: 'asao',
                        r3: 'ja',
                        r4: 'je'
                    },
                    {
                        title: 'Python Test',
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
