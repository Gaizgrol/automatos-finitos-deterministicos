import type AFD from '../classes/AFD';
import type { Writable } from 'svelte/store';

interface AFDPool
{
    [key: string]: Writable<AFD>;
};

const afds: AFDPool =  {};

export default afds;
