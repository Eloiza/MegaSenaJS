function createMegaTable(lin, col){
	let table = $("#game_table");
	var row;
	var item = 1;
	row += '<tbody>';
	for(i=0; i<6; i++){
		row += '<tr>';
		for(j=0; j<10; j++){
			var checkbox = '<input class="checkmark" type="checkbox" id=' + item +' value='+ item + '>';
			checkbox += '<label for=' + item + '>' + item + '</label>';

			row += '<td><div>' + checkbox + '</div></td>';
			item++;
		}
		row += '</tr>';		
	}
	row += '</tbody>';
	table.html(row);
}

$(document).ready(function(){
	createMegaTable(6,10);
	var all_games;

	var selected_numbers = []
	let div_numbers = $("#game_numbers");
	let div_result = $("#result_div");
	var game_done = false;

	$("input:checkbox").click(function(){
		index = selected_numbers.indexOf(this.id);

		//found the element...so we remove it
		if(index > -1){
			selected_numbers.splice(index,1);
			$("#check_button").prop('disabled',true);
			game_done = false;			
		}

		//we add the element to the array
		//and print in the box "game"
		else{

			if(selected_numbers.length != 6){
				selected_numbers.push(this.id);
				//last insertion
				if(selected_numbers.length == 6){
					$("#check_button").prop('disabled',false);
					console.log("Jogo pronto");
				}
			}

			else{
				this.checked = false;
			}
		}
		if(selected_numbers.length == 0){
			div_numbers.html("<p>Selecione seis números da tabela para conferir o resultado! </p>");
		}
		else{
			div_numbers.html("<p>" + selected_numbers + "</p>");
		}
	});

	var game_values;
	$("#check_button").click(function(){
		if(game_values === undefined){
			alert("Antes de conferir é necessário carregar os valores dos jogos anteriores. Para isso clique em carregar");
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
				console.log(matches);
				if(matches.length > 0 && matches != undefined){
					var text = '';
					for(m of matches){
						if(m.hits == 4){
							text += "<p>Você acertou a quadra do concurso " + m.concurso + " de data "+ m.data + ". Números sorteados nesse concurso: " + m.jogo + "</p>";
							console.log("acertou quadra");
						}

						else if(m.hits == 5){
							text += "<p>Você acertou a quina do concurso " + m.concurso + " de data "+ m.data + ". Números sorteados nesse concurso: " + m.jogo + "</p>";
							console.log("acertou quina");
						}

						else if(m.hits == 6){
							text += "<p>Você acertou a <b>MEGAS-SENA</b> do concurso " + m.concurso + " de data "+ m.data + ". Números sorteados nesse concurso: " + m.jogo + "</p>";
							console.log("acertou sena");
						
						}
					}
					div_result.html(text);

				}
				else{
					div_result.html("<p>Opa, este jogo nunca foi sorteado na Mega-Sena. Quem sabe essa é a sua vez!</p>");
				}

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
				alert("Dados carregados com sucesso!");

	    }, error: function(){
	        	console.log("json not found");
	    	}
		})
	});

	$("#clear_button").click(function(){
		console.log("Limpando jogo");
		selected_numbers = [];
		$("input:checkbox").prop("checked",false);
		$("#check_button").prop('disabled',true);

		div_numbers.html("<p>Selecione seis números da tabela para conferir o resultado! </p>");
		div_result.html("<p>Veja aqui quais jogos você teria acertado!</p>");
	})
});