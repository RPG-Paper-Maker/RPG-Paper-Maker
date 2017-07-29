#!/bin/sh
test="$0"
SCRIPTPATH=${test%???????}
export LD_LIBRARY_PATH="$SCRIPTPATH/libraries"
export QML_IMPORT_PATH="$SCRIPTPATH/libraries/qml"
export QML2_IMPORT_PATH="$SCRIPTPATH/libraries/qml"
export QT_QPA_PLATFORM_PLUGIN_PATH="$SCRIPTPATH/libraries/plugins/platforms"
export QT_PLUGIN_PATH="$SCRIPTPATH/libraries/plugins"
"$SCRIPTPATH/Game"