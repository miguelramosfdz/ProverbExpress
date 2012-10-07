// this sets the background color of the master UIView (when there are no windows/tab groups on it)
//Titanium.UI.setBackgroundColor('#f00');
Ti.include('color_picker.js');
Ti.include('readProv.js');
Ti.include('splash.js');

//splash();
// create base UI tab and root window
//

var win1 = Ti.UI.createWindow({
 		//title : 'Lucky Proverb',
 		width: 320,
 		height: 480,
 		navBarHidden:true,
 		backgroundColor: '#279',
 		borderRadius: 20,
});

//init();
splash(win1);
/*
if (Ti.Platform.osname == 'android')
{
	//Ti.App.addEventListener('android:back', function() 
    win1.addEventListener('android:back', function() 
    {
    	Ti.API.info(' back button pressed...!');
        //mainNS.event.loadBackScreenHandler();
        win1.close(); 
    });
};
*/

var fn = 'txt/proverbs.txt';
var f, arr0, arr1, arr3, rand, language=0, bBegan=false, startX, objSave, pColor = '#f00';
var str_cn = '請選一個喜歡的顏色，看看您的幸運箴言有那些。\n\n右滑改語言，左滑儲存。',
    str_en = 'Pick a color for lucky proverb. \nSwipe right to change language, left to save.',
    file = Ti.Filesystem.getFile(Ti.Filesystem.resourcesDirectory, "wav/2.mp3"),
    media = file.nativePath,
    player = Ti.Media.createSound({url: media});    

arr_all = readProv(fn);
arr0 = arr_all.arr0;
arr1 = arr_all.arr1;
arr2 = arr_all.arr2;

//win1.backgroundImage = 'graph/background.png';
win1.addEventListener('e_ani_done', function(){
	//alert('fuck');
	
	createColorPicker({hexColor:"#621A84", w: win1});
	
	win1.addEventListener("colorselect", function(e){
		pColor = '#' + rgbToHex(e.rgbColor);
		player.play();
		if (!bBegan) { bBegan = true};
		
		rand = Math.floor(Math.random() * arr0.length);
		label2.setText(arr0[rand][language]);
		
	});
	
	var label2 = Ti.UI.createLabel({
	  color:'white',
	  font: {fontSize:24},
	  text: str_en,
	  textAlign: Ti.UI.TEXT_ALIGNMENT_LEFT,
	  top: 20,
	  bottom: 20,
	  width: '90%', 
	  height: 'auto',
	  //text: 'fuck!!!'
	 
	});
	
	var scrollView = Ti.UI.createScrollView({
	  showVerticalScrollIndicator: true,
	  showHorizontalScrollIndicator: false,
	  scrollType: 'vertical',
	  layout: 'vertical',
	  backgroundImage: 'graph/mypic8.png',
	  height: '150',
	  width: '300',
	  top: 20,
	  borderRadius: 10,
	  opacity: 0.5
	});
	
	scrollView.addEventListener('touchstart', function(e){
		startX = e.x;
	});
	
	scrollView.addEventListener('touchend', function(e){
		//alert('startX=' + startX + 'endX = ' + e.x);
		
		if (e.x > startX){
			Ti.API.info('=== right ===');
			language = (language == 0) ? 1 : 0;
			if (bBegan){
				label2.setText(arr0[rand][language]);
			} else {
				label2.setText((language == 0) ? str_en : str_cn);
			};
		} else {
			if (bBegan){
				objSave = {en: arr0[rand][0], cn: arr0[rand][1]};
				Ti.API.info('=== left ===');
				saveProv(objSave);
			};
		};	
		
	});
	
	// open tab group
	scrollView.add(label2);
	win1.add(scrollView);
	win1.open(); 

});

function whichRow(arr, ID){
	for (var i = 0; i < arr.length; i+= 1){
		if (arr[i].rowID == ID){
			return i;
		};
	};
	return -1;
};

var MemoryPool = function() {
    var _window;

    this.init = function() {
    	Ti.API.info('==== init called ====');
        _window = Ti.UI.createWindow();
        _window.hide();
        _window.open();
    }
    // This is where we clear out the memPool by closing it then reopening it again.
    this.clean = function(obj) {
    	Ti.API.info('==== clean called ====');
        if(obj instanceof Array) {
            var arLen=obj.length;
            for ( var i=0, len=arLen; i<len; ++i ) {
                // We then stick the entire view into the pool
                _window.add(obj[i]);
            }
        } else {
            // We then stick the entire view into the pool
            _window.add(obj);
        }
        Ti.API.info('Cleaning MemoryPool.');
 
        // We empty the pool by closing it.
        _window.close();
 
        // We recreate the window again for the next object
        this.init();
    };
    this.init();
};

var pool = new MemoryPool(); // pool for mem release