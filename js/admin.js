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
		url: "http://distance-learning.pp.ua/data/",
		context: rest
	}).done(function() {
		$( '#admin-saved' ).addClass( "opened" );
		setTimeout(function () {
			window.location.reload();
		}, 7000)
	}).fail(function( jqXHR, textStatus ) {
		alert( "Request failed: " + textStatus );
	});
});

function createForm (data) {
	var $modal = $('<div>').addClass( "modal-holder opened" ),
		$content = $('<div>').addClass( "modal-content" );
	$content.append(data);
	$modal.append($content);
	$('body').append($modal);
	bodyOverflow.fixBody();
}
createForm();