/*
    RPG Paper Maker Copyright (C) 2017-2018 Marie Laporte

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

#ifndef SYSTEMCOMMANDMOVE_H
#define SYSTEMCOMMANDMOVE_H

#include "superlistitem.h"
#include "eventcommand.h"

// -------------------------------------------------------
//
//  CLASS SystemCommandMove
//
//  A particulary command move (system).
//
// -------------------------------------------------------

class SystemCommandMove : public SuperListItem
{
public:
    SystemCommandMove();
    SystemCommandMove(int i, QString n, QVector<QString> command);
    virtual QString toString() const;
    void initialize(const EventCommand* command, int& i);
    void getCommand(QVector<QString> &command);
    virtual QList<QStandardItem*> getModelRow() const;

protected:
    QVector<QString> m_command;
};

#endif // SYSTEMCOMMANDMOVE_H
