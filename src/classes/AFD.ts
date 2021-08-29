import type Estado from './Estado';

export default class AFD
{
    private _alfabeto: string[];
    private _estados: Estado[];
    private _finais: Estado[];
    private _inicial: Estado;
    public nome: string;

    constructor( alfabeto: string[], estados: Estado[], estadosFinais: Estado[], estadoInicial?: Estado, nomeAutom: string = 'AFD' )
    {
        const alfa = alfabeto;
        const estds = estados;
        const finais = estadosFinais;
        const start = estadoInicial;

        if ( !finais.every( estado => finais.includes( estado ) ) )
            throw new Error( 'Todos os estados finais precisam estar contidos na lista de estados!' );
        if ( estadoInicial )
            this.configuraInicial( estadoInicial );

        this._alfabeto = alfa;
        this._estados = estds;
        this._finais = finais;
        this._inicial = start;
        this.nome = nomeAutom;
    }

    get alfabeto()
    {
        return this._alfabeto;
    }

    set alfabeto( novoAlfabeto: string[] )
    {
        this._alfabeto = novoAlfabeto;

        for ( const estado of this._estados )
            estado.remapeia( novoAlfabeto );
    }

    get estados()
    {
        return this._estados;
    }

    get finais()
    {
        return this._finais;
    }

    get inicial()
    {
        return this._inicial;
    }

    configuraInicial( estado: Estado )
    {
        if ( !this._estados.includes( estado ) )
            throw new Error( 'O estado inicial precisa estar contido na lista de estados!' );
        
        this._inicial = estado;
    }

    adicionaEstado( estado: Estado )
    {
        if ( !this.estados.includes( estado ) )
            this.estados.push( estado );
    }

    removeEstado( removido: Estado )
    {
        const index: number = this.estados.indexOf( removido );
        if ( index >= 0 )
        {
            this.estados.splice( index, 1 );
            // Caso esteja, remova dos estados finais
            this.removeFinal( removido );

            if ( removido === this._inicial )
                this._inicial = null;

            // Remove todas as referências
            for ( const estado of this.estados )
                estado.removeEstado( removido );
        }
    }

    adicionaFinal( estado: Estado ): void
    {
        if ( !this.finais.includes( estado ) )
            this.finais.push( estado );
    }

    removeFinal( estado: Estado ): void
    {
        const index: number = this.finais.indexOf( estado );
        if ( index >= 0 )
            this.finais.splice( index, 1 );
    }
}
