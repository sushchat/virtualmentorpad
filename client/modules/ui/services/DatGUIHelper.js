angular
	.module('vmp.ui.datgui-helper', [
		'vmp.core.cubemapper',
		'dat.gui'
	])
	.service('DatGUIHelper',
		function (dat, $window, CubeMapper) {
			'use strict';

			this.init = function () {

				var gui = new dat.GUI();

				var sceneFolder = gui.addFolder("Scene");
				sceneFolder.open();

				var startData = {
					Cubemap: 'unity/1'
				};

				var cubeMapChanger = sceneFolder.add(startData, 'Cubemap', ['unity/1', 'niagara/niagara']);

				CubeMapper.setCubeMap(startData.Cubemap);

				cubeMapChanger.onFinishChange(function (value) {
					CubeMapper.setCubeMap(value);
				});


			};


		}
	);
