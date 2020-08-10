/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include "eventcommand.h"
#include "rpm.h"
#include "widgetcomboboxteam.h"
#include "primitivevaluekind.h"
#include "systemobjectevent.h"
#include "systemcommandmove.h"
#include "conditionheroeskind.h"
#include "systemcommonreaction.h"

const QString EventCommand::JSON_KIND = "kind";
const QString EventCommand::JSON_COMMANDS = "command";
const QString EventCommand::BEGINNING_COMMAND = "> ";
QVector<QString> EventCommand::emptyCommandList = QVector<QString>();

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

EventCommand::EventCommand() :
    EventCommand(EventCommandKind::None)
{

}

EventCommand::EventCommand(EventCommandKind k, QVector<QString> &l) :
    m_kind(k),
    m_listCommand(l)
{

}

EventCommand::~EventCommand() {

}

EventCommandKind EventCommand::kind() const {
    return m_kind;
}

void  EventCommand::setKind(EventCommandKind k) {
    m_kind = k;
}

int EventCommand::commandsCount() const {
    return m_listCommand.size();
}

QString EventCommand::valueCommandAt(int index) const {
    return m_listCommand.at(index);
}

QVector<QString> EventCommand::commands() {
    return m_listCommand;
}

void EventCommand::setCommands(QVector<QString>& commands) {
    m_listCommand = commands;
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

QString EventCommand::kindToString(EventCommandKind kind) {
    return RPM::ENUM_TO_STRING_EVENT_COMMAND_KIND.at(static_cast<int>(kind));
}

// -------------------------------------------------------

bool EventCommand::eventCommandKindLessThan(const EventCommandKind &v1, const
    EventCommandKind &v2)
{
    return EventCommand::kindToString(v1) < EventCommand::kindToString(v2);
}

// -------------------------------------------------------

bool EventCommand::hasElse() const {
    return m_listCommand[0] == RPM::TRUE_BOOL_STRING;
}

// -------------------------------------------------------

bool EventCommand::isBattleWithoutGameOver() const {
    return m_listCommand[1] == RPM::FALSE_BOOL_STRING;
}

// -------------------------------------------------------

bool EventCommand::isEditable() const {
    return this->isErasable() && m_kind != EventCommandKind::While && m_kind !=
        EventCommandKind::WhileBreak && m_kind != EventCommandKind::EndWhile &&
        m_kind != EventCommandKind::Else && m_kind != EventCommandKind::EndIf &&
        m_kind != EventCommandKind::EndGame && m_kind != EventCommandKind
        ::OpenMainMenu && m_kind != EventCommandKind::OpenSavesMenu && m_kind !=
        EventCommandKind::Choice && m_kind != EventCommandKind::EndChoice;
}

// -------------------------------------------------------

bool EventCommand::isErasable() const {
    return m_kind != EventCommandKind::None && m_kind != EventCommandKind
        ::EndWhile && m_kind != EventCommandKind::Else && m_kind !=
        EventCommandKind::EndIf && m_kind != EventCommandKind::IfWin && m_kind
        != EventCommandKind::IfLose;
}

// -------------------------------------------------------

int EventCommand::getSongID(QStandardItemModel *parameters) const {
    QString idNumber;
    bool isIDNumber;
    int i, id;

    i = 0;
    isIDNumber = m_listCommand.at(i++) == RPM::TRUE_BOOL_STRING;
    idNumber = this->strNumber(i, parameters);
    id = m_listCommand.at(i++).toInt();

    return isIDNumber ? idNumber.toInt() : id;
}

// -------------------------------------------------------

int EventCommand::getChoicesNumber() const {
    QString next;
    int i, l, nb;

    i = 2;
    l = this->commandsCount();
    nb = 0;
    while (i < l) {
        next = m_listCommand.at(i);
        if (next == RPM::DASH) {
            m_listCommand.at(i++).toInt();
            i++;
            nb++;
        }
        i += 2;
    }

    return nb;
}

// -------------------------------------------------------

void EventCommand::getChoicesIDs(QList<int> &list) {
    QString next;
    int i, l;

    i = 2;
    l = this->commandsCount();
    while (i < l) {
        next = m_listCommand.at(i);
        if (next == RPM::DASH) {
            list.append(m_listCommand.at(++i).toInt());
        }
        i += 3;
    }
}

// -------------------------------------------------------

void EventCommand::setCopy(const EventCommand &copy) {
    m_kind = copy.m_kind;
    m_listCommand = copy.m_listCommand;
}

// -------------------------------------------------------

QString EventCommand::toString(SystemCommonObject *object, QStandardItemModel
    *parameters) const
{
    QString str;

    str = BEGINNING_COMMAND;
    switch (m_kind) {
    case EventCommandKind::ShowText:
        str += this->strShowText(object, parameters); break;
    case EventCommandKind::ChangeVariables:
        str += this->strChangeVariables(object, parameters); break;
    case EventCommandKind::EndGame:
        str += RPM::translate(Translations::GAME_OVER); break;
    case EventCommandKind::While:
        str += RPM::translate(Translations::LOOP); break;
    case EventCommandKind::EndWhile:
        str += RPM::translate(Translations::END_LOOP); break;
    case EventCommandKind::WhileBreak:
        str += RPM::translate(Translations::BREAK_LOOP); break;
    case EventCommandKind::InputNumber:
        str += strInputNumber(); break;
    case EventCommandKind::If:
        str += strCondition(object, parameters); break;
    case EventCommandKind::Else:
        str += RPM::translate(Translations::ELSE); break;
    case EventCommandKind::EndIf:
        str += RPM::translate(Translations::END_IF); break;
    case EventCommandKind::OpenMainMenu:
        str += RPM::translate(Translations::OPEN_MAIN_MENU); break;
    case EventCommandKind::OpenSavesMenu:
        str += RPM::translate(Translations::OPEN_SAVES_MENU); break;
    case EventCommandKind::ModifyInventory:
        str += this->strModifyInventory(); break;
    case EventCommandKind::ModifyTeam:
        str += this->strModifyTeam(parameters); break;
    case EventCommandKind::StartBattle:
        str += this->strStartBattle(parameters); break;
    case EventCommandKind::IfWin:
        str += RPM::translate(Translations::IF_WIN); break;
    case EventCommandKind::IfLose:
        str += RPM::translate(Translations::IF_LOSE); break;
    case EventCommandKind::ChangeState:
        str += this->strChangeState(object, parameters); break;
    case EventCommandKind::SendEvent:
        str += this->strSendEvent(object, parameters); break;
    case EventCommandKind::TeleportObject:
        str += this->strTeleportObject(object, parameters); break;
    case EventCommandKind::MoveObject:
        str += this->strMoveObject(object, parameters); break;
    case EventCommandKind::Wait:
        str += this->strWait(object, parameters); break;
    case EventCommandKind::MoveCamera:
        str += this->strMoveCamera(object, parameters); break;
    case EventCommandKind::PlayMusic:
        str += this->strPlayMusic(object, parameters); break;
    case EventCommandKind::StopMusic:
        str += this->strStopMusic(object, parameters); break;
    case EventCommandKind::PlayBackgroundSound:
        str += this->strPlayBackgroundSound(object, parameters); break;
    case EventCommandKind::StopBackgroundSound:
        str += this->strStopBackgroundSound(object, parameters); break;
    case EventCommandKind::PlayASound:
        str += this->strPlaySound(object, parameters); break;
    case EventCommandKind::PlayMusicEffect:
        str += this->strPlayMusicEffect(object, parameters); break;
    case EventCommandKind::ChangeProperty:
        str += this->strChangeProperty(object, parameters); break;
    case EventCommandKind::DisplayChoice:
        str += this->strDisplayChoice(object, parameters); break;
    case EventCommandKind::Choice:
        str += this->strChoice(); break;
    case EventCommandKind::EndChoice:
        str += RPM::translate(Translations::END_CHOICE); break;
    case EventCommandKind::Script:
        str += this->strScript(object, parameters); break;
    case EventCommandKind::DisplayAPicture:
        str += this->strDisplayAPicture(object, parameters); break;
    case EventCommandKind::SetMoveTurnAPicture:
        str += this->strSetMoveTurnAPicture(object, parameters); break;
    case EventCommandKind::RemoveAPicture:
        str += this->strRemoveAPicture(object, parameters); break;
    case EventCommandKind::SetDialogBoxOptions:
        str += this->strSetDialogBoxOptions(object, parameters); break;
    case EventCommandKind::TitleScreen:
        str += RPM::translate(Translations::TITLE_SCREEN); break;
    case EventCommandKind::ChangeScreenTone:
        str += this->strChangeScreenTone(object, parameters); break;
    case EventCommandKind::RemoveObjectFromMap:
        str += this->strRemoveObjectFromMap(object, parameters); break;
    case EventCommandKind::StopReaction:
        str += RPM::translate(Translations::STOP_REACTION); break;
    case EventCommandKind::AllowForbidSaves:
        str += this->strAllowForbidSaves(object, parameters); break;
    case EventCommandKind::AllowForbidMainMenu:
        str += this->strAllowForbidMainMenu(object, parameters); break;
    case EventCommandKind::CallACommonReaction:
        str += this->strCallACommonReaction(); break;
    case EventCommandKind::Label:
        str += this->strLabel(false, object, parameters); break;
    case EventCommandKind::JumpLabel:
        str += this->strLabel(true, object, parameters); break;
    case EventCommandKind::Comment:
        str += this->strComment(); break;
    case EventCommandKind::ChangeAStatistic:
        str += this->strChangeAStatistic(object, parameters); break;
    case EventCommandKind::ChangeASkill:
        str += this->strChangeASkill(object, parameters); break;
    case EventCommandKind::ChangeName:
        str += this->strChangeName(object, parameters); break;
    case EventCommandKind::ChangeEquipment:
        str += this->strChangeEquipment(object, parameters); break;
    case EventCommandKind::ModifyCurrency:
        str += this->strModifyCurrency(object, parameters); break;
    case EventCommandKind::DisplayAnAnimation:
        str += this->strDisplayAnAnimation(object, parameters); break;
    case EventCommandKind::ShakeScreen:
        str += this->strShakeScreen(object, parameters); break;
    case EventCommandKind::FlashScreen:
        str += this->strFlashScreen(object, parameters); break;
    default:
        break;
    }

    return str;
}

// -------------------------------------------------------

QString EventCommand::strNumberVariable(int &i) const {
    PrimitiveValueKind kind;
    int value;

    kind = static_cast<PrimitiveValueKind>(m_listCommand.at(i++).toInt());
    value = m_listCommand.at(i++).toInt();
    switch (kind) {
    case PrimitiveValueKind::Number:
        return QString::number(value);
    case PrimitiveValueKind::Variable:
        return RPM::translate(Translations::VARIABLE) + RPM::SPACE + RPM::get()
            ->project()->gameDatas()->variablesDatas()->getVariableById(value)
            ->toString();
    default:
        return "";
    }
}

// -------------------------------------------------------

QString EventCommand::strDataBaseId(int &i, SystemCommonObject *object,
    QStandardItemModel *dataBase, QStandardItemModel *parameters) const
{
    SuperListItem *super;
    PrimitiveValueKind kind;
    int value;

    kind = static_cast<PrimitiveValueKind>(m_listCommand.at(i++).toInt());
    value = m_listCommand.at(i++).toInt();
    switch (kind){
    case PrimitiveValueKind::Number:
        return QString::number(value);
    case PrimitiveValueKind::Variable:
        return RPM::translate(Translations::VARIABLE) + RPM::SPACE + RPM::get()
            ->project()->gameDatas()->variablesDatas()->getVariableById(value)
            ->toString();
    case PrimitiveValueKind::DataBase:
        super = SuperListItem::getById(dataBase->invisibleRootItem(), value);
        return super == nullptr ? "" : super->toString();
    case PrimitiveValueKind::Parameter:
        super = SuperListItem::getById(parameters->invisibleRootItem(), value);
        return super == nullptr ? "" : super->toString();
    case PrimitiveValueKind::Property:
        super = SuperListItem::getById(object->modelProperties()
            ->invisibleRootItem(), value);
        return super == nullptr ? "" : super->toString();
    default:
        return "";
    }
}

// -------------------------------------------------------

QString EventCommand::strProperty(int &i, SystemCommonObject *object,
    QStandardItemModel *parameters) const
{
    SuperListItem *super;
    PrimitiveValueKind kind;
    QString value;

    kind = static_cast<PrimitiveValueKind>(m_listCommand.at(i++).toInt());
    value = m_listCommand.at(i++);
    switch (kind){
    case PrimitiveValueKind::None:
        return RPM::translate(Translations::NONE);
    case PrimitiveValueKind::Number:
    case PrimitiveValueKind::NumberDouble:
    case PrimitiveValueKind::Message:
        return value;
    case PrimitiveValueKind::Switch:
        return value == RPM::TRUE_BOOL_STRING ? "ON" : "OFF";
    case PrimitiveValueKind::KeyBoard:
        super = SuperListItem::getById(RPM::get()->project()
            ->keyBoardDatas() ->model()->invisibleRootItem(), value.toInt());
        return RPM::translate(Translations::KEYBOARD) + RPM::SPACE + (super ==
            nullptr ? "" : super->toString());
    case PrimitiveValueKind::Variable:
        super = RPM::get()->project()->gameDatas()->variablesDatas()
            ->getVariableById(value.toInt());
        return RPM::translate(Translations::VARIABLE) + RPM::SPACE + (super ==
            nullptr ? "" : super->toString());
    case PrimitiveValueKind::Parameter:
        super = SuperListItem::getById(parameters->invisibleRootItem(), value
            .toInt());
        return RPM::translate(Translations::PARAMETER) + RPM::SPACE + (super ==
            nullptr ? "" : super->toString());
    case PrimitiveValueKind::Property:
        super = SuperListItem::getById(object->modelProperties()
            ->invisibleRootItem(), value.toInt());
        return RPM::translate(Translations::PROPERTY) + RPM::SPACE + (super ==
            nullptr ? "" : super->toString());
    default:
        return "";
    }
}

// -------------------------------------------------------

QString EventCommand::strNumber(int &i, QStandardItemModel *parameters) const {
    SuperListItem *super;
    PrimitiveValueKind kind;
    QString value;

    kind = static_cast<PrimitiveValueKind>(m_listCommand.at(i++).toInt());
    value = m_listCommand.at(i++);
    switch (kind) {
    case PrimitiveValueKind::Number:
        return value;
    case PrimitiveValueKind::NumberDouble:
        return QString::number(value.toDouble());
    case PrimitiveValueKind::Variable:
        super = RPM::get()->project()->gameDatas()
            ->variablesDatas()->getVariableById(value.toInt());
        return RPM::translate(Translations::VARIABLE) + RPM::SPACE + (super ==
            nullptr ? "" : super->toString());
    case PrimitiveValueKind::Parameter:
        super = SuperListItem::getById(parameters->invisibleRootItem(), value
            .toInt());
        return super == nullptr ? "" : super->toString();
    default:
        return "";
    }
}

// -------------------------------------------------------

QString EventCommand::strShowText(SystemCommonObject *object, QStandardItemModel
    *parameters) const
{
    QString interlocutor, text;
    int i;

    i = 0;
    interlocutor = this->strProperty(i, object, parameters);
    i++;
    text = m_listCommand.at(i++);

    return RPM::translate(Translations::SHOW_TEXT) + RPM::SPACE + RPM
        ::BRACKET_LEFT + interlocutor + RPM::BRACKET_RIGHT + RPM::COLON + RPM
        ::SPACE + text;
}

// -------------------------------------------------------

QString EventCommand::strChangeVariables(SystemCommonObject *object,
    QStandardItemModel *parameters) const
{
    QString selection, operation, value, checked;
    int i, index;

    i = 0;
    checked = m_listCommand.at(i++);
    if (!RPM::stringToBool(checked)) {
        selection += RPM::get()->project()->gameDatas()->variablesDatas()
            ->getVariableById(m_listCommand.at(i++).toInt())->toString();
    } else {
        selection += m_listCommand.at(i++);
        selection += RPM::SPACE + RPM::translate(Translations::TO).toLower() +
            RPM::SPACE;
        selection += m_listCommand.at(i++);
    }
    operation = this->strChangeVariablesOperation(i);
    index = m_listCommand.at(i++).toInt();
    switch (index) {
    case 0:
        value += this->strProperty(i, object, parameters);
        break;
    case 1:
        value += RPM::translate(Translations::RANDOM_NUMBER_BETWEEN).toLower() +
            RPM::SPACE;
        value += this->strProperty(i, object, parameters);
        value += RPM::SPACE + RPM::translate(Translations::AND).toLower() + RPM
            ::SPACE;
        value += this->strProperty(i, object, parameters);
        break;
    case 2:
        value += RPM::translate(Translations::MESSAGE).toLower() + RPM::SPACE +
            this->strProperty(i, object, parameters);
        break;
    case 3:
        value += RPM::translate(Translations::SWITCH).toLower() + RPM::SPACE +
            this->strProperty(i, object, parameters);
        break;
    case 4:
        value += RPM::translate(Translations::AN_OBJECT_IN_MAP).toLower() + RPM
            ::SPACE + this->strMoveObjectID(object, parameters, i) + RPM::SPACE
            + RPM::translate(Translations::CHARACTERISTIC).toLower() + RPM
            ::SPACE;
        value += RPM::ENUM_TO_STRING_VARIABLE_MAP_OBJECT_CHARACTERISTIC.at(
            m_listCommand.at(i++).toInt()).toLower();
        break;
    }

    return RPM::translate(Translations::CHANGE_VARIABLES).toLower() + RPM::COLON
        + RPM::SPACE + selection + RPM::SPACE + operation + RPM::SPACE + value;
}

// -------------------------------------------------------

QString EventCommand::strChangeVariablesOperation(int &i) const {
    QString operation, str;

    operation = m_listCommand.at(i++);
    if (operation == "0") {
        str += "=";
    } else if (operation == "1") {
        str += "+";
    } else if (operation == "2") {
        str += "-";
    } else if (operation == "3") {
        str += "*";
    } else if (operation == "4") {
        str += "/";
    } else if (operation == "5") {
        str += "%";
    }

    return str;
}

// -------------------------------------------------------

QString EventCommand::strInputNumber() const {
    return RPM::translate(Translations::INPUT_NUMBER_IN_VARIABLE) + RPM::SPACE +
        RPM::get()->project()->gameDatas()->variablesDatas()->getVariableById(
        m_listCommand.at(0).toInt())->toString();
}

// -------------------------------------------------------

QString EventCommand::strCondition(SystemCommonObject *object,
    QStandardItemModel *parameters) const
{
    QString condition;
    bool checked;
    int i, radioIndex, index;

    i = 1;
    radioIndex = m_listCommand.at(i++).toInt();
    switch (radioIndex) {
    case 0:
        condition = this->strConditionPageVariables(object, parameters, i,
            radioIndex);
        break;
    case 1: {
        index = m_listCommand.at(i++).toInt();
        condition += RPM::ENUM_TO_STRING_CONDITION_HEROES.at(index) + " ";
        if (index == static_cast<int>(ConditionHeroesKind
            ::TheHeroeWithInstanceID))
        {
            condition += this->strProperty(i, object, parameters);
        }
        checked = RPM::stringToBool(m_listCommand.at(i++));
        if (checked) {
            condition += RPM::translate(Translations::IN_MESSAGE).toLower() + RPM::SPACE
                + RPM::ENUM_TO_STRING_TEAM.at(m_listCommand.at(i++).toInt()) +
                RPM::SPACE;
        }
        switch (m_listCommand.at(i++).toInt()) {
        case 0:
            condition += RPM::translate(Translations::ARE_NAMED).toLower() + RPM
                ::SPACE + this->strProperty(i, object, parameters);
            break;
        case 1:
            condition += RPM::translate(Translations::ARE_IN).toLower() + RPM
                ::SPACE + RPM::ENUM_TO_STRING_TEAM.at(m_listCommand.at(i++)
                .toInt());
            break;
        case 2:
            condition += RPM::translate(Translations::ARE_ABLE_SKILL_ID)
                .toLower() + RPM::SPACE + this->strDataBaseId(i, object, RPM
                ::get()->project()->gameDatas()->skillsDatas()->model(),
                parameters);
            break;
        case 3:
            condition += RPM::translate(Translations::ARE_EQUIPED_WITH)
                .toLower() + RPM::SPACE;
            switch (m_listCommand.at(i++).toInt()) {
            case 0:
                condition += RPM::translate(Translations::WEAPON_ID).toLower() +
                    RPM::SPACE + this->strDataBaseId(i, object, RPM::get()
                    ->project()->gameDatas()->weaponsDatas()->model(),
                    parameters);
                break;
            case 1:
                condition += RPM::translate(Translations::ARMOR_ID).toLower() +
                    RPM::SPACE + this->strDataBaseId(i, object, RPM::get()
                    ->project()->gameDatas()->armorsDatas()->model(), parameters);
                break;
            }
            break;
        case 4:
            condition += RPM::translate(Translations::ARE_UNDER_EFFECT_STATUS_ID
                ).toLower() + RPM::SPACE + this->strDataBaseId(i, object, RPM
                ::get()->project()->gameDatas()->statusDatas()->model(),
                parameters);
            break;
        case 5:
            condition += RPM::translate(Translations::HAVE_STATISTIC_ID)
                .toLower() + RPM::SPACE + this->strDataBaseId(i, object, RPM
                ::get()->project()->gameDatas()->battleSystemDatas()
                ->modelCommonStatistics(), parameters);
            condition += " " + RPM::ENUM_TO_STRING_OPERATION.at(m_listCommand
                .at(i++).toInt()) + " ";
            condition += this->strProperty(i, object, parameters);
            break;
        }
        break;
    }
    case 2: {
        condition =+ "" + RPM::translate(Translations::CURRENCY_ID) + RPM::COLON
            + RPM::SPACE + this->strDataBaseId(i, object, RPM::get()->project()
            ->gameDatas()->systemDatas()->modelCurrencies(), parameters);
        condition += " " + RPM::ENUM_TO_STRING_OPERATION.at(m_listCommand.at(i++
            ).toInt()) + " ";
        condition += this->strProperty(i, object, parameters);
        break;
    }
    case 3: {
        condition =+ "" + RPM::translate(Translations::ITEM_ID) + RPM::COLON +
            RPM::SPACE + this->strDataBaseId(i, object, RPM::get()->project()
            ->gameDatas()->itemsDatas()->model(), parameters);
        condition += " " + RPM::ENUM_TO_STRING_OPERATION.at(m_listCommand.at(i++
            ).toInt()) + " ";
        condition += this->strProperty(i, object, parameters);
        break;
    }
    case 4: {
        condition =+ "" + RPM::translate(Translations::WEAPON_ID) + RPM::COLON +
            RPM::SPACE + this->strDataBaseId(i, object, RPM::get()->project()
            ->gameDatas()->weaponsDatas()->model(), parameters);
        condition += " " + RPM::ENUM_TO_STRING_OPERATION.at(m_listCommand.at(i++
            ).toInt()) + " ";
        condition += this->strProperty(i, object, parameters);
        if (RPM::stringToBool(m_listCommand.at(i++))) {
            condition += RPM::SPACE + RPM::PLUS + RPM::SPACE + RPM::translate(
                Translations::CHECK_WEAPONS_EQUIPED_TOO).toLower();
        }
        break;
    }
    case 5: {
        condition =+ "" + RPM::translate(Translations::ARMOR_ID) + RPM::COLON +
            RPM::SPACE + this->strDataBaseId(i, object, RPM::get()->project()
            ->gameDatas()->armorsDatas()->model(), parameters);
        condition += " " + RPM::ENUM_TO_STRING_OPERATION.at(m_listCommand.at(i++
            ).toInt()) + " ";
        condition += this->strProperty(i, object, parameters);
        if (RPM::stringToBool(m_listCommand.at(i++))) {
            condition += RPM::SPACE + RPM::PLUS + RPM::SPACE + RPM::translate(
                Translations::CHECK_ARMORS_EQUIPED_TOO);
        }
        break;
    }
    case 6: {
        condition += RPM::translate(Translations::KEY_ID) + RPM::COLON + RPM
            ::SPACE + this->strDataBaseId(i, object, RPM::get()->project()
            ->keyBoardDatas()->model(), parameters) + RPM::SPACE + RPM
            ::translate(Translations::IS).toLower() + RPM::SPACE;
        condition += this->strProperty(i, object, parameters);
        break;
    }
    case 7: {
        condition += RPM::translate(Translations::SCRIPT) + RPM::COLON + RPM
            ::SPACE + this->strProperty(i, object, parameters);
        break;
    }
    case 8: {
        condition += RPM::translate(Translations::ESCAPED_LAST_BATTLE);
        break;
    }
    default:
        break;
    }
    return RPM::translate(Translations::IF) + RPM::SPACE + RPM::PARENTHESIS_LEFT
        + condition + RPM::PARENTHESIS_RIGHT;
}

// -------------------------------------------------------

QString EventCommand::strConditionPageVariables(SystemCommonObject *object,
    QStandardItemModel *parameters, int &i, int radioIndex) const
{
    QString condition, operation;

    switch (radioIndex) {
    case 0:
        condition = this->strProperty(i, object, parameters);
        operation = RPM::ENUM_TO_STRING_OPERATION.at(m_listCommand.at(i++).toInt());
        condition += " " + operation + " ";
        condition += this->strProperty(i, object, parameters);
        break;
    }

    return condition;
}

// -------------------------------------------------------

QString EventCommand::strModifyInventory() const {
    QString selection, operation ,number;
    int i;

    i = 0;
    selection = this->strModifyInventorySelection(i);
    operation = this->strChangeVariablesOperation(i);
    number = this->strNumberVariable(i);

    return RPM::translate(Translations::MODIFY_INVENTORY) + RPM::COLON + RPM
        ::SPACE + selection + RPM::SPACE + operation + RPM::SPACE + number;
}

// -------------------------------------------------------

QString EventCommand::strModifyInventorySelection(int &i) const {
    QStandardItem *item;
    QString selection;
    int objectType, objectID;

    // Object type
    objectType = m_listCommand.at(i++).toInt();
    switch(objectType) {
    case 0:
        selection += RPM::translate(Translations::ITEM_ID).toLower() + RPM
            ::SPACE;
        break;
    case 1:
        selection += RPM::translate(Translations::WEAPON_ID).toLower() + RPM
            ::SPACE;
        break;
    case 2:
        selection += RPM::translate(Translations::ARMOR_ID).toLower() + RPM
            ::SPACE;
        break;
    }

    // ID of the object
    objectID = m_listCommand.at(i++).toInt();
    item = nullptr;
    switch(objectType) {
    case 0:
        item = RPM::get()->project()->gameDatas()->itemsDatas()->model()
            ->invisibleRootItem();
        break;
    case 1:
        item = RPM::get()->project()->gameDatas()->weaponsDatas()->model()
            ->invisibleRootItem();
        break;
    case 2:
        item = RPM::get()->project()->gameDatas()->armorsDatas()->model()
            ->invisibleRootItem();
        break;
    }
    selection += SuperListItem::getById(item, objectID)->toString();

    return selection;
}

// -------------------------------------------------------

QString EventCommand::strModifyTeam(QStandardItemModel *parameters) const {
    QString operation;
    int i, kind;

    i = 0;
    kind = m_listCommand.at(i++).toInt();
    if (kind == 0) {
        operation += this->strModifyTeamInstance(i, parameters);
    } else if (kind == 1) {
        operation += this->strModifyTeamMoveDelete(i, parameters);
    }

    return RPM::translate(Translations::MODIFY_TEAM) + RPM::COLON + RPM::SPACE
        + operation;
}

// -------------------------------------------------------

QString EventCommand::strModifyTeamInstance(int &i, QStandardItemModel
    *parameters) const
{
    QString level, teamNew, stockVariable, character;
    int kindNew, idNew;

    level = this->strNumber(i, parameters);
    teamNew = RPM::ENUM_TO_STRING_TEAM.at(m_listCommand.at(i++).toInt()).toLower();
    stockVariable = RPM::get()->project()->gameDatas()->variablesDatas()
        ->getVariableById(m_listCommand.at(i++).toInt())->toString();
    kindNew = m_listCommand.at(i++).toInt();
    idNew = m_listCommand.at(i++).toInt();
    if (kindNew == 0) {
        character += RPM::translate(Translations::HERO).toLower() + RPM::SPACE +
            SuperListItem::getById(RPM::get()->project()->gameDatas()
            ->heroesDatas()->model()->invisibleRootItem(), idNew)->toString();
    } else if (kindNew == 1) {
        character += RPM::translate(Translations::MONSTER).toLower() + RPM
            ::SPACE;
    }

    return RPM::translate(Translations::CREATE_NEW_INSTANCE_WITH_LEVEL)
        .toLower() + RPM::SPACE + level + RPM::SPACE + RPM::translate(
        Translations::IN_MESSAGE).toLower() + RPM::SPACE + teamNew + RPM::SPACE + RPM
        ::translate(Translations::OF).toLower() + RPM::SPACE + character + RPM
        ::SPACE + RPM::translate(Translations::AND_STOCK_IN_VARIABLE) + RPM
        ::SPACE + stockVariable;
}

// -------------------------------------------------------

QString EventCommand::strModifyTeamMoveDelete(int &i, QStandardItemModel
    *parameters) const
{
    QString addRemove, characterID, addRemoveTeam;

    addRemove = m_listCommand.at(i++).toInt() == 0 ? "move" : "remove";
    characterID = this->strNumber(i, parameters);
    addRemoveTeam = RPM::ENUM_TO_STRING_TEAM.at(m_listCommand.at(i++).toInt());

    return addRemove + " the character with id " + characterID + " in " +
        addRemoveTeam;
}

// -------------------------------------------------------

QString EventCommand::strStartBattle(QStandardItemModel *parameters) const {
    QString options, troop, battleMap, transition;
    int i;

    i = 0;
    options = this->strStartBattleOptions(i);
    troop = this->strStartBattleTroop(parameters, i);
    battleMap = this->strStartBattleMap(parameters, i);
    transition = this->strStartBattleTransition(parameters, i);

    return RPM::translate(Translations::START_BATTLE) + RPM::COLON + RPM::SPACE
        + RPM::translate(Translations::TROOP).toLower() + RPM::SPACE + troop +
        RPM::SPACE + RPM::translate(Translations::WITH_BATTLE_MAP).toLower() +
        RPM::SPACE + battleMap + transition + RPM::NEW_LINE + RPM::NEW_LINE +
        options;
}

// -------------------------------------------------------

QString EventCommand::strStartBattleTroop(QStandardItemModel *parameters, int
    &i) const
{
    int kind;

    kind = m_listCommand.at(i++).toInt();
    switch(kind) {
    case 0:
        return RPM::translate(Translations::WITH_ID).toLower() + RPM::SPACE +
            this->strDataBaseId(i, nullptr, RPM::get()->project()->gameDatas()
            ->troopsDatas()->model(), parameters);
    case 1:
        return RPM::translate(Translations::RANDOM).toLower() + RPM::SPACE + RPM
            ::PARENTHESIS_LEFT + RPM::translate(Translations::IN_MAP_PROPERTY) +
            RPM::PARENTHESIS_RIGHT;
    }

    return "";
}

// -------------------------------------------------------

QString EventCommand::strStartBattleMap(QStandardItemModel *parameters, int &i)
    const
{
    QString id, x, y, yPlus, z;
    int kind;

    kind = m_listCommand.at(i++).toInt();
    switch (kind) {
    case 0:
        return this->strDataBaseId(i, nullptr, RPM::get()->project()->gameDatas()
            ->battleSystemDatas()->modelBattleMaps(), parameters);
    case 1:
        id = m_listCommand.at(i++);
        x = m_listCommand.at(i++);
        y = m_listCommand.at(i++);
        yPlus = m_listCommand.at(i++);
        z = m_listCommand.at(i++);
        break;
    case 2:
        id = this->strNumber(i, parameters);
        x = this->strNumber(i, parameters);
        y = this->strNumber(i, parameters);
        yPlus = this->strNumber(i, parameters);
        z = this->strNumber(i, parameters);
        break;
    }

    return "\n\t" + RPM::translate(Translations::MAP_ID) + RPM::COLON + RPM
        ::SPACE + id + RPM::NEW_LINE + "\t" + RPM::translate(Translations::X) +
        RPM::COLON + RPM::SPACE + x + RPM::NEW_LINE + "\t" + RPM::translate(
        Translations::Y) + RPM::COLON + RPM::SPACE + y + RPM::NEW_LINE + "\t" +
        RPM::translate(Translations::Y_PLUS) + RPM::COLON + RPM::SPACE + yPlus +
        RPM::NEW_LINE + "\t" + RPM::translate(Translations::Z)+ RPM::COLON + RPM
        ::SPACE + z;
}

// -------------------------------------------------------

QString EventCommand::strStartBattleOptions(int &i) const {
    QStringList listOptions;
    QString strOptions;

    strOptions = RPM::BRACKET_LEFT;
    if (m_listCommand.at(i++) == RPM::TRUE_BOOL_STRING) {
        listOptions << RPM::translate(Translations::ALLOW_ESCAPE);
    }
    if (m_listCommand.at(i++) == RPM::TRUE_BOOL_STRING) {
        listOptions << RPM::translate(Translations::DEFEAT_CAUSES_GAME_OVER);
    }
    strOptions += listOptions.join(";");
    strOptions += RPM::BRACKET_RIGHT;

    return strOptions;
}

// -------------------------------------------------------

QString EventCommand::strStartBattleTransition(QStandardItemModel *parameters,
    int &i) const
{
    QString transition;
    int type;

    transition = RPM::SPACE + RPM::translate(Translations::WITH_TRANSITION)
        .toLower() + RPM::SPACE;
    type = m_listCommand.at(i++).toInt();
    transition += this->strStartBattleTransitionType(parameters, i, type, RPM
        ::translate(Translations::FADE_IN_ONLY).toLower());
    transition += RPM::SPACE + RPM::translate(Translations::AND_THEN) + RPM
        ::SPACE;
    type = m_listCommand.at(i++).toInt();
    transition += this->strStartBattleTransitionType(parameters, i, type, RPM
        ::translate(Translations::FADE_OUT_ONLY).toLower());

    return transition;
}

// -------------------------------------------------------

QString EventCommand::strStartBattleTransitionType(QStandardItemModel
    *parameters, int &i, int type, QString name) const
{
    QString transition;

    switch (type) {
    case 0:
        transition += RPM::translate(Translations::NONE).toLower();
        break;
    case 1:
        transition += RPM::translate(Translations::FADE).toLower() + RPM::SPACE
            + name + RPM::SPACE + strDataBaseId(i, nullptr, RPM::get()
            ->project()->gameDatas()->systemDatas()->modelColors(), parameters);
        break;
    case 2:
        transition += RPM::translate(Translations::ZOOM).toLower() + RPM::SPACE
            + name;
        break;
    }

    return transition;
}

// -------------------------------------------------------

QString EventCommand::strChangeState(SystemCommonObject *object,
    QStandardItemModel *parameters) const
{
    QStandardItemModel *modelDataBase;
    QString value, operation;
    int i;

    i = 0;
    modelDataBase = nullptr;
    if (object != nullptr) {
        modelDataBase = object->modelStates();
    }

    value = this->strDataBaseId(i, object, modelDataBase, parameters);
    operation = this->strChangeStateOperation(i);

    return RPM::translate(Translations::CHANGE_STATE) + RPM::COLON + RPM::SPACE
        + operation + value;
}

// -------------------------------------------------------

QString EventCommand::strChangeStateOperation(int &i) const {
    QString str;
    int operation;

    operation = m_listCommand.at(i++).toInt();
    switch (operation) {
    case 0:
        str += RPM::translate(Translations::PASS_INTO).toLower();
        break;
    case 1:
        str += RPM::translate(Translations::ADD).toLower();
        break;
    case 2:
        str += RPM::translate(Translations::REMOVE).toLower(); break;
    }
    str += RPM::SPACE + RPM::translate(Translations::STATE_ID).toLower() + RPM
        ::SPACE;

    return str;
}

// -------------------------------------------------------

QString EventCommand::strSendEvent(SystemCommonObject *object,
    QStandardItemModel *parameters) const
{
    QStandardItemModel *model;
    SystemObjectEvent *e;
    QString target, event;
    int i = 0;

    target = strSendEventTarget(object, parameters, i);
    e = SystemObjectEvent::getCommandEvent(this, i);
    model = e->isSystem() ? RPM::get()->project()->gameDatas()
        ->commonEventsDatas()->modelEventsSystem() : RPM::get()->project()
        ->gameDatas()->commonEventsDatas()->modelEventsUser();
    e->setName(SuperListItem::getById(model->invisibleRootItem(), e->id())
        ->name());
    e->updateParameters();
    event = e->getLabelTab();
    delete e;

    return RPM::translate(Translations::SEND_EVENT) + RPM::COLON + RPM::SPACE +
        RPM::translate(Translations::TO).toLower() + RPM::SPACE + target + RPM
        ::SPACE + RPM::translate(Translations::WITH_EVENT).toLower() + RPM
        ::SPACE + event;
}

// -------------------------------------------------------

QString EventCommand::strSendEventTarget(SystemCommonObject *object,
    QStandardItemModel *parameters, int &i) const
{
    QString str;
    int index;

    index = m_listCommand.at(i++).toInt();
    switch (index) {
    case 0:
        str += RPM::translate(Translations::ALL).toLower();
        break;
    case 1:
        str += RPM::translate(Translations::DETECTION).toLower() + RPM::SPACE +
            this->strDataBaseId(i, object, RPM::get()->project()->gameDatas()
            ->systemDatas()->modelDetections(), parameters);
        if (m_listCommand.at(i++) == RPM::TRUE_BOOL_STRING) {
            str += RPM::SPACE + RPM::PARENTHESIS_LEFT + RPM::translate(
                Translations::SENDER_CANT_RECEIVE).toLower() + RPM
                ::PARENTHESIS_RIGHT;
        }
        break;
    case 2:
        str += RPM::translate(Translations::OBJECT).toLower() + RPM::SPACE +
            this->strMoveObjectID(object, parameters, i);
        break;
    }

    return str;
}

// -------------------------------------------------------

QString EventCommand::strTeleportObject(SystemCommonObject *object,
    QStandardItemModel *parameters) const
{
    QString strObj, strPosition, strOptions;
    int i;

    i = 0;
    strObj = this->strMoveObjectID(object, parameters, i);
    strPosition = this->strTeleportObjectPosition(object, parameters, i);
    strOptions = this->strTeleportObjectOptions(i);

    return RPM::translate(Translations::TELEPORT_OBJECT) + RPM::COLON + RPM
        ::SPACE + strObj + RPM::SPACE + RPM::translate(Translations
        ::TO_THE_COORDINATES).toLower() + RPM::NEW_LINE + strOptions + RPM
        ::NEW_LINE + strPosition;
}

// -------------------------------------------------------

QString EventCommand::strTeleportObjectPosition(SystemCommonObject *object,
    QStandardItemModel *parameters, int &i) const
{
    QString id, x, y, yPlus, z;
    int kind;

    kind = m_listCommand.at(i++).toInt();
    if (kind == 0 || kind == 1) {
        switch (kind) {
        case 0:
            id = m_listCommand.at(i++);
            x = m_listCommand.at(i++);
            y = m_listCommand.at(i++);
            yPlus = m_listCommand.at(i++);
            z = m_listCommand.at(i++);
            break;
        case 1:
            id = this->strNumber(i, parameters);
            x = this->strNumber(i, parameters);
            y = this->strNumber(i, parameters);
            yPlus = this->strNumber(i, parameters);
            z = this->strNumber(i, parameters);
            break;
        }

        return "\t" + RPM::translate(Translations::MAP_ID) + RPM::COLON + RPM
            ::SPACE + id + RPM::NEW_LINE + "\t" + RPM::translate(Translations::X) +
            RPM::COLON + RPM::SPACE + x + RPM::NEW_LINE + "\t" + RPM::translate(
            Translations::Y) + RPM::COLON + RPM::SPACE + y + RPM::NEW_LINE + "\t" +
            RPM::translate(Translations::Y_PLUS) + RPM::COLON + RPM::SPACE + yPlus +
            RPM::NEW_LINE + "\t" + RPM::translate(Translations::Z)+ RPM::COLON + RPM
            ::SPACE + z;
    }

    return "\t" + this->strMoveObjectID(object, parameters, i) + RPM::SPACE +
        RPM::translate(Translations::COORDINATES).toLower();
}

// -------------------------------------------------------

QString EventCommand::strTeleportObjectOptions(int &i) const {
    QStringList listOptions;
    QString strOptions, str;

    strOptions = RPM::BRACKET_LEFT;
    str = RPM::translate(Translations::DIRECTION) + RPM::COLON;
    switch (m_listCommand.at(i++).toInt()) {
    case 0:
        listOptions << str + RPM::translate(Translations::UNCHANGED); break;
    case 1:
        listOptions << str + RPM::translate(Translations::NORTH); break;
    case 2:
        listOptions << str + RPM::translate(Translations::SOUTH); break;
    case 3:
        listOptions << str + RPM::translate(Translations::WEST); break;
    case 4:
        listOptions << str + RPM::translate(Translations::EAST); break;
    case 5:
        listOptions << str + RPM::translate(Translations::NORTH_WEST); break;
    case 6:
        listOptions << str + RPM::translate(Translations::NORTH_EAST); break;
    case 7:
        listOptions << str + RPM::translate(Translations::SOUTH_WEST); break;
    case 8:
        listOptions << str + RPM::translate(Translations::SOUTH_EAST); break;
    }
    str = RPM::translate(Translations::SHADING_BEFORE) + RPM::COLON;
    listOptions << ((m_listCommand.at(i++) == "0") ? "ON" : "OFF");
    str = RPM::translate(Translations::SHADING_AFTER) + RPM::COLON;
    listOptions << ((m_listCommand.at(i++) == "0") ? "ON" : "OFF");
    strOptions += listOptions.join(";");
    strOptions += RPM::BRACKET_RIGHT;

    return strOptions;
}

// -------------------------------------------------------

QString EventCommand::strMoveObject(SystemCommonObject *object,
    QStandardItemModel *parameters) const
{
    QString strObj, strOptions, strMoves;
    int i;

    i = 0;
    strObj = this->strMoveObjectID(object, parameters, i);
    strOptions = this->strMoveObjectOptions(i);
    strMoves = this->strMoveObjectMoves(i);

    return RPM::translate(Translations::MOVE_OBJECT) + RPM::COLON + RPM::SPACE +
        strObj + RPM::NEW_LINE + strOptions + strMoves;
}

// -------------------------------------------------------

QString EventCommand::strMoveObjectID(SystemCommonObject *object,
    QStandardItemModel *parameters, int &i) const
{
    QStandardItemModel *modelObjects;
    QString strObj;

    if (RPM::isInConfig && !RPM::isInObjectConfig) {
        modelObjects = new QStandardItemModel;
        Map::setModelObjects(modelObjects);
    } else {
        modelObjects = RPM::get()->project()->currentMap(true)->modelObjects();
    }
    strObj = this->strDataBaseId(i, object, modelObjects, parameters);

    if (RPM::isInConfig && !RPM::isInObjectConfig) {
        SuperListItem::deleteModel(modelObjects);
    }

    return strObj;
}

// -------------------------------------------------------

QString EventCommand::strMoveObjectOptions(int &i) const {
    QStringList listOptions;
    QString strOptions;

    strOptions = RPM::BRACKET_LEFT;
    if (m_listCommand.at(i++) == RPM::TRUE_BOOL_STRING) {
        listOptions << RPM::translate(Translations::IGNORE_IF_IMPOSSIBLE);
    }
    if (m_listCommand.at(i++) == RPM::TRUE_BOOL_STRING) {
        listOptions << RPM::translate(Translations::WAIT_END);
    }
    if (m_listCommand.at(i++) == RPM::TRUE_BOOL_STRING) {
        listOptions << RPM::translate(Translations::CAMERA_ORIENTATION);
    }
    strOptions += listOptions.join(";");
    strOptions += RPM::BRACKET_RIGHT;

    return strOptions;
}

// -------------------------------------------------------

QString EventCommand::strMoveObjectMoves(int &i) const {
    SystemCommandMove move;
    QString strMoves;

    while(i < commandsCount()) {
        move = SystemCommandMove();
        strMoves += "\n";
        move.initialize(this, i);
        strMoves += "\t" + move.toString();
    }

    return strMoves;
}

// -------------------------------------------------------

QString EventCommand::strWait(SystemCommonObject *object, QStandardItemModel
    *parameters) const
{
    int i = 0;

    return RPM::translate(Translations::WAIT) + RPM::COLON + RPM::SPACE + this
        ->strProperty(i, object, parameters) + RPM::SPACE + RPM::translate(
        Translations::SECONDS);
}

// -------------------------------------------------------

QString EventCommand::strMoveCamera(SystemCommonObject *object,
    QStandardItemModel *parameters) const
{
    QString target, operation, move, rotation, zoom, options;
    int i;

    i = 0;
    target = this->strMoveCameraTarget(object, parameters, i);
    operation = this->strChangeVariablesOperation(i);
    move = this->strMoveCameraMove(parameters, i, operation);
    rotation = this->strMoveCameraRotation(parameters, i, operation);
    zoom = this->strMoveCameraZoom(parameters, i, operation);
    options = this->strMoveCameraOptions(parameters, i);

    return RPM::translate(Translations::MOVE_CAMERA) + RPM::COLON +  RPM
        ::NEW_LINE + RPM::translate(Translations::TARGET) + RPM::COLON + RPM
        ::SPACE + target + RPM::NEW_LINE + RPM::translate(Translations::MOVE) +
        RPM::COLON + RPM::SPACE + move + RPM::NEW_LINE + RPM::translate(
        Translations::ROTATION) + RPM::COLON + RPM::SPACE + rotation + RPM
        ::NEW_LINE + RPM::translate(Translations::ZOOM) + RPM::COLON + RPM
        ::SPACE + zoom + RPM::NEW_LINE + options;
}

// -------------------------------------------------------

QString EventCommand::strMoveCameraTarget(SystemCommonObject *object,
    QStandardItemModel *parameters, int &i) const
{
    int targetKind;

    targetKind = m_listCommand.at(i++).toInt();
    switch (targetKind) {
    case 0:
        return RPM::translate(Translations::UNCHANGED);
    case 1:
        return RPM::translate(Translations::OBJECT) + RPM::SPACE + this
            ->strMoveObjectID(object, parameters, i);
    }

    return "";
}

// -------------------------------------------------------

QString EventCommand::strMoveCameraMove(QStandardItemModel *parameters, int &i,
    QString &operation) const
{
    QStringList listOptions;
    QString strOptions, x, y, z;
    // Options
    strOptions = RPM::BRACKET_LEFT;
    if (m_listCommand.at(i++) == RPM::TRUE_BOOL_STRING) {
        listOptions << RPM::translate(Translations::OFFSET);
    }
    if (m_listCommand.at(i++) == RPM::TRUE_BOOL_STRING) {
        listOptions << RPM::translate(Translations::CAMERA_ORIENTATION);
    }
    strOptions += listOptions.join(";");
    strOptions += RPM::BRACKET_RIGHT;

    // Moves
    x = operation + this->strNumber(i, parameters) + RPM::SPACE;
    x += (m_listCommand.at(i++).toInt() == 0 ? RPM::translate(Translations
        ::SQUARE_S) : RPM::translate(Translations::PIXEL_S));
    y = operation + this->strNumber(i, parameters) + RPM::SPACE;
    y += (m_listCommand.at(i++).toInt() == 0 ? RPM::translate(Translations
        ::SQUARE_S) : RPM::translate(Translations::PIXEL_S));
    z = operation + this->strNumber(i, parameters) + RPM::SPACE;
    z += (m_listCommand.at(i++).toInt() == 0 ? RPM::translate(Translations
        ::SQUARE_S) : RPM::translate(Translations::PIXEL_S));

    return RPM::translate(Translations::X) + RPM::COLON + RPM::SPACE + x + ";" +
        RPM::SPACE + RPM::translate(Translations::Y) + RPM::COLON + RPM::SPACE +
        y + ";" + RPM::SPACE + RPM::translate(Translations::Z) + RPM::COLON +
        RPM::SPACE + z + RPM::SPACE + strOptions;
}

// -------------------------------------------------------

QString EventCommand::strMoveCameraRotation(QStandardItemModel *parameters, int
    &i, QString &operation) const
{
    QStringList listOptions;
    QString strOptions, h, v;

    // Options
    strOptions = RPM::BRACKET_LEFT;
    if (m_listCommand.at(i++) == RPM::TRUE_BOOL_STRING) {
        listOptions << RPM::translate(Translations::OFFSET);
    }
    strOptions += listOptions.join(";");
    strOptions += RPM::BRACKET_RIGHT;

    // Rotation
    h = operation + this->strNumber(i, parameters) + "°";
    v = operation + this->strNumber(i, parameters) + "°";

    return RPM::translate(Translations::HORIZONTAL_SHORT) + RPM::COLON + RPM
        ::SPACE + h + ";" + RPM::SPACE + RPM::translate(Translations
        ::VERTICAL_SHORT) + RPM::COLON + RPM::SPACE + v + RPM::SPACE +
        strOptions;
}

// -------------------------------------------------------

QString EventCommand::strMoveCameraZoom(QStandardItemModel *parameters, int &i,
    QString &operation) const
{
    return RPM::translate(Translations::DISTANCE) + RPM::COLON + RPM::SPACE +
        operation + this->strNumber(i, parameters);
}

// -------------------------------------------------------

QString EventCommand::strMoveCameraOptions(QStandardItemModel *parameters, int
    &i) const
{
    QString str;

    if (m_listCommand.at(i++) == RPM::TRUE_BOOL_STRING) {
        str += RPM::BRACKET_LEFT + RPM::translate(Translations::WAIT_END) + RPM
            ::BRACKET_RIGHT;
    }
    str += RPM::translate(Translations::TIME) + RPM::COLON + RPM::SPACE + this
        ->strNumber(i, parameters) + RPM::SPACE + RPM::translate(Translations
        ::SECONDS);

    return str;
}

// -------------------------------------------------------

QString EventCommand::strPlaySong(SystemCommonObject*, QStandardItemModel
    *parameters, SongKind kind) const
{
    QString idNumber, id, volume, start, end;
    bool isIDNumber, isStart, isEnd;
    int i;

    i = 0;
    isIDNumber = m_listCommand.at(i++) == RPM::TRUE_BOOL_STRING;
    idNumber = this->strNumber(i, parameters);
    id = SuperListItem::getById(RPM::get()->project()->songsDatas()->model(kind)
        ->invisibleRootItem(), m_listCommand.at(i++).toInt())->toString();
    volume = this->strNumber(i, parameters);
    isStart = m_listCommand.at(i++) == RPM::TRUE_BOOL_STRING;
    start = this->strNumber(i, parameters);
    isEnd = m_listCommand.at(i++) == RPM::TRUE_BOOL_STRING;
    end = this->strNumber(i, parameters);

    return (isIDNumber ? RPM::translate(Translations::WITH_ID).toLower() + RPM
        ::SPACE + idNumber : id) + RPM::SPACE + RPM::translate(Translations
        ::WITH_VOLUME).toLower() + RPM::COLON + RPM::SPACE + volume + (isStart ?
        RPM::NEW_LINE + RPM::translate(Translations::START) + RPM::COLON + RPM
        ::SPACE + start : "") + (isEnd ? RPM::NEW_LINE + RPM::translate(
        Translations::END) + RPM::COLON + RPM::SPACE + end : "");
}

QString EventCommand::strPlayMusic(SystemCommonObject *object,
    QStandardItemModel *parameters) const
{
    return RPM::translate(Translations::PLAY_MUSIC) + RPM::COLON + RPM::SPACE +
        this->strPlaySong(object, parameters, SongKind::Music);
}

// -------------------------------------------------------

QString EventCommand::strPlayBackgroundSound(SystemCommonObject *object,
    QStandardItemModel *parameters) const
{
    return RPM::translate(Translations::PLAY_BACKGROUND_SOUND) + RPM::COLON +
        RPM::SPACE + this->strPlaySong(object, parameters, SongKind
        ::BackgroundSound);
}

// -------------------------------------------------------

QString EventCommand::strPlaySound(SystemCommonObject *object,
    QStandardItemModel *parameters) const
{
    return RPM::translate(Translations::PLAY_A_SOUND) + RPM::COLON + RPM::SPACE
        + this->strPlaySong(object, parameters, SongKind::Sound);
}

// -------------------------------------------------------

QString EventCommand::strPlayMusicEffect(SystemCommonObject *object,
    QStandardItemModel *parameters) const
{
    return RPM::translate(Translations::PLAY_MUSIC_EFFECT) + RPM::COLON + RPM
        ::SPACE + this->strPlaySong(object, parameters, SongKind::MusicEffect);
}

// -------------------------------------------------------

QString EventCommand::strStopSong(SystemCommonObject*, QStandardItemModel
    *parameters) const
{
    int i = 0;
    return this->strNumber(i, parameters) + RPM::SPACE + RPM::translate(
        Translations::SECONDS);
}

QString EventCommand::strStopMusic(SystemCommonObject *object,
    QStandardItemModel *parameters) const
{
    return RPM::translate(Translations::STOP_MUSIC) + RPM::COLON + RPM::SPACE +
        this->strStopSong(object, parameters);
}

// -------------------------------------------------------

QString EventCommand::strStopBackgroundSound(SystemCommonObject *object,
    QStandardItemModel *parameters) const
{
    return RPM::translate(Translations::STOP_BACKGROUND_SOUND) + RPM::COLON +
        RPM::SPACE + this->strStopSong(object, parameters);
}

// -------------------------------------------------------

QString EventCommand::strChangeProperty(SystemCommonObject *object,
    QStandardItemModel *parameters) const
{
    QString propertyID, operation, newValue;
    int i;

    i = 0;
    propertyID = this->strDataBaseId(i, object, object->modelProperties(),
        parameters);
    operation = this->strChangeVariablesOperation(i);
    newValue = this->strProperty(i, object, parameters);

    return RPM::translate(Translations::CHANGE_PROPERTY) + RPM::COLON + RPM
        ::SPACE + RPM::translate(Translations::PROPERTY_ID).toLower() + RPM
        ::SPACE + propertyID + RPM::SPACE + operation + RPM::SPACE + newValue;
}

// -------------------------------------------------------

QString EventCommand::strDisplayChoice(SystemCommonObject *object,
    QStandardItemModel *parameters) const
{
    QStringList choices;
    QString cancelIndex, next;
    SystemLang *lang;
    int i, l;

    i = 0;
    l = this->commandsCount();
    cancelIndex = this->strProperty(i, object, parameters);
    lang = nullptr;
    while (i < l) {
        next = m_listCommand.at(i);
        if (next == RPM::DASH) {
            i += 2;
            if (lang != nullptr) {
                choices << " - " + lang->name();
                delete lang;
            }
            lang = new SystemLang;
        }
        lang->initializeCommand(this, i);
    }
    if (lang != nullptr) {
        choices << " - " + lang->name();
        delete lang;
    }

    return RPM::translate(Translations::DISPLAY_CHOICES) + RPM::COLON + RPM
        ::SPACE + RPM::BRACKET_LEFT + RPM::translate(Translations
        ::CANCEL_AUTO_INDEX).toLower() + RPM::EQUAL + cancelIndex + RPM
        ::BRACKET_RIGHT + RPM::NEW_LINE + choices.join(RPM::NEW_LINE);
}

// -------------------------------------------------------

QString EventCommand::strChoice() const {
    return RPM::translate(Translations::CHOICE) + RPM::SPACE + m_listCommand.at(
        0) + RPM::COLON;
}

// -------------------------------------------------------

QString EventCommand::strScript(SystemCommonObject *object, QStandardItemModel
    *parameters) const
{
    QString script;
    int i;

    i = 0;
    if (m_listCommand.at(i++) == RPM::TRUE_BOOL_STRING) {
        script = this->strProperty(i, object, parameters);
    } else {
        script = m_listCommand.at(i);
    }

    return RPM::translate(Translations::SCRIPT) + RPM::COLON + RPM::SPACE +
        script;
}

// -------------------------------------------------------

QString EventCommand::strDisplayAPicture(SystemCommonObject *object,
    QStandardItemModel *parameters) const
{
    QString id, index, origin, x, y, zoom, opacity, angle;
    int i;

    i = 0;
    id = m_listCommand.at(i++);
    index = this->strProperty(i, object, parameters);
    origin = m_listCommand.at(i++) == RPM::TRUE_BOOL_STRING ? RPM::translate(
        Translations::CENTER) : RPM::translate(Translations::TOP_LEFT);
    x = this->strProperty(i, object, parameters);
    y = this->strProperty(i, object, parameters);
    zoom = this->strProperty(i, object, parameters);
    opacity = this->strProperty(i, object, parameters);
    angle = this->strProperty(i, object, parameters);

    return RPM::translate(Translations::DISPLAY_A_PICTURE) + RPM::COLON + RPM
        ::SPACE + RPM::translate(Translations::ID) + RPM::EQUAL + id + RPM
        ::SPACE + RPM::translate(Translations::INDEX).toLower() + RPM::EQUAL +
        index + RPM::NEW_LINE + "    " + RPM::translate(Translations::ORIGIN) +
        RPM::EQUAL + origin + "," + RPM::SPACE + RPM::translate(Translations::X)
        + RPM::EQUAL + x + "," + RPM::SPACE + RPM::translate(Translations::Y) +
        RPM::EQUAL + y + "," + RPM::SPACE + RPM::translate(Translations::ZOOM) +
        RPM::EQUAL + zoom + "%," + RPM::SPACE + RPM::translate(Translations
        ::OPACITY) + RPM::EQUAL + opacity + "%," + RPM::SPACE + RPM::translate(
        Translations::ANGLE) + RPM::EQUAL + angle + "°";
}

// -------------------------------------------------------

QString EventCommand::strSetMoveTurnAPicture(SystemCommonObject *object,
    QStandardItemModel *parameters) const
{
    QString index, time, options;
    bool checked, waitEnd;
    int i;

    i = 0;
    index = this->strProperty(i, object, parameters);
    checked = RPM::stringToBool(m_listCommand.at(i++));
    if (checked) {
        options += "\n    " + RPM::translate(Translations::IMAGE_ID) + RPM
            ::COLON + RPM::SPACE + m_listCommand.at(i++);
    }
    checked = RPM::stringToBool(m_listCommand.at(i++));
    if (checked) {
        options += "\n    " + RPM::translate(Translations::ZOOM) + RPM::COLON +
            RPM::SPACE + this->strProperty(i, object, parameters) + "%";
    }
    checked = RPM::stringToBool(m_listCommand.at(i++));
    if (checked) {
        options += "\n    " + RPM::translate(Translations::OPACITY) + RPM::COLON
            + RPM::SPACE + this->strProperty(i, object, parameters) + "%";
    }
    checked = RPM::stringToBool(m_listCommand.at(i++));
    if (checked) {
        options += "\n    " + RPM::translate(Translations::X) + RPM::COLON + RPM
            ::SPACE + this->strProperty(i, object, parameters);
    }
    checked = RPM::stringToBool(m_listCommand.at(i++));
    if (checked) {
        options += "\n    " + RPM::translate(Translations::Y) + RPM::COLON + RPM
            ::SPACE + this->strProperty(i, object, parameters);
    }
    checked = RPM::stringToBool(m_listCommand.at(i++));
    if (checked) {
        options += "\n    " + RPM::translate(Translations::ANGLE) + RPM::COLON +
            RPM::SPACE + this->strProperty(i, object, parameters) + "°";
    }
    time = this->strProperty(i, object, parameters);
    waitEnd = RPM::stringToBool(m_listCommand.at(i++));

    return RPM::translate(Translations::SET_MOVE_TURN_A_PICTURE) + RPM::COLON +
        RPM::SPACE + RPM::translate(Translations::INDEX).toLower() + RPM::EQUAL
        + index + RPM::SPACE + RPM::translate(Translations::WITH_TIME).toLower()
        + RPM::EQUAL + time + RPM::translate(Translations::SECONDS) + (waitEnd ?
        RPM::BRACKET_LEFT + RPM::translate(Translations::WAIT_END) + RPM
        ::BRACKET_RIGHT : "") + RPM::COLON + options;
}

// -------------------------------------------------------

QString EventCommand::strRemoveAPicture(SystemCommonObject *object,
    QStandardItemModel *parameters) const
{
    int i = 0;

    return RPM::translate(Translations::REMOVE_A_PICTURE) + RPM::COLON + RPM
        ::SPACE + RPM::translate(Translations::INDEX).toLower() + RPM::EQUAL +
        this->strProperty(i, object, parameters);
}

// -------------------------------------------------------

QString EventCommand::strSetDialogBoxOptions(SystemCommonObject *object,
    QStandardItemModel *parameters) const
{
    QString options;
    bool checked;
    int i;

    i = 0;
    checked = RPM::stringToBool(m_listCommand.at(i++));
    if (checked) {
        options += "\n    " + RPM::translate(Translations::WINDOW_SKIN_ID) + RPM
            ::COLON + RPM::SPACE + this->strDataBaseId(i, object, RPM::get()
            ->project()->gameDatas()->systemDatas()->modelWindowSkins(),
            parameters);
    }
    checked = RPM::stringToBool(m_listCommand.at(i++));
    if (checked) {
        options += "\n    " + RPM::translate(Translations::X) + RPM::COLON + RPM
            ::SPACE + this->strProperty(i, object, parameters);
    }
    checked = RPM::stringToBool(m_listCommand.at(i++));
    if (checked) {
        options += "\n    " + RPM::translate(Translations::Y) + RPM::COLON + RPM
            ::SPACE + this->strProperty(i, object, parameters);
    }
    checked = RPM::stringToBool(m_listCommand.at(i++));
    if (checked) {
        options += "\n    " + RPM::translate(Translations::WIDTH) + RPM::COLON +
            RPM::SPACE + this->strProperty(i, object, parameters);
    }
    checked = RPM::stringToBool(m_listCommand.at(i++));
    if (checked) {
        options += "\n    " + RPM::translate(Translations::HEIGHT) + RPM::COLON
            + RPM::SPACE + this->strProperty(i, object, parameters);
    }
    checked = RPM::stringToBool(m_listCommand.at(i++));
    if (checked) {
        options += "\n    " + RPM::translate(Translations::PADDING_LEFT) + RPM
            ::COLON + RPM::SPACE + this->strProperty(i, object, parameters);
    }
    checked = RPM::stringToBool(m_listCommand.at(i++));
    if (checked) {
        options += "\n    " + RPM::translate(Translations::PADDING_TOP) + RPM
            ::COLON + RPM::SPACE + this->strProperty(i, object, parameters);
    }
    checked = RPM::stringToBool(m_listCommand.at(i++));
    if (checked) {
        options += "\n    " + RPM::translate(Translations::PADDING_RIGHT) + RPM
            ::COLON + RPM::SPACE + this->strProperty(i, object, parameters);
    }
    checked = RPM::stringToBool(m_listCommand.at(i++));
    if (checked) {
        options += "\n    " + RPM::translate(Translations::PADDING_BOTTOM) + RPM
            ::COLON + RPM::SPACE + this->strProperty(i, object, parameters);
    }
    checked = RPM::stringToBool(m_listCommand.at(i++));
    if (checked) {
        options += "\n    " + RPM::translate(Translations::FACESET_POSITION) +
            RPM::COLON + RPM::SPACE + (RPM::stringToBool(m_listCommand.at(i++))
            ? RPM::translate(Translations::ABOVE) : RPM::translate(Translations
            ::BEHIND));
    }
    checked = RPM::stringToBool(m_listCommand.at(i++));
    if (checked) {
        options += "\n    " + RPM::translate(Translations::FACESET_X) + RPM
            ::COLON + RPM::SPACE + this->strProperty(i, object, parameters);
    }
    checked = RPM::stringToBool(m_listCommand.at(i++));
    if (checked) {
        options += "\n    " + RPM::translate(Translations::FACESET_Y) + RPM
            ::COLON + RPM::SPACE + this->strProperty(i, object, parameters);
    }
    checked = RPM::stringToBool(m_listCommand.at(i++));
    if (checked) {
        options += "\n    " + RPM::translate(Translations::TEXT_OUTLINE) + RPM
            ::COLON + RPM::SPACE + (RPM::stringToBool(m_listCommand.at(i++)) ?
            RPM::translate(Translations::NO) : RPM::translate(Translations::YES));
    }
    checked = RPM::stringToBool(m_listCommand.at(i++));
    if (checked) {
        options += "\n    " + RPM::translate(Translations::TEXT_COLOR_ID_TEXT )
            + RPM::COLON + RPM::SPACE + this->strDataBaseId(i, object, RPM
            ::get()->project()->gameDatas()->systemDatas()->modelColors(),
            parameters);
    }
    checked = RPM::stringToBool(m_listCommand.at(i++));
    if (checked) {
        options += "\n    " + RPM::translate(Translations::TEXT_COLOR_ID_OUTLINE
            ) + RPM::COLON + RPM::SPACE + this->strDataBaseId(i, object, RPM
            ::get()->project()->gameDatas()->systemDatas()->modelColors(),
            parameters);
    }
    checked = RPM::stringToBool(m_listCommand.at(i++));
    if (checked) {
        options += "\n    " + RPM::translate(Translations
            ::TEXT_COLOR_ID_BACKGROUND) + RPM::COLON + RPM::SPACE + this
            ->strDataBaseId(i, object, RPM::get()->project()->gameDatas()
            ->systemDatas()->modelColors(), parameters);
    }
    checked = RPM::stringToBool(m_listCommand.at(i++));
    if (checked) {
        options += "\n    " + RPM::translate(Translations::TEXT_SIZE_ID) + RPM
            ::COLON + RPM::SPACE + this->strDataBaseId(i, object, RPM::get()
            ->project()->gameDatas()->systemDatas()->modelFontSizes(),
            parameters);
    }
    checked = RPM::stringToBool(m_listCommand.at(i++));
    if (checked) {
        options += "\n    " + RPM::translate(Translations::TEXT_FONT_ID) + RPM
            ::COLON + RPM::SPACE + this->strDataBaseId(i, object, RPM::get()
            ->project()->gameDatas()->systemDatas()->modelFontNames(),
            parameters);
    }

    return RPM::translate(Translations::SET_DIALOG_BOX_OPTIONS) + RPM::COLON +
        RPM::SPACE + options;
}

// -------------------------------------------------------

QString EventCommand::strChangeScreenTone(SystemCommonObject *object,
    QStandardItemModel *parameters) const
{
    QString red, green, blue, grey, operation, color, time;
    int i;

    i = 0;
    red = this->strProperty(i, object, parameters);
    green = this->strProperty(i, object, parameters);
    blue = this->strProperty(i, object, parameters);
    grey = this->strProperty(i, object, parameters) + "%";
    if (RPM::stringToBool(m_listCommand.at(i++))) {
        operation = RPM::stringToBool(m_listCommand.at(i++)) ? "-" : "+";
        color = operation + RPM::SPACE + RPM::translate(Translations::COLOR)
            .toLower() + RPM::SPACE + this->strDataBaseId(i, object, RPM::get()
            ->project()->gameDatas()->systemDatas()->modelColors(), parameters)
            + RPM::NEW_LINE;
    }
    if (RPM::stringToBool(m_listCommand.at(i++))) {
        time += RPM::BRACKET_LEFT + RPM::translate(Translations::WAIT_END) + RPM
            ::BRACKET_RIGHT;
    }
    time += RPM::translate(Translations::TIME).toUpper() + RPM::COLON + RPM
        ::SPACE + this->strProperty(i, object, parameters) + RPM::SPACE + RPM
        ::translate(Translations::SECONDS);

    return RPM::translate(Translations::CHANGE_SCREEN_TONE) + RPM::COLON + RPM
        ::NEW_LINE + RPM::translate(Translations::RED_SHORT) + RPM::COLON + RPM
        ::SPACE + red + RPM::NEW_LINE + RPM::translate(Translations::GREEN_SHORT
        ) + RPM::COLON + RPM::SPACE + green + RPM::NEW_LINE + RPM::translate(
        Translations::BLUE_SHORT) + RPM::COLON + RPM::SPACE + blue + RPM
        ::NEW_LINE + RPM::translate(Translations::GREY) + RPM::COLON + RPM
        ::SPACE + grey + RPM::NEW_LINE + color + time;
}

// -------------------------------------------------------

QString EventCommand::strRemoveObjectFromMap(SystemCommonObject *object,
    QStandardItemModel *parameters) const
{
    QStandardItemModel *modelObjects;
    QString obj;
    int i;

    i = 0;
    if (RPM::isInConfig && !RPM::isInObjectConfig) {
        modelObjects = new QStandardItemModel;
        Map::setModelObjects(modelObjects);
    } else {
        modelObjects = RPM::get()->project()->currentMap(true)->modelObjects();
    }
    obj = this->strDataBaseId(i, object, modelObjects, parameters);

    if (RPM::isInConfig && !RPM::isInObjectConfig) {
        SuperListItem::deleteModel(modelObjects);
    }

    return RPM::translate(Translations::REMOVE_OBJECT_FROM_MAP) + RPM::COLON +
        RPM::SPACE + RPM::translate(Translations::ID) + RPM::EQUAL + obj;
}

// -------------------------------------------------------

QString EventCommand::strAllowForbidSaves(SystemCommonObject *object,
    QStandardItemModel *parameters) const
{
    int i = 0;
    return RPM::translate(Translations::ALLOW_SAVES) + RPM::COLON + RPM::SPACE +
        this->strProperty(i, object, parameters);
}

// -------------------------------------------------------

QString EventCommand::strAllowForbidMainMenu(SystemCommonObject *object,
    QStandardItemModel *parameters) const
{
    int i = 0;
    return RPM::translate(Translations::ALLOW_MAIN_MENU) + RPM::COLON + RPM
        ::SPACE + this->strProperty(i, object, parameters);
}

// -------------------------------------------------------

QString EventCommand::strCallACommonReaction() const {
    int i = 0;

    return RPM::translate(Translations::CALL_A_COMMON_REACTION) + RPM::COLON +
        RPM::SPACE + reinterpret_cast<SystemCommonReaction *>(SuperListItem
        ::getById(RPM::get()->project()->gameDatas()->commonEventsDatas()
        ->modelCommonReactors()->invisibleRootItem(), m_listCommand.at(i++)
        .toInt()))->toString();
}

// -------------------------------------------------------

QString EventCommand::strLabel(bool jump, SystemCommonObject *object,
    QStandardItemModel *parameters) const
{
    int i = 0;
    return RPM::translate(jump ? Translations::JUMP_TO_LABEL : Translations
        ::LABEL) + RPM::COLON + RPM::SPACE + this->strProperty(i, object,
        parameters);
}

// -------------------------------------------------------

QString EventCommand::strComment() const
{
    return "# " + this->valueCommandAt(0);
}

// -------------------------------------------------------

QString EventCommand::strChangeAStatistic(SystemCommonObject *object,
    QStandardItemModel *parameters) const
{
    int i = 0;
    QString statistic = RPM::translate(Translations::STATISTIC_ID) + RPM::SPACE
        + this->strDataBaseId(i, object, RPM::get()->project()->gameDatas()
        ->battleSystemDatas()->modelCommonStatistics(), parameters);
    QString selection;
    switch (m_listCommand.at(i++).toInt())
    {
    case 0:
        selection += RPM::translate(Translations::HERO_ENEMY_INSTANCE_ID) + RPM
            ::SPACE + this->strProperty(i, object, parameters);
        break;
    case 1:
        selection += RPM::translate(Translations::THE_ENTIRE) + RPM::SPACE + RPM
            ::ENUM_TO_STRING_TEAM.at(m_listCommand.at(i++).toInt());
        break;
    }
    QString operation = this->strChangeVariablesOperation(i);
    QString value;
    switch (m_listCommand.at(i++).toInt())
    {
    case 0:
        value = RPM::translate(Translations::NUMBER) + RPM::SPACE + this
            ->strProperty(i, object, parameters);
        break;
    case 1:
        value = RPM::translate(Translations::FORMULA) + RPM::SPACE + this
            ->strProperty(i, object, parameters);
        break;
    case 2:
        value = RPM::translate(Translations::MAXIMUM_STATISTIC_VALUE);
        break;
    }
    QString option;
    if (RPM::stringToBool(m_listCommand.at(i++)))
    {
        option += RPM::NEW_LINE + RPM::BRACKET_LEFT + RPM::translate(
            Translations::CAN_GO_ABOVE_MAXIMUM_VALUE) + RPM::BRACKET_RIGHT;
    }

    return RPM::translate(Translations::CHANGE_A_STATISTIC) + RPM::NEW_LINE +
        "\t" + statistic + RPM::SPACE + selection + RPM::SPACE + value + RPM
        ::NEW_LINE + "\t" + option;
}

// -------------------------------------------------------

QString EventCommand::strChangeASkill(SystemCommonObject *object,
    QStandardItemModel *parameters) const
{
    int i = 0;
    QString skill = RPM::translate(Translations::SKILL_ID) + RPM::SPACE
        + this->strDataBaseId(i, object, RPM::get()->project()->gameDatas()
        ->skillsDatas()->model(), parameters);
    QString selection;
    switch (m_listCommand.at(i++).toInt())
    {
    case 0:
        selection += RPM::translate(Translations::HERO_ENEMY_INSTANCE_ID) + RPM
            ::SPACE + this->strProperty(i, object, parameters);
        break;
    case 1:
        selection += RPM::translate(Translations::THE_ENTIRE) + RPM::SPACE + RPM
            ::ENUM_TO_STRING_TEAM.at(m_listCommand.at(i++).toInt());
        break;
    }
    QString operation = this->strOperationLearnForget(i);

    return RPM::translate(Translations::CHANGE_A_SKILL) + RPM::NEW_LINE +
        "\t" + skill + RPM::SPACE + selection;
}

// -------------------------------------------------------

QString EventCommand::strOperationLearnForget(int &i) const
{
    QString str;

    switch (m_listCommand.at(i++).toInt())
    {
    case 0:
        str += RPM::translate(Translations::LEARN);
        break;
    case 1:
        str += RPM::translate(Translations::FORGET);
        break;
    }

    return str;
}

// -------------------------------------------------------

QString EventCommand::strChangeName(SystemCommonObject *object,
    QStandardItemModel *parameters) const
{
    QString selection;
    int i = 0;
    QString name = this->strProperty(i, object, parameters);
    switch (m_listCommand.at(i++).toInt())
    {
    case 0:
        selection += RPM::translate(Translations::HERO_ENEMY_INSTANCE_ID) + RPM
            ::SPACE + this->strProperty(i, object, parameters);
        break;
    case 1:
        selection += RPM::translate(Translations::THE_ENTIRE) + RPM::SPACE + RPM
            ::ENUM_TO_STRING_TEAM.at(m_listCommand.at(i++).toInt());
        break;
    }

    return RPM::translate(Translations::CHANGE_NAME) + RPM::COLON + RPM::SPACE +
        selection + RPM::NEW_LINE + RPM::SPACE + name;
}

// -------------------------------------------------------

QString EventCommand::strChangeEquipment(SystemCommonObject *object,
    QStandardItemModel *parameters) const
{
    int i = 0;
    QString equipment = RPM::translate(Translations::EQUIMENT_ID) + RPM::SPACE +
        this->strDataBaseId(i, object, RPM::get()->project()->gameDatas()
        ->battleSystemDatas()->modelCommonEquipment(), parameters) + RPM::SPACE
        + RPM::translate(Translations::WITH).toLower() + RPM::SPACE;
    bool isWeapon = RPM::stringToBool(m_listCommand.at(i++));
    equipment += RPM::translate(isWeapon ? Translations::WEAPON_ID :
        Translations::ARMOR_ID) + RPM::SPACE;
    equipment += this->strDataBaseId(i, object, isWeapon ? RPM::get()->project()
        ->gameDatas()->weaponsDatas()->model() : RPM::get()->project()
        ->gameDatas()->armorsDatas()->model(),  parameters);
    QString selection;
    switch (m_listCommand.at(i++).toInt())
    {
    case 0:
        selection += RPM::translate(Translations::HERO_ENEMY_INSTANCE_ID) + RPM
            ::SPACE + this->strProperty(i, object, parameters);
        break;
    case 1:
        selection += RPM::translate(Translations::THE_ENTIRE) + RPM::SPACE + RPM
            ::ENUM_TO_STRING_TEAM.at(m_listCommand.at(i++).toInt());
        break;
    }
    QString option;
    if (RPM::stringToBool(m_listCommand.at(i++)))
    {
        option += RPM::NEW_LINE + RPM::BRACKET_LEFT + RPM::translate(
            Translations::APPLY_ONLY_IF_IN_INVENTORY) + RPM::BRACKET_RIGHT;
    }

    return RPM::translate(Translations::CHANGE_EQUIPMENT) + RPM::COLON + RPM
        ::SPACE + equipment + RPM::SPACE + selection + option;
}

// -------------------------------------------------------

QString EventCommand::strModifyCurrency(SystemCommonObject *object,
    QStandardItemModel *parameters) const
{
    int i = 0;
    QString currency = RPM::translate(Translations::CURRENCY_ID) + RPM::SPACE +
        this->strDataBaseId(i, object, RPM::get()->project()->gameDatas()
        ->systemDatas()->modelCurrencies(), parameters);
    QString operation = this->strChangeVariablesOperation(i);
    QString value = this->strProperty(i, object, parameters);

    return RPM::translate(Translations::MODIFY_CURRENCY) + RPM::COLON + RPM
        ::SPACE + currency + RPM::SPACE + operation + RPM::SPACE + value;
}

// -------------------------------------------------------

QString EventCommand::strDisplayAnAnimation(SystemCommonObject *object,
    QStandardItemModel *parameters) const
{
    int i = 0;
    QString objectID = RPM::translate(Translations::OBJECT_ID) + RPM::SPACE +
        this->strMoveObjectID(object, parameters, i);
    QString animation = RPM::translate(Translations::ANIMATION_ID) + RPM::SPACE
        + this->strDataBaseId(i, object, RPM::get()->project()->gameDatas()
        ->animationsDatas()->model(), parameters);
    QString option;
    if (RPM::stringToBool(m_listCommand.at(i++)))
    {
        option += RPM::NEW_LINE + RPM::BRACKET_LEFT + RPM::translate(
            Translations::WAIT_END) + RPM::BRACKET_RIGHT;
    }

    return RPM::translate(Translations::DISPLAY_AN_ANIMATION) + RPM::COLON + RPM
        ::SPACE + objectID + RPM::SPACE + animation + RPM::SPACE + option;
}

// -------------------------------------------------------

QString EventCommand::strShakeScreen(SystemCommonObject *object,
    QStandardItemModel *parameters) const
{
    int i = 0;

    QString offset = this->strProperty(i, object, parameters);
    QString shakesNumber = this->strProperty(i, object, parameters);
    QString option;
    if (m_listCommand.at(i++) == RPM::TRUE_BOOL_STRING) {
        option += RPM::BRACKET_LEFT + RPM::translate(Translations::WAIT_END) +
            RPM::BRACKET_RIGHT;
    }
    QString time = RPM::translate(Translations::TIME) + RPM::COLON + RPM::SPACE + this
        ->strNumber(i, parameters) + RPM::SPACE + RPM::translate(Translations
        ::SECONDS);

    return RPM::translate(Translations::SHAKE_SCREEN) + RPM::COLON + RPM
        ::NEW_LINE + RPM::translate(Translations::OFFSET) + RPM::COLON + RPM
        ::SPACE + offset + RPM::SPACE + RPM::translate(Translations::PIXEL_S)
        .toLower() + RPM::NEW_LINE + RPM::translate(Translations::SHAKES_NUMBER)
        + RPM::COLON + RPM::SPACE + shakesNumber + RPM::NEW_LINE + option + RPM
        ::NEW_LINE + time;
}

// -------------------------------------------------------

QString EventCommand::strFlashScreen(SystemCommonObject *object,
    QStandardItemModel *parameters) const
{
    int i = 0;

    QString colorID = this->strDataBaseId(i, object, RPM::get()->project()
        ->gameDatas()->systemDatas()->modelColors(), parameters);
    QString option;
    if (m_listCommand.at(i++) == RPM::TRUE_BOOL_STRING) {
        option += RPM::BRACKET_LEFT + RPM::translate(Translations::WAIT_END) +
            RPM::BRACKET_RIGHT;
    }
    QString time = RPM::translate(Translations::TIME) + RPM::COLON + RPM::SPACE
        + this->strProperty(i, object, parameters) + RPM::SPACE + RPM::translate
        (Translations::SECONDS);

    return RPM::translate(Translations::FLASH_SCREEN) + RPM::COLON + RPM
        ::NEW_LINE + RPM::translate(Translations::COLOR_ID) + RPM::COLON + RPM
        ::SPACE + colorID + RPM::NEW_LINE + option + RPM::NEW_LINE + time;
}

// -------------------------------------------------------
//
//  READ / WRITE
//
// -------------------------------------------------------

void EventCommand::read(const QJsonObject &json) {
    QJsonArray tab;
    QJsonValue val;
    int i, l;

    m_kind = static_cast<EventCommandKind>(json[JSON_KIND].toInt());
    tab = json[JSON_COMMANDS].toArray();
    m_listCommand.clear();
    for (i = 0, l = tab.size(); i < l; i++) {
        val = tab[i];

        if (val.isString()) {
            m_listCommand.append(tab[i].toString());
        } else if (val.isDouble()) {
            m_listCommand.append(QString::number(tab[i].toDouble()));
        } else {
            m_listCommand.append(QString::number(val.toInt()));
        }
    }
}

// -------------------------------------------------------

QJsonObject EventCommand::getJSON() const{
    QJsonObject json;
    QJsonArray tab;
    QString s;
    bool conversionOk, conversionDoubleOk;
    double d;
    int i, l, integer;

    json[JSON_KIND] = static_cast<int>(m_kind);
    for (i = 0, l = m_listCommand.size(); i < l; i++) {
        s = m_listCommand.at(i);
        integer = s.toInt(&conversionOk);
        d = s.toDouble(&conversionDoubleOk);
        if (conversionOk) {
            tab.append(integer);
        } else if (conversionDoubleOk) {
            tab.append(d);
        } else {
            tab.append(s);
        }
    }
    json[JSON_COMMANDS] = tab;

    return json;
}
