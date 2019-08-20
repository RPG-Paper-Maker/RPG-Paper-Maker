/*
    RPG Paper Maker Copyright (C) 2017-2019 Wano

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

void EventCommand::setCommands(QVector<QString>& commands) {
    m_listCommand = commands;
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

QString EventCommand::kindToString(EventCommandKind kind) {
    switch (kind) {
    case EventCommandKind::ShowText:
        return "Show text...";
    case EventCommandKind::ChangeVariables:
        return "Change variables...";
    case EventCommandKind::EndGame:
        return "Game Over";
    case EventCommandKind::While:
        return "Loop";
    case EventCommandKind::WhileBreak:
        return "Break loop";
    case EventCommandKind::If:
        return "Condition....";
    case EventCommandKind::OpenMainMenu:
        return "Open main menu";
    case EventCommandKind::OpenSavesMenu:
        return "Open saves menu";
    case EventCommandKind::ModifyInventory:
        return "Modify inventory...";
    case EventCommandKind::ModifyTeam:
        return "Modify team...";
    case EventCommandKind::StartBattle:
        return "Start a battle...";
    case EventCommandKind::ChangeState:
        return "Change state...";
    case EventCommandKind::SendEvent:
        return "Send event...";
    case EventCommandKind::TeleportObject:
        return "Teleport object...";
    case EventCommandKind::MoveObject:
        return "Move object...";
    case EventCommandKind::Wait:
        return "Wait...";
    case EventCommandKind::MoveCamera:
        return "Move camera...";
    case EventCommandKind::PlayMusic:
        return "Play a music...";
    case EventCommandKind::StopMusic:
        return "Stop music...";
    case EventCommandKind::PlayBackgroundSound:
        return "Play a background sound...";
    case EventCommandKind::StopBackgroundSound:
        return "Stop background sound...";
    case EventCommandKind::PlayASound:
        return "Play a sound...";
    case EventCommandKind::PlayMusicEffect:
        return "Play a music effect...";
    case EventCommandKind::ChangeProperty:
        return "Change property...";
    case EventCommandKind::None:
    case EventCommandKind::EndWhile:
        case EventCommandKind::InputNumber:
    case EventCommandKind::Else:
    case EventCommandKind::EndIf:
    case EventCommandKind::IfWin:
    case EventCommandKind::IfLose:
    case EventCommandKind::Last:
        return "";
    }

    return "";
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
        ::OpenMainMenu && m_kind != EventCommandKind::OpenSavesMenu;
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
        str += this->strShowText(); break;
    case EventCommandKind::ChangeVariables:
        str += this->strChangeVariables(object, parameters); break;
    case EventCommandKind::EndGame:
        str += "Game Over"; break;
    case EventCommandKind::While:
        str += "Loop"; break;
    case EventCommandKind::EndWhile:
        str += "End Loop"; break;
    case EventCommandKind::WhileBreak:
        str += "Break loop"; break;
    case EventCommandKind::InputNumber:
        str += strInputNumber(); break;
    case EventCommandKind::If:
        str += strCondition(object, parameters); break;
    case EventCommandKind::Else:
        str += "Else"; break;
    case EventCommandKind::EndIf:
        str += "End If"; break;
    case EventCommandKind::OpenMainMenu:
        str += "Open the main menu"; break;
    case EventCommandKind::OpenSavesMenu:
        str += "Open the saves menu"; break;
    case EventCommandKind::ModifyInventory:
        str += this->strModifyInventory(); break;
    case EventCommandKind::ModifyTeam:
        str += this->strModifyTeam(parameters); break;
    case EventCommandKind::StartBattle:
        str += this->strStartBattle(parameters); break;
    case EventCommandKind::IfWin:
        str += "if Win"; break;
    case EventCommandKind::IfLose:
        str += "if Lose"; break;
    case EventCommandKind::ChangeState:
        str += this->strChangeState(object, parameters); break;
    case EventCommandKind::SendEvent:
        str += this->strSendEvent(object, parameters); break;
    case EventCommandKind::TeleportObject:
        str += this->strTeleportObject(object, parameters); break;
    case EventCommandKind::MoveObject:
        str += this->strMoveObject(parameters); break;
    case EventCommandKind::Wait:
        str += this->strWait(); break;
    case EventCommandKind::MoveCamera:
        str += this->strMoveCamera(parameters); break;
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
        return "Variable " + RPM::get()->project()->gameDatas()
            ->variablesDatas()->getVariableById(value)->toString();
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
        return "Variable " + RPM::get()->project()->gameDatas()
            ->variablesDatas()->getVariableById(value)->toString();
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
        return "None";
    case PrimitiveValueKind::Number:
    case PrimitiveValueKind::NumberDouble:
    case PrimitiveValueKind::Message:
        return value;
    case PrimitiveValueKind::Switch:
        return value == RPM::TRUE_BOOL_STRING ? "ON" : "OFF";
    case PrimitiveValueKind::KeyBoard:
        super = SuperListItem::getById(RPM::get()->project()
            ->keyBoardDatas() ->model()->invisibleRootItem(), value.toInt());
        return "Keyboard " + (super == nullptr ? "" : super->toString());
    case PrimitiveValueKind::Variable:
        super = RPM::get()->project()->gameDatas()->variablesDatas()
            ->getVariableById(value.toInt());
        return "Variable " + (super == nullptr ? "" : super->toString());
    case PrimitiveValueKind::Parameter:
        super = SuperListItem::getById(parameters->invisibleRootItem(), value
            .toInt());
        return "Parameter " + (super == nullptr ? "" : super->toString());
    case PrimitiveValueKind::Property:
        super = SuperListItem::getById(object->modelProperties()
            ->invisibleRootItem(), value.toInt());
        return "Property " + (super == nullptr ? "" : super->toString());
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
        return "Variable " + (super == nullptr ? "" : super->toString());
    case PrimitiveValueKind::Parameter:
        super = SuperListItem::getById(parameters->invisibleRootItem(), value
            .toInt());
        return super == nullptr ? "" : super->toString();
    default:
        return "";
    }
}

// -------------------------------------------------------

QString EventCommand::strShowText() const {
    return "Show text: " + m_listCommand.at(0);
}

// -------------------------------------------------------

QString EventCommand::strChangeVariables(SystemCommonObject *object,
    QStandardItemModel *parameters) const
{
    QString several, selection, operation, value;
    int i;

    i = 0;
    several = "";
    selection = this->strChangeVariablesSelection(i, several);
    operation = this->strChangeVariablesOperation(i);
    value = this->strChangeVariablesValue(i, object, parameters);

    return "Change variable" + several + ": " + selection + " " + operation +
        " " + value;
}

// -------------------------------------------------------

QString EventCommand::strChangeVariablesSelection(int &i, QString &several) const
{
    QString selection, str;

    selection = m_listCommand.at(i++);
    if (selection == RPM::FALSE_BOOL_STRING) {
        str += RPM::get()->project()->gameDatas()->variablesDatas()
            ->getVariableById(m_listCommand.at(i++).toInt())->toString();
    } else {
        several += "s";
        str += m_listCommand.at(i++);
        str += " to ";
        str += m_listCommand.at(i++);
    }

    return str;
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

QString EventCommand::strChangeVariablesValue(int &i, SystemCommonObject *
    , QStandardItemModel *parameters) const
{
    QString value, str;

    value = m_listCommand.at(i++);
    if (value == "0") {
        str += strNumber(i, parameters);
    } else if (value == "1") {
        str += "random number between ";
        str += this->strNumber(i, parameters);
        str += " and ";
        str += this->strNumber(i, parameters);
    }

    return str;
}

// -------------------------------------------------------

QString EventCommand::strInputNumber() const {
    return "Input number in variable " + RPM::get()->project()->gameDatas()
        ->variablesDatas()->getVariableById(m_listCommand.at(0).toInt())
        ->toString();
}

// -------------------------------------------------------

QString EventCommand::strCondition(SystemCommonObject *object,
    QStandardItemModel *parameters) const
{
    QString condition;
    int i, radioIndex, tabIndex;

    i = 1;
    radioIndex = m_listCommand.at(i++).toInt();
    tabIndex = 0;
    switch (tabIndex) {
    case 0:
        condition = this->strConditionPageVariables(object, parameters, i,
            radioIndex);
        break;
    }
    return "if (" + condition + ")";
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

    return "Modify inventory: " + selection + " " + operation + " " + number;
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
        selection += "item "; break;
    case 1:
        selection += "weapon "; break;
    case 2:
        selection += "armor "; break;
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

    return "Modify team: " + operation;
}

// -------------------------------------------------------

QString EventCommand::strModifyTeamInstance(int &i, QStandardItemModel
    *parameters) const
{
    QString level, teamNew, stockVariable, character;
    int kindNew, idNew;

    level = this->strNumber(i, parameters);
    teamNew = RPM::ENUM_TO_STRING_TEAM.at(m_listCommand.at(i++).toInt());
    stockVariable = RPM::get()->project()->gameDatas()->variablesDatas()
        ->getVariableById(m_listCommand.at(i++).toInt())->toString();
    kindNew = m_listCommand.at(i++).toInt();
    idNew = m_listCommand.at(i++).toInt();
    if (kindNew == 0) {
        character += "hero " + SuperListItem::getById(RPM::get()->project()
            ->gameDatas()->heroesDatas()->model()->invisibleRootItem(), idNew)
            ->toString();
    } else if (kindNew == 1) {
        character += "monster ";
    }

    return "create new instance with level " + level + " in " + teamNew + " of "
            + character + " and stock in variable " + stockVariable;
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

    return "Start battle: troop " + troop + " with battle map " + battleMap +
        transition + "\n\n" + options;
}

// -------------------------------------------------------

QString EventCommand::strStartBattleTroop(QStandardItemModel *parameters, int
    &i) const
{
    int kind;

    kind = m_listCommand.at(i++).toInt();
    switch(kind) {
    case 0:
        return "with ID " + this->strDataBaseId(i, nullptr, RPM::get()->project()
            ->gameDatas()->troopsDatas()->model(), parameters);
    case 1:
        return "random (in map property)";
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

    return "\n\tID map: " + id + "\n" + "\tX: " + x + "\n" + "\tY: " + y + "\n"
        + "\tY plus: " + yPlus + "\n" + "\tZ: " + z;
}

// -------------------------------------------------------

QString EventCommand::strStartBattleOptions(int &i) const {
    QStringList listOptions;
    QString strOptions;

    strOptions = "[";
    if (m_listCommand.at(i++) == RPM::TRUE_BOOL_STRING) {
        listOptions << "Allow escape";
    }
    if (m_listCommand.at(i++) == RPM::TRUE_BOOL_STRING) {
        listOptions << "Defeat causes Game Over";
    }
    strOptions += listOptions.join(";");
    strOptions += "]";

    return strOptions;
}

// -------------------------------------------------------

QString EventCommand::strStartBattleTransition(QStandardItemModel *parameters,
    int &i) const
{
    QString transition;
    int type;

    transition = " with transition: ";
    type = m_listCommand.at(i++).toInt();
    transition += this->strStartBattleTransitionType(parameters, i, type, "in");
    transition += " and then ";
    type = m_listCommand.at(i++).toInt();
    transition += this->strStartBattleTransitionType(parameters, i, type, "out");

    return transition;
}

// -------------------------------------------------------

QString EventCommand::strStartBattleTransitionType(QStandardItemModel
    *parameters, int &i, int type, QString name) const
{
    QString transition;

    switch (type) {
    case 0:
        transition += "none";
        break;
    case 1:
        transition += "fade " + name + " " + strDataBaseId(i, nullptr, RPM::get()
            ->project()->gameDatas()->systemDatas()->modelColors(), parameters);
        break;
    case 2:
        transition += "zoom " + name;
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

    return "Change state: " + operation + value;
}

// -------------------------------------------------------

QString EventCommand::strChangeStateOperation(int &i) const {
    QString str;
    int operation;

    operation = m_listCommand.at(i++).toInt();
    switch (operation) {
    case 0:
        str += "pass into"; break;
    case 1:
        str += "add"; break;
    case 2:
        str += "remove"; break;
    }
    str += " state ID ";

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

    return "Send event: to " + target + " with event " + event;
}

// -------------------------------------------------------

QString EventCommand::strSendEventTarget(SystemCommonObject *object,
    QStandardItemModel *parameters, int &i) const
{
    QString str;
    int index, id;

    index = m_listCommand.at(i++).toInt();
    switch (index) {
    case 0:
        str += "all";
        break;
    case 1:
        str += "detection " + strDataBaseId(i, object, RPM::get()->project()
            ->gameDatas()->systemDatas()->modelDetections(), parameters);
        if (m_listCommand.at(i++) == RPM::TRUE_BOOL_STRING) {
            str += " (sender can't receive)";
        }
        break;
    case 2:
        id = m_listCommand.at(i++).toInt();
        str += "object " + QString::number(id);
        break;
    case 3:
        str += "sender";
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
    strObj = this->strMoveObjectID(parameters, i);
    strPosition = this->strTeleportObjectPosition(object, parameters, i);
    strOptions = this->strTeleportObjectOptions(i);

    return "Teleport object: " + strObj + " to the coordinates\n" + strOptions +
        "\n" + strPosition;
}

// -------------------------------------------------------

QString EventCommand::strTeleportObjectPosition(SystemCommonObject*,
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

        return "\tID map: " + id + "\n" + "\tX: " + x + "\n" + "\tY: " + y +
            "\n" + "\tY plus: " + yPlus + "\n" + "\tZ: " + z;
    }

    return "\t" + this->strMoveObjectID(parameters, i) + "'s coordinates";
}

// -------------------------------------------------------

QString EventCommand::strTeleportObjectOptions(int &i) const {
    QStringList listOptions;
    QString strOptions, str;

    strOptions = "[";
    str = "Direction:";
    switch (m_listCommand.at(i++).toInt()) {
    case 0:
        listOptions << str + "Unchanged"; break;
    case 1:
        listOptions << str + "North"; break;
    case 2:
        listOptions << str + "South"; break;
    case 3:
        listOptions << str + "West"; break;
    case 4:
        listOptions << str + "East"; break;
    case 5:
        listOptions << str + "North-West"; break;
    case 6:
        listOptions << str + "North-East"; break;
    case 7:
        listOptions << str + "South-West"; break;
    case 8:
        listOptions << str + "South-East"; break;
    }
    str = "Shading before:";
    listOptions << ((m_listCommand.at(i++) == "0") ? "ON" : "OFF");
    str = "Shading after:";
    listOptions << ((m_listCommand.at(i++) == "0") ? "ON" : "OFF");
    strOptions += listOptions.join(";");
    strOptions += "]";

    return strOptions;
}

// -------------------------------------------------------

QString EventCommand::strMoveObject(QStandardItemModel *parameters) const {
    QString strObj, strOptions, strMoves;
    int i;

    i = 0;
    strObj = this->strMoveObjectID(parameters, i);
    strOptions = this->strMoveObjectOptions(i);
    strMoves = this->strMoveObjectMoves(i);

    return "Move object: " + strObj + "\n" + strOptions + strMoves;
}

// -------------------------------------------------------

QString EventCommand::strMoveObjectID(QStandardItemModel *parameters, int &i) const
{
    QStandardItemModel *modelObjects;
    QString strObj;

    if (RPM::isInConfig && !RPM::isInObjectConfig) {
        modelObjects = new QStandardItemModel;
        Map::setModelObjects(modelObjects);
    } else {
        modelObjects = RPM::get()->project()->currentMap(true)->modelObjects();
    }
    strObj = this->strDataBaseId(i, nullptr, modelObjects, parameters);

    if (RPM::isInConfig && !RPM::isInObjectConfig) {
        SuperListItem::deleteModel(modelObjects);
    }

    return strObj;
}

// -------------------------------------------------------

QString EventCommand::strMoveObjectOptions(int &i) const {
    QStringList listOptions;
    QString strOptions;

    strOptions = "[";
    if (m_listCommand.at(i++) == RPM::TRUE_BOOL_STRING) {
        listOptions << "Ignore";
    }
    if (m_listCommand.at(i++) == RPM::TRUE_BOOL_STRING) {
        listOptions << "Wait end";
    }
    if (m_listCommand.at(i++) == RPM::TRUE_BOOL_STRING) {
        listOptions << "Camera orientation";
    }
    strOptions += listOptions.join(";");
    strOptions += "]";

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

QString EventCommand::strWait() const {
    return "Wait: " + m_listCommand.at(0) + " seconds";
}

// -------------------------------------------------------

QString EventCommand::strMoveCamera(QStandardItemModel *parameters) const {
    QString target, operation, move, rotation, zoom, options;
    int i;

    i = 0;
    target = this->strMoveCameraTarget(parameters, i);
    operation = this->strChangeVariablesOperation(i);
    move = this->strMoveCameraMove(parameters, i, operation);
    rotation = this->strMoveCameraRotation(parameters, i, operation);
    zoom = this->strMoveCameraZoom(parameters, i, operation);
    options = this->strMoveCameraOptions(parameters, i);

    return "Move camera:\nTarget: " + target + "\nMove: " + move +
        "\nRotation: " + rotation + "\nZoom: " + zoom + "\n" + options;
}

// -------------------------------------------------------

QString EventCommand::strMoveCameraTarget(QStandardItemModel *parameters, int
    &i) const
{
    int targetKind;

    targetKind = m_listCommand.at(i++).toInt();
    switch (targetKind) {
    case 0:
        return "Unchanged";
    case 1:
        return "Object " + this->strMoveObjectID(parameters, i);
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
    strOptions = "[";
    if (m_listCommand.at(i++) == RPM::TRUE_BOOL_STRING) {
        listOptions << "Offset";
    }
    if (m_listCommand.at(i++) == RPM::TRUE_BOOL_STRING) {
        listOptions << "Camera orientation";
    }
    strOptions += listOptions.join(";");
    strOptions += "]";

    // Moves
    x = operation + this->strNumber(i, parameters) + " ";
    x += (m_listCommand.at(i++).toInt() == 0 ? "square(s)" : "pixel(s)");
    y = operation + this->strNumber(i, parameters) + " ";
    y += (m_listCommand.at(i++).toInt() == 0 ? "square(s)" : "pixel(s)");
    z = operation + this->strNumber(i, parameters) + " ";
    z += (m_listCommand.at(i++).toInt() == 0 ? "square(s)" : "pixel(s)");

    return "X: " + x + "; Y: " + y + "; Z: " + z + " " + strOptions;
}

// -------------------------------------------------------

QString EventCommand::strMoveCameraRotation(QStandardItemModel *parameters, int
    &i, QString &operation) const
{
    QStringList listOptions;
    QString strOptions, h, v;

    // Options
    strOptions = "[";
    if (m_listCommand.at(i++) == RPM::TRUE_BOOL_STRING) {
        listOptions << "Offset";
    }
    strOptions += listOptions.join(";");
    strOptions += "]";

    // Rotation
    h = operation + this->strNumber(i, parameters) + "°";
    v = operation + this->strNumber(i, parameters) + "°";

    return "H: " + h + "; V: " + v + " " + strOptions;
}

// -------------------------------------------------------

QString EventCommand::strMoveCameraZoom(QStandardItemModel *parameters, int &i,
    QString &operation) const
{
    return "Distance: " + operation + this->strNumber(i, parameters);
}

// -------------------------------------------------------

QString EventCommand::strMoveCameraOptions(QStandardItemModel *parameters, int
    &i) const
{
    QString str;

    if (m_listCommand.at(i++) == RPM::TRUE_BOOL_STRING) {
        str += "[Wait end] ";
    }
    str += "TIME: " + this->strNumber(i, parameters) + " seconds";

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

    return (isIDNumber ? "with ID " + idNumber : id) + " with volume: " +
        volume + (isStart ? "\nStart: " + start : "") + (isEnd ? "\nEnd: " + end
        : "");
}

QString EventCommand::strPlayMusic(SystemCommonObject *object,
    QStandardItemModel *parameters) const
{
    return "Play music: " + this->strPlaySong(object, parameters, SongKind
        ::Music);
}

// -------------------------------------------------------

QString EventCommand::strPlayBackgroundSound(SystemCommonObject *object,
    QStandardItemModel *parameters) const
{
    return "Play background sound: " + this->strPlaySong(object, parameters,
        SongKind::BackgroundSound);
}

// -------------------------------------------------------

QString EventCommand::strPlaySound(SystemCommonObject *object,
    QStandardItemModel *parameters) const
{
    return "Play sound: " + this->strPlaySong(object, parameters, SongKind
        ::Sound);
}

// -------------------------------------------------------

QString EventCommand::strPlayMusicEffect(SystemCommonObject *object,
    QStandardItemModel *parameters) const
{
    return "Play music effect: " + this->strPlaySong(object, parameters,
        SongKind::MusicEffect);
}

// -------------------------------------------------------

QString EventCommand::strStopSong(SystemCommonObject*, QStandardItemModel
    *parameters) const
{
    int i = 0;
    return this->strNumber(i, parameters) + " seconds";
}

QString EventCommand::strStopMusic(SystemCommonObject *object,
    QStandardItemModel *parameters) const
{
    return "Stop music: " + this->strStopSong(object, parameters);
}

// -------------------------------------------------------

QString EventCommand::strStopBackgroundSound(SystemCommonObject *object,
    QStandardItemModel *parameters) const
{
    return "Stop background sound: " + this->strStopSong(object, parameters);
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

    return "Change property: property ID " + propertyID + " " + operation + " "
        + newValue;
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
