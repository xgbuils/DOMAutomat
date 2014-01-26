window.onload = function() {
    
    var table = document.getElementById('table');
    var rows = table.getElementsByTagName('tr');
    var cells = [];
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
                { 'if': [ function(){ return this.flag; },
                    { 'action': function() { return [
                        [this.prev, removeClass, [this.bgClass] ],
                        [this.cur , addClass   , [this.bgClass] ]
                    ]}},
                    { 'if': [ function(){ return this.cur.classList.contains('bg-blue'); },
                        { 'action': function() { return [
                            [this.cur, removeClass, [this.bgClass] ],
                        ]}},
                        function(){
                            this.bgClass = this.bgClass === 'bg-red' ? 'bg-green' : 'bg-red';
                            this.flag = false;
                        },
                        { 'action': function() { return [
                            [this.cur, addClass, [this.bgClass] ],
                        ]}},
                    ]},
                    function(){
                        this.prev = this.cur;
                    }
                ],'else': [ 
                    function(){
                        this.flag = true;
                    }
                ]},
                function(){
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