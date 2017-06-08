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

#ifndef SYSTEMREACTION_H
#define SYSTEMREACTION_H

#include <QJsonObject>
#include <QJsonArray>
#include "eventcommand.h"
#include "superlistitem.h"

// -------------------------------------------------------
//
//  CLASS SystemReaction
//
//  A particular reaction.
//
// -------------------------------------------------------

class SystemReaction : public SuperListItem
{
public:
    SystemReaction();
    SystemReaction(int i, QString n, QStandardItemModel *commands, bool bHero,
                   bool bObjects);
    virtual ~SystemReaction();
    QStandardItemModel* modelCommands() const;
    bool blockingHero() const;
    void setBlockingHero(bool b);
    bool blockingObjects() const;
    void setBlockingObjects(bool b);
    void setCopy(const SystemReaction& copy);
    static void addEmptyCommand(QStandardItem *root);
    static void addCommand(QStandardItem *root, EventCommand* command);
    static void addCommandWithoutText(QStandardItem *root,
                                      EventCommand* command);
    static void deleteCommands(QStandardItem* item);
    static void copyCommands(const QStandardItemModel *from,
                             QStandardItemModel *to);
    static void copyCommandsItem(const QStandardItem *from, QStandardItem* to);

    void read(const QJsonObject &json);
    void write(QJsonObject &json) const;

protected:
    QStandardItemModel* m_modelCommands; // A tree with EventCommands data
    bool m_blockingHero;
    bool m_blockingObjects;

private:
    void readRoot(const QJsonArray &json, QStandardItem* root);
    QJsonArray getChildrenJSON(QStandardItem* item) const;
};

#endif // SYSTEMREACTION_H
