var signUp=angular.module('signUp', [])

    signUp.controller("signUpController",function($scope,$http) {
        
		$scope.checkSignUp = function() {
			$http.post('/checkSignUp', $scope.formData)
				.success(function(data) {
					if (data.error==true){
						$scope.formData.status="Please fill out all fields!";
					}
					else{
						if(data.success){
							$scope.formData.status="Successful!";
							localStorage.setItem("userID",data.id);
							window.location.assign('lists.html');
						}
						else{
							$scope.formData.status="This username already existed!";
						}
					}
					
				})
				.error(function(data) {
					console.log('Error: ' + data);
				});
		};
		
     
});