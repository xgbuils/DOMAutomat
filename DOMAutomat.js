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

function DOMAutomat( timer ) {
    this.timer = timer;
    this.ip    = 0; // puntero de instrucciones
}


DOMAutomat.prototype.setCode = function( code ) {
    code.length = Object.keys( code ).length;
    this.code   = Array.prototype.slice.call( code );
}

// ejecuta la accion actual y avanza el puntero de instrucciones(IP)
DOMAutomat.prototype.execute = function() {
    var action = this.code[this.ip];
    for( var i = 0; i < action.length; ++i ) {
        document.forEachNode( action[i][0], action[i][1], action[i][2] );
    }
    ++this.ip;
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

    var code = [
        [],
        [
            [cells[0][0], addClass, ['bg-red'] ],
        ],
        [
            [cells[0][0], removeClass, ['bg-red'] ],
            [cells[0][1], addClass   , ['bg-red'] ]
        ],
        [
            [cells[0][1], removeClass, ['bg-red'] ],
            [cells[0][2], addClass   , ['bg-red'] ]
        ],
        [
            [cells[0][2], removeClass, ['bg-red'] ],
            [cells[0][3], addClass   , ['bg-red'] ]
        ],
        [
            [cells[0][3], removeClass, ['bg-red'] ],
            [cells[1][0], addClass   , ['bg-red'] ]
        ],
        [
            [cells[1][0], removeClass, ['bg-red'] ],
            [cells[1][1], addClass   , ['bg-red'] ]
        ],
        [
            [cells[1][1], removeClass, ['bg-red'] ],
            [cells[1][2], addClass   , ['bg-red'] ]
        ],
        [
            [cells[1][2], removeClass, ['bg-red'] ],
            [cells[1][3], addClass   , ['bg-red'] ]
        ],
        [
            [cells[1][3], removeClass, ['bg-red'] ],
            [cells[2][0], addClass   , ['bg-red'] ]
        ],
        [
            [cells[2][0], removeClass, ['bg-red'] ],
            [cells[2][1], addClass   , ['bg-red'] ]
        ],
        [
            [cells[2][1], removeClass, ['bg-red'] ],
            [cells[2][2], addClass   , ['bg-red'] ]
        ],
        [
            [cells[2][2], removeClass, ['bg-red'] ],
            [cells[2][3], addClass   , ['bg-red'] ]
        ],
        [
            [cells[2][3], removeClass, ['bg-red'] ],
            [cells[3][0], addClass   , ['bg-red'] ]
        ],
        [
            [cells[3][0], removeClass, ['bg-red'] ],
            [cells[3][1], addClass   , ['bg-red'] ]
        ],
        [
            [cells[3][1], removeClass, ['bg-red'] ],
            [cells[3][2], addClass   , ['bg-red'] ]
        ],
        [
            [cells[3][2], removeClass, ['bg-red'] ],
            [cells[3][3], addClass   , ['bg-red'] ]
        ],
        [
            [cells[3][3], removeClass, ['bg-red'] ],
        ]
    ];

    // crea un autamata que ejecuta una acción cada segundo
    var domAutomat = new DOMAutomat(1000);
    // asigna el codigo al automata
    domAutomat.setCode( code );
    // pone en ejecución el automata
    domAutomat.run();
}