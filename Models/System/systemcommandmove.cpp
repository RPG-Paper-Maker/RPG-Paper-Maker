/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

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

#include "systemcommandmove.h"
#include "commandmovekind.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

SystemCommandMove::SystemCommandMove() :
    SystemCommandMove(-1, "", QVector<QString>())
{

}

SystemCommandMove::SystemCommandMove(int i, QString n,
                                     QVector<QString> command) :
    SuperListItem(i, n),
    m_command(command)
{

}

QString SystemCommandMove::toString() const{
    int i = 0;
    CommandMoveKind kind = static_cast<CommandMoveKind>(m_command.at(i++)
                                                        .toInt());
    QString str = SuperListItem::beginningText;

    switch (kind){
    case CommandMoveKind::MoveNorth:
    case CommandMoveKind::MoveSouth:
    case CommandMoveKind::MoveWest:
    case CommandMoveKind::MoveEast:
        QString stepSquare = m_command.at(i++) == "0" ? "square" : "step";
        QString dir;
        switch (kind){
        case CommandMoveKind::MoveNorth:
            dir = "North"; break;
        case CommandMoveKind::MoveSouth:
            dir = "South"; break;
        case CommandMoveKind::MoveWest:
            dir = "West"; break;
        case CommandMoveKind::MoveEast:
            dir = "East"; break;
        }
        str += "Move 1 " + stepSquare + " to " + dir;
        break;
    }

    return str;
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void SystemCommandMove::initialize(const EventCommand *command, int& i){
    m_command.append(command->valueCommandAt(i));
    CommandMoveKind kind = static_cast<CommandMoveKind>(command
                                                        ->valueCommandAt(i++)
                                                        .toInt());

    int j = 1;
    switch (kind){
    case CommandMoveKind::MoveNorth:
    case CommandMoveKind::MoveSouth:
    case CommandMoveKind::MoveWest:
    case CommandMoveKind::MoveEast:
        break;
    }

    for (int k = 0; k < j; k++)
        m_command.append(command->valueCommandAt(i++));
}

// -------------------------------------------------------

void SystemCommandMove::getCommand(QVector<QString> &command){
    for (int i = 0; i < m_command.size(); i++)
        command.append(m_command.at(i));
}

// -------------------------------------------------------

QList<QStandardItem*> SystemCommandMove::getModelRow() const{
    QList<QStandardItem*> row = QList<QStandardItem*>();
    QStandardItem* item = new QStandardItem;
    item->setData(QVariant::fromValue(reinterpret_cast<quintptr>(this)));
    item->setText(toString());
    row.append(item);

    return row;
}
