angular.module("checkpf",['ngMaterial','ngMessages'])
.controller("mainController",['$scope','$http',function($scope,$http){
    $scope.pageLoading = false;
    $scope.showServerProcessing = false;
    $scope.state = {colorClass:"",view:"main"};
    $scope.user = {
        UAN:"",
        mobile:""
    }
    try{
        var user =  localStorage.getItem("user");
        if(user)
        {
            user = JSON.parse(user);
            $scope.user =  user;
        }
            
    }catch(e){}
    $scope.installed = false;
    $scope.promoteToInstall = function()
    {
        $scope.installed = localStorage.getItem("home_screen");
        if(!$scope.installed)
        {
            //navigator.showInstallPrompt();
        }
    }
    window.addEventListener('beforeinstallprompt',function(e){
        
        if($scope.installed)e.preventDefault();
        
        
    });
    window.addEventListener('addedToHomeScreen',function(e){
        
        localStorage.setItem("home_screen",true);
        $scope.$appy(function(){
            $scope.installed = true;
        });
        
    });
    $scope.promoteToInstall();
    $scope.changeView = function(view)
    {
        switch(view)
        {
            case "main":$scope.state.colorClass = "";
                        $scope.state.view = "main";
                        break;
            case "error":$scope.state.colorClass = "";//error-parallel
                        $scope.state.view = "error";
                        break;
            case "detail":$scope.state.colorClass = "";
                        $scope.state.view = "detail";
                        break;
            default:$scope.state.colorClass = "";
                        $scope.state.view = "main";
                        break;

        }


    }
    $scope.checkPf= function(){

       
        if($scope.userForm.$valid)
        {
                try{
                    localStorage.setItem("user",JSON.stringify($scope.user));
                }
                catch(e){}
                $scope.showServerProcessing = true;
                $http.get("https://test2.offerify.in/checkpf/"+$scope.user.UAN+"/"+$scope.user.mobile,{data:"",params:{}}).then(function(res){
                    console.log(res);
                    $scope.showServerProcessing = false;
                    if(res.data == "")
                    {
                        $scope.changeView("error");
                    }
                    else
                    {
                        $scope.pfDetails =res.data;
                         $scope.changeView("detail");
                    }

                },function(res){
                    console.log(res);
                    $scope.changeView("error");
                    $scope.showServerProcessing = false;
                })


        }
    }

}])
