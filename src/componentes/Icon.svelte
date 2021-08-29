<svg
    xmlns="http://www.w3.org/2000/svg"
    xmlns:xlink="http://www.w3.org/1999/xlink"
    width={w}
    height={h}
    {style}
>
    <use xlink:href="assets/svg/{file}.svg#icon"/>
</svg>


<script lang="ts">
    
    // Visíveis externamente
    export let file: string;
    export let w: number = 32;
    export let h: number = 32;
    export let style: string = '';

</script>
