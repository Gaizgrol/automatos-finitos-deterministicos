import AFD from "../classes/AFD";
import Estado from "../classes/Estado";

const intervalo = (base: Estado, alvo: Estado, alfa: string[], min: number, max: number) =>
{
    for ( let i=min; i<=max; i++ )
        base.atualiza( alfa[i], alvo );
}

const numsParaEstado = (base: Estado, alvo: Estado, alfa: string[], inv: Estado) =>
{
    // Numeros são aceitos
    for ( let i=0; i<=9; i++ )
        base.atualiza( alfa[i], alvo );
    // Qualquer outra coisa é inválida
    intervalo( base, inv, alfa, 10, alfa.length-1);
}

const configuraCep = (): AFD =>
{
    const alfa = '0123456789-'.split('');
    const afdCep = new AFD( alfa, [], [] );

    for ( const nome of ['Número 1', 'Número 2', 'Número 3', 'Número 4', 'Número 5', 'Traço', 'Número 6', 'Número 7', 'Número 8', 'Válido', 'Inválido'] )
        afdCep.adicionaEstado( new Estado( nome ) );
    
    const ss = afdCep.estados;
    const inv = ss[10]

    afdCep.configuraInicial( ss[0] );
    
    for (let i=0; i<5; i++)
        numsParaEstado( ss[i], ss[i+1], alfa, inv );
    ss[5].atualiza( '-', ss[6] );
    intervalo( ss[5], inv, alfa, 0, 9 );
    intervalo( ss[5], inv, alfa, 11, alfa.length-1 );
    for (let i=6; i<9; i++)
        numsParaEstado( ss[i], ss[i+1], alfa, inv );
    intervalo( ss[9], inv, alfa, 0, alfa.length-1 );

    afdCep.adicionaFinal( ss[9] );
    
    return afdCep;
}

function configuraEmail(): AFD
{
    const alfa = 'abcdefghijklmnopqrstuvwxyz@.'.split('')
    const afdData = new AFD( alfa, [], [] );
    //                     0     1      2      3         4
    for ( const nome of ['1L', 'NL', '1LDA', 'NLDA', 'Inválido'] )
        afdData.adicionaEstado( new Estado( nome ) );
    
    const ss = afdData.estados;
    const inv = ss[4];

    // Começa da primeira letra
    afdData.configuraInicial( ss[0] );

    // Primeira Letra Antes do Arroba
    intervalo( ss[0], ss[1], alfa, 0, 25 ); // Pode começar com qualquer letra
    intervalo( ss[0], inv, alfa, 26, 27 );  // Não pode começar com @ ou .

    // N-ésima Letra Antes do Arroba    // Qualquer letra volta para si mesmo
    ss[1].atualiza( '.', ss[0] );       // Ponto antes do @, manda de volta pra primeira letra
    ss[1].atualiza( '@', ss[2] );       // Pode ser um @, manda pro estado de primeira letra após @

    // Primeira Letra Depois do Arroba      
    intervalo( ss[2], ss[3], alfa, 0, 25 ); // Pode começar com qualquer letra
    intervalo( ss[2], inv, alfa, 26, 27 );  // Não pode começar com @ ou .

    // N-ésima Letra Depois do Arroba   // Qualquer letra volta para si mesmo
    ss[3].atualiza( '.', ss[2] );       // Pode ser um ., manda pro estado de primeira letra após @
    ss[3].atualiza( '@', inv );         // Não pode @ depois do @
    
    // Uma ou mais letras após o ponto são válidas
    afdData.adicionaFinal( ss[3] );

    return afdData;
}

export const cep = configuraCep();
export const email = configuraEmail();
export const vazio = new AFD( [], [], [] );
