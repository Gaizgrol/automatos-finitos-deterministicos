export const numeroAleatorio = ( min: number, max: number ): number => min + Math.random() * ( max - min );
export const inteiroAleatorio = ( min: number, max: number ): number => Math.trunc( numeroAleatorio( min, max ) );
export const elementoAleatorio = ( elemento: string | Array<any> ): ( string | any ) => elemento[ inteiroAleatorio( 0, elemento.length ) ];
