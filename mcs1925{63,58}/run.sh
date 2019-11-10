#!/bin/bash

# PreReq =  findPC , log-all , mapping , serv.py

mkdir static
mkdir templates
lines=$1
path=$2
echo $path
a=`basename $path`
#cp $2.wasm
cp $path.wasm static/$a.wasm
cp $path.js static/$a.js

cp log-all.js static/

rm templates/index.html
rm $a.tar.gz

wasm-objdump -d static/$a.wasm > static/$a.wasdump

python findPC.py static/$a.wasdump     #path
#cd /static
wasabi static/$a.wasm
mv static/$a.wasm static/$a.orig.wasm
mv out/* static/

echo '''<html lang="en-us">
<body>
	<script async type="text/javascript" src = "{{ url_for('''  >> templates/index.html
echo "'static', filename = '$a.js') }} "  >>  templates/index.html
echo '''"></script>
	<script src = "{{ url_for(''' >> templates/index.html
echo "'static', filename = '$a.wasabi.js') }}" >> templates/index.html
echo '''"></script>
	<script src = "{{ url_for(''' >> templates/index.html
echo "'static', filename = 'log-all.js') }}" >> templates/index.html
echo '''"></script> 
</body>
</html>''' >> templates/index.html

kill $(lsof -t -i:5000)
python serv.py $lines $a.tar.gz &
sleep 5
firefox "http://localhost:5000/"