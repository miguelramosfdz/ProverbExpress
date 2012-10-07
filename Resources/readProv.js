
//read proverb.txt and return arr_prov array
//arr_prov[0~4][0(e)~1(c)]

// delete save.txt 
function init(){
	var file2 = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, "save.txt");
    
    if (file2.exists()){ file2.deleteFile(); };
    
    file2 = null;
};

function readProv(fn){
	var file = Ti.Filesystem.getFile(Ti.Filesystem.resourcesDirectory, fn);
	var blob = file.read();
	var str = blob.getText();
	var arr = str.split('\n');
	var arr0 = [[]];
	var arr1 = [[]];
	var arr2 = [[]];
	
	arr0.pop();
	arr1.pop();
	arr2.pop();
	
	for (var i = 0 ; i < arr.length; i+=1){
		if (arr[i] == ''){
			arr.splice(i,1);
		}
	};
	
	for (var i = 0 ; i < arr.length; i+=1){
		if (arr[i].search('#') != -1 ){
			//#1,2,3
			var tmp = parseInt(arr[i].substr(1,1));
			//Ti.API.info(i + '=' + tmp + '\n');
			switch(tmp)
			{
				case 0:
					arr0.push([arr[i+1],arr[i+2]]);
					break;
				case 1:
					arr1.push([arr[i+1],arr[i+2]]);
					break;
				case 2:
					arr2.push([arr[i+1],arr[i+2]]);
					break;
				default:
					break;
			};
		};
	};
	/*
	for(var i = 0; i < arr0.length; i+= 1){
		Ti.API.info(i + '=' + arr0[i][0] + '\n' + arr0[i][1] + '\n');
		Ti.API.info(i + '=' + arr1[i][0] + '\n' + arr1[i][1] + '\n');
		Ti.API.info(i + '=' + arr2[i][0] + '\n' + arr2[i][1] + '\n');
	};
	*/
	//alert('txt=' + blob.getText());

	//label2.setText(blob.getText());
	
	
	file = null;
	blob = null;
	
	return {arr0: arr0, arr1: arr1, arr2: arr2};
};

function saveProv(obj){
	//Ti.API.info(obj.en + ' \n' +  obj.cn);
	var arrJson, msg,
		file = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, "save.txt"),
    	blob;
    	
    	if (!file.exists()){
    		Ti.API.info("fuck file not exist");
    		arrJson = {proverb:[]};
    	} else {
    		arrJson = JSON.parse(file.read());
    	};
    	
    	arrJson.proverb.push(obj);
    	file.write(JSON.stringify(arrJson));
    	
    	file = null;
    	arrJson = null;
    	
    	
    	if (language == 0){
    		//msg = obj.en + '\n' + obj.cn + '\n\n' + 'Proverb saved. Open saved proverb?';
    		msg = 'Proverb saved. Open saved proverb?';
    	} else {
    		msg = '已成功儲存。要打開已存諺語嗎？';
    	}
    	//alert (obj.en + '\n' + obj.cn + '\n\n' + 'Proverb saved.');
    	//ar reply = confirm(obj.en + '\n' + obj.cn + '\n\n' + 'Proverb saved.\nOpen saved proverb?');
    	var dialog = Ti.UI.createAlertDialog({
		    cancel: 1,
		    buttonNames: ['Ok', 'No'], 
		    message: msg,
		    title: (language == 0) ? 'Save' : '存檔'
		});
		dialog.addEventListener('click', function(e){
		  	if (e.index == 0){
		  		showSavedProverb();
		  		/*
		  		file = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, "save.txt"),
			    blob = JSON.parse(file.read());
			    for (var i = 0; i < blob.proverb.length; i+= 1){
			    	Ti.API.info('org cat ' + i + ' = ' + blob.proverb[i].en + ' \n' + blob.proverb[i].cn + ' \n');
			    };
			    */
	    	};
		});	
		dialog.show();	
};

