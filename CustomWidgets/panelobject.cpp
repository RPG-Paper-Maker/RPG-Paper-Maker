/*
    RPG Paper Maker Copyright (C) 2017-2018 Marie Laporte

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

#include "panelobject.h"
#include "ui_panelobject.h"
#include "systemobjectevent.h"
#include "systemevent.h"
#include "systemstate.h"
#include "systemcommonreaction.h"
#include "wanok.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

PanelObject::PanelObject(QWidget *parent) :
    QWidget(parent),
    ui(new Ui::PanelObject),
    m_model(nullptr),
    m_copiedReaction(nullptr)
{
    ui->setupUi(this);

    // Updating infos lists
    ui->treeViewStates->initializeNewItemInstance(new SystemState);
    ui->treeViewEvents->setUpdateId(true);
    ui->treeViewEvents->initializeNewItemInstance(new SystemObjectEvent);

    // Keep space when hiding widgets
    QSizePolicy sp_retain;
    QList<QWidget *> widgetList = QList<QWidget*>({ui->tabWidgetCommands,
        ui->groupBoxMoving, ui->groupBoxOptions, ui->labelGraphics,
        ui->frameGraphics, ui->comboBoxGraphics});
    for (int i = 0; i < widgetList.size(); i++) {
        sp_retain = widgetList[i]->sizePolicy();
        sp_retain.setRetainSizeWhenHidden(true);
        widgetList[i]->setSizePolicy(sp_retain);
    }
}

PanelObject::~PanelObject()
{
    if (m_copiedReaction != nullptr)
        delete m_copiedReaction;

    delete ui;
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void PanelObject::initializeList(QStandardItemModel *list) {
    m_list = list;
    updateList();
}

// -------------------------------------------------------

void PanelObject::updateList() {
    ui->comboBoxInheritance->clear();
    ui->comboBoxInheritance->addItem("None");
    SuperListItem::fillComboBox(ui->comboBoxInheritance, m_list);
}

// -------------------------------------------------------

void PanelObject::initializeModel(SystemCommonObject *object) {
    m_model = object;
}

// -------------------------------------------------------

void PanelObject::updateModel() {
    if (m_model != nullptr) {
        clear();

        QModelIndex index;
        ui->lineEditName->setText(m_model->name());
        initializeCommonInheritance();

        // Events
        ui->treeViewEvents->initializeModel(m_model->modelEvents());
        connect(ui->treeViewEvents->selectionModel(), SIGNAL(currentChanged(
            QModelIndex, QModelIndex)), this, SLOT(on_eventChanged(QModelIndex,
            QModelIndex)));
        connect(ui->treeViewEvents, SIGNAL(needsUpdateJson(SuperListItem *)),
            this, SLOT(on_updateJsonEvents(SuperListItem *)));
        index = ui->treeViewEvents->getModel()->index(0,0);
        ui->treeViewEvents->setCurrentIndex(index);

        // States
        ui->treeViewStates->initializeModel(m_model->modelStates());
        connect(ui->treeViewStates->selectionModel(), SIGNAL(currentChanged(
            QModelIndex,QModelIndex)), this, SLOT(on_stateChanged(QModelIndex,
            QModelIndex)));
        connect(ui->treeViewStates, SIGNAL(needsUpdateJson(SuperListItem *)),
            this, SLOT(on_updateJsonStates(SuperListItem *)));
        index = ui->treeViewStates->getModel()->index(0,0);
        ui->treeViewStates->setCurrentIndex(index);
        updateReactionsWidgets();
        on_stateChanged(index, index);
    }
}

// -------------------------------------------------------

void PanelObject::clear() {
    ui->tabWidgetCommands->clear();
    m_reactions.clear();
    m_checkBoxes.clear();
    m_pushButtons.clear();
}

// -------------------------------------------------------

void PanelObject::setInheritanceName(int index, QString name) {
    ui->comboBoxInheritance->setItemText(index, name);
}

// -------------------------------------------------------

void PanelObject::initializeCommonInheritance() {

    // Disable the unselectable inheritances
    const QStandardItemModel *model = qobject_cast<const QStandardItemModel *>(
        ui->comboBoxInheritance->model());
    for (int i = 0; i < m_list->invisibleRootItem()->rowCount(); i++) {
        QStandardItem *item = model->item(i+1);
        SystemCommonObject *object = reinterpret_cast<SystemCommonObject *>(
            m_list->item(i)->data().value<quintptr>());
        bool disable = !m_model->canInherit(m_list, object);

        item->setFlags(disable ? item->flags() & ~(Qt::ItemIsSelectable|
            Qt::ItemIsEnabled) : Qt::ItemIsSelectable|Qt::ItemIsEnabled);
        item->setData(disable ? ui->comboBoxInheritance->palette().color(
            QPalette::Disabled, QPalette::Text) : QVariant(), Qt::TextColorRole);
    }

    // Select the current selected inheritance
    int index = 0;
    int id = m_model->inheritanceId();
    if (id != -1)
        index = SuperListItem::getIndexById(m_list->invisibleRootItem(), id + 1);

    ui->comboBoxInheritance->setCurrentIndex(index);
}

// -------------------------------------------------------

void PanelObject::showStateWidgets(bool b) {
    ui->tabWidgetCommands->setVisible(b);
    ui->groupBoxMoving->setVisible(b);
    ui->groupBoxOptions->setVisible(b);
    ui->labelGraphics->setVisible(b);
    ui->frameGraphics->setVisible(b);
    ui->comboBoxGraphics->setVisible(b);
}

// -------------------------------------------------------

void PanelObject::showName(bool b) {
    ui->labelName->setVisible(b);
    ui->lineEditName->setVisible(b);
}

// -------------------------------------------------------

void PanelObject::updateReactions() {
    int l, ll;

    // For each events, there should be exactly the right keys ids
    l = m_model->modelEvents()->invisibleRootItem()->rowCount();
    for (int i = 0; i < l-1; i++) {
        SystemObjectEvent *event = reinterpret_cast<SystemObjectEvent *>(m_model
            ->modelEvents()->item(i)->data().value<quintptr>());

        ll = m_model->modelStates()->invisibleRootItem()->rowCount();
        for (int j = 0; j < ll-1; j++) {
            SystemState *state = reinterpret_cast<SystemState *>(m_model
                ->modelStates()->item(j)->data().value<quintptr>());

            // If missing a key, create a new one
            if (event->reactionAt(state->id()) == nullptr)
                event->addReaction(state->id(), new SystemReaction);
        }

        event->updateReactions(m_model->modelStates());
    }
}

// -------------------------------------------------------

void PanelObject::updateReactionsWidgets() {
    QGridLayout *layout;
    QWidget *widget;
    QWidget *widgetCheckbox;
    WidgetTreeCommands *tree;
    SystemObjectEvent *event;
    QCheckBox *checkbox;
    QPushButton *pushButton;
    QSpacerItem *spacer;
    QHBoxLayout *hlayout;
    QVariant variant;
    int l;

    // Update reactions (if new/delete)
    updateReactions();
    QStandardItem *selected = ui->treeViewStates->getSelected();
    SystemState *super = reinterpret_cast<SystemState *>(selected->data()
        .value<quintptr>());

    if (super != nullptr) {
        clear();

        // Create all the corresponding tabs for all events
        l = ui->treeViewEvents->getModel()->invisibleRootItem()->rowCount();
        for (int i = 0; i < l - 1; i++){
            event = reinterpret_cast<SystemObjectEvent *>(ui->treeViewEvents
                ->getModel()->item(i)->data().value<quintptr>());
            widget = new QWidget();
            layout = new QGridLayout(widget);
            tree = new WidgetTreeCommands();
            m_reactions.append(tree);
            layout->addWidget(tree, 0, 0);

            // Checkboxes and buttons
            variant = QVariant::fromValue(reinterpret_cast<quintptr>(event
                ->reactionAt(super->id())));
            widgetCheckbox = new QWidget();
            hlayout = new QHBoxLayout(widgetCheckbox);
            checkbox = new QCheckBox("Blocking hero");
            checkbox->setProperty("reaction", variant);
            connect(checkbox, SIGNAL(toggled(bool)), this, SLOT(
                on_blockingHeroChanged(bool)));
            m_checkBoxes.append(checkbox);
            hlayout->addWidget(checkbox);
            spacer = new QSpacerItem(1,1);
            hlayout->addSpacerItem(spacer);
            pushButton = new QPushButton("Copy reaction");
            pushButton->setProperty("reaction", variant);
            connect(pushButton, SIGNAL(clicked(bool)), this, SLOT(on_copyReaction()));
            m_pushButtons.append(pushButton);
            hlayout->addWidget(pushButton);
            pushButton = new QPushButton("Paste reaction");
            pushButton->setProperty("reaction", variant);
            pushButton->setEnabled(m_copiedReaction != nullptr);
            connect(pushButton, SIGNAL(clicked(bool)), this, SLOT(on_pasteReaction()));
            m_pushButtons.append(pushButton);
            hlayout->addWidget(pushButton);

            hlayout->setStretch(1,1);
            layout->addWidget(widgetCheckbox,1,0);

            ui->tabWidgetCommands->addTab(widget, event->getLabelTab());
        }
    }
}

// -------------------------------------------------------

SystemState* PanelObject::getSelectedState() const {
    return reinterpret_cast<SystemState *>(ui->treeViewStates->getSelected()
        ->data().value<qintptr>());
}

// -------------------------------------------------------

void PanelObject::updateStateOptions(SystemState *state) {
    ui->checkBoxMoveAnimation->setChecked(state->moveAnimation());
    ui->checkBoxStopAnimation->setChecked(state->stopAnimation());
    ui->checkBoxDirectionFix->setChecked(state->directionFix());
    ui->checkBoxThrough->setChecked(state->through());
    ui->checkBoxSetWithCamera->setChecked(state->setWithCamera());
    ui->checkBoxPixelOffset->setChecked(state->pixelOffset());
}

// -------------------------------------------------------

void PanelObject::passToSprite() {
    ui->comboBoxGraphics->setCurrentIndex(2);
}

// -------------------------------------------------------

void PanelObject::passToNone() {
    ui->comboBoxGraphics->setCurrentIndex(0);
}

// -------------------------------------------------------
//
//  SLOTS
//
// -------------------------------------------------------

void PanelObject::on_lineEditName_textChanged(const QString &text) {
    m_model->setName(text);
}

// -------------------------------------------------------

void PanelObject::on_comboBoxInheritance_currentIndexChanged(int index) {
    if (m_model != nullptr && index != -1 && ui->comboBoxInheritance->count() >
        1)
    {
        SystemCommonObject *object = nullptr;
        int id = -1;
        if (index != 0) {
            object = reinterpret_cast<SystemCommonObject *>(m_list->item(index -
                1)->data().value<quintptr>());
            id = object->id();
        }

        m_model->setInheritance(id);
    }
}

// -------------------------------------------------------

void PanelObject::on_updateJsonStates(SuperListItem *) {
    on_stateChanged(ui->treeViewStates->currentIndex(), ui->treeViewStates
        ->currentIndex());
}

// -------------------------------------------------------

void PanelObject::on_updateJsonEvents(SuperListItem *) {
    updateReactionsWidgets();
    on_updateJsonStates(nullptr);
}

// -------------------------------------------------------

void PanelObject::on_stateChanged(QModelIndex index, QModelIndex) {
    QModelIndex eventIndex = ui->treeViewEvents->currentIndex();
    QStandardItem *selected = ui->treeViewStates->getModel()->itemFromIndex(index);
    if (selected != nullptr) {
        updateReactionsWidgets();

        SystemState *super = reinterpret_cast<SystemState *>(selected->data()
            .value<quintptr>());
        if (super != nullptr) {

            // Graphics
            ui->frameGraphics->setState(super);
            int i = 0;
            switch (super->graphicsKind()) {
            case MapEditorSubSelectionKind::None:
                i = 0; break;
            case MapEditorSubSelectionKind::SpritesFix:
                i = 1; break;
            case MapEditorSubSelectionKind::SpritesFace:
                i = 2; break;
            default:
                break;
            }
            ui->comboBoxGraphics->setCurrentIndex(i);
            ui->frameGraphics->repaint();

            // Events
            for (int i = 0; i < m_reactions.size(); i++) {
                SystemObjectEvent *event = reinterpret_cast<SystemObjectEvent *>(
                    m_model->modelEvents()->item(i)->data().value<quintptr>());

                if (event != nullptr) {
                    SystemReaction *reaction = event->reactionAt(super->id());

                    // Commands
                    WidgetTreeCommands *widget = m_reactions.at(i);
                    widget->initializeLinkedObject(m_model);
                    widget->initializeParameters(event->modelParameters());
                    widget->initializeModel(reaction->modelCommands());

                    // Blocking hero
                    QCheckBox *check = m_checkBoxes.at(i);
                    check->setProperty("reaction", QVariant::fromValue(
                        reinterpret_cast<quintptr>(reaction)));
                    check->setChecked(reaction->blockingHero());
                }
            }

            // Update options state
            updateStateOptions(super);

            showStateWidgets(true);
        }
        else
            showStateWidgets(false);
    }

    on_eventChanged(eventIndex, eventIndex);
}

// -------------------------------------------------------

void PanelObject::on_eventChanged(QModelIndex index, QModelIndex) {
    QStandardItem *selected = ui->treeViewEvents->getModel()->itemFromIndex(index);
    ui->tabWidgetCommands->setCurrentIndex(selected->row());
}

// -------------------------------------------------------

void PanelObject::on_tabWidgetCommands_currentChanged(int index) {
    if (index != -1) {
        QModelIndex modelIndex = ui->treeViewEvents->getModel()->index(index,0);
        ui->treeViewEvents->setCurrentIndex(modelIndex);
    }
}

// -------------------------------------------------------

void PanelObject::on_blockingHeroChanged(bool c) {
    QCheckBox *checkbox = reinterpret_cast<QCheckBox *>(sender());
    SystemReaction* reaction = reinterpret_cast<SystemReaction *>(checkbox
        ->property("reaction").value<quintptr>());
    reaction->setBlockingHero(c);
}

// -------------------------------------------------------

void PanelObject::on_checkBoxMoveAnimation_toggled(bool checked) {
    getSelectedState()->setMoveAnimation(checked);
}

// -------------------------------------------------------

void PanelObject::on_checkBoxStopAnimation_toggled(bool checked) {
    getSelectedState()->setStopAnimation(checked);
}

// -------------------------------------------------------

void PanelObject::on_checkBoxDirectionFix_toggled(bool checked) {
    getSelectedState()->setDirectionFix(checked);
}

// -------------------------------------------------------

void PanelObject::on_checkBoxThrough_toggled(bool checked) {
    getSelectedState()->setThrough(checked);
}

// -------------------------------------------------------

void PanelObject::on_checkBoxSetWithCamera_toggled(bool checked) {
    getSelectedState()->setSetWithCamera(checked);
}

// -------------------------------------------------------

void PanelObject::on_checkBoxPixelOffset_toggled(bool checked) {
    getSelectedState()->setPixelOffset(checked);
}

// -------------------------------------------------------

void PanelObject::on_comboBoxGraphics_currentIndexChanged(int index) {
    QStandardItem *selected = ui->treeViewStates->getSelected();

    if (selected != nullptr) {
        SystemState *super = reinterpret_cast<SystemState *>(selected->data()
            .value<quintptr>());
        if (super != nullptr) {
            MapEditorSubSelectionKind kind = MapEditorSubSelectionKind::None;
            switch (index) {
            case 0:
                kind = MapEditorSubSelectionKind::None; break;
            case 1:
                kind = MapEditorSubSelectionKind::SpritesFix; break;
            case 2:
                kind = MapEditorSubSelectionKind::SpritesFace; break;
            }
            super->setGraphicsKind(kind);
            ui->frameGraphics->repaint();
        }
    }
}

// -------------------------------------------------------

void PanelObject::on_copyReaction() {
    QPushButton *pushButton = reinterpret_cast<QPushButton *>(sender());
    SystemReaction *reaction = reinterpret_cast<SystemReaction *>(pushButton
        ->property("reaction").value<quintptr>());

    if (m_copiedReaction == nullptr) {
        m_copiedReaction = reinterpret_cast<SystemReaction *>(reaction->createCopy());

        // Update paste button
        for (int i = 0; i < m_pushButtons.size(); i++)
            m_pushButtons.at(i)->setEnabled(true);
    }
    else
        m_copiedReaction->setCopy(*reaction);
}

// -------------------------------------------------------

void PanelObject::on_pasteReaction() {
    QPushButton *pushButton = reinterpret_cast<QPushButton*>(sender());
    SystemReaction *reaction = reinterpret_cast<SystemReaction *>(pushButton
        ->property("reaction").value<quintptr>());

    SystemReaction::copyCommands(m_copiedReaction->modelCommands(), reaction
        ->modelCommands());
}
