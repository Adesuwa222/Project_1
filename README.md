# Escape Buttercup Bakeshop

CCT360 Project: The Curious Case.

You wake up locked inside Buttercup Bakeshop after closing, and the bakery's famous Rainbow Cake recipe has been stolen. Search five rooms, collect items, solve puzzles, gather clues, accuse the thief and escape.

## How to run it

Open `index.html` in a browser, or visit the published site.

## Folder structure

```
escape-buttercup/
  index.html          all scenes, clickable spots, bag, pop up windows and sounds
  css/style.css       colours, layout, flashlight effect, phone and tablet layouts
  js/script.js        game logic
  assets/
    audio/            sound effects (click, pickup, unlock, wrong, ding, clue, win)
    images/           every picture, named by type:
                        room-     the 5 room illustrations
                        item-     the 9 item icons
                        suspect-  suspect polaroids for the accusation board
                        screen-   start screen and the 3 endings
                        patch-    small pictures that hide an item once it is taken
    media/            background music
```

## Scenes

1. Start screen
2. Front Counter
3. Kitchen
4. Pantry (dark until you find the flashlight)
5. Freezer (locked)
6. Back Office (locked with a keypad code)
7. Ending: Best, Okay or Wrong

## Interactive elements

Clickable spots in every room, an oven temperature dial, a 4 digit keypad, a clue notebook, an accusation board, a hint button, a sound button and a restart button.

## State based interactions

- The bag is an array. Items are added with `push()` and a for loop checks if you have an item.
- The freezer stays locked until you have the freezer key (`freezerOpen` boolean).
- The office stays locked until you enter the code from the oven cookie (`officeOpen` boolean).
- The pantry is dark until you have the flashlight. Then a light follows the mouse using `clientX` and `clientY`.
- The ice block only melts once you have the space heater.
- The clue notebook remembers every clue you find (`clues` array).
- Items disappear from the room pictures once you take them.
- The ending depends on who you accuse and whether you found the recipe (if / else if / else).

## JavaScript concepts used

Variables, functions, booleans, if / else if / else, relational and logical operators, arrays with `push()` and `length`, for loops, `getElementById`, `getElementsByClassName`, `innerHTML`, `style`, `addEventListener`, mouse `clientX` and `clientY`, and audio `play()`, `pause()`, `currentTime` and `volume`.

## Puzzle path (spoilers)

Recipe scrap (kitchen bowl) → oven at 350° → cookie with code 1147 → office.
Flashlight (kitchen drawer) → pantry flour sack → freezer key.
Space heater (under the office desk) → melts the ice block → secret recipe.
The front door key is in the frozen cake. The thief is Emma Davis, the cashier.

## Credits

- Fonts: Google Fonts
