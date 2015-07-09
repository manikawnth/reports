var app = angular.module('app', ['ngTouch', 'ngRoute','ui.grid', 'ui.grid.cellNav', 'ui.grid.edit', 'ui.grid.resizeColumns', 'ui.grid.pinning', 'ui.grid.selection', 'ui.grid.moveColumns', 'ui.grid.exporter', 'ui.grid.importer', 'ui.grid.grouping','nvd3']);


app.factory('factoryObj',function(){
  var factoryObj = {};
  factoryObj.tableData = [];

  return factoryObj;
})

app.factory('_',function(){
  return window._;
})

app.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider
      .when('/reports', {
        templateUrl: 'reports.html',
        controller: 'reportsCtrl'
      })
      .when('/charts/car', {
        templateUrl: 'charts_car.html',
        controller: 'carChartsCtrl'
      })

}])

app.controller('reportsCtrl',  ['$scope', '$http', '$timeout', '$interval', 'uiGridConstants', 'uiGridGroupingConstants','factoryObj',
 function ($scope, $http, $timeout, $interval, uiGridConstants, uiGridGroupingConstants,factoryObj) {

  $scope.gridOptions = {};
  $scope.gridOptions.enableColumnResizing = true;
  $scope.gridOptions.enableFiltering = true;
  $scope.gridOptions.enableGridMenu = true;
  $scope.gridOptions.showGridFooter = true;
  $scope.gridOptions.showColumnFooter = true;
  $scope.gridOptions.fastWatch = true;

  $scope.gridOptions.rowIdentity = function(row) {
    return row.id;
  };
  $scope.gridOptions.getRowIdentity = function(row) {
    return row.id;
  };

  $scope.gridOptions.columnDefs = [
  { name:'STA_NO',          displayName:'Station' },
  { name:'TRAN_LOG_DT',     displayName:'Tran Date' },
  { name:'RA_NO',           displayName:'RA number' },
  { name:'MVA_NO',          displayName:'Vehicle num' },
  { name:'CUST_NA',         displayName:'Customer Name' },
  { name:'GAS_CI_AMT',      displayName:'Gas Amount' },
  { name:'CAR_RSRV_CD',     displayName:'Car Rsvd' },
  { name:'CAR_CHG_CD',      displayName:'Car Charged' },
  { name:'CAR_RNT_CD',      displayName:'Car rented' },
  { name:'FULL_CI_TANK_IND',displayName:'Return Gas' },
  { name:'SPEQP_DESC',      displayName:'Equipments' },


  ]
  $scope.gridOptions.data = factoryObj.tableData;
  $scope.callsPending = 0;
  $scope.error = false;
  var i = 0;
  $scope.refreshData = function(){

    $http.post('/rntlog',{})
    .success(function(data) {
      factoryObj.tableData = data;      
      for(i=0;i<factoryObj.tableData.length;i++){
        $scope.gridOptions.data.push(factoryObj.tableData[i]);  
      }
    
    })
    .error(function() {
      $scope.error = true;
      $scope.errmsg = "There is an error in fetching the table data"
    });


  };

}]);

app.controller('carChartsCtrl',['$scope','$http','factoryObj','_',function($scope,$http,factoryObj,_){

var chart_array = [];
var legends = [];
var pie_arrays = [];

  $scope.generateChart = function(){

    //grouped by reserved car group
    var res_grouped_obj = _.groupBy(factoryObj.tableData,'CAR_RSRV_CD');
    

    for(var key in res_grouped_obj){
      if (key !=""){
        legends.push(key);
        chart_array.push(res_grouped_obj[key]);
      }
    }
    console.log(legends);
    console.log(chart_array);

    //For each res car grouped array, re-group it based on rental car code
    for(i=0;i<chart_array.length;i++){
      chart_array[i] = _.groupBy(chart_array[i],'CAR_RNT_CD');
    }

    console.log(chart_array);

    for (i=0;i<chart_array.length;i++){ //chart_array[i] represents each element for res_car_code
      var pie_array = [];
      for (var key in chart_array[i]){
        var pie_doc = {};
        pie_doc.x = key;
        pie_doc.y = chart_array[i][key].length;
        pie_array.push(pie_doc);
      }
      pie_arrays.push(pie_array);
    }
    $scope.pie_arrays = _.object(legends, pie_arrays);
    console.log($scope.pie_arrays);
  }
  $scope.options = {
      chart: {
          type: 'pieChart',
          height: 400,
          x: function(d){return d.x;},
          y: function(d){return d.y;},
          showLabels: true,
          transitionDuration: 500,
          labelThreshold: 0.01,
          /*legend: {
              margin: {
                  top: 5,
                  right: 35,
                  bottom: 5,
                  left: 0
              }
          }*/
      }
    }


}])
