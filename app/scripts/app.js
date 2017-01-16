'use strict';
angular.module('testManagerApp',['ui.bootstrap'])
    .controller('carouselTest',function($scope){
   
    $scope.setInterval = 5000;
    
    $scope.slides = [
        
        {   
            title: 'Cuanto sabes de paises?' ,
            image: 'img/mundo.jpg',
            text : 'blabalbla'
        },
        {
            title: 'Prepara tus examenes con testManager' ,
            image: 'img/libro.jpg',
            text : 'blabalba'
        },
        {
            title: 'Cuestionarios sobre programación ' ,
            image: 'img/programar.jpg',
            text : 'blalalal'
        }
        
        
    ];
    
});