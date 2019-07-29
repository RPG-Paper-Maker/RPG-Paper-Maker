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

QString SystemCommonObject::strInheritance = "hId";
QString SystemCommonObject::strStates = "states";
QString SystemCommonObject::strEvents = "events";

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

SystemCommonObject::SystemCommonObject() :
    SystemCommonObject(1,"",-1,new QStandardItemModel, new QStandardItemModel)
{

}

SystemCommonObject::SystemCommonObject(int i, QString n, int id,
                                       QStandardItemModel* states,
                                       QStandardItemModel* events) :
    SuperListItem(i,n),
    m_inheritanceId(id),
    m_states(states),
    m_events(events)
{

}

SystemCommonObject::~SystemCommonObject(){
    SuperListItem::deleteModel(m_states);
    SuperListItem::deleteModel(m_events);
}

int SystemCommonObject::inheritanceId() const { return m_inheritanceId; }

void SystemCommonObject::setInheritance(int id) { m_inheritanceId = id; }

QStandardItemModel* SystemCommonObject::modelStates() const { return m_states; }

QStandardItemModel* SystemCommonObject::modelEvents() const { return m_events; }

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void SystemCommonObject::setDefault(){
    QStandardItem* model = RPM::get()->project()->gameDatas()
            ->commonEventsDatas()->modelCommonObjects()->invisibleRootItem();
    int id = p_id;

    // Copy the object with ID 1
    SystemCommonObject* object = static_cast<SystemCommonObject*>(
        SuperListItem::getById(model, 1));
    SuperListItem::deleteModel(m_states, false);
    SuperListItem::deleteModel(m_events, false);
    setCopy(*object);
    setId(id);
    setName("");
}

// -------------------------------------------------------

void SystemCommonObject::setDefaultFirst() {
    QList<QStandardItem*> row;
    QStandardItem* item;
    SystemState* state;
    SuperListItem* super;

    // ID and name
    setId(1);
    setName("Basic");

    QStandardItemModel* modelEventsUser =
            RPM::get()->project()->gameDatas()->commonEventsDatas()
            ->modelEventsUser();

    // Events
    m_events->clear();
    QString name = ((SystemObjectEvent*) modelEventsUser->item(0)->data()
                    .value<quintptr>())->name();
    SystemObjectEvent* event = new SystemObjectEvent(1, name,
                                                     new QStandardItemModel,
                                                     false);
    event->setDefault();
    row = event->getModelRow();
    m_events->appendRow(row);
    item = new QStandardItem();
    item->setText(SuperListItem::beginningText);
    m_events->appendRow(item);

    // States
    m_states->clear();
    super = SuperListItem::getById(RPM::get()->project()->gameDatas()
                                   ->commonEventsDatas()->modelStates()
                                   ->invisibleRootItem(), 1);
    state = new SystemState(super, MapEditorSubSelectionKind::None, -1, 0, 0,
                            true, false, false, false, false, true, true,
                            false);
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
    QList<QStandardItem*> row;
    QStandardItem* item;
    SystemState* state;
    SuperListItem* super;

    // ID and name
    setId(2);
    setName("Hero");

    // Events
    m_events->clear();

    // Reaction to event keyPress Action
    setDefaultHeroKeyPressEvent(modelEventsSystem, 1, true, true,
                                EventCommandKind::MoveObject,
                                QVector<QString>({"7", "-1", "0", "1", "1",
                                                  "0", "1"}));
    setDefaultHeroKeyPressEvent(modelEventsSystem, 2, true, true,
                                EventCommandKind::MoveObject,
                                QVector<QString>({"7", "-1", "0", "1", "1",
                                                  "1", "1"}));
    setDefaultHeroKeyPressEvent(modelEventsSystem, 3, true, true,
                                EventCommandKind::MoveObject,
                                QVector<QString>({"7", "-1", "0", "1", "1",
                                                  "2", "1"}));
    setDefaultHeroKeyPressEvent(modelEventsSystem, 4, true, true,
                                EventCommandKind::MoveObject,
                                QVector<QString>({"7", "-1", "0", "1", "1",
                                                  "3", "1"}));
    setDefaultHeroKeyPressEvent(modelEventsSystem, 9, true, true,
                                EventCommandKind::MoveCamera,
                                QVector<QString>({"0", "1", "0", "0", "3", "0",
                                                  "0", "3", "0", "0", "3", "0",
                                                  "0", "0", "12", "-90", "12",
                                                  "0", "3", "0", "1", "12", "1"}
                                                 ));
    setDefaultHeroKeyPressEvent(modelEventsSystem, 10, true, true,
                                EventCommandKind::MoveCamera,
                                QVector<QString>({"0", "1", "0", "0", "3", "0",
                                                  "0", "3", "0", "0", "3", "0",
                                                  "0", "0", "12", "90", "12",
                                                  "0", "3", "0", "1", "12", "1"}
                                                 ));
    setDefaultHeroKeyPressEvent(modelEventsSystem, 11, false, false,
                                EventCommandKind::SendEvent,
                                QVector<QString>({"1", "1", "1", "1"}));
    setDefaultHeroKeyPressEvent(modelEventsSystem, 13, false, false,
                                EventCommandKind::OpenMainMenu,
                                QVector<QString>({}));

    item = new QStandardItem();
    item->setText(SuperListItem::beginningText);
    m_events->appendRow(item);

    // States
    m_states->clear();
    super = SuperListItem::getById(RPM::get()->project()->gameDatas()
                                   ->commonEventsDatas()->modelStates()
                                   ->invisibleRootItem(), 1);
    state = new SystemState(super, MapEditorSubSelectionKind::SpritesFace, 1, 0,
                            0, true, false, false, false, false, true, true,
                            false);
    row = state->getModelRow();
    m_states->appendRow(row);
    item = new QStandardItem();
    item->setText(SuperListItem::beginningText);
    m_states->appendRow(item);
}

