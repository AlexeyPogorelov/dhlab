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

	$('#admin-button').on('click', function () {
		$.ajax({
			method: "POST",
			url: domain + "api/admin/data",
			data: {
				data: rest
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
}