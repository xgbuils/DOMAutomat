function Compiler( code ){
    if( !(code instanceof Array) ) {
        throw Error( 'Expected instance of Array');
    } else if( code.length <= 0  ) {
        throw Error( 'It is not allowed empty code' );
    }

    this.pos   = 0;
    this.code  = {};
    this.stack = [];
    if( code.length > 0 ) {
        if( this.isDeclaration( code[0] ) ) {
            this.code[0] = code[0];
            ++this.pos;
        }
    
        this.current = { 
            'code' : code,
            'name' : 'code',
            'state': this.pos,
            'jump' : this.pos
        };
    } else {
        throw Error( 'It is not allowed empty code' );
    }
}

Compiler.prototype.isDeclaration = function( instruction ) {
    if( (typeof instruction) === 'object' ) {
        var keys = Object.keys( instruction );
        return keys.length === 1 && keys[0] === 'var';
    } else {
        return false;
    }
}

Compiler.prototype.detectInstruction = function( instruction ){
    var keys = [];
    if       ( typeof instruction === 'function' ) {
        return 'calc';
    } else if( typeof instruction ===  'object'  ) {
        keys = Object.keys( instruction );
        if       ( keys.length === 1 ) {
            if( keys[0] === 'action' )
                return 'action';
            if( keys[0] in {'while':undefined, 'if':undefined} )
                return keys;
        } else if( keys.length === 2 ) {
            keys = keys.sort( function(a,b){ return a<b; } );
            if( keys[0] === 'if' && keys[1] === 'else' )
                return keys;
        }
    }
    var error = 'instruction{ ' + keys[0];
    for( var i = 1; i < keys.length; ++i )
        error += '-' + keys[i];
    error += ' } is not allowed instruction';
    throw new Error( error );
}

Compiler.prototype.endControlFlow = function( current ) {

    var name = current.name;
    var jump = current.jump;
    if       ( name === 'while' ) {
        this.code[this.pos] = {
            'jump' : { 'to': jump }
        };
        ++this.pos;
    } else if( name === 'if'   ) {
        if( current['else'] ) {
            current = {
                'code' : current['else'],
                'name' : 'else',
                'state': -1,
                'jump' : this.pos
            };
            this.stack.push( current );
            this.code[this.pos] = {'jump': {} };
            ++this.pos;
        }
    } else if( name === 'else' ) {
           
    }
    this.code[jump]['jump']['to'] = this.pos;
    return this.stack.pop();
}

Compiler.prototype.startControlFlow = function( current, name, instruction ) {
    this.stack.push( current );
    current = {
        'code' : instruction[name[0]],
        'name' : name[0],
        'state': 0,
        'jump': this.pos 
    };
    if( name[1] === 'else' ) {
        current['else'] = instruction[name[1]];
    }
    this.code[this.pos] = {
        'jump': { 'cond': current['code'][0] }
    };
    return current;
}

Compiler.prototype.calc = function( instruction ) {
    this.code[this.pos] = {
        'calc': instruction
    };
}

Compiler.prototype.action = function( instruction ) {
    this.code[this.pos] = instruction;
}

Compiler.prototype.compile = function() {
    var current = this.current;
    
    while( true ) {
        if( current.state < current.code.length ) {
            var instruction = current.code[current.state];
            var name = this.detectInstruction( instruction );
            if( name instanceof Array ) {
                current = this.startControlFlow( current, name, instruction )
            } else  {
                this[name]( instruction )
            }
            ++this.pos;
        } else {
            if( this.stack.length === 0 ){
                break;
            }

            current = this.endControlFlow( current );
        }
        ++current.state;
    }
}