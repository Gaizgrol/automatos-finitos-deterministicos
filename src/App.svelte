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

	<!--
		Explicação de AFDs e sua utilidade aqui
	-->

	<section>
		<h2>📖 Instruções para interagir com os exemplos</h2>
		<h3>📋 Descrição:</h3>
		<h4>🔁 O autômato:</h4>
		<ul>
			<li>Cada retângulo maior arredondado representa um <strong>estado do autômato</strong>.</li>
			<li>O título no topo de cada estado representa seu <strong>nome único (identificador)</strong>.</li>
			<li>Ao lado do título, o <i>emoji</i> de <em>bandeira</em> (🏁) representa o <strong>estado inicial</strong> do autômato.</li>
			<li>Ao lado do título, o <i>emoji</i> de <em>claquete</em> (🎬) representa um dos <strong>estados finais</strong> do autômato, também indicado pela cor <strong style="color: steelblue">steelblue</strong> no plano de fundo.</li>
			<li>
				As linhas abaixo do título mostram os <strong>mapeamentos (conexões)</strong> de qual <em>entrada (Símbolo)</em> o estado lerá para qual estado ele <em>apontará (Saída)</em> após a leitura.
				<em>Em caso de um <strong>mapeamento não estar presente</strong>, o autômato <strong>implicitamente manterá o estado atual</strong> (apontará para si mesmo). Por exemplo, um estado sem mapeamento nunca selecionará um próximo estado. Caso seja selecionado, ficará selecionado para sempre.</em>
			</li>
			<li>Caso o autômato esteja em execução, o <strong>estado atual</strong> será indicado por um contorno <strong style="outline: 2px solid rgb(0, 255, 32)">verde claro</strong>.</li>
			<li>🎉 Se o autômato terminou de ler a palavra e o estado selecionado é um estado final, a palavra foi aceita por ele.</li>
			<li>🙁 Se o autômato terminou de ler a palavra e o estado selecionado <strong>não</strong> é um estado final, a palavra não foi aceita por ele.</li>
		</ul>
		<h4>🎮 Controles da interface:</h4>
		<ul>
			<li>
				Canto superior direito:
				<ul>
					<li> O olho (
						<span style="color: steelblue;"><Icon file="eye" w={16} h={16}></Icon></span>
						ou
						<span style="fill: gray;"><Icon file="eye-off" w={16} h={16}></Icon></span>
						) representa a <strong>visibilidade dos controles</strong>. Clique no ícone para mostrar ou ocultar a interface.
					</li>
				</ul>
			</li>
			<li>
				Canto inferior direito:
				<ul>
					<li>
						Campo de entrada para <strong>inserção da palavra</strong> que será avaliada pelo autômato caso ele <strong>não</strong> tenha iniciado a execução.
						Se a execução já foi iniciada, independentemente de estar pausado ou não, o campo <em>não aceitará edições até que o autômato seja reinicializado</em>.
						O símbolo que será <strong>fornecido de entrada</strong> para o <strong>autômato atual</strong> será destacado em vermelh<strong style="color: white; background-color: red;">o</strong>. 
					</li>
				</ul>
			</li>
			<li>
				Canto inferior esquerdo:
				<ul>
					<li>O bloco <strong>Alfabeto</strong> mostra quais são os <strong>símbolos válidos</strong> que o autômato aceita.</li>
					<li> O quadrado ( <Icon file="stop" w={16} h={16}></Icon> ) representa a <strong>reinicialização do autômato</strong>: a execução é interrompida, o autômato volta para o estado inicial e a será lida do início na próxima execução.</li>
					<li>
						O triângulo ou duas barras verticais (
						<span style="color: rgb(185, 100, 0);"><Icon file="play" w={16} h={16}></Icon></span>
						ou
						<span style="color: rgb(0, 185, 100);"><Icon file="pause" w={16} h={16}></Icon></span>
						) respectivamente representam os controles de <strong>início/resumo e pausa da execução do autômato</strong>.
					</li>
					<li> O campo de entrada de intervalo ao lado do símbolo dos dois triângulos ( <Icon file="forward" w={16} h={16}></Icon> ) <strong>configura a dilatação temporal da execução do autômato</strong>. 1.0x é o valor padrão e significa que o autômato alimentará o estado selecionado com o símbolo selecionado em um intervalo de 1 segundo.</li>
				</ul>
			</li>
		</ul>
		<h4>
			⚠️ Fornecer caracteres não UTF-8 (emojis por exemplo) para a palavra resultará em comportamento inesperado.
		</h4>
		<hr>
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
		<h2>📖 Instruções para interagir com o <i>Playground</i></h2>
		<h3>❗ <strong>As mesmas instruções para interagir com os autômatos anteriores se aplicam. Agora, por estarmos no modo de edição, teremos mais algumas funcionalidades:</strong></h3>
		<h4>🔁 O autômato:</h4>
		<ul>
			<li>
				Para cada estado temos, ao lado de seu identificador, uma lixeira (
					<span style="color: red;"><Icon file="trash" w={16} h={16}></Icon></span>
				)
				representando a ação de <strong>deletá-lo</strong>.
				<em>Mapeamentos que apontam para o estado apagado serão automaticamente removidos dos estados do autômato.</em>
			</li>
			<li>
				Abaixo do título, teremos uma <em>caixa de seleção</em> para marcar se o <strong>estado atual é um dos estados finais</strong>.
			</li>
			<li>
				Abaixo do título, teremos um <em>botão radial</em> para definir se o <strong>estado atual é o estado inicial</strong>.
				<em>Caso exista um estado inicial um outro estado seja marcado como inicial, ele automaticamente será trocado.</em>
			</li>
			<li>
				Nos <strong>mapeamentos (conexões)</strong> temos a possibilidade de <strong>trocar um símbolo aceito como entrada e seu estado de saída</strong>.
				Ao lado do mapeamento possuímos outro símbolo de lixeira para identificar que podemos removê-lo quando bem quisermos.
				<em>O estado não permite mapear uma entrada para mais de uma saída e também não permite que uma entrada aponte para si mesmo (afinal, omitir uma mapeamento, neste projeto, significa apontar para si mesmo).</em>
			</li>
			<li>
				Abaixo dos mapeamentos possuímos o botão de
				<strong>adicionar conexão</strong> (
					<Icon file="connect" w={20} h={20}></Icon>
				). Um campo de seleção será disponibilizado para escolher símbolo de entrada e mapeamento.
				O botão de <strong>confirmar conexão</strong> (
					<span style="color: green"><Icon file="checkmark" w={20} h={20}></Icon></span>
				) ficará desativado até que o usuário escolha um mapeamento válido. Clique nele para adicionar uma nova conexão. O botão de <strong>fechar</strong> (
					<span style="color: red"><Icon file="close" w={20} h={20}></Icon></span>
				) cancelará a operação.
			</li>
		</ul>
		<h4>🎮 Controles da interface:</h4>
		<ul>
			<li>
				Canto superior direito:
				<ul>
					<li>
						O botão de mais (
						<span style="color: steelblue;"><Icon file="add" w={20} h={20}></Icon></span>
						) <strong>adicionará um novo estado ao autômato</strong> ao ser clicado.
					</li>
				</ul>
			</li>
			<li>
				Canto inferior esquerdo:
				<ul>
					<li>
						O bloco <strong>Alfabeto</strong> agora permite <strong>adicionar e remover símbolos aceitos pelo autômato</strong>.
						<em>
							Símbolos podem ser adicionados e removidos livremente, mas o campo forçará somente uma ocorrência de cada símbolo.
							Quaisquer mapeamentos apontando para um símbolo que não está contido no alfabeto serão removidos automaticamente.
						</em>
					</li>
				</ul>
			</li>
		</ul>

		<h4>
			⚠️ Fornecer caracteres não UTF-8 (emojis por exemplo) para o alfabeto resultará em comportamento inesperado.
		</h4>
		<hr>
	</section>

	<section>
		<h3 class="playground">Playground!</h3>
		<Automato nomeAfd="playground" editavel={true}></Automato>
		<hr>
	</section>

	<section>
		<em>
			Desenvolvido por Gabriel Izoton.
		</em>
		<p>
			<strong>Links:</strong>
		</p>
		<ul>
			<li>
				<a href="https://github.com/Gaizgrol/automatos-finitos-deterministicos/">
					⛲ Código fonte
				</a>
			</li>
			<li>
				<a href="https://github.com/Gaizgrol/">
					👤 Perfil de Gabriel Izoton no GitHub
				</a>
			</li>
		</ul>
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
	import Icon from './componentes/Icon.svelte'
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