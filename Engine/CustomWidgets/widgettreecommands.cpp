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
    m_copiedCommand(nullptr),
    m_linkedObject(nullptr),
    m_parameters(nullptr)
{
    this->setHeaderHidden(true);
    this->setIndentation(15);
    this->setContextMenuPolicy(Qt::CustomContextMenu);

    // Context menu connections
    m_contextMenuCommonCommands = ContextMenuList::createContextCommand(this);
    connect(this, SIGNAL(customContextMenuRequested(const QPoint &)),
            this, SLOT(showContextMenu(const QPoint &)));
}

WidgetTreeCommands::~WidgetTreeCommands()
{
    delete m_contextMenuCommonCommands;
    if (m_copiedCommand != nullptr) delete m_copiedCommand;
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
    return p_model->itemFromIndex(this->selectionModel()->currentIndex());
}

// -------------------------------------------------------
//  getRootOfCommand: returns the root of the current selected command

QStandardItem* WidgetTreeCommands::getRootOfCommand(QStandardItem* selected){
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

void WidgetTreeCommands::copyCommand(QStandardItem* , EventCommand* ){
    // TODO
}

// -------------------------------------------------------
//  pasteCommand: paste the copied command in the selected command

void WidgetTreeCommands::pasteCommand(QStandardItem* ){
    // TODO
}

// -------------------------------------------------------

void WidgetTreeCommands::deleteCommand(QStandardItem* selected){
    EventCommand* command = (EventCommand*)selected->data().value<quintptr>();
    if (command->isErasable()){
        QStandardItem* root = getRootOfCommand(selected);

        // If block of instructions, more commands to delete
        switch (command->kind()){
        case EventCommandKind::While:
            SystemCommonReaction::deleteCommands(selected);
            deleteEndBlock(root, selected->row() + 1); break;
        case EventCommandKind::If:
            SystemCommonReaction::deleteCommands(selected);
            if (command->hasElse()) deleteElseBlock(root, selected->row() + 1);
            deleteEndBlock(root, selected->row() + 1); break;
        case EventCommandKind::StartBattle:
            SystemCommonReaction::deleteCommands(selected);
            if (command->isBattleWithoutGameOver())
                deleteStartBattleBlock(root, selected->row() + 1);
            break;
        default:
            break;
        }

        // Delete selected command
        delete command;
        root->removeRow(selected->row());
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
    EventCommand* elseCommand = (EventCommand*)(root->child(row)->data()
                                                .value<quintptr>());
    SystemCommonReaction::deleteCommands(root->child(row));
    root->removeRow(row);
    delete elseCommand;
}

// -------------------------------------------------------

void WidgetTreeCommands::deleteStartBattleBlock(QStandardItem *root, int row){
    EventCommand* winCommand = (EventCommand*)(root->child(row)->data()
                                               .value<quintptr>());
    SystemCommonReaction::deleteCommands(root->child(row));
    root->removeRow(row);
    delete winCommand;
    EventCommand* loseCommand = (EventCommand*)(root->child(row)->data()
                                                .value<quintptr>());
    SystemCommonReaction::deleteCommands(root->child(row));
    root->removeRow(row);
    delete loseCommand;
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
//
//  EVENTS
//
// -------------------------------------------------------

// -------------------------------------------------------
//  keyPressEvent: force shortcuts

void WidgetTreeCommands::keyPressEvent(QKeyEvent *event){
    QKeySequence seq = Wanok::getKeySequence(event);
    QList<QAction*> actions = m_contextMenuCommonCommands->actions();

    if (actions.at(0)->shortcut().matches(seq))
        contextNew();
    else if (actions.at(6)->shortcut().matches(seq))
        contextDelete();
}

// -------------------------------------------------------
//  mouseDoubleClickEvent: when double clicking, edit if existing command,
//  if not create a new one

void WidgetTreeCommands::mouseDoubleClickEvent(QMouseEvent* event){
    if (event->button() == Qt::MouseButton::LeftButton){
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
    if (selected != nullptr){
        m_contextMenuCommonCommands->showContextMenu(p);
    }
}

// -------------------------------------------------------

void WidgetTreeCommands::contextNew(){
    QStandardItem* selected = getSelected();
    if (selected != nullptr){
        newCommand(selected);
    }
}

// -------------------------------------------------------

void WidgetTreeCommands::contextEdit(){
    QStandardItem* selected = getSelected();
    EventCommand* command = (EventCommand*)selected->data().value<quintptr>();
    if (selected != nullptr && command->kind() != EventCommandKind::None){
        editCommand(selected, command);
    }
}

// -------------------------------------------------------

void WidgetTreeCommands::contextCopy(){
    QStandardItem* selected = getSelected();
    EventCommand* command = (EventCommand*)selected->data().value<quintptr>();
    if (selected != nullptr && command->kind() != EventCommandKind::None){
        copyCommand(selected,command);
    }
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
    QStandardItem* selected = getSelected();
    if (selected != nullptr){
        deleteCommand(selected);
    }
}
