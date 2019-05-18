#-------------------------------------------------
#
# Project created by QtCreator 2016-11-03T23:24:41
#
#-------------------------------------------------

include(../Common.pri)

win32 {
    LIBS += -lOpengl32
}

# Engine static library
TEMPLATE = lib
CONFIG += staticlib
TARGET = RPG-Paper-Maker

# Library output path
# Ex: path/to/RPG-Paper-Maker/Build/debug/Engine
DESTDIR = $$ROOT_DESTDIR/Engine

HEADERS += \
    Dialogs/mainwindow.h \
    Dialogs/dialognewproject.h \
    CustomWidgets/panelmainmenu.h \
    Controls/controlnewproject.h \
    CustomWidgets/widgetmapeditor.h \
    CustomWidgets/panelproject.h \
    MapEditor/Map/map.h \
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
    MapEditor/camera.h \
    MapEditor/grid.h \
    MapEditor/position.h \
    Models/GameDatas/systemdatas.h \
    Controls/MapEditor/controlmapeditor.h \
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
    Dialogs/dialogselectposition.h \
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
    Models/System/systemtileset.h \
    CustomWidgets/widgetpicture.h \
    Dialogs/dialogpicturespreview.h \
    CustomWidgets/widgettilesetsettings.h \
    CustomWidgets/widgettilesetpraticable.h \
    Dialogs/Systems/dialogsystemstate.h \
    Dialogs/dialoglocation.h \
    Dialogs/Commands/dialogcommandwait.h \
    CustomWidgets/widgetgraphics.h \
    Dialogs/Systems/dialogsystemlang.h \
    Enums/drawkind.h \
    Enums/mapeditormodeskind.h \
    MapEditor/lands.h \
    MapEditor/vertexbillboard.h \
    MapEditor/threadmapportionloader.h \
    Dialogs/Commands/dialogcommandmovecamera.h \
    Models/projectupdater.h \
    Dialogs/dialogprogress.h \
    Enums/engineupdatefilekind.h \
    MapEditor/mapelement.h \
    MapEditor/wallindicator.h \
    MapEditor/sprite.h \
    Models/System/systemspritewall.h \
    Models/GameDatas/specialelementsdatas.h \
    Enums/spritewallkind.h \
    Models/System/systemspecialelement.h \
    Enums/orientationkind.h \
    MathUtils/qplane3d.h \
    MathUtils/qray3d.h \
    MathUtils/smallqt3d_global.h \
    MathUtils/qbox3d.h \
    MapEditor/land.h \
    MapEditor/floor.h \
    Enums/cameraupdownkind.h \
    Controls/MapEditor/controlundoredo.h \
    Dialogs/SpecialElements/dialogtilesetspecialelements.h \
    Dialogs/SpecialElements/dialogspecialelements.h \
    Dialogs/SpecialElements/panelspecialelements.h \
    Models/System/systemautotile.h \
    CustomWidgets/widgetshowpicture.h \
    CustomWidgets/widgetautotilesselector.h \
    MapEditor/autotiles.h \
    MapEditor/textureautotile.h \
    MapEditor/autotile.h \
    Dialogs/dialogcollisions.h \
    Models/collisionsquare.h \
    Enums/collisionresizekind.h \
    Dialogs/dialogrect.h \
    CustomWidgets/widgettilesetdirection.h \
    Dialogs/dialogdebugoptions.h \
    Singletons/common.h \
    Dialogs/dialogsongs.h \
    CustomWidgets/panelsongs.h \
    Models/System/systemsong.h \
    Enums/songkind.h \
    Models/GameDatas/songsdatas.h \
    Dialogs/Commands/dialogcommandplaysong.h \
    Dialogs/Commands/dialogcommandstopsong.h \
    Enums/themekind.h \
    Dialogs/dialoggeneraloptions.h \
    CustomWidgets/widgetsong.h \
    Models/System/systembattlemap.h \
    CustomWidgets/panelselectposition.h \
    Singletons/rpm.h \
    Models/System/systemcolor.h \
    Dialogs/Systems/dialogsystemcolor.h \
    CustomWidgets/paneldatascharacter.h \
    Models/System/systemwindowskin.h \
    Dialogs/Systems/dialogsystemwindowskin.h \
    CustomWidgets/widgetselectrect.h \
    CustomWidgets/paneldatasclass.h \
    CustomWidgets/paneldatasmonster.h \
    CustomWidgets/panelprogressiontable.h \
    CustomWidgets/widgettableprogression.h \
    Models/System/systemprogressiontable.h \
    CustomWidgets/widgeticon.h \
    CustomWidgets/widgetcomboboxformulastat.h \
    Enums/targetkind.h \
    Enums/availablekind.h \
    Models/GameDatas/animationsdatas.h \
    Models/System/systemanimation.h \
    Models/GameDatas/statusdatas.h \
    Models/System/systemstatus.h \
    Models/System/systemplaysong.h \
    Models/System/systemcommonskillitem.h \
    CustomWidgets/paneldatascommonskillitem.h \
    Enums/commonskillitemkind.h \
    Models/System/systemeffect.h \
    Enums/effectkind.h \
    Enums/damageskind.h \
    Enums/effectspecialacionkind.h \
    Dialogs/Systems/dialogsystemeffect.h \
    CustomWidgets/paneldamageskind.h \
    Models/System/systemcost.h \
    Dialogs/Systems/dialogsystemcost.h \
    Enums/increasedecreasekind.h \
    Models/GameDatas/titlescreengameoverdatas.h \
    CustomWidgets/panelrecentprojects.h \
    Dialogs/dialogcompleteliststates.h \
    Models/System/systemcharacteristic.h \
    Dialogs/Systems/dialogsystemcharacteristic.h \
    Enums/characteristickind.h

