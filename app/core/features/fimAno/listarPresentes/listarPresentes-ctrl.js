'use strict';

/*
    Controller for the feature listarPresentes
*/
jd.factory.newController('app.core.fimAno.listarPresentes.listarPresentesCtrl', ['jedi.dialogs.AlertHelper', '$http', function (alertHelper, $http) {

    //#region Service initialize
    var service;// = ... e.g: restangular instance
    //#endregion

    //#region View/Model initialize
    var vm = this;
    vm.model = {};
    //#endregion

    //#region Events binds
    vm.carregarPresentes = carregarPresentes;
    
    //#endregion

    //#region Load controller
    carregarPresentes();
    //#endregion

    //#region Events definitions
    function carregarPresentes() {                
        $http.get('http://localhost:3000/listaPresentes')
            .success(function(data) {
                vm.model.listaPresentes=data;
            }).error(function(data,status,error,config){
                alertHelper.addError('Entre em contato com a Ti!');
            });


    }

    //#endregion

}]);