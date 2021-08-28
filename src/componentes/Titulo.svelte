<h1>
    {#each palavras as palavra, i}
        <span class="suave {i === palavras.length-1 ? 'italico' : 'titulo'} { palavraSelecionada === i ? 'selecionado' : '' }">{palavra}</span>
    {/each}
</h1>
<h2>

</h2>

<script context="module" lang="ts">

    import { inteiroAleatorio, numeroAleatorio } from '../auxiliares/RandomUtils'

</script>

<script lang="ts">

    const frase: string = 'Autômatos Finitos Determinísticos: Playground';
    const palavras: string[] = frase.split(' ');
    let palavraSelecionada: number = inteiroAleatorio( 0, palavras.length );

    setInterval(() =>
    {
        let anterior = palavraSelecionada;
        do
        {
            palavraSelecionada = inteiroAleatorio( 0, palavras.length );
        } while( palavraSelecionada === anterior )
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
