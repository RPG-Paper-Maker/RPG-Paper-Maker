/*
    RPG Paper Maker Copyright (C) 2017-2019 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
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
    case CommandMoveKind::MoveNorthWest:
    case CommandMoveKind::MoveNorthEast:
    case CommandMoveKind::MoveSouthWest:
    case CommandMoveKind::MoveSouthEast:
    case CommandMoveKind::MoveRandom:
    case CommandMoveKind::MoveHero:
    case CommandMoveKind::MoveOppositeHero:
    case CommandMoveKind::MoveFront:
    case CommandMoveKind::MoveBack:
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
        case CommandMoveKind::MoveNorthWest:
            dir = "North West"; break;
        case CommandMoveKind::MoveNorthEast:
            dir = "North East"; break;
        case CommandMoveKind::MoveSouthWest:
            dir = "South West"; break;
        case CommandMoveKind::MoveSouthEast:
            dir = "South East"; break;
        case CommandMoveKind::MoveRandom:
            dir = "random"; break;
        case CommandMoveKind::MoveHero:
            dir = "hero"; break;
        case CommandMoveKind::MoveOppositeHero:
            dir = "opposite hero"; break;
        case CommandMoveKind::MoveFront:
            dir = "front"; break;
        case CommandMoveKind::MoveBack:
            dir = "back"; break;
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
    case CommandMoveKind::MoveNorthWest:
    case CommandMoveKind::MoveNorthEast:
    case CommandMoveKind::MoveSouthWest:
    case CommandMoveKind::MoveSouthEast:
    case CommandMoveKind::MoveRandom:
    case CommandMoveKind::MoveHero:
    case CommandMoveKind::MoveOppositeHero:
    case CommandMoveKind::MoveFront:
    case CommandMoveKind::MoveBack:
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
