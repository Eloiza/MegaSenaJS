function createMegaTable(lin, col){
	let table = $("#game_table");
	var row;
	var item = 1;
	for(i=0; i<6; i++){
		row += '<tr>'
		for(j=0; j<10; j++){
			var checkbox = '<input type="checkbox" id=' + item +'value='+ item + '>';
			checkbox += '<label for=' + item + '>' + item + '</label>';

			row += '<th><div>' + checkbox + '</div></th>'
			item++;
		}
		row += '</tr>'		
	}
	table.html(row);
}

$(document).ready(function(){
	createMegaTable(6,10);

});