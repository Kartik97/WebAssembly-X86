from flask import Flask, request, jsonify,render_template
import json
import pickle
import threading
import gzip
import sys
import pandas as pd
import math,time,subprocess

gpr={"eax":0,"ecx":0,"edx":0,"esi":0,"edi":0,"ebp":0,"esp":0}
gprL = ["eax","ecx","edx","esi","edi","edi","ebp","esp"]
#reg={"ax":0,"bx":0,"cx":0,"dx":0,"si":0,"di":0,"bp":0,"sp":0
#	,"ah":0,"al":0,"bh":0,"bl":0,"ch":0,"cl":0,"dh":0,"dl":0}
reg={}
arg1 = ""
arg2 = ""

app = Flask(__name__, static_url_path='/static')
pickleMap = open("pcVal.pickle","rb")
pcMap = pickle.load(pickleMap)
#insPickle = open("instMap.pickle","rb")
#insMap = pickle.load(insPickle)
insMap = pd.read_csv("mapping.csv",index_col="name")

sem = threading.Semaphore()
numLines = int(sys.argv[1])
outFile = sys.argv[2]

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
	subprocess.call(["pkill", "firefox"])
	func()

req=0
arrived={}
@app.route('/user',methods=["GET","POST"])
def get_user():
	global req
	global arrived
	global numLines
	global reg
	if(request.method == "POST"):
		text = request.get_json()
		print(next(iter(text)))
		arrived[next(iter(text))] = text[next(iter(text))]
		sem.acquire()
		file = gzip.open(outFile,'a',9)
		#instList = text["DATA"]
		#while (arrived[str(req)]==None):
		while(str(req) not in arrived):
			continue
		#instList = text[str(req)]
		instList = arrived[str(req)]
		#print(instList)
		#arrived.pop(str(req), None)
		#print(instList)
		for k in range(0,len(instList)):
			i=instList[k]
			#if(pcMap[i["func"]][int(i["inst"])]!=None):
			if(i["func"] in pcMap and int(i["inst"]) in pcMap[i["func"]]):
				s = pcMap[i["func"]][int(i["inst"])]+" 27 "
			else:
				continue
			if(i["instruction"] in insMap.index):
				if(insMap["mapping"][i["instruction"].strip()]=='NONE'):
					continue
				else:
					if(i["instruction"].find("const") != -1):
						s=s+"const "
					s=s+insMap["mapping"][i["instruction"].strip()]+" "
			if(i["instruction"].find("load") != -1):
				s=s+"sp ecx\n"+pcMap[i["func"]][int(i["inst"])]+" 2 "+i["param"]["addr"]
			elif (i["instruction"].find("store") != -1):
				s=s+"edx sp"+"\n"+pcMap[i["func"]][int(i["inst"])]+" 3 "+i["param"]["addr"]
			elif (i["instruction"].find("br") != -1):
				s=s+"label:"+i["param"]["label"]+"\n"+pcMap[i["func"]][int(i["inst"])]+" 4 "+pcMap[i["param"]["targetFun"]][int(i["param"]["targetInst"])]
			elif(i["instruction"].find("br_if") != -1):
				if(i["param"]["cond"]=="true"):
					s=s+"label:"+i["param"]["label"]+"\n"+pcMap[i["func"]][int(i["inst"])]+" 4 "+pcMap[i["param"]["targetFun"]][int(i["param"]["targetInst"])]					
				else:
					s=s+"label:"+i["param"]["label"]+"\n"+pcMap[i["func"]][int(i["inst"])]+" 5 "+pcMap[i["param"]["targetFun"]][int(i["param"]["targetInst"])]
			elif (i["instruction"].find("call") != -1):
				if(i["param"]["target"] in pcMap):
					s=s+"func:"+i["param"]["target"]+"\n"+pcMap[i["func"]][int(i["inst"])]+" 4 "+pcMap[i["param"]["target"]][-1]				
				else:
					s=s+"func:"+i["param"]["target"]+"\n"+pcMap[i["func"]][int(i["inst"])]+" 4"
			elif(i["instruction"].find("if_") != -1):
				if(k+1<len(instList)):
					nextIns = instList[k+1]
					if(i["param"]["cond"]=="true"):
						s=s+pcMap[nextIns["func"]][int(nextIns["inst"])]+"\n"+pcMap[i["func"]][int(i["inst"])]+" 5 "+pcMap[nextIns["func"]][int(nextIns["inst"])]
					else:
						s=s+pcMap[nextIns["func"]][int(nextIns["inst"])]+"\n"+pcMap[i["func"]][int(i["inst"])]+" 4 "+pcMap[nextIns["func"]][int(nextIns["inst"])]
			else:
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
		time.sleep(0.05)
		req=req+1
		print(req)
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
