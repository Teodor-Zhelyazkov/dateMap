# dateMap 
dateMap it's a simple pure javascript library for selecting dates.

# get started 

<h3>Instalation</h3>

Download files <b>datemap.js</b> and <b>datemap.css</b> from this repository

<h3>Usage</h3>

Include dateMap library on your webpage

<pre><code>
< script src="datemap.js"></script >
< link rel="stylesheet" href="datemap.css">
</code></pre>

Init dateMap 

<pre><code>
< input type = "text" id = "default_example" / >

var dmObj = new dateMap({
  selector : "#default_example",
});
</code></pre>

Examples : 

  default usage:
    https://jsfiddle.net/TeodorZhelyazkov/cw6c3xfc/
    
  min/max date usage:
    https://jsfiddle.net/TeodorZhelyazkov/2unwgcae/
    
  disabledEvents usage:
    https://jsfiddle.net/TeodorZhelyazkov/8qad6s62/
  
  Min and Max date to another dateMap:
    https://jsfiddle.net/TeodorZhelyazkov/oo3329sn/
