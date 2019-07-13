/*
    RPG Paper Maker Copyright (C) 2017-2019 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include <QFile>
#include "controlundoredo.h"
#include "rpm.h"
#include "common.h"

const QString ControlUndoRedo::JSON_BEFORE = "before";
const QString ControlUndoRedo::JSON_BEFORE_TYPE = "beforeT";
const QString ControlUndoRedo::JSON_AFTER = "after";
const QString ControlUndoRedo::JSON_AFTER_TYPE = "afterT";
const QString ControlUndoRedo::JSON_POS = "pos";
const QString ControlUndoRedo::JSON_STATES = "states";
const int ControlUndoRedo::MAX_SIZE = 50;

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

ControlUndoRedo::ControlUndoRedo()
{

}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void ControlUndoRedo::updateJsonList(QJsonArray &list, const QJsonObject &previous,
    MapEditorSubSelectionKind previousType, Serializable *after,
    MapEditorSubSelectionKind afterType, const Position &position, bool removeAll)
{
    QJsonObject state, afterJson;
    QJsonArray positionJson;
    if (after != nullptr)
        after->write(afterJson);
    position.write(positionJson);

    state[JSON_BEFORE] = previous;
    state[JSON_BEFORE_TYPE] = static_cast<int>(previousType);
    state[JSON_AFTER] = afterJson;
    state[JSON_AFTER_TYPE] = static_cast<int>(afterType);
    state[JSON_POS] = positionJson;

    if (removeAll) {
        if (list.size() > 1)
            list.removeLast();
    }
    list.append(state);
}

// -------------------------------------------------------

void ControlUndoRedo::addState(int idMap, QJsonArray &tab) {
    if (tab.isEmpty())
        return;

    QJsonObject obj;
    obj[JSON_STATES] = tab;
    int currentState = updateMapCurrentState(idMap);
    int state;

    // Add to undeoRedo idMaps in project
    RPM::mapsUndoRedo += idMap;

    // If max size reached, remove the first state and move the others
    QString path = getTempFile(idMap, currentState - 1);
    if (currentState == MAX_SIZE && QFile::exists(path)) {
        state = 0;
        QString pathSource = getTempFile(idMap, state + 1);
        QString pathTarget = getTempFile(idMap, state);

        while (QFile::exists(pathSource)) {
            QFile::remove(pathTarget);
            QFile::copy(pathSource, pathTarget);
            state++;
            pathSource = getTempFile(idMap, state + 1);
            pathTarget = getTempFile(idMap, state);
        }

        QFile::remove(pathTarget);
    }

    // Save in temp file
    Common::writeOtherJSON(path, obj);

    // Remove all the state > state
    state = currentState;
    path = getTempFile(idMap, state);
    while (QFile::exists(path)) {
        QFile(path).remove();
        path = getTempFile(idMap, ++state);
    }

    // Clear the changes from map editor control
    for (int i = tab.size() - 1; i >= 0; i--)
        tab.removeAt(i);
}

// -------------------------------------------------------

int ControlUndoRedo::getMapCurrentState(int idMap) const {
    if (m_states.contains(idMap))
        return m_states.value(idMap);

    return 0;
}

// -------------------------------------------------------

int ControlUndoRedo::updateMapCurrentState(int idMap) {
    if (m_states.contains(idMap)) {
        int currentValue = m_states.value(idMap);
        if (currentValue < MAX_SIZE)
            currentValue++;
        m_states[idMap] = currentValue;
        return currentValue;
    }
    else {
        m_states[idMap] = 1;
        return 1;
    }
}

// -------------------------------------------------------

QString ControlUndoRedo::getTempDir(int idMap) const {
    return Common::pathCombine(Common::pathCombine(Common::pathCombine(
        RPM::get()->project()->pathCurrentProject(),
        RPM::pathMaps),
        RPM::generateMapName(idMap)),
        RPM::TEMP_UNDOREDO_MAP_FOLDER_NAME);
}

// -------------------------------------------------------

QString ControlUndoRedo::getTempFile(int idMap, int state) const {
    return Common::pathCombine(getTempDir(idMap), QString::number(state) + ".json");
}

// -------------------------------------------------------

void ControlUndoRedo::undo(int idMap, QJsonArray &states)
{
    undoRedo(idMap, -1, states);
}

// -------------------------------------------------------

void ControlUndoRedo::redo(int idMap, QJsonArray &states)
{
    undoRedo(idMap, 0, states);
}

// -------------------------------------------------------

void ControlUndoRedo::undoRedo(int idMap, int offset, QJsonArray &states)
{
    int state = getMapCurrentState(idMap) + offset;

    QString path = getTempFile(idMap, state);
    if (QFile(path).exists()) {

        // Get the states
        QJsonDocument doc;
        QJsonObject obj;
        Common::readOtherJSON(path, doc);
        obj = doc.object();
        states = obj[JSON_STATES].toArray();

        // Update current state
        m_states[idMap] = state + (offset == 0 ? 1 : 0);
    }
}

// -------------------------------------------------------

void ControlUndoRedo::getStateInfos(QJsonObject &objState,
    MapEditorSubSelectionKind &beforeT, MapEditorSubSelectionKind &afterT,
    QJsonObject &objBefore, QJsonObject &objAfter, Position &position)
{
    beforeT = static_cast<MapEditorSubSelectionKind>(objState[JSON_BEFORE_TYPE]
        .toInt());
    afterT = static_cast<MapEditorSubSelectionKind>(objState[JSON_AFTER_TYPE]
        .toInt());
    objBefore = objState[JSON_BEFORE].toObject();
    objAfter = objState[JSON_AFTER].toObject();
    QJsonArray jsonPosition = objState[JSON_POS].toArray();
    position.read(jsonPosition);
}
