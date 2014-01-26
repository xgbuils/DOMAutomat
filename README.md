DOMAutomat
==========

Proyecto en torno a la implementación de una clase en javascript denominada DOMAutomat.

DOMAutomat es una clase que funciona como un autómata. Acepta una instrucciones y en función de estas modifica elementos del árbol DOM. Dichas instrucciones se producen en intervalos de tiempo fijado por el constructor de la clase.

Organización del código:

/ :

*.html : ficheros HTML para test de la clase DOMAutomat

test/css/*.css: ficheros CSS directamente relacionados con los ficheros HTML de mismo nombre para test de la clase DOMAutomat

test/js/*.js: ficheros CSS directamente relacionados con los ficheros HTML y CSS de mismo nombre para test de la clase DOMAutomat

En este fichero se muestra una tabla html 4x4 que servirá para probar el funcionamiento de DOMAutomat con diferentes instrucciones.

project/ :

Ficheros relacionados con la clase DOMAutomat

project/DOMAutomat.js: fichero que contiene la implementación de la clase DOMAutomat. Métodos:

DOMAutomat( timer ): Asigna timer al atributo this.timer 

DOMAutomat.prototype.setCode( code ): Asigna code al atributo interno this.code

DOMAutomat.prototype.run(): Modifica los elementos del DOM en función de this.code y a intervalos de tiempo this.time

project/Compiler.js: fichero que contiene la implementación de la clase Compiler. Compiler es una clase que a partir de un objeto literal que representa un código imperativo, lo parsea y contruye un código de estilo ensamblador fácil de interpretar para la clase DOMAutomat.