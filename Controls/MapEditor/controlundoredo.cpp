/*
    RPG Paper Maker Copyright (C) 2017 Marie Laporte

    This file is part of RPG Paper Maker.

    RPG Paper Maker is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    RPG Paper Maker is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with Foobar.  If not, see <http://www.gnu.org/licenses/>.
*/

#include "controlundoredo.h"
#include "wanok.h"
#include <QFile>

const QString ControlUndoRedo::jsonBefore = "before";
const QString ControlUndoRedo::jsonBeforeType = "beforeT";
const QString ControlUndoRedo::jsonAfter = "after";
const QString ControlUndoRedo::jsonAfterType = "afterT";
const QString ControlUndoRedo::jsonPos = "pos";
const QString ControlUndoRedo::jsonStates = "states";
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

void ControlUndoRedo::updateJsonList(
        QJsonArray &list, const QJsonObject &previous,
        MapEditorSubSelectionKind previousType, Serializable* after,
        MapEditorSubSelectionKind afterType, const Position& position,
        bool removeAll)
{
    QJsonObject state, afterJson;
    QJsonArray positionJson;
    if (after != nullptr)
        after->write(afterJson);
    position.write(positionJson);

    state[jsonBefore] = previous;
    state[jsonBeforeType] = (int) previousType;
    state[jsonAfter] = afterJson;
    state[jsonAfterType] = (int) afterType;
    state[jsonPos] = positionJson;

    if (removeAll) {
        if (list.size() > 1)
            list.removeLast();
    }
    list.append(state);
}

// -------------------------------------------------------

void ControlUndoRedo::addState(int idMap, QJsonArray& tab) {
    if (tab.isEmpty())
        return;

    QJsonObject obj;
    obj[jsonStates] = tab;
    int currentState = updateMapCurrentState(idMap);
    int state;

    // Add to undeoRedo idMaps in project
    Wanok::mapsUndoRedo += idMap;

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
    Wanok::writeOtherJSON(path, obj);

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
    return Wanok::pathCombine(Wanok::pathCombine(Wanok::pathCombine(
               Wanok::get()->project()->pathCurrentProject(),
               Wanok::pathMaps),
               Wanok::generateMapName(idMap)),
               Wanok::TEMP_UNDOREDO_MAP_FOLDER_NAME);
}

// -------------------------------------------------------

QString ControlUndoRedo::getTempFile(int idMap, int state) const {
    return Wanok::pathCombine(getTempDir(idMap),
                              QString::number(state) + ".json");
}

// -------------------------------------------------------

void ControlUndoRedo::undo(int idMap, QJsonArray& states)
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
        Wanok::readOtherJSON(path, doc);
        obj = doc.object();
        states = obj[jsonStates].toArray();

        // Update current state
        m_states[idMap] = state + (offset == 0 ? 1 : 0);
    }
}

// -------------------------------------------------------

void ControlUndoRedo::getStateInfos(QJsonObject& objState,
        MapEditorSubSelectionKind& beforeT, MapEditorSubSelectionKind& afterT,
        QJsonObject& objBefore, QJsonObject& objAfter, Position &position)
{
    beforeT = static_cast<MapEditorSubSelectionKind>(
                objState[jsonBeforeType].toInt());
    afterT = static_cast<MapEditorSubSelectionKind>(
                objState[jsonAfterType].toInt());
    objBefore = objState[jsonBefore].toObject();
    objAfter = objState[jsonAfter].toObject();
    QJsonArray jsonPosition = objState[jsonPos].toArray();
    position.read(jsonPosition);
}
