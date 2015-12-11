'use strict';

/*
    Controller for the feature listarPresentes
*/
jd.factory.newController('app.core.fimAno.listarPresentes.listarPresentesCtrl', ['jedi.dialogs.AlertHelper', 'toastr', function (alertHelper, toastr) {

    //#region Service initialize
    var service;// = ... e.g: restangular instance
    //#endregion

    //#region View/Model initialize
    var vm = this;
    vm.listarPresentesModel = {};
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