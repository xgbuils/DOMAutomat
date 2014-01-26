window.onload = function() {
    
    var table = document.getElementById('table');
    var rows = table.getElementsByTagName('tr');
    var cells = [];
    // construir tabla 'cells' asociada a la tabla html
    for( var i = 0; i < rows.length; ++i ) {
        cells[i] = rows[i].getElementsByTagName('td');
    }

    var code = [
        { 'var' : { 
            'i'      : 0        , 
            'j'      : undefined,
            'prev'   : undefined,
            'cur'    : undefined,
            'flag'   : true     ,
            'bgClass': 'bg-red'
        }},
        { 'action': function() { return [
            //acción nula
        ]}},
        { 'while': [ function(){ return this.i < 4; },
            function(){
                this.j = 0;
            },
            { 'while' : [ function(){ return this.j < 4; }, 
                function(){
                    this.cur = cells[this.i][this.j];
                },
                { 'action': function() { return [
                    [this.prev, removeClass, [this.bgClass] ],
                    [this.cur , addClass   , [this.bgClass] ]
                ]}},
                function(){
                    this.prev = this.cur;
                    ++this.j;
                },
            ]},
            function(){
                ++this.i;
            }
        ]},
        { 'action': function() { return [
            [this.prev, removeClass, ['bg-red'] ]
        ]}}
    ];

    // crea un autamata que ejecuta una acción cada segundo
    var domAutomat = new DOMAutomat(1000);
    // asigna el codigo al automata
    domAutomat.setCode( code );
    // pone en ejecución el automata
    domAutomat.run();
}