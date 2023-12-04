# File: Reassemble.py
# -------------------
# This file exports a program that reads in a large number
# of text fragments from a file you choose, and then reconstructs
# the original text so it can be printed out.

from filechooser import chooseInputFile

def extractFragments(filename):
   fragments = []
   str = ""
   with open(filename) as file:
      for line in file:
         while line.find('}') != -1:
            if str != "":
               str += line[: line.find('}')]
            else:
               str = line[line.find('{') + 1 : line.find('}')]
            
            fragments.append(str)
            str = ""
            line = line[line.find('}') + 1:]

         if line.find('{') != -1:
            str = line[1:]

         elif line != '\n':
            str += line 
         
   return fragments

def numOfOverlap(str1, str2):
   numOverlap = 0
   length = min(len(str1), len(str2))
   str = ""
   for i in range(length):
      str += str1[i]
      if str == str2[-i - 1:]:
         numOverlap = (i + 1)
         break

   str = ""
   for j in range(length):
      str += str2[j]
      if str == str1[-j - 1:] and j > numOverlap:
         numOverlap = (j + 1)
         break

   return numOverlap

def mergeFragment(str1, str2, num_overlap):
   if num_overlap == 0:
      return str1 + str2
   
   if str1[:num_overlap] == str2[-num_overlap:]:
      str = str2 + str1[num_overlap:]
   else:
      str = str1 + str2[num_overlap:]

   return str

def removeContained(fragments):
   contained = []
   for i in range (len(fragments) - 1):
      for j in range (i + 1, len(fragments)):
         if fragments[i] in fragments[j] or fragments[j] in fragments[i]:
            index = j if (len(fragments[i]) > len(fragments[j])) else i
            if contained.count(index) == 0:
               contained.append(index)
            continue
   # remove all contained fragment
   contained.sort(reverse=True)
   for k in range(len(contained)):
      fragments.remove(fragments[contained[k]])

def constructRound(fragments):
   max_overlap = 0
   pair_overlap = []

   for i in range (len(fragments) - 1):
      for j in range (i + 1, len(fragments)):
         overlap = numOfOverlap(fragments[i], fragments[j])
         if(overlap > max_overlap):
            max_overlap = overlap
            pair_overlap.clear()
            pair_overlap.extend((i, j))      
   
   if pair_overlap:
      merge = mergeFragment(fragments[pair_overlap[0]], fragments[pair_overlap[1]], max_overlap)
      fragments[pair_overlap[0]] = merge
      fragments.remove(fragments[pair_overlap[1]])
   else: # no overlap
      while len(fragments) > 1:
         merge = mergeFragment(fragments[0], fragments[1], 0)
         fragments[0] = merge
         fragments.remove(fragments[1])

def reconstruct(fragments):
   
   while len(fragments) > 1:
      removeContained(fragments)
      constructRound(fragments)
   return fragments[0]

def Reassemble():
   filename = chooseInputFile("reassemble-files")
   if filename == "":
      print("User canceled file selection. Quitting!")
      return
   fragments = extractFragments(filename)
   # print(fragments)
   if fragments == None:
      print("File didn't respect reassemble file format. Quitting!")
      return
   reconstruction = reconstruct(fragments)
   print(reconstruction)

if __name__ == "__main__":
   Reassemble()