SOURCES += \
    Dialogs/mainwindow.cpp \
    Dialogs/dialognewproject.cpp \
    CustomWidgets/panelmainmenu.cpp \
    Controls/controlnewproject.cpp \
    CustomWidgets/widgetmapeditor.cpp \
    CustomWidgets/panelproject.cpp \
    MapEditor/Map/map.cpp \
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
    MapEditor/camera.cpp \
    MapEditor/grid.cpp \
    MapEditor/position.cpp \
    Models/GameDatas/systemdatas.cpp \
    Controls/MapEditor/controlmapeditor.cpp \
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
    Dialogs/dialogselectposition.cpp \
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
    Models/System/systemtileset.cpp \
    CustomWidgets/widgetpicture.cpp \
    Dialogs/dialogpicturespreview.cpp \
    CustomWidgets/widgettilesetsettings.cpp \
    CustomWidgets/widgettilesetpraticable.cpp \
    Dialogs/Systems/dialogsystemstate.cpp \
    Dialogs/dialoglocation.cpp \
    Dialogs/Commands/dialogcommandwait.cpp \
    CustomWidgets/widgetgraphics.cpp \
    Dialogs/Systems/dialogsystemlang.cpp \
    MapEditor/lands.cpp \
    MapEditor/vertexbillboard.cpp \
    MapEditor/threadmapportionloader.cpp \
    Dialogs/Commands/dialogcommandmovecamera.cpp \
    Models/projectupdater.cpp \
    Dialogs/dialogprogress.cpp \
    MapEditor/mapelement.cpp \
    MapEditor/wallindicator.cpp \
    MapEditor/sprite.cpp \
    Models/System/systemspritewall.cpp \
    Models/GameDatas/specialelementsdatas.cpp \
    Models/System/systemspecialelement.cpp \
    MathUtils/qplane3d.cpp \
    MathUtils/qray3d.cpp \
    MathUtils/qbox3d.cpp \
    MapEditor/land.cpp \
    MapEditor/floor.cpp \
    Controls/MapEditor/controlundoredo.cpp \
    Controls/MapEditor/controlmapeditor-preview.cpp \
    Controls/MapEditor/controlmapeditor-raycasting.cpp \
    Controls/MapEditor/controlmapeditor-add-remove.cpp \
    Controls/MapEditor/controlmapeditor-objects.cpp \
    Dialogs/SpecialElements/dialogspecialelements.cpp \
    Dialogs/SpecialElements/dialogtilesetspecialelements.cpp \
    Dialogs/SpecialElements/panelspecialelements.cpp \
    Models/System/systemautotile.cpp \
    CustomWidgets/widgetshowpicture.cpp \
    CustomWidgets/widgetautotilesselector.cpp \
    MapEditor/Map/mapgl.cpp \
    MapEditor/Map/maptextures.cpp \
    MapEditor/Map/mapwritting.cpp \
    MapEditor/autotiles.cpp \
    MapEditor/textureautotile.cpp \
    MapEditor/autotile.cpp \
    Dialogs/dialogcollisions.cpp \
    Models/collisionsquare.cpp \
    Dialogs/dialogrect.cpp \
    CustomWidgets/widgettilesetdirection.cpp \
    Dialogs/dialogdebugoptions.cpp \
    Singletons/common.cpp \
    Dialogs/dialogsongs.cpp \
    CustomWidgets/panelsongs.cpp \
    Models/System/systemsong.cpp \
    Models/GameDatas/songsdatas.cpp \
    Dialogs/Commands/dialogcommandplaysong.cpp \
    Dialogs/Commands/dialogcommandstopsong.cpp \
    Dialogs/dialoggeneraloptions.cpp \
    CustomWidgets/widgetsong.cpp \
    Models/System/systembattlemap.cpp \
    CustomWidgets/panelselectposition.cpp \
    Singletons/rpm.cpp \
    Models/System/systemcolor.cpp \
    Dialogs/Systems/dialogsystemcolor.cpp \
    CustomWidgets/paneldatascharacter.cpp \
    Models/System/systemwindowskin.cpp \
    Dialogs/Systems/dialogsystemwindowskin.cpp \
    CustomWidgets/widgetselectrect.cpp \
    CustomWidgets/paneldatasclass.cpp \
    CustomWidgets/paneldatasmonster.cpp \
    CustomWidgets/panelprogressiontable.cpp \
    CustomWidgets/widgettableprogression.cpp \
    Models/System/systemprogressiontable.cpp \
    CustomWidgets/widgeticon.cpp \
    CustomWidgets/widgetcomboboxformulastat.cpp \
    Models/GameDatas/animationsdatas.cpp \
    Models/System/systemanimation.cpp \
    Models/GameDatas/statusdatas.cpp \
    Models/System/systemstatus.cpp \
    Models/System/systemplaysong.cpp \
    Models/System/systemcommonskillitem.cpp \
    CustomWidgets/paneldatascommonskillitem.cpp \
    Models/System/systemeffect.cpp \
    Dialogs/Systems/dialogsystemeffect.cpp \
    CustomWidgets/paneldamageskind.cpp \
    Models/System/systemcost.cpp \
    Dialogs/Systems/dialogsystemcost.cpp \
    Models/GameDatas/titlescreengameoverdatas.cpp \
    CustomWidgets/panelrecentprojects.cpp \
    Dialogs/dialogcompleteliststates.cpp \
    Models/System/systemcharacteristic.cpp \
    Dialogs/Systems/dialogsystemcharacteristic.cpp

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
    Dialogs/dialogexport.ui \
    Dialogs/Systems/dialogsystemparameter.ui \
    Dialogs/Commands/dialogcommandmoveobject.ui \
    Dialogs/Systems/dialogsystemkeyboard.ui \
    Dialogs/Systems/dialogsystemkeyboardgeneral.ui \
    Dialogs/dialogpictures.ui \
    CustomWidgets/panelpicturepreview.ui \
    CustomWidgets/paneltextures.ui \
    CustomWidgets/widgetvariable.ui \
    CustomWidgets/widgetpicture.ui \
    Dialogs/dialogpicturespreview.ui \
    CustomWidgets/widgettilesetsettings.ui \
    Dialogs/Systems/dialogsystemstate.ui \
    Dialogs/dialoglocation.ui \
    Dialogs/Commands/dialogcommandwait.ui \
    Dialogs/Systems/dialogsystemlang.ui \
    Dialogs/Commands/dialogcommandmovecamera.ui \
    Dialogs/dialogprogress.ui \
    Dialogs/SpecialElements/dialogspecialelements.ui \
    Dialogs/SpecialElements/dialogtilesetspecialelements.ui \
    Dialogs/SpecialElements/panelspecialelements.ui \
    Dialogs/dialogcollisions.ui \
    Dialogs/dialogrect.ui \
    Dialogs/dialogdebugoptions.ui \
    Dialogs/dialogsongs.ui \
    CustomWidgets/panelsongs.ui \
    Dialogs/Commands/dialogcommandplaysong.ui \
    Dialogs/Commands/dialogcommandstopsong.ui \
    Dialogs/dialoggeneraloptions.ui \
    CustomWidgets/widgetsong.ui \
    Dialogs/dialogselectposition.ui \
    CustomWidgets/panelselectposition.ui \
    Dialogs/Systems/dialogsystemcolor.ui \
    CustomWidgets/paneldatascharacter.ui \
    Dialogs/Systems/dialogsystemwindowskin.ui \
    CustomWidgets/widgetselectrect.ui \
    CustomWidgets/paneldatasclass.ui \
    CustomWidgets/paneldatasmonster.ui \
    CustomWidgets/panelprogressiontable.ui \
    CustomWidgets/widgeticon.ui \
    CustomWidgets/paneldatascommonskillitem.ui \
    Dialogs/Systems/dialogsystemeffect.ui \
    CustomWidgets/paneldamageskind.ui \
    Dialogs/Systems/dialogsystemcost.ui \
    Dialogs/Systems/dialogsystemcharacteristic.ui \
    Dialogs/dialogcompleteliststates.ui

