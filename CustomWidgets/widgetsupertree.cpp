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

#include "widgetsupertree.h"
#include "superlistitem.h"
#include "wanok.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

WidgetSuperTree::WidgetSuperTree(QWidget *parent) :
    QTreeView(parent),
    p_model(nullptr),
    m_newItemInstance(nullptr),
    m_copiedItem(nullptr),
    m_canBeEmpty(true),
    m_updateId(false),
    m_hasContextMenu(true),
    m_canBeControled(true),
    m_canMove(true)
{
    this->setIndentation(0);
    this->setEditTriggers(QAbstractItemView::NoEditTriggers);
    this->setHorizontalScrollBarPolicy(Qt::ScrollBarAlwaysOff);
    this->setContextMenuPolicy(Qt::CustomContextMenu);
    m_contextMenuCommonCommands = ContextMenuList::createContextCommand(this);
    connect(this, SIGNAL(customContextMenuRequested(const QPoint &)),
            this, SLOT(showContextMenu(const QPoint &)));
}

WidgetSuperTree::~WidgetSuperTree()
{
    delete m_contextMenuCommonCommands;
    if (m_newItemInstance != nullptr)
        delete m_newItemInstance;

    if (m_copiedItem != nullptr)
        delete m_copiedItem;
}

QStandardItemModel *WidgetSuperTree::getModel() const { return p_model; }

void WidgetSuperTree::setCanBeEmpty(bool b){ m_canBeEmpty = b; }

void WidgetSuperTree::setUpdateId(bool b) { m_updateId = b; }

void WidgetSuperTree::setHasContextMenu(bool b) { m_hasContextMenu = b; }

void WidgetSuperTree::setCanBeControled(bool b) { m_canBeControled = b; }

void WidgetSuperTree::setCanMove(bool b) { m_canMove = b; }

void WidgetSuperTree::initializeModel(QStandardItemModel* m){
    p_model = m;
    this->setModel(m);
}

void WidgetSuperTree::initializeNewItemInstance(SuperListItem* item){
    m_newItemInstance = item;
}

// -------------------------------------------------------
//
//  CONTEXT MENU
//
// -------------------------------------------------------

void WidgetSuperTree::setItem(QStandardItem *selected, SuperListItem* super) {
    SuperListItem* previous =
            (SuperListItem*)(selected->data().value<quintptr>());

    QStandardItem* root = getRootOfItem(selected);
    QList<QStandardItem*> row = super->getModelRow();
    int index = selected->row();
    if (previous != nullptr)
        root->removeRow(index);
    root->insertRow(index, row);
    QModelIndex modelIndex = p_model->index(index,0);
    setCurrentIndex(modelIndex);
    emit needsUpdateJson(super);
}

// -------------------------------------------------------

void WidgetSuperTree::newItem(QStandardItem* selected){
    SuperListItem* super = m_newItemInstance->createCopy();
    if (super->openDialog()){
        QStandardItem* root = getRootOfItem(selected);
        int index = selected->row();
        addNewItem(super, root, index);
    }
    else
        delete super;
}

// -------------------------------------------------------

void WidgetSuperTree::editItem(QStandardItem *selected){
    SuperListItem* super = (SuperListItem*)(selected->data().value<quintptr>());
    if (super->openDialog())
        setItem(selected, super);
}

// -------------------------------------------------------

void WidgetSuperTree::copyItem(QStandardItem* selected){
    SuperListItem* super = (SuperListItem*)(selected->data().value<quintptr>());

    if (m_copiedItem == nullptr)
        m_copiedItem = super->createCopy();
    else
        m_copiedItem->setCopy(*super);
}

// -------------------------------------------------------

void WidgetSuperTree::pasteItem(QStandardItem* selected){
    if (m_copiedItem != nullptr) {
        SuperListItem* super = m_copiedItem->createCopy();
        setItem(selected, super);
    }
}

// -------------------------------------------------------

