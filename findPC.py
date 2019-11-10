import pickle
import sys
pcVal = {}
filepath = (sys.argv[1])
with open(filepath) as fp:
	line = fp.readline()
	curFun = ""
	inst = -2
	while line:
		st = line.find("func[")
		en = line.find("]")
		colon = line.find(":")
		splitted = line.split(" ")
		if(st!=-1 and en != -1):
			curFun = line[st+5:en] 
			pcVal[curFun] = {}
			inst = 0
			pcVal[curFun][-1]=splitted[0]			
			#print(pcVal[curFun][inst])
		elif(colon != -1 and curFun != "" and splitted[len(splitted)-1].find("type") == -1):
			pcVal[curFun][inst] = line[1:colon]			
#			print(pcVal[curFun][inst])
			inst = inst + 1
		line = fp.readline()
pickle_out = open("pcVal.pickle","wb")
pickle.dump(pcVal, pickle_out)
pickle_out.close()
