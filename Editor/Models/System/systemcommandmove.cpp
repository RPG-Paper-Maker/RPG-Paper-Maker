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
#include "dialognumber.h"
#include "dialogpicturespreview.h"
#include "dialogcommandwait.h"
#include "dialogcommandplaysong.h"
#include "dialogcommandscript.h"
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
        j = 15;
        break;
    case CommandMoveKind::TurnNorth:
    case CommandMoveKind::TurnSouth:
    case CommandMoveKind::TurnWest:
    case CommandMoveKind::TurnEast:
    case CommandMoveKind::Turn90Right:
    case CommandMoveKind::Turn90Left:
    case CommandMoveKind::LookAtHero:
    case CommandMoveKind::LookAtHeroOpposite:
        j = 0;
        break;
    case CommandMoveKind::ChangeSpeed:
    case CommandMoveKind::ChangeFrequency:
        j = 3;
        break;
    case CommandMoveKind::MoveAnimation:
    case CommandMoveKind::StopAnimation:
    case CommandMoveKind::ClimbAnimation:
    case CommandMoveKind::FixDirection:
    case CommandMoveKind::Through:
    case CommandMoveKind::SetWithCamera:
    case CommandMoveKind::PixelOffset:
    case CommandMoveKind::KeepPosition:
        j = 2;
        break;
    case CommandMoveKind::Wait:
        j = 2;
        break;
    case CommandMoveKind::PlaySound:
        j = 12;
        break;
    case CommandMoveKind::Script:
        j = RPM::stringToBool(command->valueCommandAt(1)) ? 3 : 2;
        break;
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
        value.setModelParameter(m_parameters);
        value.setModelProperties(m_properties);
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
        x.setModelParameter(m_parameters);
        x.setModelProperties(m_properties);
        PrimitiveValue y;
        y.initializeCommands(m_command, i);
        y.setModelParameter(m_parameters);
        y.setModelProperties(m_properties);
        PrimitiveValue yPlus;
        yPlus.initializeCommands(m_command, i);
        yPlus.setModelParameter(m_parameters);
        yPlus.setModelProperties(m_properties);
        PrimitiveValue z;
        z.initializeCommands(m_command, i);
        z.setModelParameter(m_parameters);
        z.setModelProperties(m_properties);
        PrimitiveValue peakY;
        peakY.initializeCommands(m_command, i);
        peakY.setModelParameter(m_parameters);
        peakY.setModelProperties(m_properties);
        PrimitiveValue peakYPlus;
        peakYPlus.initializeCommands(m_command, i);
        peakYPlus.setModelParameter(m_parameters);
        peakYPlus.setModelProperties(m_properties);
        PrimitiveValue time;
        time.initializeCommands(m_command, i);
        time.setModelParameter(m_parameters);
        time.setModelProperties(m_properties);
        str += RPM::translate(Translations::JUMP) + RPM::SPACE + stepSquare
            .toLower() + RPM::SPACE + "X: " + x.toString() + ", Y: " + y
            .toString()+ ", Y plus: " + yPlus.toString() + ", Z: " + z.toString()
            + ", " + RPM::translate(Translations::PEAK) + RPM::SPACE + "Y: " +
            peakY.toString() + ", " + RPM::translate(Translations::PEAK) + RPM
            ::SPACE + "Y plus: " + peakYPlus.toString() + RPM::SPACE + ", " +
            RPM::translate(Translations::TIME) + RPM::COLON + time.toString() +
            RPM::translate(Translations::SECONDS).toLower();
        break;
    }
    case CommandMoveKind::TurnNorth:
        str += RPM::translate(Translations::TURN_NORTH);
        break;
    case CommandMoveKind::TurnSouth:
        str += RPM::translate(Translations::TURN_SOUTH);
        break;
    case CommandMoveKind::TurnWest:
        str += RPM::translate(Translations::TURN_WEST);
        break;
    case CommandMoveKind::TurnEast:
        str += RPM::translate(Translations::TURN_EAST);
        break;
    case CommandMoveKind::Turn90Right:
        str += RPM::translate(Translations::TURN_90_RIGHT);
        break;
    case CommandMoveKind::Turn90Left:
        str += RPM::translate(Translations::TURN_90_LEFT);
        break;
    case CommandMoveKind::LookAtHero:
        str += RPM::translate(Translations::LOOK_AT_HERO);
        break;
    case CommandMoveKind::LookAtHeroOpposite:
        str += RPM::translate(Translations::LOOK_AT_HERO_OPPOSITE);
        break;
    case CommandMoveKind::ChangeSpeed:
    case CommandMoveKind::ChangeFrequency:
    {
        QString permanent;
        if (RPM::stringToBool(m_command.at(i++)))
        {
            permanent = RPM::BRACKET_LEFT + RPM::translate(Translations
                ::PERMANENT) + RPM::BRACKET_RIGHT;
        }
        PrimitiveValue value;
        value.initializeCommands(m_command, i);
        value.setModelParameter(m_parameters);
        value.setModelProperties(m_properties);
        switch (kind)
        {
        case CommandMoveKind::ChangeSpeed:
            value.setModelDataBase(RPM::get()->project()->gameDatas()->systemDatas()
                ->modelSpeed());
            str += RPM::translate(Translations::CHANGE_SPEED);
            break;
        case CommandMoveKind::ChangeFrequency:
            value.setModelDataBase(RPM::get()->project()->gameDatas()->systemDatas()
                ->modelFrequencies());
            str += RPM::translate(Translations::CHANGE_FREQUENCY);
            break;
        default:
            break;
        }
        str += RPM::COLON + RPM::SPACE + value.toString() + permanent;
        break;
    }
    case CommandMoveKind::MoveAnimation:
    case CommandMoveKind::StopAnimation:
    case CommandMoveKind::ClimbAnimation:
    case CommandMoveKind::FixDirection:
    case CommandMoveKind::Through:
    case CommandMoveKind::SetWithCamera:
    case CommandMoveKind::PixelOffset:
    case CommandMoveKind::KeepPosition:
    {
        QStringList options;
        options << (RPM::stringToBool(m_command.at(i++)) ? "ON" : "OFF");
        if (RPM::stringToBool(m_command.at(i++)))
        {
            options << RPM::translate(Translations::PERMANENT).toLower();
        }
        switch (kind)
        {
        case CommandMoveKind::MoveAnimation:
            str += RPM::translate(Translations::MOVE_ANIMATION);
            break;
        case CommandMoveKind::StopAnimation:
            str += RPM::translate(Translations::STOP_ANIMATION);
            break;
        case CommandMoveKind::ClimbAnimation:
            str += RPM::translate(Translations::CLIMB_ANIMATION);
            break;
        case CommandMoveKind::FixDirection:
            str += RPM::translate(Translations::DIRECTION_FIX);
            break;
        case CommandMoveKind::Through:
            str += RPM::translate(Translations::THROUGH);
            break;
        case CommandMoveKind::SetWithCamera:
            str += RPM::translate(Translations::SET_WITH_CAMERA);
            break;
        case CommandMoveKind::PixelOffset:
            str += RPM::translate(Translations::PIXEL_OFFSET);
            break;
        case CommandMoveKind::KeepPosition:
            str += RPM::translate(Translations::KEEP_POSITION);
            break;
        default:
            break;
        }
        str += RPM::SPACE + RPM::BRACKET_LEFT + options.join(RPM::COMMA) + RPM
            ::BRACKET_RIGHT;
        break;
    }
    case CommandMoveKind::Wait:
    {
        QVector<QString> list = m_command;
        list.removeFirst();
        EventCommand command(EventCommandKind::Wait, list);
        str += command.toString(m_properties, m_parameters);
        break;
    }
    case CommandMoveKind::PlaySound:
    {
        QVector<QString> list = m_command;
        list.removeFirst();
        EventCommand command(EventCommandKind::PlayASound, list);
        str += command.toString(m_properties, m_parameters);
        break;
    }
    case CommandMoveKind::Script:
    {
        QVector<QString> list = m_command;
        list.removeFirst();
        EventCommand command(EventCommandKind::Script, list);
        str += command.toString(m_properties, m_parameters);
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
    case CommandMoveKind::ChangeGraphics:
    {
        int i = 2;
        PrimitiveValue id;
        id.initializeCommands(m_command, i);
        SystemPicture *picture = reinterpret_cast<SystemPicture *>(SuperListItem
            ::getById(RPM::get()->project()->picturesDatas()->model(PictureKind
            ::Characters)->invisibleRootItem(), id.kind() == PrimitiveValueKind
            ::Number ? id.numberValue() : -1));
        DialogPicturesPreview dialog(picture, PictureKind::Characters, &id,
            m_properties, m_parameters);
        if (dialog.exec() == QDialog::Accepted)
        {
            for (int i = m_command.size() - 1; i >= 2; i--)
            {
                m_command.removeAt(i);
            }
            if (dialog.isIDValue())
            {
                id.getCommandParameter(m_command);
            } else
            {
                PrimitiveValue valueFix(PrimitiveValueKind::Number, dialog.picture()
                    ->id());
                valueFix.getCommandParameter(m_command);
            }
            if (!dialog.isIDValue() && dialog.picture()->id() == 0)
            {
                QRect rect;
                dialog.currentTexture(rect);
                m_command.append(QString::number(rect.x()));
                m_command.append(QString::number(rect.y()));
                m_command.append(QString::number(rect.width()));
                m_command.append(QString::number(rect.height()));
            } else
            {
                m_command.append(QString::number(dialog.indexX()));
                m_command.append(QString::number(dialog.indexY()));
                m_command.append("1");
                m_command.append("1");
            }
            return true;
        }
        break;
    }
    case CommandMoveKind::ChangeSpeed:
    case CommandMoveKind::ChangeFrequency:
    {
        int i = 2;
        PrimitiveValue value;
        value.initializeCommands(m_command, i);
        value.setModelParameter(m_parameters);
        value.setModelProperties(m_properties);
        QString title;
        QString label;
        if (this->getKind() == CommandMoveKind::ChangeSpeed)
        {
            title = RPM::translate(Translations::CHANGE_SPEED) + RPM::DOT_DOT_DOT;
            label = RPM::translate(Translations::SPEED) + RPM::COLON;
            value.setModelDataBase(RPM::get()->project()->gameDatas()->systemDatas()->modelSpeed());
        } else
        {
            title = RPM::translate(Translations::CHANGE_FREQUENCY) + RPM::DOT_DOT_DOT;
            label = RPM::translate(Translations::FREQUENCY) + RPM::COLON;
            value.setModelDataBase(RPM::get()->project()->gameDatas()->systemDatas()->modelFrequencies());
        }
        DialogNumber dialog(&value, title, label);
        if (dialog.exec() == QDialog::Accepted)
        {
            for (int i = m_command.size() - 1; i >= 2; i--)
            {
                m_command.removeAt(i);
            }
            value.getCommandParameter(m_command);
            return true;
        }
        break;
    }
    case CommandMoveKind::Wait:
    {
        QVector<QString> commandList = m_command;
        commandList.removeFirst();
        EventCommand command(EventCommandKind::Wait, commandList);
        DialogCommandWait dialog(&command, m_properties, m_parameters);
        if (dialog.exec() == QDialog::Accepted)
        {
            for (int i = m_command.size() - 1; i >= 1; i--)
            {
                m_command.removeAt(i);
            }
            dialog.getCommandList(m_command);
            return true;
        }
        break;
    }
    case CommandMoveKind::PlaySound:
    {
        QVector<QString> commandList = m_command;
        commandList.removeFirst();
        EventCommand command(EventCommandKind::PlayASound, commandList);
        DialogCommandPlaySong dialog(RPM::translate(Translations::PLAY_A_SOUND),
            SongKind::Sound, &command, m_properties, m_parameters);
        if (dialog.exec() == QDialog::Accepted)
        {
            for (int i = m_command.size() - 1; i >= 1; i--)
            {
                m_command.removeAt(i);
            }
            dialog.getCommandList(m_command);
            return true;
        }
        break;
    }
    case CommandMoveKind::Script:
    {
        QVector<QString> commandList = m_command;
        commandList.removeFirst();
        EventCommand command(EventCommandKind::Script, commandList);
        DialogCommandScript dialog(&command, m_properties, m_parameters);
        if (dialog.exec() == QDialog::Accepted)
        {
            for (int i = m_command.size() - 1; i >= 1; i--)
            {
                m_command.removeAt(i);
            }
            dialog.getCommandList(m_command);
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

SuperListItem* SystemCommandMove::createCopy() const
{
    SystemCommandMove *super = new SystemCommandMove;
    super->setCopy(*this);
    return super;
}

// -------------------------------------------------------

void SystemCommandMove::setCopy(const SuperListItem &super)
{
    SuperListItem::setCopy(super);
    const SystemCommandMove *move = reinterpret_cast<const SystemCommandMove *>(&super);
    m_command = move->m_command;
    m_properties = move->m_properties;
    m_parameters = move->m_parameters;
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