# Resources are currently part of the Engine, not the Editor. Editor's main function will require Q_INIT_RESOURCE.
RESOURCES += \
    $$PWD/ressources.qrc

DISTFILES += \
    darktheme.qss \
    whitetheme.qss

OTHER_FILES +=

#-------------------------------------------------
# Copy Content directory in build folder
#-------------------------------------------------


# Define source and target paths

# Content used by built engine
# Ex: path/to/RPG-Paper-Maker/Build/debug/Content
DEST_CONTENT_DIR = $$DESTDIR/Content

# Mods downloaded with update_mods
# Ex: path/to/RPG-Paper-Maker/mods
MODS_PATH = $$MAIN_PROJECT_DIR/mods

# Use shell_path to generate paths compatible with target platform for usage in shell commands (e.g. "/" -> "\\" on Windows)
# Those paths are used directly in commands, so escaped quotes \" are needed
# Trailing slash is important on Unix to indicate that we want to copy the source *content* and not the source folder itself
# (it is optional in the target path)

FROM_CONTENT = \"$$shell_path($$PWD/Content/)\"
DEST_CONTENT = \"$$shell_path($$DEST_CONTENT_DIR/)\"

FROM_SCRIPTS= \"$$shell_path($$MODS_PATH/Scripts/)\"
DEST_SCRIPTS = \"$$shell_path($$DEST_CONTENT_DIR/basic/Content/Datas/Scripts/)\"

