
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
var app = (function () {
    'use strict';

    function noop() { }
    function assign(tar, src) {
        // @ts-ignore
        for (const k in src)
            tar[k] = src[k];
        return tar;
    }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }
    function validate_store(store, name) {
        if (store != null && typeof store.subscribe !== 'function') {
            throw new Error(`'${name}' is not a store with a 'subscribe' method`);
        }
    }
    function subscribe(store, ...callbacks) {
        if (store == null) {
            return noop;
        }
        const unsub = store.subscribe(...callbacks);
        return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
    }
    function component_subscribe(component, store, callback) {
        component.$$.on_destroy.push(subscribe(store, callback));
    }
    function null_to_empty(value) {
        return value == null ? '' : value;
    }
    function set_store_value(store, ret, value) {
        store.set(value);
        return ret;
    }
    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function svg_element(name) {
        return document.createElementNS('http://www.w3.org/2000/svg', name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function empty() {
        return text('');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function xlink_attr(node, attribute, value) {
        node.setAttributeNS('http://www.w3.org/1999/xlink', attribute, value);
    }
    function to_number(value) {
        return value === '' ? null : +value;
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_input_value(input, value) {
        input.value = value == null ? '' : value;
    }
    function set_style(node, key, value, important) {
        node.style.setProperty(key, value, important ? 'important' : '');
    }
    function select_option(select, value) {
        for (let i = 0; i < select.options.length; i += 1) {
            const option = select.options[i];
            if (option.__value === value) {
                option.selected = true;
                return;
            }
        }
        select.selectedIndex = -1; // no option should be selected
    }
    function select_value(select) {
        const selected_option = select.querySelector(':checked') || select.options[0];
        return selected_option && selected_option.__value;
    }
    function custom_event(type, detail, bubbles = false) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, bubbles, false, detail);
        return e;
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    let flushing = false;
    const seen_callbacks = new Set();
    function flush() {
        if (flushing)
            return;
        flushing = true;
        do {
            // first, call beforeUpdate functions
            // and update components
            for (let i = 0; i < dirty_components.length; i += 1) {
                const component = dirty_components[i];
                set_current_component(component);
                update(component.$$);
            }
            set_current_component(null);
            dirty_components.length = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        flushing = false;
        seen_callbacks.clear();
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }
    const outroing = new Set();
    let outros;
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
    }

    function destroy_block(block, lookup) {
        block.d(1);
        lookup.delete(block.key);
    }
    function outro_and_destroy_block(block, lookup) {
        transition_out(block, 1, 1, () => {
            lookup.delete(block.key);
        });
    }
    function update_keyed_each(old_blocks, dirty, get_key, dynamic, ctx, list, lookup, node, destroy, create_each_block, next, get_context) {
        let o = old_blocks.length;
        let n = list.length;
        let i = o;
        const old_indexes = {};
        while (i--)
            old_indexes[old_blocks[i].key] = i;
        const new_blocks = [];
        const new_lookup = new Map();
        const deltas = new Map();
        i = n;
        while (i--) {
            const child_ctx = get_context(ctx, list, i);
            const key = get_key(child_ctx);
            let block = lookup.get(key);
            if (!block) {
                block = create_each_block(key, child_ctx);
                block.c();
            }
            else if (dynamic) {
                block.p(child_ctx, dirty);
            }
            new_lookup.set(key, new_blocks[i] = block);
            if (key in old_indexes)
                deltas.set(key, Math.abs(i - old_indexes[key]));
        }
        const will_move = new Set();
        const did_move = new Set();
        function insert(block) {
            transition_in(block, 1);
            block.m(node, next);
            lookup.set(block.key, block);
            next = block.first;
            n--;
        }
        while (o && n) {
            const new_block = new_blocks[n - 1];
            const old_block = old_blocks[o - 1];
            const new_key = new_block.key;
            const old_key = old_block.key;
            if (new_block === old_block) {
                // do nothing
                next = new_block.first;
                o--;
                n--;
            }
            else if (!new_lookup.has(old_key)) {
                // remove old block
                destroy(old_block, lookup);
                o--;
            }
            else if (!lookup.has(new_key) || will_move.has(new_key)) {
                insert(new_block);
            }
            else if (did_move.has(old_key)) {
                o--;
            }
            else if (deltas.get(new_key) > deltas.get(old_key)) {
                did_move.add(new_key);
                insert(new_block);
            }
            else {
                will_move.add(old_key);
                o--;
            }
        }
        while (o--) {
            const old_block = old_blocks[o];
            if (!new_lookup.has(old_block.key))
                destroy(old_block, lookup);
        }
        while (n)
            insert(new_blocks[n - 1]);
        return new_blocks;
    }
    function validate_each_keys(ctx, list, get_context, get_key) {
        const keys = new Set();
        for (let i = 0; i < list.length; i++) {
            const key = get_key(get_context(ctx, list, i));
            if (keys.has(key)) {
                throw new Error('Cannot have duplicate keys in a keyed each');
            }
            keys.add(key);
        }
    }

    function get_spread_update(levels, updates) {
        const update = {};
        const to_null_out = {};
        const accounted_for = { $$scope: 1 };
        let i = levels.length;
        while (i--) {
            const o = levels[i];
            const n = updates[i];
            if (n) {
                for (const key in o) {
                    if (!(key in n))
                        to_null_out[key] = 1;
                }
                for (const key in n) {
                    if (!accounted_for[key]) {
                        update[key] = n[key];
                        accounted_for[key] = 1;
                    }
                }
                levels[i] = n;
            }
            else {
                for (const key in o) {
                    accounted_for[key] = 1;
                }
            }
        }
        for (const key in to_null_out) {
            if (!(key in update))
                update[key] = undefined;
        }
        return update;
    }
    function get_spread_object(spread_props) {
        return typeof spread_props === 'object' && spread_props !== null ? spread_props : {};
    }
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor, customElement) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
            // onMount happens before the initial afterUpdate
            add_render_callback(() => {
                const new_on_destroy = on_mount.map(run).filter(is_function);
                if (on_destroy) {
                    on_destroy.push(...new_on_destroy);
                }
                else {
                    // Edge case - component was destroyed immediately,
                    // most likely as a result of a binding initialising
                    run_all(new_on_destroy);
                }
                component.$$.on_mount = [];
            });
        }
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, append_styles, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            on_disconnect: [],
            before_update: [],
            after_update: [],
            context: new Map(parent_component ? parent_component.$$.context : options.context || []),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false,
            root: options.target || parent_component.$$.root
        };
        append_styles && append_styles($$.root);
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor, options.customElement);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.42.4' }, detail), true));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function prop_dev(node, property, value) {
        node[property] = value;
        dispatch_dev('SvelteDOMSetProperty', { node, property, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.wholeText === data)
            return;
        dispatch_dev('SvelteDOMSetData', { node: text, data });
        text.data = data;
    }
    function validate_each_argument(arg) {
        if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
            let msg = '{#each} only iterates over array-like objects.';
            if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
                msg += ' You can use a spread to convert this iterable into an array.';
            }
            throw new Error(msg);
        }
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    class AFD {
        constructor(alfabeto, estados, estadosFinais, estadoInicial, nomeAutom = 'AFD') {
            const alfa = alfabeto;
            const estds = estados;
            const finais = estadosFinais;
            const start = estadoInicial;
            if (!finais.every(estado => finais.includes(estado)))
                throw new Error('Todos os estados finais precisam estar contidos na lista de estados!');
            if (estadoInicial)
                this.configuraInicial(estadoInicial);
            this._alfabeto = alfa;
            this._estados = estds;
            this._finais = finais;
            this._inicial = start;
            this.nome = nomeAutom;
        }
        get alfabeto() {
            return this._alfabeto;
        }
        set alfabeto(novoAlfabeto) {
            this._alfabeto = novoAlfabeto;
            for (const estado of this._estados)
                estado.remapeia(novoAlfabeto);
        }
        get estados() {
            return this._estados;
        }
        get finais() {
            return this._finais;
        }
        get inicial() {
            return this._inicial;
        }
        configuraInicial(estado) {
            if (!this._estados.includes(estado))
                throw new Error('O estado inicial precisa estar contido na lista de estados!');
            this._inicial = estado;
        }
        adicionaEstado(estado) {
            if (!this.estados.includes(estado))
                this.estados.push(estado);
        }
        removeEstado(removido) {
            const index = this.estados.indexOf(removido);
            if (index >= 0) {
                this.estados.splice(index, 1);
                // Caso esteja, remova dos estados finais
                this.removeFinal(removido);
                if (removido === this._inicial)
                    this._inicial = null;
                // Remove todas as referências
                for (const estado of this.estados)
                    estado.removeEstado(removido);
            }
        }
        adicionaFinal(estado) {
            if (!this.finais.includes(estado))
                this.finais.push(estado);
        }
        removeFinal(estado) {
            const index = this.finais.indexOf(estado);
            if (index >= 0)
                this.finais.splice(index, 1);
        }
    }

    class Estado$1 {
        constructor(id) {
            this._id = id;
            this._mapa = new Map();
        }
        /**
         * ID não deve ser modificado
         */
        get id() {
            return this._id;
        }
        /**
         * Devolve um array de símbolos de entrada que mapeiam para um estado diferente
         */
        get entradas() {
            return [...this._mapa.keys()];
        }
        /**
         * Verifica se existe mapeamento para o símbolo
         *
         * @param simbolo
         */
        contem(simbolo) {
            return this._mapa.has(simbolo);
        }
        /**
         * Troca uma entrada (símbolo) que já estava mapeada para um estado de saída
         *
         * @param simboloAnterior Símbolo que será substituído
         * @param novoSimbolo Símbolo novo, entrará no lugar do anterior
         * @returns
         */
        trocaEntrada(simboloAnterior, novoSimbolo) {
            const estado = this.estado(simboloAnterior);
            // Se existe um mapeamento anterior e não vamos sobrescrever nenhum outro mapeamento
            if (estado && !this._mapa.has(novoSimbolo)) {
                // Remove mapeamento anterior
                this._mapa.delete(simboloAnterior);
                // Adiciona novo mapeamento
                this._mapa.set(novoSimbolo, estado);
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
        atualiza(simbolo, estado) {
            if (estado !== this)
                this._mapa.set(simbolo, estado);
            else
                this._mapa.delete(simbolo);
        }
        /**
         * Encontra o Estado mapeado de acordo com o Símbolo passado
         *
         * @param simbolo Símbolo de entrada
         * @returns Estado mapeado. Caso não exista, retorna null
         */
        estado(simbolo) {
            var _a;
            return (_a = this._mapa.get(simbolo)) !== null && _a !== void 0 ? _a : null;
        }
        removeEstado(estado) {
            for (const entrada of this._mapa.keys())
                if (this._mapa.get(entrada) === estado)
                    this._mapa.delete(entrada);
        }
        remapeia(alfabeto) {
            for (const entrada of this._mapa.keys())
                if (!alfabeto.includes(entrada))
                    this._mapa.delete(entrada);
        }
        /**
         * Parecido com o método `estado`, porém quando não há mapeamento retorna uma referência própria
         *
         * @param simbolo Símbolo de entrada
         * @returns Estado mapeado. Caso não exista, retorna uma referência própria
         */
        transicao(simbolo) {
            var _a;
            // Caso não tenha mapeamento, continue no estado atual
            return (_a = this.estado(simbolo)) !== null && _a !== void 0 ? _a : this;
        }
    }

    const intervalo = (base, alvo, alfa, min, max) => {
        for (let i = min; i <= max; i++)
            base.atualiza(alfa[i], alvo);
    };
    const numsParaEstado = (base, alvo, alfa, inv) => {
        // Numeros são aceitos
        for (let i = 0; i <= 9; i++)
            base.atualiza(alfa[i], alvo);
        // Qualquer outra coisa é inválida
        intervalo(base, inv, alfa, 10, alfa.length - 1);
    };
    const configuraCep = () => {
        const alfa = '0123456789-'.split('');
        const afdCep = new AFD(alfa, [], []);
        for (const nome of ['Número 1', 'Número 2', 'Número 3', 'Número 4', 'Número 5', 'Traço', 'Número 6', 'Número 7', 'Número 8', 'Válido', 'Inválido'])
            afdCep.adicionaEstado(new Estado$1(nome));
        const ss = afdCep.estados;
        const inv = ss[10];
        afdCep.configuraInicial(ss[0]);
        for (let i = 0; i < 5; i++)
            numsParaEstado(ss[i], ss[i + 1], alfa, inv);
        ss[5].atualiza('-', ss[6]);
        intervalo(ss[5], inv, alfa, 0, 9);
        intervalo(ss[5], inv, alfa, 11, alfa.length - 1);
        for (let i = 6; i < 9; i++)
            numsParaEstado(ss[i], ss[i + 1], alfa, inv);
        intervalo(ss[9], inv, alfa, 0, alfa.length - 1);
        afdCep.adicionaFinal(ss[9]);
        return afdCep;
    };
    function configuraEmail() {
        const alfa = 'abcdefghijklmnopqrstuvwxyz@.'.split('');
        const afdData = new AFD(alfa, [], []);
        //                     0     1      2      3         4
        for (const nome of ['1L', 'NL', '1LDA', 'NLDA', 'Inválido'])
            afdData.adicionaEstado(new Estado$1(nome));
        const ss = afdData.estados;
        const inv = ss[4];
        // Começa da primeira letra
        afdData.configuraInicial(ss[0]);
        // Primeira Letra Antes do Arroba
        intervalo(ss[0], ss[1], alfa, 0, 25); // Pode começar com qualquer letra
        intervalo(ss[0], inv, alfa, 26, 27); // Não pode começar com @ ou .
        // N-ésima Letra Antes do Arroba    // Qualquer letra volta para si mesmo
        ss[1].atualiza('.', ss[0]); // Ponto antes do @, manda de volta pra primeira letra
        ss[1].atualiza('@', ss[2]); // Pode ser um @, manda pro estado de primeira letra após @
        // Primeira Letra Depois do Arroba      
        intervalo(ss[2], ss[3], alfa, 0, 25); // Pode começar com qualquer letra
        intervalo(ss[2], inv, alfa, 26, 27); // Não pode começar com @ ou .
        // N-ésima Letra Depois do Arroba   // Qualquer letra volta para si mesmo
        ss[3].atualiza('.', ss[2]); // Pode ser um ., manda pro estado de primeira letra após @
        ss[3].atualiza('@', inv); // Não pode @ depois do @
        // Uma ou mais letras após o ponto são válidas
        afdData.adicionaFinal(ss[3]);
        return afdData;
    }
    const cep = configuraCep();
    const email = configuraEmail();
    const vazio = new AFD([], [], []);

    const numeroAleatorio = (min, max) => min + Math.random() * (max - min);
    const inteiroAleatorio = (min, max) => Math.trunc(numeroAleatorio(min, max));

    /* src\componentes\Titulo.svelte generated by Svelte v3.42.4 */
    const file$3 = "src\\componentes\\Titulo.svelte";

    function get_each_context$2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[2] = list[i];
    	child_ctx[4] = i;
    	return child_ctx;
    }

    // (3:4) {#each palavras as palavra, i}
    function create_each_block$2(ctx) {
    	let span;
    	let t0_value = /*palavra*/ ctx[2] + "";
    	let t0;
    	let t1;
    	let span_class_value;

    	const block = {
    		c: function create() {
    			span = element("span");
    			t0 = text(t0_value);
    			t1 = space();

    			attr_dev(span, "class", span_class_value = "suave " + (/*i*/ ctx[4] === /*palavras*/ ctx[1].length - 1
    			? 'italico'
    			: 'titulo') + " " + (/*palavraSelecionada*/ ctx[0] === /*i*/ ctx[4]
    			? 'selecionado'
    			: '') + " svelte-1bn3hvh");

    			add_location(span, file$3, 3, 8, 108);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    			append_dev(span, t0);
    			append_dev(span, t1);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*palavraSelecionada*/ 1 && span_class_value !== (span_class_value = "suave " + (/*i*/ ctx[4] === /*palavras*/ ctx[1].length - 1
    			? 'italico'
    			: 'titulo') + " " + (/*palavraSelecionada*/ ctx[0] === /*i*/ ctx[4]
    			? 'selecionado'
    			: '') + " svelte-1bn3hvh")) {
    				attr_dev(span, "class", span_class_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$2.name,
    		type: "each",
    		source: "(3:4) {#each palavras as palavra, i}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$4(ctx) {
    	let h1;
    	let each_value = /*palavras*/ ctx[1];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$2(get_each_context$2(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			h1 = element("h1");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			add_location(h1, file$3, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h1, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(h1, null);
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*palavras, palavraSelecionada*/ 3) {
    				each_value = /*palavras*/ ctx[1];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$2(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$2(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(h1, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h1);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$4.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$4($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Titulo', slots, []);
    	const palavras = ('Autômatos Finitos Determinísticos: Playground').split(' ');

    	// Índice da palavra
    	let palavraSelecionada = inteiroAleatorio(0, palavras.length);

    	setInterval(
    		() => {
    			// Não acende a mesma palavra
    			let anterior = palavraSelecionada;

    			do {
    				$$invalidate(0, palavraSelecionada = inteiroAleatorio(0, palavras.length));
    			} while (palavraSelecionada === anterior);
    		},
    		1000
    	);

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Titulo> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		inteiroAleatorio,
    		palavras,
    		palavraSelecionada
    	});

    	$$self.$inject_state = $$props => {
    		if ('palavraSelecionada' in $$props) $$invalidate(0, palavraSelecionada = $$props.palavraSelecionada);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [palavraSelecionada, palavras];
    }

    class Titulo extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Titulo",
    			options,
    			id: create_fragment$4.name
    		});
    	}
    }

    /* src\componentes\Icon.svelte generated by Svelte v3.42.4 */

    const file_1 = "src\\componentes\\Icon.svelte";

    function create_fragment$3(ctx) {
    	let svg;
    	let use;
    	let use_xlink_href_value;

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			use = svg_element("use");
    			xlink_attr(use, "xlink:href", use_xlink_href_value = "assets/svg/" + /*file*/ ctx[0] + ".svg#icon");
    			add_location(use, file_1, 7, 4, 145);
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "xmlns:xlink", "http://www.w3.org/1999/xlink");
    			attr_dev(svg, "width", /*w*/ ctx[1]);
    			attr_dev(svg, "height", /*h*/ ctx[2]);
    			attr_dev(svg, "style", /*style*/ ctx[3]);
    			add_location(svg, file_1, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			append_dev(svg, use);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*file*/ 1 && use_xlink_href_value !== (use_xlink_href_value = "assets/svg/" + /*file*/ ctx[0] + ".svg#icon")) {
    				xlink_attr(use, "xlink:href", use_xlink_href_value);
    			}

    			if (dirty & /*w*/ 2) {
    				attr_dev(svg, "width", /*w*/ ctx[1]);
    			}

    			if (dirty & /*h*/ 4) {
    				attr_dev(svg, "height", /*h*/ ctx[2]);
    			}

    			if (dirty & /*style*/ 8) {
    				attr_dev(svg, "style", /*style*/ ctx[3]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$3($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Icon', slots, []);
    	let { file } = $$props;
    	let { w = 32 } = $$props;
    	let { h = 32 } = $$props;
    	let { style = '' } = $$props;
    	const writable_props = ['file', 'w', 'h', 'style'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Icon> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('file' in $$props) $$invalidate(0, file = $$props.file);
    		if ('w' in $$props) $$invalidate(1, w = $$props.w);
    		if ('h' in $$props) $$invalidate(2, h = $$props.h);
    		if ('style' in $$props) $$invalidate(3, style = $$props.style);
    	};

    	$$self.$capture_state = () => ({ file, w, h, style });

    	$$self.$inject_state = $$props => {
    		if ('file' in $$props) $$invalidate(0, file = $$props.file);
    		if ('w' in $$props) $$invalidate(1, w = $$props.w);
    		if ('h' in $$props) $$invalidate(2, h = $$props.h);
    		if ('style' in $$props) $$invalidate(3, style = $$props.style);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [file, w, h, style];
    }

    class Icon extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, { file: 0, w: 1, h: 2, style: 3 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Icon",
    			options,
    			id: create_fragment$3.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*file*/ ctx[0] === undefined && !('file' in props)) {
    			console.warn("<Icon> was created without expected prop 'file'");
    		}
    	}

    	get file() {
    		throw new Error("<Icon>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set file(value) {
    		throw new Error("<Icon>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get w() {
    		throw new Error("<Icon>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set w(value) {
    		throw new Error("<Icon>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get h() {
    		throw new Error("<Icon>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set h(value) {
    		throw new Error("<Icon>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get style() {
    		throw new Error("<Icon>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set style(value) {
    		throw new Error("<Icon>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    const afds = {};

    /* src\componentes\Playground\Estado.svelte generated by Svelte v3.42.4 */
    const file$2 = "src\\componentes\\Playground\\Estado.svelte";

    function get_each_context$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[33] = list[i];
    	return child_ctx;
    }

    function get_each_context_1$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[36] = list[i];
    	return child_ctx;
    }

    function get_each_context_2$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[39] = list[i];
    	return child_ctx;
    }

    function get_each_context_3(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[33] = list[i];
    	return child_ctx;
    }

    function get_each_context_4(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[36] = list[i];
    	return child_ctx;
    }

    // (21:12) {#if editavel}
    function create_if_block_4(ctx) {
    	let div;
    	let icon;
    	let current;
    	let mounted;
    	let dispose;
    	icon = new Icon({ props: { file: "trash" }, $$inline: true });

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(icon.$$.fragment);
    			attr_dev(div, "class", "delete svelte-gaq17w");
    			add_location(div, file$2, 21, 16, 546);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(icon, div, null);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(div, "click", /*apagaEstado*/ ctx[17], false, false, false);
    				mounted = true;
    			}
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(icon.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(icon.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(icon);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_4.name,
    		type: "if",
    		source: "(21:12) {#if editavel}",
    		ctx
    	});

    	return block;
    }

    // (28:8) {#if editavel}
    function create_if_block_3$1(ctx) {
    	let hr;
    	let t0;
    	let div2;
    	let div0;
    	let input0;
    	let input0_id_value;
    	let t1;
    	let label0;
    	let t2;
    	let label0_for_value;
    	let t3;
    	let div1;
    	let input1;
    	let input1_id_value;
    	let t4;
    	let label1;
    	let t5;
    	let label1_for_value;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			hr = element("hr");
    			t0 = space();
    			div2 = element("div");
    			div0 = element("div");
    			input0 = element("input");
    			t1 = space();
    			label0 = element("label");
    			t2 = text("Final");
    			t3 = space();
    			div1 = element("div");
    			input1 = element("input");
    			t4 = space();
    			label1 = element("label");
    			t5 = text("Inicial");
    			attr_dev(hr, "class", "svelte-gaq17w");
    			add_location(hr, file$2, 28, 12, 735);
    			attr_dev(input0, "id", input0_id_value = "final-" + /*estado*/ ctx[0].id);
    			attr_dev(input0, "type", "checkbox");
    			input0.checked = /*ehFinal*/ ctx[11];
    			attr_dev(input0, "class", "svelte-gaq17w");
    			add_location(input0, file$2, 33, 20, 897);
    			attr_dev(label0, "for", label0_for_value = "final-" + /*estado*/ ctx[0].id);
    			add_location(label0, file$2, 39, 20, 1127);
    			attr_dev(div0, "class", "row check svelte-gaq17w");
    			add_location(div0, file$2, 32, 16, 852);
    			attr_dev(input1, "id", input1_id_value = "inicial-" + /*estado*/ ctx[0].id);
    			attr_dev(input1, "type", "radio");
    			input1.checked = /*ehInicial*/ ctx[10];
    			attr_dev(input1, "class", "svelte-gaq17w");
    			add_location(input1, file$2, 42, 20, 1258);
    			attr_dev(label1, "for", label1_for_value = "inicial-" + /*estado*/ ctx[0].id);
    			add_location(label1, file$2, 48, 20, 1491);
    			attr_dev(div1, "class", "row check svelte-gaq17w");
    			add_location(div1, file$2, 41, 16, 1213);
    			attr_dev(div2, "class", "row check svelte-gaq17w");
    			add_location(div2, file$2, 31, 12, 811);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, hr, anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, div2, anchor);
    			append_dev(div2, div0);
    			append_dev(div0, input0);
    			append_dev(div0, t1);
    			append_dev(div0, label0);
    			append_dev(label0, t2);
    			append_dev(div2, t3);
    			append_dev(div2, div1);
    			append_dev(div1, input1);
    			append_dev(div1, t4);
    			append_dev(div1, label1);
    			append_dev(label1, t5);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input0, "input", /*trocaFinal*/ ctx[21], false, false, false),
    					listen_dev(input1, "input", /*trocaInicial*/ ctx[20], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*estado*/ 1 && input0_id_value !== (input0_id_value = "final-" + /*estado*/ ctx[0].id)) {
    				attr_dev(input0, "id", input0_id_value);
    			}

    			if (dirty[0] & /*ehFinal*/ 2048) {
    				prop_dev(input0, "checked", /*ehFinal*/ ctx[11]);
    			}

    			if (dirty[0] & /*estado*/ 1 && label0_for_value !== (label0_for_value = "final-" + /*estado*/ ctx[0].id)) {
    				attr_dev(label0, "for", label0_for_value);
    			}

    			if (dirty[0] & /*estado*/ 1 && input1_id_value !== (input1_id_value = "inicial-" + /*estado*/ ctx[0].id)) {
    				attr_dev(input1, "id", input1_id_value);
    			}

    			if (dirty[0] & /*ehInicial*/ 1024) {
    				prop_dev(input1, "checked", /*ehInicial*/ ctx[10]);
    			}

    			if (dirty[0] & /*estado*/ 1 && label1_for_value !== (label1_for_value = "inicial-" + /*estado*/ ctx[0].id)) {
    				attr_dev(label1, "for", label1_for_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(hr);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(div2);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3$1.name,
    		type: "if",
    		source: "(28:8) {#if editavel}",
    		ctx
    	});

    	return block;
    }

    // (71:24) {#each $afd.alfabeto.filter( s => !estado.contem( s ) || s === entrada ) as simbolo (simbolo)}
    function create_each_block_4(key_1, ctx) {
    	let option;
    	let t0_value = /*simbolo*/ ctx[36] + "";
    	let t0;
    	let t1;
    	let option_value_value;
    	let option_selected_value;

    	const block = {
    		key: key_1,
    		first: null,
    		c: function create() {
    			option = element("option");
    			t0 = text(t0_value);
    			t1 = space();
    			option.__value = option_value_value = /*simbolo*/ ctx[36];
    			option.value = option.__value;
    			option.selected = option_selected_value = /*simbolo*/ ctx[36] === /*entrada*/ ctx[39];
    			add_location(option, file$2, 71, 28, 2514);
    			this.first = option;
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, option, anchor);
    			append_dev(option, t0);
    			append_dev(option, t1);
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if (dirty[0] & /*$afd, estado*/ 65 && t0_value !== (t0_value = /*simbolo*/ ctx[36] + "")) set_data_dev(t0, t0_value);

    			if (dirty[0] & /*$afd, estado*/ 65 && option_value_value !== (option_value_value = /*simbolo*/ ctx[36])) {
    				prop_dev(option, "__value", option_value_value);
    				option.value = option.__value;
    			}

    			if (dirty[0] & /*$afd, estado*/ 65 && option_selected_value !== (option_selected_value = /*simbolo*/ ctx[36] === /*entrada*/ ctx[39])) {
    				prop_dev(option, "selected", option_selected_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(option);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_4.name,
    		type: "each",
    		source: "(71:24) {#each $afd.alfabeto.filter( s => !estado.contem( s ) || s === entrada ) as simbolo (simbolo)}",
    		ctx
    	});

    	return block;
    }

    // (96:24) {#each $afd.estados.filter( s => s !== estado ) as estadoAFD (estadoAFD.id) }
    function create_each_block_3(key_1, ctx) {
    	let option;

    	let t0_value = (/*$afd*/ ctx[6].finais.includes(/*estadoAFD*/ ctx[33])
    	? '🏁'
    	: '') + "";

    	let t0;
    	let t1;
    	let t2_value = /*estadoAFD*/ ctx[33].id + "";
    	let t2;
    	let t3;
    	let option_value_value;
    	let option_selected_value;

    	const block = {
    		key: key_1,
    		first: null,
    		c: function create() {
    			option = element("option");
    			t0 = text(t0_value);
    			t1 = space();
    			t2 = text(t2_value);
    			t3 = space();
    			option.__value = option_value_value = /*estadoAFD*/ ctx[33].id;
    			option.value = option.__value;
    			option.selected = option_selected_value = /*estado*/ ctx[0].estado(/*entrada*/ ctx[39]).id == /*estadoAFD*/ ctx[33].id;
    			add_location(option, file$2, 96, 28, 3566);
    			this.first = option;
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, option, anchor);
    			append_dev(option, t0);
    			append_dev(option, t1);
    			append_dev(option, t2);
    			append_dev(option, t3);
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (dirty[0] & /*$afd, estado*/ 65 && t0_value !== (t0_value = (/*$afd*/ ctx[6].finais.includes(/*estadoAFD*/ ctx[33])
    			? '🏁'
    			: '') + "")) set_data_dev(t0, t0_value);

    			if (dirty[0] & /*$afd, estado*/ 65 && t2_value !== (t2_value = /*estadoAFD*/ ctx[33].id + "")) set_data_dev(t2, t2_value);

    			if (dirty[0] & /*$afd, estado*/ 65 && option_value_value !== (option_value_value = /*estadoAFD*/ ctx[33].id)) {
    				prop_dev(option, "__value", option_value_value);
    				option.value = option.__value;
    			}

    			if (dirty[0] & /*estado, $afd*/ 65 && option_selected_value !== (option_selected_value = /*estado*/ ctx[0].estado(/*entrada*/ ctx[39]).id == /*estadoAFD*/ ctx[33].id)) {
    				prop_dev(option, "selected", option_selected_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(option);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_3.name,
    		type: "each",
    		source: "(96:24) {#each $afd.estados.filter( s => s !== estado ) as estadoAFD (estadoAFD.id) }",
    		ctx
    	});

    	return block;
    }

    // (107:16) {#if editavel}
    function create_if_block_2$1(ctx) {
    	let div1;
    	let div0;
    	let icon;
    	let current;
    	let mounted;
    	let dispose;
    	icon = new Icon({ props: { file: "trash" }, $$inline: true });

    	function click_handler() {
    		return /*click_handler*/ ctx[27](/*entrada*/ ctx[39]);
    	}

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			create_component(icon.$$.fragment);
    			attr_dev(div0, "class", "delete svelte-gaq17w");
    			add_location(div0, file$2, 109, 24, 4102);
    			add_location(div1, file$2, 108, 20, 4071);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			mount_component(icon, div0, null);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(div0, "click", click_handler, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(icon.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(icon.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			destroy_component(icon);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$1.name,
    		type: "if",
    		source: "(107:16) {#if editavel}",
    		ctx
    	});

    	return block;
    }

    // (58:8) {#each [...estado.entradas] as entrada (entrada)}
    function create_each_block_2$1(key_1, ctx) {
    	let div3;
    	let div0;
    	let label0;
    	let t0;
    	let label0_for_value;
    	let t1;
    	let select0;
    	let each_blocks_1 = [];
    	let each0_lookup = new Map();
    	let select0_id_value;
    	let select0_disabled_value;
    	let t2;
    	let div1;
    	let icon;
    	let t3;
    	let div2;
    	let label1;
    	let t4;
    	let label1_for_value;
    	let t5;
    	let select1;
    	let each_blocks = [];
    	let each1_lookup = new Map();
    	let select1_id_value;
    	let select1_disabled_value;
    	let t6;
    	let t7;
    	let current;
    	let mounted;
    	let dispose;

    	function func(...args) {
    		return /*func*/ ctx[23](/*entrada*/ ctx[39], ...args);
    	}

    	let each_value_4 = /*$afd*/ ctx[6].alfabeto.filter(func);
    	validate_each_argument(each_value_4);
    	const get_key = ctx => /*simbolo*/ ctx[36];
    	validate_each_keys(ctx, each_value_4, get_each_context_4, get_key);

    	for (let i = 0; i < each_value_4.length; i += 1) {
    		let child_ctx = get_each_context_4(ctx, each_value_4, i);
    		let key = get_key(child_ctx);
    		each0_lookup.set(key, each_blocks_1[i] = create_each_block_4(key, child_ctx));
    	}

    	function change_handler(...args) {
    		return /*change_handler*/ ctx[24](/*entrada*/ ctx[39], ...args);
    	}

    	icon = new Icon({
    			props: { file: "arrow-right", w: 24, h: 24 },
    			$$inline: true
    		});

    	let each_value_3 = /*$afd*/ ctx[6].estados.filter(/*func_1*/ ctx[25]);
    	validate_each_argument(each_value_3);
    	const get_key_1 = ctx => /*estadoAFD*/ ctx[33].id;
    	validate_each_keys(ctx, each_value_3, get_each_context_3, get_key_1);

    	for (let i = 0; i < each_value_3.length; i += 1) {
    		let child_ctx = get_each_context_3(ctx, each_value_3, i);
    		let key = get_key_1(child_ctx);
    		each1_lookup.set(key, each_blocks[i] = create_each_block_3(key, child_ctx));
    	}

    	function change_handler_1(...args) {
    		return /*change_handler_1*/ ctx[26](/*entrada*/ ctx[39], ...args);
    	}

    	let if_block = /*editavel*/ ctx[4] && create_if_block_2$1(ctx);

    	const block = {
    		key: key_1,
    		first: null,
    		c: function create() {
    			div3 = element("div");
    			div0 = element("div");
    			label0 = element("label");
    			t0 = text("Símbolo");
    			t1 = space();
    			select0 = element("select");

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].c();
    			}

    			t2 = space();
    			div1 = element("div");
    			create_component(icon.$$.fragment);
    			t3 = space();
    			div2 = element("div");
    			label1 = element("label");
    			t4 = text("Saída");
    			t5 = space();
    			select1 = element("select");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t6 = space();
    			if (if_block) if_block.c();
    			t7 = space();
    			attr_dev(label0, "for", label0_for_value = "e-" + /*estado*/ ctx[0].id + "-" + /*entrada*/ ctx[39]);
    			add_location(label0, file$2, 63, 20, 1956);
    			attr_dev(select0, "id", select0_id_value = "e-" + /*estado*/ ctx[0].id + "-" + /*entrada*/ ctx[39]);
    			select0.disabled = select0_disabled_value = /*editando*/ ctx[9] || !/*editavel*/ ctx[4];
    			attr_dev(select0, "class", "svelte-gaq17w");
    			add_location(select0, file$2, 64, 20, 2030);
    			add_location(div0, file$2, 62, 16, 1929);
    			attr_dev(div1, "class", "arrow svelte-gaq17w");
    			add_location(div1, file$2, 82, 16, 2891);
    			attr_dev(label1, "for", label1_for_value = "o-" + /*estado*/ ctx[0].id + "-" + /*entrada*/ ctx[39]);
    			add_location(label1, file$2, 88, 20, 3087);
    			attr_dev(select1, "id", select1_id_value = "o-" + /*estado*/ ctx[0].id + "-" + /*entrada*/ ctx[39]);
    			select1.disabled = select1_disabled_value = /*editando*/ ctx[9] || !/*editavel*/ ctx[4];
    			attr_dev(select1, "class", "svelte-gaq17w");
    			add_location(select1, file$2, 89, 20, 3159);
    			add_location(div2, file$2, 87, 16, 3060);
    			attr_dev(div3, "class", "row svelte-gaq17w");
    			add_location(div3, file$2, 59, 12, 1836);
    			this.first = div3;
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div3, anchor);
    			append_dev(div3, div0);
    			append_dev(div0, label0);
    			append_dev(label0, t0);
    			append_dev(div0, t1);
    			append_dev(div0, select0);

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].m(select0, null);
    			}

    			append_dev(div3, t2);
    			append_dev(div3, div1);
    			mount_component(icon, div1, null);
    			append_dev(div3, t3);
    			append_dev(div3, div2);
    			append_dev(div2, label1);
    			append_dev(label1, t4);
    			append_dev(div2, t5);
    			append_dev(div2, select1);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(select1, null);
    			}

    			append_dev(div3, t6);
    			if (if_block) if_block.m(div3, null);
    			append_dev(div3, t7);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(select0, "change", change_handler, false, false, false),
    					listen_dev(select1, "change", change_handler_1, false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (!current || dirty[0] & /*estado*/ 1 && label0_for_value !== (label0_for_value = "e-" + /*estado*/ ctx[0].id + "-" + /*entrada*/ ctx[39])) {
    				attr_dev(label0, "for", label0_for_value);
    			}

    			if (dirty[0] & /*$afd, estado*/ 65) {
    				each_value_4 = /*$afd*/ ctx[6].alfabeto.filter(func);
    				validate_each_argument(each_value_4);
    				validate_each_keys(ctx, each_value_4, get_each_context_4, get_key);
    				each_blocks_1 = update_keyed_each(each_blocks_1, dirty, get_key, 1, ctx, each_value_4, each0_lookup, select0, destroy_block, create_each_block_4, null, get_each_context_4);
    			}

    			if (!current || dirty[0] & /*estado*/ 1 && select0_id_value !== (select0_id_value = "e-" + /*estado*/ ctx[0].id + "-" + /*entrada*/ ctx[39])) {
    				attr_dev(select0, "id", select0_id_value);
    			}

    			if (!current || dirty[0] & /*editando, editavel*/ 528 && select0_disabled_value !== (select0_disabled_value = /*editando*/ ctx[9] || !/*editavel*/ ctx[4])) {
    				prop_dev(select0, "disabled", select0_disabled_value);
    			}

    			if (!current || dirty[0] & /*estado*/ 1 && label1_for_value !== (label1_for_value = "o-" + /*estado*/ ctx[0].id + "-" + /*entrada*/ ctx[39])) {
    				attr_dev(label1, "for", label1_for_value);
    			}

    			if (dirty[0] & /*$afd, estado*/ 65) {
    				each_value_3 = /*$afd*/ ctx[6].estados.filter(/*func_1*/ ctx[25]);
    				validate_each_argument(each_value_3);
    				validate_each_keys(ctx, each_value_3, get_each_context_3, get_key_1);
    				each_blocks = update_keyed_each(each_blocks, dirty, get_key_1, 1, ctx, each_value_3, each1_lookup, select1, destroy_block, create_each_block_3, null, get_each_context_3);
    			}

    			if (!current || dirty[0] & /*estado*/ 1 && select1_id_value !== (select1_id_value = "o-" + /*estado*/ ctx[0].id + "-" + /*entrada*/ ctx[39])) {
    				attr_dev(select1, "id", select1_id_value);
    			}

    			if (!current || dirty[0] & /*editando, editavel*/ 528 && select1_disabled_value !== (select1_disabled_value = /*editando*/ ctx[9] || !/*editavel*/ ctx[4])) {
    				prop_dev(select1, "disabled", select1_disabled_value);
    			}

    			if (/*editavel*/ ctx[4]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty[0] & /*editavel*/ 16) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block_2$1(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(div3, t7);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(icon.$$.fragment, local);
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(icon.$$.fragment, local);
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div3);

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].d();
    			}

    			destroy_component(icon);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].d();
    			}

    			if (if_block) if_block.d();
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_2$1.name,
    		type: "each",
    		source: "(58:8) {#each [...estado.entradas] as entrada (entrada)}",
    		ctx
    	});

    	return block;
    }

    // (180:23) 
    function create_if_block_1$1(ctx) {
    	let button;
    	let icon;
    	let t;
    	let current;
    	let mounted;
    	let dispose;

    	icon = new Icon({
    			props: { file: "connect" },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			button = element("button");
    			create_component(icon.$$.fragment);
    			t = text("\r\n            Adicionar conexão");
    			attr_dev(button, "class", "add svelte-gaq17w");
    			add_location(button, file$2, 180, 8, 6895);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    			mount_component(icon, button, null);
    			append_dev(button, t);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*adicionaConexao*/ ctx[14], false, false, false);
    				mounted = true;
    			}
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(icon.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(icon.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			destroy_component(icon);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$1.name,
    		type: "if",
    		source: "(180:23) ",
    		ctx
    	});

    	return block;
    }

    // (123:4) {#if editando}
    function create_if_block$1(ctx) {
    	let div7;
    	let div3;
    	let div0;
    	let label0;
    	let t1;
    	let select0;
    	let option0;
    	let each_blocks_1 = [];
    	let each0_lookup = new Map();
    	let t3;
    	let div1;
    	let icon0;
    	let t4;
    	let div2;
    	let label1;
    	let t6;
    	let select1;
    	let option1;
    	let each_blocks = [];
    	let each1_lookup = new Map();
    	let t8;
    	let div6;
    	let div4;
    	let icon1;
    	let div4_class_value;
    	let t9;
    	let div5;
    	let icon2;
    	let current;
    	let mounted;
    	let dispose;
    	let each_value_1 = /*$afd*/ ctx[6].alfabeto.filter(/*func_2*/ ctx[28]);
    	validate_each_argument(each_value_1);
    	const get_key = ctx => /*simbolo*/ ctx[36];
    	validate_each_keys(ctx, each_value_1, get_each_context_1$1, get_key);

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		let child_ctx = get_each_context_1$1(ctx, each_value_1, i);
    		let key = get_key(child_ctx);
    		each0_lookup.set(key, each_blocks_1[i] = create_each_block_1$1(key, child_ctx));
    	}

    	icon0 = new Icon({
    			props: { file: "arrow-right", w: 24, h: 24 },
    			$$inline: true
    		});

    	let each_value = /*$afd*/ ctx[6].estados.filter(/*func_3*/ ctx[30]);
    	validate_each_argument(each_value);
    	const get_key_1 = ctx => /*estadoAFD*/ ctx[33].id;
    	validate_each_keys(ctx, each_value, get_each_context$1, get_key_1);

    	for (let i = 0; i < each_value.length; i += 1) {
    		let child_ctx = get_each_context$1(ctx, each_value, i);
    		let key = get_key_1(child_ctx);
    		each1_lookup.set(key, each_blocks[i] = create_each_block$1(key, child_ctx));
    	}

    	icon1 = new Icon({
    			props: { file: "checkmark" },
    			$$inline: true
    		});

    	icon2 = new Icon({ props: { file: "close" }, $$inline: true });

    	const block = {
    		c: function create() {
    			div7 = element("div");
    			div3 = element("div");
    			div0 = element("div");
    			label0 = element("label");
    			label0.textContent = "Símbolo";
    			t1 = space();
    			select0 = element("select");
    			option0 = element("option");
    			option0.textContent = "...\r\n                        ";

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].c();
    			}

    			t3 = space();
    			div1 = element("div");
    			create_component(icon0.$$.fragment);
    			t4 = space();
    			div2 = element("div");
    			label1 = element("label");
    			label1.textContent = "Saída";
    			t6 = space();
    			select1 = element("select");
    			option1 = element("option");
    			option1.textContent = "...";

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t8 = space();
    			div6 = element("div");
    			div4 = element("div");
    			create_component(icon1.$$.fragment);
    			t9 = space();
    			div5 = element("div");
    			create_component(icon2.$$.fragment);
    			attr_dev(label0, "for", "e-adc");
    			add_location(label0, file$2, 127, 20, 4576);
    			option0.__value = "";
    			option0.value = option0.__value;
    			add_location(option0, file$2, 132, 24, 4779);
    			attr_dev(select0, "id", "e-adc");
    			attr_dev(select0, "class", "svelte-gaq17w");
    			if (/*simboloEscolhido*/ ctx[7] === void 0) add_render_callback(() => /*select0_change_handler*/ ctx[29].call(select0));
    			add_location(select0, file$2, 128, 20, 4632);
    			add_location(div0, file$2, 126, 16, 4549);
    			attr_dev(div1, "class", "arrow svelte-gaq17w");
    			add_location(div1, file$2, 147, 16, 5431);
    			attr_dev(label1, "for", "s-adc");
    			add_location(label1, file$2, 153, 20, 5627);
    			option1.__value = "";
    			option1.value = option1.__value;
    			add_location(option1, file$2, 158, 24, 5827);
    			attr_dev(select1, "id", "s-adc");
    			attr_dev(select1, "class", "svelte-gaq17w");
    			if (/*estadoEscolhido*/ ctx[8] === void 0) add_render_callback(() => /*select1_change_handler*/ ctx[31].call(select1));
    			add_location(select1, file$2, 154, 20, 5681);
    			add_location(div2, file$2, 152, 16, 5600);
    			attr_dev(div3, "class", "row svelte-gaq17w");
    			add_location(div3, file$2, 124, 12, 4474);

    			attr_dev(div4, "class", div4_class_value = "" + (null_to_empty(/*$afd*/ ctx[6].estados.map(func_4).includes(/*estadoEscolhido*/ ctx[8]) && /*$afd*/ ctx[6].alfabeto.includes(/*simboloEscolhido*/ ctx[7])
    			? 'confirma'
    			: 'desativado') + " svelte-gaq17w"));

    			add_location(div4, file$2, 171, 16, 6436);
    			attr_dev(div5, "class", "delete svelte-gaq17w");
    			add_location(div5, file$2, 174, 16, 6706);
    			attr_dev(div6, "class", "row svelte-gaq17w");
    			add_location(div6, file$2, 170, 12, 6401);
    			attr_dev(div7, "class", "column svelte-gaq17w");
    			add_location(div7, file$2, 123, 8, 4440);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div7, anchor);
    			append_dev(div7, div3);
    			append_dev(div3, div0);
    			append_dev(div0, label0);
    			append_dev(div0, t1);
    			append_dev(div0, select0);
    			append_dev(select0, option0);

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].m(select0, null);
    			}

    			select_option(select0, /*simboloEscolhido*/ ctx[7]);
    			append_dev(div3, t3);
    			append_dev(div3, div1);
    			mount_component(icon0, div1, null);
    			append_dev(div3, t4);
    			append_dev(div3, div2);
    			append_dev(div2, label1);
    			append_dev(div2, t6);
    			append_dev(div2, select1);
    			append_dev(select1, option1);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(select1, null);
    			}

    			select_option(select1, /*estadoEscolhido*/ ctx[8]);
    			append_dev(div7, t8);
    			append_dev(div7, div6);
    			append_dev(div6, div4);
    			mount_component(icon1, div4, null);
    			append_dev(div6, t9);
    			append_dev(div6, div5);
    			mount_component(icon2, div5, null);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(select0, "change", /*select0_change_handler*/ ctx[29]),
    					listen_dev(select1, "change", /*select1_change_handler*/ ctx[31]),
    					listen_dev(div4, "click", /*confirmaConexao*/ ctx[16], false, false, false),
    					listen_dev(div5, "click", /*cancelaConexao*/ ctx[15], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*$afd, estado*/ 65) {
    				each_value_1 = /*$afd*/ ctx[6].alfabeto.filter(/*func_2*/ ctx[28]);
    				validate_each_argument(each_value_1);
    				validate_each_keys(ctx, each_value_1, get_each_context_1$1, get_key);
    				each_blocks_1 = update_keyed_each(each_blocks_1, dirty, get_key, 1, ctx, each_value_1, each0_lookup, select0, destroy_block, create_each_block_1$1, null, get_each_context_1$1);
    			}

    			if (dirty[0] & /*simboloEscolhido, $afd, estado*/ 193) {
    				select_option(select0, /*simboloEscolhido*/ ctx[7]);
    			}

    			if (dirty[0] & /*$afd, estado*/ 65) {
    				each_value = /*$afd*/ ctx[6].estados.filter(/*func_3*/ ctx[30]);
    				validate_each_argument(each_value);
    				validate_each_keys(ctx, each_value, get_each_context$1, get_key_1);
    				each_blocks = update_keyed_each(each_blocks, dirty, get_key_1, 1, ctx, each_value, each1_lookup, select1, destroy_block, create_each_block$1, null, get_each_context$1);
    			}

    			if (dirty[0] & /*estadoEscolhido, $afd, estado*/ 321) {
    				select_option(select1, /*estadoEscolhido*/ ctx[8]);
    			}

    			if (!current || dirty[0] & /*$afd, estadoEscolhido, simboloEscolhido, estado*/ 449 && div4_class_value !== (div4_class_value = "" + (null_to_empty(/*$afd*/ ctx[6].estados.map(func_4).includes(/*estadoEscolhido*/ ctx[8]) && /*$afd*/ ctx[6].alfabeto.includes(/*simboloEscolhido*/ ctx[7])
    			? 'confirma'
    			: 'desativado') + " svelte-gaq17w"))) {
    				attr_dev(div4, "class", div4_class_value);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(icon0.$$.fragment, local);
    			transition_in(icon1.$$.fragment, local);
    			transition_in(icon2.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(icon0.$$.fragment, local);
    			transition_out(icon1.$$.fragment, local);
    			transition_out(icon2.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div7);

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].d();
    			}

    			destroy_component(icon0);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].d();
    			}

    			destroy_component(icon1);
    			destroy_component(icon2);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(123:4) {#if editando}",
    		ctx
    	});

    	return block;
    }

    // (137:24) {#each $afd.alfabeto.filter( s => !estado.contem( s ) ) as simbolo (simbolo)}
    function create_each_block_1$1(key_1, ctx) {
    	let option;
    	let t0_value = /*simbolo*/ ctx[36] + "";
    	let t0;
    	let t1;
    	let option_value_value;

    	const block = {
    		key: key_1,
    		first: null,
    		c: function create() {
    			option = element("option");
    			t0 = text(t0_value);
    			t1 = space();
    			option.__value = option_value_value = /*simbolo*/ ctx[36];
    			option.value = option.__value;
    			add_location(option, file$2, 137, 28, 5120);
    			this.first = option;
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, option, anchor);
    			append_dev(option, t0);
    			append_dev(option, t1);
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if (dirty[0] & /*$afd, estado*/ 65 && t0_value !== (t0_value = /*simbolo*/ ctx[36] + "")) set_data_dev(t0, t0_value);

    			if (dirty[0] & /*$afd, estado*/ 65 && option_value_value !== (option_value_value = /*simbolo*/ ctx[36])) {
    				prop_dev(option, "__value", option_value_value);
    				option.value = option.__value;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(option);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1$1.name,
    		type: "each",
    		source: "(137:24) {#each $afd.alfabeto.filter( s => !estado.contem( s ) ) as simbolo (simbolo)}",
    		ctx
    	});

    	return block;
    }

    // (161:24) {#each $afd.estados.filter( s => s !== estado ) as estadoAFD (estadoAFD.id) }
    function create_each_block$1(key_1, ctx) {
    	let option;

    	let t0_value = (/*$afd*/ ctx[6].finais.includes(/*estadoAFD*/ ctx[33])
    	? '🏁'
    	: '') + "";

    	let t0;
    	let t1;
    	let t2_value = /*estadoAFD*/ ctx[33].id + "";
    	let t2;
    	let t3;
    	let option_value_value;

    	const block = {
    		key: key_1,
    		first: null,
    		c: function create() {
    			option = element("option");
    			t0 = text(t0_value);
    			t1 = space();
    			t2 = text(t2_value);
    			t3 = space();
    			option.__value = option_value_value = /*estadoAFD*/ ctx[33].id;
    			option.value = option.__value;
    			add_location(option, file$2, 161, 28, 6054);
    			this.first = option;
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, option, anchor);
    			append_dev(option, t0);
    			append_dev(option, t1);
    			append_dev(option, t2);
    			append_dev(option, t3);
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (dirty[0] & /*$afd, estado*/ 65 && t0_value !== (t0_value = (/*$afd*/ ctx[6].finais.includes(/*estadoAFD*/ ctx[33])
    			? '🏁'
    			: '') + "")) set_data_dev(t0, t0_value);

    			if (dirty[0] & /*$afd, estado*/ 65 && t2_value !== (t2_value = /*estadoAFD*/ ctx[33].id + "")) set_data_dev(t2, t2_value);

    			if (dirty[0] & /*$afd, estado*/ 65 && option_value_value !== (option_value_value = /*estadoAFD*/ ctx[33].id)) {
    				prop_dev(option, "__value", option_value_value);
    				option.value = option.__value;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(option);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$1.name,
    		type: "each",
    		source: "(161:24) {#each $afd.estados.filter( s => s !== estado ) as estadoAFD (estadoAFD.id) }",
    		ctx
    	});

    	return block;
    }

    function create_fragment$2(ctx) {
    	let div1;
    	let div0;
    	let h1;
    	let t0_value = (/*ehInicial*/ ctx[10] ? '🎬' : '') + "";
    	let t0;
    	let t1;
    	let t2_value = (/*ehFinal*/ ctx[11] ? '🏁' : '') + "";
    	let t2;
    	let t3;
    	let t4_value = /*estado*/ ctx[0].id + "";
    	let t4;
    	let t5;
    	let t6;
    	let t7;
    	let hr;
    	let t8;
    	let each_blocks = [];
    	let each_1_lookup = new Map();
    	let t9;
    	let current_block_type_index;
    	let if_block2;
    	let div1_class_value;
    	let current;
    	let if_block0 = /*editavel*/ ctx[4] && create_if_block_4(ctx);
    	let if_block1 = /*editavel*/ ctx[4] && create_if_block_3$1(ctx);
    	let each_value_2 = [.../*estado*/ ctx[0].entradas];
    	validate_each_argument(each_value_2);
    	const get_key = ctx => /*entrada*/ ctx[39];
    	validate_each_keys(ctx, each_value_2, get_each_context_2$1, get_key);

    	for (let i = 0; i < each_value_2.length; i += 1) {
    		let child_ctx = get_each_context_2$1(ctx, each_value_2, i);
    		let key = get_key(child_ctx);
    		each_1_lookup.set(key, each_blocks[i] = create_each_block_2$1(key, child_ctx));
    	}

    	const if_block_creators = [create_if_block$1, create_if_block_1$1];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*editando*/ ctx[9]) return 0;
    		if (/*editavel*/ ctx[4]) return 1;
    		return -1;
    	}

    	if (~(current_block_type_index = select_block_type(ctx))) {
    		if_block2 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    	}

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			h1 = element("h1");
    			t0 = text(t0_value);
    			t1 = space();
    			t2 = text(t2_value);
    			t3 = space();
    			t4 = text(t4_value);
    			t5 = space();
    			if (if_block0) if_block0.c();
    			t6 = space();
    			if (if_block1) if_block1.c();
    			t7 = space();
    			hr = element("hr");
    			t8 = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t9 = space();
    			if (if_block2) if_block2.c();
    			attr_dev(h1, "class", "title svelte-gaq17w");
    			add_location(h1, file$2, 17, 8, 383);
    			attr_dev(hr, "class", "svelte-gaq17w");
    			add_location(hr, file$2, 53, 8, 1610);
    			attr_dev(div0, "class", "content svelte-gaq17w");
    			add_location(div0, file$2, 15, 4, 299);
    			attr_dev(div1, "class", div1_class_value = "state " + (/*selecionado*/ ctx[3] ? 'selected' : '') + " " + (/*ehFinal*/ ctx[11] ? 'final' : '') + " svelte-gaq17w");
    			set_style(div1, "left", /*x*/ ctx[1] + "px");
    			set_style(div1, "top", /*y*/ ctx[2] + "px");
    			add_location(div1, file$2, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			append_dev(div0, h1);
    			append_dev(h1, t0);
    			append_dev(h1, t1);
    			append_dev(h1, t2);
    			append_dev(h1, t3);
    			append_dev(h1, t4);
    			append_dev(h1, t5);
    			if (if_block0) if_block0.m(h1, null);
    			append_dev(div0, t6);
    			if (if_block1) if_block1.m(div0, null);
    			append_dev(div0, t7);
    			append_dev(div0, hr);
    			append_dev(div0, t8);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div0, null);
    			}

    			append_dev(div1, t9);

    			if (~current_block_type_index) {
    				if_blocks[current_block_type_index].m(div1, null);
    			}

    			/*div1_binding*/ ctx[32](div1);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if ((!current || dirty[0] & /*ehInicial*/ 1024) && t0_value !== (t0_value = (/*ehInicial*/ ctx[10] ? '🎬' : '') + "")) set_data_dev(t0, t0_value);
    			if ((!current || dirty[0] & /*ehFinal*/ 2048) && t2_value !== (t2_value = (/*ehFinal*/ ctx[11] ? '🏁' : '') + "")) set_data_dev(t2, t2_value);
    			if ((!current || dirty[0] & /*estado*/ 1) && t4_value !== (t4_value = /*estado*/ ctx[0].id + "")) set_data_dev(t4, t4_value);

    			if (/*editavel*/ ctx[4]) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);

    					if (dirty[0] & /*editavel*/ 16) {
    						transition_in(if_block0, 1);
    					}
    				} else {
    					if_block0 = create_if_block_4(ctx);
    					if_block0.c();
    					transition_in(if_block0, 1);
    					if_block0.m(h1, null);
    				}
    			} else if (if_block0) {
    				group_outros();

    				transition_out(if_block0, 1, 1, () => {
    					if_block0 = null;
    				});

    				check_outros();
    			}

    			if (/*editavel*/ ctx[4]) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);
    				} else {
    					if_block1 = create_if_block_3$1(ctx);
    					if_block1.c();
    					if_block1.m(div0, t7);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}

    			if (dirty[0] & /*apagaMapeamento, estado, editavel, editando, trocaSaida, $afd, trocaEntrada*/ 795217) {
    				each_value_2 = [.../*estado*/ ctx[0].entradas];
    				validate_each_argument(each_value_2);
    				group_outros();
    				validate_each_keys(ctx, each_value_2, get_each_context_2$1, get_key);
    				each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx, each_value_2, each_1_lookup, div0, outro_and_destroy_block, create_each_block_2$1, null, get_each_context_2$1);
    				check_outros();
    			}

    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if (~current_block_type_index) {
    					if_blocks[current_block_type_index].p(ctx, dirty);
    				}
    			} else {
    				if (if_block2) {
    					group_outros();

    					transition_out(if_blocks[previous_block_index], 1, 1, () => {
    						if_blocks[previous_block_index] = null;
    					});

    					check_outros();
    				}

    				if (~current_block_type_index) {
    					if_block2 = if_blocks[current_block_type_index];

    					if (!if_block2) {
    						if_block2 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    						if_block2.c();
    					} else {
    						if_block2.p(ctx, dirty);
    					}

    					transition_in(if_block2, 1);
    					if_block2.m(div1, null);
    				} else {
    					if_block2 = null;
    				}
    			}

    			if (!current || dirty[0] & /*selecionado, ehFinal*/ 2056 && div1_class_value !== (div1_class_value = "state " + (/*selecionado*/ ctx[3] ? 'selected' : '') + " " + (/*ehFinal*/ ctx[11] ? 'final' : '') + " svelte-gaq17w")) {
    				attr_dev(div1, "class", div1_class_value);
    			}

    			if (!current || dirty[0] & /*x*/ 2) {
    				set_style(div1, "left", /*x*/ ctx[1] + "px");
    			}

    			if (!current || dirty[0] & /*y*/ 4) {
    				set_style(div1, "top", /*y*/ ctx[2] + "px");
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block0);

    			for (let i = 0; i < each_value_2.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			transition_in(if_block2);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block0);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			transition_out(if_block2);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			if (if_block0) if_block0.d();
    			if (if_block1) if_block1.d();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].d();
    			}

    			if (~current_block_type_index) {
    				if_blocks[current_block_type_index].d();
    			}

    			/*div1_binding*/ ctx[32](null);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }




    const func_4 = s => s.id;

    function instance$2($$self, $$props, $$invalidate) {
    	let $afd;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Estado', slots, []);
    	let { x = 16 } = $$props;
    	let { y = 16 } = $$props;
    	let { selecionado = false } = $$props;
    	let { estado = null } = $$props;
    	let { nomeAfd = 'playground' } = $$props;
    	let { editavel } = $$props;

    	// Internas
    	const afd = afds[nomeAfd];

    	validate_store(afd, 'afd');
    	component_subscribe($$self, afd, value => $$invalidate(6, $afd = value));
    	let simboloEscolhido;
    	let estadoEscolhido;
    	let editando = false;

    	// Uso só pra poder mudar o estilo do componente quando ele for um estado final
    	let ehInicial;

    	let ehFinal;
    	let element;

    	function apagaMapeamento(entrada) {
    		estado.atualiza(entrada, estado);
    		$$invalidate(0, estado);
    	}

    	function adicionaConexao() {
    		$$invalidate(9, editando = true);
    	}

    	function cancelaConexao() {
    		$$invalidate(9, editando = false);
    		$$invalidate(7, simboloEscolhido = '');
    		$$invalidate(8, estadoEscolhido = '');
    	}

    	function confirmaConexao() {
    		const index = $afd.estados.map(s => s.id).indexOf(estadoEscolhido);
    		const s = $afd.estados[index];

    		if (s) {
    			estado.atualiza(simboloEscolhido, s);
    			cancelaConexao();
    			$$invalidate(0, estado);
    		}
    	}

    	function apagaEstado() {
    		$afd.removeEstado(estado);
    		$$invalidate(0, estado);
    		afd.set($afd);
    	}

    	// Dispara quando mudamos a entrada em um dos mapeamentos
    	function trocaEntrada(evento, entrada) {
    		const alvo = evento.target;

    		// Tenta trocar a entrada do estado atual
    		if (estado.trocaEntrada(entrada, alvo.value)) // Força re-renderização do Svelte
    		$$invalidate(0, estado);
    	}

    	// Dispara quando mudamos a saída em um dos mapeamentos
    	function trocaSaida(evento, entrada) {
    		const alvo = evento.target;

    		// Novo estado selecionado
    		const novoEstado = $afd.estados[$afd.estados.map(e => e.id).indexOf(alvo.value)];

    		if (novoEstado) {
    			// Atualiza o novo estado
    			estado.atualiza(entrada, novoEstado);

    			// Força re-renderização do Svelte
    			$$invalidate(0, estado);
    		}
    	}

    	function trocaInicial() {
    		$afd.configuraInicial(estado);
    		afd.set($afd);
    	}

    	function trocaFinal(evento) {
    		const alvo = evento.target;
    		const agoraEhFinal = alvo.checked;

    		if (agoraEhFinal) {
    			$afd.adicionaFinal(estado);
    		} else {
    			$afd.removeFinal(estado);
    		}

    		// Força re-renderização do Svelte
    		afd.set($afd);
    	}

    	const writable_props = ['x', 'y', 'selecionado', 'estado', 'nomeAfd', 'editavel'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Estado> was created with unknown prop '${key}'`);
    	});

    	const func = (entrada, s) => !estado.contem(s) || s === entrada;
    	const change_handler = (entrada, e) => trocaEntrada(e, entrada);
    	const func_1 = s => s !== estado;
    	const change_handler_1 = (entrada, e) => trocaSaida(e, entrada);
    	const click_handler = entrada => apagaMapeamento(entrada);
    	const func_2 = s => !estado.contem(s);

    	function select0_change_handler() {
    		simboloEscolhido = select_value(this);
    		$$invalidate(7, simboloEscolhido);
    		$$invalidate(0, estado);
    	}

    	const func_3 = s => s !== estado;

    	function select1_change_handler() {
    		estadoEscolhido = select_value(this);
    		$$invalidate(8, estadoEscolhido);
    		$$invalidate(0, estado);
    	}

    	function div1_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			element = $$value;
    			$$invalidate(5, element);
    		});
    	}

    	$$self.$$set = $$props => {
    		if ('x' in $$props) $$invalidate(1, x = $$props.x);
    		if ('y' in $$props) $$invalidate(2, y = $$props.y);
    		if ('selecionado' in $$props) $$invalidate(3, selecionado = $$props.selecionado);
    		if ('estado' in $$props) $$invalidate(0, estado = $$props.estado);
    		if ('nomeAfd' in $$props) $$invalidate(22, nomeAfd = $$props.nomeAfd);
    		if ('editavel' in $$props) $$invalidate(4, editavel = $$props.editavel);
    	};

    	$$self.$capture_state = () => ({
    		afds,
    		Icon,
    		x,
    		y,
    		selecionado,
    		estado,
    		nomeAfd,
    		editavel,
    		afd,
    		simboloEscolhido,
    		estadoEscolhido,
    		editando,
    		ehInicial,
    		ehFinal,
    		element,
    		apagaMapeamento,
    		adicionaConexao,
    		cancelaConexao,
    		confirmaConexao,
    		apagaEstado,
    		trocaEntrada,
    		trocaSaida,
    		trocaInicial,
    		trocaFinal,
    		$afd
    	});

    	$$self.$inject_state = $$props => {
    		if ('x' in $$props) $$invalidate(1, x = $$props.x);
    		if ('y' in $$props) $$invalidate(2, y = $$props.y);
    		if ('selecionado' in $$props) $$invalidate(3, selecionado = $$props.selecionado);
    		if ('estado' in $$props) $$invalidate(0, estado = $$props.estado);
    		if ('nomeAfd' in $$props) $$invalidate(22, nomeAfd = $$props.nomeAfd);
    		if ('editavel' in $$props) $$invalidate(4, editavel = $$props.editavel);
    		if ('simboloEscolhido' in $$props) $$invalidate(7, simboloEscolhido = $$props.simboloEscolhido);
    		if ('estadoEscolhido' in $$props) $$invalidate(8, estadoEscolhido = $$props.estadoEscolhido);
    		if ('editando' in $$props) $$invalidate(9, editando = $$props.editando);
    		if ('ehInicial' in $$props) $$invalidate(10, ehInicial = $$props.ehInicial);
    		if ('ehFinal' in $$props) $$invalidate(11, ehFinal = $$props.ehFinal);
    		if ('element' in $$props) $$invalidate(5, element = $$props.element);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty[0] & /*$afd, estado*/ 65) {
    			$$invalidate(10, ehInicial = $afd.inicial === estado);
    		}

    		if ($$self.$$.dirty[0] & /*$afd, estado*/ 65) {
    			$$invalidate(11, ehFinal = $afd.finais.includes(estado));
    		}

    		if ($$self.$$.dirty[0] & /*selecionado, element*/ 40) {
    			{
    				if (selecionado) element.scrollIntoView();
    			}
    		}
    	};

    	return [
    		estado,
    		x,
    		y,
    		selecionado,
    		editavel,
    		element,
    		$afd,
    		simboloEscolhido,
    		estadoEscolhido,
    		editando,
    		ehInicial,
    		ehFinal,
    		afd,
    		apagaMapeamento,
    		adicionaConexao,
    		cancelaConexao,
    		confirmaConexao,
    		apagaEstado,
    		trocaEntrada,
    		trocaSaida,
    		trocaInicial,
    		trocaFinal,
    		nomeAfd,
    		func,
    		change_handler,
    		func_1,
    		change_handler_1,
    		click_handler,
    		func_2,
    		select0_change_handler,
    		func_3,
    		select1_change_handler,
    		div1_binding
    	];
    }

    class Estado extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(
    			this,
    			options,
    			instance$2,
    			create_fragment$2,
    			safe_not_equal,
    			{
    				x: 1,
    				y: 2,
    				selecionado: 3,
    				estado: 0,
    				nomeAfd: 22,
    				editavel: 4
    			},
    			null,
    			[-1, -1]
    		);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Estado",
    			options,
    			id: create_fragment$2.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*editavel*/ ctx[4] === undefined && !('editavel' in props)) {
    			console.warn("<Estado> was created without expected prop 'editavel'");
    		}
    	}

    	get x() {
    		throw new Error("<Estado>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set x(value) {
    		throw new Error("<Estado>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get y() {
    		throw new Error("<Estado>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set y(value) {
    		throw new Error("<Estado>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get selecionado() {
    		throw new Error("<Estado>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set selecionado(value) {
    		throw new Error("<Estado>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get estado() {
    		throw new Error("<Estado>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set estado(value) {
    		throw new Error("<Estado>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get nomeAfd() {
    		throw new Error("<Estado>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set nomeAfd(value) {
    		throw new Error("<Estado>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get editavel() {
    		throw new Error("<Estado>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set editavel(value) {
    		throw new Error("<Estado>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\componentes\Playground\Automato.svelte generated by Svelte v3.42.4 */
    const file$1 = "src\\componentes\\Playground\\Automato.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[24] = list[i];
    	return child_ctx;
    }

    function get_each_context_1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[27] = list[i];
    	child_ctx[29] = i;
    	return child_ctx;
    }

    function get_each_context_2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[27] = list[i];
    	return child_ctx;
    }

    // (5:12) {#if editavel && controlesVisiveis}
    function create_if_block_3(ctx) {
    	let button;
    	let icon;
    	let current;
    	let mounted;
    	let dispose;
    	icon = new Icon({ props: { file: "add" }, $$inline: true });

    	const block = {
    		c: function create() {
    			button = element("button");
    			create_component(icon.$$.fragment);
    			attr_dev(button, "class", "adiciona svelte-smkouj");
    			add_location(button, file$1, 5, 16, 195);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    			mount_component(icon, button, null);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*criaEstado*/ ctx[11], false, false, false);
    				mounted = true;
    			}
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(icon.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(icon.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			destroy_component(icon);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3.name,
    		type: "if",
    		source: "(5:12) {#if editavel && controlesVisiveis}",
    		ctx
    	});

    	return block;
    }

    // (15:8) {#if controlesVisiveis}
    function create_if_block(ctx) {
    	let div4;
    	let div0;
    	let span;
    	let t1;
    	let t2;
    	let div3;
    	let button0;
    	let icon0;
    	let t3;
    	let button1;
    	let icon1;
    	let button1_class_value;
    	let t4;
    	let div2;
    	let div1;

    	let t5_value = (/*dilatacaoTemporal*/ ctx[1] % 1
    	? /*dilatacaoTemporal*/ ctx[1]
    	: /*dilatacaoTemporal*/ ctx[1] + '.0') + "";

    	let t5;
    	let t6;
    	let t7;
    	let icon2;
    	let t8;
    	let input;
    	let t9;
    	let div5;
    	let current;
    	let mounted;
    	let dispose;

    	function select_block_type(ctx, dirty) {
    		if (/*editavel*/ ctx[0]) return create_if_block_2;
    		return create_else_block_1;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block0 = current_block_type(ctx);

    	icon0 = new Icon({
    			props: { file: "stop", w: 24, h: 24 },
    			$$inline: true
    		});

    	icon1 = new Icon({
    			props: {
    				file: /*executando*/ ctx[3] ? 'pause' : 'play',
    				w: 24,
    				h: 24
    			},
    			$$inline: true
    		});

    	icon2 = new Icon({
    			props: { file: "forward" },
    			$$inline: true
    		});

    	function select_block_type_1(ctx, dirty) {
    		if (/*executando*/ ctx[3] || /*posSimbolo*/ ctx[5] > 0) return create_if_block_1;
    		return create_else_block;
    	}

    	let current_block_type_1 = select_block_type_1(ctx);
    	let if_block1 = current_block_type_1(ctx);

    	const block = {
    		c: function create() {
    			div4 = element("div");
    			div0 = element("div");
    			span = element("span");
    			span.textContent = "Alfabeto";
    			t1 = space();
    			if_block0.c();
    			t2 = space();
    			div3 = element("div");
    			button0 = element("button");
    			create_component(icon0.$$.fragment);
    			t3 = space();
    			button1 = element("button");
    			create_component(icon1.$$.fragment);
    			t4 = space();
    			div2 = element("div");
    			div1 = element("div");
    			t5 = text(t5_value);
    			t6 = text("x");
    			t7 = space();
    			create_component(icon2.$$.fragment);
    			t8 = space();
    			input = element("input");
    			t9 = space();
    			div5 = element("div");
    			if_block1.c();
    			add_location(span, file$1, 18, 20, 731);
    			attr_dev(div0, "class", "row fill svelte-smkouj");
    			add_location(div0, file$1, 17, 16, 687);
    			attr_dev(button0, "class", "reset svelte-smkouj");
    			add_location(button0, file$1, 32, 20, 1365);
    			attr_dev(button1, "class", button1_class_value = "" + (null_to_empty(/*executando*/ ctx[3] ? 'pausa' : 'executa') + " svelte-smkouj"));
    			add_location(button1, file$1, 35, 20, 1522);
    			add_location(div1, file$1, 39, 24, 1789);
    			attr_dev(input, "step", 0.1);
    			attr_dev(input, "min", minDilatacaoTemporal);
    			attr_dev(input, "max", maxDilatacaoTemporal);
    			attr_dev(input, "type", "range");
    			attr_dev(input, "class", "svelte-smkouj");
    			add_location(input, file$1, 41, 24, 1949);
    			attr_dev(div2, "class", "fill row svelte-smkouj");
    			add_location(div2, file$1, 38, 20, 1741);
    			attr_dev(div3, "class", "row svelte-smkouj");
    			add_location(div3, file$1, 31, 16, 1326);
    			attr_dev(div4, "class", "column lower left svelte-smkouj");
    			add_location(div4, file$1, 16, 12, 638);
    			attr_dev(div5, "class", "alfabeto row lower right svelte-smkouj");
    			add_location(div5, file$1, 53, 12, 2384);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div4, anchor);
    			append_dev(div4, div0);
    			append_dev(div0, span);
    			append_dev(div0, t1);
    			if_block0.m(div0, null);
    			append_dev(div4, t2);
    			append_dev(div4, div3);
    			append_dev(div3, button0);
    			mount_component(icon0, button0, null);
    			append_dev(div3, t3);
    			append_dev(div3, button1);
    			mount_component(icon1, button1, null);
    			append_dev(div3, t4);
    			append_dev(div3, div2);
    			append_dev(div2, div1);
    			append_dev(div1, t5);
    			append_dev(div1, t6);
    			append_dev(div2, t7);
    			mount_component(icon2, div2, null);
    			append_dev(div2, t8);
    			append_dev(div2, input);
    			set_input_value(input, /*dilatacaoTemporal*/ ctx[1]);
    			insert_dev(target, t9, anchor);
    			insert_dev(target, div5, anchor);
    			if_block1.m(div5, null);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(button0, "click", /*reset*/ ctx[14], false, false, false),
    					listen_dev(button1, "click", /*alteraExecucao*/ ctx[12], false, false, false),
    					listen_dev(input, "change", /*atualizaVelocidade*/ ctx[13], false, false, false),
    					listen_dev(input, "change", /*input_change_input_handler*/ ctx[18]),
    					listen_dev(input, "input", /*input_change_input_handler*/ ctx[18])
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block0) {
    				if_block0.p(ctx, dirty);
    			} else {
    				if_block0.d(1);
    				if_block0 = current_block_type(ctx);

    				if (if_block0) {
    					if_block0.c();
    					if_block0.m(div0, null);
    				}
    			}

    			const icon1_changes = {};
    			if (dirty[0] & /*executando*/ 8) icon1_changes.file = /*executando*/ ctx[3] ? 'pause' : 'play';
    			icon1.$set(icon1_changes);

    			if (!current || dirty[0] & /*executando*/ 8 && button1_class_value !== (button1_class_value = "" + (null_to_empty(/*executando*/ ctx[3] ? 'pausa' : 'executa') + " svelte-smkouj"))) {
    				attr_dev(button1, "class", button1_class_value);
    			}

    			if ((!current || dirty[0] & /*dilatacaoTemporal*/ 2) && t5_value !== (t5_value = (/*dilatacaoTemporal*/ ctx[1] % 1
    			? /*dilatacaoTemporal*/ ctx[1]
    			: /*dilatacaoTemporal*/ ctx[1] + '.0') + "")) set_data_dev(t5, t5_value);

    			if (dirty[0] & /*dilatacaoTemporal*/ 2) {
    				set_input_value(input, /*dilatacaoTemporal*/ ctx[1]);
    			}

    			if (current_block_type_1 === (current_block_type_1 = select_block_type_1(ctx)) && if_block1) {
    				if_block1.p(ctx, dirty);
    			} else {
    				if_block1.d(1);
    				if_block1 = current_block_type_1(ctx);

    				if (if_block1) {
    					if_block1.c();
    					if_block1.m(div5, null);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(icon0.$$.fragment, local);
    			transition_in(icon1.$$.fragment, local);
    			transition_in(icon2.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(icon0.$$.fragment, local);
    			transition_out(icon1.$$.fragment, local);
    			transition_out(icon2.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div4);
    			if_block0.d();
    			destroy_component(icon0);
    			destroy_component(icon1);
    			destroy_component(icon2);
    			if (detaching) detach_dev(t9);
    			if (detaching) detach_dev(div5);
    			if_block1.d();
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(15:8) {#if controlesVisiveis}",
    		ctx
    	});

    	return block;
    }

    // (24:20) {:else}
    function create_else_block_1(ctx) {
    	let div;
    	let each_value_2 = /*$afd*/ ctx[2].alfabeto;
    	validate_each_argument(each_value_2);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_2.length; i += 1) {
    		each_blocks[i] = create_each_block_2(get_each_context_2(ctx, each_value_2, i));
    	}

    	const block = {
    		c: function create() {
    			div = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(div, "class", "passo-a-passo svelte-smkouj");
    			add_location(div, file$1, 24, 24, 1033);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div, null);
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*$afd*/ 4) {
    				each_value_2 = /*$afd*/ ctx[2].alfabeto;
    				validate_each_argument(each_value_2);
    				let i;

    				for (i = 0; i < each_value_2.length; i += 1) {
    					const child_ctx = get_each_context_2(ctx, each_value_2, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_2(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_2.length;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block_1.name,
    		type: "else",
    		source: "(24:20) {:else}",
    		ctx
    	});

    	return block;
    }

    // (20:20) {#if editavel}
    function create_if_block_2(ctx) {
    	let div;
    	let input;
    	let input_value_value;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div = element("div");
    			input = element("input");
    			attr_dev(input, "type", "text");
    			input.value = input_value_value = /*$afd*/ ctx[2].alfabeto.join('');
    			attr_dev(input, "class", "svelte-smkouj");
    			add_location(input, file$1, 21, 28, 870);
    			attr_dev(div, "class", "alfabeto svelte-smkouj");
    			add_location(div, file$1, 20, 24, 818);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, input);

    			if (!mounted) {
    				dispose = listen_dev(input, "input", /*filtraAlfabeto*/ ctx[10], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*$afd*/ 4 && input_value_value !== (input_value_value = /*$afd*/ ctx[2].alfabeto.join('')) && input.value !== input_value_value) {
    				prop_dev(input, "value", input_value_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2.name,
    		type: "if",
    		source: "(20:20) {#if editavel}",
    		ctx
    	});

    	return block;
    }

    // (26:28) {#each $afd.alfabeto as letra}
    function create_each_block_2(ctx) {
    	let span;
    	let t_value = /*letra*/ ctx[27] + "";
    	let t;

    	const block = {
    		c: function create() {
    			span = element("span");
    			t = text(t_value);
    			attr_dev(span, "class", "letra svelte-smkouj");
    			add_location(span, file$1, 26, 32, 1154);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    			append_dev(span, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*$afd*/ 4 && t_value !== (t_value = /*letra*/ ctx[27] + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_2.name,
    		type: "each",
    		source: "(26:28) {#each $afd.alfabeto as letra}",
    		ctx
    	});

    	return block;
    }

    // (61:16) {:else}
    function create_else_block(ctx) {
    	let input;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			input = element("input");
    			attr_dev(input, "type", "text");
    			attr_dev(input, "placeholder", "Digite uma palavra...");
    			input.value = /*palavra*/ ctx[4];
    			attr_dev(input, "class", "svelte-smkouj");
    			add_location(input, file$1, 61, 20, 2787);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, input, anchor);

    			if (!mounted) {
    				dispose = listen_dev(input, "input", /*filtraPalavra*/ ctx[9], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*palavra*/ 16 && input.value !== /*palavra*/ ctx[4]) {
    				prop_dev(input, "value", /*palavra*/ ctx[4]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(input);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block.name,
    		type: "else",
    		source: "(61:16) {:else}",
    		ctx
    	});

    	return block;
    }

    // (55:16) {#if executando || posSimbolo > 0}
    function create_if_block_1(ctx) {
    	let div;
    	let each_value_1 = /*palavra*/ ctx[4];
    	validate_each_argument(each_value_1);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks[i] = create_each_block_1(get_each_context_1(ctx, each_value_1, i));
    	}

    	const block = {
    		c: function create() {
    			div = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(div, "class", "passo-a-passo svelte-smkouj");
    			add_location(div, file$1, 55, 20, 2496);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div, null);
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*posSimbolo, palavra*/ 48) {
    				each_value_1 = /*palavra*/ ctx[4];
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1(ctx, each_value_1, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_1(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_1.length;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(55:16) {#if executando || posSimbolo > 0}",
    		ctx
    	});

    	return block;
    }

    // (57:24) {#each palavra as letra, pos }
    function create_each_block_1(ctx) {
    	let span;
    	let t_value = /*letra*/ ctx[27] + "";
    	let t;
    	let span_class_value;

    	const block = {
    		c: function create() {
    			span = element("span");
    			t = text(t_value);

    			attr_dev(span, "class", span_class_value = "letra " + (/*posSimbolo*/ ctx[5] === /*pos*/ ctx[29]
    			? 'selecionado'
    			: '') + " svelte-smkouj");

    			add_location(span, file$1, 57, 28, 2609);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    			append_dev(span, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*palavra*/ 16 && t_value !== (t_value = /*letra*/ ctx[27] + "")) set_data_dev(t, t_value);

    			if (dirty[0] & /*posSimbolo*/ 32 && span_class_value !== (span_class_value = "letra " + (/*posSimbolo*/ ctx[5] === /*pos*/ ctx[29]
    			? 'selecionado'
    			: '') + " svelte-smkouj")) {
    				attr_dev(span, "class", span_class_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1.name,
    		type: "each",
    		source: "(57:24) {#each palavra as letra, pos }",
    		ctx
    	});

    	return block;
    }

    // (69:8) {#each componentes as estado (estado.estado.id) }
    function create_each_block(key_1, ctx) {
    	let first;
    	let estadocomponent;
    	let current;
    	const estadocomponent_spread_levels = [/*estado*/ ctx[24], { editavel: /*editavel*/ ctx[0] }];
    	let estadocomponent_props = {};

    	for (let i = 0; i < estadocomponent_spread_levels.length; i += 1) {
    		estadocomponent_props = assign(estadocomponent_props, estadocomponent_spread_levels[i]);
    	}

    	estadocomponent = new Estado({
    			props: estadocomponent_props,
    			$$inline: true
    		});

    	const block = {
    		key: key_1,
    		first: null,
    		c: function create() {
    			first = empty();
    			create_component(estadocomponent.$$.fragment);
    			this.first = first;
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, first, anchor);
    			mount_component(estadocomponent, target, anchor);
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			const estadocomponent_changes = (dirty[0] & /*componentes, editavel*/ 129)
    			? get_spread_update(estadocomponent_spread_levels, [
    					dirty[0] & /*componentes*/ 128 && get_spread_object(/*estado*/ ctx[24]),
    					dirty[0] & /*editavel*/ 1 && { editavel: /*editavel*/ ctx[0] }
    				])
    			: {};

    			estadocomponent.$set(estadocomponent_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(estadocomponent.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(estadocomponent.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(first);
    			destroy_component(estadocomponent, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(69:8) {#each componentes as estado (estado.estado.id) }",
    		ctx
    	});

    	return block;
    }

    function create_fragment$1(ctx) {
    	let div2;
    	let div1;
    	let div0;
    	let t0;
    	let button;
    	let icon;
    	let button_class_value;
    	let t1;
    	let t2;
    	let section;
    	let each_blocks = [];
    	let each_1_lookup = new Map();
    	let current;
    	let mounted;
    	let dispose;
    	let if_block0 = /*editavel*/ ctx[0] && /*controlesVisiveis*/ ctx[6] && create_if_block_3(ctx);

    	icon = new Icon({
    			props: {
    				file: /*controlesVisiveis*/ ctx[6] ? 'eye' : 'eye-off'
    			},
    			$$inline: true
    		});

    	let if_block1 = /*controlesVisiveis*/ ctx[6] && create_if_block(ctx);
    	let each_value = /*componentes*/ ctx[7];
    	validate_each_argument(each_value);
    	const get_key = ctx => /*estado*/ ctx[24].estado.id;
    	validate_each_keys(ctx, each_value, get_each_context, get_key);

    	for (let i = 0; i < each_value.length; i += 1) {
    		let child_ctx = get_each_context(ctx, each_value, i);
    		let key = get_key(child_ctx);
    		each_1_lookup.set(key, each_blocks[i] = create_each_block(key, child_ctx));
    	}

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			div1 = element("div");
    			div0 = element("div");
    			if (if_block0) if_block0.c();
    			t0 = space();
    			button = element("button");
    			create_component(icon.$$.fragment);
    			t1 = space();
    			if (if_block1) if_block1.c();
    			t2 = space();
    			section = element("section");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(button, "class", button_class_value = "" + (null_to_empty(/*controlesVisiveis*/ ctx[6] ? 'visivel' : 'invisivel') + " svelte-smkouj"));
    			add_location(button, file$1, 9, 12, 348);
    			attr_dev(div0, "class", "top right svelte-smkouj");
    			add_location(div0, file$1, 3, 8, 105);
    			attr_dev(div1, "class", "ui svelte-smkouj");
    			add_location(div1, file$1, 2, 4, 79);
    			attr_dev(section, "id", "playground");
    			attr_dev(section, "class", "playground svelte-smkouj");
    			add_location(section, file$1, 67, 4, 2977);
    			attr_dev(div2, "class", "application svelte-smkouj");
    			add_location(div2, file$1, 1, 0, 48);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			append_dev(div2, div1);
    			append_dev(div1, div0);
    			if (if_block0) if_block0.m(div0, null);
    			append_dev(div0, t0);
    			append_dev(div0, button);
    			mount_component(icon, button, null);
    			append_dev(div1, t1);
    			if (if_block1) if_block1.m(div1, null);
    			append_dev(div2, t2);
    			append_dev(div2, section);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(section, null);
    			}

    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*click_handler*/ ctx[17], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (/*editavel*/ ctx[0] && /*controlesVisiveis*/ ctx[6]) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);

    					if (dirty[0] & /*editavel, controlesVisiveis*/ 65) {
    						transition_in(if_block0, 1);
    					}
    				} else {
    					if_block0 = create_if_block_3(ctx);
    					if_block0.c();
    					transition_in(if_block0, 1);
    					if_block0.m(div0, t0);
    				}
    			} else if (if_block0) {
    				group_outros();

    				transition_out(if_block0, 1, 1, () => {
    					if_block0 = null;
    				});

    				check_outros();
    			}

    			const icon_changes = {};
    			if (dirty[0] & /*controlesVisiveis*/ 64) icon_changes.file = /*controlesVisiveis*/ ctx[6] ? 'eye' : 'eye-off';
    			icon.$set(icon_changes);

    			if (!current || dirty[0] & /*controlesVisiveis*/ 64 && button_class_value !== (button_class_value = "" + (null_to_empty(/*controlesVisiveis*/ ctx[6] ? 'visivel' : 'invisivel') + " svelte-smkouj"))) {
    				attr_dev(button, "class", button_class_value);
    			}

    			if (/*controlesVisiveis*/ ctx[6]) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);

    					if (dirty[0] & /*controlesVisiveis*/ 64) {
    						transition_in(if_block1, 1);
    					}
    				} else {
    					if_block1 = create_if_block(ctx);
    					if_block1.c();
    					transition_in(if_block1, 1);
    					if_block1.m(div1, null);
    				}
    			} else if (if_block1) {
    				group_outros();

    				transition_out(if_block1, 1, 1, () => {
    					if_block1 = null;
    				});

    				check_outros();
    			}

    			if (dirty[0] & /*componentes, editavel*/ 129) {
    				each_value = /*componentes*/ ctx[7];
    				validate_each_argument(each_value);
    				group_outros();
    				validate_each_keys(ctx, each_value, get_each_context, get_key);
    				each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx, each_value, each_1_lookup, section, outro_and_destroy_block, create_each_block, null, get_each_context);
    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block0);
    			transition_in(icon.$$.fragment, local);
    			transition_in(if_block1);

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block0);
    			transition_out(icon.$$.fragment, local);
    			transition_out(if_block1);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);
    			if (if_block0) if_block0.d();
    			destroy_component(icon);
    			if (if_block1) if_block1.d();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].d();
    			}

    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const minDilatacaoTemporal = 0.1;
    const maxDilatacaoTemporal = 9.9;

    function instance$1($$self, $$props, $$invalidate) {
    	let $afd;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Automato', slots, []);
    	let { nomeAfd } = $$props;
    	let { editavel } = $$props;

    	// Internas
    	let executando = false;

    	let palavra = '';
    	let posSimbolo = 0;
    	let dilatacaoTemporal = 1;
    	let timeout;
    	let msIntervalo;
    	let controlesVisiveis = true;
    	const afd = afds[nomeAfd];
    	validate_store(afd, 'afd');
    	component_subscribe($$self, afd, value => $$invalidate(2, $afd = value));
    	let componentes;
    	let estadoAtual = null;
    	let proxId = 0;

    	function filtraPalavra(evento) {
    		const alvo = evento.target;
    		alvo.value = [...alvo.value].filter(l => $afd.alfabeto.includes(l)).join('');
    		$$invalidate(4, palavra = alvo.value);
    	}

    	function filtraAlfabeto(evento) {
    		const alvo = evento.target;
    		const alfa = [...new Set(alvo.value)];
    		alvo.value = alfa.join('');
    		$$invalidate(4, palavra = [...palavra].filter(l => alfa.includes(l)).join(''));
    		set_store_value(afd, $afd.alfabeto = alfa, $afd);
    	}

    	function criaEstado() {
    		const novoEstado = new Estado$1('S' + proxId++);
    		$afd.adicionaEstado(novoEstado);

    		componentes.push({
    			nomeAfd,
    			estado: novoEstado,
    			x: 16,
    			y: 16
    		});

    		afd.set($afd);
    	}

    	function alteraExecucao() {
    		$$invalidate(3, executando = !executando);

    		if (executando) if (palavra.length) {
    			if (posSimbolo === 0) $$invalidate(16, estadoAtual = $afd.inicial);
    			intervalo();
    		} else $$invalidate(3, executando = false);
    	}

    	function atualizaVelocidade(event) {
    		clearTimeout(timeout);
    		intervalo();
    	}

    	function proximoSimbolo() {
    		if (executando) {
    			if (posSimbolo < palavra.length && estadoAtual) {
    				$$invalidate(16, estadoAtual = estadoAtual.transicao(palavra[posSimbolo]));
    				intervalo();
    				$$invalidate(5, posSimbolo++, posSimbolo);
    			}
    		} else clearTimeout(timeout);
    	}

    	function intervalo() {
    		clearTimeout(timeout);
    		timeout = setTimeout(proximoSimbolo, msIntervalo);
    	}

    	function reset() {
    		clearTimeout(timeout);
    		$$invalidate(5, posSimbolo = 0);
    		$$invalidate(16, estadoAtual = null);
    		$$invalidate(3, executando = false);
    	}

    	const writable_props = ['nomeAfd', 'editavel'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Automato> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => $$invalidate(6, controlesVisiveis = !controlesVisiveis);

    	function input_change_input_handler() {
    		dilatacaoTemporal = to_number(this.value);
    		$$invalidate(1, dilatacaoTemporal);
    	}

    	$$self.$$set = $$props => {
    		if ('nomeAfd' in $$props) $$invalidate(15, nomeAfd = $$props.nomeAfd);
    		if ('editavel' in $$props) $$invalidate(0, editavel = $$props.editavel);
    	};

    	$$self.$capture_state = () => ({
    		afds,
    		Estado: Estado$1,
    		EstadoComponent: Estado,
    		Icon,
    		nomeAfd,
    		editavel,
    		executando,
    		palavra,
    		posSimbolo,
    		dilatacaoTemporal,
    		minDilatacaoTemporal,
    		maxDilatacaoTemporal,
    		timeout,
    		msIntervalo,
    		controlesVisiveis,
    		afd,
    		componentes,
    		estadoAtual,
    		proxId,
    		filtraPalavra,
    		filtraAlfabeto,
    		criaEstado,
    		alteraExecucao,
    		atualizaVelocidade,
    		proximoSimbolo,
    		intervalo,
    		reset,
    		$afd
    	});

    	$$self.$inject_state = $$props => {
    		if ('nomeAfd' in $$props) $$invalidate(15, nomeAfd = $$props.nomeAfd);
    		if ('editavel' in $$props) $$invalidate(0, editavel = $$props.editavel);
    		if ('executando' in $$props) $$invalidate(3, executando = $$props.executando);
    		if ('palavra' in $$props) $$invalidate(4, palavra = $$props.palavra);
    		if ('posSimbolo' in $$props) $$invalidate(5, posSimbolo = $$props.posSimbolo);
    		if ('dilatacaoTemporal' in $$props) $$invalidate(1, dilatacaoTemporal = $$props.dilatacaoTemporal);
    		if ('timeout' in $$props) timeout = $$props.timeout;
    		if ('msIntervalo' in $$props) msIntervalo = $$props.msIntervalo;
    		if ('controlesVisiveis' in $$props) $$invalidate(6, controlesVisiveis = $$props.controlesVisiveis);
    		if ('componentes' in $$props) $$invalidate(7, componentes = $$props.componentes);
    		if ('estadoAtual' in $$props) $$invalidate(16, estadoAtual = $$props.estadoAtual);
    		if ('proxId' in $$props) proxId = $$props.proxId;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty[0] & /*dilatacaoTemporal*/ 2) {
    			msIntervalo = 1000 * (1 / dilatacaoTemporal);
    		}

    		if ($$self.$$.dirty[0] & /*$afd, nomeAfd, estadoAtual*/ 98308) {
    			$$invalidate(7, componentes = $afd.estados.map((estado, i) => ({
    				nomeAfd,
    				estado,
    				x: 16 + 300 * i,
    				y: 16,
    				selecionado: estado === estadoAtual
    			})));
    		}
    	};

    	return [
    		editavel,
    		dilatacaoTemporal,
    		$afd,
    		executando,
    		palavra,
    		posSimbolo,
    		controlesVisiveis,
    		componentes,
    		afd,
    		filtraPalavra,
    		filtraAlfabeto,
    		criaEstado,
    		alteraExecucao,
    		atualizaVelocidade,
    		reset,
    		nomeAfd,
    		estadoAtual,
    		click_handler,
    		input_change_input_handler
    	];
    }

    class Automato extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, { nomeAfd: 15, editavel: 0 }, null, [-1, -1]);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Automato",
    			options,
    			id: create_fragment$1.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*nomeAfd*/ ctx[15] === undefined && !('nomeAfd' in props)) {
    			console.warn("<Automato> was created without expected prop 'nomeAfd'");
    		}

    		if (/*editavel*/ ctx[0] === undefined && !('editavel' in props)) {
    			console.warn("<Automato> was created without expected prop 'editavel'");
    		}
    	}

    	get nomeAfd() {
    		throw new Error("<Automato>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set nomeAfd(value) {
    		throw new Error("<Automato>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get editavel() {
    		throw new Error("<Automato>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set editavel(value) {
    		throw new Error("<Automato>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    const subscriber_queue = [];
    /**
     * Create a `Writable` store that allows both updating and reading by subscription.
     * @param {*=}value initial value
     * @param {StartStopNotifier=}start start and stop notifications for subscriptions
     */
    function writable(value, start = noop) {
        let stop;
        const subscribers = new Set();
        function set(new_value) {
            if (safe_not_equal(value, new_value)) {
                value = new_value;
                if (stop) { // store is ready
                    const run_queue = !subscriber_queue.length;
                    for (const subscriber of subscribers) {
                        subscriber[1]();
                        subscriber_queue.push(subscriber, value);
                    }
                    if (run_queue) {
                        for (let i = 0; i < subscriber_queue.length; i += 2) {
                            subscriber_queue[i][0](subscriber_queue[i + 1]);
                        }
                        subscriber_queue.length = 0;
                    }
                }
            }
        }
        function update(fn) {
            set(fn(value));
        }
        function subscribe(run, invalidate = noop) {
            const subscriber = [run, invalidate];
            subscribers.add(subscriber);
            if (subscribers.size === 1) {
                stop = start(set) || noop;
            }
            run(value);
            return () => {
                subscribers.delete(subscriber);
                if (subscribers.size === 0) {
                    stop();
                    stop = null;
                }
            };
        }
        return { set, update, subscribe };
    }

    /* src\App.svelte generated by Svelte v3.42.4 */
    const file = "src\\App.svelte";

    function create_fragment(ctx) {
    	let main;
    	let titulo;
    	let t0;
    	let h20;
    	let t2;
    	let automato0;
    	let t3;
    	let h21;
    	let t5;
    	let automato1;
    	let t6;
    	let h22;
    	let t8;
    	let automato2;
    	let current;
    	titulo = new Titulo({ $$inline: true });

    	automato0 = new Automato({
    			props: { nomeAfd: "cep", editavel: false },
    			$$inline: true
    		});

    	automato1 = new Automato({
    			props: { nomeAfd: "email", editavel: false },
    			$$inline: true
    		});

    	automato2 = new Automato({
    			props: { nomeAfd: "playground", editavel: true },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			main = element("main");
    			create_component(titulo.$$.fragment);
    			t0 = space();
    			h20 = element("h2");
    			h20.textContent = "Validador de CEP";
    			t2 = space();
    			create_component(automato0.$$.fragment);
    			t3 = space();
    			h21 = element("h2");
    			h21.textContent = "Validador de Email";
    			t5 = space();
    			create_component(automato1.$$.fragment);
    			t6 = space();
    			h22 = element("h2");
    			h22.textContent = "Playground!";
    			t8 = space();
    			create_component(automato2.$$.fragment);
    			add_location(h20, file, 2, 1, 27);
    			add_location(h21, file, 4, 1, 108);
    			attr_dev(h22, "class", "playground svelte-4ojurc");
    			add_location(h22, file, 6, 1, 193);
    			attr_dev(main, "class", "svelte-4ojurc");
    			add_location(main, file, 0, 0, 0);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			mount_component(titulo, main, null);
    			append_dev(main, t0);
    			append_dev(main, h20);
    			append_dev(main, t2);
    			mount_component(automato0, main, null);
    			append_dev(main, t3);
    			append_dev(main, h21);
    			append_dev(main, t5);
    			mount_component(automato1, main, null);
    			append_dev(main, t6);
    			append_dev(main, h22);
    			append_dev(main, t8);
    			mount_component(automato2, main, null);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(titulo.$$.fragment, local);
    			transition_in(automato0.$$.fragment, local);
    			transition_in(automato1.$$.fragment, local);
    			transition_in(automato2.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(titulo.$$.fragment, local);
    			transition_out(automato0.$$.fragment, local);
    			transition_out(automato1.$$.fragment, local);
    			transition_out(automato2.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			destroy_component(titulo);
    			destroy_component(automato0);
    			destroy_component(automato1);
    			destroy_component(automato2);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('App', slots, []);
    	afds['email'] = writable(email);
    	afds['cep'] = writable(cep);
    	afds['playground'] = writable(vazio);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		afds,
    		writable,
    		Automato,
    		Titulo,
    		cep,
    		email,
    		vazio
    	});

    	return [];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment.name
    		});
    	}
    }

    var main = new App({ target: document.body });

    return main;

}());
//# sourceMappingURL=bundle.js.map
