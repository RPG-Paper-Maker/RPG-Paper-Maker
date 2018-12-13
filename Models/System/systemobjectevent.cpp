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

#include "systemobjectevent.h"
#include "dialogsystemobjectevent.h"
#include "systemstate.h"
#include "wanok.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

SystemObjectEvent::SystemObjectEvent() :
    SystemObjectEvent(1,"", new QStandardItemModel, true)
{

}

SystemObjectEvent::SystemObjectEvent(int i, QString n,
                                     QStandardItemModel* parameters,
                                     bool isSystem) :
    SuperListItem(i,n),
    m_modelParameters(parameters),
    m_isSystem(isSystem)
{

}

SystemObjectEvent::~SystemObjectEvent(){
    SuperListItem::deleteModel(m_modelParameters);
    clearReactions();
}

QStandardItemModel* SystemObjectEvent::modelParameters() const {
    return m_modelParameters;
}

SystemReaction* SystemObjectEvent::reactionAt(int id) const{
    return m_reactions[id];
}

bool SystemObjectEvent::isSystem() const { return m_isSystem; }

void SystemObjectEvent::setIsSystem(bool b) { m_isSystem = b; }

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

SystemObjectEvent* SystemObjectEvent::getCommandEvent(
        const EventCommand *command, int& i)
{
    PrimitiveValue* v;
    int type = command->valueCommandAt(i++).toInt();
    int idEvent = command->valueCommandAt(i++).toInt();
    SystemObjectEvent* event = new SystemObjectEvent(idEvent, "",
                                                     new QStandardItemModel,
                                                     type == 0);

    while (i < command->commandsCount()){
        int paramId = command->valueCommandAt(i++).toInt();
        v = new PrimitiveValue;
        v->initializeCommandParameter(command, i);

        event->addParameter(new SystemParameter(paramId, "", nullptr, v));
    }

    return event;
}

// -------------------------------------------------------

QString SystemObjectEvent::getLabelTab() const{
    SystemParameter* param;
    QString str = name() + " [";
    int l;

    bool first = true;
    l = m_modelParameters->invisibleRootItem()->rowCount();
    for (int j = 0; j < l; j++){
        param = (SystemParameter*) m_modelParameters->item(j)->data()
                .value<quintptr>();
        if (param->value()->kind() != PrimitiveValueKind::Anything &&
           (param->value()->kind() != PrimitiveValueKind::Default ||
            param->parameter()->defaultValue()->kind() !=
            PrimitiveValueKind::Anything))
        {
            if (first)
                first = false;
            else
                str += ";";

            if (param->value()->kind() == PrimitiveValueKind::Default)
                param->parameter()->defaultValue()->labelTab(str);
            else
                param->value()->labelTab(str);
        }
    }
    str += "]";

    return str;
}

// -------------------------------------------------------

void SystemObjectEvent::addReaction(int id, SystemReaction* reaction){
    m_reactions[id] = reaction;
}

// -------------------------------------------------------

void SystemObjectEvent::addParameter(SystemParameter* parameter){
    QStandardItem* item = new QStandardItem;
    item->setData(QVariant::fromValue(reinterpret_cast<quintptr>(parameter)));
    m_modelParameters->appendRow(item);
}

// -------------------------------------------------------

void SystemObjectEvent::setDefault(){
    SystemReaction* reaction = new SystemReaction;
    m_reactions[1] = reaction;
}

// -------------------------------------------------------

void SystemObjectEvent::setDefaultHero(){
    SystemReaction* reaction = new SystemReaction;
    m_reactions[1] = reaction;
    reaction->setBlockingHero(false);
}

// -------------------------------------------------------

void SystemObjectEvent::updateReactions(QStandardItemModel* modelStates){
    QList<int> keysToDelete;

    QHash<int, SystemReaction*>::iterator i;
    for (i = m_reactions.begin(); i != m_reactions.end(); i++){
        bool test = false;
        int l = modelStates->invisibleRootItem()->rowCount();
        for (int j = 0; j < l - 1; j++){
            SystemState* state = (SystemState*) modelStates->item(j)->data()
                    .value<quintptr>();
            if (i.key() == state->id()){
                test = true;
                break;
            }
        }

        // If there is no state corresponding to the key, we need to delete it
        if (!test){
            keysToDelete.append(i.key());
            delete i.value();
        }
    }

    for (int j = 0; j < keysToDelete.size(); j++)
        m_reactions.remove(keysToDelete.at(j));
}

// -------------------------------------------------------

void SystemObjectEvent::updateParameters()
{
    QStandardItemModel* modelEventsSystem =
            Wanok::get()->project()->gameDatas()->commonEventsDatas()
            ->modelEventsSystem();
    QStandardItemModel* modelEventsUser =
            Wanok::get()->project()->gameDatas()->commonEventsDatas()
            ->modelEventsUser();

    QStandardItemModel* newModel = new QStandardItemModel;
    QStandardItemModel* model = m_isSystem ? modelEventsSystem
                                           : modelEventsUser;
    SystemEvent* event =
            (SystemEvent*) SuperListItem::getById(model->invisibleRootItem(),
                                                  id());
    SystemCreateParameter* createParam;
    SystemParameter* param;
    SystemParameter* newParam;
    PrimitiveValue* prim;
    QList<QStandardItem*> row;
    int l, ll;

    l = event->modelParameters()->invisibleRootItem()->rowCount();
    for (int i = 0; i < l - 1; i++){
        createParam = (SystemCreateParameter*) event->modelParameters()->item(i)
                ->data().value<quintptr>();
        prim = new PrimitiveValue(PrimitiveValueKind::Default);

        // If existing in the previous model, copy value
        ll = m_modelParameters->invisibleRootItem()->rowCount();
        for (int j = 0; j < ll; j++){
            param = (SystemParameter*) m_modelParameters->item(j)->data()
                    .value<quintptr>();
            if (createParam->id() == param->id()){
                prim->setCopy(*param->value());
                break;
            }
        }

        newParam = new SystemParameter(createParam->id(), createParam->name(),
                                       createParam, prim);
        row = newParam->getModelRow();
        newModel->appendRow(row);
    }


    SuperListItem::deleteModel(m_modelParameters);
    m_modelParameters = newModel;
    m_modelParameters->setHorizontalHeaderLabels(QStringList({"Name", "Value",
                                                              "Default value"})
                                                 );
}

