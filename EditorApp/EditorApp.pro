#-------------------------------------------------
#
# Project created by QtCreator 2019-02-24T15:39:05
#
#-------------------------------------------------

# See Editor.pro for explanations on Common.pri
include(../Common.pri)

# Editor app target with icon
TEMPLATE = app
unix:  TARGET = RPG-Paper-Maker
win32: TARGET = "RPG Paper Maker"
RC_ICONS = icon.ico

# By default, g++ will produce a PIE (Position-Independent Executable) with mimetype "application/x-sharedlib" on Unix,
# which prevents the user from opening the app via double-click in a file manager. Add -no-pie to ensure we get an "application/x-executable".
# clang++ also has this flag, but doesn't have the mimetype issue.
unix: *-g++*: QMAKE_LFLAGS += -no-pie

# Output exectable path
# Ex: path/to/RPG-Paper-Maker/Build/debug/EditorApp
DESTDIR = $$ROOT_DESTDIR/EditorApp

SOURCES += \
        main.cpp

HEADERS +=

# Use the Editor library
LIBS += -L$$MAIN_PROJECT_DIR/Build/$$VARIANT/Editor -lRPG-Paper-Maker

# Clean target explicitly (custom build paths are not included in the default clean)
# If you don't care preserving the destination folder, you can also delete DESTDIR entirely (see Editor.pro for directory removal)
win32: APP_FILENAME = $${TARGET}.exe
unix: APP_FILENAME = $$TARGET
QMAKE_CLEAN += "$$DESTDIR/$$APP_FILENAME"
