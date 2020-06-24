/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include "systemcommandmove.h"
#include "commandmovekind.h"
#include "rpm.h"

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
        QString stepSquare = m_command.at(i++) == "0" ? RPM::translate(
            Translations::SQUARE) : RPM::translate(Translations::STEP);
        QString dir;
        switch (kind){
        case CommandMoveKind::MoveNorth:
            dir = RPM::translate(Translations::NORTH); break;
        case CommandMoveKind::MoveSouth:
            dir = RPM::translate(Translations::SOUTH); break;
        case CommandMoveKind::MoveWest:
            dir = RPM::translate(Translations::WEST); break;
        case CommandMoveKind::MoveEast:
            dir = RPM::translate(Translations::EAST); break;
        case CommandMoveKind::MoveNorthWest:
            dir = RPM::translate(Translations::NORTH_WEST); break;
        case CommandMoveKind::MoveNorthEast:
            dir = RPM::translate(Translations::NORTH_EAST); break;
        case CommandMoveKind::MoveSouthWest:
            dir = RPM::translate(Translations::SOUTH_WEST); break;
        case CommandMoveKind::MoveSouthEast:
            dir = RPM::translate(Translations::SOUTH_EAST); break;
        case CommandMoveKind::MoveRandom:
            dir = RPM::translate(Translations::RANDOM).toLower(); break;
        case CommandMoveKind::MoveHero:
            dir = RPM::translate(Translations::HERO).toLower(); break;
        case CommandMoveKind::MoveOppositeHero:
            dir = RPM::translate(Translations::OPPOSITE_HERO).toLower(); break;
        case CommandMoveKind::MoveFront:
            dir = RPM::translate(Translations::FRONT).toLower(); break;
        case CommandMoveKind::MoveBack:
            dir = RPM::translate(Translations::BACK).toLower(); break;
        }
        str += RPM::translate(Translations::MOVE_1) + RPM::SPACE + stepSquare +
            RPM::SPACE + RPM::translate(Translations::TO).toLower() + RPM::SPACE
            + dir;
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
