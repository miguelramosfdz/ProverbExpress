// splash screen
function splash(w){
	//Ti.UI.setBackgroundColor('#fff');

	var rootView = Ti.UI.createView({
		width: 'auto',
		height: 'auto'
	});

	var imageViewMe = Ti.UI.createImageView({
		image: 'graph/background.png',
		width: 320,
		height: 480,
		//top: 0,
		opacity: 1
		//zIndex: 0,
		//left: 0
	});
	
	var win1 = w;
	win1.add(imageViewMe);
	
	var labelView = Ti.UI.createView({
		width: 260,
		height: 150,
		top: 300,
		opacity: 0.2,	
		backgroundImage: 'graph/word0.png'
	});

	rootView.add(imageViewMe);
	rootView.add(labelView);
	win1.add(rootView);

	win1.open();
	
	var ani = Ti.UI.createAnimation({
		duration: 3000, 
		opacity: 1,
	});
	
	var ani2 = Ti.UI.createAnimation({
		duration: 2000, 
		opacity: 1,
	});
	
	labelView.animate(ani);
	//imageViewMe.animate(ani2);

	ani.addEventListener('complete', function(e){
		Ti.API.info('======ani2 finished...' + e.source);
	
		win1.remove(rootView);
		//rootView = null;
		var _window = Ti.UI.createWindow();
		_window.add(rootView);
        //_window.hide();
        //_window.open();
        _window.close();
		//pool.clean(rootView);
			
		win1.fireEvent('e_ani_done');
	});
};
