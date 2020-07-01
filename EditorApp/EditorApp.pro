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
LIBS += -L$$ROOT_DESTDIR/Editor -l$$EDITOR_LIB_NAME     # Ex: -Lpath/to/RPG-Paper-Maker/Build/debug/Editor -lRPG-Paper-Maker
PRE_TARGETDEPS += $$ROOT_DESTDIR/Editor/$$LIB_FILENAME  # Ex: path/to/RPG-Paper-Maker/Build/debug/Editor/RPG-Paper-Maker.lib


#-------------------------------------------------
# Copy Content directory in build folder
#-------------------------------------------------


# Define source and target paths

# Content used by built Editor app
# Ex: path/to/RPG-Paper-Maker/Build/debug/EditorApp/Content
DEST_CONTENT_DIR = $$DESTDIR/Content

# Mods downloaded with update_mods
# Ex: path/to/RPG-Paper-Maker/mods
MODS_PATH = $$MAIN_PROJECT_DIR/mods

# Use shell_path to generate paths compatible with target platform for usage in shell commands (e.g. "/" -> "\\" on Windows)
# Those paths are used directly in commands, so escaped quotes \" are needed
# Trailing slash is important on Unix to indicate that we want to copy the source *content* and not the source folder itself
# (it is optional in the target path)

SLASH_END = ""

unix {
    SLASH_END = "/"
}

FROM_CONTENT = \"$$shell_path($$PWD/Content$$SLASH_END)\"
DEST_CONTENT = \"$$shell_path($$DEST_CONTENT_DIR)\"

FROM_SCRIPTS= \"$$shell_path($$MODS_PATH/Scripts$$SLASH_END)\"
DEST_SCRIPTS = \"$$shell_path($$DEST_CONTENT_DIR/basic/Content/Datas/Scripts)\"

FROM_BR= \"$$shell_path($$MODS_PATH/BR$$SLASH_END)\"
DEST_BR = \"$$shell_path($$DEST_CONTENT_DIR/BR)\"

FROM_WIN= \"$$shell_path($$MODS_PATH/Game/win32$$SLASH_END)\"
DEST_WIN = \"$$shell_path($$DEST_CONTENT_DIR/win32)\"

FROM_LINUX= \"$$shell_path($$MODS_PATH/Game/linux$$SLASH_END)\"
DEST_LINUX = \"$$shell_path($$DEST_CONTENT_DIR/linux)\"

FROM_OSX= \"$$shell_path($$MODS_PATH/Game/osx$$SLASH_END)\"
DEST_OSX = \"$$shell_path($$DEST_CONTENT_DIR/osx)\"

FROM_WEB= \"$$shell_path($$MODS_PATH/Game/web$$SLASH_END)\"
DEST_WEB = \"$$shell_path($$DEST_CONTENT_DIR/web)\"

FROM_MAIN= \"$$shell_path($$MODS_PATH/main.js)\"
DEST_MAIN = \"$$shell_path($$DEST_CONTENT_DIR/main.js)\"

FROM_INDEX= \"$$shell_path($$MODS_PATH/index.html)\"
DEST_INDEX = \"$$shell_path($$DEST_CONTENT_DIR/index.html)\"

FROM_PACKAGE= \"$$shell_path($$MODS_PATH/package.json)\"
DEST_PACKAGE = \"$$shell_path($$DEST_CONTENT_DIR/package.json)\"

# Define custom commands

# We do not want to copy all those subfolders every time we `make` or `make check`, so we only copy when needed, following one of 2 methods at:
# https://stackoverflow.com/questions/18488154/how-to-get-qmake-to-copy-large-data-files-only-if-they-are-updated
# A. Adding an extra compiler whose role is to copy files (https://doc.qt.io/qt-5/qmake-advanced-usage.html#adding-compilers)
# while checking if input files have changed. Unfortunately, the undocumented ${QMAKE_FILE_NAME} is always empty, so we couldn't use this.
# B. Use platform-specific commands to synchronize source and target folders. We chose this solution.

