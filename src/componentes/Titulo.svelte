<h1>
    <!--Palavras 'piscando' como se fosse um autômato-->
    {#each palavras as palavra, i}
        <span
            class="suave {i === palavras.length-1 ? 'italico' : 'titulo'} { palavraSelecionada === i ? 'selecionado' : '' }"
        >
            {palavra}
        </span>
    {/each}
</h1>

<script context="module" lang="ts">

    // Outros
    import { inteiroAleatorio } from '../auxiliares/RandomUtils'

</script>
<script lang="ts">

    // Frase que piscará
    const palavras: string[] = 'Autômatos Finitos Determinísticos: Playground'.split(' ');

    // Índice da palavra
    let palavraSelecionada: number = inteiroAleatorio( 0, palavras.length );

    setInterval(() =>
    {
        // Não acende a mesma palavra
        let anterior = palavraSelecionada;
        do
        {
            palavraSelecionada = inteiroAleatorio( 0, palavras.length );
        }
        while( palavraSelecionada === anterior )
        
    }, 1000 );

</script>


<style>
    .suave
    {
        transition: color 0.5s;
    }

    .titulo
    {
        color: cornflowerblue;
    }
    
    .titulo::after
    {
        content: ' ';
    }

    .selecionado
    {
        color: red;
    }

    .italico
    {
        font-style: italic;
    }
</style>
