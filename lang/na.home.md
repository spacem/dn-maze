DragonNest Skill Calculator/Simulator.

This is a deployment of dnmaze, the successor of DNSS, which is a derivative of YADNSS.

The hosting I use demands a certain amount of downtime each day so the site may be unavaialble sometimes.
I may one day look at porting this so it can run on github pages like dngearsim.

### Features

- **Build URL + History**: The URL bar is now the Build URL

- **Search**: Use [Regular Expressions](http://www.w3schools.com/jsref/jsref_obj_regexp.asp) to filter out skills descriptions.

- **Level Selection**: Change level caps

- **Free/Strict Mode**: Freely put SP anywhere, or be strict and abide by parent skill/job SP requirements.

  *NOTE* Changing between modes will persist throughout every build. Every shared Build URL defaults to free mode, though.

- **PvE/PvP Mode**: Show PvE or PvP description

  PvE/PvP mode is not locked into the Build URL, but by the user session. It is a user preference, not part of the build itself.

- **Interactive Keys**:

  - Left click: Increases the level of skill skill

    \+ CTRL: Maxes skill (SHIFT also works for Chrome)

  - Right click: Decreases the level of the skill

    \+ CTRL: Reduces skill to minimal level (SHIFT also works for Chrome)

  - Middle click: Locks skill description in place.

- **Techniques**: Tech your skills

  DISCLAIMER: Weapon techs do not reflect in game weapon techs. Please ensure what you choose is also available in game.