// -------------------------------------------------------

void SystemCommonObject::setDefaultHeroKeyPressEvent(
        QStandardItemModel *modelEventsSystem, int k, bool r, bool ri,
        EventCommandKind kind, QVector<QString> commandList)
{
    QStandardItem* item;
    QString name;
    SystemObjectEvent* event;
    SystemReaction* reaction;
    EventCommand* command;

    name = ((SystemObjectEvent*) modelEventsSystem->item(2)->data()
            .value<quintptr>())->name();
    event = new SystemObjectEvent(3, name, new QStandardItemModel, true);
    event->addParameter(new SystemParameter(1, "", nullptr,
                                            PrimitiveValue::createKeyBoard(k)));
    event->addParameter(new SystemParameter(2, "", nullptr,
                                            new PrimitiveValue(r)));
    event->addParameter(new SystemParameter(3, "", nullptr,
                                            new PrimitiveValue(ri)));
    event->setDefaultHero();
    reaction = event->reactionAt(1);
    command = new EventCommand(kind, commandList);
    SystemCommonReaction::addCommandWithoutText(reaction->modelCommands()
                                          ->invisibleRootItem(), command);
    if (kind == EventCommandKind::MoveObject) {
        commandList = QVector<QString>({"1", "1", "1", "2"});
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

void SystemCommonObject::updateModelEvents(){
    for (int i = 0; i < m_events->invisibleRootItem()->rowCount()-1; i++){
        SystemObjectEvent* event = (SystemObjectEvent*) m_events->item(i)
                ->data().value<quintptr>();
        event->updateParameters();
    }
}

// -------------------------------------------------------

bool SystemCommonObject::inherit(const SystemCommonObject *object){
    int id = object->inheritanceId();
    if (id == p_id) return true;
    else if (id == -1) return false;
    else{
        QStandardItemModel* model = RPM::get()->project()->gameDatas()
                ->commonEventsDatas()->modelCommonObjects();
        SystemCommonObject* obj =
                (SystemCommonObject*)
                SuperListItem::getById(model->invisibleRootItem(), id);
        return inherit(obj);
    }
}

// -------------------------------------------------------

bool SystemCommonObject::canInherit(QStandardItemModel* model,
                                    SystemCommonObject* object) const
{
    int id = object->inheritanceId();
    if (this == object || id == p_id) return false;
    else if (id == -1) return true;
    else{
        int index = SuperListItem::getIndexById(model->invisibleRootItem(), id);
        return canInherit(model, (SystemCommonObject*) model->item(index+1)
                          ->data().value<quintptr>());
    }
}

// -------------------------------------------------------

SystemState* SystemCommonObject::getFirstState() const{
    SystemState* state = nullptr;

    if (m_inheritanceId != -1){
        SystemCommonObject* obj;
        obj = (SystemCommonObject*) SuperListItem::getById(
                    RPM::get()->project()->gameDatas()->commonEventsDatas()
                    ->modelCommonObjects()->invisibleRootItem(),
                    m_inheritanceId);
        state = obj->getFirstState();
        if (state != nullptr)
            return state;
    }

    if (m_states->invisibleRootItem()->rowCount() > 0)
        return (SystemState*) m_states->item(0)->data().value<qintptr>();

    return nullptr;
}

// -------------------------------------------------------

SuperListItem* SystemCommonObject::createCopy() const{
    SystemCommonObject* super = new SystemCommonObject;
    super->setCopy(*this);
    return super;
}

// -------------------------------------------------------

void SystemCommonObject::setCopy(const SystemCommonObject& item){
    SuperListItem::setCopy(item);
    p_id = item.p_id;
    m_inheritanceId = item.inheritanceId();

    // Events
    SuperListItem::copy(m_events, item.m_events);

    // States
    SuperListItem::copy(m_states, item.m_states);
}

// -------------------------------------------------------
//
//  READ / WRITE
//
// -------------------------------------------------------

void SystemCommonObject::read(const QJsonObject &json){
    SuperListItem::read(json);
    m_inheritanceId = json[strInheritance].toInt();

    // Events
    SuperListItem::readTree(m_events, new SystemObjectEvent, json, strEvents);
    updateModelEvents();

    // States
    SuperListItem::readTree(m_states, new SystemState, json, strStates);
}

// -------------------------------------------------------

void SystemCommonObject::write(QJsonObject &json) const{
    SuperListItem::write(json);
    json[strInheritance] = m_inheritanceId;

    // Events
    QJsonArray tab;
    SuperListItem::writeTree(m_events, json, strEvents);

    // States
    SuperListItem::writeTree(m_states, json, strStates);
}
