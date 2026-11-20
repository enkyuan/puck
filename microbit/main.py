from microbit import *
import radio as r
import random as rand

r.on()  # <-- Must turn the radio on!
r.config(channel=16)

last_msg = "not pressed"
count = 0
ticker = 0

while True:
    msg = r.receive()

    # Only process when a message actually arrives (ignore None)
    if msg is not None:
        if last_msg == "pressed" and msg == "not pressed":  # released
            print("\033[H\033[2J", end="")
            drink_count = rand.randint(1, 3)
            count += drink_count
            drink_volume = count * 2

            print("You just drank", 2 * drink_count, "ounces of water!")
            print("You've now drank", drink_volume, "ounces of water")

            if ticker < 25:
                x = ticker % 5
                y = ticker // 5
                display.set_pixel(x, y, 9)
                ticker += 1  # Increment after setting pixel so (0,0) lights up first

        last_msg = msg

    sleep(20)  # Poll faster than the sender so the radio queue doesn't back up
