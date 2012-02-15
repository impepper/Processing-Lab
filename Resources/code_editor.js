(function(){
	winHost.codeEditor={};
	winHost.codeEditor.fontSize = 18;
	var tmpvalue = 0; 
	var tmpvalue =  0;
	var tmpgap =  0;
	var tmpsize =  0;
	var tmpfontsize =  0;

	
	winHost.codeEditor.winEditor = Titanium.UI.createWindow({
	    title:'Sketch Editor',
	    backgroundColor:'#4a545e',
	    top:0,
	    // orientationModes:[	Titanium.UI.LANDSCAPE_LEFT,	Titanium.UI.LANDSCAPE_RIGHT,]
	});
	
	tmpvalue =   (Ti.Platform.osname=='ipad') ? 43 : 23;
	winHost.codeEditor.viewHeader = Titanium.UI.createView({
	    backgroundColor:'#acacac',
	    top:0,
	    height:tmpvalue
	});
	
	tmpfontsize =   (Ti.Platform.osname=='ipad') ? 24 : 14;
	winHost.codeEditor.header = Titanium.UI.createLabel({
	    text:'Processing Lab',
		font:{fontSize:tmpfontsize, fontStyle:'italic'},
		top:0,
		textAlign:'center'	    
	});
	
	winHost.codeEditor.viewHeader.add(winHost.codeEditor.header)
	
	winHost.codeEditor.viewHelp = Ti.UI.createWebView({url:'http://processinglab.fuihan.com'});
	
	winHost.codeEditor.codeBox= Ti.UI.createTextArea({
		backgroundColor:'#333',
		font:{fontSize:winHost.codeEditor.fontSize},
		Color:'#ddd',
		top:0,
		bottom:0,
		left:0,
		right:0,
		appearance:Titanium.UI.KEYBOARD_APPEARANCE_DEFAULT,
    	keyboardType : Titanium.UI.KEYBOARD_DEFAULT,	
		autocapitalization : Titanium.UI.TEXT_AUTOCAPITALIZATION_NONE,
		suppressReturn:false	
	})
	
	tmpvalue =   (Ti.Platform.osname=='ipad') ? 113 : 58;
	winHost.codeEditor.scrollView = Ti.UI.createScrollView({
		top:tmpvalue,
		bottom:0,
		backgroundColor:'#333',	
		contentHeight:'auto',
		contentWidth:'auto'
	});
	
	winHost.codeEditor.codeBox.addEventListener('pinch',function(e){
		winHost.codeEditor.fontSize = Math.round(winHost.codeEditor.codeBox.font['fontSize']+(e.scale-1)*2);
		if (winHost.codeEditor.fontSize<10){winHost.codeEditor.fontSize=10};
		if (winHost.codeEditor.fontSize>40){winHost.codeEditor.fontSize=40};
		winHost.codeEditor.codeBox.font={fontSize:winHost.codeEditor.fontSize};
	})
	
	winHost.codeEditor.scrollView.add(winHost.codeEditor.codeBox)
	
	winHost.codeEditor.processingRun = Ti.UI.createButton({
	})
	winHost.codeEditor.processingRun.backgroundImage =  ((Ti.Platform.osname=='ipad') || (Ti.Platform.osname=='android')) ? 'images/processing_run.png' : 'images/processing_run_s.png';
	winHost.codeEditor.processingRun.backgroundFocusedImage =  ((Ti.Platform.osname=='ipad') || (Ti.Platform.osname=='android')) ? 'images/processing_run_on.png' : 'images/processing_run_on_s.png';
	winHost.codeEditor.processingRun.backgroundDisabledImagev =  ((Ti.Platform.osname=='ipad') || (Ti.Platform.osname=='android')) ? 'images/processing_run_off.png' : 'images/processing_run_off_s.png';
	winHost.codeEditor.processingRun.top = (Ti.Platform.osname=='ipad') ? 53 : 28;
	winHost.codeEditor.processingRun.left = ((Ti.Platform.osname=='ipad') || (Ti.Platform.osname=='android')) ? 15 : 10;
	winHost.codeEditor.processingRun.width = ((Ti.Platform.osname=='ipad') || (Ti.Platform.osname=='android')) ? 50 : 25;
	winHost.codeEditor.processingRun.height = ((Ti.Platform.osname=='ipad') || (Ti.Platform.osname=='android')) ? 50 : 25;
	if (Ti.Platform.osname=='android'){winHost.codeEditor.processingRun.top=4}
	
	winHost.codeEditor.processingRun.addEventListener('click',function(){
		winHost.codeEditor.codeBox.blur();
		
		if (winHost.codeEditor.processingRun.enabled==true){
			winHost.codeEditor.processingRun.enabled=false;
			winHost.codeEditor.processingRun.backgroundImage =  ((Ti.Platform.osname=='ipad') || (Ti.Platform.osname=='android')) ? 'images/processing_run_on.png' : 'images/processing_run_on_s.png';
			winHost.codeEditor.processingStop.enabled=true;
		}

		var toFile = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory+'tmp/main.pde' );
		
		if (toFile.exists()){
			toFile.deleteFile();
		} 
		toFile.write( winHost.codeEditor.codeBox.value );
		
		tmpvalue =   (Ti.Platform.osname=='ipad') ? 113 : 58;
		winHost.codeEditor.winExecution = Ti.UI.createWindow({
			url:'main/libraries/iprocessingwin.js',
			backgroundColor:'#000',
			top:tmpvalue,
		})
		
		if (winHost.codeEditor.processingFullScreen.status===true){
			//Running in FullScreen Mode, iOS devices only
			winHost.codeEditor.winExecution.top=0;	
			winHost.codeEditor.winExecution.open({fullscreen: true});
		} else {
			//runniong in View Mode, Android device will open in fullscreen
			if (Ti.Platform.osname!='android'){
				winHost.codeEditor.winExecution.top= (Ti.Platform.osname=='ipad') ? 113 : 58;;
				winHost.codeEditor.winEditor.add(winHost.codeEditor.winExecution);
				winHost.codeEditor.winExecution.open();				
			} else {
				// winHost.codeEditor.winExecution.top= (Ti.Platform.osname=='ipad') ? 113 : 58;;
				winHost.codeEditor.winExecution.open({fullscreen:true, NavBarHidden:true});				
			}			

		}
		
	})
	
	winHost.codeEditor.processingStop = Ti.UI.createButton({
	})
	winHost.codeEditor.processingStop.backgroundImage =  ((Ti.Platform.osname=='ipad') || (Ti.Platform.osname=='android')) ? 'images/processing_stop.png' : 'images/processing_stop_s.png';
	winHost.codeEditor.processingStop.backgroundFocusedImage =  ((Ti.Platform.osname=='ipad') || (Ti.Platform.osname=='android')) ? 'images/processing_stop_on.png' : 'images/processing_stop_on_s.png';
	winHost.codeEditor.processingStop.backgroundDisabledImagev =  ((Ti.Platform.osname=='ipad') || (Ti.Platform.osname=='android')) ? 'images/processing_stop_off.png' : 'images/processing_stop_off_s.png';
	winHost.codeEditor.processingStop.top = (Ti.Platform.osname=='ipad') ? 53 : 28;
	winHost.codeEditor.processingStop.left = ((Ti.Platform.osname=='ipad') || (Ti.Platform.osname=='android')) ? 75 : 45;
	winHost.codeEditor.processingStop.width = ((Ti.Platform.osname=='ipad') || (Ti.Platform.osname=='android')) ? 50 : 25;
	winHost.codeEditor.processingStop.height = ((Ti.Platform.osname=='ipad') || (Ti.Platform.osname=='android')) ? 50 : 25;
	if (Ti.Platform.osname=='android'){winHost.codeEditor.processingStop.top=4};
		
	winHost.codeEditor.processingStop.addEventListener('click',function(){
		winHost.codeEditor.codeBox.blur();
		if (winHost.codeEditor.processingRun.enabled==false){
			winHost.codeEditor.processingRun.enabled=true;
			winHost.codeEditor.processingRun.backgroundImage =  ((Ti.Platform.osname=='ipad') || (Ti.Platform.osname=='android')) ? 'images/processing_run.png' : 'images/processing_run_s.png';
	
			if (winHost.codeEditor.processingFullScreen.status===true){
				//Running in FullScreen Mode
				if (Ti.Platform.osname!='android'){
					winHost.codeEditor.winEditor.close(winHost.codeEditor.winExecution);
				} else {
					winHost.codeEditor.winExecution.close();
				}
						
			} else {
				//runniong in View Mode
				if (Ti.Platform.osname!='android'){
					winHost.codeEditor.winExecution.close();
					winHost.codeEditor.winEditor.remove(winHost.codeEditor.winExecution);
				} else {
					winHost.codeEditor.winExecution.close();
				}
			}				
		}	
	})
	
	winHost.codeEditor.processingOpen = Ti.UI.createButton({
	})		
	winHost.codeEditor.processingOpen.backgroundImage =  ((Ti.Platform.osname=='ipad') || (Ti.Platform.osname=='android')) ? 'images/processing_open.png' : 'images/processing_open_s.png';
	winHost.codeEditor.processingOpen.backgroundFocusedImage =  ((Ti.Platform.osname=='ipad') || (Ti.Platform.osname=='android')) ? 'images/processing_open_on.png' : 'images/processing_open_on_s.png';
	winHost.codeEditor.processingOpen.backgroundDisabledImagev =  ((Ti.Platform.osname=='ipad') || (Ti.Platform.osname=='android')) ? 'images/processing_open_off.png' : 'images/processing_open_off_s.png';
	winHost.codeEditor.processingOpen.top = (Ti.Platform.osname=='ipad') ? 53 : 28;
	winHost.codeEditor.processingOpen.left = ((Ti.Platform.osname=='ipad') || (Ti.Platform.osname=='android')) ? 160 : 80;
	winHost.codeEditor.processingOpen.width = ((Ti.Platform.osname=='ipad') || (Ti.Platform.osname=='android')) ? 50 : 25;
	winHost.codeEditor.processingOpen.height = ((Ti.Platform.osname=='ipad') || (Ti.Platform.osname=='android')) ? 50 : 25;
	if (Ti.Platform.osname=='android'){winHost.codeEditor.processingOpen.top=4}
		
	winHost.codeEditor.processingOpen.addEventListener('click',function(){
	
		winHost.codeEditor.codeBox.blur();
		if (Ti.Platform.osname=='ipad'){
			var popover = Ti.UI.iPad.createPopover({height:winHost.orientationHeight,width:250});
			popover.add(winHost.navCodeList);
			popover.show({view:winHost.codeEditor.processingOpen});
		}
		if ((Ti.Platform.osname=='iphone') || (Ti.Platform.osname=='ipod')){
			winHost.code_list.init();
			winHost.winCodeList.navBarHidden = false;
			winHost.navCodeList.open(winHost.winCodeList,{animated:true});
		}
		if (Ti.Platform.osname=='android'){
			winHost.code_list.init();
		}		
	})
	
	winHost.codeEditor.help = Ti.UI.createButton({
	})		
	winHost.codeEditor.help.backgroundImage =  ((Ti.Platform.osname=='ipad') || (Ti.Platform.osname=='android')) ? 'images/lightbulb.png' : 'images/lightbulb_s.png';
	winHost.codeEditor.help.top = (Ti.Platform.osname=='ipad') ? 58 : 31;
	winHost.codeEditor.help.right = ((Ti.Platform.osname=='ipad') || (Ti.Platform.osname=='android')) ? 15 : 10;
	winHost.codeEditor.help.width = ((Ti.Platform.osname=='ipad') || (Ti.Platform.osname=='android')) ? 40 : 20;
	winHost.codeEditor.help.height = ((Ti.Platform.osname=='ipad') || (Ti.Platform.osname=='android')) ? 40 : 20;
	if (Ti.Platform.osname=='android'){winHost.codeEditor.help.top=9}
	
	winHost.codeEditor.help.addEventListener('click',function(){
		winHost.codeEditor.codeBox.blur();	
		var w = Ti.UI.createWindow({
			title:'About Info.',
			backgroundColor:'#000'
		});
		
		var b = Ti.UI.createButton({
			title:'Close',
			width:100,
			height:30
		});
		
		b.addEventListener('click',function(){
			w.close();
		});
		w.rightNavButton=b;
				
		w.add(winHost.codeEditor.viewHelp);
		w.open({modal:true});		
	})
	
	tmpfontsize =   (Ti.Platform.osname=='ipad') ? 20 : 10;
	winHost.codeEditor.processingFullScreen = Ti.UI.createLabel({
		text:'View Mode',
		font:{fontSize:tmpfontsize },
		color:'white',
		textAlign:'center',
		borderWidth:1,
		borderColor:'white',
		status:false
	})
	winHost.codeEditor.processingFullScreen.top = (Ti.Platform.osname=='ipad') ? 58 : 31;
	winHost.codeEditor.processingFullScreen.right = ((Ti.Platform.osname=='ipad') || (Ti.Platform.osname=='android')) ? 85 : 42;
	winHost.codeEditor.processingFullScreen.width = ((Ti.Platform.osname=='ipad') || (Ti.Platform.osname=='android')) ? 200 : 100;
	winHost.codeEditor.processingFullScreen.height = ((Ti.Platform.osname=='ipad') || (Ti.Platform.osname=='android')) ? 40 : 20;
	if (Ti.Platform.osname=='android'){winHost.codeEditor.processingFullScreen.top=9}
	
	
	winHost.codeEditor.processingFullScreen.addEventListener('click',function(e){
		winHost.codeEditor.codeBox.blur();
		if (e.source.status===true){
			e.source.status = false;
			e.source.text='View Mode';
		} else {
			e.source.status = true;
			e.source.text='FullScreen Mode';
		}
	})
	
	winHost.codeEditor.init = function(){
		if (Ti.Platform.osname!='android'){
			winHost.codeEditor.winEditor.add(winHost.codeEditor.viewHeader);
			winHost.codeEditor.winEditor.add(winHost.codeEditor.scrollView);
			winHost.codeEditor.winEditor.add(
				winHost.codeEditor.processingRun,
				winHost.codeEditor.processingStop,
				winHost.codeEditor.processingOpen,
				winHost.codeEditor.processingFullScreen,
				winHost.codeEditor.help
			);
			winHost.winCodeEditor.add(winHost.codeEditor.winEditor);			
		} else {
			winHost.codeEditor.winEditor.add(winHost.codeEditor.scrollView);
			winHost.codeEditor.winEditor.add(winHost.codeEditor.processingRun);
			winHost.codeEditor.winEditor.add(winHost.codeEditor.processingStop);
			winHost.codeEditor.winEditor.add(winHost.codeEditor.processingOpen);
			winHost.codeEditor.winEditor.add(winHost.codeEditor.help);
		}
	};
	
	winHost.codeEditor.lodeCode = function(sketch_filename){
		Ti.API.info('Sketchload Loaded:'+sketch_filename);
		var fileContent=Ti.Filesystem.getFile(sketch_filename)
		winHost.codeEditor.codeBox.value=fileContent.read()+'\n\n\n\n\n\n\n\n\n\n\n';
	};
		
})();