FROM_BR= \"$$shell_path($$MODS_PATH/BR/)\"
DEST_BR = \"$$shell_path($$DEST_CONTENT_DIR/BR/)\"

FROM_WIN= \"$$shell_path($$MODS_PATH/Game/win32/)\"
DEST_WIN = \"$$shell_path($$DEST_CONTENT_DIR/win32/)\"

FROM_LINUX= \"$$shell_path($$MODS_PATH/Game/linux/)\"
DEST_LINUX = \"$$shell_path($$DEST_CONTENT_DIR/linux/)\"

FROM_OSX= \"$$shell_path($$MODS_PATH/Game/osx/)\"
DEST_OSX = \"$$shell_path($$DEST_CONTENT_DIR/osx/)\"

FROM_WEB= \"$$shell_path($$MODS_PATH/Game/web/)\"
DEST_WEB = \"$$shell_path($$DEST_CONTENT_DIR/web/)\"


# Define custom commands

# Create build Engine directory in case it wasn't created for the target yet
# We make our own mkdir command, as $(MKDIR_CMD) seems unreliable
win32: MK_DIR_CMD = mkdir
unix: MK_DIR_CMD = mkdir -p

# We do not want to copy all those subfolders every time we `make` or `make check`, so we only copy when needed, following one of 2 methods at:
# https://stackoverflow.com/questions/18488154/how-to-get-qmake-to-copy-large-data-files-only-if-they-are-updated
# A. Adding an extra compiler whose role is to copy files (https://doc.qt.io/qt-5/qmake-advanced-usage.html#adding-compilers)
# while checking if input files have changed. Unfortunately, the undocumented ${QMAKE_FILE_NAME} is always empty, so we couldn't use this.
# B. Use platform-specific commands to synchronize source and target folders. We chose this solution.

