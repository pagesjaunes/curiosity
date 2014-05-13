// keyWordCtrlUtils.js

function findKeyWordIndex(index, array)
{
	var i = 0;
	while (i < array.length) {
		if (array[i].index == index) {
			return (i);
		}
		i++;
	}
	return (-1);
}

function findKeyWordArray(index, array)
{
	var i = 0;
	while (i < array.length) {
		if (array[i].index == index) {
			return (array[i].keywords);
		}
		i++;
	}
	return ([]);
}