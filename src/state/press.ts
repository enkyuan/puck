// microbit/main.py (the receiver) prints "You just drank N ounces of water!" each time the button is
// released, after a clear-screen escape, so the line may not start with the text. The running-total
// line that follows is ignored.
export const isPress = (line: string) => line.includes('You just drank')
