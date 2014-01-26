function Context(){}

// A cada nodo en el objeto nodes le aplica la función 'funct' 
// con los parámetros args
Context.prototype.forEachNode = function( nodes, funct, args ) {
    var n = args.length;
    vars  = [];
    for( var i = 0; i < n; ++i ) {
        if( typeof args[i] === 'function' )
            vars[i] = args[i].call( this );
        else
            vars[i] = args[i];
    }
    var self = this;
    (function fen( nodes ){
        if( nodes instanceof Node ) {
            funct.apply( nodes, vars );
        } else if( typeof nodes === 'function' ) {
            fen( nodes.call( self ), funct, vars )
        } else if( typeof nodes === 'object'   ) {
            for( var i in nodes ) {
                fen( nodes[i], funct, vars );
            }
        }
    })( nodes );
}

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
            var action = instruction['action'];
            for( var i = 0; i < action.length; ++i ) {
                this.context.forEachNode( action[i][0], action[i][1], action[i][2] );
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
