function runAdmin (argument) {
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
		sendImage: function (file) {
			loading.showPreloader();
			var form = new FormData();
			form.append('files[]', file);
			// console.log(form);
			$.ajax({
				method: "POST",
				url: domain + "api/admin/upload",
				cache: false,
				contentType: 'multipart/form-data',
				processData: false,
				data: form
			}).done(function(data) {
				loading.hidePreloader();
				console.log(data);
			}).fail(function( jqXHR, textStatus ) {
				alert( "Ошибка загрузки: " + textStatus );
			});
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

			console.error('Нет данных');

		}
	});

	// createForm('<h1>test</h1>');
	$('#addNew').on('submit', function () {
		var data = {},
			$self = $(this);
		$self.find('[name]').each(function () {
			var $input = $(this);
			data[$input.attr('name')] = $input.val();
		});
		if(rest[$self.data('type')]  instanceof Array )
		{
			rest[$self.data('type')].push(data);
			$('#admin-button').trigger('click');
		} else {
			console.error('Увы, у нас на сайте ошибка. Конечный массив не найден.');
		}
	}).validate();
	$('#addNew').find('[type=file]').on('change', function () {
		adminMethods.sendImage(this.files[0]);
		// console.log(this.files);
	});
}