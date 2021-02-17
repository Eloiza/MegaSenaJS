function createMegaTable(lin, col){
	let table = $("#game_table");
	var row;
	var item = 1;
	for(i=0; i<6; i++){
		row += '<tr>';
		for(j=0; j<10; j++){
			var checkbox = '<input type="checkbox" id=' + item +' value='+ item + '>';
			checkbox += '<label for=' + item + '>' + item + '</label>';

			row += '<th><div>' + checkbox + '</div></th>';
			item++;
		}
		row += '</tr>';		
	}
	table.html(row);
}

$(document).ready(function(){
	createMegaTable(6,10);
	var all_games;

	var selected_numbers = []
	let div_numbers = $("#game_numbers");
	$("input:checkbox").click(function(){
		index = selected_numbers.indexOf(this.id);

		//found the element...so we remove it
		if(index > -1){
			selected_numbers.splice(index,1);
		}

		//we add the element to the array
		//and print in the box "game"
		else{
			//total number in a game
			if(selected_numbers.length == 6){
				console.log("Jogo pronto");
				this.checked = false;
			}
			else{
				selected_numbers.push(this.id);
			}
		}
		
		div_numbers.text(selected_numbers);

	});

	var game_values;
	$("#check_button").click(function(){
		if(game_values === undefined){
			alert("Antes de conferir é necessário carregar os valores dos jogos");
		}

		else{
			if(selected_numbers.length == 6){
				console.log("Jogo pronto, vamos conferir B)");
			
				var i, j;
				var hit;
				var matches = [];
				//checks if the selected numbers is equal to a previuosly game
				for(var entry of game_values){
					hit = 0;
					for(i=0; i<entry.jogo.length; i++){
						//verifies all the numbers - do not consider the order
						for(j=0; j<selected_numbers.length; j++){
							if(entry.jogo[i] == selected_numbers[j]){
								hit++;
							}
						}
					}
					if(hit >= 4){
						//append a object to the matches list
						matches.push({'concurso':entry.concurso,
									'data':entry.data,
									'jogo':entry.jogo,
									'hits':hit});
					}
				}
				if(matches != undefined){
					for(m of matches){
						if(m.hits == 4){
							console.log("Você ganhou a quadra do concurso: " + m.concurso + " de data: " + m.data + " números do concurso: " + m.jogo);
						}

						else if(m.hits == 5){
							console.log("Você ganhou a quina do concurso: " + m.concurso + " de data: " + m.data + " números do concurso: " + m.jogo);	
						}

						else if(m.hits == 6){
							console.log("Você ganhou a MEGASENA do concurso: " + m.concurso + " de data: " + m.data + " números do concurso: " + m.jogo);
						}
					}

				}
				else{
					console.log("Não ganhou nd :(");
				}

			}
			else{
				var numbers = 6 - selected_numbers.length;
				console.log("Termine o jogo antes de conferir! É preciso adicionar mais " + numbers+ " números para terminar");
			}
		}

	});

	$("#load_button").click(function(){
		jQuery.support.cors = true;
		$.ajax({
			type: "GET",
			dataType: "json",
			url: "https://eloiza.github.io/dataset/mega_sena_list.json",
			success: function(data) {
				console.log("Json Carregado");

				game_values = Object.values(data);
				console.log(game_values[0].jogo);

	    }, error: function(){
	        	console.log("json not found");
	    	}
		})
	});
});