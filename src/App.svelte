<main>
	<section>
		<Titulo></Titulo>
		<hr>
	</section>
	
	<section>
		<h2>⚠️ Leia antes de prosseguir!</h2>
		<h3>🖥️ Caso você esteja utilizando um computador:</h3>
		<p>
			O conteúdo foi projetado para ser visualizado em computadores com telas de, pelo menos, <em><strong>800</strong> pixels de largura</em>.
		<p>
			<strong>
				A interação com a interface em uma tela menor que a informada resultará em uma experiência prejudicada pois elementos irão
				se sobrepor e algumas funcionalidades ficarão ocultas ou inacessíveis.
			</strong>
		</p>
		<p>
			<i>OBS: Para telas menores que 800 pixels, diminuir o zoom da página é uma solução viável. 💡 Um zoom de 67% em uma tela
			de aproximadamente 500 pixels deixa o conteúdo visível, o texto continua legível e a interface gráfica fica utilizável.</i>
		</p>
		<h3>📱 Caso você esteja utilizando um celular/tablet:</h3>
		<p>
			Como o conteúdo foi projetado para ser visto em computadores, os <i>smartphones</i> não foram prioridade no momento do desenvolvimento
			do projeto. Entretanto, é possível interagir com todas as funcionalidades, só é preciso ajustar a visualização da página. 💡 Nas opções
			de seu navegador, procure a opção <em>"Versão para computador"</em> e marque esta opção. O conteúdo deve, idealmente, ser ajustado.
			<i>Zoom</i> pode (e deve!) ser aplicado para a visualização do conteúdo.
		</p>
		<hr>
	</section>

	<section>
		<h2>📋 Instruções para usar o playground</h2>

	</section>
	
	<section>
		<h3>Validador de CEP</h3>
		<Automato nomeAfd="cep" editavel={false}></Automato>
	</section>

	<section>
		<h3>Validador de Email</h3>
		<Automato nomeAfd="email" editavel={false}></Automato>
	</section>

	<section>
		<h3 class="playground">Playground!</h3>
		<Automato nomeAfd="playground" editavel={true}></Automato>
	</section>
</main>

<script lang="ts">
	// Configura os AFDs
	afds['email'] = writable( email );
	afds['cep'] = writable( cep );
	afds['playground'] = writable( vazio );
</script>

<script context="module" lang="ts">
	
	// Stores
	import afds from './stores/AFDStore';
	import { writable } from 'svelte/store';
	// Views
	import Automato from './componentes/Playground/Automato.svelte';
	import Titulo from './componentes/Titulo.svelte';
	// Outros
	import { cep, email, vazio } from './auxiliares/InstanciasAFDs';

</script>

<style>
	main
	{
		box-sizing: border-box;
		display: flex;
		flex-direction: column;
		align-items: center;
		width: 90%;
		max-width: 1280px;
		margin: 0px auto;
		background-color: whitesmoke;
	}

	section
	{
		box-sizing: border-box;
		width: 90%;
		word-wrap: break-word;
	}

	.playground
	{
		font-style: italic;
	}
</style>