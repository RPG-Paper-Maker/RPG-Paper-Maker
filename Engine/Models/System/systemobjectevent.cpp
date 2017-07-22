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

#include "systemobjectevent.h"
#include "dialogsystemobjectevent.h"
#include "wanok.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

SystemObjectEvent::SystemObjectEvent() :
    SystemObjectEvent(1, 1, "", new QStandardItemModel, true)
{

}

SystemObjectEvent::SystemObjectEvent(int i, int idEvent, QString n,
                                     QStandardItemModel* parameters,
                                     bool isSystem) :
    SuperListItem(i,n),
    m_idEvent(idEvent),
    m_modelParameters(parameters),
    m_isSystem(isSystem)
{

}

SystemObjectEvent::~SystemObjectEvent(){
    SuperListItem::deleteModel(m_modelParameters);
}

int SystemObjectEvent::idEvent() const {
    return m_idEvent;
}

QStandardItemModel* SystemObjectEvent::modelParameters() const {
    return m_modelParameters;
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
    SystemObjectEvent* event = new SystemObjectEvent(1, idEvent, "",
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

void SystemObjectEvent::addParameter(SystemParameter* parameter){
    QStandardItem* item = new QStandardItem;
    item->setData(QVariant::fromValue(reinterpret_cast<quintptr>(parameter)));
    m_modelParameters->appendRow(item);
}

// -------------------------------------------------------

void SystemObjectEvent::setDefault(){

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
                                                  idEvent());
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
    SystemParameter* param;
    QList<QStandardItem *> row;
    int l;

    p_id = event.p_id;
    m_idEvent = event.m_idEvent;
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
    SystemParameter* param;
    QStandardItem* item;

    m_idEvent = json["idEv"].toInt();

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

    // Is system
    m_isSystem = json["sys"].toBool();
}

// -------------------------------------------------------

void SystemObjectEvent::write(QJsonObject &json) const{
    SuperListItem::write(json);
    SystemParameter* param;
    QJsonArray jsonParameters;
    QJsonObject obj;
    int l;

    json["idEv"] = m_idEvent;

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

    // Is system
    json["sys"] = m_isSystem;
}
