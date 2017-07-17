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

#include "systemcommonobject.h"
#include "wanok.h"
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
    QList<QStandardItem*> row;
    QStandardItem* item;
    SystemState* state;
    SuperListItem* super;
    QStandardItemModel* modelEventsUser =
            Wanok::get()->project()->gameDatas()->commonEventsDatas()
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
    super = SuperListItem::getById(Wanok::get()->project()->gameDatas()
                                   ->commonEventsDatas()->modelStates()
                                   ->invisibleRootItem(), 1);
    state = new SystemState(super, MapEditorSubSelectionKind::None, -1, 0, 0,
                            false, false, false, false, false, false, false,
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

    // Name
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
    setDefaultHeroKeyPressEvent(modelEventsSystem, 5, false, false,
                                EventCommandKind::SendEvent,
                                QVector<QString>({"1", "1", "1", "1"}));
    setDefaultHeroKeyPressEvent(modelEventsSystem, 7, false, false,
                                EventCommandKind::OpenMainMenu,
                                QVector<QString>({}));

    item = new QStandardItem();
    item->setText(SuperListItem::beginningText);
    m_events->appendRow(item);

    // States
    m_states->clear();
    super = SuperListItem::getById(Wanok::get()->project()->gameDatas()
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
        QStandardItemModel* model = Wanok::get()->project()->gameDatas()
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
                    Wanok::get()->project()->gameDatas()->commonEventsDatas()
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
    WidgetSuperTree::copy(m_events, item.m_events);

    // States
    WidgetSuperTree::copy(m_states, item.m_states);
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
    QJsonArray tab = json[strEvents].toArray();
    SystemObjectEvent newInstanceEvent;
    WidgetSuperTree::read(m_events, newInstanceEvent, tab);
    updateModelEvents();

    // States
    tab = json[strStates].toArray();
    SystemState newInstanceState;
    WidgetSuperTree::read(m_states, newInstanceState, tab);
}

// -------------------------------------------------------

void SystemCommonObject::write(QJsonObject &json) const{
    SuperListItem::write(json);
    json[strInheritance] = m_inheritanceId;

    // Events
    QJsonArray tab;
    WidgetSuperTree::write(m_events, tab);
    json[strEvents] = tab;

    // States
    tab = QJsonArray();
    WidgetSuperTree::write(m_states, tab);
    json[strStates] = tab;
}
