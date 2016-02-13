function runAdmin () {
	window.isAdmin = true;
	window.removeElementByButton = function ($modal) {
		if (!$modal instanceof jQuery) {
			$modal = $($modal);
		}
		$modal.on('click', function(e) {

			var $target = $(e.target);

			if ($target.hasClass('remove')) {
				rest.news.splice((+$target.data('index')), 1);
				$target.data('image')
				$modal.removeClass('opened');
				$('#admin-button').trigger('click');
			}

		});
	}
	$('[data-editable]').each(function () {
		$(this)
			.addClass('editable')
			.off('click')
			.on('click', function (e) {
				e.preventDefault();
				$(this).attr('contentEditable', true);
			})
			.on('blur', function (e) {
				var $self = $(this);
				$self.attr('contentEditable', false);
				if (typeof rest[$self.data('editable')] == 'object') {
					var ob = rest[$self.data('editable')];
					if (typeof ob[$self.data('key')] != 'object') {
						ob[$self.data('key')] = {};
					}
					if ($self.attr('href')) {
						ob[$self.data('key')]['href'] = $self.attr('href');
					}
					if ($self.attr('src')) {
						ob[$self.data('key')]['src'] = $self.attr('src');
					}
					if ($self.data('val')) {
						ob[$self.data('key')][$self.data('val')] = $self.html();
					} else {
						ob[$self.data('key')]['name'] = $self.html();
					}
					console.log(ob);
				} else {
					alert('Ошибка! window.[$self.data(editable)] не является объектом')
				}
			});
	});

	var adminMethods = {
		saveData: function (data) {
			$.ajax({
				method: "POST",
				url: domain + "api/admin/data",
				data: {
					data: data
				}
			}).done(function() {
				$( '#admin-saved' ).addClass( "opened" ).on('click', function () {
					window.location.reload();
				});
				setTimeout(function () {
					window.location.reload();
				}, 7000)
			}).fail(function( jqXHR, textStatus ) {
				alert( "Request failed: " + textStatus );
			});
		},
		sendImage: function (file, input) {
			loading.showPreloader();
			var form = new FormData();
			form.append('files[]', file);
			$.ajax({
				method: "POST",
				url: domain + "api/admin/upload",
				cache: false,
				contentType: false,
				processData: false,
				data: form
			}).done(function(data) {
				loading.hidePreloader();
				adminMethods.fillFileInputs(data, input);
				console.log(data);
			}).fail(function( jqXHR, textStatus ) {
				alert( "Ошибка загрузки: " + textStatus );
			});
		},
		deleteImage: function (url) {
			$.ajax({
				method: "POST",
				url: url
			}).done(function() {
				console.log('removed old file');
			}).fail(function( jqXHR, textStatus ) {
				alert( "Ошибка загрузки: " + textStatus );
			});
		},
		fillFileInputs: function (data, input) {
			var $group = $(input).parent(),
				src = data[0]['full_path'],
				delLink = data[0]['path_to_delete'];
				src = domain + src.substring(1);
			$group.find('[name="src"]').val(src);
			$group.find('[name="path_to_delete"]').val(delLink);
		}
	};

	$('#admin-button').on('click', function () {
		adminMethods.saveData(rest);
	});

	function createForm (data) {
		var $modal = $('<div>').addClass( "modal-holder opened" ).attr('id', 'editor-modal'),
			$content = $('<div>').addClass( "modal-content" );
		$content.append(data);
		$modal.append($content);
		$('body').append($modal);
		bodyOverflow.fixBody();
	}
	function createDataForForm (data) {

	}
	$('[data-editable="snippets"]').each(function () {
		var $self = $(this);
		if ( rest[$self.data('editable')] && rest[$self.data('editable')][$self.data('key')] ) {
			var ob = rest[$self.data('editable')][$self.data('key')];
			if (Object.keys(ob).length > 1) {

				for (key in ob) {

					if (key != 'name') {
						$self.attr(key, ob[key])
					} else {
						$self.html( ob[key] );
					}

				}

			} else {

				$self.html( ob['name'] );

			}

		} else if ( rest[$self.data('editable')] ) {

			$self.html( rest[$self.data('editable')]['name'] );

		} else {

			console.log('------------');
			console.log(this);
			console.error('Нет данных');
			console.log('------------');

		}
	});

	// createForm('<h1>test</h1>');
	var $addNew = $('#addNew');
	$addNew.validate();
	$addNew.on('submit', function () {
		var data = {},
			$self = $(this);
		$self.find('[name]').each(function () {
			var $input = $(this);
			data[$input.attr('name')] = $input.val();
		});
		if(rest[$self.data('type')]  instanceof Array )
		{
			rest[$self.data('type')].unshift(data);
			$('#admin-button').trigger('click');
			$addNew.removeClass('opened');
		} else {
			console.error('Увы, у нас на сайте ошибка. Конечный массив не найден.');
		}
	});
	$addNew.find('[type=file]').on('change', function () {
		if (this.files.length) {
			adminMethods.sendImage(this.files[0], this);
			$(this).closest('.error').removeClass('error');
		}
	})
	$addNew.on('click', function(e) {
		if (e.target == this) {
			var $src = $(this).find('[name="path_to_delete"]');
			if ($src.val()) {
				adminMethods.deleteImage($src.val());
				$src.val('');
				$src.closest('.file').addClass('error');
			}
		}
	});
}