# In addition, we define two variants of the synchronization command because some destination folders are overlapping and we don't want one sync to break another one.
win32 {
    # On Windows, please try it and if it fails, add dash to ignore errors: "-robocopy"
    SYNC_PURGE_CMD = robocopy /mir /xo  # Mirror folders, removing files/folders that are not in source anymore (/mir ~= /e + /purge)
    SYNC_PRESERVE_CMD = robocopy /e /xo # Copy folders (even empty), but don't remove file/folders that are not in source anymore
}
unix {
    SYNC_PURGE_CMD = rsync -rul --del   # Preserve symlinks with -l, crucial with OSX Frameworks, and removing files/folders that are not in source anymore
    SYNC_PRESERVE_CMD = rsync -rul      # Preserve symlinks
}

# Copy all content after making sure the target directory exists
copyGameResources.commands = \
    $$MK_DIR_CMD        $$DEST_CONTENT                  $$escape_expand(\n\t) \ # folder should have been created for built library, but safer (no order dependency)
    $$MK_DIR_CMD        $$DEST_SCRIPTS                  $$escape_expand(\n\t) \ # optional since FROM_CONTENT already has basic/Content/Datas/Scripts, but safer
    # preserve existing files when copying to DEST_CONTENT to avoid deleting DEST_SCRIPTS which is under the former (you must manually remove files not in FROM_CONTENT anymore)
    $$SYNC_PRESERVE_CMD $$FROM_CONTENT  $$DEST_CONTENT  $$escape_expand(\n\t) \
    $$SYNC_PURGE_CMD    $$FROM_SCRIPTS  $$DEST_SCRIPTS  $$escape_expand(\n\t) \
    $$SYNC_PURGE_CMD    $$FROM_BR       $$DEST_BR       $$escape_expand(\n\t) \
    $$SYNC_PURGE_CMD    $$FROM_WIN      $$DEST_WIN      $$escape_expand(\n\t) \
    $$SYNC_PURGE_CMD    $$FROM_LINUX    $$DEST_LINUX    $$escape_expand(\n\t) \
    $$SYNC_PURGE_CMD    $$FROM_OSX      $$DEST_OSX      $$escape_expand(\n\t) \
    $$SYNC_PURGE_CMD    $$FROM_WEB      $$DEST_WEB

# Setup all those extra commands
first.depends = $(first) copyGameResources
export(first.depends)
export(copyBR.commands)
QMAKE_EXTRA_TARGETS += first copyGameResources

# Clean target explicitly (custom build paths are not included in the default clean)
# We need to find the exact library name depending on the platform
# If you don't care preserving the destination folder, you can also delete DESTDIR entirely (in the custom clean command below)
win32: LIB_FILENAME = "$${TARGET}.$$QMAKE_EXTENSION_STATICLIB"   # Ex: RPG-Paper-Maker.lib
unix: LIB_FILENAME = "lib$${TARGET}.$$QMAKE_EXTENSION_STATICLIB" # Ex: libRPG-Paper-Maker.a
QMAKE_CLEAN += "$$DESTDIR/$$LIB_FILENAME"

# Also add a custom clean command to remove the copied Content directory
# (QMAKE_CLEAN only supports files)
extraclean.commands = $$DEL_DIR_CMD $$DEST_CONTENT_DIR
clean.depends = extraclean
QMAKE_EXTRA_TARGETS += clean extraclean
