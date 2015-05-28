'use strict';

angular.module('vmp.render', [
	'angular-meteor',
	'babylon'
])
.controller('RenderCtrl', function($scope, BABYLON) {

  // Get the canvas element from our HTML above
  var canvas = document.getElementById('renderCanvas');

  // Load the BABYLON 3D engine
  var engine = new BABYLON.Engine(canvas, true);

  BABYLON.SceneLoader.Load('', 'level.babylon', engine, function (newScene) {
      // Wait for textures and shaders to be ready
      newScene.executeWhenReady(function () {
          // Attach camera to canvas inputs
          newScene.activeCamera.attachControl(canvas);

          // Once the scene is loaded, just register a render loop to render it
          engine.runRenderLoop(function() {
              newScene.render();
          });
      });
  }, function (progress) {
      // To do: give progress feedback to user
  });

      // Watch for browser/canvas resize events
  window.addEventListener('resize', function () {
    engine.resize();
  });

});
