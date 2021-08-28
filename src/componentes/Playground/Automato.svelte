<!--Estrutura visual/dinâmica do componente-->
<div class="application">
    <div class="ui">
        <button class="adiciona">
            <Icon file="add"></Icon>
        </button>
        <button class="remove" disabled={true}>
            <Icon file="trash"></Icon>
        </button>
    </div>
    <section id="playground" class="playground">
        {#each estados as estado (estado) }
            <EstadoComponent {...estado}></EstadoComponent>
        {/each}
    </section>
</div>


<!--
    Módulo com tipos, classes e funções que podem ser exportadas e reutilizadas
    em outros arquivos .ts normalmente
-->
<script context="module" lang="ts">

    // Models
    import Estado from "../../classes/Estado";
    // Views
    import EstadoComponent from "./Estado.svelte";
    import Icon from "../Icon.svelte";

    // Informações de como vamos guardar esses dados no playground
    export interface IDadosEstado
    {
        [key: string]: any;
        dados?: Estado;
    }

</script>

<!--Estrutura lógica-->
<script lang="ts">

    const estados: IDadosEstado[] = [];

    for ( let i=0; i<3; i++ )
        estados.push({
            dados: new Estado( String(i) ),
            x: 16+256*i,
            y: 16,
            nome: `Estado ${i}`
        })

    estados[0].dados.atualiza( 'a', estados[1].dados );
    estados[0].dados.atualiza( 'b', estados[2].dados );
    estados[0].dados.atualiza( 'c', estados[0].dados );

    estados[1].dados.atualiza( 'x', estados[2].dados );
    estados[1].dados.atualiza( 'y', estados[2].dados );

    estados[2].dados.atualiza( 'j', estados[0].dados );

</script>


<!--Estilização-->
<style>
    .application
    {
        width: 100%;
    }

    .playground
    {
        position: relative;

        margin-top: -720px;

        border: 1px solid rgba(0, 0, 0, 0.2);
        border-radius: 16px;

        overflow: auto;

        max-width: 1280px;
        width: 100%;
        height: 720px;

        background-image: url(/assets/imagens/grid.png);
        background-attachment: local;
        background-repeat: repeat;
    }

    .ui
    {
        position: relative;
        max-width: 1280px;
        width: 100%;
        height: 720px;
    }

    .ui > *
    {
        position: absolute;

        z-index: 999999; /* Fica na frente de praticamente todos os estados */
    }

    .ui > button
    {
        box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.2);

        border-radius: 50%;
        padding-bottom: 4px;
    
        width: 64px;
        height: 64px;

        font-size: 32px;

        transition: all 0.2s;

        color: white;
    }

    .adiciona
    {
        top: 16px;
        right: 16px;

        background-color: rgb(200, 200, 255);
        padding: 12px;
    }

    .adiciona:hover
    {
        background-color: rgb(190, 190, 220);
    }

    .adiciona:active
    {
        background-color: rgb(170, 170, 200);
    }

    .remove
    {
        top: 16px;
        right: 96px;
        background-color: rgb(255, 180, 180);
        padding: 12px;
    }

    .remove:hover
    {
        background-color: rgb(220, 170, 170);
    }

    .remove:active
    {
        background-color: rgb(200, 150, 150);
    }

    .remove:disabled
    {
        display: none;
    }
</style>