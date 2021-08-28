<!--div class="row">
    <div>
        <label for="in">Símbolo</label>
        <select
            name="in"
            id="in"
            on:change={(e) => trocaEntrada(e, entrada)}
        >
            <!--Remove as opções que já estão mapeadas mas se mantém na lista>
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
        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="24" height="24">
            <use xlink:href="/assets/arrow-forward-outline.svg#arrow"/>
        </svg>
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

<script lang="ts">
    export let salve = 1;
</script-->