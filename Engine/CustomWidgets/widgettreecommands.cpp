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

#include "widgettreecommands.h"
#include "dialogcommands.h"
#include "eventcommand.h"
#include "wanok.h"
#include "systemcommonreaction.h"
#include <QDebug>

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

WidgetTreeCommands::WidgetTreeCommands(QWidget *parent) :
    QTreeView(parent),
    p_model(nullptr),
    m_linkedObject(nullptr),
    m_parameters(nullptr)
{
    this->setWordWrap(true);
    this->setHeaderHidden(true);
    this->setIndentation(15);
    this->setContextMenuPolicy(Qt::CustomContextMenu);
    this->setSelectionMode(
                QAbstractItemView::SelectionMode::ContiguousSelection);
    connect(this,
            SIGNAL(clicked(QModelIndex)),
            this,
            SLOT(onTreeViewClicked(QModelIndex)));

    // Context menu connections
    m_contextMenuCommonCommands = ContextMenuList::createContextCommand(this);
    connect(this, SIGNAL(customContextMenuRequested(const QPoint &)),
            this, SLOT(showContextMenu(const QPoint &)));
}

WidgetTreeCommands::~WidgetTreeCommands()
{
    QStandardItem* copiedCommand;

    delete m_contextMenuCommonCommands;

    for (int i = 0; i < m_copiedCommands.size(); i++){
        copiedCommand = m_copiedCommands.at(i);
        SystemCommonReaction::deleteCommands(copiedCommand);
        delete copiedCommand;
    }
}

// -------------------------------------------------------
//  initializeModel: initialialize the model of the tree commands

void WidgetTreeCommands::initializeModel(QStandardItemModel* m){
    p_model = m;
    this->setModel(p_model);
    this->expandAll();

    // Update text in nodes
    updateAllNodesString(p_model->invisibleRootItem());
}

// -------------------------------------------------------

void WidgetTreeCommands::initializeLinkedObject(SystemCommonObject* object){
    m_linkedObject = object;
}

// -------------------------------------------------------

void WidgetTreeCommands::initializeParameters(QStandardItemModel* parameters){
    m_parameters = parameters;
}

// -------------------------------------------------------
//  getSelected: returns the current selected item of the tree commands

QStandardItem* WidgetTreeCommands::getSelected() const{
    QList<QStandardItem*> list = getAllSelected();

    if (list.isEmpty())
        return nullptr;
    else
        return list.first();
}

// -------------------------------------------------------

QList<QStandardItem*> WidgetTreeCommands::getAllSelected() const{
    QList<QStandardItem*> list;
    QStandardItem* item;
    EventCommand* command;
    QModelIndexList indexes = this->selectionModel()->selectedRows();

    if (!indexes.isEmpty()){
        item = p_model->itemFromIndex(indexes.at(0));
        command = (EventCommand*) item->data().value<quintptr>();

        if (command != nullptr){
            QStandardItem* root = getRootOfCommand(item);

            list.append(item);
            for (int i = 1; i < indexes.size(); i++){
                item = p_model->itemFromIndex(indexes.at(i));
                if (getRootOfCommand(item) == root){
                    command = (EventCommand*) item->data().value<quintptr>();
                    if (command != nullptr){
                        list.append(item);
                    }
                }
            }
        }

        // Sorting in order to be sure to have commands in right order
        qSort(list.begin(), list.end(), WidgetTreeCommands::itemLessThan);
    }

    return list;
}

// -------------------------------------------------------
//  getRootOfCommand: returns the root of the current selected command

QStandardItem* WidgetTreeCommands::getRootOfCommand(QStandardItem* selected)
const
{
    return (selected->parent() == nullptr) ? p_model->invisibleRootItem()
                                           : selected->parent();
}

QStandardItemModel *WidgetTreeCommands::getModel() const { return p_model; }

// -------------------------------------------------------
//
//  CONTEXT MENU
//
// -------------------------------------------------------

// -------------------------------------------------------
//  newCommand: open dialog commands for creating a new one

void WidgetTreeCommands::newCommand(QStandardItem* selected){
    DialogCommands dialog(m_linkedObject, m_parameters);
    if (dialog.exec() == QDialog::Accepted){
        EventCommand* command = dialog.getCommand();
        QStandardItem* root = getRootOfCommand(selected);
        QStandardItem* item = insertCommand(command, root, selected->row());

        // If event command block, more commands to add...
        switch (command->kind()){
        case EventCommandKind::While:
            SystemCommonReaction::addEmptyCommand(item);
            this->expand(item->index());
            insertWhileBlock(root, selected->row());
            break;
        case EventCommandKind::If:
            SystemCommonReaction::addEmptyCommand(item);
            this->expand(item->index());
            insertIfBlock(command, root, selected->row());
            break;
        case EventCommandKind::StartBattle:
            if (command->isBattleWithoutGameOver())
                insertStartBattle(root, selected->row());
            break;
        default:
            break;
        }

        // Update text in nodes
        updateAllNodesString(p_model->invisibleRootItem());
    }
}

