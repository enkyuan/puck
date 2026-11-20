# Imports go at the top
from microbit import *
import radio as r

r.config(channel=16)
current = 0 
pin2.set_pull(pin2.PULL_UP)

# Code in a 'while True:' loop repeats forever
while True:
    
    

    current = pin2.read_digital() 

    print(current)
    if current == 0:
        r.send('pressed')

    else:
        r.send('not pressed')


    sleep(100)
