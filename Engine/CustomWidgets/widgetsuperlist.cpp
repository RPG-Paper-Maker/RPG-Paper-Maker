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

#include "widgetsuperlist.h"
#include "widgetsupertree.h"
#include "wanok.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

WidgetSuperList::WidgetSuperList(QWidget *parent) :
    QListView(parent),
    m_newItemInstance(nullptr),
    m_canBrutRemove(false),
    m_hasContextMenu(true)
{
    this->setEditTriggers(QAbstractItemView::NoEditTriggers);
    this->setAcceptDrops(true);
    this->setDragEnabled(true);
    this->setDefaultDropAction(Qt::MoveAction);
    this->setDragDropMode(QAbstractItemView::InternalMove);
    this->setDefaultDropAction(Qt::TargetMoveAction);
    this->showDropIndicator();

    connect(this, SIGNAL(doubleClicked(QModelIndex)), this,
            SLOT(openDialog(QModelIndex)));

    // Context
    this->setContextMenuPolicy(Qt::CustomContextMenu);
    m_contextMenu = ContextMenuList::createContextSuperList(this);
    connect(this, SIGNAL(customContextMenuRequested(const QPoint &)),
            this, SLOT(showContextMenu(const QPoint &)));
}

WidgetSuperList::~WidgetSuperList()
{
    delete m_contextMenu;
    if (m_newItemInstance != nullptr)
        delete m_newItemInstance;
}

void WidgetSuperList::setCanBrutRemove(bool b) { m_canBrutRemove = b; }

void WidgetSuperList::setHasContextMenu(bool b) { m_hasContextMenu = b; }

QStandardItemModel *WidgetSuperList::getModel() const { return p_model; }

void WidgetSuperList::setName(const QString &s){
    QStandardItem* selected = getSelected();
    if (selected != nullptr){
        SuperListItem* super = (SuperListItem*)(selected->data()
                                                .value<quintptr>());
        super->setName(s);
        selected->setText(super->toString());
    }
}

void WidgetSuperList::initializeModel(QStandardItemModel* m){
    p_model = m;
    this->setModel(m);
}

void WidgetSuperList::initializeNewItemInstance(SuperListItem* item){
    m_newItemInstance = item;
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

QStandardItem* WidgetSuperList::getSelected() const{
    return p_model->itemFromIndex(this->selectionModel()->currentIndex());
}

// -------------------------------------------------------

void WidgetSuperList::setIndex(int i){
    QModelIndex index = getModel()->index(i,0);
    setCurrentIndex(index);
}

// -------------------------------------------------------

int WidgetSuperList::getIndex(){
    return this->selectionModel()->currentIndex().row();
}

// -------------------------------------------------------

void WidgetSuperList::setMaximum(int newSize){
    int previousSize = p_model->invisibleRootItem()->rowCount();

    // Add new empty items
    if (newSize > previousSize){
        for (int i = previousSize; i < newSize; i++){
            SuperListItem* super = m_newItemInstance->createCopy();
            super->setDefault();
            super->setId(i+1);
            QList<QStandardItem*> row = super->getModelRow();
            p_model->insertRow(i, row);
        }
    }
    else{
        for (int i = previousSize - 1; i >= newSize; i--){
            SuperListItem* super = (SuperListItem*) p_model->item(i)->data()
                                   .value<quintptr>();
            p_model->removeRow(i);
            delete super;
        }
    }
}

// -------------------------------------------------------

void WidgetSuperList::addNewItem(SuperListItem* super){
    SuperListItem* copy = new SuperListItem;
    copy->setCopy(*super);
    copy->setId(WidgetSuperTree::getNewId(p_model, 0));

    QList<QStandardItem*> row = copy->getModelRow();
    p_model->appendRow(row);
    QModelIndex modelIndex = p_model->index(
                p_model->invisibleRootItem()->rowCount() - 1, 0);
    setCurrentIndex(modelIndex);
}

// -------------------------------------------------------

void WidgetSuperList::brutDelete(QStandardItem* item){
    SuperListItem* super = (SuperListItem*) item->data().value<qintptr>();

    if (super->id() != -1){
        delete ((SuperListItem*) item->data().value<qintptr>());
        p_model->removeRow(item->row());
    }
}

// -------------------------------------------------------
//
//  EVENTS
//
// -------------------------------------------------------

void WidgetSuperList::keyPressEvent(QKeyEvent *event){
    if (m_hasContextMenu || m_canBrutRemove){

        // Forcing shortcuts
        QKeySequence seq = Wanok::getKeySequence(event);
        QList<QAction*> actions =  m_contextMenu->actions();

        if (actions.at(3)->shortcut().matches(seq))
            contextDelete();

        if (m_hasContextMenu){

        }
    }
}

// -------------------------------------------------------
//
//  SLOTS
//
// -------------------------------------------------------

void WidgetSuperList::openDialog(QModelIndex){
    QStandardItem* selected = getSelected();
    if (selected != nullptr){
        SuperListItem* super = (SuperListItem*)(selected->data()
                                                .value<quintptr>());
        super->openDialog();
    }
}

// -------------------------------------------------------
//
//  CONTEXT MENU SLOTS
//
// -------------------------------------------------------

void WidgetSuperList::showContextMenu(const QPoint & p){
    if (m_hasContextMenu){
        QStandardItem* selected = getSelected();
        if (selected != nullptr){
            m_contextMenu->showContextMenu(p);
        }
    }
}

// -------------------------------------------------------

void WidgetSuperList::contextCopy(){

}

// -------------------------------------------------------

void WidgetSuperList::contextPaste(){

}

// -------------------------------------------------------

void WidgetSuperList::contextDelete(){
    QStandardItem* selected = getSelected();
    if (selected != nullptr){
        if (m_canBrutRemove)
            brutDelete(selected);
    }
}
