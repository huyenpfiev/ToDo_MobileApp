var login=angular.module('login', [])

    login.controller("loginController",function($scope,$http) {
        
		$scope.checkLogin = function() {
			$http.post('/checkLogin', $scope.formData)
				.success(function(data) {
					if(data.error==true){
						$scope.formData.status="Please fill out all fields!";
					}
					else{
						if(data.success){
							$scope.formData.status="Successful!";
							localStorage.setItem("userID",data.id);
							window.location.assign('lists.html');
						}
						else{
							$scope.formData.status="Invalid!";
						}
					}
					
				})
				.error(function(data) {
					console.log('Error: ' + data);
				});
		};
		$scope.createAccount=function(){
			window.location.assign('signUp.html');
		};
		
    
});