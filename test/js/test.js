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
        var x = rows[i].getElementsByTagName('td');
        cells[i] = [];
        for( var j = 0; j < 4; ++j )
            cells[i][j] = x[j];
    }

    var cc = new Compiler();

    cc
    .var( '$cells'  , cells   )
    .var( '$i', '$j', '$prev', '$cur' )
    .action(
        //accio nula
    )
    .for( "$i=0", "$i < 4", "++$i" )
        .for( "$j = 0", "$j < 4", "++$j" )
            .calc( "$cur = $cells[$i][$j]" )
            .action(
                ["$prev", removeClass, ["bg-red"] ],
                ["$cur" , addClass   , ["bg-red"] ]
            )
            .calc( "$prev = $cur" )
        .end()
    .end()
    .action(
        ["$prev", removeClass, ["bg-red"] ]
    );

    // crea un autamata que ejecuta una acción cada segundo
    var domAutomat = new DOMAutomat(1000);
    // asigna el codigo al automata
    domAutomat.setCode( cc.code );
    // pone en ejecución el automata
    domAutomat.run();
}