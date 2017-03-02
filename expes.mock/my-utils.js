module.exports = {
	remove: function(array, item) {
		var index = array.indexOf(item);
		if (index > -1) {
			array.splice(index, 1);
			return true;
		} else {
			return false;
		}
	}
}
