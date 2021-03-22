/*
    RPG Paper Maker Copyright (C) 2017-2021 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include "systemcommandmove.h"
#include "dialogjump.h"
#include "rpm.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

SystemCommandMove::SystemCommandMove(int i, QString n, QVector<QString> command,
    QStandardItemModel *properties, QStandardItemModel *parameters) :
    SuperListItem(i, n),
    m_command(command),
    m_properties(properties),
    m_parameters(parameters)
{

}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

CommandMoveKind SystemCommandMove::getKind() const
{
    return static_cast<CommandMoveKind>(m_command.at(0).toInt());
}

// -------------------------------------------------------

void SystemCommandMove::getCommand(QVector<QString> &command) const
{
    for (int i = 0; i < m_command.size(); i++)
    {
        command.append(m_command.at(i));
    }
}

// -------------------------------------------------------

void SystemCommandMove::initialize(const EventCommand *command, int &i)
{
    m_command.append(command->valueCommandAt(i));
    CommandMoveKind kind = static_cast<CommandMoveKind>(command->valueCommandAt(
        i++).toInt());
    int j = 1;
    switch (kind)
    {
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
    case CommandMoveKind::ChangeGraphics:
        j = 7;
        break;
    case CommandMoveKind::Jump:
        j = 13;
    }
    for (int k = 0; k < j; k++)
    {
        m_command.append(command->valueCommandAt(i++));
    }
}

// -------------------------------------------------------
//
//  VIRTUAL FUNCTIONS
//
// -------------------------------------------------------

QString SystemCommandMove::toString() const
{
    int i = 0;
    CommandMoveKind kind = static_cast<CommandMoveKind>(m_command.at(i++).toInt());
    QString str = SuperListItem::beginningText;
    switch (kind)
    {
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
    {
        QString stepSquare = m_command.at(i++) == "0" ? RPM::translate(
            Translations::SQUARE) : RPM::translate(Translations::STEP);
        QString dir;
        switch (kind)
        {
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
        default:
            break;
        }
        str += RPM::translate(Translations::MOVE_1) + RPM::SPACE + stepSquare +
            RPM::SPACE + RPM::translate(Translations::TO).toLower() + RPM::SPACE
            + dir;
        break;
    }
    case CommandMoveKind::ChangeGraphics:
    {
        QString permanent;

        if (RPM::stringToBool(m_command.at(i++)))
        {
            permanent = RPM::BRACKET_LEFT + RPM::translate(Translations
                ::PERMANENT) + RPM::BRACKET_RIGHT;
        }
        PrimitiveValue value;
        value.initializeCommands(m_command, i);
        QString strValue;
        if (value.kind() == PrimitiveValueKind::Number)
        {
            strValue = reinterpret_cast<SystemPicture *>(SuperListItem::getById(
                RPM::get()->project()->picturesDatas()->model(PictureKind
                ::Characters)->invisibleRootItem(), value.numberValue()))
                ->toString();
        } else
        {
            strValue = value.toString();
        }
        str += RPM::translate(Translations::CHANGE_GRAPHICS) + RPM::SPACE +
            strValue + RPM::SPACE + permanent;
        break;
    }
    case CommandMoveKind::Jump:
    {
        QString stepSquare = m_command.at(i++) == "0" ? RPM::translate(
            Translations::SQUARE) : RPM::translate(Translations::STEP);
        PrimitiveValue x;
        x.initializeCommands(m_command, i);
        PrimitiveValue y;
        y.initializeCommands(m_command, i);
        PrimitiveValue yPlus;
        yPlus.initializeCommands(m_command, i);
        PrimitiveValue z;
        z.initializeCommands(m_command, i);
        PrimitiveValue peakY;
        peakY.initializeCommands(m_command, i);
        PrimitiveValue peakYPlus;
        peakYPlus.initializeCommands(m_command, i);
        str += "Jump" + RPM::SPACE + stepSquare.toLower() + RPM::SPACE + "X: " +
            x.toString() + ", Y: " + y.toString()+ ", Y plus: " + yPlus.toString()
            + ", Z: " + z.toString() + ", " + "Peak" + RPM::SPACE + "Y: " +
            peakY.toString() + ", " + "Peak" + RPM::SPACE + "Y plus: " +
            peakYPlus.toString();
        break;
    }
    }
    return str;
}

// -------------------------------------------------------

bool SystemCommandMove::openDialog()
{
    switch (this->getKind())
    {
    case CommandMoveKind::Jump:
    {
        DialogJump dialog(m_properties, m_parameters);
        dialog.initialize(m_command);
        if (dialog.exec() == QDialog::Accepted)
        {
            for (int i = m_command.size() - 1; i >= 2; i--)
            {
                m_command.removeAt(i);
            }
            dialog.getCommand(m_command);
            return true;
        }
        break;
    }
    default:
        break;
    }
    return false;
}

// -------------------------------------------------------

QList<QStandardItem*> SystemCommandMove::getModelRow() const
{
    QList<QStandardItem*> row = QList<QStandardItem*>();
    QStandardItem *item = new QStandardItem;
    item->setData(QVariant::fromValue(reinterpret_cast<quintptr>(this)));
    item->setText(toString());
    row.append(item);
    return row;
}
