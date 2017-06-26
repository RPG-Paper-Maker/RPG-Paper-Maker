TEMPLATE = app

QT += qml quick

CONFIG += c++11

SOURCES += main.cpp


# Additional import path used to resolve QML modules in Qt Creator's code model
QML_IMPORT_PATH += \
    Content/Datas/Scripts/TestModule

# Default rules for deployment.
qnx: target.path = /tmp/$${TARGET}/bin
else: unix:!android: target.path = /opt/$${TARGET}/bin
!isEmpty(target.path): INSTALLS += target

DISTFILES += \
    Content/Datas/Scripts/desktop/includes.js \
    Content/Datas/Scripts/wanok.js \
    Content/Datas/Scripts/utilities.js \
    Content/Datas/Scripts/main.js \
    Content/Datas/Scripts/battler.js \
    Content/Datas/Scripts/camera.js \
    Content/Datas/Scripts/sprite.js \
    Content/Datas/Scripts/bitmap.js \
    Content/Datas/Scripts/scene-game.js \
    Content/Datas/Scripts/scene-title-screen.js \
    Content/Datas/Scripts/window-box.js \
    Content/Datas/Scripts/window-choices.js \
    Content/Datas/Scripts/game-stack.js \
    Content/Datas/Scripts/event-command.js \
    Content/Datas/Scripts/event-command-2.js \
    Content/Datas/Scripts/reaction-interpreter.js \
    Content/Datas/Scripts/datas-game.js \
    Content/Datas/Scripts/datas-armors.js \
    Content/Datas/Scripts/datas-battle-system.js \
    Content/Datas/Scripts/datas-classes.js \
    Content/Datas/Scripts/datas-common-events.js \
    Content/Datas/Scripts/game.js \
    Content/Datas/Scripts/datas-heroes.js \
    Content/Datas/Scripts/datas-items.js \
    Content/Datas/Scripts/datas-keyboard.js \
    Content/Datas/Scripts/datas-weapons.js \
    Content/Datas/Scripts/datas-troops.js \
    Content/Datas/Scripts/datas-system.js \
    Content/Datas/Scripts/datas-skills.js \
    Content/Datas/Scripts/datas-monsters.js \
    Content/Datas/Scripts/scene-menu.js \
    Content/Datas/Scripts/graphic-text.js \
    Content/Datas/Scripts/system-armor.js \
    Content/Datas/Scripts/system-event.js \
    Content/Datas/Scripts/system-parameter.js \
    Content/Datas/Scripts/system-object-state.js \
    Content/Datas/Scripts/system-object-event.js \
    Content/Datas/Scripts/system-object.js \
    Content/Datas/Scripts/system-common-reaction.js \
    Content/Datas/Scripts/system-object-reaction.js \
    Content/Datas/Scripts/system-item.js \
    Content/Datas/Scripts/scene-description-state.js \
    Content/Datas/Scripts/scene-menu-inventory.js \
    Content/Datas/Scripts/graphic-item.js \
    Content/Datas/Scripts/game-player.js \
    Content/Datas/Scripts/game-item.js \
    Content/Datas/Scripts/system-weapon.js \
    Content/Datas/Scripts/system-skill.js \
    Content/Datas/Scripts/game-skill.js \
    Content/Datas/Scripts/graphic-skill.js \
    Content/Datas/Scripts/scene-menu-skills.js \
    Content/Datas/Scripts/scene-menu-equip.js \
    Content/Datas/Scripts/graphic-player.js \
    Content/Datas/Scripts/graphic-player-description.js \
    Content/Datas/Scripts/graphic-equip.js \
    Content/Datas/Scripts/graphic-equip-stats.js \
    Content/Datas/Scripts/system-class.js \
    Content/Datas/Scripts/system-statistic-progression.js \
    Content/Datas/Scripts/system-class-skill.js \
    Content/Datas/Scripts/system-hero.js \
    Content/Datas/Scripts/system-monster.js \
    Content/Datas/Scripts/system-troop.js \
    Content/Datas/Scripts/system-statistic.js \
    Content/Datas/Scripts/system-element.js \
    Content/Datas/Scripts/system-weapon-armor-kind.js \
    Content/Datas/Scripts/system-keyboard.js \
    Content/Datas/Scripts/scene-load-game.js \
    Content/Datas/Scripts/scene-save-game.js \
    Content/Datas/Scripts/scene-save-load-game.js \
    Content/Datas/Scripts/map-object.js \
    Content/Datas/Scripts/map-portion.js \
    Content/Datas/Scripts/scene-map.js \
    Content/Datas/Scripts/system-value.js \
    Content/Datas/Scripts/scene-battle.js \
    Content/Datas/Scripts/scene-battle-4.js \
    Content/Datas/Scripts/scene-battle-3.js \
    Content/Datas/Scripts/scene-battle-2.js \
    Content/Datas/Scripts/scene-battle-1.js \
    Content/Datas/Scripts/scene-battle-0.js \
    Content/Datas/Scripts/system-currency.js \
    Content/Datas/Scripts/window-tabs.js \
    Content/Datas/Scripts/datas-tilesets.js \
    Content/Datas/Scripts/system-picture.js \
    Content/Datas/Scripts/system-tileset.js \
    Content/Datas/Scripts/datas-pictures.js

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

copyBR.commands = $(COPY_DIR) \"$$shell_path($$PWD\\Content)\" $$DEST
first.depends = $(first) copyBR
export(first.depends)
export(copyBR.commands)
QMAKE_EXTRA_TARGETS += first copyBR

