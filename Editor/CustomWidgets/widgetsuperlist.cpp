/*
    RPG Paper Maker Copyright (C) 2017-2019 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include "widgetsuperlist.h"
#include "widgetsupertree.h"
#include "rpm.h"
#include <QListWidgetItem>
#include <QMimeData>

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

WidgetSuperList::WidgetSuperList(QWidget *parent) :
    QListView(parent),
    m_newItemInstance(nullptr),
    m_canBrutRemove(false),
    m_hasContextMenu(true),
    m_canEdit(false),
    m_areNegIDsEnabled(true)
{
    this->setEditTriggers(QAbstractItemView::NoEditTriggers);
    this->setDragDropMode(QAbstractItemView::InternalMove);
    this->setDefaultDropAction(Qt::CopyAction);
    setCanDragAndDrop(true);

    // Can edit
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

void WidgetSuperList::setCanEdit(bool b) { m_canEdit = b; }

void WidgetSuperList::setCanDragAndDrop(bool b) {
    this->setAcceptDrops(b);
    this->setDragEnabled(b);
    this->setDropIndicatorShown(b);
}

void WidgetSuperList::setAreNegIDsEnabled(bool b) {
    m_areNegIDsEnabled = b;
}

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

void WidgetSuperList::initializeModel(QStandardItemModel* m) {
    QStandardItem *item;
    int i;

    p_model = m;
    this->setModel(m);

    for (i = 0; i < p_model->invisibleRootItem()->rowCount(); i++) {
        item = p_model->item(i);
        if (reinterpret_cast<SuperListItem *>(item->data().value<quintptr>()
            )->id() < 1)
        {
            item->setEnabled(m_areNegIDsEnabled);
        }
    }
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

void WidgetSuperList::setMaximum(int newSize) {
    QModelIndex modelIndex;
    int previousSize = p_model->invisibleRootItem()->rowCount();

    // Add new empty items
    if (newSize > previousSize) {
        for (int i = previousSize; i < newSize; i++){
            SuperListItem* super = m_newItemInstance->createCopy();
            super->setId(i+1);
            super->setDefault();
            QList<QStandardItem*> row = super->getModelRow();
            p_model->insertRow(i, row);
        }
    } else {
        for (int i = previousSize - 1; i >= newSize; i--){
            SuperListItem* super = (SuperListItem*) p_model->item(i)->data()
                                   .value<quintptr>();
            p_model->removeRow(i);
            delete super;
        }
        emit deleteIDs();
    }
    modelIndex = p_model->index(p_model->invisibleRootItem()->rowCount() - 1, 0);
    setCurrentIndex(modelIndex);

    emit updated();
}

// -------------------------------------------------------

void WidgetSuperList::addNewItem(SuperListItem* super){
    SuperListItem* copy = super->createCopy();
    copy->setId(WidgetSuperTree::getNewId(p_model, 0));

    QList<QStandardItem*> row = copy->getModelRow();
    p_model->appendRow(row);
    QModelIndex modelIndex = p_model->index(p_model->invisibleRootItem()->rowCount() - 1, 0);
    setCurrentIndex(modelIndex);

    emit updated();
}

// -------------------------------------------------------

void WidgetSuperList::updateKeyboardUpDown(int offset) {
    QStandardItem *item;
    item = getSelected();
    if (item != nullptr) {
        item = this->getModel()->item(item->row() + offset, item->column());
        if (item != nullptr) {
            this->selectionModel()->clear();
            this->selectionModel()->setCurrentIndex(item->index(), QItemSelectionModel::Select);
        }
    }
}

// -------------------------------------------------------

void WidgetSuperList::brutDelete(QStandardItem* item){
    SuperListItem* super = (SuperListItem*) item->data().value<qintptr>();

    if (super->id() > 0) {
        delete ((SuperListItem*) item->data().value<qintptr>());
        p_model->removeRow(item->row());

        emit updated();
    }
}

// -------------------------------------------------------
//
//  EVENTS
//
// -------------------------------------------------------

void WidgetSuperList::keyPressEvent(QKeyEvent *event) {
    int key;

    if (RPM::isPressingEnter(event)) {
        emit tryingEdit();
    }

    if (m_hasContextMenu || m_canBrutRemove){

        QKeySequence seq = RPM::getKeySequence(event);
        QList<QAction*> actions = m_contextMenu->actions();
        QAction* action;

        // Forcing shortcuts
        action = actions.at(0);
        if (RPM::isPressingEnter(event) && action->isEnabled()) {
            contextEdit();
            return;
        }
        action = actions.at(2);
        if (action->shortcut().matches(seq) && action->isEnabled()) {
            contextCopy();
            return;
        }
        action = actions.at(3);
        if (action->shortcut().matches(seq) && action->isEnabled()) {
            contextPaste();
            return;
        }
        action = actions.at(5);
        if (action->shortcut().matches(seq) && action->isEnabled()) {
            contextDelete();
            return;
        }
    }

    key = event->key();
    if (key == Qt::Key_Up) {
        updateKeyboardUpDown(-1);
    }
    if (key == Qt::Key_Down) {
        updateKeyboardUpDown(1);
    }
}

// -------------------------------------------------------
//
//  SLOTS
//
// -------------------------------------------------------

void WidgetSuperList::openDialog(QModelIndex){
    if (m_canEdit) {
        QStandardItem* selected = getSelected();
        if (selected != nullptr) {
            SuperListItem* super = (SuperListItem*)(selected->data()
                                                    .value<quintptr>());
            if (super->openDialog()){
                selected->setText(super->toString());

                emit updated();
            }
        }
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
            m_contextMenu->canEdit(m_canEdit);
            m_contextMenu->canCopy(false);
            m_contextMenu->canPaste(false);
            m_contextMenu->canDelete(m_canBrutRemove);
            m_contextMenu->showContextMenu(p);
        }
    }
}

// -------------------------------------------------------

void WidgetSuperList::contextEdit(){
    QStandardItem* selected = getSelected();
    openDialog(selected->index());
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