function showSavedProverb(){
	var parentView = Ti.UI.createView({
		backgroundColor: '#666',	// picked color defined in app.js
		//borderRadius: 10,
		height: 480,
		width: 320,
		top: 0,
		left:0
	});
	win1.add(parentView);
	
	var tblView = Ti.UI.createTableView({
		backgroundColor: 'white',
		objName: 'table',
		//borderRadius: 5,
		height: 380,
		width: 300,
		top: 10,
		left: 10,
		rowHeight: 'auto'
	});
		//dismiss button
	var btnBack = Ti.UI.createButton({
			title: 'OK',
			borderRadius: 5,
			left: 30,
			top: 400,
			width: 260,
			height: 40
	});

	var delRow = 0,
		delRowID = 0,
		arr = [],
		file = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, "save.txt"),
    	blob = JSON.parse(file.read());

	parentView.add(tblView);
	parentView.add(btnBack);
	
	btnBack.addEventListener('click', function(){
		Ti.API.info('OK button pressed. Removing parent view...');
		file = null;
		blob = null;
		//tblView.setData([]);
		//arr = [];
		win1.remove(parentView);
		//pool.clean(parentView);
		var _window = Ti.UI.createWindow();
		_window.add(parentView);
       // _window.hide();
       // _window.open();
        _window.close();
		//parentView = null;
	});

	
	for (var i=0; i < blob.proverb.length; i+= 1){
		var row = Ti.UI.createTableViewRow({
			backgroundColor: (i%2==0) ? '#6ef' : '#ff6',
			rowID: i,
			//hasChild: true,
			//className: 'proverb-row'
		});
				//title label
		var titleLabel = Ti.UI.createLabel({
			rowID: i,
			//text: blob.proverb[i].en,
			text: blob.proverb[i].en + '\n\n' + blob.proverb[i].cn,
			font: {fontSize: 18},
			textAlign: Ti.UI.TEXT_ALIGNMENT_LEFT,
			color: '#000',
			left: 20,
			top: 5,
			height: 'auto',
			width: 'auto'
		});
		row.add(titleLabel);
		
		var descriptionLabel = Ti.UI.createLabel({
			rowID: i,
			text: blob.proverb[i].cn,
			font: {fontSize: 14, fontWeight: 'normal'}, 
			textAlign: Ti.UI.TEXT_ALIGNMENT_LEFT,
			color: '#444',
			left: 20, 
			top: 50, 
			height: 'auto', 
			width: 'auto'
		});
		//row.add(descriptionLabel);
		
		var iconImage = Ti.UI.createImageView({
			image: 'image/labelicon.jpg',
			width: 50, 
			height: 50, 
			left: 10,
			top: 10
		});
		//row.add(iconImage);
		
		arr.push(row);
		//tblView.add(row);
	};
	tblView.data = arr;
	
	tblView.addEventListener('click', function(e){
		//Ti.API.info("=====" + typeof(e.source.rowID));
		delRowID = e.source.rowID;
		Ti.API.info("===== delRowID = " + delRowID);
		if ((delRow = whichRow(arr, delRowID)) == -1){
			 return;
		};
		Ti.API.info("===== delRow = " + delRow);
		Ti.API.info("===== delRowID = " + delRowID);
		if (language == 0){
    		//msg = obj.en + '\n' + obj.cn + '\n\n' + 'Proverb saved. Open saved proverb?';
    		msg = 'Delete this proverb?';
    	} else {
    		msg = '刪除此條諺語嗎？';
    	}
    	//alert (obj.en + '\n' + obj.cn + '\n\n' + 'Proverb saved.');
    	//ar reply = confirm(obj.en + '\n' + obj.cn + '\n\n' + 'Proverb saved.\nOpen saved proverb?');
    	var dialog = Ti.UI.createAlertDialog({
		    cancel: 1,
		    buttonNames: ['Yes', 'No'], 
		    message: msg,
		    title: (language == 0) ? 'Alert' : '警告'
		});
		dialog.addEventListener('click', function(e){
		  	if (e.index == 0){
				blob.proverb.splice(delRow,1);
    			file.write(JSON.stringify(blob));
    			tblView.deleteRow(delRow);
    			
    			arr.splice(delRow,1);    			
    			Ti.API.info("===== deleting  arr...tblView.data.length=" + tblView.data.length );
    			Ti.API.info("===== deleting  arr...arr.length=" + arr.length );
    			Ti.API.info("===== deleting  arr...blob.proverb.length=" + blob.proverb.length );
			};
		});
		dialog.show();
	});
};

