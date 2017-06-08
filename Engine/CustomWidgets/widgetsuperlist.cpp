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

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

WidgetSuperList::WidgetSuperList(QWidget *parent) :
    QListView(parent),
    m_newItemInstance(nullptr)
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
}

WidgetSuperList::~WidgetSuperList()
{
    if (m_newItemInstance != nullptr) delete m_newItemInstance;
}

QStandardItemModel *WidgetSuperList::getModel() const { return p_model; }

void WidgetSuperList::setName(const QString &s){
    QStandardItem* selected = getCurrentItemModel();
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

QStandardItem* WidgetSuperList::getCurrentItemModel() const{
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
//
//  SLOTS
//
// -------------------------------------------------------

void WidgetSuperList::openDialog(QModelIndex){
    QStandardItem* selected = getCurrentItemModel();
    if (selected != nullptr){
        SuperListItem* super = (SuperListItem*)(selected->data()
                                                .value<quintptr>());
        super->openDialog();
    }
}
