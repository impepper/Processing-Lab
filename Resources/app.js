winHost = {};
winHost.orientationHeight = 500;
Ti.include('code_list.js','code_editor.js','app_functions.js');

// WINDOWS
winHost.winMain = Ti.UI.createWindow();

winHost.winCodeEditor = Ti.UI.createWindow({title:'Code Editor',navBarHidden:true});

// MASTER NAV GROUP
winHost.code_lists = [];

if (Ti.Platform.osname!='android'){
	winHost.winCodeList = Ti.UI.createWindow({title:'Sketches'});
	
	winHost.navCodeList = Ti.UI.iPhone.createNavigationGroup({
		window:winHost.winCodeList
	});
	
	winHost.winCodeList.addEventListener("open",function(){
		Ti.API.info('hello World')
		winHost.code_lists.push(winHost.code_list);
		winHost.code_lists[0].init();
	});

}


// winHost.listWindow = Ti.API.create
winHost.open = function(){
	Ti.API.info('in open for split view nav')
	// winHost.splitView.open();
	
	if (Ti.Platform.osname == 'ipad'){
		winHost.winCodeEditor.open();
	}
	if ((Ti.Platform.osname == 'ipod') || (Ti.Platform.osname == 'iphone')){
		winHost.code_list.init();
		winHost.winMain.add(winHost.navCodeList)
		winHost.navCodeList.close(winHost.winCodeList);
		winHost.navCodeList.open(winHost.winCodeEditor);
		winHost.winMain.open();		
	}
	if (Ti.Platform.osname=='android'){	
		// winHost.winCodeEditor.open();
		winHost.codeEditor.winEditor.open()
	}	
	
		
};

winHost.codeEditor.init();

var folderDir=Titanium.Filesystem.applicationDataDirectory+'tmp';
Ti.API.info('appFolder:'+folderDir);
var folder =Titanium.Filesystem.getFile(folderDir);
if(!folder.exists()){
    folder.createDirectory(); 
}

winHost.open();

if (Ti.Platform.osname!='android'){
	Ti.Gesture.addEventListener('orientationchange',function(){
		if ((Titanium.UI.getOrientation() == Titanium.UI.PORTRAIT) || (Titanium.UI.getOrientation() == Titanium.UI.UPSIDE_PORTRAIT)){
			winHost.orientationHeight = 700;
		} else {
			winHost.orientationHeight = 500;
		}
		winHost.codeEditor.codeBox.left=0;
		winHost.codeEditor.codeBox.right=0;
})	
}


