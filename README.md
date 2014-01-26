DOMAutomat
==========

Proyecto en torno a la implementación de una clase en javascript denominada DOMAutomat.

DOMAutomat es una clase que funciona como un autómata. Acepta una instrucciones y en función de estas modifica elementos del árbol DOM. Dichas instrucciones se producen en intervalos de tiempo fijado por el constructor de la clase.

Ficheros:

test.html:

En este fichero se muestra una tabla html 4x4 que servirá para probar el funcionamiento de DOMAutomat con diferentes instrucciones.

DOMAutomat.js:

Este fichero contiene la implementación de la clase DOMAutomat. Métodos:
DOMAutomat( timer ):
Asigna timer al atributo this.timer 
DOMAutomat.prototype.setCode( code ):
Asigna code al atributo interno this.code
DOMAutomat.prototype.run():
Modifica los elementos del DOM en función de this.code y a intervalos de tiempo this.time