export default class Estado
{
    // ID não deve ser alterado durante execução
    private readonly id: string;
    private mapa: Map<string, Estado>;

    constructor( id: string )
    {
        this.id = id;
        this.mapa = new Map();
    }

    /**
     * Troca uma entrada (símbolo) que já estava mapeada para um estado de saída
     * 
     * @param simboloAnterior Símbolo que será substituído
     * @param novoSimbolo Símbolo novo, entrará no lugar do anterior
     * @returns 
     */
    trocaEntrada( simboloAnterior: string, novoSimbolo: string ): boolean
    {
        const estado = this.estado( simboloAnterior );

        // Se existe um mapeamento anterior e não vamos sobrescrever nenhum outro mapeamento
        if ( estado && !this.mapa.has( novoSimbolo ) )
        {
            // Remove mapeamento anterior
            this.mapa.delete( simboloAnterior );

            // Adiciona novo mapeamento
            this.mapa.set( novoSimbolo, estado )

            // Tudo certo
            return true;
        }

        // Não rolou a troca de entrada
        return false;
    }

    /**
     * Atualiza um mapeamento (Símbolo → Estado) ou insere um novo caso não exista
     * 
     * @param simbolo 
     * @param estado 
     */
    atualiza( simbolo: string, estado: Estado ): void
    {
        this.mapa.set( simbolo, estado );
    }

    /**
     * Encontra o Estado mapeado de acordo com o Símbolo passado
     * 
     * @param simbolo Símbolo de entrada
     * @returns Estado mapeado. Caso não exista, retorna null
     */
    estado( simbolo: string ): Estado
    {
        return this.mapa.get( simbolo ) ?? null;
    }


    /**
     * Parecido com o método `estado`, porém quando não há mapeamento retorna uma referência própria
     * 
     * @param simbolo Símbolo de entrada
     * @returns Estado mapeado. Caso não exista, retorna uma referência própria
     */
    transicao( simbolo: string ): Estado
    {
        // Caso não tenha mapeamento, continue no estado atual
        return this.estado( simbolo ) ?? this;
    }
}
