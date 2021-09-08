/*
    RPG Paper Maker Copyright (C) 2017-2021 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include <QMessageBox>
#include "eventcommand.h"
#include "rpm.h"
#include "widgetcomboboxteam.h"
#include "primitivevaluekind.h"
#include "systemobjectevent.h"
#include "systemcommandmove.h"
#include "conditionheroeskind.h"
#include "systemcommonreaction.h"
#include "systemplugin.h"
#include "systemplugincommand.h"
#include "systempluginparameter.h"
#include "systemcommanditemprice.h"

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
    if (index < m_listCommand.size()) {
        return m_listCommand.at(index);
    } else {
        QMessageBox::critical(nullptr, RPM::translate(Translations::ERROR_MESSAGE),
            "Can't read command " + this->kindToString(m_kind) +
            ", please report to devs." + "\n" + m_listCommand.toList().join(","));
        return "";
    }
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
        != EventCommandKind::IfLose && m_kind != EventCommandKind::Choice &&
        m_kind != EventCommandKind::EndChoice;
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
    int i = 4;
    int l = this->commandsCount();
    int nb = 0;
    QString next;
    while (i < l)
    {
        next = m_listCommand.at(i);
        if (next == RPM::DASH)
        {
            i++;
            nb++;
        }
        i += 2;
    }
    return nb;
}

// -------------------------------------------------------

void EventCommand::getChoicesIDs(QList<int> &list) {
    int i = 4;
    int l = this->commandsCount();
    int index = 1;
    QString next;
    while (i < l) {
        next = m_listCommand.at(i);
        if (next == RPM::DASH) {
            list.append(index++);
            i++;
        }
        i += 2;
    }
}

// -------------------------------------------------------

void EventCommand::setCopy(const EventCommand &copy) {
    m_kind = copy.m_kind;
    m_listCommand = copy.m_listCommand;
}

// -------------------------------------------------------

QString EventCommand::toString(QStandardItemModel *properties, QStandardItemModel
    *parameters, QStandardItemModel *troopMonstersList) const
{
    QString str;

    str = BEGINNING_COMMAND;
    switch (m_kind) {
    case EventCommandKind::ShowText:
        str += this->strShowText(properties, parameters); break;
    case EventCommandKind::ChangeVariables:
        str += this->strChangeVariables(properties, parameters, troopMonstersList); break;
    case EventCommandKind::EndGame:
        str += RPM::translate(Translations::GAME_OVER); break;
    case EventCommandKind::While:
        str += RPM::translate(Translations::LOOP); break;
    case EventCommandKind::EndWhile:
        str += RPM::translate(Translations::END_LOOP); break;
    case EventCommandKind::WhileBreak:
        str += RPM::translate(Translations::BREAK_LOOP); break;
    case EventCommandKind::InputNumber:
        str += strInputNumber(properties, parameters); break;
    case EventCommandKind::If:
        str += strCondition(properties, parameters); break;
    case EventCommandKind::Else:
        str += RPM::translate(Translations::ELSE); break;
    case EventCommandKind::EndIf:
        str += RPM::translate(Translations::END_IF); break;
    case EventCommandKind::OpenMainMenu:
        str += RPM::translate(Translations::OPEN_MAIN_MENU); break;
    case EventCommandKind::OpenSavesMenu:
        str += RPM::translate(Translations::OPEN_SAVES_MENU); break;
    case EventCommandKind::ModifyInventory:
        str += this->strModifyInventory(properties, parameters); break;
    case EventCommandKind::ModifyTeam:
        str += this->strModifyTeam(properties, parameters); break;
    case EventCommandKind::StartBattle:
        str += this->strStartBattle(parameters); break;
    case EventCommandKind::IfWin:
        str += RPM::translate(Translations::IF_WIN); break;
    case EventCommandKind::IfLose:
        str += RPM::translate(Translations::IF_LOSE); break;
    case EventCommandKind::ChangeState:
        str += this->strChangeState(properties, parameters); break;
    case EventCommandKind::SendEvent:
        str += this->strSendEvent(properties, parameters); break;
    case EventCommandKind::TeleportObject:
        str += this->strTeleportObject(properties, parameters); break;
    case EventCommandKind::MoveObject:
        str += this->strMoveObject(properties, parameters); break;
    case EventCommandKind::Wait:
        str += this->strWait(properties, parameters); break;
    case EventCommandKind::MoveCamera:
        str += this->strMoveCamera(properties, parameters); break;
    case EventCommandKind::PlayMusic:
        str += this->strPlayMusic(properties, parameters); break;
    case EventCommandKind::StopMusic:
        str += this->strStopMusic(properties, parameters); break;
    case EventCommandKind::PlayBackgroundSound:
        str += this->strPlayBackgroundSound(properties, parameters); break;
    case EventCommandKind::StopBackgroundSound:
        str += this->strStopBackgroundSound(properties, parameters); break;
    case EventCommandKind::PlayASound:
        str += this->strPlaySound(properties, parameters); break;
    case EventCommandKind::PlayMusicEffect:
        str += this->strPlayMusicEffect(properties, parameters); break;
    case EventCommandKind::ChangeProperty:
        str += this->strChangeProperty(properties, parameters); break;
    case EventCommandKind::DisplayChoice:
        str += this->strDisplayChoice(properties, parameters); break;
    case EventCommandKind::Choice:
        str += this->strChoice(); break;
    case EventCommandKind::EndChoice:
        str += RPM::translate(Translations::END_CHOICE); break;
    case EventCommandKind::Script:
        str += this->strScript(properties, parameters); break;
    case EventCommandKind::DisplayAPicture:
        str += this->strDisplayAPicture(properties, parameters); break;
    case EventCommandKind::SetMoveTurnAPicture:
        str += this->strSetMoveTurnAPicture(properties, parameters); break;
    case EventCommandKind::RemoveAPicture:
        str += this->strRemoveAPicture(properties, parameters); break;
    case EventCommandKind::SetDialogBoxOptions:
        str += this->strSetDialogBoxOptions(properties, parameters); break;
    case EventCommandKind::TitleScreen:
        str += RPM::translate(Translations::TITLE_SCREEN); break;
    case EventCommandKind::ChangeScreenTone:
        str += this->strChangeScreenTone(properties, parameters); break;
    case EventCommandKind::RemoveObjectFromMap:
        str += this->strRemoveObjectFromMap(properties, parameters); break;
    case EventCommandKind::StopReaction:
        str += RPM::translate(Translations::STOP_REACTION); break;
    case EventCommandKind::AllowForbidSaves:
        str += this->strAllowForbidSaves(properties, parameters); break;
    case EventCommandKind::AllowForbidMainMenu:
        str += this->strAllowForbidMainMenu(properties, parameters); break;
    case EventCommandKind::CallACommonReaction:
        str += this->strCallACommonReaction(); break;
    case EventCommandKind::Label:
        str += this->strLabel(false, properties, parameters); break;
    case EventCommandKind::JumpLabel:
        str += this->strLabel(true, properties, parameters); break;
    case EventCommandKind::Comment:
        str += this->strComment(); break;
    case EventCommandKind::ChangeAStatistic:
        str += this->strChangeAStatistic(properties, parameters); break;
    case EventCommandKind::ChangeASkill:
        str += this->strChangeASkill(properties, parameters); break;
    case EventCommandKind::ChangeName:
        str += this->strChangeName(properties, parameters); break;
    case EventCommandKind::ChangeEquipment:
        str += this->strChangeEquipment(properties, parameters); break;
    case EventCommandKind::ModifyCurrency:
        str += this->strModifyCurrency(properties, parameters); break;
    case EventCommandKind::DisplayAnAnimation:
        str += this->strDisplayAnAnimation(properties, parameters); break;
    case EventCommandKind::ShakeScreen:
        str += this->strShakeScreen(properties, parameters); break;
    case EventCommandKind::FlashScreen:
        str += this->strFlashScreen(properties, parameters); break;
    case EventCommandKind::Plugin:
        str += this->strPlugin(properties, parameters); break;
    case EventCommandKind::StartShopMenu:
        str += this->strStartShopMenu(properties, parameters); break;
    case EventCommandKind::RestockShop:
        str += this->strStartShopMenu(properties, parameters, true); break;
    case EventCommandKind::EnterANameMenu:
        str += this->strEnterANameMenu(properties, parameters); break;
    case EventCommandKind::CreateObjectInMap:
        str += this->strCreateObjectInMap(properties, parameters); break;
    case EventCommandKind::ChangeStatus:
        str += this->strChangeStatus(properties, parameters); break;
    case EventCommandKind::ResetCamera:
        str += RPM::translate(Translations::RESET_CAMERA); break;
    case EventCommandKind::ChangeBattleMusic:
        str += this->strChangeBattleMusic(properties, parameters); break;
    case EventCommandKind::ChangeVictoryMusic:
        str += this->strChangeVictoryMusic(properties, parameters); break;
    case EventCommandKind::EndBattle:
        str += RPM::translate(Translations::END_BATTLE); break;
    case EventCommandKind::ForceAnAction:
        str += this->strForceAnAction(properties, parameters, troopMonstersList);
        break;
    case EventCommandKind::ChangeMapProperties:
        str += this->strChangeMapProperties(properties, parameters); break;
    case EventCommandKind::ChangeExperienceCurve:
        str += this->strChangeExperienceCurve(properties, parameters); break;
    case EventCommandKind::ChangeClass:
        str += this->strChangeClass(properties, parameters); break;
    case EventCommandKind::ChangeChronometer:
        str += this->strChangeChronometer(properties, parameters); break;
    case EventCommandKind::ChangeWeather:
        str += this->strChangeWeather(properties, parameters); break;
    default:
        break;
    }
    return str;
}

// -------------------------------------------------------

QString EventCommand::strTroopMonstersList(QStandardItemModel *model, int &i) const
{
    if (model == nullptr)
    {
        return "";
    }
     SuperListItem *super = SuperListItem::getByIndex(model, this->valueCommandAt(i++)
        .toInt());;
     return super == nullptr ? "" : super->toString();
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

QString EventCommand::strDataBaseId(int &i, QStandardItemModel *properties,
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
        super = SuperListItem::getById(properties->invisibleRootItem(), value);
        return super == nullptr ? "" : super->toString();
    default:
        return "";
    }
}

// -------------------------------------------------------

QString EventCommand::strProperty(int &i, QStandardItemModel *properties,
    QStandardItemModel *parameters, bool active) const
{
    SuperListItem *super;
    PrimitiveValueKind kind;
    QString value;

    kind = static_cast<PrimitiveValueKind>(m_listCommand.at(i++).toInt());
    value = m_listCommand.at(i++);
    if (active)
    {
        i++;
    }
    switch (kind){
    case PrimitiveValueKind::None:
        return RPM::translate(Translations::NONE);
    case PrimitiveValueKind::Number:
    case PrimitiveValueKind::NumberDouble:
    case PrimitiveValueKind::DataBase:
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
        super = SuperListItem::getById(properties->invisibleRootItem(), value.toInt());
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

QString EventCommand::strShowText(QStandardItemModel *properties, QStandardItemModel
    *parameters) const
{
    int i = 0;
    QString interlocutor = this->strProperty(i, properties, parameters);
    i++;
    int id;
    QString text;
    while (i < this->commandsCount())
    {
        id = this->valueCommandAt(i++).toInt();
        text = this->valueCommandAt(i++);
        if (id == RPM::get()->project()->langsDatas()->mainLang())
        {
            break;
        } else
        {
            text = "";
        }
    }
    return RPM::translate(Translations::SHOW_TEXT) + RPM::SPACE + RPM
        ::BRACKET_LEFT + interlocutor + RPM::BRACKET_RIGHT + RPM::COLON + RPM
        ::SPACE + text;
}

// -------------------------------------------------------

QString EventCommand::strChangeVariables(QStandardItemModel *properties,
    QStandardItemModel *parameters, QStandardItemModel *troopMonstersList) const
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
    QStandardItemModel *model = nullptr;
    switch (index) {
    case 0:
        value += this->strProperty(i, properties, parameters);
        break;
    case 1:
        value += RPM::translate(Translations::RANDOM_NUMBER_BETWEEN).toLower() +
            RPM::SPACE;
        value += this->strProperty(i, properties, parameters);
        value += RPM::SPACE + RPM::translate(Translations::AND).toLower() + RPM
            ::SPACE;
        value += this->strProperty(i, properties, parameters);
        break;
    case 2:
        value += RPM::translate(Translations::MESSAGE).toLower() + RPM::SPACE +
            this->strProperty(i, properties, parameters);
        break;
    case 3:
        value += RPM::translate(Translations::SWITCH).toLower() + RPM::SPACE +
            this->strProperty(i, properties, parameters);
        break;
    case 4:
        value += RPM::translate(Translations::AN_OBJECT_IN_MAP).toLower() + RPM
            ::SPACE + this->strMoveObjectID(properties, parameters, i) + RPM::SPACE
            + RPM::translate(Translations::CHARACTERISTIC).toLower() + RPM
            ::SPACE;
        value += RPM::ENUM_TO_STRING_VARIABLE_MAP_OBJECT_CHARACTERISTIC.at(
            m_listCommand.at(i++).toInt()).toLower();
        break;
    case 5:
        value += RPM::translate(Translations::NUMBER_OF).toLower() + RPM::SPACE;
        switch (this->valueCommandAt(i++).toInt())
        {
        case 0:
            value += RPM::translate(Translations::ITEM).toLower();
            model = RPM::get()->project()->gameDatas()->itemsDatas()->model();
            break;
        case 1:
            value += RPM::translate(Translations::WEAPON).toLower();
            model = RPM::get()->project()->gameDatas()->weaponsDatas()->model();
            break;
        case 2:
            value += RPM::translate(Translations::ARMOR).toLower();
            model = RPM::get()->project()->gameDatas()->armorsDatas()->model();
            break;
        }
        value += RPM::SPACE + this->strDataBaseId(i, properties, model, parameters) +
            RPM::translate(Translations::IN_INVENTORY).toLower();
        break;
    case 6:
        value += RPM::translate(Translations::TOTAL_CURRENCY).toLower() + RPM::SPACE;
        switch (this->valueCommandAt(i++).toInt())
        {
        case 0:
            value += RPM::translate(Translations::OWNED).toLower();
            break;
        case 1:
            value += RPM::translate(Translations::EARNED).toLower();
            break;
        case 2:
            value += RPM::translate(Translations::USED).toLower();
            break;
        }
        value += RPM::SPACE + this->strDataBaseId(i, properties, RPM::get()->project()
            ->gameDatas()->systemDatas()->modelCurrencies(), parameters);
        break;
    case 7:
        value += RPM::translate(Translations::HERO_ENEMY_INSTANCE_ID).toLower() +
            RPM::SPACE + this->strProperty(i, properties, parameters) + RPM::SPACE +
            RPM::translate(Translations::STATISTIC_ID).toLower() + RPM::SPACE;
        value += this->strDataBaseId(i, properties, RPM::get()->project()
            ->gameDatas()->battleSystemDatas()->modelCommonStatistics(), parameters);
        break;
    case 8:
        value += RPM::translate(Translations::ENEMY).toLower() + RPM::SPACE +
            this->strTroopMonstersList(troopMonstersList, i) + RPM::SPACE + RPM
            ::translate(Translations::INSTANCE_ID).toLower();
        break;
    case 9:
        value += RPM::translate(Translations::OTHER_CHARACTERISTICS).toLower() +
            RPM::SPACE + RPM::ENUM_TO_STRING_CHANGE_VARIABLES_OTHER_CHARACTERISTICS
            .at(this->valueCommandAt(i++).toInt());
        break;
    }
    return RPM::translate(Translations::CHANGE_VARIABLES) + RPM::COLON + RPM
        ::SPACE + selection + RPM::SPACE + operation + RPM::SPACE + value;
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

QString EventCommand::strInputNumber(QStandardItemModel *properties,
    QStandardItemModel *parameters) const
{
    int i = 0;
    QString stockVariable = this->strProperty(i, properties, parameters);
    QString digits = this->strProperty(i, properties, parameters);
    return RPM::translate(Translations::INPUT_NUMBER) + RPM::COLON + RPM::SPACE +
        RPM::translate(Translations::STOCK_VALUE_IN_VARIABLE_ID) + RPM::SPACE +
        stockVariable + RPM::COMMA + RPM::SPACE + RPM::translate(Translations
        ::DIGITS) + RPM::SPACE + digits;
}

// -------------------------------------------------------

QString EventCommand::strCondition(QStandardItemModel *properties,
    QStandardItemModel *parameters) const
{
    QString condition;
    bool checked;
    int i, radioIndex, index;

    i = 1;
    radioIndex = m_listCommand.at(i++).toInt();
    switch (radioIndex) {
    case 0:
        condition = this->strConditionPageVariables(properties, parameters, i,
            radioIndex);
        break;
    case 1: {
        index = m_listCommand.at(i++).toInt();
        condition += RPM::ENUM_TO_STRING_CONDITION_HEROES.at(index) + " ";
        if (index == static_cast<int>(ConditionHeroesKind
            ::TheHeroeWithInstanceID))
        {
            condition += this->strProperty(i, properties, parameters);
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
                ::SPACE + this->strProperty(i, properties, parameters);
            break;
        case 1:
            condition += RPM::translate(Translations::ARE_IN).toLower() + RPM
                ::SPACE + RPM::ENUM_TO_STRING_TEAM.at(m_listCommand.at(i++)
                .toInt());
            break;
        case 2:
            condition += RPM::translate(Translations::ARE_ABLE_SKILL_ID)
                .toLower() + RPM::SPACE + this->strDataBaseId(i, properties, RPM
                ::get()->project()->gameDatas()->skillsDatas()->model(),
                parameters);
            break;
        case 3:
            condition += RPM::translate(Translations::ARE_EQUIPED_WITH)
                .toLower() + RPM::SPACE;
            switch (m_listCommand.at(i++).toInt()) {
            case 0:
                condition += RPM::translate(Translations::WEAPON_ID).toLower() +
                    RPM::SPACE + this->strDataBaseId(i, properties, RPM::get()
                    ->project()->gameDatas()->weaponsDatas()->model(),
                    parameters);
                break;
            case 1:
                condition += RPM::translate(Translations::ARMOR_ID).toLower() +
                    RPM::SPACE + this->strDataBaseId(i, properties, RPM::get()
                    ->project()->gameDatas()->armorsDatas()->model(), parameters);
                break;
            }
            break;
        case 4:
            condition += RPM::translate(Translations::ARE_UNDER_EFFECT_STATUS_ID
                ).toLower() + RPM::SPACE + this->strDataBaseId(i, properties, RPM
                ::get()->project()->gameDatas()->statusDatas()->model(),
                parameters);
            break;
        case 5:
            condition += RPM::translate(Translations::HAVE_STATISTIC_ID)
                .toLower() + RPM::SPACE + this->strDataBaseId(i, properties, RPM
                ::get()->project()->gameDatas()->battleSystemDatas()
                ->modelCommonStatistics(), parameters);
            condition += " " + RPM::ENUM_TO_STRING_OPERATION.at(m_listCommand
                .at(i++).toInt()) + " ";
            condition += this->strProperty(i, properties, parameters);
            break;
        }
        break;
    }
    case 2: {
        condition =+ "" + RPM::translate(Translations::CURRENCY_ID) + RPM::COLON
            + RPM::SPACE + this->strDataBaseId(i, properties, RPM::get()->project()
            ->gameDatas()->systemDatas()->modelCurrencies(), parameters);
        condition += " " + RPM::ENUM_TO_STRING_OPERATION.at(m_listCommand.at(i++
            ).toInt()) + " ";
        condition += this->strProperty(i, properties, parameters);
        break;
    }
    case 3: {
        condition =+ "" + RPM::translate(Translations::ITEM_ID) + RPM::COLON +
            RPM::SPACE + this->strDataBaseId(i, properties, RPM::get()->project()
            ->gameDatas()->itemsDatas()->model(), parameters);
        condition += " " + RPM::ENUM_TO_STRING_OPERATION.at(m_listCommand.at(i++
            ).toInt()) + " ";
        condition += this->strProperty(i, properties, parameters);
        break;
    }
    case 4: {
        condition =+ "" + RPM::translate(Translations::WEAPON_ID) + RPM::COLON +
            RPM::SPACE + this->strDataBaseId(i, properties, RPM::get()->project()
            ->gameDatas()->weaponsDatas()->model(), parameters);
        condition += " " + RPM::ENUM_TO_STRING_OPERATION.at(m_listCommand.at(i++
            ).toInt()) + " ";
        condition += this->strProperty(i, properties, parameters);
        if (RPM::stringToBool(m_listCommand.at(i++))) {
            condition += RPM::SPACE + RPM::PLUS + RPM::SPACE + RPM::translate(
                Translations::CHECK_WEAPONS_EQUIPED_TOO).toLower();
        }
        break;
    }
    case 5: {
        condition =+ "" + RPM::translate(Translations::ARMOR_ID) + RPM::COLON +
            RPM::SPACE + this->strDataBaseId(i, properties, RPM::get()->project()
            ->gameDatas()->armorsDatas()->model(), parameters);
        condition += " " + RPM::ENUM_TO_STRING_OPERATION.at(m_listCommand.at(i++
            ).toInt()) + " ";
        condition += this->strProperty(i, properties, parameters);
        if (RPM::stringToBool(m_listCommand.at(i++))) {
            condition += RPM::SPACE + RPM::PLUS + RPM::SPACE + RPM::translate(
                Translations::CHECK_ARMORS_EQUIPED_TOO);
        }
        break;
    }
    case 6: {
        condition += RPM::translate(Translations::KEY_ID) + RPM::COLON + RPM
            ::SPACE + this->strDataBaseId(i, properties, RPM::get()->project()
            ->keyBoardDatas()->model(), parameters) + RPM::SPACE + RPM
            ::translate(Translations::IS).toLower() + RPM::SPACE;
        condition += this->strProperty(i, properties, parameters);
        break;
    }
    case 7: {
        condition += RPM::translate(Translations::SCRIPT) + RPM::COLON + RPM
            ::SPACE + this->strProperty(i, properties, parameters);
        break;
    }
    case 8: {
        condition += RPM::translate(Translations::ESCAPED_LAST_BATTLE);
        break;
    }
    case 9: {
        QString objectID = this->strMoveObjectID(properties, parameters, i);
        QString orientation = RPM::ENUM_TO_STRING_ORIENTATION_KIND.at(this
            ->valueCommandAt(i++).toInt());
        condition += RPM::translate(Translations::OBJECT_ID) + RPM::SPACE +
            objectID + RPM::SPACE + RPM::translate(Translations::IS_LOOKING_AT)
            .toLower() + RPM::SPACE + orientation;
        break;
    }
    case 10: {
        condition += RPM::translate(Translations::CHRONOMETER_ID) + RPM::SPACE +
            this->strProperty(i, properties, parameters) + RPM::SPACE;
        condition += RPM::ENUM_TO_STRING_OPERATION.at(this->valueCommandAt(i++)
            .toInt()) + RPM::SPACE;
        condition += this->strProperty(i, properties, parameters) + RPM::SPACE +
            RPM::translate(Translations::SECONDS).toLower();
        break;
    }
    default:
        break;
    }
    return RPM::translate(Translations::IF) + RPM::SPACE + RPM::PARENTHESIS_LEFT
        + condition + RPM::PARENTHESIS_RIGHT;
}

// -------------------------------------------------------

QString EventCommand::strConditionPageVariables(QStandardItemModel *properties,
    QStandardItemModel *parameters, int &i, int radioIndex) const
{
    QString condition, operation;

    switch (radioIndex) {
    case 0:
        condition = this->strProperty(i, properties, parameters);
        operation = RPM::ENUM_TO_STRING_OPERATION.at(m_listCommand.at(i++).toInt());
        condition += " " + operation + " ";
        condition += this->strProperty(i, properties, parameters);
        break;
    }

    return condition;
}

// -------------------------------------------------------

QString EventCommand::strModifyInventory(QStandardItemModel *properties,
    QStandardItemModel *parameters) const
{
    QString selection, operation ,number;
    int i;

    i = 0;
    selection = this->strModifyInventorySelection(properties, parameters, i);
    operation = this->strChangeVariablesOperation(i);
    number = this->strNumberVariable(i);

    return RPM::translate(Translations::MODIFY_INVENTORY) + RPM::COLON + RPM
        ::SPACE + selection + RPM::SPACE + operation + RPM::SPACE + number;
}

// -------------------------------------------------------

QString EventCommand::strModifyInventorySelection(QStandardItemModel *properties,
    QStandardItemModel *parameters, int &i) const
{
    QString selection;
    int objectType;

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
    switch(objectType)
    {
    case 0:
        selection += this->strDataBaseId(i, properties, RPM::get()->project()
            ->gameDatas()->itemsDatas()->model(), parameters);
        break;
    case 1:
        selection += this->strDataBaseId(i, properties, RPM::get()->project()
            ->gameDatas()->weaponsDatas()->model(), parameters);
        break;
    case 2:
        selection += this->strDataBaseId(i, properties, RPM::get()->project()
            ->gameDatas()->armorsDatas()->model(), parameters);
        break;
    }

    return selection;
}

// -------------------------------------------------------

QString EventCommand::strModifyTeam(QStandardItemModel *properties,
    QStandardItemModel *parameters) const
{
    int i = 0;
    int kind = m_listCommand.at(i++).toInt();
    QString operation;
    switch (kind)
    {
    case 0:
    {
        operation += RPM::translate(Translations::CREATE_NEW_INSTANCE_WITH_LEVEL)
            .toLower() + RPM::SPACE;
        operation += this->strProperty(i, properties, parameters) + RPM::SPACE +
            RPM::translate(Translations::IN_MESSAGE).toLower() + RPM::SPACE;
        operation += RPM::ENUM_TO_STRING_TEAM.at(m_listCommand.at(i++).toInt())
            .toLower() + RPM::SPACE + RPM::translate(Translations::OF).toLower()
            + RPM::SPACE;
        QString stockVariable = this->strProperty(i, properties, parameters);
        int kindNew = m_listCommand.at(i++).toInt();
        if (kindNew == 0)
        {
            operation += RPM::translate(Translations::HERO_ID).toLower() + RPM::SPACE +
                this->strDataBaseId(i, properties, RPM::get()->project()
                ->gameDatas()->heroesDatas()->model(), parameters);
        } else if (kindNew == 1)
        {
            operation += RPM::translate(Translations::MONSTER_ID).toLower() + RPM::SPACE +
                this->strDataBaseId(i, properties, RPM::get()->project()
                ->gameDatas()->monstersDatas()->model(), parameters);
        }
        operation += RPM::SPACE + RPM::translate(Translations::AND_STOCK_IN_VARIABLE)
            + RPM::SPACE + stockVariable;
        break;
    }
    case 1:
        operation += RPM::translate(Translations::ADD_ENEMY_INSTANCE_ID) + RPM
            ::SPACE + this->strProperty(i, properties, parameters) + RPM::SPACE +
            RPM::translate(Translations::IN_MESSAGE) + RPM::SPACE;
        operation += RPM::ENUM_TO_STRING_TEAM.at(m_listCommand.at(i++).toInt());
        break;
    case 2:
        bool move = m_listCommand.at(i++).toInt() == 0;
        operation += RPM::translate(Translations::MODIFY) + RPM::SPACE + (
            move ? RPM::translate(Translations::MOVE_VERB) : RPM::translate(
            Translations::REMOVE)) + RPM::SPACE + RPM::translate(Translations
            ::CHARACTER_WITH_INSTANCE_ID) + RPM::SPACE + this->strProperty(i,
            properties, parameters);
        if (move)
        {
            operation += RPM::SPACE + RPM::translate(Translations::TO).toLower() +
                RPM::SPACE + RPM::ENUM_TO_STRING_TEAM.at(m_listCommand.at(i++)
                .toInt());
        }
        break;
    }
    return RPM::translate(Translations::MODIFY_TEAM) + RPM::COLON + RPM::SPACE
        + operation;
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

QString EventCommand::strChangeState(QStandardItemModel *properties,
    QStandardItemModel *parameters) const
{
    int i = 0;
    QString mapID;
    switch (m_listCommand.at(i + 1).toInt())
    {
    case -1:
        mapID = RPM::translate(Translations::THIS_MAP);
        i += 2;
        break;
    default:
        mapID = this->strProperty(i, properties, parameters);
        break;
    }
    QString objectID;
    switch (m_listCommand.at(i + 1).toInt())
    {
    case -1:
        objectID = RPM::translate(Translations::THIS_OBJECT);
        i += 2;
        break;
    case 0:
        objectID = RPM::translate(Translations::HERO);
        break;
    default:
        objectID = this->strProperty(i, properties, parameters);
        break;
    }
    QString value = this->strDataBaseId(i, properties, RPM::get()->project()
        ->gameDatas()->commonEventsDatas()->modelStates(), parameters);
    QString operation = this->strChangeStateOperation(i);

    return RPM::translate(Translations::CHANGE_STATE) + RPM::COLON + RPM::SPACE
        + RPM::translate(Translations::MAP_ID) + RPM::SPACE + mapID + RPM::COMMA
        + RPM::SPACE + RPM::translate(Translations::OBJECT_ID) + RPM::SPACE +
        objectID + RPM::NEW_LINE + operation + value;
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

QString EventCommand::strSendEvent(QStandardItemModel *properties,
    QStandardItemModel *parameters) const
{
    QStandardItemModel *model;
    SystemObjectEvent *e;
    QString target, event;
    int i = 0;

    target = strSendEventTarget(properties, parameters, i);
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

QString EventCommand::strSendEventTarget(QStandardItemModel *properties,
    QStandardItemModel *parameters, int &i) const
{
    QString str;
    int index;
    QStringList opts;
    index = m_listCommand.at(i++).toInt();
    switch (index) {
    case 0:
        str += RPM::translate(Translations::ALL).toLower();
        break;
    case 1:
        str += RPM::translate(Translations::DETECTION).toLower() + RPM::SPACE +
            this->strDataBaseId(i, properties, RPM::get()->project()->gameDatas()
            ->systemDatas()->modelDetections(), parameters);
        if (m_listCommand.at(i++) == RPM::TRUE_BOOL_STRING) {
            opts << RPM::translate(Translations::SENDER_CANT_RECEIVE).toLower();
        }
        if (m_listCommand.at(i++) == RPM::TRUE_BOOL_STRING) {
            opts << RPM::translate(Translations::ONLY_THE_CLOSEST).toLower();
        }
        if (!opts.isEmpty()) {
            str += RPM::SPACE + RPM::PARENTHESIS_LEFT + opts.join(", ") + RPM
                ::PARENTHESIS_RIGHT;
        }
        break;
    case 2:
        str += RPM::translate(Translations::OBJECT).toLower() + RPM::SPACE +
            this->strMoveObjectID(properties, parameters, i);
        break;
    }

    return str;
}

// -------------------------------------------------------

QString EventCommand::strTeleportObject(QStandardItemModel *properties,
    QStandardItemModel *parameters) const
{
    QString strObj, strPosition, strOptions;
    int i;

    i = 0;
    strObj = this->strMoveObjectID(properties, parameters, i);
    strPosition = this->strTeleportObjectPosition(properties, parameters, i);
    strOptions = this->strTeleportObjectOptions(i);

    return RPM::translate(Translations::TELEPORT_OBJECT) + RPM::COLON + RPM
        ::SPACE + strObj + RPM::SPACE + RPM::translate(Translations
        ::TO_THE_COORDINATES).toLower() + RPM::NEW_LINE + strOptions + RPM
        ::NEW_LINE + strPosition;
}

// -------------------------------------------------------

QString EventCommand::strTeleportObjectPosition(QStandardItemModel *properties,
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

    return "\t" + this->strMoveObjectID(properties, parameters, i) + RPM::SPACE +
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
        listOptions << str + RPM::translate(Translations::SOUTH); break;
    case 2:
        listOptions << str + RPM::translate(Translations::WEST); break;
    case 3:
        listOptions << str + RPM::translate(Translations::NORTH); break;
    case 4:
        listOptions << str + RPM::translate(Translations::EAST); break;
    }
    strOptions += listOptions.join(";");
    strOptions += RPM::BRACKET_RIGHT;
    return strOptions;
}

// -------------------------------------------------------

QString EventCommand::strMoveObject(QStandardItemModel *properties,
    QStandardItemModel *parameters) const
{
    QString strObj, strOptions, strMoves;
    int i;

    i = 0;
    strObj = this->strMoveObjectID(properties, parameters, i);
    strOptions = this->strMoveObjectOptions(i);
    strMoves = this->strMoveObjectMoves(i);

    return RPM::translate(Translations::MOVE_OBJECT) + RPM::COLON + RPM::SPACE +
        strObj + RPM::NEW_LINE + strOptions + strMoves;
}

// -------------------------------------------------------

QString EventCommand::strMoveObjectID(QStandardItemModel *properties,
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
    strObj = this->strDataBaseId(i, properties, modelObjects, parameters);

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

QString EventCommand::strMoveObjectMoves(int &i) const
{
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

QString EventCommand::strWait(QStandardItemModel *properties, QStandardItemModel
    *parameters) const
{
    int i = 0;

    return RPM::translate(Translations::WAIT) + RPM::COLON + RPM::SPACE + this
        ->strProperty(i, properties, parameters) + RPM::SPACE + RPM::translate(
        Translations::SECONDS);
}

// -------------------------------------------------------

QString EventCommand::strMoveCamera(QStandardItemModel *properties,
    QStandardItemModel *parameters) const
{
    QString target, operation, move, rotation, zoom, options;
    int i;

    i = 0;
    target = this->strMoveCameraTarget(properties, parameters, i);
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

QString EventCommand::strMoveCameraTarget(QStandardItemModel *properties,
    QStandardItemModel *parameters, int &i) const
{
    int targetKind;

    targetKind = m_listCommand.at(i++).toInt();
    switch (targetKind) {
    case 0:
        return RPM::translate(Translations::UNCHANGED);
    case 1:
        return RPM::translate(Translations::OBJECT) + RPM::SPACE + this
            ->strMoveObjectID(properties, parameters, i);
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

QString EventCommand::strPlaySong(QStandardItemModel *properties, QStandardItemModel
    *parameters, SongKind kind, int &i) const
{
    QString idNumber, id, volume, start, end;
    bool isIDNumber, isStart, isEnd;
    isIDNumber = m_listCommand.at(i++) == RPM::TRUE_BOOL_STRING;
    idNumber = this->strProperty(i, properties, parameters);
    id = SuperListItem::getById(RPM::get()->project()->songsDatas()->model(kind)
        ->invisibleRootItem(), m_listCommand.at(i++).toInt())->toString();
    volume = this->strProperty(i, properties, parameters);
    isStart = m_listCommand.at(i++) == RPM::TRUE_BOOL_STRING;
    start = this->strProperty(i, properties, parameters);
    isEnd = m_listCommand.at(i++) == RPM::TRUE_BOOL_STRING;
    end = this->strProperty(i, properties, parameters);
    return (isIDNumber ? RPM::translate(Translations::WITH_ID).toLower() + RPM
        ::SPACE + idNumber : id) + RPM::SPACE + RPM::translate(Translations
        ::WITH_VOLUME).toLower() + RPM::COLON + RPM::SPACE + volume + (isStart ?
        RPM::NEW_LINE + RPM::translate(Translations::START) + RPM::COLON + RPM
        ::SPACE + start : "") + (isEnd ? RPM::NEW_LINE + RPM::translate(
        Translations::END) + RPM::COLON + RPM::SPACE + end : "");
}

QString EventCommand::strPlayMusic(QStandardItemModel *properties,
    QStandardItemModel *parameters) const
{
    int i = 0;
    return RPM::translate(Translations::PLAY_MUSIC) + RPM::COLON + RPM::SPACE +
        this->strPlaySong(properties, parameters, SongKind::Music, i);
}

// -------------------------------------------------------

QString EventCommand::strPlayBackgroundSound(QStandardItemModel *properties,
    QStandardItemModel *parameters) const
{
    int i = 0;
    return RPM::translate(Translations::PLAY_BACKGROUND_SOUND) + RPM::COLON +
        RPM::SPACE + this->strPlaySong(properties, parameters, SongKind
        ::BackgroundSound, i);
}

// -------------------------------------------------------

QString EventCommand::strPlaySound(QStandardItemModel *properties,
    QStandardItemModel *parameters) const
{
    int i = 0;
    return RPM::translate(Translations::PLAY_A_SOUND) + RPM::COLON + RPM::SPACE
        + this->strPlaySong(properties, parameters, SongKind::Sound, i);
}

// -------------------------------------------------------

QString EventCommand::strPlayMusicEffect(QStandardItemModel *properties,
    QStandardItemModel *parameters) const
{
    int i = 0;
    return RPM::translate(Translations::PLAY_MUSIC_EFFECT) + RPM::COLON + RPM
        ::SPACE + this->strPlaySong(properties, parameters, SongKind::MusicEffect, i);
}

// -------------------------------------------------------

QString EventCommand::strStopSong(QStandardItemModel *properties, QStandardItemModel
    *parameters) const
{
    int i = 0;
    return this->strProperty(i, properties, parameters) + RPM::SPACE + RPM
        ::translate(Translations::SECONDS);
}

// -------------------------------------------------------

QString EventCommand::strStopMusic(QStandardItemModel *properties,
    QStandardItemModel *parameters) const
{
    return RPM::translate(Translations::STOP_MUSIC) + RPM::COLON + RPM::SPACE +
        this->strStopSong(properties, parameters);
}

// -------------------------------------------------------

QString EventCommand::strStopBackgroundSound(QStandardItemModel *properties,
    QStandardItemModel *parameters) const
{
    return RPM::translate(Translations::STOP_BACKGROUND_SOUND) + RPM::COLON +
        RPM::SPACE + this->strStopSong(properties, parameters);
}

// -------------------------------------------------------

QString EventCommand::strChangeProperty(QStandardItemModel *properties,
    QStandardItemModel *parameters) const
{
    QString propertyID, operation, newValue;
    int i;

    i = 0;
    propertyID = this->strDataBaseId(i, properties, properties, parameters);
    operation = this->strChangeVariablesOperation(i);
    newValue = this->strProperty(i, properties, parameters);

    return RPM::translate(Translations::CHANGE_PROPERTY) + RPM::COLON + RPM
        ::SPACE + RPM::translate(Translations::PROPERTY_ID).toLower() + RPM
        ::SPACE + propertyID + RPM::SPACE + operation + RPM::SPACE + newValue;
}

// -------------------------------------------------------

QString EventCommand::strDisplayChoice(QStandardItemModel *properties,
    QStandardItemModel *parameters) const
{
    int i = 0;
    int l = this->commandsCount();
    QString cancelIndex = this->strProperty(i, properties, parameters);
    QString maxChoices = this->strProperty(i, properties, parameters);
    SystemTranslatable *lang = nullptr;
    QStringList choices;
    QString next;
    while (i < l)
    {
        next = m_listCommand.at(i);
        if (next == RPM::DASH)
        {
            i += 1;
            if (lang != nullptr)
            {
                choices << lang->name();
                delete lang;
            }
            lang = new SystemTranslatable;
        } else
        {
            lang->initializeCommand(this, i);
        }
    }
    if (lang != nullptr)
    {
        choices << lang->name();
        delete lang;
    }
    return RPM::translate(Translations::DISPLAY_CHOICES) + RPM::COLON + RPM
        ::SPACE + RPM::BRACKET_LEFT + RPM::translate(Translations
        ::CANCEL_AUTO_INDEX).toLower() + RPM::EQUAL + cancelIndex + RPM::COMMA +
        RPM::SPACE + RPM::translate(Translations::MAX_NUMBER_CHOICES_DISPLAY)
        .toLower() + RPM::EQUAL + maxChoices + RPM::BRACKET_RIGHT + RPM::NEW_LINE +
        choices.join(RPM::SPACE + "|" + RPM::SPACE);
}

// -------------------------------------------------------

QString EventCommand::strChoice() const {
    return RPM::translate(Translations::CHOICE) + RPM::SPACE + m_listCommand.at(
        0) + RPM::COLON;
}

// -------------------------------------------------------

QString EventCommand::strScript(QStandardItemModel *properties, QStandardItemModel
    *parameters) const
{
    QString script;
    int i;

    i = 0;
    if (m_listCommand.at(i++) == RPM::TRUE_BOOL_STRING) {
        script = this->strProperty(i, properties, parameters);
    } else {
        script = m_listCommand.at(i);
    }

    return RPM::translate(Translations::SCRIPT) + RPM::COLON + RPM::SPACE +
        script;
}

// -------------------------------------------------------

QString EventCommand::strDisplayAPicture(QStandardItemModel *properties,
    QStandardItemModel *parameters) const
{
    QString id, index, origin, x, y, zoom, opacity, angle;
    int i;

    i = 0;
    id = this->strProperty(i, properties, parameters, true);
    index = this->strProperty(i, properties, parameters);
    origin = m_listCommand.at(i++) == RPM::TRUE_BOOL_STRING ? RPM::translate(
        Translations::CENTER) : RPM::translate(Translations::TOP_LEFT);
    x = this->strProperty(i, properties, parameters);
    y = this->strProperty(i, properties, parameters);
    zoom = this->strProperty(i, properties, parameters);
    opacity = this->strProperty(i, properties, parameters);
    angle = this->strProperty(i, properties, parameters);

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

QString EventCommand::strSetMoveTurnAPicture(QStandardItemModel *properties,
    QStandardItemModel *parameters) const
{
    QString index, time, options;
    bool checked, waitEnd;
    int i;

    i = 0;
    index = this->strProperty(i, properties, parameters);
    checked = RPM::stringToBool(m_listCommand.at(i++));
    if (checked) {
        options += "\n    " + RPM::translate(Translations::IMAGE_ID) + RPM
            ::COLON + RPM::SPACE + this->strProperty(i, properties, parameters, true);
    }
    checked = RPM::stringToBool(m_listCommand.at(i++));
    if (checked) {
        options += "\n    " + RPM::translate(Translations::ZOOM) + RPM::COLON +
            RPM::SPACE + this->strProperty(i, properties, parameters) + "%";
    }
    checked = RPM::stringToBool(m_listCommand.at(i++));
    if (checked) {
        options += "\n    " + RPM::translate(Translations::OPACITY) + RPM::COLON
            + RPM::SPACE + this->strProperty(i, properties, parameters) + "%";
    }
    checked = RPM::stringToBool(m_listCommand.at(i++));
    if (checked) {
        options += "\n    " + RPM::translate(Translations::X) + RPM::COLON + RPM
            ::SPACE + this->strProperty(i, properties, parameters);
    }
    checked = RPM::stringToBool(m_listCommand.at(i++));
    if (checked) {
        options += "\n    " + RPM::translate(Translations::Y) + RPM::COLON + RPM
            ::SPACE + this->strProperty(i, properties, parameters);
    }
    checked = RPM::stringToBool(m_listCommand.at(i++));
    if (checked) {
        options += "\n    " + RPM::translate(Translations::ANGLE) + RPM::COLON +
            RPM::SPACE + this->strProperty(i, properties, parameters) + "°";
    }
    time = this->strProperty(i, properties, parameters);
    waitEnd = RPM::stringToBool(m_listCommand.at(i++));

    return RPM::translate(Translations::SET_MOVE_TURN_A_PICTURE) + RPM::COLON +
        RPM::SPACE + RPM::translate(Translations::INDEX).toLower() + RPM::EQUAL
        + index + RPM::SPACE + RPM::translate(Translations::WITH_TIME).toLower()
        + RPM::EQUAL + time + RPM::translate(Translations::SECONDS) + (waitEnd ?
        RPM::BRACKET_LEFT + RPM::translate(Translations::WAIT_END) + RPM
        ::BRACKET_RIGHT : "") + RPM::COLON + options;
}

// -------------------------------------------------------

QString EventCommand::strRemoveAPicture(QStandardItemModel *properties,
    QStandardItemModel *parameters) const
{
    int i = 0;

    return RPM::translate(Translations::REMOVE_A_PICTURE) + RPM::COLON + RPM
        ::SPACE + RPM::translate(Translations::INDEX).toLower() + RPM::EQUAL +
        this->strProperty(i, properties, parameters);
}

// -------------------------------------------------------

QString EventCommand::strSetDialogBoxOptions(QStandardItemModel *properties,
    QStandardItemModel *parameters) const
{
    QString options;
    bool checked;
    int i;

    i = 0;
    checked = RPM::stringToBool(m_listCommand.at(i++));
    if (checked) {
        options += "\n    " + RPM::translate(Translations::WINDOW_SKIN_ID) + RPM
            ::COLON + RPM::SPACE + this->strDataBaseId(i, properties, RPM::get()
            ->project()->gameDatas()->systemDatas()->modelWindowSkins(),
            parameters);
    }
    checked = RPM::stringToBool(m_listCommand.at(i++));
    if (checked) {
        options += "\n    " + RPM::translate(Translations::X) + RPM::COLON + RPM
            ::SPACE + this->strProperty(i, properties, parameters);
    }
    checked = RPM::stringToBool(m_listCommand.at(i++));
    if (checked) {
        options += "\n    " + RPM::translate(Translations::Y) + RPM::COLON + RPM
            ::SPACE + this->strProperty(i, properties, parameters);
    }
    checked = RPM::stringToBool(m_listCommand.at(i++));
    if (checked) {
        options += "\n    " + RPM::translate(Translations::WIDTH) + RPM::COLON +
            RPM::SPACE + this->strProperty(i, properties, parameters);
    }
    checked = RPM::stringToBool(m_listCommand.at(i++));
    if (checked) {
        options += "\n    " + RPM::translate(Translations::HEIGHT) + RPM::COLON
            + RPM::SPACE + this->strProperty(i, properties, parameters);
    }
    checked = RPM::stringToBool(m_listCommand.at(i++));
    if (checked) {
        options += "\n    " + RPM::translate(Translations::PADDING_LEFT) + RPM
            ::COLON + RPM::SPACE + this->strProperty(i, properties, parameters);
    }
    checked = RPM::stringToBool(m_listCommand.at(i++));
    if (checked) {
        options += "\n    " + RPM::translate(Translations::PADDING_TOP) + RPM
            ::COLON + RPM::SPACE + this->strProperty(i, properties, parameters);
    }
    checked = RPM::stringToBool(m_listCommand.at(i++));
    if (checked) {
        options += "\n    " + RPM::translate(Translations::PADDING_RIGHT) + RPM
            ::COLON + RPM::SPACE + this->strProperty(i, properties, parameters);
    }
    checked = RPM::stringToBool(m_listCommand.at(i++));
    if (checked) {
        options += "\n    " + RPM::translate(Translations::PADDING_BOTTOM) + RPM
            ::COLON + RPM::SPACE + this->strProperty(i, properties, parameters);
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
            ::COLON + RPM::SPACE + this->strProperty(i, properties, parameters);
    }
    checked = RPM::stringToBool(m_listCommand.at(i++));
    if (checked) {
        options += "\n    " + RPM::translate(Translations::FACESET_Y) + RPM
            ::COLON + RPM::SPACE + this->strProperty(i, properties, parameters);
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
            + RPM::COLON + RPM::SPACE + this->strDataBaseId(i, properties, RPM
            ::get()->project()->gameDatas()->systemDatas()->modelColors(),
            parameters);
    }
    checked = RPM::stringToBool(m_listCommand.at(i++));
    if (checked) {
        options += "\n    " + RPM::translate(Translations::TEXT_COLOR_ID_OUTLINE
            ) + RPM::COLON + RPM::SPACE + this->strDataBaseId(i, properties, RPM
            ::get()->project()->gameDatas()->systemDatas()->modelColors(),
            parameters);
    }
    checked = RPM::stringToBool(m_listCommand.at(i++));
    if (checked) {
        options += "\n    " + RPM::translate(Translations
            ::TEXT_COLOR_ID_BACKGROUND) + RPM::COLON + RPM::SPACE + this
            ->strDataBaseId(i, properties, RPM::get()->project()->gameDatas()
            ->systemDatas()->modelColors(), parameters);
    }
    checked = RPM::stringToBool(m_listCommand.at(i++));
    if (checked) {
        options += "\n    " + RPM::translate(Translations::TEXT_SIZE_ID) + RPM
            ::COLON + RPM::SPACE + this->strDataBaseId(i, properties, RPM::get()
            ->project()->gameDatas()->systemDatas()->modelFontSizes(),
            parameters);
    }
    checked = RPM::stringToBool(m_listCommand.at(i++));
    if (checked) {
        options += "\n    " + RPM::translate(Translations::TEXT_FONT_ID) + RPM
            ::COLON + RPM::SPACE + this->strDataBaseId(i, properties, RPM::get()
            ->project()->gameDatas()->systemDatas()->modelFontNames(),
            parameters);
    }

    return RPM::translate(Translations::SET_DIALOG_BOX_OPTIONS) + RPM::COLON +
        RPM::SPACE + options;
}

// -------------------------------------------------------

QString EventCommand::strChangeScreenTone(QStandardItemModel *properties,
    QStandardItemModel *parameters) const
{
    QString red, green, blue, grey, operation, color, time;
    int i;

    i = 0;
    red = this->strProperty(i, properties, parameters);
    green = this->strProperty(i, properties, parameters);
    blue = this->strProperty(i, properties, parameters);
    grey = this->strProperty(i, properties, parameters) + "%";
    if (RPM::stringToBool(m_listCommand.at(i++))) {
        operation = RPM::stringToBool(m_listCommand.at(i++)) ? "-" : "+";
        color = operation + RPM::SPACE + RPM::translate(Translations::COLOR)
            .toLower() + RPM::SPACE + this->strDataBaseId(i, properties, RPM::get()
            ->project()->gameDatas()->systemDatas()->modelColors(), parameters)
            + RPM::NEW_LINE;
    }
    if (RPM::stringToBool(m_listCommand.at(i++))) {
        time += RPM::BRACKET_LEFT + RPM::translate(Translations::WAIT_END) + RPM
            ::BRACKET_RIGHT;
    }
    time += RPM::translate(Translations::TIME).toUpper() + RPM::COLON + RPM
        ::SPACE + this->strProperty(i, properties, parameters) + RPM::SPACE + RPM
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

QString EventCommand::strRemoveObjectFromMap(QStandardItemModel *properties,
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
    obj = this->strDataBaseId(i, properties, modelObjects, parameters);

    if (RPM::isInConfig && !RPM::isInObjectConfig) {
        SuperListItem::deleteModel(modelObjects);
    }

    return RPM::translate(Translations::REMOVE_OBJECT_FROM_MAP) + RPM::COLON +
        RPM::SPACE + RPM::translate(Translations::ID) + RPM::EQUAL + obj;
}

// -------------------------------------------------------

QString EventCommand::strAllowForbidSaves(QStandardItemModel *properties,
    QStandardItemModel *parameters) const
{
    int i = 0;
    return RPM::translate(Translations::ALLOW_SAVES) + RPM::COLON + RPM::SPACE +
        this->strProperty(i, properties, parameters);
}

// -------------------------------------------------------

QString EventCommand::strAllowForbidMainMenu(QStandardItemModel *properties,
    QStandardItemModel *parameters) const
{
    int i = 0;
    return RPM::translate(Translations::ALLOW_MAIN_MENU) + RPM::COLON + RPM
        ::SPACE + this->strProperty(i, properties, parameters);
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

QString EventCommand::strLabel(bool jump, QStandardItemModel *properties,
    QStandardItemModel *parameters) const
{
    int i = 0;
    return RPM::translate(jump ? Translations::JUMP_TO_LABEL : Translations
        ::LABEL) + RPM::COLON + RPM::SPACE + this->strProperty(i, properties,
        parameters);
}

// -------------------------------------------------------

QString EventCommand::strComment() const
{
    return "# " + this->valueCommandAt(0);
}

// -------------------------------------------------------

QString EventCommand::strChangeAStatistic(QStandardItemModel *properties,
    QStandardItemModel *parameters) const
{
    int i = 0;
    QString statistic = RPM::translate(Translations::STATISTIC_ID) + RPM::SPACE
        + this->strDataBaseId(i, properties, RPM::get()->project()->gameDatas()
        ->battleSystemDatas()->modelCommonStatistics(), parameters);
    QString selection;
    switch (m_listCommand.at(i++).toInt())
    {
    case 0:
        selection += RPM::translate(Translations::HERO_ENEMY_INSTANCE_ID) + RPM
            ::SPACE + this->strProperty(i, properties, parameters);
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
            ->strProperty(i, properties, parameters);
        break;
    case 1:
        value = RPM::translate(Translations::FORMULA) + RPM::SPACE + this
            ->strProperty(i, properties, parameters);
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

QString EventCommand::strChangeASkill(QStandardItemModel *properties,
    QStandardItemModel *parameters) const
{
    int i = 0;
    QString skill = RPM::translate(Translations::SKILL_ID) + RPM::SPACE
        + this->strDataBaseId(i, properties, RPM::get()->project()->gameDatas()
        ->skillsDatas()->model(), parameters);
    QString selection;
    switch (m_listCommand.at(i++).toInt())
    {
    case 0:
        selection += RPM::translate(Translations::HERO_ENEMY_INSTANCE_ID) + RPM
            ::SPACE + this->strProperty(i, properties, parameters);
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

QString EventCommand::strOperationAddRemove(int &i) const
{
    QString str;
    switch (m_listCommand.at(i++).toInt())
    {
    case 0:
        str += RPM::translate(Translations::ADD);
        break;
    case 1:
        str += RPM::translate(Translations::REMOVE);
        break;
    }
    return str;
}

// -------------------------------------------------------

QString EventCommand::strChangeName(QStandardItemModel *properties,
    QStandardItemModel *parameters) const
{
    QString selection;
    int i = 0;
    QString name = this->strProperty(i, properties, parameters);
    switch (m_listCommand.at(i++).toInt())
    {
    case 0:
        selection += RPM::translate(Translations::HERO_ENEMY_INSTANCE_ID) + RPM
            ::SPACE + this->strProperty(i, properties, parameters);
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

QString EventCommand::strChangeEquipment(QStandardItemModel *properties,
    QStandardItemModel *parameters) const
{
    int i = 0;
    QString equipment = RPM::translate(Translations::EQUIMENT_ID) + RPM::SPACE +
        this->strDataBaseId(i, properties, RPM::get()->project()->gameDatas()
        ->battleSystemDatas()->modelCommonEquipment(), parameters) + RPM::SPACE
        + RPM::translate(Translations::WITH).toLower() + RPM::SPACE;
    bool isWeapon = RPM::stringToBool(m_listCommand.at(i++));
    equipment += RPM::translate(isWeapon ? Translations::WEAPON_ID :
        Translations::ARMOR_ID) + RPM::SPACE;
    equipment += this->strDataBaseId(i, properties, isWeapon ? RPM::get()->project()
        ->gameDatas()->weaponsDatas()->model() : RPM::get()->project()
        ->gameDatas()->armorsDatas()->model(),  parameters);
    QString selection;
    switch (m_listCommand.at(i++).toInt())
    {
    case 0:
        selection += RPM::translate(Translations::HERO_ENEMY_INSTANCE_ID) + RPM
            ::SPACE + this->strProperty(i, properties, parameters);
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

QString EventCommand::strModifyCurrency(QStandardItemModel *properties,
    QStandardItemModel *parameters) const
{
    int i = 0;
    QString currency = RPM::translate(Translations::CURRENCY_ID) + RPM::SPACE +
        this->strDataBaseId(i, properties, RPM::get()->project()->gameDatas()
        ->systemDatas()->modelCurrencies(), parameters);
    QString operation = this->strChangeVariablesOperation(i);
    QString value = this->strProperty(i, properties, parameters);

    return RPM::translate(Translations::MODIFY_CURRENCY) + RPM::COLON + RPM
        ::SPACE + currency + RPM::SPACE + operation + RPM::SPACE + value;
}

// -------------------------------------------------------

QString EventCommand::strDisplayAnAnimation(QStandardItemModel *properties,
    QStandardItemModel *parameters) const
{
    int i = 0;
    QString objectID = RPM::translate(Translations::OBJECT_ID) + RPM::SPACE +
        this->strMoveObjectID(properties, parameters, i);
    QString animation = RPM::translate(Translations::ANIMATION_ID) + RPM::SPACE
        + this->strDataBaseId(i, properties, RPM::get()->project()->gameDatas()
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

QString EventCommand::strShakeScreen(QStandardItemModel *properties,
    QStandardItemModel *parameters) const
{
    int i = 0;

    QString offset = this->strProperty(i, properties, parameters);
    QString shakesNumber = this->strProperty(i, properties, parameters);
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

QString EventCommand::strFlashScreen(QStandardItemModel *properties,
    QStandardItemModel *parameters) const
{
    int i = 0;

    QString colorID = this->strDataBaseId(i, properties, RPM::get()->project()
        ->gameDatas()->systemDatas()->modelColors(), parameters);
    QString option;
    if (m_listCommand.at(i++) == RPM::TRUE_BOOL_STRING) {
        option += RPM::BRACKET_LEFT + RPM::translate(Translations::WAIT_END) +
            RPM::BRACKET_RIGHT;
    }
    QString time = RPM::translate(Translations::TIME) + RPM::COLON + RPM::SPACE
        + this->strProperty(i, properties, parameters) + RPM::SPACE + RPM::translate
        (Translations::SECONDS);

    return RPM::translate(Translations::FLASH_SCREEN) + RPM::COLON + RPM
        ::NEW_LINE + RPM::translate(Translations::COLOR_ID) + RPM::COLON + RPM
        ::SPACE + colorID + RPM::NEW_LINE + option + RPM::NEW_LINE + time;
}

// -------------------------------------------------------

QString EventCommand::strPlugin(QStandardItemModel *properties, QStandardItemModel
    *parameters) const
{
    int i = 0;

    QString pluginName;
    QString commandName;
    QString commandParameters;
    SystemPlugin *plugin = reinterpret_cast<SystemPlugin *>(SuperListItem
        ::getById(RPM::get()->project()->scriptsDatas()->modelPlugins()
        ->invisibleRootItem(), m_listCommand.at(i++).toInt()));
    if (plugin != nullptr)
    {
        pluginName = plugin->name();
        SystemPluginCommand *command = reinterpret_cast<SystemPluginCommand *>(
            SuperListItem::getById(plugin->commands()->invisibleRootItem(),
            m_listCommand.at(i++).toInt()));
        if (command != nullptr)
        {
            commandName = command->name();
            QStandardItemModel *currentParameters = new QStandardItemModel;
            SuperListItem::copy(currentParameters, command->defaultParameters());
            SystemPluginParameter *param;
            QStringList list;
            for (int j = 0, l = currentParameters->invisibleRootItem()
                ->rowCount(); j < l; j++)
            {
                param = reinterpret_cast<SystemPluginParameter *>(SuperListItem
                    ::getItemModelAt(currentParameters, j));
                if (param != nullptr)
                {
                    if (i < this->commandsCount() - 1)
                    {
                        param->defaultValue()->initializeCommandParameter(this,
                            i);
                    }
                    param->defaultValue()->updateModelsParametersProperties(
                        parameters, properties);
                    list << param->defaultValue()->toString();
                }
            }
            if (!list.isEmpty())
            {
                commandParameters += RPM::PARENTHESIS_LEFT;
                commandParameters += list.join(",");
                commandParameters += RPM::PARENTHESIS_RIGHT;
            }
            SuperListItem::deleteModel(currentParameters);
        }
    }
    return RPM::translate(Translations::PLUGIN) + RPM::COLON + RPM::SPACE +
        pluginName + RPM::SPACE + RPM::DASH + RPM::SPACE + commandName +
        commandParameters;
}

// -------------------------------------------------------

QString EventCommand::strStartShopMenu(QStandardItemModel *properties, QStandardItemModel
    *parameters, bool isRestock) const
{
    int i = 0;
    QString buyOnly;
    if (!isRestock)
    {
        buyOnly = this->strProperty(i, properties, parameters);
    }
    QString shopID = this->strProperty(i, properties, parameters);
    SystemCommandItemPrice *itemPrice;
    QStringList list;
    while (i < this->commandsCount())
    {
        itemPrice = new SystemCommandItemPrice;
        itemPrice->initialize(this, i);
        list << itemPrice->toString();
    }
    return (isRestock ? RPM::translate(Translations::RESTOCK_SHOP) : RPM
        ::translate(Translations::START_SHOP_MENU)) + RPM::COLON + RPM::NEW_LINE
        + list.join(RPM::NEW_LINE) + (isRestock ? "" : (RPM::NEW_LINE + RPM
        ::translate(Translations::BUY_ONLY) + RPM::COLON + RPM::SPACE + buyOnly))
        + RPM::NEW_LINE + RPM::translate(Translations::SHOP_ID) + RPM::COLON +
        RPM::SPACE + shopID;
}

// -------------------------------------------------------

QString EventCommand::strEnterANameMenu(QStandardItemModel *properties,
    QStandardItemModel *parameters) const
{
    int i = 0;
    QString heroInstanceID = this->strProperty(i, properties, parameters);
    QString maxCharacters = this->strProperty(i, properties, parameters);
    return RPM::translate(Translations::ENTER_A_NAME_MENU) + RPM::COLON + RPM
        ::NEW_LINE + RPM::translate(Translations::HERO_WITH_INSTANCE_ID) + RPM
        ::COLON + RPM::SPACE + heroInstanceID + RPM::NEW_LINE + RPM::translate(
        Translations::MAX_CHARACTERS) + RPM::COLON + RPM::SPACE + maxCharacters;
}

// -------------------------------------------------------

QString EventCommand::strCreateObjectInMap(QStandardItemModel *properties, QStandardItemModel
    *parameters) const
{
    int i = 0;
    QString strModelID = this->strProperty(i, properties, parameters);
    QString strPosition = this->strTeleportObjectPosition(properties, parameters, i);
    QString strStockID;
    if (RPM::stringToBool(this->valueCommandAt(i++)))
    {
        strStockID = RPM::BRACKET_LEFT + RPM::translate(Translations::STOCK_INSTANCE_ID_IN)
            .toLower() + RPM::SPACE + this->strProperty(i, properties, parameters) +
            RPM::BRACKET_RIGHT + RPM::SPACE;
    }
    return RPM::translate(Translations::CREATE_OBJECT_IN_MAP) + RPM::COLON + RPM
        ::SPACE + RPM::translate(Translations::NEW_OBJECT_MODEL_ID) + RPM::COLON
        + RPM::SPACE + strModelID + RPM::SPACE + strStockID + RPM::translate(
        Translations::TO_THE_COORDINATES).toLower() + RPM::NEW_LINE + strPosition;
}

// -------------------------------------------------------

QString EventCommand::strChangeStatus(QStandardItemModel *properties,
    QStandardItemModel *parameters) const
{
    int i = 0;
    QString selection;
    switch (m_listCommand.at(i++).toInt())
    {
    case 0:
        selection += RPM::translate(Translations::HERO_ENEMY_INSTANCE_ID) + RPM
            ::SPACE + this->strProperty(i, properties, parameters);
        break;
    case 1:
        selection += RPM::translate(Translations::THE_ENTIRE) + RPM::SPACE + RPM
            ::ENUM_TO_STRING_TEAM.at(m_listCommand.at(i++).toInt());
        break;
    }
    QString operation = this->strOperationAddRemove(i);
    QString status = RPM::translate(Translations::STATUS_ID) + RPM::SPACE
        + this->strDataBaseId(i, properties, RPM::get()->project()->gameDatas()
        ->statusDatas()->model(), parameters);
    return RPM::translate(Translations::CHANGE_STATUS) + RPM::COLON + RPM::SPACE
        + operation + RPM::SPACE + status + RPM::SPACE + selection;
}

// -------------------------------------------------------

QString EventCommand::strChangeBattleMusic(QStandardItemModel *properties,
    QStandardItemModel *parameters) const
{
    int i = 0;
    return RPM::translate(Translations::CHANGE_BATTLE_MUSIC) + RPM::COLON + RPM
        ::SPACE + this->strPlaySong(properties, parameters, SongKind::Music, i);
}

// -------------------------------------------------------

QString EventCommand::strChangeVictoryMusic(QStandardItemModel *properties,
    QStandardItemModel *parameters) const
{
    int i = 0;
    return RPM::translate(Translations::CHANGE_VICTORY_MUSIC) + RPM::COLON + RPM
        ::SPACE + this->strPlaySong(properties, parameters, SongKind::Music, i);
}

// -------------------------------------------------------

QString EventCommand::strForceAnAction(QStandardItemModel *properties,
    QStandardItemModel *parameters, QStandardItemModel *troopMonstersList) const
{
    int i = 0;
    QString battler = RPM::translate(Translations::BATTLER) + RPM::SPACE;
    switch(this->valueCommandAt(i++).toInt())
    {
    case 0:
        battler += RPM::translate(Translations::ENEMY) + RPM::COLON + RPM::SPACE
            + this->strTroopMonstersList(troopMonstersList, i);
        break;
    case 1:
        battler += RPM::translate(Translations::HERO_ENEMY_INSTANCE_ID) + RPM
            ::COLON + RPM::SPACE + this->strProperty(i, properties, parameters);
        break;
    }
    QString action = RPM::translate(Translations::ACTION) + RPM::SPACE;
    switch(this->valueCommandAt(i++).toInt())
    {
    case 0:
        action += RPM::translate(Translations::USE_SKILL_ID) + RPM::COLON + RPM
            ::SPACE + this->strDataBaseId(i, properties, RPM::get()->project()
            ->gameDatas()->skillsDatas()->model(), parameters);
        break;
    case 1:
        action += RPM::translate(Translations::USE_ITEM_ID) + RPM::COLON + RPM
            ::SPACE + this->strDataBaseId(i, properties, RPM::get()->project()
            ->gameDatas()->itemsDatas()->model(), parameters);
        break;
    case 2:
        action += RPM::translate(Translations::DO_NOTHING);
        break;
    }
    QString target = RPM::translate(Translations::TARGET) + RPM::SPACE;
    int index = this->valueCommandAt(i++).toInt();
    switch (index)
    {
    case 0:
        target += RPM::translate(Translations::RANDOM);
        break;
    case 1:
        target += RPM::translate(Translations::LAST_TARGET);
        break;
    case 2:
        switch(this->valueCommandAt(i++).toInt())
        {
        case 0:
            target += RPM::translate(Translations::ENEMY) + RPM::COLON + RPM::SPACE
                + this->strTroopMonstersList(troopMonstersList, i);
            break;
        case 1:
            target += RPM::translate(Translations::HERO_ENEMY_INSTANCE_ID) + RPM
                ::COLON + RPM::SPACE + this->strProperty(i, properties, parameters);
            break;
        }
        break;
    }
    QString option;
    if (RPM::stringToBool(this->valueCommandAt(i++)))
    {
        option += RPM::SPACE + RPM::BRACKET_LEFT + RPM::translate(Translations
            ::USE_BATTLER_TURN) + RPM::BRACKET_RIGHT;
    }
    return RPM::translate(Translations::FORCE_AN_ACTION) + RPM::COLON + RPM::SPACE +
        battler + RPM::SPACE + RPM::DASH + RPM::SPACE + action + RPM::SPACE + RPM
        ::DASH + RPM::SPACE + target + option;
}

// -------------------------------------------------------

QString EventCommand::strChangeMapProperties(QStandardItemModel *properties,
    QStandardItemModel *parameters) const
{
    int i = 0;
    QString str = RPM::translate(Translations::CHANGE_MAP_PROPERTIES) + RPM
        ::COLON + RPM::SPACE;
    switch (m_listCommand.at(i + 1).toInt())
    {
    case -1:
        str += RPM::translate(Translations::THIS_MAP);
        i += 2;
        break;
    default:
        str += this->strProperty(i, properties, parameters);
        break;
    }
    QStringList list;
    if (RPM::stringToBool(this->valueCommandAt(i++)))
    {
        list << RPM::translate(Translations::TILESET_ID) + RPM::COLON + RPM
            ::SPACE + this->strDataBaseId(i, properties, RPM::get()->project()
            ->gameDatas()->tilesetsDatas()->model(), parameters);
    }
    if (RPM::stringToBool(this->valueCommandAt(i++)))
    {
        list << RPM::translate(Translations::MUSIC) + RPM::COLON + RPM::SPACE +
            this->strPlaySong(properties, parameters, SongKind::Music, i);
    }
    if (RPM::stringToBool(this->valueCommandAt(i++)))
    {
        list << RPM::translate(Translations::BACKGROUND_SOUND) + RPM::COLON + RPM
            ::SPACE + this->strPlaySong(properties, parameters, SongKind
            ::BackgroundSound, i);
    }
    if (RPM::stringToBool(this->valueCommandAt(i++)))
    {
        list << RPM::translate(Translations::CAMERA_PROPERTIES_ID) + RPM::COLON +
            RPM::SPACE + this->strDataBaseId(i, properties, RPM::get()->project()
            ->gameDatas()->systemDatas()->modelcameraProperties(), parameters);
    }
    if (RPM::stringToBool(this->valueCommandAt(i++)))
    {
        QString sky = RPM::translate(Translations::SKY) + RPM::COLON + RPM::SPACE;
        switch (this->valueCommandAt(i++).toInt())
        {
        case 0:
            sky += RPM::translate(Translations::COLOR_ID).toLower() + RPM::SPACE +
                this->strDataBaseId(i, properties, RPM::get()->project()
                ->gameDatas()->systemDatas()->modelColors(), parameters);
            break;
        case 1:
            sky += RPM::translate(Translations::SKYBOX_ID).toLower() + RPM::SPACE +
                this->strDataBaseId(i, properties, RPM::get()->project()
                ->gameDatas()->systemDatas()->modelSkyBoxes(), parameters);
            break;
        }
        list << sky;
    }
    str += list.join(RPM::NEW_LINE);
    return str;
}

// -------------------------------------------------------

QString EventCommand::strChangeExperienceCurve(QStandardItemModel *properties,
    QStandardItemModel *parameters) const
{
    int i = 0;
    QString str = RPM::translate(Translations::CHANGE_EXPERIENCE_CURVE) + RPM
        ::COLON + RPM::SPACE;
    switch (m_listCommand.at(i++).toInt())
    {
    case 0:
        str += RPM::translate(Translations::HERO_ENEMY_INSTANCE_ID) + RPM
            ::SPACE + this->strProperty(i, properties, parameters);
        break;
    case 1:
        str += RPM::translate(Translations::THE_ENTIRE) + RPM::SPACE + RPM
            ::ENUM_TO_STRING_TEAM.at(m_listCommand.at(i++).toInt());
        break;
    }
    str += RPM::SPACE + RPM::translate(Translations::LEVEL).toLower() + RPM
        ::SPACE + RPM::translate(Translations::RANGE).toLower() + RPM::SPACE +
        this->strProperty(i, properties, parameters) + RPM::SPACE + RPM::translate(
        Translations::TO).toLower() + RPM::SPACE;
    str += this->strProperty(i, properties, parameters) + RPM::SPACE + RPM::translate(
        Translations::TOTAL_EXPERIENCE).toLower() + RPM::SPACE;
    str += this->strChangeVariablesOperation(i) + RPM::SPACE;
    str += this->strProperty(i, properties, parameters);
    return str;
}

// -------------------------------------------------------

QString EventCommand::strChangeClass(QStandardItemModel *properties, QStandardItemModel
    *parameters) const
{
    int i = 0;
    QString str = RPM::translate(Translations::CHANGE_CLASS) + RPM::COLON + RPM
        ::SPACE + RPM::translate(Translations::CLASS_ID).toLower() + RPM::SPACE +
        this->strProperty(i, properties, parameters) + RPM::SPACE;
    switch (m_listCommand.at(i++).toInt())
    {
    case 0:
        str += RPM::translate(Translations::HERO_ENEMY_INSTANCE_ID) + RPM
            ::SPACE + this->strProperty(i, properties, parameters);
        break;
    case 1:
        str += RPM::translate(Translations::THE_ENTIRE) + RPM::SPACE + RPM
            ::ENUM_TO_STRING_TEAM.at(m_listCommand.at(i++).toInt());
        break;
    }
    return str;
}

// -------------------------------------------------------

QString EventCommand::strChangeChronometer(QStandardItemModel *properties, QStandardItemModel
    *parameters) const
{
    int i = 0;
    QString str = RPM::translate(Translations::CHANGE_CHRONOMETER) + RPM::COLON
        + RPM::SPACE;
    QString id = this->strProperty(i, properties, parameters);
    int operation = this->valueCommandAt(i++).toInt();
    switch (operation)
    {
    case 0:
        str += RPM::translate(Translations::START).toLower();
        break;
    case 1:
        str += RPM::translate(Translations::PAUSE).toLower();
        break;
    case 2:
        str += RPM::translate(Translations::CONTINUE).toLower();
        break;
    case 3:
        str += RPM::translate(Translations::STOP).toLower();
        break;
    }
    str += RPM::SPACE + RPM::translate(Translations::CHRONOMETER_ID).toLower() +
        RPM::SPACE + id;
    if (operation == 0)
    {
        str += RPM::SPACE + RPM::translate(Translations::TIME).toLower() + RPM
            ::SPACE + this->strProperty(i, properties, parameters) + RPM::SPACE +
            RPM::translate(Translations::SECONDS).toLower();
        if (RPM::stringToBool(this->valueCommandAt(i++)))
        {
            str += RPM::SPACE + RPM::BRACKET_LEFT + RPM::translate(Translations
                ::DISPLAY_ON_SCREEN) + RPM::BRACKET_RIGHT;
        }
    } else
    {
        if (RPM::stringToBool(this->valueCommandAt(i++)))
        {
            str += RPM::SPACE + RPM::BRACKET_LEFT + RPM::translate(Translations
                ::STOCK_CURRENT_CHRONOMETER_VALUE_IN_VARIABLE_ID) + RPM::SPACE +
                this->strProperty(i, properties, parameters) + RPM::BRACKET_RIGHT;
        }
    }
    return str;
}

// -------------------------------------------------------

QString EventCommand::strChangeWeather(QStandardItemModel *properties,
    QStandardItemModel *parameters) const
{
    int i = 0;
    QString str = RPM::translate(Translations::CHANGE_WEATHER) + RPM::COLON
        + RPM::SPACE;
    switch (this->valueCommandAt(i++).toInt())
    {
    case 0:
        str += RPM::translate(Translations::NONE);
        break;
    case 1:
        str += RPM::translate(Translations::CUSTOM) + RPM::NEW_LINE;
        QStringList list;
        QString texture = RPM::translate(Translations::TEXTURE) + RPM::COLON +
            RPM::SPACE;
        switch (this->valueCommandAt(i++).toInt())
        {
        case 0:
            texture += RPM::translate(Translations::COLOR_ID) + RPM::COLON + RPM
                ::SPACE + this->strProperty(i, properties, parameters);
            break;
        case 1:
            texture += RPM::translate(Translations::IMAGE) + RPM::COLON + RPM
                ::SPACE + this->strProperty(i, properties, parameters, true);
            break;
        }
        list << texture;
        list << RPM::translate(Translations::NUMBER_PER_PORTION) + RPM::COLON +
            RPM::SPACE + this->strProperty(i, properties, parameters);
        list << RPM::translate(Translations::RAY_PORTIONS) + RPM::COLON +
            RPM::SPACE + this->strProperty(i, properties, parameters);
        list << RPM::translate(Translations::SIZE) + RPM::COLON +
            RPM::SPACE + this->strProperty(i, properties, parameters);
        list << "depthTest" + RPM::COLON + RPM::SPACE + this->strProperty(i,
            properties, parameters);
        list << "depthWrite" + RPM::COLON + RPM::SPACE + this->strProperty(i,
            properties, parameters);
        list << RPM::translate(Translations::INITIAL_VELOCITY) + RPM::COLON +
            RPM::SPACE + this->strProperty(i, properties, parameters);
        list << RPM::translate(Translations::VELOCITY_ADDITION) + RPM::COLON +
            RPM::SPACE + this->strProperty(i, properties, parameters);
        list << RPM::translate(Translations::INITIAL_Y_ROTATION) + RPM::COLON +
            RPM::SPACE + this->strProperty(i, properties, parameters);
        list << RPM::translate(Translations::Y_ROTATION_ADDITION) + RPM::COLON +
            RPM::SPACE + this->strProperty(i, properties, parameters);
        str += list.join(RPM::NEW_LINE);
        break;
    }
    return str;
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
