# DragonNest MAZE
MAZE is personal project of mine to learn more about NodeJS, which turned out to become an actual product... it is technically a big rewrite of my [dnss-web](https://github.com/ben-lei/dnss-web) project, from Java to NodeJS.

The primary goal of MAZE was to make it simple to setup and customize for different regions that host the MMO game named DragonNest.

## Data Minining
Get the [dncli](https://github.com/ben-lei/dncli/releases/download/dncli-1.1/dncli-1.1.jar), or build it from [source](https://github.com/ben-lei/dncli). This example assumes you created an alias `dn` for this Java program, and are using a Linux VM with your Windows DragonNest folder mounted to /mnt/dragonnest.

1. Get the [maze.js](https://raw.githubusercontent.com/ben-lei/dncli/master/maze.js)
2. Extract the Paks

        dn pak -xfe maze.js /mnt/dragonnest/* /tmp/dragonnest

3. Convert the DDS files to PNG:

        dn dds --png -p -f /tmp/dragonnest/resource/ui/mainbar/*.dds
        dn dds --png -p -f /tmp/dragonnest/resource/ui/skill/*.dds
        dn dds --png -p -f /tmp/dragonnest/resource/uitemplatetexture/uit_gesturebutton.dds

4. Set the following environment variables to the relevant locations:
    - `DN_LEVEL_CAP` - The level cap to use (e.g. 90)
    - `DN_OUT_DIR` - The output directory from the compiled data (e.g. `/maze/public/json`)
    - `DN_UISTRING_PATH` - Location of the uistring file (e.g. `/tmp/dragonnest/resource/uistring/uistring.xml`).

5. Compile data from DNT files:

        dn dnt -c maze.js /tmp/dragonnest/resource/ext/*.dnt

### Auto Updating
There is an [updater-na.json](https://raw.githubusercontent.com/ben-lei/dncli/master/updater-na.js) that is written for Java 8+ Nashorn for DN NA. It requires that the `DN_VERSION_PATH` (location of version file) and `DN_OUT_DIR` (location to download patches to) environment variables to be set in order to run:

        jjs updater-na.json

When this is done, similar steps as above can be run to more easily update data.

## Setup
1. Setup nginx, Apache, or whatever you prefer on your current server, or another. Technically you can serve static files using NodeJS, but it's better to free up the work to a true webserver.
2. Put the generated files from the data mining section into the static web directory, **EXCEPT** the `db.json`. Put the db.json somewhere that can be accessed by the user running the MAZE application.
3. Install the npm module `gulp` globally, then run `gulp` once to build the CSS/JS files.
4. Set environment variable for config file and region.
    - `MAZE_CONFIG` - The configuration file that holds information about relevant extracted files at located `/dn-maze/`
    - `MAZE_REGION` - the regional language files in the dn-maze/lang directory.
    See example [config.json](https://raw.githubusercontent.com/ben-lei/dn-maze/master/config.json), and NA regional [na.json](https://raw.githubusercontent.com/ben-lei/dn-maze/master/lang/na.json) and [na.home.md](https://raw.githubusercontent.com/ben-lei/dn-maze/master/lang/na.home.md).
5. Run the app:

        npm start
