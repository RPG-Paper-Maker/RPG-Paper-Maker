# Common.pri defines common configuration and variables for all sub-projects

# Variables defined:
# MAIN_PROJECT_DIR  path to the RPG-Paper-Maker root
# ROOT_DESTDIR      parent output path for sub-projects executables/libraries
# EDITOR_PATH       path of Editor sub-project (only used in this file)
# DEL_DIR_CMD       helper command to remove directories without prompt on all platforms

CONFIG += c++11

# Build variant
CONFIG(debug, debug|release) {
    VARIANT = debug
} else {
    VARIANT = release
}

# Main project root directory
# Ex: path/to/RPG-Paper-Maker
# Since Common.pri is located at the main project root, just set it to PWD.
# PWD itself is context-dependent, so it cannot be used directly in the sub-projects.
MAIN_PROJECT_DIR = $$PWD

# The EditorApp and Test sub-projects need access to the built Editor library, but cannot access the OUT_PWD of the Editor project.
# (OUT_PWD is defined in Qt Creator local Build settings, e.g. "build-Editor-Desktop_Qt_5_12_1_GCC_64bit-Debug" in shadow build)
# Therefore, we output executables and libraries of all sub-projects under a common directory ROOT_DESTDIR,
# independently from OUT_PWD, so each sub-project can link to the Editor library.
# Note that intermediate files (.o, .obj, etc.) are still generated in OUT_PWD.

# Root destination path of all projects. Define the DESTDIR of each sub-project to some sub-directory of it.
# Ex: path/to/RPG-Paper-Maker/Build/debug
ROOT_DESTDIR = $$MAIN_PROJECT_DIR/Build/$$VARIANT

# Define output library name per compiler, not per platform (e.g. Windows can use MinGW and output like Unix)
# Knowing this name is useful for dependency change detection and cleanup
EDITOR_LIB_NAME = RPG-Paper-Maker
# To check the compiler, be pragmatic and check the static lib extension directly
# This way, we are sure to always have the matching prefix
equals(QMAKE_EXTENSION_STATICLIB, "a") {
    LIB_FILENAME_PREFIX = "lib"
} else {
    LIB_FILENAME_PREFIX = ""
}
# Ex:
# win32 + msvc:      "RPG-Paper-Maker.lib"
# win32 + mingw g++: "libRPG-Paper-Maker.a"
# unix + g++:        "libRPG-Paper-Maker.a"
LIB_FILENAME = $${LIB_FILENAME_PREFIX}$${EDITOR_LIB_NAME}.$$QMAKE_EXTENSION_STATICLIB

# The following define makes your compiler emit warnings if you use
# any feature of Qt which has been marked as deprecated (the exact warnings
# depend on your compiler). Please consult the documentation of the
# deprecated API in order to know how to port your code away from it.
DEFINES += QT_DEPRECATED_WARNINGS

# You can also make your code fail to compile if you use deprecated APIs.
# In order to do so, uncomment the following line.
# You can also select to disable deprecated APIs only up to a certain version of Qt.
#DEFINES += QT_DISABLE_DEPRECATED_BEFORE=0x060000    # disables all the APIs deprecated before Qt 6.0.0

# Common QT modules
QT       += core gui opengl network multimedia multimediawidgets
greaterThan(QT_MAJOR_VERSION, 4): QT += widgets

# Common include paths
EDITOR_PATH = $$MAIN_PROJECT_DIR/Editor
INCLUDEPATH += \
    $$EDITOR_PATH/Dialogs \
    $$EDITOR_PATH/Dialogs/Commands \
    $$EDITOR_PATH/Dialogs/Systems \
    $$EDITOR_PATH/Dialogs/SpecialElements \
    $$EDITOR_PATH/Dialogs/Animations \
    $$EDITOR_PATH/CustomWidgets \
    $$EDITOR_PATH/Controls \
    $$EDITOR_PATH/Controls/MapEditor \
    $$EDITOR_PATH/MapEditor \
    $$EDITOR_PATH/MapEditor/Map \
    $$EDITOR_PATH/Singletons \
    $$EDITOR_PATH/Models \
    $$EDITOR_PATH/Models/GameDatas \
    $$EDITOR_PATH/Models/System \
    $$EDITOR_PATH/Enums \
    $$EDITOR_PATH/MathUtils
