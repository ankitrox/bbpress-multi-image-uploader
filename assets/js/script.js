/**
 * Plugin JS
 */
jQuery(document).ready(function() {

	var uploader = new plupload.Uploader(bbp_plupload_obj);

	  // checks if browser supports drag and drop upload, makes some css adjustments if necessary
      uploader.bind('Init', function(up){
        var uploaddiv = jQuery('#plupload-upload-ui');

        if(up.features.dragdrop){
          uploaddiv.addClass('drag-drop');
            jQuery(bbp_uploader_config.drag_drop_area)
              .bind('dragover.wp-uploader', function(){ uploaddiv.addClass('drag-over'); })
              .bind('dragleave.wp-uploader, drop.wp-uploader', function(){ uploaddiv.removeClass('drag-over'); });

        }else{
          uploaddiv.removeClass('drag-drop');
          jQuery(bbp_uploader_config.drag_drop_area).unbind('.wp-uploader');
        }
      });

	uploader.init();

	      // a file was added in the queue
      uploader.bind('FilesAdded', function(up, files){
        var hundredmb = 100 * 1024 * 1024, max = parseInt(up.settings.max_file_size, 10);

        plupload.each(files, function(file){
          if (max > hundredmb && file.size > hundredmb && up.runtime != 'html5'){
            // file size error?
          }else{

            // a file was added, you may want to update your DOM here...
            //console.log(file);
          }
        });

        up.refresh();
        up.start();
      });

	// a file was uploaded 
	uploader.bind('FileUploaded', function(up, file, response) {

	  // this is your ajax response, update the DOM with it or something...
	  var data = JSON.parse(response.response);

	  if( data.error === false ) {

		  var markup = bbp_uploader_config.img_container_markup;
		  markup = markup.replace( '%attachment-thumb%', data.url_thumb );
		  markup = markup.replace( '%attachment-full%', data.url_full );
		  markup = markup.replace( '%attachment-alt%', data.filename );
		  markup = markup.replace( '%attachment-id%', data.attid );

		  jQuery(bbp_uploader_config.bbp_uploader_img_container).append(markup);

	  }

	});

	/**
	 * Filesadded Event.
	 */
	uploader.bind('FilesAdded', function(up, files) {

		jQuery.each( files, function( index, file ){
			jQuery(bbp_uploader_config.bbp_files_queue).append('<div id="' + file.id + '">' + file.name + ' (' + plupload.formatSize(file.size) + ') <b></b></div>');
		});
	});

	/**
	 * Uploader progress
	 */
	uploader.bind('UploadProgress', function(up, file) {

		if( jQuery("#"+file.id).length ){
			document.getElementById(file.id).getElementsByTagName('b')[0].innerHTML = '<span>' + file.percent + "%</span>";                             
		}

		if( file.percent >= 100 ) {
			jQuery("#"+file.id).fadeOut(600, function(){
				jQuery("#"+file.id).remove();
			});
		}

		jQuery("#bbp_reply_submit").attr('disabled','disabled');
	});

	/**
	 * When all files in queue are added successfully
	 */
	uploader.bind('UploadComplete', function(up, files) {
		jQuery("#bbp_reply_submit").removeAttr('disabled');
	});

	uploader.bind('Error', function(up, files) {
		jQuery("#bbp_reply_submit").removeAttr('disabled');
	});


	/**
	 * Remove attached image by close button.
	 */
	jQuery('body').on('click', bbp_uploader_config.bbp_uploader_close, function() {
		console.log(jQuery(this));
		jQuery(this).parents(bbp_uploader_config.bbp_img_wrap).remove();
	});

});