// -------------------------------------------------------

void SystemObjectEvent::clearReactions(){
    QHash<int, SystemReaction*>::iterator i;
    for (i = m_reactions.begin(); i != m_reactions.end(); i++)
        delete i.value();

    m_reactions.clear();
}

// -------------------------------------------------------

void SystemObjectEvent::clearParameters(){
    SuperListItem::deleteModel(m_modelParameters);
    m_modelParameters = new QStandardItemModel;
}

// -------------------------------------------------------

bool SystemObjectEvent::openDialog(){
    SystemObjectEvent event;
    event.setCopy(*this);
    DialogSystemObjectEvent dialog(event);
    if (dialog.exec() == QDialog::Accepted){
        setCopy(event);
        return true;
    }
    return false;
}

// -------------------------------------------------------

SuperListItem* SystemObjectEvent::createCopy() const{
    SystemObjectEvent* super = new SystemObjectEvent;
    super->setCopy(*this);
    return super;
}

// -------------------------------------------------------

void SystemObjectEvent::setCopy(const SystemObjectEvent& event){
    SuperListItem::setCopy(event);
    p_id = event.p_id;

    SystemParameter* param;
    QList<QStandardItem *> row;
    int l;

    m_isSystem = event.m_isSystem;

    // Parameters
    clearParameters();
    l = event.m_modelParameters->invisibleRootItem()->rowCount();
    for (int i = 0; i < l; i++){
        param = new SystemParameter;
        param->setCopy(*((SystemParameter*) event.m_modelParameters->item(i)
                         ->data().value<quintptr>()));
        row = param->getModelRow();
        m_modelParameters->appendRow(row);
    }

    // Reactions
    clearReactions();
    QHash<int, SystemReaction*>::const_iterator i;
    for (i = event.m_reactions.begin(); i != event.m_reactions.end(); i++){
        SystemReaction* reaction = new SystemReaction;
        reaction->setCopy(*i.value());
        m_reactions[i.key()] = reaction;
    }
}

// -------------------------------------------------------

QList<QStandardItem *> SystemObjectEvent::getModelRow() const{
    QList<QStandardItem*> row = QList<QStandardItem*>();
    QStandardItem* item = new QStandardItem;
    item->setData(QVariant::fromValue(reinterpret_cast<quintptr>(this)));
    item->setText(SuperListItem::beginningText + getLabelTab());
    row.append(item);
    return row;
}

// -------------------------------------------------------
//
//  READ / WRITE
//
// -------------------------------------------------------

void SystemObjectEvent::read(const QJsonObject &json){
    SuperListItem::read(json);
    QList<QStandardItem *> row;
    SystemParameter* param;
    SystemReaction* reaction;
    QStandardItem* item;

    // Is system
    m_isSystem = json["sys"].toBool();

    // Parameters
    QJsonArray jsonParameters = json["p"].toArray();
    for (int i = 0; i < jsonParameters.size(); i++){
        param = new SystemParameter;
        param->read(jsonParameters.at(i).toObject());
        item = new QStandardItem;
        item->setData(QVariant::fromValue(reinterpret_cast<quintptr>(param)));
        m_modelParameters->appendRow(item);
    }
    updateParameters();

    // Reactions
    QJsonObject::iterator i;
    QJsonObject jsonReactions = json["r"].toObject();
    for (i = jsonReactions.begin(); i != jsonReactions.end(); i++){
        reaction = new SystemReaction;
        reaction->read(i.value().toObject());
        m_reactions[i.key().toInt()] = reaction;
    }
    json["r"] = jsonReactions;
}

// -------------------------------------------------------

void SystemObjectEvent::write(QJsonObject &json) const{
    SuperListItem::write(json);
    SystemParameter* param;
    QJsonArray jsonParameters;
    QJsonObject jsonReactions;
    QJsonObject obj;
    int l;

    // Is system
    json["sys"] = m_isSystem;

    // Parameters
    l = m_modelParameters->invisibleRootItem()->rowCount();
    for (int i = 0; i < l; i++){
        obj = QJsonObject();
        param = (SystemParameter*) m_modelParameters->item(i)->data()
                .value<quintptr>();
        param->write(obj);
        jsonParameters.append(obj);
    }
    json["p"] = jsonParameters;

    // Reactions
    QHash<int, SystemReaction*>::const_iterator i;
    for (i = m_reactions.begin(); i != m_reactions.end(); i++){
        obj = QJsonObject();
        i.value()->write(obj);
        jsonReactions[QString::number(i.key())] = obj;
    }
    json["r"] = jsonReactions;
}
