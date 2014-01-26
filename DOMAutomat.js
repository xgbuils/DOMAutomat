// A cada nodo en el objeto nodes le aplica la función 'funct' 
// con los parámetros args
Document.prototype.forEachNode = function( nodes, funct, args ) {
    if( nodes instanceof Node ) {
        funct.apply( nodes, args );
    } else if( typeof nodes === 'object' ) {
        for( var i in nodes ) {
            this.forEachNode( nodes[i], funct, args );
        }
    }
}

function Context(){}

Context.prototype['var'] = function( instruction, ip ){
    var type = typeof instruction;
    if( type === 'object' ) {
        for( key in instruction ) {
            if( key in this ) 
                throw new Error( 'Cannot redeclare variable \''+key+'\'' );
            this[key] = instruction[key];
        }
    } else {
        throw new Error( 'Expected object instead ' + type );
    }
    return ip + 1;
}

Context.prototype.jump = function( instruction, ip ) {
    if( instruction.cond && instruction.cond.call( this ) )
        return ip + 1;
    else
        return instruction.to;
}

Context.prototype.calc = function( instruction, ip ) {
    if( instruction )
        instruction.call( this );
    return ip + 1;
}

function DOMAutomat( timer ) {
    this.timer   = timer;
    this.ip      = 0; // puntero de instrucciones
    this.context = new Context(); 
}


DOMAutomat.prototype.setCode = function( code ) {
    code.length = Object.keys( code ).length;
    this.code   = Array.prototype.slice.call( code );
}

// ejecuta instrucciones hasta encontrar una acción, al encontrarla
// la ejecuta y avanza el puntero de instrucciones(IP)
DOMAutomat.prototype.execute = function() {
    var n = this.code.length;
    while( this.ip < n ) {
        var instruction = this.code[this.ip];
        if( 'action' in instruction ) {
            var action = instruction['action'].call( this.context );
            for( var i = 0; i < action.length; ++i ) {
                document.forEachNode( action[i][0], action[i][1], action[i][2] );
            }
            ++this.ip;
            break;
        } else {
            var key = Object.keys(instruction)[0];
            this.ip = this.context[key].call( this.context, instruction[key], this.ip );
        }
    }
}

// ejecuta acciones hasta que IP sale más allá del código
DOMAutomat.prototype.run = function() {
    this.execute();
    if( this.ip < this.code.length ) {
        var self = this;
        setTimeout( function(){
            self.run();
        }, self.timer );
    }
}

function addClass() {
    var n = arguments.length;
    for( var i = 0; i < n; ++i )
        this.classList.add( arguments[i] );
}

function removeClass() {
    var n = arguments.length;
    for( var i = 0; i < n; ++i )
        this.classList.remove( arguments[i] );
}

window.onload = function() {
    
    var table = document.getElementById('table');
    var rows = table.getElementsByTagName('tr');
    var cells = [];
    // construir tabla 'cells' asociada a la tabla html
    for( var i = 0; i < rows.length; ++i ) {
        cells[i] = rows[i].getElementsByTagName('td');
    }

    var code = {
        0:  { 'var' : { 
                'i'   : 0        , 
                'j'   : undefined,
                'prev': undefined,
                'cur' : undefined
            }},
        1:  { 'action': function(){ return [ 
                // accion nula
            ]}},
        2:  { 'jump': { 
                'cond': function(){
                    return this.i < 4;
                },
                'to': 11
            }},
        3:  { 'calc': function(){
                this.j = 0;
            }},
        4:  { 'jump': { 
                'cond': function(){
                    return this.j < 4;
                },
                'to': 9
            }},
        5:  { 'calc': function(){
                this.cur = cells[this.i][this.j];
            }},
        6:  { 'action': function() { return [
                [this.prev, removeClass, ['bg-red'] ],
                [this.cur , addClass   , ['bg-red'] ]
            ]}},
        7:  { 'calc': function(){
                this.prev = this.cur;
                ++this.j;
            }},
        8:  { 'jump': {
                'to': 4
            }},
        9:  { 'calc': function(){
                ++this.i;
            }},
        10: { 'jump': {
                'to': 2
            }},
        11: { 'action': function() { return [
                [this.prev, removeClass, ['bg-red'] ]
            ]}}
    };

    // crea un autamata que ejecuta una acción cada segundo
    var domAutomat = new DOMAutomat(1000);
    // asigna el codigo al automata
    domAutomat.setCode( code );
    // pone en ejecución el automata
    domAutomat.run();
}