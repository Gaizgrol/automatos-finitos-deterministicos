export default class Estado
{
    private readonly _id: string;
    private readonly _mapa: Map<string, Estado>;

    constructor( id: string )
    {
        this._id = id;
        this._mapa = new Map();
    }

    /**
     * ID não deve ser modificado
     */
    get id()
    {
        return this._id;
    }

    /**
     * Devolve um array de símbolos de entrada que mapeiam para um estado diferente
     */
    get entradas(): string[]
    {
        return [...this._mapa.keys()]
    }

    /**
     * Verifica se existe mapeamento para o símbolo
     * 
     * @param simbolo 
     */
    contem( simbolo: string ): boolean
    {
        return this._mapa.has( simbolo );
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
        if ( estado && !this._mapa.has( novoSimbolo ) )
        {
            // Remove mapeamento anterior
            this._mapa.delete( simboloAnterior );

            // Adiciona novo mapeamento
            this._mapa.set( novoSimbolo, estado )

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
        if ( estado !== this )
            this._mapa.set( simbolo, estado );
        else
            this._mapa.delete( simbolo );
    }

    /**
     * Encontra o Estado mapeado de acordo com o Símbolo passado
     * 
     * @param simbolo Símbolo de entrada
     * @returns Estado mapeado. Caso não exista, retorna null
     */
    estado( simbolo: string ): Estado
    {
        return this._mapa.get( simbolo ) ?? null;
    }

    removeEstado( estado: Estado )
    {
        for ( const entrada of this._mapa.keys() )
            if ( this._mapa.get( entrada ) === estado )
                this._mapa.delete( entrada );
    }

    remapeia( alfabeto: string[] )
    {
        for ( const entrada of this._mapa.keys() )
            if ( !alfabeto.includes( entrada ) )
                this._mapa.delete( entrada );
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