void WidgetSuperTree::deleteItem(QStandardItem* selected){
    SuperListItem* super = (SuperListItem*)(selected->data().value<quintptr>());
    int row;

    // Can't delete empty node
    if (super != nullptr){
        // If can be empty
        if (m_canBeEmpty || p_model->invisibleRootItem()->rowCount() > 2){
            QStandardItem* root = getRootOfItem(selected);
            row = selected->row();
            root->removeRow(row);
            emit deletingItem(super, row);
            delete super;
            emit needsUpdateJson(nullptr);
        }
    }
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

// -------------------------------------------------------
//  getSelected: returns the current selected item of the tree commands

QStandardItem* WidgetSuperTree::getSelected() const{
    return p_model->item(this->selectionModel()->currentIndex().row());
}

// -------------------------------------------------------
//  getRootOfCommand: returns the root of the current selected command

QStandardItem* WidgetSuperTree::getRootOfItem(QStandardItem* selected){
    return (selected->parent() == nullptr) ? p_model->invisibleRootItem()
                                           : selected->parent();
}

// -------------------------------------------------------

void WidgetSuperTree::updateAllNodesString(QStandardItem *item){
    for (int i = 0; i < item->rowCount(); i++){
        updateAllNodesString(item->child(i));
        SuperListItem* super = (SuperListItem*) item->child(i)->data()
                               .value<quintptr>();
        if (super != nullptr)
            item->child(i)->setText(super->toString());
    }
}

// -------------------------------------------------------

int WidgetSuperTree::getNewId(QStandardItemModel *model, int offset){
    int id;
    for (id = 1; id < model->invisibleRootItem()->rowCount(); id++){
        bool test = false;
        int length = model->invisibleRootItem()->rowCount() - offset;
        for (int j = 0; j < length; j++){
            SuperListItem* super = (SuperListItem*) model->item(j)->data()
                                   .value<quintptr>();
            if (id == super->id()){
                test = true;
                break;
            }
        }
        if (!test) break;
    }

    return id;
}

// -------------------------------------------------------

void WidgetSuperTree::addNewItem(SuperListItem* super, QStandardItem *root,
                                 int index)
{
    if (m_updateId)
        super->setId(getNewId(p_model));
    QList<QStandardItem*> row = super->getModelRow();
    root->insertRow(index, row);
    QModelIndex modelIndex = p_model->index(index, 0);
    setCurrentIndex(modelIndex);
    emit needsUpdateJson(super);
}

// -------------------------------------------------------
//
//  EVENTS
//
// -------------------------------------------------------

void WidgetSuperTree::keyPressEvent(QKeyEvent *event){
    if (m_hasContextMenu || !m_canBeControled){

        // Forcing shortcuts
        QKeySequence seq = Wanok::getKeySequence(event);
        QList<QAction*> actions =  m_contextMenuCommonCommands->actions();

        if (actions.at(6)->shortcut().matches(seq))
            contextDelete();

        if (m_canBeControled){
            if (actions.at(0)->shortcut().matches(seq))
                contextNew();
            else if (actions.at(3)->shortcut().matches(seq))
                contextCopy();
            else if (actions.at(4)->shortcut().matches(seq))
                contextPaste();
        }
    }

    if (m_canMove){
        // Moving items
        int moving = 0;
        if (event->key() == Qt::Key_Up)
            moving = 1;
        else if (event->key() == Qt::Key_Down)
            moving = 2;

        if (moving != 0){
            QStandardItem* selected = getSelected();
            SuperListItem* super = (SuperListItem*)(selected->data()
                                                    .value<quintptr>());
            // Last empty node can't be moved
            if (super != nullptr){
                QStandardItem* root = getRootOfItem(selected);
                int index = selected->row();
                int newIndex = index;
                newIndex += (moving == 1) ? -1 : 1;
                // Always have the last node empty
                if (newIndex >= 0 && newIndex < p_model->invisibleRootItem()
                                                ->rowCount() - 1)
                {
                    root->removeRow(index);
                    QList<QStandardItem*> row = super->getModelRow();
                    root->insertRow(newIndex, row);
                    QModelIndex modelIndex = p_model->index(newIndex,0);
                    setCurrentIndex(modelIndex);
                    emit needsUpdateJson(nullptr);
                }
            }
        }
    }
}

// -------------------------------------------------------



// -------------------------------------------------------
//  mouseDoubleClickEvent: when double clicking, edit if existing command,
//  if not create a new one

void WidgetSuperTree::mouseDoubleClickEvent(QMouseEvent* event){
    if (m_canBeControled){
        if (event->button() == Qt::MouseButton::LeftButton){
            QStandardItem* selected = getSelected();
            if (selected != nullptr){
                SuperListItem* super = (SuperListItem*)(selected->data()
                                                        .value<quintptr>());
                // if empty, create a new command
                if (super == nullptr){
                    newItem(selected);
                }
                // Else only edit the command
                else{
                    editItem(selected);
                }
            }
        }
    }
    QTreeView::mouseDoubleClickEvent(event);
}

// -------------------------------------------------------
//
//  CONTEXT MENU SLOTS
//
// -------------------------------------------------------
// -------------------------------------------------------
//  showContextMenu: if right clicking, open this menu context

void WidgetSuperTree::showContextMenu(const QPoint & p){
    if (m_hasContextMenu){
        QStandardItem* selected = getSelected();
        if (selected != nullptr){
            m_contextMenuCommonCommands->showContextMenu(p);
        }
    }
}

// -------------------------------------------------------

void WidgetSuperTree::contextNew(){
    QStandardItem* selected = getSelected();
    if (selected != nullptr)
        newItem(selected);
}

// -------------------------------------------------------

void WidgetSuperTree::contextEdit(){
    QStandardItem* selected = getSelected();
    if (selected != nullptr)
        editItem(selected);
}

// -------------------------------------------------------

void WidgetSuperTree::contextCopy(){
    QStandardItem* selected = getSelected();
    if (selected != nullptr)
        copyItem(selected);
}

// -------------------------------------------------------

void WidgetSuperTree::contextPaste(){
    QStandardItem* selected = getSelected();
    if (selected != nullptr)
        pasteItem(selected);
}

// -------------------------------------------------------

void WidgetSuperTree::contextDelete(){
    QStandardItem* selected = getSelected();
    if (selected != nullptr)
        deleteItem(selected);
}

// -------------------------------------------------------
//
//  READ / WRITE
//
// -------------------------------------------------------

void WidgetSuperTree::copy(QStandardItemModel *model,
                           QStandardItemModel *modelToCopy)
{
    QList<QStandardItem*> row;
    for (int i = 0; i < modelToCopy->invisibleRootItem()->rowCount()-1; i++){
        SuperListItem* super = (SuperListItem*) modelToCopy->item(i)->data()
                .value<quintptr>();
        SuperListItem* newSuper = super->createCopy();
        row = newSuper->getModelRow();
        model->appendRow(row);
    }
    QStandardItem* item = new QStandardItem();
    item->setText(SuperListItem::beginningText);
    model->appendRow(item);
}

// -------------------------------------------------------

void WidgetSuperTree::read(QStandardItemModel* model,
                           SuperListItem& newInstance,
                           const QJsonArray &json)
{
    for (int i = 0; i < json.size(); i++){
        SuperListItem* super = newInstance.createCopy();
        super->read(json.at(i).toObject());
        QList<QStandardItem*> row = super->getModelRow();
        model->appendRow(row);
    }
    QStandardItem* item = new QStandardItem();
    item->setText(SuperListItem::beginningText);
    model->appendRow(item);
}

// -------------------------------------------------------

void WidgetSuperTree::write(QStandardItemModel *model, QJsonArray &json){
    for (int i = 0; i < model->invisibleRootItem()->rowCount() - 1; i++){
        QJsonObject obj;
        SuperListItem* super = (SuperListItem*) model->item(i)->data()
                               .value<quintptr>();
        super->write(obj);
        json.append(obj);
    }
}
