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
			if (typeof window[$self.data('editable')] == 'object') {
				var ob = window[$self.data('editable')];
				ob[$self.data('key')] = $self.html();
				console.log(ob);
			} else {
				alert('Ошибка! window.[$self.data(editable)] не является объектом')
			}
		});
});
function buildNav (data, template) {
	if (typeof data != "object" || !template) {
		return false;
	}
	for (attr in data) {
		// console.log('/{{' + attr + '}}/g');
		template = template.replace('{{' + attr + '}}', data[attr])
	}
	console.log(template);
}
buildNav ({'href': 'test1', 'name': 'name-1'}, '<li><a href="{{href}}" data-editable="nav" data-key="nav-1">{{name}}</a></li>')