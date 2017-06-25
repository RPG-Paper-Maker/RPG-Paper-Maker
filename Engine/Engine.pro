#-------------------------------------------------
#
# Project created by QtCreator 2016-11-03T23:24:41
#
#-------------------------------------------------

CONFIG += c++11

QT       += core gui opengl

win32{
    LIBS += -lOpengl32
}

greaterThan(QT_MAJOR_VERSION, 4): QT += widgets

TARGET = Engine
TEMPLATE = app

INCLUDEPATH += \
    Dialogs \
    Dialogs/Commands \
    Dialogs/Systems \
    CustomWidgets \
    Controls \
    MapEditor \
    Singletons \
    Models \
    Models/GameDatas \
    Models/System \
    Enums

HEADERS += \
    main.h \
    Dialogs/mainwindow.h \
    Dialogs/dialognewproject.h \
    CustomWidgets/panelmainmenu.h \
    Controls/controlnewproject.h \
    Singletons/wanok.h \
    CustomWidgets/widgetmapeditor.h \
    CustomWidgets/panelproject.h \
    MapEditor/map.h \
    Controls/controlmainwindow.h \
    Singletons/singleton.h \
    Models/project.h \
    Dialogs/dialogdatas.h \
    Dialogs/dialogcommands.h \
    Models/eventcommand.h \
    CustomWidgets/widgettreecommands.h \
    Dialogs/Commands/dialogcommandshowtext.h \
    Enums/eventcommandkind.h \
    Dialogs/Commands/dialogcommand.h \
    Models/GameDatas/gamedatas.h \
    Models/GameDatas/commoneventsdatas.h \
    Dialogs/dialogvariables.h \
    Models/superlistitem.h \
    CustomWidgets/widgetsuperlist.h \
    CustomWidgets/panelsuperlist.h \
    Dialogs/Commands/dialogcommandchangevariables.h \
    Dialogs/Commands/dialogcommandinputnumber.h \
    Dialogs/Commands/dialogcommandconditions.h \
    CustomWidgets/widgetcomboboxoperation.h \
    CustomWidgets/widgettextlang.h \
    CustomWidgets/widgetmenubarmapeditor.h \
    Enums/mapeditorselectionkind.h \
    MapEditor/mapportion.h \
    MapEditor/floors.h \
    CustomWidgets/widgetmenumapeditor.h \
    MapEditor/camera.h \
    MapEditor/grid.h \
    MapEditor/position.h \
    Models/GameDatas/systemdatas.h \
    Controls/controlmapeditor.h \
    Models/serializable.h \
    CustomWidgets/widgetconditionslist.h \
    CustomWidgets/contextmenulist.h \
    Models/GameDatas/itemsdatas.h \
    Models/System/systemitem.h \
    Enums/datastabkind.h \
    Models/GameDatas/skillsdatas.h \
    Models/GameDatas/armorsdatas.h \
    Models/GameDatas/weaponsdatas.h \
    Models/GameDatas/heroesdatas.h \
    Models/System/systemskill.h \
    Models/System/systemweapon.h \
    Models/System/systemarmor.h \
    Models/System/systemhero.h \
    Dialogs/Commands/dialogcommandmodifyinventory.h \
    Models/GameDatas/classesdatas.h \
    Models/System/systemclass.h \
    Dialogs/Commands/dialogcommandmodifyteam.h \
    CustomWidgets/widgetcomboboxteam.h \
    Models/GameDatas/battlesystemdatas.h \
    Models/System/systemlang.h \
    Models/System/systemelement.h \
    Dialogs/Systems/dialogsystemelement.h \
    Models/System/systemweaponarmorkind.h \
    Dialogs/Systems/dialogsystemweaponarmorkind.h \
    Dialogs/Systems/dialogsystemstatistic.h \
    Models/System/systemstatistic.h \
    Dialogs/Systems/dialogsystembattlecommand.h \
    Models/System/systembattlecommand.h \
    Dialogs/dialogsystems.h \
    Dialogs/Systems/dialogsystemstatisticprogression.h \
    Models/System/systemstatisticprogression.h \
    CustomWidgets/widgetsupertree.h \
    Models/GameDatas/monstersdatas.h \
    Models/System/systemmonster.h \
    Models/GameDatas/troopsdatas.h \
    Models/System/systemtroop.h \
    Models/System/systemmonstertroop.h \
    Dialogs/Systems/dialogsystemmonstertroop.h \
    Dialogs/Commands/dialogcommandstartbattle.h \
    Dialogs/dialogdatasmonsterrewards.h \
    Models/System/systemicon.h \
    Models/System/systemcurrency.h \
    Dialogs/Systems/dialogsystemcurrency.h \
    CustomWidgets/panelobject.h \
    Models/System/systemevent.h \
    Models/System/systemclassskill.h \
    Dialogs/Systems/dialogsystemclassskill.h \
    Models/System/systemloot.h \
    Enums/lootkind.h \
    Dialogs/Systems/dialogsystemloot.h \
    Models/System/systemcreateparameter.h \
    Models/primitivevalue.h \
    Enums/primitivevaluekind.h \
    CustomWidgets/panelprimitivevalue.h \
    Dialogs/Systems/dialogsystemcreateparameter.h \
    Models/System/systemcommonreaction.h \
    Models/System/systemcommonobject.h \
    Dialogs/Systems/dialogsystemname.h \
    Dialogs/dialogsetmaximum.h \
    Dialogs/Systems/dialogsystemobjectevent.h \
    Models/System/systemparameter.h \
    Models/System/systemobjectevent.h \
    Models/System/systemstate.h \
    Dialogs/Commands/dialogcommandchangestate.h \
    Dialogs/dialogobject.h \
    MapEditor/mapobjects.h \
    Enums/panelprimitivevaluekind.h \
    Models/System/systemreaction.h \
    CustomWidgets/panelobjectevent.h \
    Dialogs/Commands/dialogcommandsendevent.h \
    CustomWidgets/widgettreelocalmaps.h \
    Models/treemaptag.h \
    Models/GameDatas/treemapdatas.h \
    Dialogs/dialogmapproperties.h \
    Models/GameDatas/langsdatas.h \
    Models/mapproperties.h \
    Models/langstranslation.h \
    MapEditor/portion.h \
    MapEditor/cursor.h \
    Models/enginesettings.h \
    Dialogs/dialogkeyboardcontrols.h \
    MapEditor/position3d.h \
    MapEditor/height.h \
    MapEditor/sprites.h \
    MapEditor/vertex.h \
    Dialogs/Commands/dialogcommandteleportobject.h \
    Dialogs/Commands/dialogcommandteleportobjectselect.h \
    Dialogs/dialogexport.h \
    Controls/controlexport.h \
    Enums/oskind.h \
    Models/GameDatas/scriptsdatas.h \
    Models/GameDatas/keyboarddatas.h \
    Models/System/systemkeyboard.h \
    Models/System/systemmapobject.h \
    Dialogs/Systems/dialogsystemparameter.h \
    Dialogs/Commands/dialogcommandmoveobject.h \
    Enums/commandmovekind.h \
    Models/System/systemcommandmove.h \
    Dialogs/Systems/dialogsystemkeyboard.h \
    Enums/keyboardenginekind.h \
    Dialogs/Systems/dialogsystemkeyboardgeneral.h \
    CustomWidgets/widgettilesetselector.h \
    CustomWidgets/widgetselectionrectangle.h \
    Dialogs/dialogpictures.h \
    Enums/picturekind.h \
    CustomWidgets/panelpicturepreview.h \
    Models/System/systempicture.h \
    Models/GameDatas/picturesdatas.h \
    CustomWidgets/widgetpicturepreview.h \
    Enums/mapeditorsubselectionkind.h \
    CustomWidgets/paneltextures.h \
    CustomWidgets/widgetvariable.h \
    Models/GameDatas/variablesdatas.h \
    Models/System/systemvariables.h \
    Models/GameDatas/tilesetsdatas.h \
    Models/System/systemtileset.h