// -------------------------------------------------------
//  editCommand: open dialog command for editing

void WidgetTreeCommands::editCommand(QStandardItem *selected,
                                     EventCommand* command)
{
    // An editable command has a dialog associated to it
    if (command->isEditable()){
        DialogCommand* dialog =
                DialogCommands::getDialogCommand(command->kind(), command,
                                                 m_linkedObject, m_parameters);
        if (dialog->exec() == QDialog::Accepted){
            EventCommand* newCommand = dialog->getCommand();
            QStandardItem* root = getRootOfCommand(selected);

            // If command condition, check else was removed or added
            switch (command->kind()){
            case EventCommandKind::If:
                // If removing else node
                if (command->hasElse() && !newCommand->hasElse())
                    deleteElseBlock(root, selected->row() + 1);
                // If adding else node
                else if (!command->hasElse() && newCommand->hasElse())
                    insertElseBlock(root, selected->row() + 1);
                break;
            case EventCommandKind::StartBattle:
                // If removing nodes
                if (command->isBattleWithoutGameOver() &&
                    !newCommand->isBattleWithoutGameOver())
                {
                    deleteStartBattleBlock(root, selected->row() + 1);
                }
                // If adding nodes
                else if (!command->isBattleWithoutGameOver() &&
                         newCommand->isBattleWithoutGameOver())
                {
                    insertStartBattle(root, selected->row() + 1);
                }
                break;
            default:
                break;
            }

            delete command;
            selected->setData(QVariant::fromValue(
                                  reinterpret_cast<quintptr>(newCommand)));
            updateAllNodesString(p_model->invisibleRootItem());
        }
        delete dialog;
    }
}

// -------------------------------------------------------
//  copyCommand: copy the selected command

void WidgetTreeCommands::copyCommand(){
    QList<QStandardItem*> list = getAllSelected();
    QStandardItem* selected;
    QStandardItem* copiedCommand;
    EventCommand* command;

    // Clear previous copy
    for (int i = 0; i < m_copiedCommands.size(); i++){
        copiedCommand = m_copiedCommands.at(i);
        SystemCommonReaction::deleteCommands(copiedCommand);
        delete copiedCommand;
    }
    m_copiedCommands.clear();

    // Copy new commands
    for (int i = 0; i < list.size(); i++){
        selected = list.at(i);
        command = (EventCommand*) selected->data().value<quintptr>();

        if (command != nullptr && command->kind() != EventCommandKind::None){
            copiedCommand = new QStandardItem;
            SystemCommonReaction::copyCommandsItem(selected, copiedCommand);
            m_copiedCommands.append(copiedCommand);
        }
    }
}

// -------------------------------------------------------
//  pasteCommand: paste the copied command in the selected command

void WidgetTreeCommands::pasteCommand(QStandardItem* selected){
    QStandardItem* copiedCommand;
    QStandardItem* root = getRootOfCommand(selected);
    QStandardItem* copy;

    // Paste copy and fill a new list of copies
    for (int i = 0; i < m_copiedCommands.size(); i++){
        copiedCommand = m_copiedCommands.at(i);
        copy = new QStandardItem;
        SystemCommonReaction::copyCommandsItem(copiedCommand, copy);
        root->insertRow(selected->row(), copy);
        expand(copy->index());
        updateAllNodesString(copy);
    }
}

// -------------------------------------------------------

void WidgetTreeCommands::deleteCommand(){
    QList<QStandardItem*> list = getAllSelected();
    QStandardItem* selected;
    EventCommand* command;
    QStandardItem* root;

    for (int i = 0; i < list.size(); i++){
        selected = list.at(i);
        command = (EventCommand*) selected->data().value<quintptr>();

        if (command != nullptr && command->kind() != EventCommandKind::None){
            root = getRootOfCommand(selected);

            // Delete selected command
            SystemCommonReaction::deleteCommands(selected);
            root->removeRow(selected->row());
        }
    }
}

// -------------------------------------------------------

