from flask import Flask, request, jsonify,render_template
import json
import pickle
import threading
import gzip
import sys
app = Flask(__name__, static_url_path='/static')
pickleMap = open("pcVal.pickle","rb")
pcMap = pickle.load(pickleMap)
sem = threading.Semaphore()
numLines = int(sys.argv[1])
if(numLines == -1):
	numLines = -10

@app.route('/')
def index():
    return render_template("index.html")
    #return send_from_directory('js', path)

def shutdown_server():
	func = request.environ.get('werkzeug.server.shutdown')
	if func is None:
		raise RuntimeError('Not running with the Werkzeug Server')
	func()

req=0
arrived={}
@app.route('/user',methods=["GET","POST"])
def get_user():
	global req
	global arrived
	global numLines
	print(req)
	if(request.method == "POST"):
		text = request.get_json()
		print(next(iter(text)))
		arrived[next(iter(text))] = text[next(iter(text))]
		sem.acquire()
		file = gzip.open('data.tar.gz','a',9)
		#instList = text["DATA"]
		#while (arrived[str(req)]==None):
		while(str(req) not in arrived):
			continue
		#instList = text[str(req)]
		instList = arrived[str(req)]
		#print(instList)
		#arrived.pop(str(req), None)
		for i in instList:
			#if(pcMap[i["func"]][int(i["inst"])]!=None):
			if(i["func"] in pcMap and int(i["inst"]) in pcMap[i["func"]]):
				s = pcMap[i["func"]][int(i["inst"])]+" "+i["instruction"]+" "
			for j in i["param"]:
				s = s+i["param"][j]+" "
			s=s+"\n"
			if(numLines > 0 or numLines == -10):
				file.write(s.encode())
			else:
				shutdown_server()
			if(numLines > 0):
				numLines=numLines-1
	  		#file.write(pcMap[i["func"]][int(i["inst"])]+" "+i["instruction"]+" "+i["param"]+"\n");	
	  	#file.write(pcMap[text["DATA"][1]["func"]][int(text["DATA"][1]["inst"])]+" "+text["DATA"][1]["instruction"]+"\n");
		file.close()
		print(req)
		req=req+1
		sem.release()
	return "Success"

@app.route('/shutdown', methods=['POST'])
def shutdown():
    shutdown_server()
    return 'Server shutting down...'

@app.route('/process')
def about():
    return render_template('process.html')

if __name__ == '__main__':
  	app.run(debug=False)
