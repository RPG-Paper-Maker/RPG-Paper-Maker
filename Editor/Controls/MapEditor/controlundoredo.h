/*
    RPG Paper Maker Copyright (C) 2017-2022 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
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

    static const QString JSON_BEFORE;
    static const QString JSON_BEFORE_TYPE;
    static const QString JSON_AFTER;
    static const QString JSON_AFTER_TYPE;
    static const QString JSON_POS;
    static const QString JSON_STATES;
    static const int MAX_SIZE;

    void updateJsonList(QJsonArray &list, const QJsonObject &previous,
        MapEditorSubSelectionKind previousType, Serializable *after,
        MapEditorSubSelectionKind afterType, const Position &position,
        bool removeAll = false);
    void addState(int idMap, QJsonArray &tab);
    int getMapCurrentState(int idMap) const;
    int updateMapCurrentState(int idMap);
    QString getTempDir(int idMap) const;
    QString getTempFile(int idMap, int state) const;
    void undo(int idMap, QJsonArray &states);
    void redo(int idMap, QJsonArray &states);
    void undoRedo(int idMap, int offset, QJsonArray &states);
    void getStateInfos(QJsonObject &objState, MapEditorSubSelectionKind &beforeT,
        MapEditorSubSelectionKind &afterT, QJsonObject &objBefore,
        QJsonObject &objAfter, Position &position);

protected:
    QHash<int, int> m_states;
};

#endif // CONTROLUNDOREDO_H