void WidgetTreeCommands::openCommand() {
    QStandardItem* selected = getSelected();
    if (selected != nullptr){
        EventCommand* command = (EventCommand*)selected->data()
                                .value<quintptr>();
        // if empty, create a new command
        if (command->kind() == EventCommandKind::None){
            newCommand(selected);
        }
        // Else only edit the command
        else{
            editCommand(selected, command);
        }
    }
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

QStandardItem* WidgetTreeCommands::insertCommand(EventCommand* command,
                                                 QStandardItem* root, int pos)
{
    QStandardItem* item = new QStandardItem();
    item->setData(QVariant::fromValue(reinterpret_cast<quintptr>(command)));
    item->setText(command->toString(m_linkedObject, m_parameters));
    root->insertRow(pos, item);

    return item;
}

// -------------------------------------------------------

void WidgetTreeCommands::insertWhileBlock(QStandardItem* root, int pos){
    insertCommand(new EventCommand(EventCommandKind::EndWhile), root, pos);
}

// -------------------------------------------------------

void WidgetTreeCommands::insertIfBlock(EventCommand* command,
                                       QStandardItem* root, int pos)
{
    // If there is an else
    if (command->hasElse())
        insertElseBlock(root,pos++);

    insertCommand(new EventCommand(EventCommandKind::EndIf), root, pos);
}

// -------------------------------------------------------

void WidgetTreeCommands::insertElseBlock(QStandardItem *root, int pos){
    QStandardItem* itemElse = insertCommand(
                new EventCommand(EventCommandKind::Else), root, pos++);
    SystemCommonReaction::addEmptyCommand(itemElse);
    this->expand(itemElse->index());
}

// -------------------------------------------------------

void WidgetTreeCommands::insertStartBattle(QStandardItem *root, int pos){
    QStandardItem* itemWin = insertCommand(
                new EventCommand(EventCommandKind::IfWin), root, pos++);
    SystemCommonReaction::addEmptyCommand(itemWin);
    this->expand(itemWin->index());
    QStandardItem* itemLose = insertCommand(
                new EventCommand(EventCommandKind::IfLose), root, pos++);
    SystemCommonReaction::addEmptyCommand(itemLose);
    this->expand(itemLose->index());
    insertCommand(new EventCommand(EventCommandKind::EndIf), root, pos);
}

// -------------------------------------------------------

void WidgetTreeCommands::deleteEndBlock(QStandardItem *root, int row){
    EventCommand* endCommand = (EventCommand*)(root->child(row)->data()
                                               .value<quintptr>());
    root->removeRow(row);
    delete endCommand;
}

// -------------------------------------------------------

void WidgetTreeCommands::deleteElseBlock(QStandardItem *root, int row){
    SystemCommonReaction::deleteCommands(root->child(row));
    root->removeRow(row);
}

// -------------------------------------------------------

void WidgetTreeCommands::deleteStartBattleBlock(QStandardItem *root, int row){
    SystemCommonReaction::deleteCommands(root->child(row));
    root->removeRow(row);
    SystemCommonReaction::deleteCommands(root->child(row));
    root->removeRow(row);
    deleteEndBlock(root, row);
}

// -------------------------------------------------------

void WidgetTreeCommands::updateAllNodesString(QStandardItem *item){
    for (int i = 0; i < item->rowCount(); i++){
        updateAllNodesString(item->child(i));
        EventCommand* command = (EventCommand*) item->child(i)->data()
                                .value<quintptr>();
        item->child(i)->setText(command->toString(m_linkedObject,
                                                  m_parameters));
    }
}

// -------------------------------------------------------

void WidgetTreeCommands::selectChildren(QStandardItem* item){

    // Select children
    selectChildrenOnly(item);

    // Select others (end etc.)
    EventCommand* command = (EventCommand*) item->data().value<quintptr>();
    QStandardItem* root = getRootOfCommand(item);
    QItemSelectionModel* sm = this->selectionModel();
    QStandardItem* st;
    int j = item->row();

    if (command != nullptr){
        switch(command->kind()){
        case EventCommandKind::While:
            st = root->child(j+1);
            sm->select(st->index(), QItemSelectionModel::Select);
            break;
        case EventCommandKind::EndWhile:
            st = root->child(j-1);
            sm->select(st->index(), QItemSelectionModel::Select);
            selectChildrenOnly(st);
            break;
        case EventCommandKind::StartBattle:
            if (command->isBattleWithoutGameOver()){
                st = root->child(j+1);
                sm->select(st->index(), QItemSelectionModel::Select);
                selectChildrenOnly(st);
                st = root->child(j+2);
                sm->select(st->index(), QItemSelectionModel::Select);
                selectChildrenOnly(st);
                st = root->child(j+3);
                sm->select(st->index(), QItemSelectionModel::Select);
            }
            break;
        case EventCommandKind::IfWin:
            st = root->child(j-1);
            sm->select(st->index(), QItemSelectionModel::Select);
            selectChildren(st);
            break;
        case EventCommandKind::IfLose:
            st = root->child(j-2);
            sm->select(st->index(), QItemSelectionModel::Select);
            selectChildren(st);
            break;
        case EventCommandKind::EndIf:
            st = root->child(j-1);
            command = (EventCommand*) st->data().value<quintptr>();

            // Battle
            if (command->kind() == EventCommandKind::IfLose){
                st = root->child(j-3);
                sm->select(st->index(), QItemSelectionModel::Select);
                selectChildren(st);
            }
            // Condition
            else{
                if (command->kind() == EventCommandKind::Else)
                    st = root->child(j-2);
                sm->select(st->index(), QItemSelectionModel::Select);
                selectChildren(st);
            }
            break;
        case EventCommandKind::If:
            st = root->child(j++);
            command = (EventCommand*) st->data().value<quintptr>();

            // Else
            if (command->hasElse()){
                st = root->child(j++);
                sm->select(st->index(), QItemSelectionModel::Select);
                selectChildrenOnly(st);
            }

            // End
            st = root->child(j);
            sm->select(st->index(), QItemSelectionModel::Select);
            break;
        case EventCommandKind::Else:
            st = root->child(j-1);
            sm->select(st->index(), QItemSelectionModel::Select);
            selectChildren(st);
            break;
        default:
            break;
        }
    }
}

// -------------------------------------------------------

void WidgetTreeCommands::selectChildrenOnly(QStandardItem* item){
    QModelIndex index = item->index();

    // Select children
    for (int i = 0; i < item->rowCount(); i++){
        QModelIndex childIndex = p_model->index(i, 0, index);
        this->selectionModel()->select(childIndex, QItemSelectionModel::Select);
        selectChildren(item->child(i));
    }
}

// -------------------------------------------------------

bool WidgetTreeCommands::itemLessThan(const QStandardItem* item1,
                                      const QStandardItem* item2)
{
    return item1->row() < item2->row();
}

// -------------------------------------------------------
//
//  EVENTS
//
// -------------------------------------------------------

// -------------------------------------------------------
//  keyPressEvent: force shortcuts

void WidgetTreeCommands::keyPressEvent(QKeyEvent *event){
    QKeySequence seq = Wanok::getKeySequence(event);
    QList<QAction*> actions = m_contextMenuCommonCommands->actions();

    // Forcing shortcuts
    if (actions.at(0)->shortcut().matches(seq))
        contextNew();
    else if (actions.at(3)->shortcut().matches(seq))
        contextCopy();
    else if (actions.at(4)->shortcut().matches(seq))
        contextPaste();
    else if (actions.at(6)->shortcut().matches(seq))
        contextDelete();

    // Pressing space or enter open command
    if (event->key() == Qt::Key_Space || event->key() == Qt::Key_Enter ||
        event->key() == Qt::Key_Return)
    {
        openCommand();
    }
}

// -------------------------------------------------------
//  mouseDoubleClickEvent: when double clicking, edit if existing command,
//  if not create a new one

void WidgetTreeCommands::mouseDoubleClickEvent(QMouseEvent* event){
    if (event->button() == Qt::MouseButton::LeftButton)
        openCommand();
}

// -------------------------------------------------------
//
//  SLOTS
//
// -------------------------------------------------------

void WidgetTreeCommands::onTreeViewClicked(const QModelIndex &){
    QModelIndexList l = this->selectionModel()->selectedIndexes();

    for (int i = 0; i < l.size(); i++)
        selectChildren(p_model->itemFromIndex(l.at(i)));
}

// -------------------------------------------------------
//
//  CONTEXT MENU SLOTS
//
// -------------------------------------------------------

// -------------------------------------------------------
//  showContextMenu: if right clicking, open this menu context

void WidgetTreeCommands::showContextMenu(const QPoint & p){
    QStandardItem* selected = getSelected();
    if (selected != nullptr)
        m_contextMenuCommonCommands->showContextMenu(p);
}

// -------------------------------------------------------

void WidgetTreeCommands::contextNew(){
    QStandardItem* selected = getSelected();
    if (selected != nullptr)
        newCommand(selected);
}

// -------------------------------------------------------

void WidgetTreeCommands::contextEdit(){
    QStandardItem* selected = getSelected();
    EventCommand* command = (EventCommand*)selected->data().value<quintptr>();
    if (selected != nullptr && command->kind() != EventCommandKind::None)
        editCommand(selected, command);
}

// -------------------------------------------------------

void WidgetTreeCommands::contextCopy(){
    QStandardItem* selected = getSelected();
    if (selected != nullptr)
        copyCommand();
}

// -------------------------------------------------------

void WidgetTreeCommands::contextPaste(){
    QStandardItem* selected = getSelected();
    if (selected != nullptr){
        pasteCommand(selected);
    }
}

// -------------------------------------------------------

void WidgetTreeCommands::contextDelete(){
    deleteCommand();
}
