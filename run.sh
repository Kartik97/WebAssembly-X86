#!/bin/bash
mkdir static
mkdir templates
a=`basename $2`
cp $2.wasm .
cp $a.wasm static
cp $2.js .
cp $a.js static
cp log-all.js static
wasm-objdump -d $a.wasm > $a.wasdump
python findPC.py $a.wasdump     #path
#cd /static
wasabi $a.wasm
mv $a.wasm $a.orig.wasm
cp out/* .
echo '''<html lang="en-us">
<body>
	<script async type="text/javascript" src = "{{ url_for('static', filename = 'atax.js') }}"></script>
	<script src = "{{ url_for('static', filename = 'atax.wasabi.js') }}"></script>
	<script src = "{{ url_for('static', filename = 'log-all.js') }}"></script> 
</body>
</html>''' >> index.html
cp index.html templates
python serv.py $1 & 

