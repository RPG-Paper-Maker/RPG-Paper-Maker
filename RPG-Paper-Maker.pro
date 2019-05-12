# RPG-Paper-Maker.pro is the main project, it handles dependencies between the sub-projects.

TEMPLATE = subdirs

SUBDIRS =  \
    Engine \
    Editor \
    Test

Editor.depends = Engine
Test.depends = Engine
