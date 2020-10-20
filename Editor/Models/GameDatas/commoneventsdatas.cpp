/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include <QFile>
#include <QJsonDocument>
#include "commoneventsdatas.h"
#include "rpm.h"
#include "common.h"
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
    RPM::readJSON(Common::pathCombine(path, RPM::PATH_COMMON_EVENTS), *this);
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
    namesEventsSystem << RPM::translate(Translations::TIME) << RPM::translate(
        Translations::CHRONOMETER) << RPM::translate(Translations::KEYPRESS) <<
        RPM::translate(Translations::KEYRELEASE);
    QList<QVector<SystemCreateParameter*>> parametersSystem;
    parametersSystem << QVector<SystemCreateParameter*>({
            new SystemCreateParameter(1, RPM::translate(Translations::INTERVAL),
                new PrimitiveValue(0)),
            new SystemCreateParameter(2, RPM::translate(Translations::REPEAT),
                new PrimitiveValue(true))
    });
    parametersSystem << QVector<SystemCreateParameter*>({
            new SystemCreateParameter(1, RPM::translate(Translations::LEFT_TIME)
                , new PrimitiveValue(0))});
    parametersSystem << QVector<SystemCreateParameter*>({
            new SystemCreateParameter(1, RPM::translate(Translations::ID), new
                PrimitiveValue),
            new SystemCreateParameter(2, RPM::translate(Translations::REPEAT),
                new PrimitiveValue(false)),
            new SystemCreateParameter(3, RPM::translate(Translations
                ::IMMEDIATE_REPEAT), new PrimitiveValue(false))});
    parametersSystem << QVector<SystemCreateParameter*>({
            new SystemCreateParameter(1, RPM::translate(Translations::ID), new
                PrimitiveValue)});
    setDefaultEvent(m_modelEventsSystem, namesEventsSystem, parametersSystem);

    // Events user
    QStringList namesEventsUser;
    namesEventsUser << RPM::translate(Translations::HERO_ACTION) << RPM
        ::translate(Translations::HERO_TOUCH) << RPM::translate(Translations
        ::ENEMY_TOUCH);
    QList<QVector<SystemCreateParameter*>> parametersUser;
    parametersUser << QVector<SystemCreateParameter *>({}) << QVector<
        SystemCreateParameter *>({}) << QVector<SystemCreateParameter *>({});
    setDefaultEvent(m_modelEventsUser, namesEventsUser, parametersUser);

    // States
    super = new SuperListItem(1, RPM::translate(Translations::NORMAL));
    m_modelStates->appendRow(super->getModelRow());

    // Common reactors
    react = new SystemCommonReaction;
    m_modelCommonReactors->appendRow(react->getModelRow());

    // Common objects
    object = new SystemCommonObject;
    object->setDefaultFirst();
    m_modelCommonObjects->appendRow(object->getModelRow());
    object = new SystemCommonObject;
    object->setDefaultHero(m_modelEventsSystem, m_modelEventsUser);
    m_modelCommonObjects->appendRow(object->getModelRow());
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
        model->appendRow(ev->getModelRow());
    }
}

// -------------------------------------------------------
//
//  READ / WRITE
//
// -------------------------------------------------------

void CommonEventsDatas::read(const QJsonObject &json){
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
        ev = new SystemEvent;
        ev->read(jsonList[i].toObject());
        m_modelEventsSystem->appendRow(ev->getModelRow());
    }
    jsonList = json["eventsUser"].toArray();
    for (int i = 0; i < jsonList.size(); i++){
        ev = new SystemEvent;
        ev->read(jsonList[i].toObject());
        m_modelEventsUser->appendRow(ev->getModelRow());
    }

    // States
    jsonList = json["states"].toArray();
    for (int i = 0; i < jsonList.size(); i++){
        super = new SuperListItem;
        super->read(jsonList[i].toObject());
        m_modelStates->appendRow(super->getModelRow());
    }

    // Common reactors
    jsonList = json["commonReactors"].toArray();
    for (int i = 0; i < jsonList.size(); i++){
        react = new SystemCommonReaction;
        react->read(jsonList[i].toObject());
        m_modelCommonReactors->appendRow(react->getModelRow());
    }

    // Common objects
    jsonList = json["commonObjects"].toArray();
    for (int i = 0; i < jsonList.size(); i++){
        object = new SystemCommonObject;
        object->read(jsonList[i].toObject());
        m_modelCommonObjects->appendRow(object->getModelRow());
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
