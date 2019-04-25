
var lists=angular.module('starter', ['ionic'])
var userID={
  _id:localStorage.getItem("userID")
}

lists.factory('Projects', function() {
  return {
    newProject: function(projectTitle) {
      return {
        name_list:projectTitle,
        tasks:[]
      };
    },
    getLastActiveIndex: function() {
      return parseInt(window.localStorage['lastActiveProject']) || 0;
    },
    setLastActiveIndex: function(index) {
      window.localStorage['lastActiveProject'] = index;
    }
  } 
});

lists.controller("mainController", function($scope,$http,Projects, $ionicModal, $ionicSideMenuDelegate) {
    $scope.groups = {};
    $scope.new={};
    $scope.activeProject = {};
    $scope.edit=false;
    //get all tasks
    var getTaskSet=function(title){
      var name={
        _id:title
      } 
        $http.post('/getTaskSet',name)
        .success(function(d) {
          $scope.activeProject.tasks= d;
          console.log(d);
        })
        .error(function(d) {
          console.log('Error: ' + d);
        });
    }
    //get all projects and show them
    $http.post('/getGroupLists',userID)
        .success(function(data) {
          if(data.length==0){
            $scope.newProject();
          }
          else{
            $scope.groups= data;
            console.log(data);
            // Grab the last active, or the first project
            $scope.activeProject.name_list = $scope.groups[Projects.getLastActiveIndex()].name_list;
            getTaskSet($scope.activeProject.name_list);
          }
            
        })
        .error(function(data) {
            console.log('Error: ' + data);
        });
      

    // Called to create a new project
    var createProject = function(projectTitle) {
      var newProject={
        name:projectTitle
      }
      $http.post('/addProject', newProject)
            .success(function(data) {
                $scope.formData = {}; 
                $scope.groups = data;
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
      var project=Projects.newProject(projectTitle);
      $scope.selectProject(project, $scope.groups.length-1);
      };

    $scope.newProject = function() {
      var projectTitle = prompt('New project name:');
      if(projectTitle) {
        createProject(projectTitle);
      }
    };

    // Called to select the given project
    $scope.selectProject = function(project, index) {
      $scope.activeProject.name_list = project.name_list;
      getTaskSet(project.name_list);
      Projects.setLastActiveIndex(index);
      $ionicSideMenuDelegate.toggleLeft(false);
    };
    // delete a project 
    $scope.deleteProject = function(name) {
     
      $http.delete('/deleteProject/'+name)
          .success(function(data) {
            $scope.formData = {}; 
            $scope.groups = data;
            var n=$scope.groups.length;
            if(n>0){
              var project=$scope.groups[n-1];
              $scope.selectProject(project, n-1);
            }
            else{
              window.location.reload();
            }
            
          })
          .error(function(data) {
              console.log('Error: ' + data);
          });
    };


    // Create our modal
    $ionicModal.fromTemplateUrl('new-task.html', function(modal) {
      $scope.taskModal = modal;
    }, {
      scope: $scope,
      animation: 'slide-in-up'
    });
  
    // Called when the form is submitted
    $scope.createTask = function(task) {
      if(typeof task.name != 'undefined'){
        $scope.new.name = task.name;
        $http.post('/addTask', $scope.new)
                .success(function(data) {
                    $scope.activeProject.tasks = data;
                })
                .error(function(data) {
                    console.log('Error: ' + data);
                });

        $scope.taskModal.hide();
        task.name = "";
      }
      
    };
    //delete Task
    $scope.deleteTask = function(id) {

        $http.delete('/deleteTask/' + id)
            .success(function(data) {
                $scope.activeProject.tasks = data;
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    };
    //update Done
    $scope.updateDone = function(task) {

      $http.put('/updateDone', task)
          .success(function(data) {
            $scope.activeProject.tasks = data;
          })
          .error(function(data) {
              console.log('Error: ' + data);
          });
    };
    //update a task
    $scope.updateTask = function(task) {
        
      $http.put('/updateTask', task)
          .success(function(data) {
              $scope.activeProject.tasks = data;      
          })
          .error(function(data) {
              console.log('Error: ' + data);
          });
    };

    // Open our new task modal
    $scope.newTask = function() {
     
      if($scope.activeProject.name_list == undefined){
        $scope.newProject();
      }
      else{
        $scope.taskModal.show();
      }
      
    };

    // Close the new task modal
    $scope.closeNewTask = function() {
      $scope.taskModal.hide();
    };
  
    $scope.toggleProjects = function() {
      $ionicSideMenuDelegate.toggleLeft(true);
    };

});

