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

#ifndef CONTROLUNDOREDO_H
#define CONTROLUNDOREDO_H

#include <QHash>
#include <QJsonDocument>
#include "mapelement.h"

// -------------------------------------------------------
//
//  CLASS ControlUndoRedo
//
//  The controler of the undo / redo system. This part is handling all the
//  maps current stats and apply undo / redo stuffs.
//
// -------------------------------------------------------

class ControlUndoRedo
{
public:
    ControlUndoRedo();
    static const QString jsonBefore;
    static const QString jsonBeforeType;
    static const QString jsonAfter;
    static const QString jsonAfterType;
    static const QString jsonPos;
    static const QString jsonStates;
    static const int MAX_SIZE;

    void updateJsonList(QJsonArray& list, const QJsonObject& previous,
                        MapEditorSubSelectionKind previousType,
                        MapElement* after, MapEditorSubSelectionKind afterType,
                        const Position &position);
    void addState(int idMap, QJsonArray& tab);
    int getMapCurrentState(int idMap) const;
    int updateMapCurrentState(int idMap);
    QString getTempDir(int idMap) const;
    QString getTempFile(int idMap, int state) const;
    void undo(int idMap, QJsonArray &states);
    void redo(int idMap, QJsonArray &states);
    void undoRedo(int idMap, int offset, QJsonArray &states);
    void getStateInfos(QJsonObject &objState,
                       MapEditorSubSelectionKind& beforeT,
                       MapEditorSubSelectionKind& afterT,
                       QJsonObject &objBefore, QJsonObject &objAfter,
                       Position& position);

protected:
    QHash<int, int> m_states;
};

#endif // CONTROLUNDOREDO_H
