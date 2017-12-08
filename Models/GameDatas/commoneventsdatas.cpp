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

#include <QFile>
#include <QJsonDocument>
#include "commoneventsdatas.h"
#include "wanok.h"
#include "systemevent.h"
#include "systemcommonreaction.h"
#include "systemcommonobject.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

CommonEventsDatas::CommonEventsDatas()
{
    m_modelEventsSystem = new QStandardItemModel;
    m_modelEventsUser = new QStandardItemModel;
    m_modelStates = new QStandardItemModel;
    m_modelCommonReactors = new QStandardItemModel;
    m_modelCommonObjects = new QStandardItemModel;
}

CommonEventsDatas::~CommonEventsDatas()
{
    SuperListItem::deleteModel(m_modelEventsSystem);
    SuperListItem::deleteModel(m_modelEventsUser);
    SuperListItem::deleteModel(m_modelStates);
    SuperListItem::deleteModel(m_modelCommonReactors);
    SuperListItem::deleteModel(m_modelCommonObjects);
}

void CommonEventsDatas::read(QString path){
    Wanok::readJSON(Wanok::pathCombine(path, Wanok::pathCommonEvents), *this);
}

QStandardItemModel* CommonEventsDatas::modelEventsSystem() const {
    return m_modelEventsSystem;
}

QStandardItemModel* CommonEventsDatas::modelEventsUser() const {
    return m_modelEventsUser;
}

QStandardItemModel* CommonEventsDatas::modelStates() const{
    return m_modelStates;
}

QStandardItemModel* CommonEventsDatas::modelCommonReactors() const {
    return m_modelCommonReactors;
}