SOURCES += \
    main.cpp \
    Dialogs/mainwindow.cpp \
    Dialogs/dialognewproject.cpp \
    CustomWidgets/panelmainmenu.cpp \
    Controls/controlnewproject.cpp \
    Singletons/wanok.cpp \
    CustomWidgets/widgetmapeditor.cpp \
    CustomWidgets/panelproject.cpp \
    MapEditor/map.cpp \
    Controls/controlmainwindow.cpp \
    Models/project.cpp \
    Dialogs/dialogdatas.cpp \
    Dialogs/dialogcommands.cpp \
    Models/eventcommand.cpp \
    CustomWidgets/widgettreecommands.cpp \
    Dialogs/Commands/dialogcommandshowtext.cpp \
    Dialogs/Commands/dialogcommand.cpp \
    Models/GameDatas/gamedatas.cpp \
    Models/GameDatas/commoneventsdatas.cpp \
    Dialogs/dialogvariables.cpp \
    Models/superlistitem.cpp \
    CustomWidgets/widgetsuperlist.cpp \
    CustomWidgets/panelsuperlist.cpp \
    Dialogs/Commands/dialogcommandchangevariables.cpp \
    Dialogs/Commands/dialogcommandinputnumber.cpp \
    Dialogs/Commands/dialogcommandconditions.cpp \
    CustomWidgets/widgetcomboboxoperation.cpp \
    CustomWidgets/widgettextlang.cpp \
    CustomWidgets/widgetmenubarmapeditor.cpp \
    MapEditor/mapportion.cpp \
    MapEditor/floors.cpp \
    CustomWidgets/widgetmenumapeditor.cpp \
    MapEditor/camera.cpp \
    MapEditor/grid.cpp \
    MapEditor/position.cpp \
    Models/GameDatas/systemdatas.cpp \
    Controls/controlmapeditor.cpp \
    CustomWidgets/widgetconditionslist.cpp \
    CustomWidgets/contextmenulist.cpp \
    Models/GameDatas/itemsdatas.cpp \
    Models/System/systemitem.cpp \
    Models/GameDatas/skillsdatas.cpp \
    Models/GameDatas/armorsdatas.cpp \
    Models/GameDatas/weaponsdatas.cpp \
    Models/GameDatas/heroesdatas.cpp \
    Models/System/systemarmor.cpp \
    Models/System/systemhero.cpp \
    Models/System/systemskill.cpp \
    Models/System/systemweapon.cpp \
    Dialogs/Commands/dialogcommandmodifyinventory.cpp \
    Models/GameDatas/classesdatas.cpp \
    Models/System/systemclass.cpp \
    Dialogs/Commands/dialogcommandmodifyteam.cpp \
    CustomWidgets/widgetcomboboxteam.cpp \
    Models/GameDatas/battlesystemdatas.cpp \
    Models/System/systemlang.cpp \
    Models/System/systemelement.cpp \
    Dialogs/Systems/dialogsystemelement.cpp \
    Models/System/systemweaponarmorkind.cpp \
    Dialogs/Systems/dialogsystemweaponarmorkind.cpp \
    Dialogs/Systems/dialogsystemstatistic.cpp \
    Models/System/systemstatistic.cpp \
    Dialogs/Systems/dialogsystembattlecommand.cpp \
    Models/System/systembattlecommand.cpp \
    Dialogs/dialogsystems.cpp \
    Dialogs/Systems/dialogsystemstatisticprogression.cpp \
    Models/System/systemstatisticprogression.cpp \
    CustomWidgets/widgetsupertree.cpp \
    Models/GameDatas/monstersdatas.cpp \
    Models/System/systemmonster.cpp \
    Models/GameDatas/troopsdatas.cpp \
    Models/System/systemtroop.cpp \
    Models/System/systemmonstertroop.cpp \
    Dialogs/Systems/dialogsystemmonstertroop.cpp \
    Dialogs/Commands/dialogcommandstartbattle.cpp \
    Dialogs/dialogdatasmonsterrewards.cpp \
    Models/System/systemicon.cpp \
    Models/System/systemcurrency.cpp \
    Dialogs/Systems/dialogsystemcurrency.cpp \
    CustomWidgets/panelobject.cpp \
    Models/System/systemevent.cpp \
    Models/System/systemclassskill.cpp \
    Dialogs/Systems/dialogsystemclassskill.cpp \
    Models/System/systemloot.cpp \
    Dialogs/Systems/dialogsystemloot.cpp \
    Models/System/systemcreateparameter.cpp \
    Models/primitivevalue.cpp \
    CustomWidgets/panelprimitivevalue.cpp \
    Dialogs/Systems/dialogsystemcreateparameter.cpp \
    Models/System/systemcommonreaction.cpp \
    Models/System/systemcommonobject.cpp \
    Dialogs/Systems/dialogsystemname.cpp \
    Dialogs/dialogsetmaximum.cpp \
    Dialogs/Systems/dialogsystemobjectevent.cpp \
    Models/System/systemparameter.cpp \
    Models/System/systemobjectevent.cpp \
    Models/System/systemstate.cpp \
    Dialogs/Commands/dialogcommandchangestate.cpp \
    Dialogs/dialogobject.cpp \
    MapEditor/mapobjects.cpp \
    Models/System/systemreaction.cpp \
    CustomWidgets/panelobjectevent.cpp \
    Dialogs/Commands/dialogcommandsendevent.cpp \
    CustomWidgets/widgettreelocalmaps.cpp \
    Models/treemaptag.cpp \
    Models/GameDatas/treemapdatas.cpp \
    Dialogs/dialogmapproperties.cpp \
    Models/GameDatas/langsdatas.cpp \
    Models/mapproperties.cpp \
    Models/langstranslation.cpp \
    MapEditor/portion.cpp \
    MapEditor/cursor.cpp \
    Models/enginesettings.cpp \
    Dialogs/dialogkeyboardcontrols.cpp \
    MapEditor/position3d.cpp \
    MapEditor/height.cpp \
    MapEditor/sprites.cpp \
    MapEditor/vertex.cpp \
    Dialogs/Commands/dialogcommandteleportobject.cpp \
    Dialogs/Commands/dialogcommandteleportobjectselect.cpp \
    Dialogs/dialogexport.cpp \
    Controls/controlexport.cpp \
    Models/GameDatas/scriptsdatas.cpp \
    Models/GameDatas/keyboarddatas.cpp \
    Models/System/systemkeyboard.cpp \
    Models/System/systemmapobject.cpp \
    Dialogs/Systems/dialogsystemparameter.cpp \
    Dialogs/Commands/dialogcommandmoveobject.cpp \
    Models/System/systemcommandmove.cpp \
    Dialogs/Systems/dialogsystemkeyboard.cpp \
    Dialogs/Systems/dialogsystemkeyboardgeneral.cpp \
    CustomWidgets/widgettilesetselector.cpp \
    CustomWidgets/widgetselectionrectangle.cpp \
    Dialogs/dialogpictures.cpp \
    CustomWidgets/panelpicturepreview.cpp \
    Models/System/systempicture.cpp \
    Models/GameDatas/picturesdatas.cpp \
    CustomWidgets/widgetpicturepreview.cpp \
    CustomWidgets/paneltextures.cpp \
    CustomWidgets/widgetvariable.cpp \
    Models/GameDatas/variablesdatas.cpp \
    Models/System/systemvariables.cpp \
    Models/GameDatas/tilesetsdatas.cpp \
    Models/System/systemtileset.cpp

