/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include "widgettreecommands.h"
#include "dialogcommands.h"
#include "eventcommand.h"
#include "rpm.h"
#include "systemcommonreaction.h"
#include "common.h"
#include <QDebug>
#include <algorithm>

int WidgetTreeCommands::rectHeight = 17;
int WidgetTreeCommands::rectXOffset = 20;

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

WidgetTreeCommands::WidgetTreeCommands(QWidget *parent) :
    QTreeView(parent),
    p_model(nullptr),
    m_linkedObject(nullptr),
    m_parameters(nullptr),
    m_displayEnterBar(true)
{
    this->setMouseTracking(true);
    this->setFocus();
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

    // Timer
    connect(&m_timerEnterCommand, SIGNAL(timeout()), this, SLOT(
        onTimerEnteredCommand()));
    m_timerEnterCommand.setInterval(350);
    m_timerEnterCommand.setSingleShot(false);
    m_timerEnterCommand.start();
    m_enteredCommand = "";

    // Commands list
    initializeCommandsList();
}

WidgetTreeCommands::~WidgetTreeCommands()
{
    delete m_contextMenuCommonCommands;
}

// -------------------------------------------------------
//  initializeModel: initialialize the model of the tree commands

void WidgetTreeCommands::initializeModel(QStandardItemModel* m){
    p_model = m;
    this->setModel(p_model);
    this->expandAll();

    // Connect for context menu
    connect(this->selectionModel(),
            SIGNAL(currentChanged(QModelIndex,QModelIndex)), this,
            SLOT(onSelectionChanged(QModelIndex,QModelIndex)));

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
    QItemSelectionModel *selection = this->selectionModel();
    if (selection == nullptr) {
        return QList<QStandardItem *>();
    }
    QModelIndexList indexes = selection->selectedRows();

    if (!indexes.isEmpty()){
        item = p_model->itemFromIndex(indexes.at(0));
        command = reinterpret_cast<EventCommand *>(item->data().value<quintptr>());

        if (command != nullptr){
            QStandardItem* root = getRootOfCommand(item);

            list.append(item);
            for (int i = 1; i < indexes.size(); i++){
                item = p_model->itemFromIndex(indexes.at(i));
                if (getRootOfCommand(item) == root){
                    command = reinterpret_cast<EventCommand *>(item->data()
                        .value<quintptr>());
                    if (command != nullptr){
                        list.append(item);
                    }
                }
            }
        }

        // Sorting in order to be sure to have commands in right order
        std::sort(list.begin(), list.end(), WidgetTreeCommands::itemLessThan);
    }

    return list;
}

// -------------------------------------------------------
//  getRootOfCommand: returns the root of the current selected command

QStandardItem* WidgetTreeCommands::getRootOfCommand(QStandardItem* selected)
const
{
    if (selected != nullptr && selected->parent() != nullptr){
        return selected->parent();
    }
    else{
        return p_model->invisibleRootItem();
    }
}

QStandardItemModel *WidgetTreeCommands::getModel() const { return p_model; }

// -------------------------------------------------------
//
//  CONTEXT MENU
//
// -------------------------------------------------------

// -------------------------------------------------------
//  newCommand: open dialog commands for creating a new one

