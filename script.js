angular.module("checkpf",['ngMaterial','ngMessages'])
.controller("mainController",['$scope','$http',function($scope,$http){
    $scope.pageLoading = false;
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
                $http.get("https://wowcoupon.in/pricetracker/app/CheckPF",{data:"",params:{uan:$scope.user.UAN,mobile:$scope.user.mobile}}).then(function(res){
                    console.log(res);
                    if(res.data == "")
                    {
                        $scope.changeView("error");
                    }
                    else
                    {
                        $scope.pfDetails ={
                            UAN: $scope.user.UAN,
                            mobile:$scope.user.mobile,
                            mId:res.data[1],
                            name:res.data[3],
                            dob:res.data[4],
                            aadhar:res.data[5],
                            bank:res.data[6],
                            pan:res.data[7],
                            lastCredit:res.data[8],
                            balance:res.data[9],
                            status:res.data[10],
                            passbook:res.data[11],
                            year:res.data[13]
                        }
                         $scope.changeView("detail");
                    }

                },function(res){
                    console.log(res);
                    $scope.changeView("error");
                })


        }
    }

}])
