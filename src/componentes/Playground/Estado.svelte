<!--Estrutura visual/dinâmica do componente-->
<div
    class="state {selecionado ? 'selected' : ''}"
    style="
        background-color: rgb({bgColor[0]},{bgColor[1]},{bgColor[2]});
        left: {x}px;
        top: {y}px;
    "
>
    <h1>{nome}</h1>
    
    {[...dados.mapa.entries()].map( pair => [pair[0], pair[1].id] ).join('; ')}

    <hr>


    {#each [...dados.mapa.keys()] as entrada}
        <div class="row">
            <div>
                <label for="in">Símbolo</label>
                <select
                    name="in"
                    id="in"
                    on:change={(e) => trocaEntrada(e, entrada)}
                >
                    <!--Remove as opções que já estão mapeadas mas se mantém na lista-->
                    {#each alfabeto.filter( s => !dados.mapa.has(s) || s === entrada ) as simbolo (simbolo)}
                        <option
                            value={simbolo}
                            selected={ simbolo === entrada }
                        >
                            {simbolo}
                        </option>
                    {/each}

                </select>
            </div>
            <div class="arrow">
                <Icon file="arrow-forward-outline" w={24} h={24}></Icon>
            </div>
            <div>
                <label for="out">Saída</label>
                <select
                    name="out"
                    id="out"
                    on:change={(e) => trocaSaida(e, entrada)}
                >
                    {#each estados as estado (estado.id) }
                        <option value="{estado.id}" selected={dados.estado(entrada).id == estado.id}>Estado {estado.id}</option>
                    {/each}
                </select>
            </div>
        </div>
    {/each}

    <hr>
    
    <button class="add">
        <Icon file="connect"></Icon>
        Adicionar conexão
    </button>
</div>


<!--Estrutura lógica-->
<script lang="ts">

    import Estado from '../../classes/Estado'
    import Icon from '../Icon.svelte'

    // Visível para ser lida a partir de propriedades externas
    export let x: number = 16;
    export let y: number = 16;
    export let bgColor: number[] = [230, 230, 230];
    export let selecionado = false;
    export let dados: Estado = null;
    export let nome = 'Estado';

    export let alfabeto = [...'abcdefghijklmnopqrstuvwxyz'];
    export let estados = [new Estado('0'), new Estado('1'), new Estado('2')];

    function trocaEntrada( evento: Event, entrada: string )
    {
        const alvo = evento.target as any;

        // Tenta trocar a entrada do estado atual
        if ( dados.trocaEntrada( entrada, alvo.value ) )
            // Força re-renderização do Svelte
            dados.mapa = dados.mapa;
    }

    function trocaSaida( evento: Event, entrada: string )
    {
        const alvo = evento.target as any;
        const novoEstado = estados[ alvo.value ];

        if ( novoEstado )
        {
            // Atualiza o novo estado
            dados.atualiza( entrada, novoEstado );

            // Força re-renderização do Svelte
            dados.mapa = dados.mapa;
        }
    }
</script>


<!--Estilização-->
<style>
    hr
    {
        border: 0;
        margin: 16px 0px;
        width: 100%;
        height: 1px;
        background-color: rgba(0, 0, 0, 0.2);
    }

    select
    {
        border-radius: 16px;
    }

    .add
    {
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: 8px;
    }

    .state
    {
        user-select: none;
        
        display: inline-block;
        position: absolute;
        
        border: 1px solid rgba(0, 0, 0, 0.2);
        border-radius: 16px;
        padding: 8px 16px;
        
        min-width: 160px;
        min-height: 120px;
        
        background-color: lightgrey;
        box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.2);
    }

    .selected
    {
        cursor: grab;
        border: 4px solid rgba(0, 255, 32, 0.5);
    }

    .row
    {
        display: flex;
        flex-direction: row;
    }

    .arrow
    {
        display: flex;
        justify-content: center;
        align-items: center;
        min-width: 48px;
    }
</style>