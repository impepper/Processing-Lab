(function(){
	
	// Ti.include('code_editor.js');
	winHost.code_list={};
	
	winHost.code_list.init = function(levelInfo){
		//建立程式碼清單列表
		var dataLength = 'levelInfo:'+levelInfo
		var levelLength = winHost.code_lists.length;
		Ti.API.info('levelInfo:'+levelInfo);
		
		//縮尋該目錄所有合乎附檔名的檔案
		if (Titanium.Filesystem.isExternalStoragePresent()){ 
			var dirFullPath = Titanium.Filesystem.externalStorageDirectory;
		} else {
			var dirFullPath=Ti.Filesystem.applicationDataDirectory;
			// var dirFullPath = Titanium.Filesystem.resourcesDirectory;
			// var dirFullPath = Titanium.Filesystem.resourcesDirectory+'main/';			
		}	

		var dir = Titanium.Filesystem.getFile(dirFullPath);
		var dirItems = dir.getDirectoryListing();
		Ti.API.info('Dir:'+dirFullPath);				
		var data = [];
		if (Ti.Platform.osname!='android'){
			// var dirFullPath = Ti.Filesystem.applicationDataDirectory;
			// // // var dirFullPath = Titanium.Filesystem.resourcesDirectory;
			// // var dirFullPath = Titanium.Filesystem.resourcesDirectory+'main/';
			// Ti.API.info('Dir:'+dirFullPath);
			// var dir = Titanium.Filesystem.getFile(dirFullPath);
			// var dirItems = dir.getDirectoryListing();
			// Ti.API.info('Dir:'+dirFullPath);
			
			
			for ( var i=0; i<dirItems.length; i++ ) 
			{
			    var itemFullPath = dirFullPath + dirItems[i].toString();
			    var item = Ti.Filesystem.getFile(itemFullPath);
				var filename_length=item.name.length;
	
			    if(item.name.substr(filename_length-4,4)=='.pde'){
			    // if(item.name.substr(filename_length-3,3)=='.js'){
			    	// data.push({title:item.name, hasChild:true, codeType:'folder', codeFilename:item.name});
			    	data.push({title:item.name, codeType:'sketch', codeFilename:itemFullPath});
			    }
			}
			
			if (data.length==0){
				if (Ti.Platform.osname=='ipad'){
					var samplefiles=['sample_ipad.pde','bouncybubbles_ipad.pde','reflection_ipad.pde','pattern_ipad.pde'];
				} else {
					var samplefiles=['sample.pde','bouncybubbles.pde','reflection.pde','pattern.pde'];
				}
				
				for (var j=0;j<samplefiles.length; j++){
					var fromFile = Ti.Filesystem.getFile(Titanium.Filesystem.resourcesDirectory+'main/sample/'+samplefiles[j] );
					var toFile = Ti.Filesystem.getFile(Titanium.Filesystem.applicationDataDirectory+samplefiles[j] );
					itemFullPath = Titanium.Filesystem.applicationDataDirectory+samplefiles[j]
					if ( fromFile.exists() && (!toFile.exists()) ) {
					    toFile.write( fromFile.read() );
					}
					data.push({title:samplefiles[j], codeType:'sketch', codeFilename:itemFullPath});
				}				
			}
			
			winHost.code_list.tableview = Titanium.UI.createTableView({
				data:data
			});
			
			//建立編輯器畫面
			// winHost.codeEditor.init();
			
			//事件：點選程式碼列表物件
			winHost.code_list.tableview.addEventListener('click', function(e)
			{
				// showIndicator()
				if (e.rowData.codeType)
				{
					switch (e.rowData.codeType) {
						case 'sketch':
							// var fileContent=Ti.Filesystem.getFile(e.rowData.itemFullPath)
							winHost.codeEditor.lodeCode(e.rowData.codeFilename);
							break;
						case 'folder':
							winHost.code_lists.push(winHost.code_list);
							if (levelLength) {
								Ti.API.info('Level:'+levelLength)
							} else {
								levelLength=0;
							}
							winHost.code_lists[levelLength-1].init(levelLength);
							break;						
					}
				}
				// hideIndicator()
			});
	
			if (levelInfo) {
				var win = Titanium.UI.createWindow({
					title:dataLength
				});						
				
				win.add(winHost.code_list.tableview);	
				winHost.navCodeList.open(win,{animated:true});
				
				win.addEventListener('close', function(){
					winHost.code_lists.pop()
					Ti.API.info('closeLevel:'+winHost.code_lists.length)
					if (winHost.code_lists.length = 1) {
						winHost.code_lists.pop();
					}
				})			
			} else {
				winHost.winCodeList.add(winHost.code_list.tableview);
				winHost.winCodeList.addEventListener('close',function(){
					winHost.code_lists.pop()
				})
			}
		} else {
			//Android:建立檔案清單，並放在option box
			var optionList=[]
			for ( var i=0; i<dirItems.length; i++ ) 
			{
			    var itemFullPath = dirFullPath + dirItems[i].toString();
			    var item = Ti.Filesystem.getFile(itemFullPath);
				var filename_length=item.name.length;
				
				Ti.API.info('Filename:'+item.name);
							
			    if(item.name.substr(filename_length-4,4)=='.pde'){
			    // if(item.name.substr(filename_length-3,3)=='.js'){
			    	// data.push({title:item.name, hasChild:true, codeType:'folder', codeFilename:item.name});
			    	Ti.API.info('Filename:'+item.name+'  --  codeFilename:'+itemFullPath);
			    	data.push({title:item.name, codeType:'sketch', codeFilename:itemFullPath});
			    	optionList.push(item.name);
			    }
			}
			
			if (data.length==0){
				var optionList=['sample.pde','bouncybubbles.pde','reflection.pde','pattern.pde'];
				for (var j=0;j<optionList.length; j++){				
				
					var fromFile = Ti.Filesystem.getFile(Titanium.Filesystem.resourcesDirectory+'main/sample/'+optionList[j] );
					var toFile = Ti.Filesystem.getFile(dirFullPath+optionList[j] );
					itemFullPath = dirFullPath+optionList[j]
					if ( fromFile.exists() && (!toFile.exists()) ) {
					    toFile.write( fromFile.read() );
					}
					data.push({title:optionList[j], codeType:'sketch', codeFilename:itemFullPath});					
				}				
			}
						
		    var fileList=Ti.UI.createOptionDialog({
				options:optionList,
				title:'Sketches'
		    })
		    fileList.show()
		    fileList.addEventListener('click',function(e){
		    	winHost.codeEditor.lodeCode(data[e.index].codeFilename);
		    	winHost.codeEditor.codeBox.color='#fff'
		    })		
		}
	};

})();
