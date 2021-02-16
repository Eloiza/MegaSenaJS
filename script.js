function createMegaTable(lin, col){
	let table = $("#game_table");
	var row;
	var item = 1;
	for(i=0; i<6; i++){
		row += '<tr>'
		for(j=0; j<10; j++){
			var checkbox = '<input type="checkbox" id=' + item +' value='+ item + '>';
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

	var selected_numbers = []
	let div_numbers = $("#game_numbers");
	$("input:checkbox").click(function(){
		index = selected_numbers.indexOf(this.id);

		//found the element...so we remove it
		if(index > -1){
			selected_numbers.splice(index,1)
		}

		//we add the element to the array
		//and print in the box "game"
		else{
			//total number in a game
			if(selected_numbers.length == 6){
				console.log("Jogo feito :D - Remova algum item")
				this.checked = false;
			}
			else{
				selected_numbers.push(this.id);
			}
		}
		
		div_numbers.text(selected_numbers);

	});

});