void WidgetTreeCommands::newCommand(QStandardItem* selected) {
    EventCommand *command;
    int result = QDialog::Accepted;

    if (m_enteredCommand.isEmpty()) {
        DialogCommands dialog(m_linkedObject, m_parameters);
        result = dialog.exec();
        command = dialog.getCommand();
    } else {
        EventCommandKind kind = m_availableCommands.at(m_indexSelectedCommand);
        DialogCommand *dialogCommand = DialogCommands::getDialogCommand(kind,
            nullptr, m_linkedObject, m_parameters);
        m_enteredCommand = "";
        updateEnteredCommandText();
        if (dialogCommand == nullptr) {
            command = new EventCommand(kind);
        } else {
            result = dialogCommand->exec();
            command = dialogCommand->getCommand();
        }
    }
    if (result == QDialog::Accepted) {
        QStandardItem* root = getRootOfCommand(selected);
        int insertionRow = getInsertionRow(selected, root);
        // post-increment insertionRow to prepare possible extra row, depending on command kind
        QStandardItem* item = insertCommand(command, root, insertionRow++);

        // If event command block, more commands to add...
        switch (command->kind()){
        case EventCommandKind::While:
            SystemCommonReaction::addEmptyCommand(item);
            this->expand(item->index());
            insertWhileBlock(root, insertionRow);
            break;
        case EventCommandKind::If:
            SystemCommonReaction::addEmptyCommand(item);
            this->expand(item->index());
            insertIfBlock(command, root, insertionRow);
            break;
        case EventCommandKind::StartBattle:
            if (command->isBattleWithoutGameOver())
                insertStartBattle(root, insertionRow);
            break;
        case EventCommandKind::DisplayChoice:
            insertChoiceBlocks(command, root, insertionRow);
            break;
        default:
            break;
        }

        // Update text in nodes
        updateAllNodesString(p_model->invisibleRootItem());
        if (reinterpret_cast<EventCommand *>(selected->data().value<quintptr>())
            ->kind() == EventCommandKind::None)
        {
            selected->setText("> |");
        }
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
            case EventCommandKind::DisplayChoice:
            {
                QList<int> ids;
                QList<int> newIds;
                QList<QStandardItem *> previousCommands;
                QStandardItem *item;
                int i, l, row, id, index;

                row = selected->row();
                command->getChoicesIDs(ids);
                newCommand->getChoicesIDs(newIds);
                // Remove all the previous choices
                for (i = ids.size(); i >= 1; i--) {
                    item = new QStandardItem;
                    SystemReaction::copyCommandsItem(root->child(row + i),
                        item);
                    previousCommands.insert(0, item);
                    SystemCommonReaction::deleteCommands(root->child(row + i));
                    root->removeRow(row + i);
                }
                // Add new choices and copy commands if same ID
                for (i = 0, l = newIds.size(); i < l; i++) {
                    id = newIds.at(i);
                    index = ids.indexOf(id);
                    if (index == -1) {
                        this->insertChoiceBlock(i + 1, root, row + i + 1);
                    } else {
                        item = previousCommands.at(index);
                        previousCommands.replace(index, nullptr);
                        this->insertExistingChoiceBlock(i + 1, root, row + i + 1,
                            item);
                    }
                }
                // Delete unused pointers commands copies
                for (i = 0; i < l; i++) {
                    item = previousCommands.at(i);
                    if (item != nullptr) {
                        delete reinterpret_cast<EventCommand *>(item->data()
                            .value<quintptr>());
                    }
                }
                break;
            }
            default:
                break;
            }

            // Select all
            this->selectChildren(selected);

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

void WidgetTreeCommands::copyCommand() {
    QList<QStandardItem*> list = getAllSelected();
    QStandardItem* selected;
    QStandardItem* copiedCommand;
    EventCommand* command;

    // Clear previous copy
    RPM::get()->clearCommands();

    // Copy new commands
    for (int i = 0; i < list.size(); i++){
        selected = list.at(i);
        command = reinterpret_cast<EventCommand *>(selected->data().value<
            quintptr>());

        if (command != nullptr && command->kind() != EventCommandKind::None) {
            copiedCommand = new QStandardItem;
            SystemCommonReaction::copyCommandsItem(selected, copiedCommand);
            RPM::get()->copiedCommandsAppend(copiedCommand);
        }
    }
}

// -------------------------------------------------------
//  pasteCommand: paste the copied command in the selected command

void WidgetTreeCommands::pasteCommand() {
    QStandardItem *copiedCommand, *root, *copy, *selected;
    int i, l;

    selected = getSelected();
    root = this->getRootOfCommand(selected);

    // Paste copy and fill a new list of copies
    root = getRootOfCommand(selected);
    for (i = 0, l = RPM::get()->copiedCommandsCount(); i < l; i++) {
        copiedCommand = RPM::get()->copiedCommandAt(i);
        copy = new QStandardItem;
        SystemCommonReaction::copyCommandsItem(copiedCommand, copy);
        int insertionRow = getInsertionRow(selected, root);
        root->insertRow(insertionRow, copy);
        expand(copy->index());
        updateAllNodesString(copy);
    }
}

// -------------------------------------------------------

void WidgetTreeCommands::deleteCommand() {
    QList<QStandardItem*> list = getAllSelected();
    QStandardItem* selected;
    EventCommand* command;
    QStandardItem* root;
    int row = -1;

    for (int i = 0; i < list.size(); i++){
        selected = list.at(i);
        command = reinterpret_cast<EventCommand *>(selected->data().value<
            quintptr>());

        if (command != nullptr && command->kind() != EventCommandKind::None) {
            root = getRootOfCommand(selected);

            // Delete selected command
            QList<EventCommand *> list;
            SystemCommonReaction::getCommands(list, selected);
            row = selected->row();
            root->removeRow(row);
            for (int j = 0, l = list.size(); j < l; j++)
            {
                delete list.at(j);
            }
        }
    }

    // Select node below
    if (row != -1) {
        QStandardItem *item = this->getModel()->item(row);
        this->selectionModel()->select(item->index(), QItemSelectionModel
            ::SelectCurrent);
        this->selectChildren(item);
    }
}

// -------------------------------------------------------

void WidgetTreeCommands::openCommand() {
    QStandardItem* selected = getSelected();
    if (selected != nullptr){
        EventCommand* command = reinterpret_cast<EventCommand *>(selected
            ->data().value<quintptr>());
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

void WidgetTreeCommands::insertChoiceBlocks(EventCommand* command, QStandardItem
    *root, int pos)
{
    int i, nb;

    nb = command->getChoicesNumber();
    for (i = 1; i <= nb; i++) {
        this->insertChoiceBlock(i, root, pos++);
    }
    this->insertCommand(new EventCommand(EventCommandKind::EndChoice), root, pos);
}

// -------------------------------------------------------

void WidgetTreeCommands::insertChoiceBlock(int index, QStandardItem *root, int
    pos)
{
    QVector<QString> command;
    QStandardItem *item;

    command.append(QString::number(index));
    item = this->insertCommand(new EventCommand(EventCommandKind::Choice,
        command), root, pos);
    SystemCommonReaction::addEmptyCommand(item);
    this->expand(item->index());
}

// -------------------------------------------------------

void WidgetTreeCommands::insertExistingChoiceBlock(int index, QStandardItem
    *root, int pos, QStandardItem *item)
{
    QVector<QString> list;
    EventCommand *command;

    list.append(QString::number(index));
    command = reinterpret_cast<EventCommand *>(item->data().value<quintptr>());
    command->setCommands(list);
    root->insertRow(pos, item);
    this->expand(item->index());
}

// -------------------------------------------------------

void WidgetTreeCommands::deleteEndBlock(QStandardItem *root, int row){
    EventCommand* endCommand = reinterpret_cast<EventCommand *>(root->child(row)
        ->data().value<quintptr>());
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
        EventCommand* command = reinterpret_cast<EventCommand *>(item->child(i)
            ->data().value<quintptr>());
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
        case EventCommandKind::DisplayChoice:
            int i, nbChoices;

            sm->select(item->index(), QItemSelectionModel::Select);
            j++;
            nbChoices = command->getChoicesNumber();
            for (i = 0; i < nbChoices; i++) {
                st = root->child(j++);
                sm->select(st->index(), QItemSelectionModel::Select);
                selectChildrenOnly(st);
            }
            st = root->child(j);
            sm->select(st->index(), QItemSelectionModel::Select);
            break;
        case EventCommandKind::Choice:
            st = root->child(j - command->valueCommandAt(0).toInt());
            this->selectChildren(st);
            break;
        case EventCommandKind::EndChoice:
            st = root->child(j - 1);
            this->selectChildren(st);
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

int WidgetTreeCommands::getInsertionRow(const QStandardItem* selected, const QStandardItem* root)
{
    if (selected != nullptr){
        // Some rows are selected, new commands should be inserted above
        return selected->row();
    }
    else{
        // No selection, new commands should be inserted just above the None command at the end
        return root->rowCount() - 1;
    }
}

// -------------------------------------------------------

void WidgetTreeCommands::updateEnteredCommandText(bool updateCommands) {
    QStandardItem *item = getSelected();
    EventCommand *command;

    if (item != nullptr) {
        command = reinterpret_cast<EventCommand *>(item->data().value<quintptr>());
        if (command->kind() == EventCommandKind::None) {
            item->setText("> " + m_enteredCommand + (m_displayEnterBar ? "|" : ""));
            if (updateCommands) {
                updateAvailableCommands();
            }
        }
    }
}

// -------------------------------------------------------

void WidgetTreeCommands::initializeCommandsList() {
    EventCommandKind kind;

    for (int i = static_cast<int>(EventCommandKind::ShowText); i != static_cast<
        int>(EventCommandKind::Last); i++)
    {
        kind = static_cast<EventCommandKind>(i);
        if (!EventCommand::kindToString(kind).isEmpty()) {
            m_listCommands << kind;
        }
    }

    std::sort(m_listCommands.begin(), m_listCommands.end(), EventCommand
        ::eventCommandKindLessThan);
    m_indexSelectedCommand = 0;
}

// -------------------------------------------------------

void WidgetTreeCommands::updateAvailableCommands() {
    EventCommandKind kind;
    int i, j, k;

    m_availableCommands = QList<EventCommandKind>();
    for (i = 0; i < m_listCommands.length(); i++) {
        kind = m_listCommands.at(i);
        QString command = EventCommand::kindToString(kind).toLower();
        QString currentCommand = m_enteredCommand.toLower();
        QStringList split1 = command.split(' ');
        QStringList split2 = currentCommand.split(' ');
        if (currentCommand == "") {
            split2 = QStringList();
            split2 << "";
        }
        QStringList group1 = split1;
        QStringList group2 = split2;

        for (j = 0; j < split1.length(); j++) {
            for (k = 0; k < split2.length(); k++) {
                if (split2.at(k) != "" && split1.at(j).contains(split2.at(k))) {
                    group2.removeAt(k);
                }
            }
        }

        if (group2.length() == 0) {
            m_availableCommands.append(kind);
        }
    }
    m_indexSelectedCommand = 0;

    repaint();
}

// -------------------------------------------------------

bool WidgetTreeCommands::isMouseSelectingCommand(const QPoint &pos) {
    int x;
    QStandardItem *item;
    QRect rect;
    QRect rectAll;
    bool isContaining;

    item = getSelected();
    if (item != nullptr) {
        rect = this->visualRect(item->index());
        x = rect.x() + WidgetTreeCommands::rectXOffset;
        rectAll.setX(x);
        rectAll.setY(rect.y() + WidgetTreeCommands::rectHeight);
        rectAll.setWidth(this->width() - x);
        rectAll.setHeight(m_availableCommands.length() * WidgetTreeCommands
            ::rectHeight);
        isContaining = rectAll.contains(pos);
        if (isContaining) {
            m_indexSelectedCommand = (pos.y() - rectAll.y()) / WidgetTreeCommands
                ::rectHeight;
            repaint();
        }
        return isContaining;
    }

    return false;
}

// -------------------------------------------------------

void WidgetTreeCommands::updateKeyboardUpDown(int offset) {
    QStandardItem *item, *newItem;

    if (m_availableCommands.length() > 0) {
        m_indexSelectedCommand += offset;
        m_indexSelectedCommand = Common::modulo(m_indexSelectedCommand,
            m_availableCommands.length());
        repaint();
        return;
    } else {
        item = getSelected();
        if (item != nullptr) {
            newItem = this->getModel()->item(item->row() + offset, item->column());
            if (newItem != nullptr) {
                this->selectionModel()->clear();
                this->selectionModel()->select(newItem->index(),
                    QItemSelectionModel::SelectCurrent);
                onSelectionChanged(newItem->index(), item->index());
            }
        }
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
    QKeySequence seq = Common::getKeySequence(event);
    QList<QAction*> actions = m_contextMenuCommonCommands->actions();
    QAction* action;
    int key;

    // Forcing shortcuts
    action = actions.at(1);
    if (Common::isPressingEnter(event) && action->isEnabled()) {
        contextEdit();
        return;
    }
    action = actions.at(0);
    if (Common::isPressingEnter(event) && action->isEnabled()) {
        contextNew();
        return;
    }
    action = actions.at(3);
    if (action->shortcut().matches(seq) && action->isEnabled()) {
        contextCopy();
        return;
    }
    action = actions.at(4);
    if (action->shortcut().matches(seq) && action->isEnabled()) {
        contextPaste();
        return;
    }
    action = actions.at(6);
    if (action->shortcut().matches(seq) && action->isEnabled()) {
        contextDelete();
        return;
    }

    // Alphabet for entering command
    key = event->key();
    if (key >= Qt::Key_A && key <= Qt::Key_Z) {
        m_enteredCommand += event->text();
        m_enteredCommand.replace(0, 1, m_enteredCommand.at(0).toUpper());
        updateEnteredCommandText();
        return;
    }
    if (key == Qt::Key_Up) {
        updateKeyboardUpDown(-1);
    }
    if (key == Qt::Key_Down) {
        updateKeyboardUpDown(1);
    }
    if (key == Qt::Key_Backspace) {
        m_enteredCommand = m_enteredCommand.left(m_enteredCommand.length() - 1);
        updateEnteredCommandText();
        return;
    }
}

// -------------------------------------------------------

void WidgetTreeCommands::mousePressEvent(QMouseEvent *event) {
    QPoint pos = event->pos();
    QStandardItem *item;

    if (isMouseSelectingCommand(pos)) {
        contextNew();
    } else {
        item = getSelected();
        if (item != nullptr && reinterpret_cast<EventCommand *>(item->data()
            .value<quintptr>())->kind() == EventCommandKind::None)
        {
            item->setText(">");
        }
        m_availableCommands = QList<EventCommandKind>();
        repaint();
        QTreeView::mousePressEvent(event);
    }
}

// -------------------------------------------------------

void WidgetTreeCommands::mouseMoveEvent(QMouseEvent *event) {
    QPoint pos = event->pos();
    isMouseSelectingCommand(pos);
    QTreeView::mouseMoveEvent(event);
}

// -------------------------------------------------------

void WidgetTreeCommands::mouseDoubleClickEvent(QMouseEvent* event){
    if (event->button() == Qt::MouseButton::LeftButton) {
        openCommand();
    }
}

// -------------------------------------------------------

void WidgetTreeCommands::paintEvent(QPaintEvent *event) {
    QTreeView::paintEvent(event);
    QPainter painter(viewport());
    QStandardItem *item;
    QRect rect;
    int i, x, y, w;
    bool isSelected;
    ThemeKind themeKind;

    item = getSelected();
    if (item != nullptr) {
        rect = this->visualRect(item->index());
        themeKind = RPM::get()->engineSettings()->theme();
        for (i = 0; i < m_availableCommands.length(); i++) {
            isSelected = i == m_indexSelectedCommand;
            x = rect.x() + WidgetTreeCommands::rectXOffset;
            y = rect.y() + ((i + 1) * WidgetTreeCommands::rectHeight);
            w = this->width() - x;
            painter.fillRect(x, y, w, WidgetTreeCommands::rectHeight, isSelected
                ? RPM::COLOR_MENU_SELECTION_BLUE : (themeKind == ThemeKind::Dark ?
                RPM::COLOR_GREY : RPM::COLOR_ALMOST_WHITE));
            painter.setPen(isSelected ? RPM::COLOR_ALMOST_WHITE : (themeKind ==
                ThemeKind::Dark ? RPM::COLOR_ALMOST_WHITE : RPM::COLOR_ALMOST_BLACK));
            painter.drawText(x, y + WidgetTreeCommands::rectHeight - 4,
                EventCommand::kindToString(m_availableCommands.at(i)));
            painter.setPen(RPM::COLOR_GRAY_SELECTION);
            painter.drawLine(x, y + WidgetTreeCommands::rectHeight - 1, x + w, y
                + WidgetTreeCommands::rectHeight - 1);
        }
    }
}

// -------------------------------------------------------
//
//  SLOTS
//
// -------------------------------------------------------

void WidgetTreeCommands::onSelectionChanged(QModelIndex index, QModelIndex
    indexBefore)
{
    QStandardItem* selected = p_model->itemFromIndex(index);
    QStandardItem* selectedBefore = p_model->itemFromIndex(indexBefore);
    EventCommand* command = nullptr;

    m_enteredCommand = "";
    m_availableCommands = QList<EventCommandKind>();
    if (selected != nullptr) {
        command = reinterpret_cast<EventCommand *>(selected->data().value<
            quintptr>());
        if (command->kind() == EventCommandKind::None) {
            m_displayEnterBar = true;
            m_timerEnterCommand.start();
            selected->setText("> |");
            updateEnteredCommandText();
        }
    }
    if (selectedBefore != nullptr) {
        selectedBefore->setText(reinterpret_cast<EventCommand *>(selectedBefore
            ->data().value<quintptr>())->toString(m_linkedObject, m_parameters));
    }

    m_contextMenuCommonCommands->canEdit(command != nullptr &&
                                         command->isEditable());
    repaint();
}

// -------------------------------------------------------

void WidgetTreeCommands::onTreeViewClicked(const QModelIndex &) {
    QModelIndexList l = this->selectionModel()->selectedIndexes();

    for (int i = 0; i < l.size(); i++) {
        selectChildren(p_model->itemFromIndex(l.at(i)));
    }
}

// -------------------------------------------------------

void WidgetTreeCommands::onTimerEnteredCommand() {
    m_displayEnterBar = !m_displayEnterBar;
    updateEnteredCommandText(false);
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
    newCommand(selected);
}

// -------------------------------------------------------

void WidgetTreeCommands::contextEdit(){
    QStandardItem* selected = getSelected();
    if (selected != nullptr){
        EventCommand* command = (EventCommand*)selected->data().value<quintptr>();
        editCommand(selected, command);
    }
}

// -------------------------------------------------------

void WidgetTreeCommands::contextCopy(){
    copyCommand();
}

// -------------------------------------------------------

void WidgetTreeCommands::contextPaste(){
    pasteCommand();
}

// -------------------------------------------------------

void WidgetTreeCommands::contextDelete(){
    deleteCommand();
}
