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

#include <widgetcomboboxoperation.h>
#include "eventcommand.h"
#include "wanok.h"
#include "widgetcomboboxteam.h"
#include "primitivevaluekind.h"
#include "systemobjectevent.h"
#include "systemcommandmove.h"

QVector<QString> EventCommand::emptyCommandList = QVector<QString>();

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

EventCommand::EventCommand() : EventCommand(EventCommandKind::None)
{

}

EventCommand::EventCommand(EventCommandKind k, QVector<QString> &l) :
    p_kind(k),
    p_listCommand(l)
{

}

EventCommand::~EventCommand()
{

}

EventCommandKind EventCommand::kind() const { return p_kind; }

int EventCommand::commandsCount() const { return p_listCommand.size(); }

QString EventCommand::valueCommandAt(int index) const{
    return p_listCommand.at(index);
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

bool EventCommand::hasElse() const { return p_listCommand[0] == "1"; }

// -------------------------------------------------------

bool EventCommand::isBattleWithoutGameOver() const {
    return p_listCommand[1] == "0";
}

// -------------------------------------------------------

bool EventCommand::isEditable() const{
    return isErasable() &&
         p_kind != EventCommandKind::While &&
         p_kind != EventCommandKind::WhileBreak &&
         p_kind != EventCommandKind::EndWhile &&
         p_kind != EventCommandKind::Else &&
         p_kind != EventCommandKind::EndIf &&
         p_kind != EventCommandKind::EndGame &&
         p_kind != EventCommandKind::OpenMainMenu &&
         p_kind != EventCommandKind::OpenSavesMenu;
}

// -------------------------------------------------------

bool EventCommand::isErasable() const{
    return p_kind != EventCommandKind::None &&
           p_kind != EventCommandKind::EndWhile &&
           p_kind != EventCommandKind::Else &&
           p_kind != EventCommandKind::EndIf &&
           p_kind != EventCommandKind::IfWin &&
           p_kind != EventCommandKind::IfLose;
}

// -------------------------------------------------------

int EventCommand::getSongID(QStandardItemModel *parameters) const
{
    int i = 0;

    bool isIDNumber = p_listCommand.at(i++) == "1";
    QString idNumber = strNumber(i, parameters);
    int id = p_listCommand.at(i++).toInt();

    return isIDNumber ? idNumber.toInt() : id;
}

// -------------------------------------------------------

void EventCommand::setCopy(const EventCommand& copy){
    p_kind = copy.p_kind;
    p_listCommand = copy.p_listCommand;
}

// -------------------------------------------------------
//
//  TO STRING : what to display on screen
//
// -------------------------------------------------------

QString EventCommand::toString(SystemCommonObject* object,
                               QStandardItemModel* parameters) const
{
    QString str = ">";

    switch (p_kind) {
    case EventCommandKind::ShowText:
        str += strShowText(); break;
    case EventCommandKind::ChangeVariables:
        str += strChangeVariables(); break;
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
        str += strCondition(); break;
    case EventCommandKind::Else:
        str += "Else"; break;
    case EventCommandKind::EndIf:
        str += "End If"; break;
    case EventCommandKind::OpenMainMenu:
        str += "Open the main menu"; break;
    case EventCommandKind::OpenSavesMenu:
        str += "Open the saves menu"; break;
    case EventCommandKind::ModifyInventory:
        str += strModifyInventory(); break;
    case EventCommandKind::ModifyTeam:
        str += strModifyTeam(); break;
    case EventCommandKind::StartBattle:
        str += strStartBattle(); break;
    case EventCommandKind::IfWin:
        str += "if Win"; break;
    case EventCommandKind::IfLose:
        str += "if Lose"; break;
    case EventCommandKind::ChangeState:
        str += strChangeState(object, parameters); break;
    case EventCommandKind::SendEvent:
        str += strSendEvent(); break;
    case EventCommandKind::TeleportObject:
        str += strTeleportObject(object, parameters); break;
    case EventCommandKind::MoveObject:
        str += strMoveObject(parameters); break;
    case EventCommandKind::Wait:
        str += strWait(); break;
    case EventCommandKind::MoveCamera:
        str += strMoveCamera(parameters); break;
    case EventCommandKind::PlayMusic:
        str += strPlayMusic(object, parameters); break;
    case EventCommandKind::StopMusic:
        str += strStopMusic(object, parameters); break;
    case EventCommandKind::PlayBackgroundSound:
        str += strPlayBackgroundSound(object, parameters); break;
    case EventCommandKind::StopBackgroundSound:
        str += strStopBackgroundSound(object, parameters); break;
    case EventCommandKind::PlaySound:
        str += strPlaySound(object, parameters); break;
    case EventCommandKind::PlayMusicEffect:
        str += strPlayMusicEffect(object, parameters); break;
    default:
        break;
    }

    return str;
}

// -------------------------------------------------------

QString EventCommand::strNumberVariable(int &i) const{
    PrimitiveValueKind kind =
            static_cast<PrimitiveValueKind>(p_listCommand.at(i++).toInt());
    int value = p_listCommand.at(i++).toInt();
    switch (kind){
    case PrimitiveValueKind::Number:
        return QString::number(value);
    case PrimitiveValueKind::Variable:
        return "Variable " + Wanok::get()->project()->gameDatas()
                ->variablesDatas()->getVariableById(value)->toString();
    default:
        return "";
    }
}

// -------------------------------------------------------

QString EventCommand::strDataBaseId(int &i, QStandardItemModel* dataBase,
                                    QStandardItemModel *parameters) const
{
    PrimitiveValueKind kind =
            static_cast<PrimitiveValueKind>(p_listCommand.at(i++).toInt());
    int value = p_listCommand.at(i++).toInt();

    switch (kind){
    case PrimitiveValueKind::Number:
        return QString::number(value);
    case PrimitiveValueKind::Variable:
        return "Variable " + Wanok::get()->project()->gameDatas()
                ->variablesDatas()->getVariableById(value)->toString();
    case PrimitiveValueKind::DataBase:
        return SuperListItem::getById(dataBase->invisibleRootItem(), value)
                ->toString();
    case PrimitiveValueKind::Parameter:
        return SuperListItem::getById(parameters->invisibleRootItem(), value)
                ->toString();
    default:
        return "";
    }
}

// -------------------------------------------------------

QString EventCommand::strNumber(int &i, QStandardItemModel *parameters) const{
    PrimitiveValueKind kind =
            static_cast<PrimitiveValueKind>(p_listCommand.at(i++).toInt());
    QString value = p_listCommand.at(i++);

    switch (kind){
    case PrimitiveValueKind::Number:
        return value;
    case PrimitiveValueKind::NumberDouble:
        return QString::number(value.toDouble());
    case PrimitiveValueKind::Variable:
        return "Variable " + Wanok::get()->project()->gameDatas()
                ->variablesDatas()->getVariableById(value.toInt())->toString();
    case PrimitiveValueKind::Parameter:
        return SuperListItem::getById(parameters->invisibleRootItem(),
                                      value.toInt())
                ->toString();
    default:
        return "";
    }
}

// -------------------------------------------------------

QString EventCommand::strShowText() const{
    return "Show text: " + p_listCommand.at(0);
}

// -------------------------------------------------------

QString EventCommand::strChangeVariables() const{
    int i = 0;
    QString several = "";
    QString selection = strChangeVariablesSelection(i, several);
    QString operation = strChangeVariablesOperation(i);
    QString value = strChangeVariablesValue(i);

    return "Change variable" + several + ": " + selection + " " + operation +
            " " + value;
}

// -------------------------------------------------------

QString EventCommand::strChangeVariablesSelection(int& i,
                                                  QString& several) const
{
    QString selection = p_listCommand.at(i++);
    QString str = "";
    if (selection == "0"){
        str += Wanok::get()->project()->gameDatas()->variablesDatas()
                ->getVariableById(p_listCommand.at(i++).toInt())->toString();
    }
    else{
        several += "s";
        str += p_listCommand.at(i++);
        str += " to ";
        str += p_listCommand.at(i++);
    }

    return str;
}

// -------------------------------------------------------

QString EventCommand::strChangeVariablesOperation(int& i) const{
    QString operation = p_listCommand.at(i++);
    QString str = "";
    if (operation == "0") str += "=";
    else if (operation == "1") str += "+";
    else if (operation == "2") str += "-";
    else if (operation == "3") str += "*";
    else if (operation == "4") str += "/";
    else if (operation == "5") str += "%";

    return str;
}

// -------------------------------------------------------

QString EventCommand::strChangeVariablesValue(int &i) const{
    QString value = p_listCommand.at(i++);
    QString str = "";
    if (value == "0"){
        str += "random number between ";
        str += p_listCommand.at(i++);
        str += " and ";
        str += p_listCommand.at(i++);
    }

    return str;

}

// -------------------------------------------------------

QString EventCommand::strInputNumber() const{
    QString variable = Wanok::get()->project()->gameDatas()->variablesDatas()
            ->getVariableById(p_listCommand.at(0).toInt())->toString();
    return "Input number in variable " + variable;
}

// -------------------------------------------------------

QString EventCommand::strCondition() const{
    int i = 1;
    QString condition = "";
    int page = p_listCommand.at(i++).toInt();
    switch (page){
    case 0:
        condition = strConditionPageVariables(i);
        break;
    }
    return "if (" + condition + ")";
}

// -------------------------------------------------------

QString EventCommand::strConditionPageVariables(int &i) const{
    QString condition = "";
    condition += "variable ";
    int variable = p_listCommand.at(i++).toInt();
    QString operation = WidgetComboBoxOperation::toString(p_listCommand.at(i++)
                                                          .toInt());
    condition += Wanok::get()->project()->gameDatas()
            ->variablesDatas()->getVariableById(variable)->toString();
    condition += " " + operation + " ";
    condition += strNumberVariable(i);


    return condition;
}

// -------------------------------------------------------

QString EventCommand::strModifyInventory() const{
    int i = 0;
    QString selection = strModifyInventorySelection(i);
    QString operation = strChangeVariablesOperation(i);
    QString number = strNumberVariable(i);

    return "Modify inventory: " + selection + " " + operation + " " + number;
}

// -------------------------------------------------------

QString EventCommand::strModifyInventorySelection(int &i) const{
    QString selection = "";

    // Object type
    int objectType = p_listCommand.at(i++).toInt();
    switch(objectType){
    case 0:
        selection += "item "; break;
    case 1:
        selection += "weapon "; break;
    case 2:
        selection += "armor "; break;
    }

    // Id of the object
    int objectId = p_listCommand.at(i++).toInt();
    QStandardItem* item = nullptr;
    switch(objectType){
    case 0:
        item = Wanok::get()->project()->gameDatas()->itemsDatas()->model()
                ->invisibleRootItem();
        break;
    case 1:
        item = Wanok::get()->project()->gameDatas()->weaponsDatas()->model()
                ->invisibleRootItem();
        break;
    case 2:
        item = Wanok::get()->project()->gameDatas()->armorsDatas()->model()
                ->invisibleRootItem();
        break;
    }
    selection += SuperListItem::getById(item, objectId)->toString();

    return selection;
}

// -------------------------------------------------------

QString EventCommand::strModifyTeam() const{
    int i = 0;
    QString operation = "";
    int kind = p_listCommand.at(i++).toInt();
    if (kind == 0) operation += strModifyTeamInstance(i);
    else if (kind == 1) operation += strModifyTeamMoveDelete(i);

    return "Modify team: " + operation;
}

// -------------------------------------------------------

QString EventCommand::strModifyTeamInstance(int &i) const{
    QString level = p_listCommand.at(i++);
    QString teamNew = WidgetComboBoxTeam::toString(p_listCommand.at(i++)
                                                   .toInt());
    QString stockVariable = Wanok::get()->project()->gameDatas()
            ->variablesDatas()->getVariableById(p_listCommand.at(i++)
                                                      .toInt())->toString();
    QString character = "";
    int kindNew = p_listCommand.at(i++).toInt();
    int idNew = p_listCommand.at(i++).toInt();
    if (kindNew == 0){
        character += "hero " +
                SuperListItem::getById(Wanok::get()->project()->gameDatas()
                                       ->heroesDatas()->model()
                                       ->invisibleRootItem(), idNew)
                ->toString();
    }
    else if (kindNew == 1){
        character += "monster ";
    }

    return "create new instance with level " + level + " in " + teamNew + " of "
            + character + " and stock in variable " + stockVariable;
}

// -------------------------------------------------------

QString EventCommand::strModifyTeamMoveDelete(int &i) const{
    QString addRemove = p_listCommand.at(i++).toInt() == 0 ? "move" : "remove";
    QString characterId = strNumberVariable(i);
    QString addRemoveTeam = WidgetComboBoxTeam::toString(p_listCommand.at(i++)
                                                         .toInt());

    return addRemove + " the character with id " + characterId + " in " +
            addRemoveTeam;
}

// -------------------------------------------------------

QString EventCommand::strStartBattle() const{
    int i = 2;
    QString troop = "troop ";
    int kind = p_listCommand.at(i++).toInt();
    int id;
    switch(kind){
    case 0:
        id = p_listCommand.at(i++).toInt();
        troop += SuperListItem::getById(Wanok::get()->project()->gameDatas()
                                        ->troopsDatas()->model()
                                        ->invisibleRootItem(), id)->toString();
        break;
    case 1:
        troop += "with ID " + strNumberVariable(i);
        break;
    case 2:
        troop += "random (in map property)";
        break;
    }

    return "Start battle: " + troop;
}

// -------------------------------------------------------

QString EventCommand::strChangeState(SystemCommonObject *object,
                                     QStandardItemModel *parameters) const
{
    int i = 0 ;
    QStandardItemModel* modelDataBase = nullptr;
    if (object != nullptr)
        modelDataBase = object->modelStates();

    QString value = strDataBaseId(i, modelDataBase, parameters);
    QString operation = strChangeStateOperation(i);

    return "Change state: " + operation + value;
}

// -------------------------------------------------------

QString EventCommand::strChangeStateOperation(int& i) const{
    int operation = p_listCommand.at(i++).toInt();
    QString str = "";
    switch (operation){
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

QString EventCommand::strSendEvent() const{
    int i = 0 ;

    QString target = strSendEventTarget(i);
    SystemObjectEvent* e = SystemObjectEvent::getCommandEvent(this, i);
    QStandardItemModel* model = e->isSystem() ?
                Wanok::get()->project()->gameDatas()->commonEventsDatas()
                ->modelEventsSystem() :
                Wanok::get()->project()->gameDatas()->commonEventsDatas()
                ->modelEventsUser();
    e->setName(SuperListItem::getById(model->invisibleRootItem(),
                                      e->id())->name());
    e->updateParameters();
    QString event = e->getLabelTab();
    delete e;

    return "Send event: to " + target + " with event " + event;
}

// -------------------------------------------------------

QString EventCommand::strSendEventTarget(int& i) const{
    QString str = "";
    int index = p_listCommand.at(i++).toInt();
    int id;

    switch (index){
    case 0:
        str += "all"; break;
    case 1:
        id = p_listCommand.at(i++).toInt();
        str += "detection " + QString::number(id);
        break;
    case 2:
        id = p_listCommand.at(i++).toInt();
        str += "object " + QString::number(id);
        break;
    case 3:
        str += "sender ";
        break;
    }

    return str;
}

// -------------------------------------------------------

QString EventCommand::strTeleportObject(SystemCommonObject* object,
                                        QStandardItemModel* parameters) const
{
    int i = 0;

    QString strObj = strMoveObjectID(parameters, i);
    QString strPosition = strTeleportObjectPosition(object, parameters, i);
    QString strOptions = strTeleportObjectOptions(i);

    return "Teleport object: " + strObj + " to the coordinates\n" + strOptions +
            "\n" + strPosition;
}

// -------------------------------------------------------

QString EventCommand::strTeleportObjectPosition(SystemCommonObject*,
                                                QStandardItemModel* parameters,
                                                int& i) const
{
    int kind = p_listCommand.at(i++).toInt();

    if (kind == 0 || kind == 1){
        QString id, x, y, yPlus, z;
        switch (kind){
        case 0:
            id = p_listCommand.at(i++);
            x = p_listCommand.at(i++);
            y = p_listCommand.at(i++);
            yPlus = p_listCommand.at(i++);
            z = p_listCommand.at(i++);
            break;
        case 1:
            id = strNumber(i, parameters);
            x = strNumber(i, parameters);
            y = strNumber(i, parameters);
            yPlus = strNumber(i, parameters);
            z = strNumber(i, parameters);
            break;
        }

        return "\tID map: " + id + "\n" +
               "\tX: " + x + "\n" +
               "\tY: " + y + "\n" +
               "\tY plus: " + yPlus + "\n" +
               "\tZ: " + z;
    }

    return "\t" + strMoveObjectID(parameters, i) + "'s coordinates";
}

// -------------------------------------------------------

QString EventCommand::strTeleportObjectOptions(int& i) const{
    QString strOptions = "[";

    QStringList listOptions;

    QString str = "Direction:";
    switch (p_listCommand.at(i++).toInt()){
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
    listOptions << ((p_listCommand.at(i++) == "0") ? "ON" : "OFF");
    str = "Shading after:";
    listOptions << ((p_listCommand.at(i++) == "0") ? "ON" : "OFF");
    strOptions += listOptions.join(";");
    strOptions += "]";

    return strOptions;
}

// -------------------------------------------------------

QString EventCommand::strMoveObject(QStandardItemModel* parameters) const{
    int i = 0 ;

    QString strObj = strMoveObjectID(parameters, i);
    QString strOptions = strMoveObjectOptions(i);
    QString strMoves = strMoveObjectMoves(i);

    return "Move object: " + strObj + "\n" + strOptions + strMoves;
}

// -------------------------------------------------------

QString EventCommand::strMoveObjectID(QStandardItemModel* parameters,
                                      int& i) const
{
    QStandardItemModel* modelObjects;
    if (Wanok::isInConfig){
        modelObjects = new QStandardItemModel;
        Map::setModelObjects(modelObjects);
    }
    else{
        modelObjects = Wanok::get()->project()->currentMap()->modelObjects();
    }
    QString strObj = strDataBaseId(i, modelObjects, parameters);

    if (Wanok::isInConfig)
        SuperListItem::deleteModel(modelObjects);

    return strObj;
}

// -------------------------------------------------------

QString EventCommand::strMoveObjectOptions(int& i) const{
    QString strOptions = "[";
    QStringList listOptions;
    if (p_listCommand.at(i++) == "1")
        listOptions << "Ignore";
    if (p_listCommand.at(i++) == "1")
        listOptions << "Wait end";
    if (p_listCommand.at(i++) == "1")
        listOptions << "Camera orientation";
    strOptions += listOptions.join(";");
    strOptions += "]";

    return strOptions;
}

// -------------------------------------------------------

QString EventCommand::strMoveObjectMoves(int& i) const{
    QString strMoves = "";
    while(i < commandsCount()){
        SystemCommandMove move;
        strMoves += "\n";
        move.initialize(this, i);
        strMoves += "\t" + move.toString();
    }

    return strMoves;
}

// -------------------------------------------------------

QString EventCommand::strWait() const{
    return "Wait: " + p_listCommand.at(0) + " seconds";
}

// -------------------------------------------------------

QString EventCommand::strMoveCamera(QStandardItemModel* parameters) const {
    int i = 0;

    QString target = strMoveCameraTarget(parameters, i);
    QString operation = strChangeVariablesOperation(i);
    QString move = strMoveCameraMove(parameters, i, operation);
    QString rotation = strMoveCameraRotation(parameters, i, operation);
    QString zoom = strMoveCameraZoom(parameters, i, operation);
    QString options = strMoveCameraOptions(parameters, i);

    return "Move camera:\nTarget: " + target + "\nMove: " + move +
            "\nRotation: " + rotation + "\nZoom: " + zoom + "\n" +
            options;
}

// -------------------------------------------------------

QString EventCommand::strMoveCameraTarget(QStandardItemModel* parameters,
                                          int& i) const
{
    int targetKind = p_listCommand.at(i++).toInt();
    switch (targetKind) {
    case 0:
        return "Unchanged";
    case 1:
        return "Object " + strMoveObjectID(parameters, i);
    }

    return "";
}

// -------------------------------------------------------

QString EventCommand::strMoveCameraMove(QStandardItemModel* parameters, int& i,
                                        QString &operation) const
{
    // Options
    QString strOptions = "[";
    QStringList listOptions;
    if (p_listCommand.at(i++) == "1")
        listOptions << "Offset";
    if (p_listCommand.at(i++) == "1")
        listOptions << "Camera orientation";
    strOptions += listOptions.join(";");
    strOptions += "]";

    // Moves
    QString x = operation + strNumber(i, parameters) + " ";
    x += (p_listCommand.at(i++).toInt() == 0 ? "square(s)" : "pixel(s)");
    QString y = operation + strNumber(i, parameters) + " ";
    y += (p_listCommand.at(i++).toInt() == 0 ? "square(s)" : "pixel(s)");
    QString z = operation + strNumber(i, parameters) + " ";
    z += (p_listCommand.at(i++).toInt() == 0 ? "square(s)" : "pixel(s)");

    return "X: " + x + "; Y: " + y + "; Z: " + z + " " + strOptions;
}

// -------------------------------------------------------

QString EventCommand::strMoveCameraRotation(QStandardItemModel *parameters,
                                            int& i, QString &operation) const
{
    // Options
    QString strOptions = "[";
    QStringList listOptions;
    if (p_listCommand.at(i++) == "1")
        listOptions << "Offset";
    strOptions += listOptions.join(";");
    strOptions += "]";

    // Rotation
    QString h = operation + strNumber(i, parameters) + "°";
    QString v = operation + strNumber(i, parameters) + "°";

    return "H: " + h + "; V: " + v + " " + strOptions;
}

// -------------------------------------------------------

QString EventCommand::strMoveCameraZoom(QStandardItemModel* parameters, int& i,
                                        QString &operation) const
{
    QString d = operation + strNumber(i, parameters);

    return "Distance: " + d;
}

// -------------------------------------------------------

QString EventCommand::strMoveCameraOptions(QStandardItemModel* parameters,
                                           int& i) const
{
    QString str;

    if (p_listCommand.at(i++) == "1")
        str += "[Wait end] ";

    str += "TIME: " + strNumber(i, parameters) + " seconds";

    return str;
}

// -------------------------------------------------------

QString EventCommand::strPlaySong(SystemCommonObject*,
                                  QStandardItemModel* parameters,
                                  SongKind kind) const
{
    int i = 0;

    bool isIDNumber = p_listCommand.at(i++) == "1";
    QString idNumber = strNumber(i, parameters);
    QString id = SuperListItem::getById(Wanok::get()->project()->songsDatas()
        ->model(kind)->invisibleRootItem(), p_listCommand.at(i++)
        .toInt())->toString();
    QString volume = strNumber(i, parameters);
    bool isStart = p_listCommand.at(i++) == "1";
    QString start = strNumber(i, parameters);
    bool isEnd = p_listCommand.at(i++) == "1";
    QString end = strNumber(i, parameters);

    return (isIDNumber ? "with ID " + idNumber : id) +
            " with volume: " + volume + (isStart ? "\nStart: " + start : "") +
            (isEnd ? "\nEnd: " + end : "");
}

QString EventCommand::strPlayMusic(SystemCommonObject* object,
                                   QStandardItemModel* parameters) const
{
    return "Play music: " + strPlaySong(object, parameters, SongKind::Music);
}

// -------------------------------------------------------

QString EventCommand::strPlayBackgroundSound(SystemCommonObject* object,
                                             QStandardItemModel* parameters)
                                             const
{
    return "Play background sound: " + strPlaySong(object, parameters,
                                                   SongKind::BackgroundSound);
}

// -------------------------------------------------------

QString EventCommand::strPlaySound(SystemCommonObject* object,
                                   QStandardItemModel* parameters) const
{
    return "Play sound: " + strPlaySong(object, parameters, SongKind::Sound);
}

// -------------------------------------------------------

QString EventCommand::strPlayMusicEffect(SystemCommonObject* object,
                                         QStandardItemModel* parameters) const
{
    return "Play music effect: " + strPlaySong(object, parameters,
                                               SongKind::MusicEffect);
}

// -------------------------------------------------------

QString EventCommand::strStopSong(SystemCommonObject*,
                                  QStandardItemModel* parameters) const
{
    int i = 0;
    QString seconds = strNumber(i, parameters);

    return seconds + " seconds";
}

QString EventCommand::strStopMusic(SystemCommonObject* object,
                                   QStandardItemModel* parameters) const
{
    return "Stop music: " + strStopSong(object, parameters);
}

// -------------------------------------------------------

QString EventCommand::strStopBackgroundSound(SystemCommonObject* object,
                                             QStandardItemModel* parameters)
                                             const
{
    return "Stop background sound: " + strStopSong(object, parameters);
}

// -------------------------------------------------------
//
//  READ / WRITE
//
// -------------------------------------------------------

void EventCommand::read(const QJsonObject &json){
    p_kind = static_cast<EventCommandKind>(json["kind"].toInt());
    readCommand(json["command"].toArray());
}

// -------------------------------------------------------

void EventCommand::readCommand(const QJsonArray &json){
    p_listCommand.clear();
    for (int i = 0; i < json.size(); i++){
        QJsonValue val = json[i];

        if (val.isString())
            p_listCommand.append(json[i].toString());
        else if (val.isDouble())
            p_listCommand.append(QString::number(json[i].toDouble()));
        else
            p_listCommand.append(QString::number(val.toInt()));
    }
}

// -------------------------------------------------------

QJsonObject EventCommand::getJSON() const{
    QJsonObject json;
    json["kind"] = (int)p_kind;
    json["command"] = getArrayJSON();

    return json;
}

// -------------------------------------------------------

QJsonArray EventCommand::getArrayJSON() const{
    QJsonArray tab;
    for (int i = 0; i < p_listCommand.length(); i++){
        QString s = p_listCommand.at(i);
        bool conversionOk, conversionDoubleOk;
        int integer = s.toInt(&conversionOk);
        double d = s.toDouble(&conversionDoubleOk);

        if (conversionOk)
            tab.append(integer);
        else if (conversionDoubleOk)
            tab.append(d);
        else
            tab.append(s);
    }

    return tab;
}
