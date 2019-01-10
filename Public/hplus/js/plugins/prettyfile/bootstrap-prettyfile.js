/*
 * jQuery and Bootsrap3 Plugin prettyFile
 *
 * version 2.0, Jan 20th, 2014
 * by episage, sujin2f
 * Git repository : https://github.com/episage/bootstrap-3-pretty-file-upload
 */
( function( $ ) {
	$.fn.extend({
		prettyFile: function( options ) {
			var defaults = {
				text : "选择文件",
				ext : "",
				errorMsg : "文件格式不正确"
			};

			var options =  $.extend(defaults, options);
			var plugin = this;

			function make_form( $el, text ) {
				$el.wrap('<div></div>');
				$el.hide();
				var required = "";
				if ($el.prop("required") == true || $el.prop("required") == "true") {
					required = ' required="true" ';
				}
				var name = "file_" + $el.attr("name");
				//设置默认路劲
				var path = $el.attr("data-path") + "";
				path = path == "undefined" ? "" : path;
				$el.after( '\
				<div class="input-append input-group"">\
					<span class="input-group-btn">\
						<button class="btn btn-white" type="button">' + text + '</button>\
					</span>\
					<input readOnly="readOnly" name="' + name + '" class="input-large form-control" type="text" ' + required + ' data-file="1" value="' + path + '">\
				</div>\
				' );

				return $el.parent();
			};

			function bind_change( $wrap, multiple ) {
				$wrap.find( 'input[type="file"]' ).change(function () {
					// When original file input changes, get its value, show it in the fake input
					var files = $( this )[0].files,
					info = '';

					if ( files.length == 0 )
						return false;

					if ( !multiple || files.length == 1 ) {
						var filepath = $( this ).val().split('\\');
						var filaname = filepath[filepath.length - 1];
						//获取文件后缀
						var extArr = filaname.split('.');
						var ext =  extArr[extArr.length - 1].toUpperCase();
						var exts = options.ext.toUpperCase().split(',');
						if (exts.indexOf(ext) < 0) {
							$(this).val("");
							info = "";
			                swal({
			                    title: options.errorMsg,
			                    timer: 1000,
			                    showConfirmButton: false,
			                    type:"error"
			                });
							return;
						}
						else
						{
							info = filaname;	
						}
					}
					else if ( files.length > 1 ) {
						// Display number of selected files instead of filenames
						info = "已选择了" + files.length + ' 个文件';
					}

					$wrap.find('.input-append input').val( info );
				});
			};

			function bind_button( $wrap, multiple ) {
				$wrap.find( '.input-append' ).click( function( e ) {
					e.preventDefault();
					$wrap.find( 'input[type="file"]' ).click();
				});
			};

			return plugin.each( function() {
				$this = $( this ); 
				if ( $this ) {
					var multiple = $this.attr( 'multiple' ); 
					$wrap = make_form( $this, options.text );
					bind_change( $wrap, multiple );
					bind_button( $wrap );
				}
			});
		}
	});
}( jQuery ));

