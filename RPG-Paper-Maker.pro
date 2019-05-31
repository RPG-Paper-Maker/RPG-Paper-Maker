# RPG-Paper-Maker.pro is the main project, it handles dependencies between the sub-projects.

TEMPLATE = subdirs

SUBDIRS =     \
    Editor    \
    EditorApp \
    Test

EditorApp.depends = Editor
Test.depends = Editor
