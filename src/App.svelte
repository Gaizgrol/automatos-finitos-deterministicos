<main>
	<Titulo></Titulo>
	<h2>Validador de CEP</h2>
	<Automato nomeAfd="cep" editavel={false}></Automato>
	<h2>Validador de Email</h2>
	<Automato nomeAfd="email" editavel={false}></Automato>
	<h2 class="playground">Playground!</h2>
	<Automato nomeAfd="playground" editavel={true}></Automato>
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
		margin: 0px 5%;
		padding: 32px;
		background-color: whitesmoke;
	}

	.playground
	{
		font-style: italic;
	}
</style>