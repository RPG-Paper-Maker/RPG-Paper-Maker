# Common.pri defines common configuration and variables for all sub-projects

# Variables defined:
# MAIN_PROJECT_DIR  path to the RPG-Paper-Maker root
# ROOT_DESTDIR      parent output path for sub-projects executables/libraries
# ENGINE_PATH       path of Engine sub-project (only used in this file)
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

# The Editor and Test projects need access to the built Engine library, but cannot access the OUT_PWD of the Engine project.
# (OUT_PWD is defined in Qt Creator local Build settings, e.g. "build-Engine-Desktop_Qt_5_12_1_GCC_64bit-Debug")
# Therefore, we output executables and libraries of all sub-projects under a common directory ROOT_DESTDIR,
# independently from OUT_PWD, so each sub-project can link to the Engine library.
# Note that intermediate files (.o, .obj, etc.) are still generated in OUT_PWD.

# Root destination path of all projects. Define the DESTDIR of each sub-project to some sub-directory of it.
# Ex: path/to/RPG-Paper-Maker/Build/debug
ROOT_DESTDIR = $$MAIN_PROJECT_DIR/Build/$$VARIANT

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
QT       += core gui opengl network multimedia charts
greaterThan(QT_MAJOR_VERSION, 4): QT += widgets

# Common include paths
ENGINE_PATH = $$MAIN_PROJECT_DIR/Engine
INCLUDEPATH += \
    $$ENGINE_PATH/Dialogs \
    $$ENGINE_PATH/Dialogs/Commands \
    $$ENGINE_PATH/Dialogs/Systems \
    $$ENGINE_PATH/Dialogs/SpecialElements \
    $$ENGINE_PATH/CustomWidgets \
    $$ENGINE_PATH/Controls \
    $$ENGINE_PATH/Controls/MapEditor \
    $$ENGINE_PATH/MapEditor \
    $$ENGINE_PATH/MapEditor/Map \
    $$ENGINE_PATH/Singletons \
    $$ENGINE_PATH/Models \
    $$ENGINE_PATH/Models/GameDatas \
    $$ENGINE_PATH/Models/System \
    $$ENGINE_PATH/Enums \
    $$ENGINE_PATH/MathUtils

# Clean helpers
win32: DEL_DIR_CMD = rmdir /s /q
unix: DEL_DIR_CMD = rm -rf
