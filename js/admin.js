var isAdmin = true;
function runAdmin () {

	if ( location.href.split('?code=').length > 1 ) {
		
		var code = location.href.split('?code=')[1];

		$.ajax({
			method: "GET",
			url: domain + "api/admin/instagram",
			data: {
				code: code
			}
		}).done(function(data) {
			console.log(data);
			// rest[instagram] = data;
		}).fail(function( jqXHR, textStatus ) {
			alert( "Request failed: " + textStatus );
		});
	}

	window.buttonHandlers = function ($modal) {
		console.log($modal);
		if (!$modal instanceof jQuery) {
			$modal = $($modal);
		}
		var $target = $modal.find('button.remove');
		if (!$modal.data('type')) {
			$modal = $modal.find('[data-type]');
		}

		$modal.find('button.remove').on('click', function () {

			var image = $(this).data('image');
			console.warn(image)
			// console.log($target.data('index'));
			// return
			rest[$modal.data('type')].splice((+$target.data('index')), 1);
			if (image) {
				if (image.substring(0,1) == '[') {
					var files = eval( image );
					if (files instanceof Array ) {
						for (var i = 0; i < files.length; i++) {
							adminMethods.deleteImage(files[i]);
						}
					}
				} else {
					adminMethods.deleteImage(image);
				}
			}
			$modal.removeClass('opened').closest('.opened').removeClass('opened');
			// TODO
			$('#admin-button').trigger('click');
			// console.log(rest)

		});

		$modal.find('[type="file"]').on('change', function () {
			if (this.files.length) {
				adminMethods.sendImage(this.files[0], this);
			}
		})
		$modal.find('[data-key]').on('change blur', function () {
			if (this.value) {
				rest[$modal.data('type')][$modal.data('index')][$(this).data('key')] = $(this).val();
				// console.log(rest);
			}
		});

		$modal.find('[type="submit"]').on('click', function () {
			$(this).closest('.opened').removeClass('opened');
			$('#admin-button').trigger('click');
			// console.log(rest);
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
			// console.log(data);
			// return;
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
				}, 5000)
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
				// console.log(data);
			}).fail(function( jqXHR, textStatus ) {
				alert( "Ошибка загрузки: " + textStatus + ". Файл, который Вы пытаетесь загрузить не должен превышать 2mb. Поддерживаемые форматы: '.jpeg, .jpg, .gif, .png'. Рекомендуем не загружать изображения более 1200 пикселей в ширину. ");
				loading.hidePreloader();
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
			$group.find('[name="src"]').val(src).trigger('blur');
			$group.find('[name="path_to_delete"]').val(delLink).trigger('blur');
		}
	};
	window.adminMethods = adminMethods;

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
			rest[$self.data('type')] = [];
			console.warn('Увы, у нас на сайте ошибка. Конечный массив не найден. Но он был только что создан!');
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

	var $addService = $('#addService');
	$addService.validate();
	$addService.on('submit', function () {
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
			$addService.removeClass('opened');
		} else {
			rest[$self.data('type')] = [];
			console.warn('Увы, у нас на сайте ошибка. Конечный массив не найден. Но он был только что создан!');
		}
	});
	$addService.find('[type=file]').on('change', function () {
		if (this.files.length) {
			adminMethods.sendImage(this.files[0], this);
			$(this).closest('.error').removeClass('error');
		}
	})
	$addService.on('click', function(e) {
		if (e.target == this) {
			var $src = $(this).find('[name="path_to_delete"]');
			if ($src.val()) {
				adminMethods.deleteImage($src.val());
				$src.val('');
				$src.closest('.file').addClass('error');
			}
		}
	});

	var $addPartner = $('#addPartner');
	$addPartner.validate();
	$addPartner.on('submit', function () {
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
			$addPartner.removeClass('opened');
		} else {
			rest[$self.data('type')] = [];
			console.warn('Увы, у нас на сайте ошибка. Конечный массив не найден. Но он был только что создан!');
		}
	});
	$addPartner.find('[type=file]').on('change', function () {
		if (this.files.length) {
			adminMethods.sendImage(this.files[0], this);
			$(this).closest('.error').removeClass('error');
		}
	})
	$addPartner.on('click', function(e) {
		if (e.target == this) {
			var $src = $(this).find('[name="path_to_delete"]');
			if ($src.val()) {
				adminMethods.deleteImage($src.val());
				$src.val('');
				$src.closest('.file').addClass('error');
			}
		}
	});

	var $addFeatures = $('#addFeatures');
	$addFeatures.validate();
	$addFeatures.on('submit', function () {
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
			$addFeatures.removeClass('opened');
		} else {
			rest[$self.data('type')] = [];
			console.warn('Увы, у нас на сайте ошибка. Конечный массив не найден. Но он был только что создан!');
		}
	});
	$addFeatures.on('click', function(e) {
		if (e.target == this) {
			var $src = $(this).find('[name="path_to_delete"]');
			if ($src.val()) {
				adminMethods.deleteImage($src.val());
				$src.val('');
				$src.closest('.file').addClass('error');
			}
		}
	});

	var $addPerson = $('#addPerson');
	$addPerson.validate();
	$addPerson.on('submit', function () {
		var data = {},
			$self = $(this);
		$self.find('[name]').each(function () {
			var $input = $(this);
			data[$input.attr('name')] = $input.val();
		});
		if(rest[$self.data('type')] instanceof Array )
		{
			rest[$self.data('type')].unshift(data);
			$('#admin-button').trigger('click');
			$addPerson.removeClass('opened');
		} else {
			rest[$self.data('type')] = [];
			console.warn('Увы, у нас на сайте ошибка. Конечный массив не найден. Но он был только что создан!');
		}
	});
	$addPerson.find('[type=file]').on('change', function () {
		if (this.files.length) {
			adminMethods.sendImage(this.files[0], this);
			$(this).closest('.error').removeClass('error');
		}
	})
	$addPerson.on('click', function(e) {
		if (e.target == this) {
			var $src = $(this).find('[name="path_to_delete"]');
			if ($src.val()) {
				adminMethods.deleteImage($src.val());
				$src.val('');
				$src.closest('.file').addClass('error');
			}
		}
	});

	var $addPersonal = $('#addPersonal');
	$addPersonal.validate();
	$addPersonal.on('submit', function () {
		var data = {},
			$self = $(this);
		$self.find('[name]').each(function () {
			var $input = $(this);
			data[$input.attr('name')] = $input.val();
		});
		if(rest[$self.data('type')] instanceof Array )
		{
			rest[$self.data('type')].unshift(data);
			$('#admin-button').trigger('click');
			$addPersonal.removeClass('opened');
		} else {
			rest[$self.data('type')] = [];
			console.warn('Увы, у нас на сайте ошибка. Конечный массив не найден. Но он был только что создан!');
		}
	});
	$addPersonal.find('[type=file]').on('change', function () {
		if (this.files.length) {
			adminMethods.sendImage(this.files[0], this);
			$(this).closest('.error').removeClass('error');
		}
	})
	$addPersonal.on('click', function(e) {
		if (e.target == this) {
			var $src = $(this).find('[name="path_to_delete"]');
			if ($src.val()) {
				adminMethods.deleteImage($src.val());
				$src.val('');
				$src.closest('.file').addClass('error');
			}
		}
	});

	var $addEmail = $('#addEmail');
	$addEmail.validate();
	$addEmail.on('submit', function () {
		var data = {},
			$self = $(this);
		$self.find('[name]').each(function () {
			var $input = $(this);
			data[$input.attr('name')] = $input.val();
		});
		if(rest[$self.data('type')] instanceof Array )
		{
			rest[$self.data('type')].unshift(data);
			$('#admin-button').trigger('click');
			$addEmail.removeClass('opened');

		} else {
			rest[$self.data('type')] = [];
			console.warn('Увы, у нас на сайте ошибка. Конечный массив не найден. Но он был только что создан!');
		}
	});
	$addEmail.on('click', function(e) {
		if (e.target == this) {
			var $src = $(this).find('[name="path_to_delete"]');
			if ($src.val()) {
				adminMethods.deleteImage($src.val());
				$src.val('');
				$src.closest('.file').addClass('error');
			}
		}
	});

	// $servicesModal.find('[type="file"]').on('change', function () {
	// 		alert()
	// 	if (this.files.length) {
	// 		adminMethods.sendImage(this.files[0], this);
	// 	}
	// })
}