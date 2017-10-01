TEMPLATE = app

greaterThan(QT_MAJOR_VERSION, 4): QT += qml quick

CONFIG += c++11

SOURCES += main.cpp


# Additional import path used to resolve QML modules in Qt Creator's code model
QML_IMPORT_PATH += \
    Content/Datas/Scripts/System/TestModule

# Default rules for deployment.
qnx: target.path = /tmp/$${TARGET}/bin
else: unix:!android: target.path = /opt/$${TARGET}/bin
!isEmpty(target.path): INSTALLS += target

DISTFILES += \
    Content/Datas/Scripts/System/desktop/includes.js \
    Content/Datas/Scripts/System/wanok.js \
    Content/Datas/Scripts/System/utilities.js \
    Content/Datas/Scripts/System/main.js \
    Content/Datas/Scripts/System/battler.js \
    Content/Datas/Scripts/System/camera.js \
    Content/Datas/Scripts/System/sprite.js \
    Content/Datas/Scripts/System/bitmap.js \
    Content/Datas/Scripts/System/scene-game.js \
    Content/Datas/Scripts/System/scene-title-screen.js \
    Content/Datas/Scripts/System/window-box.js \
    Content/Datas/Scripts/System/window-choices.js \
    Content/Datas/Scripts/System/game-stack.js \
    Content/Datas/Scripts/System/event-command.js \
    Content/Datas/Scripts/System/event-command-2.js \
    Content/Datas/Scripts/System/reaction-interpreter.js \
    Content/Datas/Scripts/System/datas-game.js \
    Content/Datas/Scripts/System/datas-armors.js \
    Content/Datas/Scripts/System/datas-battle-system.js \
    Content/Datas/Scripts/System/datas-classes.js \
    Content/Datas/Scripts/System/datas-common-events.js \
    Content/Datas/Scripts/System/game.js \
    Content/Datas/Scripts/System/datas-heroes.js \
    Content/Datas/Scripts/System/datas-items.js \
    Content/Datas/Scripts/System/datas-keyboard.js \
    Content/Datas/Scripts/System/datas-weapons.js \
    Content/Datas/Scripts/System/datas-troops.js \
    Content/Datas/Scripts/System/datas-system.js \
    Content/Datas/Scripts/System/datas-skills.js \
    Content/Datas/Scripts/System/datas-monsters.js \
    Content/Datas/Scripts/System/scene-menu.js \
    Content/Datas/Scripts/System/graphic-text.js \
    Content/Datas/Scripts/System/system-armor.js \
    Content/Datas/Scripts/System/system-event.js \
    Content/Datas/Scripts/System/system-parameter.js \
    Content/Datas/Scripts/System/system-object-state.js \
    Content/Datas/Scripts/System/system-object-event.js \
    Content/Datas/Scripts/System/system-object.js \
    Content/Datas/Scripts/System/system-common-reaction.js \
    Content/Datas/Scripts/System/system-object-reaction.js \
    Content/Datas/Scripts/System/system-item.js \
    Content/Datas/Scripts/System/scene-description-state.js \
    Content/Datas/Scripts/System/scene-menu-inventory.js \
    Content/Datas/Scripts/System/graphic-item.js \
    Content/Datas/Scripts/System/game-player.js \
    Content/Datas/Scripts/System/game-item.js \
    Content/Datas/Scripts/System/system-weapon.js \
    Content/Datas/Scripts/System/system-skill.js \
    Content/Datas/Scripts/System/game-skill.js \
    Content/Datas/Scripts/System/graphic-skill.js \
    Content/Datas/Scripts/System/scene-menu-skills.js \
    Content/Datas/Scripts/System/scene-menu-equip.js \
    Content/Datas/Scripts/System/graphic-player.js \
    Content/Datas/Scripts/System/graphic-player-description.js \
    Content/Datas/Scripts/System/graphic-equip.js \
    Content/Datas/Scripts/System/graphic-equip-stats.js \
    Content/Datas/Scripts/System/system-class.js \
    Content/Datas/Scripts/System/system-statistic-progression.js \
    Content/Datas/Scripts/System/system-class-skill.js \
    Content/Datas/Scripts/System/system-hero.js \
    Content/Datas/Scripts/System/system-monster.js \
    Content/Datas/Scripts/System/system-troop.js \
    Content/Datas/Scripts/System/system-statistic.js \
    Content/Datas/Scripts/System/system-element.js \
    Content/Datas/Scripts/System/system-weapon-armor-kind.js \
    Content/Datas/Scripts/System/system-keyboard.js \
    Content/Datas/Scripts/System/scene-load-game.js \
    Content/Datas/Scripts/System/scene-save-game.js \
    Content/Datas/Scripts/System/scene-save-load-game.js \
    Content/Datas/Scripts/System/map-object.js \
    Content/Datas/Scripts/System/map-portion.js \
    Content/Datas/Scripts/System/scene-map.js \
    Content/Datas/Scripts/System/system-value.js \
    Content/Datas/Scripts/System/scene-battle.js \
    Content/Datas/Scripts/System/scene-battle-4.js \
    Content/Datas/Scripts/System/scene-battle-3.js \
    Content/Datas/Scripts/System/scene-battle-2.js \
    Content/Datas/Scripts/System/scene-battle-1.js \
    Content/Datas/Scripts/System/scene-battle-0.js \
    Content/Datas/Scripts/System/system-currency.js \
    Content/Datas/Scripts/System/window-tabs.js \
    Content/Datas/Scripts/System/datas-tilesets.js \
    Content/Datas/Scripts/System/system-picture.js \
    Content/Datas/Scripts/System/system-tileset.js \
    Content/Datas/Scripts/System/datas-pictures.js \
    Content/Datas/Scripts/System/sprite-wall.js \
    Content/Datas/Scripts/System/system-wall.js \
    Content/Datas/Scripts/System/datas-special-elements.js

RESOURCES += \
    qml.qrc

#-------------------------------------------------
# Copy Content directory in build folder
#-------------------------------------------------

DEST = \"$$shell_path($$OUT_PWD)\"
win32{
    CONFIG(debug, debug|release) {
        VARIANT = debug
    } else {
        VARIANT = release
    }
    DEST = \"$$shell_path($$OUT_PWD\\$$VARIANT\\Content)\"
}

!equals(PWD, $${OUT_PWD}) {
    copyBR.commands = $(COPY_DIR) \"$$shell_path($$PWD\\Content)\" $$DEST
    first.depends = $(first) copyBR
    export(first.depends)
    export(copyBR.commands)
    QMAKE_EXTRA_TARGETS += first copyBR
}

