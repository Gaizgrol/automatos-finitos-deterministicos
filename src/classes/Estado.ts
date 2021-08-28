export default class Estado
{
    id: string;
    mapa: Map<string, Estado>;

    constructor( id: string )
    {
        this.id = id;
        this.mapa = new Map();
    }

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

    atualiza( simbolo: string, estado: Estado ): void
    {
        this.mapa.set( simbolo, estado );
    }

    estado( simbolo: string ): Estado
    {
        return this.mapa.get( simbolo );
    }

    transicao( simbolo: string ): Estado
    {
        // Caso não tenha mapeamento, continue no estado atual
        return this.estado( simbolo ) ?? this;
    }
}
