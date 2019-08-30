/*
    RPG Paper Maker Copyright (C) 2017-2019 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include "systemcommonobject.h"
#include "rpm.h"
#include "widgetsupertree.h"
#include "systemobjectevent.h"
#include "systemstate.h"
#include "systemcommonreaction.h"
#include "systemproperty.h"
#include "systemevent.h"

const QString SystemCommonObject::JSON_ONLY_ONE_EVENT_PER_FRAME = "ooepf";
const QString SystemCommonObject::JSON_INHERITANCE_ID = "hId";
const QString SystemCommonObject::JSON_STATES = "states";
const QString SystemCommonObject::JSON_PROPERTIES = "p";
const QString SystemCommonObject::JSON_EVENTS = "events";

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

SystemCommonObject::SystemCommonObject() :
    SystemCommonObject(1, "", false, -1, new QStandardItemModel, new
        QStandardItemModel, new QStandardItemModel)
{

}

SystemCommonObject::SystemCommonObject(int i, QString n, bool
    onlyOneEventPerFrame, int id, QStandardItemModel *states, QStandardItemModel
    *properties, QStandardItemModel *events) :
    SuperListItem(i,n),
    m_onlyOneEventPerFrame(onlyOneEventPerFrame),
    m_inheritanceId(id),
    m_states(states),
    m_properties(properties),
    m_events(events)
{

}

SystemCommonObject::~SystemCommonObject() {
    SuperListItem::deleteModel(m_states);
    SuperListItem::deleteModel(m_properties);
    SuperListItem::deleteModel(m_events);
}

bool SystemCommonObject::onlyOneEventPerFrame() const {
    return m_onlyOneEventPerFrame;
}

void SystemCommonObject::setOnlyOneEventPerFrame(bool b) {
    m_onlyOneEventPerFrame = b;
}

int SystemCommonObject::inheritanceId() const {
    return m_inheritanceId;
}

void SystemCommonObject::setInheritance(int id) {
    m_inheritanceId = id;
}

QStandardItemModel * SystemCommonObject::modelStates() const {
    return m_states;
}

QStandardItemModel * SystemCommonObject::modelProperties() const {
    return m_properties;
}

QStandardItemModel * SystemCommonObject::modelEvents() const {
    return m_events;
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void SystemCommonObject::setDefault() {
    QStandardItem *model;
    SystemCommonObject *object;
    int id;

    model = RPM::get()->project()->gameDatas()->commonEventsDatas()
        ->modelCommonObjects()->invisibleRootItem();
    id = p_id;

    // Copy the object with ID 1
    object = static_cast<SystemCommonObject *>(SuperListItem::getById(model, 1));
    SuperListItem::deleteModel(m_properties, false);
    SuperListItem::deleteModel(m_events, false);
    SuperListItem::deleteModel(m_states, false);
    setCopy(*object);
    setId(id);
    setName("");
}

// -------------------------------------------------------

void SystemCommonObject::setDefaultFirst() {
    QStandardItemModel *modelEventsUser;
    QList<QStandardItem *> row;
    QStandardItem *item;
    SystemState *state;
    SystemObjectEvent *event;
    SuperListItem *super;
    QString name;

    // ID and name
    setId(1);
    setName("Basic");

    modelEventsUser = RPM::get()->project()->gameDatas()->commonEventsDatas()
        ->modelEventsUser();

    // Properties
    item = new QStandardItem();
    item->setText(SuperListItem::beginningText);
    m_properties->appendRow(item);

    // Events
    m_events->clear();
    name = reinterpret_cast<SystemObjectEvent *>(modelEventsUser->item(0)
        ->data().value<quintptr>())->name();
    event = new SystemObjectEvent(1, name, new QStandardItemModel, false);
    event->setDefault();
    row = event->getModelRow();
    m_events->appendRow(row);
    item = new QStandardItem();
    item->setText(SuperListItem::beginningText);
    m_events->appendRow(item);

    // States
    m_states->clear();
    super = SuperListItem::getById(RPM::get()->project()->gameDatas()
        ->commonEventsDatas()->modelStates()->invisibleRootItem(), 1);
    state = new SystemState(super, MapEditorSubSelectionKind::None, -1, 0, 0,
        ObjectMovingKind::Fix, nullptr, 1, 1, true, false, false, false, false,
        true, true, false);
    row = state->getModelRow();
    m_states->appendRow(row);
    item = new QStandardItem();
    item->setText(SuperListItem::beginningText);
    m_states->appendRow(item);
}

// -------------------------------------------------------

void SystemCommonObject::setDefaultHero(QStandardItemModel *modelEventsSystem,
    QStandardItemModel *)
{
    QList<QStandardItem *> row;
    QStandardItem *item;
    SystemState *state;
    SuperListItem *super;

    // ID and name
    setId(2);
    setName("Hero");

    // Properties
    item = new QStandardItem();
    item->setText(SuperListItem::beginningText);
    m_properties->appendRow(item);

    // Events
    m_events->clear();

    // Reaction to event keyPress Action
    setDefaultHeroKeyPressEvent(modelEventsSystem, 1, true, true,
        EventCommandKind::MoveObject, QVector<QString>({"7", "-1", "0", "1", "1"
        , "0", "1"}));
    setDefaultHeroKeyPressEvent(modelEventsSystem, 2, true, true,
        EventCommandKind::MoveObject, QVector<QString>({"7", "-1", "0", "1", "1"
        , "1", "1"}));
    setDefaultHeroKeyPressEvent(modelEventsSystem, 3, true, true,
        EventCommandKind::MoveObject, QVector<QString>({"7", "-1", "0", "1", "1"
        , "2", "1"}));
    setDefaultHeroKeyPressEvent(modelEventsSystem, 4, true, true,
        EventCommandKind::MoveObject, QVector<QString>({"7", "-1", "0", "1", "1"
        , "3", "1"}));
    setDefaultHeroKeyPressEvent(modelEventsSystem, 9, true, true,
        EventCommandKind::MoveCamera, QVector<QString>({"0", "1", "0", "0", "3",
        "0", "0", "3", "0", "0", "3", "0", "0", "0", "12", "-90", "12", "0", "3"
        , "0", "1", "12", "1"}));
    setDefaultHeroKeyPressEvent(modelEventsSystem, 10, true, true,
        EventCommandKind::MoveCamera, QVector<QString>({"0", "1", "0", "0", "3",
        "0", "0", "3", "0", "0", "3", "0", "0", "0", "12", "90", "12", "0", "3",
        "0", "1", "12", "1"}));
    setDefaultHeroKeyPressEvent(modelEventsSystem, 11, false, false,
        EventCommandKind::SendEvent, QVector<QString>({"1", QString::number(
        static_cast<int>(PrimitiveValueKind::DataBase)), "1", RPM
        ::TRUE_BOOL_STRING, "1", "1"}));
    setDefaultHeroKeyPressEvent(modelEventsSystem, 13, false, false,
        EventCommandKind::OpenMainMenu, QVector<QString>({}));
    item = new QStandardItem();
    item->setText(SuperListItem::beginningText);
    m_events->appendRow(item);

    // States
    m_states->clear();
    super = SuperListItem::getById(RPM::get()->project()->gameDatas()
        ->commonEventsDatas()->modelStates()->invisibleRootItem(), 1);
    state = new SystemState(super, MapEditorSubSelectionKind::SpritesFace, 1, 0,
        0, ObjectMovingKind::Fix, nullptr, 1, 1, true, false, false, false,
        false, true, true, false);
    row = state->getModelRow();
    m_states->appendRow(row);
    item = new QStandardItem();
    item->setText(SuperListItem::beginningText);
    m_states->appendRow(item);
}

// -------------------------------------------------------

void SystemCommonObject::setDefaultHeroKeyPressEvent(QStandardItemModel
    *modelEventsSystem, int k, bool r, bool ri, EventCommandKind kind, QVector<
    QString> commandList)
{
    QStandardItem *item;
    SystemObjectEvent *event;
    SystemReaction *reaction;
    EventCommand *command;
    QString name;

    name = reinterpret_cast<SystemObjectEvent *>(modelEventsSystem->item(2)
        ->data().value<quintptr>())->name();
    event = new SystemObjectEvent(3, name, new QStandardItemModel, true);
    event->addParameter(new SystemParameter(1, "", nullptr, PrimitiveValue
        ::createKeyBoard(k)));
    event->addParameter(new SystemParameter(2, "", nullptr, new PrimitiveValue(
        r)));
    event->addParameter(new SystemParameter(3, "", nullptr, new PrimitiveValue(
        ri)));
    event->setDefaultHero();
    reaction = event->reactionAt(1);
    command = new EventCommand(kind, commandList);
    SystemCommonReaction::addCommandWithoutText(reaction->modelCommands()
        ->invisibleRootItem(), command);
    if (kind == EventCommandKind::MoveObject) {
        commandList = QVector<QString>({"1", QString::number(static_cast<int>(
            PrimitiveValueKind::DataBase)), "1", RPM::TRUE_BOOL_STRING, "1", "2"});
        command = new EventCommand(EventCommandKind::SendEvent, commandList);
        SystemCommonReaction::addCommandWithoutText(reaction->modelCommands()
            ->invisibleRootItem(), command);
    }
    item = new QStandardItem;
    item->setData(QVariant::fromValue(reinterpret_cast<quintptr>(event)));
    item->setText(toString());
    m_events->appendRow(item);
}

// -------------------------------------------------------

void SystemCommonObject::setDefaultStartupObject() {
    QList<QStandardItem *> row;
    QStandardItem *item;
    SystemState *state;
    SystemObjectEvent *event;
    SuperListItem *super;
    SystemEvent *eventTime;

    m_inheritanceId = -1;

    // Properties
    item = new QStandardItem();
    item->setText(SuperListItem::beginningText);
    m_properties->appendRow(item);

    // Events
    m_events->clear();
    eventTime = reinterpret_cast<SystemEvent *>(RPM::get()->project()
        ->gameDatas()->commonEventsDatas()->modelEventsSystem()->item(0)->data()
        .value<quintptr>());
    event = new SystemObjectEvent(1, eventTime->name(), new QStandardItemModel,
        true);
    event->addParameter(new SystemParameter(1, "", reinterpret_cast<
        SystemCreateParameter *>(eventTime->modelParameters()->item(0)->data()
        .value<quintptr>()), new PrimitiveValue(PrimitiveValueKind::Default)));
    event->addParameter(new SystemParameter(2, "", reinterpret_cast<
        SystemCreateParameter *>(eventTime->modelParameters()->item(0)->data()
        .value<quintptr>()), new PrimitiveValue(false)));
    event->setDefault();
    row = event->getModelRow();
    m_events->appendRow(row);
    item = new QStandardItem();
    item->setText(SuperListItem::beginningText);
    m_events->appendRow(item);

    // States
    m_states->clear();
    super = SuperListItem::getById(RPM::get()->project()->gameDatas()
        ->commonEventsDatas()->modelStates()->invisibleRootItem(), 1);
    state = new SystemState(super, MapEditorSubSelectionKind::None, -1, 0, 0,
        ObjectMovingKind::Fix, nullptr, 1, 1, false, false, false, false, false,
        false, false, false);
    row = state->getModelRow();
    m_states->appendRow(row);
    item = new QStandardItem();
    item->setText(SuperListItem::beginningText);
    m_states->appendRow(item);
}

// -------------------------------------------------------

void SystemCommonObject::updateModelEvents() {
    SystemObjectEvent *event;
    int i, l;

    for (i = 0, l = m_events->invisibleRootItem()->rowCount() - 1; i < l; i++) {
        event = reinterpret_cast<SystemObjectEvent *>(m_events->item(i)->data()
            .value<quintptr>());
        event->updateParameters();
    }
}

// -------------------------------------------------------

bool SystemCommonObject::inherit(const SystemCommonObject *object) {
    QStandardItemModel *model;
    SystemCommonObject *obj;
    int id;

    id = object->inheritanceId();
    if (id == p_id) {
        return true;
    } else if (id == -1) {
        return false;
    } else {
        model = RPM::get()->project()->gameDatas()->commonEventsDatas()
            ->modelCommonObjects();
        obj = reinterpret_cast<SystemCommonObject *>(SuperListItem::getById(
            model->invisibleRootItem(), id));
        return inherit(obj);
    }
}

// -------------------------------------------------------

bool SystemCommonObject::canInherit(QStandardItemModel *model,
    SystemCommonObject *object) const
{
    int id, index;

    id = object->inheritanceId();
    if (this == object || id == p_id) {
        return false;
    } else if (id == -1) {
        return true;
    } else {
        index = SuperListItem::getIndexById(model->invisibleRootItem(), id);
        return this->canInherit(model, reinterpret_cast<SystemCommonObject *>(
            model->item(index)->data().value<quintptr>()));
    }
}

// -------------------------------------------------------

SystemState * SystemCommonObject::getFirstState() const {
    SystemCommonObject *obj;
    SystemState *state;

    state = nullptr;
    if (m_inheritanceId != -1) {
        obj = reinterpret_cast<SystemCommonObject *>(SuperListItem::getById(RPM
            ::get()->project()->gameDatas()->commonEventsDatas()
            ->modelCommonObjects()->invisibleRootItem(), m_inheritanceId));
        state = obj->getFirstState();
        if (state != nullptr) {
            return state;
        }
    }
    if (m_states->invisibleRootItem()->rowCount() > 0) {
        return reinterpret_cast<SystemState *>(m_states->item(0)->data().value<
            qintptr>());
    }

    return nullptr;
}

// -------------------------------------------------------

QList<QStandardItem *> SystemCommonObject::getAllCommandsList() const {
    QList<QStandardItem *> list;
    SystemObjectEvent *event;
    SystemState *state;
    int i, j, l, ll;

    for (i = 0, l = m_events->invisibleRootItem()->rowCount(); i < l; i++) {
        event = reinterpret_cast<SystemObjectEvent *>(m_events->item(i)->data()
            .value<quintptr>());
        if (event != nullptr) {
            for (j = 0, ll = m_states->invisibleRootItem()->rowCount(); j < ll;
                 j++)
            {
                state = reinterpret_cast<SystemState *>(m_states->item(j)
                    ->data().value<quintptr>());
                if (state != nullptr) {
                    list << event->reactionAt(state->id())->modelCommands()
                        ->invisibleRootItem();
                }
            }
        }
    }

    return list;
}

// -------------------------------------------------------
//
//  VIRTUAL FUNCTIONS
//
// -------------------------------------------------------

SuperListItem* SystemCommonObject::createCopy() const {
    SystemCommonObject *super = new SystemCommonObject;
    super->setCopy(*this);
    return super;
}

// -------------------------------------------------------

void SystemCommonObject::setCopy(const SuperListItem &super) {
    const SystemCommonObject *object;

    SuperListItem::setCopy(super);
    object = reinterpret_cast<const SystemCommonObject *>(&super);

    p_id = object->p_id;
    m_onlyOneEventPerFrame = object->m_onlyOneEventPerFrame;
    m_inheritanceId = object->inheritanceId();

    // Properties
    SuperListItem::copy(m_properties, object->m_properties);

    // Events
    RPM::get()->project()->setCurrentObject(this);
    SuperListItem::copy(m_events, object->m_events);

    // States
    SuperListItem::copy(m_states, object->m_states);

}

// -------------------------------------------------------

void SystemCommonObject::read(const QJsonObject &json) {
    SuperListItem::read(json);

    m_onlyOneEventPerFrame = json[JSON_ONLY_ONE_EVENT_PER_FRAME].toBool();
    m_inheritanceId = json[JSON_INHERITANCE_ID].toInt();

    // Properties
    SuperListItem::readTree(m_properties, new SystemProperty, json,
        JSON_PROPERTIES);

    // Events
    RPM::get()->project()->setCurrentObject(this);
    SuperListItem::readTree(m_events, new SystemObjectEvent, json, JSON_EVENTS);
    updateModelEvents();

    // States
    SuperListItem::readTree(m_states, new SystemState, json, JSON_STATES);
}

// -------------------------------------------------------

void SystemCommonObject::write(QJsonObject &json) const {
    SuperListItem::write(json);

    json[JSON_ONLY_ONE_EVENT_PER_FRAME] = m_onlyOneEventPerFrame;
    json[JSON_INHERITANCE_ID] = m_inheritanceId;

    // Properties
    SuperListItem::writeTree(m_properties, json, JSON_PROPERTIES);

    // Events
    SuperListItem::writeTree(m_events, json, JSON_EVENTS);

    // States
    SuperListItem::writeTree(m_states, json, JSON_STATES);
}