FORMS += \
    Dialogs/mainwindow.ui \
    Dialogs/dialognewproject.ui \
    CustomWidgets/panelmainmenu.ui \
    CustomWidgets/panelproject.ui \
    Dialogs/dialogdatas.ui \
    Dialogs/dialogcommands.ui \
    Dialogs/Commands/dialogcommandshowtext.ui \
    Dialogs/dialogvariables.ui \
    CustomWidgets/panelsuperlist.ui \
    Dialogs/Commands/dialogcommandchangevariables.ui \
    Dialogs/Commands/dialogcommandinputnumber.ui \
    Dialogs/Commands/dialogcommandconditions.ui \
    CustomWidgets/widgettextlang.ui \
    CustomWidgets/widgetmenubarmapeditor.ui \
    Dialogs/Commands/dialogcommandmodifyinventory.ui \
    Dialogs/Commands/dialogcommandmodifyteam.ui \
    Dialogs/Systems/dialogsystemelement.ui \
    Dialogs/Systems/dialogsystemweaponarmorkind.ui \
    Dialogs/Systems/dialogsystemstatistic.ui \
    Dialogs/Systems/dialogsystembattlecommand.ui \
    Dialogs/dialogsystems.ui \
    Dialogs/Systems/dialogsystemstatisticprogression.ui \
    Dialogs/Systems/dialogsystemmonstertroop.ui \
    Dialogs/Commands/dialogcommandstartbattle.ui \
    Dialogs/dialogdatasmonsterrewards.ui \
    Dialogs/Systems/dialogsystemcurrency.ui \
    CustomWidgets/panelobject.ui \
    Dialogs/Systems/dialogsystemclassskill.ui \
    Dialogs/Systems/dialogsystemloot.ui \
    CustomWidgets/panelprimitivevalue.ui \
    Dialogs/Systems/dialogsystemcreateparameter.ui \
    Dialogs/Systems/dialogsystemname.ui \
    Dialogs/dialogsetmaximum.ui \
    Dialogs/Systems/dialogsystemobjectevent.ui \
    Dialogs/Commands/dialogcommandchangestate.ui \
    Dialogs/dialogobject.ui \
    CustomWidgets/panelobjectevent.ui \
    Dialogs/Commands/dialogcommandsendevent.ui \
    Dialogs/dialogmapproperties.ui \
    Dialogs/dialogkeyboardcontrols.ui \
    Dialogs/Commands/dialogcommandteleportobject.ui \
    Dialogs/Commands/dialogcommandteleportobjectselect.ui \
    Dialogs/dialogexport.ui \
    Dialogs/Systems/dialogsystemparameter.ui \
    Dialogs/Commands/dialogcommandmoveobject.ui \
    Dialogs/Systems/dialogsystemkeyboard.ui \
    Dialogs/Systems/dialogsystemkeyboardgeneral.ui \
    Dialogs/dialogpictures.ui \
    CustomWidgets/panelpicturepreview.ui \
    CustomWidgets/paneltextures.ui \
    CustomWidgets/widgetvariable.ui

OTHER_FILES += \
    style.qss

RESOURCES += \
    ressources.qrc

#-------------------------------------------------
# Copy Content directory in build folder
#-------------------------------------------------

FROM = \"$$shell_path($$PWD\\Content)\"
DEST = \"$$shell_path($$OUT_PWD)\"
win32{
    CONFIG(debug, debug|release) {
        VARIANT = debug
    } else {
        VARIANT = release
    }
    DEST = \"$$shell_path($$OUT_PWD\\$$VARIANT\\Content)\"
    DESTDIR = $$OUT_PWD\\$$VARIANT
}

FROMS= \"$$shell_path($$PWD\\..\\Game\\Content\\Datas\\Scripts)\"
DESTS = \"$$shell_path($$OUT_PWD\\Content\\basic\\Content\\Datas)\"
win32{
    DESTS = \"$$shell_path($$OUT_PWD\\Content\\basic\\Content\\Datas\\Scripts)\"
}

copyBR.commands = $(COPY_DIR) $$FROM $$DEST $$escape_expand(\n\t) $(COPY_DIR) $$FROMS $$DESTS
first.depends = $(first) copyBR
export(first.depends)
export(copyBR.commands)
QMAKE_EXTRA_TARGETS += first copyBR