QStandardItemModel* CommonEventsDatas::modelCommonObjects() const {
    return m_modelCommonObjects;
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void CommonEventsDatas::setDefault(){
    SystemCommonReaction* react;
    SystemCommonObject* object;
    SuperListItem* super;
    QStandardItem* item;

    // Events system
    QStringList namesEventsSystem;
    namesEventsSystem << "Time" << "Chronometer" << "KeyPress" << "KeyRelease";
    QList<QVector<SystemCreateParameter*>> parametersSystem;
    parametersSystem << QVector<SystemCreateParameter*>({
            new SystemCreateParameter(1,"Interval",new PrimitiveValue(0)),
            new SystemCreateParameter(2,"Repeat",new PrimitiveValue(true))});
    parametersSystem << QVector<SystemCreateParameter*>({
            new SystemCreateParameter(1,"Left",new PrimitiveValue(0))});
    parametersSystem << QVector<SystemCreateParameter*>({
            new SystemCreateParameter(1,"ID",new PrimitiveValue),
            new SystemCreateParameter(2,"Repeat",new PrimitiveValue(false)),
            new SystemCreateParameter(3,"Immediate Repeat",
                                      new PrimitiveValue(false))});
    parametersSystem << QVector<SystemCreateParameter*>({
            new SystemCreateParameter(1,"ID",new PrimitiveValue)});
    setDefaultEvent(m_modelEventsSystem, namesEventsSystem, parametersSystem);

    // Events user
    QStringList namesEventsUser;
    namesEventsUser << "Hero action";
    QList<QVector<SystemCreateParameter*>> parametersUser;
    parametersUser << QVector<SystemCreateParameter*>({});
    setDefaultEvent(m_modelEventsUser, namesEventsUser, parametersUser);

    // States
    super = new SuperListItem(1, "Normal");
    item = new QStandardItem;
    item->setData(QVariant::fromValue(reinterpret_cast<quintptr>(super)));
    item->setText(super->toString());
    m_modelStates->appendRow(item);

    // Common reactors
    react = new SystemCommonReaction;
    item = new QStandardItem;
    item->setData(QVariant::fromValue(reinterpret_cast<quintptr>(react)));
    item->setText(react->toString());
    m_modelCommonReactors->appendRow(item);

    // Common objects
    object = new SystemCommonObject;
    object->setDefaultFirst();
    item = new QStandardItem;
    item->setData(QVariant::fromValue(reinterpret_cast<quintptr>(object)));
    item->setText(object->toString());
    m_modelCommonObjects->appendRow(item);
    object = new SystemCommonObject;
    object->setDefaultHero(m_modelEventsSystem, m_modelEventsUser);
    item = new QStandardItem;
    item->setData(QVariant::fromValue(reinterpret_cast<quintptr>(object)));
    item->setText(object->toString());
    m_modelCommonObjects->appendRow(item);
}

// -------------------------------------------------------

void CommonEventsDatas::setDefaultEvent(QStandardItemModel* model,
                                        QStringList& namesEvents,
                                        QList<QVector<SystemCreateParameter*>>&
                                        parameters)
{
    QStandardItemModel* modelParameters;
    QList<QStandardItem*> row;
    SystemEvent* ev;
    QStandardItem* item;

    for (int i = 0; i < namesEvents.size(); i++){
        modelParameters = new QStandardItemModel;
        for (int j = 0; j < parameters[i].size(); j++){
            row = parameters[i][j]->getModelRow();
            modelParameters->appendRow(row);
        }
        item = new QStandardItem();
        item->setText(SuperListItem::beginningText);
        modelParameters->appendRow(item);
        ev = new SystemEvent(i+1, namesEvents[i], modelParameters);
        item = new QStandardItem;
        item->setData(QVariant::fromValue(reinterpret_cast<quintptr>(ev)));
        item->setText(ev->toString());
        model->appendRow(item);
    }
}

// -------------------------------------------------------
//
//  READ / WRITE
//
// -------------------------------------------------------

void CommonEventsDatas::read(const QJsonObject &json){
    QStandardItem* item;
    QJsonArray jsonList;
    SystemEvent* ev;
    SuperListItem* super;
    SystemCommonReaction* react;
    SystemCommonObject* object;

    // Clear
    SuperListItem::deleteModel(m_modelEventsSystem, false);
    SuperListItem::deleteModel(m_modelEventsUser, false);
    SuperListItem::deleteModel(m_modelStates, false);
    SuperListItem::deleteModel(m_modelCommonReactors, false);
    SuperListItem::deleteModel(m_modelCommonObjects, false);

    // Events
    jsonList = json["eventsSystem"].toArray();
    for (int i = 0; i < jsonList.size(); i++){
        item = new QStandardItem;
        ev = new SystemEvent;
        ev->read(jsonList[i].toObject());
        item->setData(QVariant::fromValue(reinterpret_cast<quintptr>(ev)));
        item->setText(ev->toString());
        m_modelEventsSystem->appendRow(item);
    }
    jsonList = json["eventsUser"].toArray();
    for (int i = 0; i < jsonList.size(); i++){
        item = new QStandardItem;
        ev = new SystemEvent;
        ev->read(jsonList[i].toObject());
        item->setData(QVariant::fromValue(reinterpret_cast<quintptr>(ev)));
        item->setText(ev->toString());
        m_modelEventsUser->appendRow(item);
    }

    // States
    jsonList = json["states"].toArray();
    for (int i = 0; i < jsonList.size(); i++){
        item = new QStandardItem;
        super = new SuperListItem;
        super->read(jsonList[i].toObject());
        item->setData(QVariant::fromValue(reinterpret_cast<quintptr>(super)));
        item->setText(super->toString());
        m_modelStates->appendRow(item);
    }

    // Common reactors
    jsonList = json["commonReactors"].toArray();
    for (int i = 0; i < jsonList.size(); i++){
        item = new QStandardItem;
        react = new SystemCommonReaction;
        react->read(jsonList[i].toObject());
        item->setData(QVariant::fromValue(reinterpret_cast<quintptr>(react)));
        item->setText(react->toString());
        m_modelCommonReactors->appendRow(item);
    }

    // Common objects
    jsonList = json["commonObjects"].toArray();
    for (int i = 0; i < jsonList.size(); i++){
        item = new QStandardItem;
        object = new SystemCommonObject;
        object->read(jsonList[i].toObject());
        item->setData(QVariant::fromValue(reinterpret_cast<quintptr>(object)));
        item->setText(object->toString());
        m_modelCommonObjects->appendRow(item);
    }
}

// -------------------------------------------------------

void CommonEventsDatas::write(QJsonObject &json) const{
    QJsonArray tab;
    QJsonObject obj;
    SystemEvent* ev;
    SuperListItem* super;
    SystemCommonReaction* react;
    SystemCommonObject* object;
    int l;

    // Events
    tab = QJsonArray();
    l = m_modelEventsSystem->invisibleRootItem()->rowCount();
    for (int i = 0; i < l; i++){
        obj = QJsonObject();
        ev = ((SystemEvent*)m_modelEventsSystem->item(i)->data()
              .value<quintptr>());
        ev->write(obj);
        tab.append(obj);
    }
    json["eventsSystem"] = tab;
    tab = QJsonArray();
    l = m_modelEventsUser->invisibleRootItem()->rowCount();
    for (int i = 0; i < l; i++){
        obj = QJsonObject();
        ev = ((SystemEvent*)m_modelEventsUser->item(i)->data()
              .value<quintptr>());
        ev->write(obj);
        tab.append(obj);
    }
    json["eventsUser"] = tab;

    // States
    tab = QJsonArray();
    l = m_modelStates->invisibleRootItem()->rowCount();
    for (int i = 0; i < l; i++){
        obj = QJsonObject();
        super = ((SuperListItem*) m_modelStates->item(i)->data()
                 .value<quintptr>());
        super->write(obj);
        tab.append(obj);
    }
    json["states"] = tab;

    // Common reactors
    tab = QJsonArray();
    l = m_modelCommonReactors->invisibleRootItem()->rowCount();
    for (int i = 0; i < l; i++){
        obj = QJsonObject();
        react = ((SystemCommonReaction*)m_modelCommonReactors->item(i)
                 ->data().value<quintptr>());
        react->write(obj);
        tab.append(obj);
    }
    json["commonReactors"] = tab;

    // Common objects
    tab = QJsonArray();
    l = m_modelCommonObjects->invisibleRootItem()->rowCount();
    for (int i = 0; i < l; i++){
        obj = QJsonObject();
        object = ((SystemCommonObject*)m_modelCommonObjects->item(i)
                  ->data().value<quintptr>());
        object->write(obj);
        tab.append(obj);
    }
    json["commonObjects"] = tab;
}
