# File: AdvGame.py

"""
This module defines the AdvGame class, which records the information
necessary to play a game.
"""
import os

from AdvRoom import AdvRoom
from AdvObject import AdvObject
from tokenscanner import TokenScanner

###########################################################################
# Your job in this assignment is to fill in the definitions of the        #
# methods listed in this file, along with any helper methods you need.    #
# Unless you are implementing extensions, you won't need to add new       #
# public methods (i.e., methods called from other modules), but the       #
# amount of code you need to add is large enough that decomposing it      #
# into helper methods will be essential.                                  #
###########################################################################

# Constants
HELP_TEXT = [
    "Welcome to Adventure!",
    "Somewhere nearby is Colossal Cave, where others have found fortunes in",
    "treasure and gold, though it is rumored that some who enter are never",
    "seen again.  Magic is said to work in the cave.  I will be your eyes",
    "and hands.  Direct me with natural English commands; I don't understand",
    "all of the English language, but I do a pretty good job.",
    "",
    "It's important to remember that cave passages turn a lot, and that",
    "leaving a room to the north does not guarantee entering the next from",
    "the south, although it often works out that way.  You'd best make",
    "yourself a map as you go along.",
    "",
    "Much of my vocabulary describes places and is used to move you there.",
    "To move, try words like IN, OUT, EAST, WEST, NORTH, SOUTH, UP, or DOWN.",
    "I also know about a number of objects hidden within the cave which you",
    "can TAKE or DROP.  To see what objects you're carrying, say INVENTORY.",
    "To reprint the detailed description of where you are, say LOOK.  If you",
    "want to end your adventure, say QUIT."
]

class AdvGame:

    def __init__(self, prefix):
        """Reads the game data from files with the specified prefix."""
        check_file = os.path.exists(prefix + "Objects.txt")
        with open(prefix + "Rooms.txt") as f:
            self._rooms = self.readRoomData(f)

        if check_file:
            with open(prefix + "Objects.txt") as f:
                self._objects = self.readObjectData(f)
            self.placeObjects()  
        else:
            self._objects = {}
        self._player = []

    def getRoom(self, name):
        """Get room data by name"""
        return self._rooms[name]
    
    def getObject(self, name):
        object = self._objects.get(name, None)
        return object

    def run(self):
        """Plays the adventure game stored in this object."""
        print(HELP_TEXT[0])
        current = "START"
        next = current
        while True:
            argv = []
            if next != None:
                room = self.getRoom(current)
                if room.hasbeenVisited():
                    print(room.getShortDescription())
                else:
                    for line in room.getLongDescription():
                        print(line)
                room.setVisited()

                if room.getContents() != [ ]:
                    for name in room.getContents():
                        object = self.getObject(name)
                        print("There is " +object.getDescription()+ " here")
            
            text = input("> ").strip().upper()
            cmd = TokenScanner(text)
            while cmd.hasMoreTokens():
                token = cmd.nextToken()
                if token != " ":
                    argv.append(token)

            next =self.process_cmd(room, argv)            
            if next != None:
                current = next

    def readRoomData(self, f):
        """Read entire the room from file"""
        rooms = { }
        while True:
            room = AdvRoom.readRoom(f)
            if room is None: break
            if len(rooms) == 0:
                rooms["START"] = room
            name = room.getName()
            rooms[name] = room
        return rooms
    
    def readObjectData(self, f):
        objects = { }
        while True:
            object = AdvObject.readObject(f)
            if object is None: break
            name = object.getName()
            objects[name] = object
        return objects
    
    def placeObjects(self):
        for name in self._objects:
            object = self.getObject(name)
            location = object.getInitialLocation()
            if location == 'PLAYER':
                self._player.append(name)
            room = self.getRoom(location)
            room.addObject(name)

    def process_cmd(self, room, argv):
        next = None
        if argv[0] == 'QUIT':
            if len(argv) == 1:
                quit()
        elif argv[0] == 'HELP':
            if len(argv) == 1:
                print(HELP_TEXT)
        elif argv[0] == 'LOOK':
            if len(argv) == 1:
                for line in room.getLongDescription():
                    print(line)
                if room.getContents() != [ ]:
                    for name in room.getContents():
                        object = self.getObject(name)
                        print("There is " +object.getDescription()+ " here")
        elif argv[0] == 'TAKE':
            if len(argv) == 2 and room.containsObject(argv[1]):
                room.removeObject(argv[1])
                self._player.append(argv[1])
                print("Takens.")
        elif argv[0] == 'DROP':
            if len(argv) == 2 and argv[1] in self._player:
                self._player.remove(argv[1])
                room.addObject(argv[1])
                print('Dropped.')
        elif argv[0] == 'INVENTORY':
            if len(argv) == 1:
                if self._player == {}:
                    print("You're empty-handed.")
                else:
                    print("You're carrying:")
                    for name in self._player:
                        object = self.getObject(name)
                        print(object.getDescription())
        else:
            next = room.getNextRoom(argv[0])
            if next is None:
                print("I don't know how to apply that word here.")

        return next