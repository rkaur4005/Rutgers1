/**
 * Created by Developer 3 on 8/27/2016.
 */
(function (angular, $) {
    'use strict';
    angular
        .module('egyanApp.groupchat', [])
        .controller('GroupchatCtrl', ['$scope','$window', '$routeParams', '$http', '$uibModal', '$filter', '$timeout', 'globalConfig', 'Auth', 'NavItems', function ($scope,$window, $routeParams, $http, $uibModal, $filter, $timeout, globalConfig, Auth,  NavItems) {
            $scope.user_type = Auth.getUserType();
            $scope.groupid = $routeParams.studentgroupId;
            $scope.classid = $routeParams.classId;
            var chatListParams = {
                studentgroup_id: $scope.groupid,
                callback: 'JSON_CALLBACK'
            };
            $http.jsonp(globalConfig.service.elearning + globalConfig.service.groupchat.list + '?' + $.param(chatListParams))
                .then(function (data) {
                    $scope.chatlist = data.data.result;
                    $scope.chatlistmessage = data.data.msg;
                    $timeout(function () {
                        $('#chatcontainer').scrollTo($('#chatcontainer dl:last'));
                    }, 100);
                }, function () {
                });
            $scope.send = function() {
                if ($scope.message.length) {
                    var params = {studentgroup_id: $scope.groupid, msg: $scope.message};
                    $http.post(globalConfig.service.elearning + globalConfig.service.groupchat.message, $.param(params))
                        .then(function (data) {
                            if (data.data && data.data.success) {
                                $scope.messagestatus = 'message sent successfully';
                                $scope.chatlist.push({username: Auth.getInternalId(), msg: $scope.message});
                                $scope.message = '';
                                $('#chatcontainer').scrollTo($('#chatcontainer dl:last'));
                            } else {
                                NavItems.errmsg = 'Error sending message';
                            }
                        });
                } else {
                    alert('Please enter message');
                }
            };
        }]);
}(angular, jQuery));