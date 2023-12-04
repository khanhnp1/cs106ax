# File: GenerateRandomSentences.py
# --------------------------------
# This file exports a program that reads in a grammar file and
# then prints three randomly generated sentences

from filechooser import chooseInputFile
from random import choice

def getExpandstr(line, grammar):
   sentence = ""   
   while True:
      if line.find('<') == -1:
         sentence += line
         return sentence
      
      sentence += line[:line.find('<')]
      tag = line[line.find('<') + 1: line.find('>')]
      expand_str = choice(grammar[tag])
      line = line[line.find('>') + 1:]
      sentence += getExpandstr(expand_str, grammar)

def readGrammar(filename):
   gramar = {}
   with open(filename) as file:
      while True:
         str = file.readline().rstrip()
         if str == "":
            return gramar
         
         str = str[1 : len(str) - 1]
         gramar[str] = []
         expansion_num = int(file.readline().rstrip())
         for i in range (expansion_num):
            line = file.readline().rstrip()
            gramar[str].append(line)
         file.readline()

def generateRandomSentence(grammar):
   RandomSentence = ""
   start = grammar["start"]
   for i in range (len(start)):
      sentence = getExpandstr(start[i], grammar).rstrip()    
      RandomSentence += (sentence + '\r\n')

   return RandomSentence 

def GenerateRandomSentences():
   filename = chooseInputFile("grammars")
   grammar = readGrammar(filename)
   for i in range(3):
      print("Random sentence #" + str(i + 1))
      print("---------------------------")
      print(generateRandomSentence(grammar))

if __name__ == "__main__":
   GenerateRandomSentences()