# In addition, we define two variants of the synchronization command because some destination folders are overlapping and we don't want one sync to break another one.
win32 {
    # On Windows, please try it and if it fails, add dash to ignore errors: "-robocopy"
    SYNC_PURGE_CMD = -robocopy -mir -xo  # Mirror folders, removing files/folders that are not in source anymore (/mir ~= /e + /purge)
    SYNC_PRESERVE_CMD = -robocopy -e -xo # Copy folders (even empty), but don't remove file/folders that are not in source anymore
}
unix {
    # Create build Editor directory in case it wasn't created for the target yet
    # We make our own mkdir command, as $(MKDIR_CMD) seems unreliable
    # Windows has no PRECOPY_COMMANDS at all, since robocopy will create intermediate directories as needed
    PRECOPY_COMMANDS = \
    mkdir -p $$DEST_CONTENT $$escape_expand(\n\t) \ # folder should have been created for built library, but safer (no order dependency)
    mkdir -p $$DEST_SCRIPTS $$escape_expand(\n\t)   # optional since FROM_CONTENT already has basic/Content/Datas/Scripts, but safer

    SYNC_PURGE_CMD = rsync -rul --del   # Preserve symlinks with -l, crucial with OSX Frameworks, and removing files/folders that are not in source anymore
    SYNC_PRESERVE_CMD = rsync -rul      # Preserve symlinks
}

# Copy all content after making sure the target directory exists
copyGameResources.commands = \
    $$PRECOPY_COMMANDS                                                        \
    # preserve existing files when copying to DEST_CONTENT to avoid deleting DEST_SCRIPTS which is under the former (you must manually remove files not in FROM_CONTENT anymore)
    $$SYNC_PRESERVE_CMD $$FROM_CONTENT  $$DEST_CONTENT  $$escape_expand(\n\t) \
    $$SYNC_PURGE_CMD    $$FROM_SCRIPTS  $$DEST_SCRIPTS  $$escape_expand(\n\t) \
    $$SYNC_PURGE_CMD    $$FROM_BR       $$DEST_BR       $$escape_expand(\n\t) \
    $$SYNC_PURGE_CMD    $$FROM_WIN      $$DEST_WIN      $$escape_expand(\n\t) \
    $$SYNC_PURGE_CMD    $$FROM_LINUX    $$DEST_LINUX    $$escape_expand(\n\t) \
    $$SYNC_PURGE_CMD    $$FROM_OSX      $$DEST_OSX      $$escape_expand(\n\t) \
    $$SYNC_PURGE_CMD    $$FROM_WEB      $$DEST_WEB      $$escape_expand(\n\t) \
    $$QMAKE_COPY        $$FROM_MAIN     $$DEST_MAIN     $$escape_expand(\n\t) \
    $$QMAKE_COPY        $$FROM_INDEX    $$DEST_INDEX     $$escape_expand(\n\t) \
    $$QMAKE_COPY        $$FROM_PACKAGE  $$DEST_PACKAGE

# Setup all those extra commands
first.depends = $(first) copyGameResources
export(first.depends)
export(copyBR.commands)
QMAKE_EXTRA_TARGETS += first copyGameResources


# Clean target explicitly (custom build paths are not included in the default clean)
# We need to find the exact application name depending on the platform
# If you don't care preserving the destination folder, you can also delete DESTDIR entirely (in the custom clean command below)
win32: APP_FILENAME = $${TARGET}.exe
unix: APP_FILENAME = $$TARGET
QMAKE_CLEAN += $$DESTDIR/$$APP_FILENAME

# Also add a custom clean command to remove the copied Content directory
# (QMAKE_CLEAN only supports files)
extraclean.commands = $$QMAKE_DEL_TREE $$DEST_CONTENT_DIR
clean.depends = extraclean
QMAKE_EXTRA_TARGETS += clean extraclean
