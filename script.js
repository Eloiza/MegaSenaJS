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

function calculateProbabilities(values){
	var numbers_frequency = {};

	//initiates the object
	for(var j=1; j<=60; j++){
		numbers_frequency[j.toString()] = 0;
	}

	//count all numbers in all games
	for(var game of values){
		for(var i=0; i< game.jogo.length; i++){
			numbers_frequency[game.jogo[i].toString()]++;
		};
	};

	console.log(numbers_frequency);	
	return numbers_frequency;
};

$(document).ready(function(){
	createMegaTable(6,10);
	var game_values;
	var numbers_frequency;

	var selected_numbers = []
	let div_numbers = $("#game_numbers");
	let div_result = $("#result_div");
	let div_hint = $("#hint_div");

	$("input:checkbox").on({
		
		click: function(){
			index = selected_numbers.indexOf(this.id);

			//found the element...so we remove it
			if(index > -1){
				selected_numbers.splice(index,1);
				$("#check_button").prop('disabled',true);		
			}

			//Add the element to the array and print in the box "game"
			else{

				if(selected_numbers.length != 6){
					selected_numbers.push(this.id);
					//handle last insertion
					if(selected_numbers.length == 6){
						$("#check_button").prop('disabled',false);
						console.log("Jogo pronto");
					}
				}

				//disable all chekbox to check if a game is done
				else{
					this.checked = false;
				}
			}
			//default message when there is no number to show
			if(selected_numbers.length == 0){
				div_numbers.html("<p>Selecione seis números da tabela para conferir o resultado! </p>");
			}

			//show a message with the selected numbers
			else{
				div_numbers.html("<p>" + selected_numbers + "</p>");
			}
		}

	});

	//handle the mouse over a number to show its frequency
	$('td').find('div').mouseenter(function(){
		//check if the mega games were loaded
		if(game_values != undefined){
			//if first time here calculate the frequency
			if(numbers_frequency === undefined){
				numbers_frequency = calculateProbabilities(game_values);
			}
			//get the frequency of the 'selected" number
			var num = $(this).find('input').attr('id');

			//print that in the hint box
			div_hint.html("<p>O número " + num + " foi sorteado em " + numbers_frequency[num.toString()] + " vezes nos " + game_values.length + " jogos realizados.</p>");
		}

	});
	
	$("#check_button").click(function(){
		//check if the mega geames were loaded
		if(game_values === undefined){
			alert("Antes de conferir é necessário carregar os valores dos jogos anteriores. Para isso clique em carregar");
		}

		else{
			//if a game were complete check it
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
				//if there was any match
				if(matches.length > 0 && matches != undefined){
					//prepare a message to show to the user
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
					//print the resultant string in the result div
					div_result.html(text);

				}
				//case there was any match
				else{
					div_result.html("<p>Opa, este jogo nunca foi sorteado na Mega-Sena. Quem sabe essa é a sua vez!</p>");
				}

			}
		}

	});

	//loads the dataset
	$("#load_button").click(function(){
		jQuery.support.cors = true;
		//case first time here load the data
		if(game_values == undefined){
			$.ajax({
				type: "GET",
				dataType: "json",
				url: "https://eloiza.github.io/dataset/mega_sena_list.json",
				success: function(data) {
					game_values = Object.values(data);
					console.log(game_values);
					alert("Dados carregados com sucesso!");

		  		}, error: function(){
		        	console.log("json not found");
		    	}
			});
		}
		//warn user that the data is there
		else{
			alert("Dados ja carregados!");
		}
	});

	//cleans the game - erase all the numbers selected
	$("#clear_button").click(function(){
		console.log("Limpando jogo");
		selected_numbers = [];
		$("input:checkbox").prop("checked",false);
		$("#check_button").prop('disabled',true);

		div_hint.html("<p>Ao clicar em carregar basta passar o mouse em cima de um número para ver aqui quantas vezes ele foi sorteado!</p>");
		div_numbers.html("<p>Selecione seis números da tabela para conferir o resultado! </p>");
		div_result.html("<p>Veja aqui quais jogos você teria acertado!</p>");
	})
});