<!--Estrutura visual/dinâmica do componente-->
<div class="application">
    <div class="ui">
        <div class="top right">
            {#if editavel && controlesVisiveis}
                <button class="adiciona" on:click={criaEstado}>
                    <Icon file="add"></Icon>
                </button>
            {/if}
            <button class={controlesVisiveis ? 'visivel' : 'invisivel'} on:click={()=>controlesVisiveis=!controlesVisiveis}>
                <Icon file={controlesVisiveis ? 'eye' : 'eye-off'}></Icon>
            </button>
        </div>

        {#if controlesVisiveis}
            
            <div class="column lower left">
                <div class="row fill">
                    <span>Alfabeto</span>
                    {#if editavel}    
                        <div class="alfabeto">
                            <input type="text" value={$afd.alfabeto.join('')} on:input={filtraAlfabeto}>
                        </div>
                    {:else}
                        <div class="passo-a-passo">
                            {#each $afd.alfabeto as letra}
                                <span class="letra">{letra}</span>
                            {/each}
                        </div>
                    {/if}
                </div>
                <div class="row">
                    <button class="reset" on:click={reset}>
                        <Icon file='stop' w={24} h={24}></Icon>
                    </button>
                    <button class={executando ? 'pausa' : 'executa' } on:click={alteraExecucao}>
                        <Icon file={executando ? 'pause' : 'play'} w={24} h={24}></Icon>
                    </button>
                    <div class="fill row">
                        <div>{ dilatacaoTemporal%1 ? dilatacaoTemporal : dilatacaoTemporal+'.0' }x</div>
                        <Icon file="forward"></Icon>
                        <input
                            on:change={atualizaVelocidade}
                            bind:value={dilatacaoTemporal}
                            step={0.1}
                            min={minDilatacaoTemporal}
                            max={maxDilatacaoTemporal}
                            type="range"
                        >
                    </div>
                </div>
            </div>

            <div class="alfabeto row lower right">
                {#if executando || posSimbolo > 0}
                    <div class="passo-a-passo">
                        {#each palavra as letra, pos }
                            <span class="letra {posSimbolo===pos?'selecionado':''}">{letra}</span>
                        {/each}
                    </div>
                {:else}
                    <input type="text" placeholder="Digite uma palavra..." value={palavra} on:input={filtraPalavra}>
                {/if}
                
            </div>
        {/if}
    </div>
    <section id="playground" class="playground">
        {#each componentes as estado (estado.estado.id) }
            <EstadoComponent {...estado} {editavel}></EstadoComponent>
        {/each}
    </section>
</div>


<script context="module" lang="ts">

    // Stores
    import afds from '../../stores/AFDStore';
    // Models
    import Estado from "../../classes/Estado";
    // Views
    import EstadoComponent from "./Estado.svelte";
    import Icon from "../Icon.svelte";

    // Informações mínimas necessárias para a view de componente
    export interface DadosComponenteEstado
    {
        [key: string]: any;
        nomeAfd: string;
        estado: Estado;
    }

</script>
<script lang="ts">

    // Visíveis externamente
    export let nomeAfd: string;
    export let editavel: boolean;

    // Internas
    let executando: boolean = false;
    let palavra: string = '';
    let posSimbolo: number = 0;
    
    let dilatacaoTemporal: number = 1;
    const minDilatacaoTemporal: number = 0.1;
    const maxDilatacaoTemporal: number = 9.9;
    let timeout: number;
    let msIntervalo: number;
    let controlesVisiveis: boolean = true;

    $: msIntervalo = 1000 * ( 1 / dilatacaoTemporal );

    const afd = afds[nomeAfd];
    let componentes: DadosComponenteEstado[];
    let estadoAtual: Estado = null;
    $: componentes = $afd.estados.map( ( estado, i ) => ({ nomeAfd, estado, x: 16 + 300*i, y: 16, selecionado: estado === estadoAtual }) );

    let proxId: number = 0;

    function filtraPalavra( evento: Event )
    {
        const alvo = evento.target as any;
        alvo.value = [...alvo.value].filter( l => $afd.alfabeto.includes( l ) ).join('');
        palavra = alvo.value;
    }

    function filtraAlfabeto( evento: Event )
    {
        const alvo = evento.target as any;
        const alfa = [...new Set(alvo.value)] as string[];
        alvo.value = alfa.join('');
        palavra = [...palavra].filter( l => alfa.includes( l ) ).join('');
        $afd.alfabeto = alfa;
    }

    function criaEstado()
    {
        const novoEstado = new Estado( 'S'+proxId++ );
        $afd.adicionaEstado( novoEstado );
        componentes.push({ nomeAfd, estado: novoEstado, x: 16, y: 16 });

        $afd = $afd;
    }

    function alteraExecucao()
    {
        executando = !executando

        if ( executando )
            if ( palavra.length )
            {
                if ( posSimbolo === 0 )
                    estadoAtual = $afd.inicial;
                intervalo();
            }
            else
                executando = false;
    }

    function atualizaVelocidade( event: Event )
    {
        clearTimeout( timeout );
        intervalo();
    }

    function proximoSimbolo()
    {
        if ( executando )
        {
            if ( posSimbolo < palavra.length && estadoAtual )
            {
                estadoAtual = estadoAtual.transicao( palavra[posSimbolo] );
                intervalo();
                posSimbolo++;
            }
        }
        else
            clearTimeout( timeout );
    }

    function intervalo()
    {
        clearTimeout( timeout );
        timeout = setTimeout( proximoSimbolo, msIntervalo ) as any;
    }

    function reset()
    {
        clearTimeout( timeout );
        posSimbolo = 0;
        estadoAtual = null;
        executando = false;
    }
</script>


<style>
    .application
    {
        width: 100%;
        min-height: 720px;
        
        border-radius: 16px;
        overflow: hidden;
        border: 1px solid rgba(0, 0, 0, 0.2);
    }

    .playground
    {
        position: relative;

        margin-top: -720px;

        border: 1px solid rgba(0, 0, 0, 0.2);
        border-radius: 16px;

        overflow: auto;

        
        width: 100%;
        min-height: 720px;

        background-image: url(../assets/imagens/grid.png);
        background-attachment: local;
        background-repeat: repeat;
    }

    .ui
    {
        position: relative;
        width: 100%;
        min-height: 720px;
    }

    .ui > *
    {
        position: absolute;

        z-index: 999999; /* Fica na frente de praticamente todos os estados */
    }

    .ui button
    {
        box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.2);

        border-radius: 50%;
        padding-bottom: 4px;
    
        width: 64px;
        height: 64px;

        font-size: 32px;

        transition: all 0.2s;
    }

    .row
    {
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: 8px;
    }

    .column
    {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 8px;
    }

    .lower
    {
        bottom: 16px;
    }

    .left
    {
        left: 16px;
    }

    .top
    {
        top: 16px;
    }

    .right
    {
        right: 16px;
    }

    .adiciona
    {
        background-color: rgb(0, 100, 185);
        padding: 12px;
        color: white;
    }

    .adiciona:hover
    {
        background-color: rgb(0, 82, 153);
    }

    .adiciona:active
    {
        background-color: rgb(0, 63, 117);;
    }

    .visivel
    {
        background-color: white;
        padding: 12px;
        fill: steelblue;
        color: steelblue;
    }

    .visivel:hover
    {
        background-color: lightgray;
    }

    .visivel:active
    {
        background-color: rgb(199, 199, 199);
    }
    
    .invisivel
    {
        background-color: rgb(167, 167, 167);
        padding: 12px;
        fill: white;
        color: white;
    }

    .invisivel:hover
    {
        background-color: rgb(134, 134, 134);
    }

    .invisivel:active
    {
        background-color: rgb(105, 105, 105);;
    }

    .executa
    {
        padding: 0;
        margin: 0;
        width: 48px !important;
        height: 48px !important;
        color: white;
        background-color: rgb(185, 100, 0);
    }
    
    .executa:hover
    {
        background-color: rgb(155, 82, 0);
    }
    
    .executa:active
    {
        background-color: rgb(114, 70, 20);
    }
    
    .pausa
    {
        padding: 0;
        margin: 0;
        width: 48px !important;
        height: 48px !important;
        background-color: rgb(0, 185, 100);
        color: white;
    }
    
    .pausa:hover
    {
        background-color: rgb(0, 155, 82);
    }

    .pausa:active
    {
        background-color: rgb(20, 114, 70);
    }

    .reset
    {
        padding: 0;
        margin: 0;
        width: 48px !important;
        height: 48px !important;
        background-color: rgb(0, 0, 0);
        color: white;
    }
    
    .reset:hover
    {
        background-color: rgb(36, 36, 36);
    }

    .reset:active
    {
        background-color: rgb(71, 71, 71);
    }

    .fill
    {
        border-radius: 16px;
        padding: 4px 16px;
        background-color: lightgray;
    }

    .fill > input
    {
        margin: 0;
    }
    
    .letra
    {
        letter-spacing: 3px;
    }

    .alfabeto > input
    {
        letter-spacing: 3px;
        outline: 1px solid steelblue;
        box-sizing: border-box;
        width: 256px;
        height: 48px;
        padding: 8px;
        margin: 0;
        border: 1px solid #ccc;
        border-radius: 2px;
    }

    .alfabeto > input:focus
    {
        outline: 3px solid steelblue;
    }

    .passo-a-passo
    {
        outline: 1px solid steelblue;
        box-sizing: border-box;
        overflow: auto;
        width: 256px;
        height: 48px;
        padding: 8px;
        margin: 0;
        border: 1px solid #ccc;
        border-radius: 2px;
        background-color: rgb(230,230,230);
    }

    .selecionado
    {
        color: white;
        background-color: red;
    }
</style>