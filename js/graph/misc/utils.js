function builtDataFromCols(data, cols) {
	var i = 0; 
	var rows = [];
	while (i < data.length) {
		var row = {};
		row.c = [];
		var j = 0; 
		while (j < cols.length) {
			cell = builtCell(data[i], cols[j].path, cols[j].type)
			row.c.push(cell);
			j++;
		}
		i++;
		rows.push(row);
	}
	return (rows);
}

function builtCell (data, path, type) {
	var pathS = path.split('.');
	var i = 0;
	while (i < pathS.length) {
		data = data[pathS[i]];
		i++;
	}
	
	var res = {};
	if (type == "date") {
		res.v = new Date(data);
	}
	else {
		res.v = data;
	} 
	return res;
}