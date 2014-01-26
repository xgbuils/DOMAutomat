function Compiler(){
    this.pos   = 1;
    this.code  = { 0: {'var': {} } };
    this.stack = [];
    this.current = { 
        'name' : 'start',
        'jump' : 1
    };
}

Compiler.prototype.startOff = function() {
    if( this.current.name === 'start')
        this.current.name = 'code';
}

Compiler.prototype.insertVar = function( key, value ) {
    if( key in this.code[0]['var'] ) {
        throw new Error( 'Cannot redeclare variable \'' + key + '\'' );
    } else {
        this.code[0]['var'][key] = value;
    }
}

Compiler.prototype.var = function(){
    if( this.current.name === 'start' ){
        var n = arguments.length;
        var arg0 = arguments[0];
        if( n === 2 ) {
            if( typeof arg0 === 'string' ) {
                this.insertVar( arg0, arguments[1] );
            } else {
                throw new Error( 'Invalid variable declaration' );
            }
        } else if( n === 1 && typeof arg0 === 'object' ) {
            for( var key in arg0 ) {
                this.insertVar( key, arg0[key] );
            }
        } else {
            for( var i = 0; i < n; ++i ){
                if( typeof arguments[i] === 'string' ) {
                    this.insertVar( arguments[i] );
                } else {
                    throw new Error( 'Invalid variable declaration' );
                }
            }
        }
    } else {
        throw new Error('Only variables can be declared at the beginning');
    }
    return this;
}

Compiler.prototype.while = function( cond ) {
    this.startOff();
    var type = typeof cond;
    if( type === 'string' ) {
        cond = cond.replace( /(\$[a-z0-9_]+)/gi , "this.$1" );
        var f_cond = new Function( 'return ' + cond );
        this.stack.push( this.current );
        this.current = {
            'name': 'while',
            'jump': this.pos 
        };
        this.code[this.pos] = {
            'jump': { 'cond': f_cond }
        };
        ++this.pos;
    } else {
        throw new Error('Unexpected ' + type + ' type of argument' );
    }
    return this;
}

Compiler.prototype.if = function( cond ) {
    this.startOff();
    var type = typeof cond;
    if( type === 'string' ) {
        cond = cond.replace( /(\$[a-z0-9_]+)/gi , "this.$1" );
        var f_cond = new Function( 'return ' + cond );
        this.stack.push( this.current );
        this.current = {
            'name': 'if',
            'jump': this.pos
        };
        this.code[this.pos] = {
            'jump': { 'cond': f_cond }
        };
        ++this.pos;
    } else {
        throw new Error('Unexpected ' + type + ' type of argument' );
    }
    return this;
}

Compiler.prototype.else = function() {
    this.startOff();
    if( this.current.name === 'if' ) {
        var jump = this.current.jump;
        this.current = {
            'name': 'else',
            'jump': this.pos
        };

        this.code[this.pos] = {'jump': {} };
        ++this.pos;
        this.code[jump]['jump']['to'] = this.pos;
    } else {
        throw new Error( 'Unexpected method \'else\' before the call of method \'if\'' );
    }
    return this;
}

Compiler.prototype.for = function( init, cond, next ) {
    this.calc( init );
    this.while( cond );
    this.current['after'] = next;

    return this;
}

Compiler.prototype.end = function() {
    var name = this.current.name;
    if( name === 'while' || name === 'if' || name === 'else' ){
        var after = this.current.after;
        if( after ) {
            this.calc( after );
        }
        var jump = this.current.jump;
        if       ( name === 'while' ){
            this.code[this.pos] = { 
                'jump': { 'to': jump }
            };
            ++this.pos;
        }
        this.code[jump]['jump']['to'] = this.pos;
        this.current = this.stack.pop();
    } else {
        throw new Error('Unexpected method \'end\' before the call of methods \'while\', \'if\' or \'else\'');
    }

    return this;
}

Compiler.prototype.calc = function() {
    this.startOff();
    var n = arguments.length;
    for( var i = 0; i < n; ++i ) {
        if( typeof arguments[i] !== 'string' )
            throw new Error( '\'calc\' method expected string type arguments' );
    }
    var args = Array.prototype.slice.call( arguments );
    var body = args.join(';');

    body = body.replace( /(\$[a-z0-9_]+)/gi , "this.$1" );
    var f_calc = new Function( body );

    this.code[this.pos] = { 
        'calc': f_calc
    };
    ++this.pos;

    return this;
}

Compiler.prototype.action = function( instruction ) {
    this.startOff();
    var action = Array.prototype.slice.call( arguments );
    for( var i in action ) {
        if( typeof action[i][0] === 'string' ){
            action[i][0] = action[i][0].replace( /(\$[a-z0-9_]+)/gi , "this.$1" );
            action[i][0] = new Function( 'return ' + action[i][0] );
        }
        var args = action[i][2];
        for( var j in args ) {
            if( typeof args[j] === 'string' && args[j].match( /(\$[a-z0-9_]+)/i ) ) {
                args[j] = args[j].replace( /(\$[a-z0-9_]+)/gi , "this.$1" );
                action[i][2][j] = new Function( 'return ' + args[j] );
            }
        }
    }

    if( this.current.name === 'start' ) {
        this.current.name = 'code';
    }
    this.code[this.pos] = {
        'action': action
    };
    ++this.pos;

    return this;
}