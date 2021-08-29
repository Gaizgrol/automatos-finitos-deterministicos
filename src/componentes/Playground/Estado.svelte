<div
    bind:this={element}
    class="state {selecionado?'selected':''} {ehFinal?'final':''}"
    style="
        left: {x}px;
        top: {y}px;
    "
>
    <!--"Base" para arrastar o componente>
    <div class="drag">
        <hr>
        <hr>
        <hr>
    </div-->
    
    <div class="content">
        <!--Mostra a bandeirinha do estado final-->
        <h1 class="title">
            {ehInicial?'🎬':''} {ehFinal?'🏁':''} {estado.id}
            <!--Remove o estado-->
            {#if editavel}
                <div class="delete" on:click={apagaEstado}>
                    <Icon file="trash"></Icon>
                </div>
            {/if}
        </h1>

        {#if editavel}
            <hr>

            <!--Marca se um elemento é final ou não-->
            <div class="row check">
                <div class="row check">
                    <input
                        id="final-{estado.id}"
                        type="checkbox"
                        checked={ehFinal}
                        on:input={trocaFinal}
                    >
                    <label for="final-{estado.id}">Final</label>
                </div>
                <div class="row check">
                    <input
                        id="inicial-{estado.id}"
                        type="radio"
                        checked={ehInicial}
                        on:input={trocaInicial}
                    >
                    <label for="inicial-{estado.id}">Inicial</label>
                </div>
            </div>
        {/if}

        <hr>
    
        <!--Mapeamento de pares (Símbolo → Estado)-->
        <!--#TODO: Pelo amor de deus transforma isso em um componente-->
        {#each [...estado.entradas] as entrada (entrada)}
            
            <div class="row">
                
                <!--Entrada (chave)-->
                <div>
                    <label for="e-{estado.id}-{entrada}">Símbolo</label>
                    <select
                        id="e-{estado.id}-{entrada}"
                        on:change={(e) => trocaEntrada(e, entrada)}
                        disabled={editando || !editavel}
                    >
                        <!--Remove as opções que já estão mapeadas mas se mantém na lista (para se manter selecionada)-->
                        {#each $afd.alfabeto.filter( s => !estado.contem( s ) || s === entrada ) as simbolo (simbolo)}
                            <option
                                value={simbolo}
                                selected={ simbolo === entrada }
                            >
                                {simbolo}
                            </option>
                        {/each}
                    </select>
                </div>

                <!--Seta fofa-->
                <div class="arrow">
                    <Icon file="arrow-right" w={24} h={24}></Icon>
                </div>

                <!--Saída (valor)-->
                <div>
                    <label for="o-{estado.id}-{entrada}">Saída</label>
                    <select
                        id="o-{estado.id}-{entrada}"
                        on:change={(e) => trocaSaida(e, entrada)}
                        disabled={editando || !editavel}
                    >
                        <!--Mostra todas as opções possíveis-->
                        {#each $afd.estados.filter( s => s !== estado ) as estadoAFD (estadoAFD.id) }
                            <option
                                value="{estadoAFD.id}"
                                selected={estado.estado(entrada).id == estadoAFD.id}
                            >
                                {$afd.finais.includes( estadoAFD )?'🏁':''} {estadoAFD.id}
                            </option>
                        {/each}
                    </select>
                </div>

                {#if editavel}
                    <!--Remoção de mapeamento-->
                    <div>
                        <div class="delete" on:click={() => apagaMapeamento( entrada )}>
                            <Icon file="trash"></Icon>
                        </div>
                    </div>
                {/if}

            </div>

        {/each}

    </div>
        
    <!--Adiciona um mapeamento novo-->
    {#if editando}
        <div class="column">
            <div class="row">
                <!--Entrada (chave)-->
                <div>
                    <label for="e-adc">Símbolo</label>
                    <select
                        id="e-adc"
                        bind:value={simboloEscolhido}
                    >
                        <option value=''>
                            ...
                        </option>
                        <!--Remove as opções que já estão mapeadas mas se mantém na lista (para se manter selecionada)-->
                        {#each $afd.alfabeto.filter( s => !estado.contem( s ) ) as simbolo (simbolo)}
                            <option
                                value={simbolo}
                            >
                                {simbolo}
                            </option>
                        {/each}
                    </select>
                </div>

                <!--Seta fofa-->
                <div class="arrow">
                    <Icon file="arrow-right" w={24} h={24}></Icon>
                </div>

                <!--Saída (valor)-->
                <div>
                    <label for="s-adc">Saída</label>
                    <select
                        id="s-adc"
                        bind:value={estadoEscolhido}
                    >
                        <option value=''>...</option>
                        <!--Mostra todas as opções possíveis-->
                        {#each $afd.estados.filter( s => s !== estado ) as estadoAFD (estadoAFD.id) }
                            <option
                                value="{estadoAFD.id}"
                            >
                                {$afd.finais.includes( estadoAFD )?'🏁':''} {estadoAFD.id}
                            </option>
                        {/each}
                    </select>
                </div>
            </div>
            <div class="row">
                <div class={( $afd.estados.map( s => s.id ).includes( estadoEscolhido ) && $afd.alfabeto.includes( simboloEscolhido ) ) ? 'confirma' : 'desativado'} on:click={confirmaConexao}>
                    <Icon file="checkmark"></Icon>
                </div>
                <div class="delete" on:click={cancelaConexao}>
                    <Icon file="close"></Icon>
                </div>
            </div>
        </div>
    {:else if editavel}
        <button class="add" on:click={adicionaConexao}>
            <Icon file="connect"></Icon>
            Adicionar conexão
        </button>
    {/if}
</div>


<script context="module" lang="ts">

    // Stores
    import afds from '../../stores/AFDStore'
    import type { Writable } from 'svelte/store';
    // Models
    import type AFD from '../../classes/AFD'
    import type Estado from '../../classes/Estado'
    // Views
    import Icon from '../Icon.svelte'

</script>
<script lang="ts">

    // Vistas externamente
    // Visual
    export let x: number = 16;
    export let y: number = 16;
    export let selecionado = false;
    // Lógico
    export let estado: Estado = null;
    export let nomeAfd: string = 'playground';
    export let editavel: boolean;
    
    // Internas
    const afd: Writable<AFD> = afds[nomeAfd];

    let simboloEscolhido: string;
    let estadoEscolhido: string;

    let editando: boolean = false;

    // Uso só pra poder mudar o estilo do componente quando ele for um estado final
    let ehInicial: boolean;
    let ehFinal: boolean;
    $: ehInicial = $afd.inicial === estado;
    $: ehFinal = $afd.finais.includes( estado );

    let element: HTMLDivElement;

    $: {
        if ( selecionado )
            element.scrollIntoView();
    }

    function apagaMapeamento( entrada: string )
    {
        estado.atualiza( entrada, estado );
        estado = estado;
    }

    function adicionaConexao()
    {
        editando = true;
    }

    function cancelaConexao()
    {
        editando = false;
        simboloEscolhido = '';
        estadoEscolhido = '';
    }

    function confirmaConexao()
    {
        const index = $afd.estados.map( s => s.id ).indexOf( estadoEscolhido );
        const s = $afd.estados[index];
        if ( s )
        {
            estado.atualiza( simboloEscolhido, s );
            cancelaConexao();
            estado = estado;
        }
    }

    function apagaEstado()
    {
        $afd.removeEstado( estado );
        estado = estado;
        $afd = $afd;
    }

    // Dispara quando mudamos a entrada em um dos mapeamentos
    function trocaEntrada( evento: Event, entrada: string )
    {
        const alvo = evento.target as any;

        // Tenta trocar a entrada do estado atual
        if ( estado.trocaEntrada( entrada, alvo.value ) )
            // Força re-renderização do Svelte
            estado = estado;
    }

    // Dispara quando mudamos a saída em um dos mapeamentos
    function trocaSaida( evento: Event, entrada: string )
    {
        const alvo = evento.target as any;
        
        // Novo estado selecionado
        const novoEstado = $afd.estados[ $afd.estados.map( e => e.id ).indexOf( alvo.value ) ];

        if ( novoEstado )
        {
            // Atualiza o novo estado
            estado.atualiza( entrada, novoEstado );
            // Força re-renderização do Svelte
            estado = estado;
        }
    }

    function trocaInicial()
    {
        $afd.configuraInicial( estado );
        $afd = $afd;
    }

    function trocaFinal( evento: Event )
    {
        const alvo = evento.target as any;

        const agoraEhFinal: boolean = alvo.checked;

        if ( agoraEhFinal )
        {
            $afd.adicionaFinal( estado );
        }
        else
        {
            $afd.removeFinal( estado );
        }

        // Força re-renderização do Svelte
        $afd = $afd;
    }
</script>


<style>
    hr
    {
        border: 0;
        margin: 8px 0px;
        width: 100%;
        height: 1px;
        background-color: rgba(0, 0, 0, 0.2);
    }

    select
    {
        border-radius: 16px;
    }
    
    /*
    .drag
    {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        border-top-left-radius: 16px;
        border-top-right-radius: 16px;
        min-height: 16px;
        cursor: grab;
        padding: 8px;
        background-color: lightgrey;
    }
    */

    .title
    {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        margin: 0;
    }

    .delete
    {
        cursor: pointer;
        transition: color 0.25s;
    }

    .delete:hover
    {
        color: red;
    }

    .confirma:hover
    {
        color: green;
        cursor: pointer;
    }

    .desativado
    {
        color: rgb(189, 189, 189);
    }

    .check
    {
        gap: 8px;
    }

    .check > input
    {
        margin: 0;
    }

    .content
    {
        display: flex;
        flex-direction: column;
        margin: 8px 16px;
    }

    /*
    .drag > hr
    {
        margin: 2px;
        width: 32px;
    }
    */

    .add
    {
        border-bottom-left-radius: 16px;
        border-bottom-right-radius: 16px;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        margin-bottom: 0px;
        width: 100%;
        gap: 8px;
    }

    .state
    {
        user-select: none;
        display: inline-block;
        position: absolute;
        border: 1px solid rgba(0, 0, 0, 0.2);
        border-radius: 16px;
        min-width: 160px;
        min-height: 120px;
        background-color: rgb(230, 230, 230);
        box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.2);
        transition: background-color 0.25s, color 0.25s;
    }

    .selected
    {
        cursor: grab;
        outline: 4px solid rgba(0, 255, 32);
    }

    .final
    {
        background-color: steelblue;
        color: white;
    }

    .row
    {
        display: flex;
        flex-direction: row;
        align-items: center;
    }

    .arrow
    {
        display: flex;
        justify-content: center;
        align-items: center;
        min-width: 48px;
    }

    .column
    {
        border-top: 1px solid rgba(0, 0, 0, 0.1);
        border-bottom-left-radius: 16px;
        border-bottom-right-radius: 16px;
        padding: 16px;
        display: flex;
        flex-direction: column;
        background-color: lightgray;
        color: black;
    }
</style>