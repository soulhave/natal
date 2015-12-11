'use strict';

/*
    Controller for the feature cadastrarPresentes
*/
jd.factory.newController('app.core.fimAno.cadastrarPresentes.cadastrarPresentesCtrl', ['jedi.dialogs.AlertHelper', 'toastr', function (alertHelper, toastr) {

    //#region Service initialize
    var service;// = ... e.g: restangular instance
    //#endregion

    //#region View/Model initialize
    var vm = this;
    vm.cadastrarPresentesModel = {};
    //#endregion

    //#region Events binds
    vm.method1 = method1;
    vm.method2 = method2;
    //#endregion

    //#region Load controller
    method2();
    //#endregion

    //#region Events definitions
    function method1() {
        alertHelper.addInfo('Method1 called');
    }

    function method2() {
        toastr.success('Method2 called');
    }
    //#endregion

}]);