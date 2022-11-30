/*
    RPG Paper Maker Copyright (C) 2017-2022 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include "panelobject.h"
#include "ui_panelobject.h"
#include "systemobjectevent.h"
#include "systemevent.h"
#include "systemproperty.h"
#include "systemstate.h"
#include "systemcommonreaction.h"
#include "rpm.h"
#include "common.h"
#include "objectmovingkind.h"
#include "dialogcommandmoveobject.h"
#include "dialogcommandsendevent.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

PanelObject::PanelObject(QWidget *parent) :
    QWidget(parent),
    ui(new Ui::PanelObject),
    m_model(nullptr),
    m_copiedReaction(nullptr),
    m_dialog(nullptr)
{
    ui->setupUi(this);

    // Updating infos lists
    ui->treeViewProperties->initializeNewItemInstance(new SystemProperty);
    ui->treeViewProperties->setUpdateId(true);
    ui->treeViewEvents->initializeNewItemInstance(new SystemObjectEvent);
    ui->treeViewStates->initializeNewItemInstance(new SystemState);
    ui->treeViewStates->setUpdateId(true);

    // Moving
    SuperListItem::fillComboBox(ui->comboBoxSpeed, RPM::get()->project()
        ->gameDatas()->systemDatas()->modelSpeed(), false);
    SuperListItem::fillComboBox(ui->comboBoxFreq, RPM::get()->project()
        ->gameDatas()->systemDatas()->modelFrequencies(), false);

    // Keep space when hiding widgets
    QSizePolicy sp_retain;
    QList<QWidget *> widgetList = QList<QWidget*>({ui->tabWidgetCommands,
        ui->groupBoxMoving, ui->groupBoxOptions, ui->panelGraphics});
    for (int i = 0; i < widgetList.size(); i++) {
        sp_retain = widgetList[i]->sizePolicy();
        sp_retain.setRetainSizeWhenHidden(true);
        widgetList[i]->setSizePolicy(sp_retain);
    }

    // Detection button word wrap
    m_labelDetection = new QLabel("", ui->pushButtonDetection);
    m_layoutDetection = new QHBoxLayout(ui->pushButtonDetection);
    m_layoutDetection->setContentsMargins(9, 0, 9, 0);
    m_layoutDetection->addWidget(m_labelDetection, 0, Qt::AlignCenter);

    // Comboboxes
    ui->comboBoxMovingType->addItems(RPM::ENUM_TO_STRING_OBJECT_MOVING_KIND);

    this->translate();
}

PanelObject::~PanelObject()
{
    if (m_copiedReaction != nullptr)
        delete m_copiedReaction;

    delete ui;
    delete m_labelDetection;
    delete m_layoutDetection;
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void PanelObject::initializeList(QStandardItemModel *list) {
    m_list = list;
}

// -------------------------------------------------------

void PanelObject::updateList() {
    ui->comboBoxInheritance->clear();
    ui->comboBoxInheritance->addItem(RPM::translate(Translations::NONE));
    SuperListItem::fillComboBox(ui->comboBoxInheritance, m_list);
}

// -------------------------------------------------------

void PanelObject::initializeModel(SystemCommonObject *object) {
    m_model = object;
    RPM::get()->project()->setCurrentObject(object);
}

// -------------------------------------------------------

void PanelObject::initializeDialog(QDialog *dialog)
{
    m_dialog = dialog;
}

// -------------------------------------------------------

void PanelObject::updateModel() {
    if (m_model != nullptr) {
        clear();

        QModelIndex index;
        ui->lineEditName->setText(m_model->name());
        ui->labelID->setText(Common::getFormatNumber(m_model->id()));
        ui->checkBoxOneEventPerFrame->setChecked(m_model->onlyOneEventPerFrame());
        ui->checkBoxCanBeTriggeredAnotherObject->setChecked(m_model->canBeTriggeredAnotherObject());
        initializeCommonInheritance();

        // Properties
        ui->treeViewProperties->initializeModel(m_model->modelProperties());
        connect(ui->treeViewProperties, SIGNAL(needsUpdateJson(SuperListItem *)),
            this, SLOT(on_updateJsonProperties(SuperListItem *)));
        index = ui->treeViewProperties->getModel()->index(0,0);
        ui->treeViewProperties->setCurrentIndex(index);

        // Events
        ui->treeViewEvents->initializeModel(m_model->modelEvents());
        connect(ui->treeViewEvents->selectionModel(), SIGNAL(currentChanged(
            QModelIndex, QModelIndex)), this, SLOT(on_eventChanged(QModelIndex,
            QModelIndex)));
        connect(ui->treeViewEvents, SIGNAL(modelUpdated()),
            this, SLOT(on_updateJsonEvents()));
        index = ui->treeViewEvents->getModel()->index(0,0);
        ui->treeViewEvents->setCurrentIndex(index);

        // States
        ui->treeViewStates->initializeModel(m_model->modelStates());
        connect(ui->treeViewStates->selectionModel(), SIGNAL(currentChanged(
            QModelIndex,QModelIndex)), this, SLOT(on_stateChanged(QModelIndex,
            QModelIndex)));
        connect(ui->treeViewStates, SIGNAL(pastingItem(SuperListItem *,
            SuperListItem *, int)), this, SLOT(on_statePastingItem(SuperListItem
            *, SuperListItem *, int)));
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
    this->updateList();

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
    if (id != -1) {
        index = SuperListItem::getIndexById(m_list->invisibleRootItem(), id) + 1;
    }

    ui->comboBoxInheritance->setCurrentIndex(index);
}

// -------------------------------------------------------

void PanelObject::showStateWidgets(bool b) {
    ui->tabWidgetCommands->setVisible(b);
    ui->groupBoxMoving->setVisible(b);
    ui->groupBoxOptions->setVisible(b);
    ui->panelGraphics->setVisible(b);
    ui->checkBoxDetection->setVisible(b);
    ui->pushButtonDetection->setVisible(b);
}

// -------------------------------------------------------

void PanelObject::showName(bool b)
{
    ui->labelName->setVisible(b);
    ui->lineEditName->setVisible(b);
}

// -------------------------------------------------------

void PanelObject::showID(bool b)
{
    ui->labelID->setVisible(b);
    ui->label->setVisible(b);
}

// -------------------------------------------------------

void PanelObject::showInvisible(bool b) {
    this->showName(!b);
    this->showID(!b);
    ui->groupBoxOptions->setEnabled(!b);
    ui->groupBoxMoving->setEnabled(!b);
    ui->panelGraphics->setEnabled(!b);
    ui->checkBoxDetection->setEnabled(!b);
    ui->pushButtonDetection->setEnabled(!b);
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
    WidgetTreeCommands *tree;
    SystemObjectEvent *event;
    QCheckBox *checkbox;
    QVariant variant;
    int l, index;

    // Update reactions (if new/delete)
    updateReactions();
    QStandardItem *selected = ui->treeViewStates->getSelected();
    SystemState *super = reinterpret_cast<SystemState *>(selected->data()
        .value<quintptr>());

    if (super != nullptr) {
        index = ui->tabWidgetCommands->currentIndex();
        clear();

        // Create all the corresponding tabs for all events
        l = ui->treeViewEvents->getModel()->invisibleRootItem()->rowCount();
        for (int i = 0; i < l - 1; i++){
            event = reinterpret_cast<SystemObjectEvent *>(ui->treeViewEvents
                ->getModel()->item(i)->data().value<quintptr>());
            widget = new QWidget();
            layout = new QGridLayout(widget);
            tree = new WidgetTreeCommands();
            tree->initializeDialog(m_dialog);
            m_reactions.append(tree);
            layout->addWidget(tree, 0, 0);

            // Checkboxes and buttons
            variant = QVariant::fromValue(reinterpret_cast<quintptr>(event
                ->reactionAt(super->id())));
            checkbox = new QCheckBox(RPM::translate(Translations
                ::BLOCK_HERO_WHEN_REACTION));
            checkbox->setProperty("reaction", variant);
            connect(checkbox, SIGNAL(toggled(bool)), this, SLOT(
                on_blockingHeroChanged(bool)));
            m_checkBoxes.append(checkbox);
            layout->addWidget(checkbox, 1, 0);
            ui->tabWidgetCommands->addTab(widget, event->getLabelTab());
        }

        ui->tabWidgetCommands->setCurrentIndex(index);
    }
}

// -------------------------------------------------------

SystemState* PanelObject::getSelectedState() const {
    return reinterpret_cast<SystemState *>(ui->treeViewStates->getSelected()
        ->data().value<qintptr>());
}

// -------------------------------------------------------

void PanelObject::updateStateMoving(SystemState *state) {
    ui->comboBoxMovingType->setCurrentIndex(static_cast<int>(state
        ->objectMovingKind()));
    ui->comboBoxSpeed->setCurrentIndex(SuperListItem::getIndexById(RPM::get()
        ->project()->gameDatas()->systemDatas()->modelSpeed()
        ->invisibleRootItem(), state->speedID()));
    ui->comboBoxFreq->setCurrentIndex(SuperListItem::getIndexById(RPM::get()
        ->project()->gameDatas()->systemDatas()->modelFrequencies()
        ->invisibleRootItem(), state->frequencyID()));
}

// -------------------------------------------------------

void PanelObject::updateStateOptions(SystemState *state) {
    ui->checkBoxMoveAnimation->setChecked(state->moveAnimation());
    ui->checkBoxStopAnimation->setChecked(state->stopAnimation());
    ui->checkBoxClimbAnimation->setChecked(state->climbAnimation());
    ui->checkBoxDirectionFix->setChecked(state->directionFix());
    ui->checkBoxThrough->setChecked(state->through());
    ui->checkBoxSetWithCamera->setChecked(state->setWithCamera());
    ui->checkBoxPixelOffset->setChecked(state->pixelOffset());
    ui->checkBoxKeepPosition->setChecked(state->keepPosition());
}

// -------------------------------------------------------

void PanelObject::updateStateDetection(SystemState *state) {
    ui->checkBoxDetection->setChecked(state->eventCommandDetection() != nullptr);
    this->on_checkBoxDetection_toggled(state->eventCommandDetection() != nullptr);
}

//-------------------------------------------------

void PanelObject::translate()
{
    ui->labelFreq->setText(RPM::translate(Translations::FREQ) + RPM::COLON);
    ui->labelName->setText(RPM::translate(Translations::NAME) + RPM::COLON);
    ui->labelType->setText(RPM::translate(Translations::TYPE) + RPM::COLON);
    ui->labelModel->setText(RPM::translate(Translations::MODEL) + RPM::COLON);
    ui->labelSpeed->setText(RPM::translate(Translations::SPEED) + RPM::COLON);
    ui->labelEvents->setText(RPM::translate(Translations::EVENTS) + RPM::COLON);
    ui->labelStates->setText(RPM::translate(Translations::STATES) + RPM::COLON);
    ui->panelGraphics->translate();
    ui->labelProperties->setText(RPM::translate(Translations::PROPERTIES) + RPM
        ::COLON);
    ui->groupBoxMoving->setTitle(RPM::translate(Translations::MOVING));
    ui->groupBoxOptions->setTitle(RPM::translate(Translations::OPTIONS));
    ui->checkBoxThrough->setText(RPM::translate(Translations::THROUGH));
    ui->checkBoxDetection->setText(RPM::translate(Translations::DETECTION) + RPM
        ::COLON);
    ui->checkBoxPixelOffset->setText(RPM::translate(Translations::PIXEL_OFFSET));
    ui->checkBoxDirectionFix->setText(RPM::translate(Translations::DIRECTION_FIX));
    ui->checkBoxKeepPosition->setText(RPM::translate(Translations::KEEP_POSITION));
    ui->checkBoxMoveAnimation->setText(RPM::translate(Translations
        ::MOVE_ANIMATION));
    ui->checkBoxSetWithCamera->setText(RPM::translate(Translations
        ::SET_WITH_CAMERA));
    ui->checkBoxStopAnimation->setText(RPM::translate(Translations
        ::STOP_ANIMATION));
    ui->checkBoxClimbAnimation->setText(RPM::translate(Translations
        ::CLIMB_ANIMATION));
    ui->checkBoxOneEventPerFrame->setText(RPM::translate(Translations
        ::ONLY_ONE_EVENT_PER_FRAME));
    ui->checkBoxCanBeTriggeredAnotherObject->setText(RPM::translate(Translations
        ::CAN_BE_TRIGGERED_ANOTHER_OBJECT));
    ui->pushButtonEditRoute->setText(RPM::translate(Translations::EDIT_ROUTE) +
        RPM::DOT_DOT_DOT);
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

void PanelObject::on_checkBoxOneEventPerFrame_toggled(bool checked) {
    m_model->setOnlyOneEventPerFrame(checked);
}

// -------------------------------------------------------

void PanelObject::on_checkBoxCanBeTriggeredAnotherObject_toggled(bool checked)
{
    m_model->setCanBeTriggeredAnotherObject(checked);
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

void PanelObject::on_updateJsonEvents() {
    updateReactionsWidgets();
    on_updateJsonStates(nullptr);
}

// -------------------------------------------------------

void PanelObject::on_updateJsonProperties(SuperListItem *) {
    ui->treeViewEvents->updateAbsoluteAllNodesString();
    this->updateReactionsWidgets();
    this->on_updateJsonStates(nullptr);
}

// -------------------------------------------------------

void PanelObject::on_stateChanged(QModelIndex index, QModelIndex) {
    QModelIndex eventIndex = ui->treeViewEvents->currentIndex();
    QStandardItem *selected = ui->treeViewStates->getModel()->itemFromIndex(index);
    if (selected != nullptr) {
        updateReactionsWidgets();

        SystemState *super = reinterpret_cast<SystemState *>(selected->data()
            .value<quintptr>());
        ui->panelGraphics->setState(super);
        if (super != nullptr) {

            // Graphics
            ui->panelGraphics->updateState(super);

            // Events
            for (int i = 0; i < m_reactions.size(); i++) {
                SystemObjectEvent *event = reinterpret_cast<SystemObjectEvent *>(
                    m_model->modelEvents()->item(i)->data().value<quintptr>());

                if (event != nullptr) {
                    SystemReaction *reaction = event->reactionAt(super->id());

                    // Commands
                    WidgetTreeCommands *widget = m_reactions.at(i);
                    widget->initializeDialog(m_dialog);
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
            this->updateStateMoving(super);
            this->updateStateOptions(super);
            this->updateStateDetection(super);

            showStateWidgets(true);
        }
        else
            showStateWidgets(false);
    }

    on_eventChanged(eventIndex, eventIndex);
}

// -------------------------------------------------------

void PanelObject::on_statePastingItem(SuperListItem *previous, SuperListItem
    *after, int)
{
    SuperListItem *state = SuperListItem::getById(RPM::get()->project()
        ->gameDatas()->commonEventsDatas()->modelStates()->invisibleRootItem(),
        after->id(), false);
    if (state == nullptr)
    {
        after->setId(-2);
    } else
    {
        // Update copied state name according to ID
        after->setName(state->name());

        // Copy the reactions associated to the current object events
        SystemObjectEvent *event;
        SystemReaction *reaction;
        for (int i = 0, l = m_model->modelEvents()->invisibleRootItem()
             ->rowCount(); i < l; i++)
        {
            event = reinterpret_cast<SystemObjectEvent *>(SuperListItem
                ::getItemModelAt(m_model->modelEvents(), i));
            if (event != nullptr)
            {
                reaction = reinterpret_cast<SystemReaction *>(event->reactionAt(
                    previous->id())->createCopy());
                reaction->setId(after->id());
                event->addReaction(after->id(), reaction);
            }
        }
    }
}

// -------------------------------------------------------

void PanelObject::on_eventChanged(QModelIndex index, QModelIndex) {
    QStandardItem *selected = ui->treeViewEvents->getModel()->itemFromIndex(index);
    if (selected != nullptr) {
        SystemObjectEvent *event;

        event = reinterpret_cast<SystemObjectEvent *>(selected->data().value<
            quintptr>());
        if (event == nullptr) {
            RPM::get()->project()->setCurrentParameters(nullptr);
        } else {
            RPM::get()->project()->setCurrentParameters(event->modelParameters());
        }
        ui->tabWidgetCommands->setCurrentIndex(selected->row());
    } else {
        RPM::get()->project()->setCurrentParameters(nullptr);
        ui->tabWidgetCommands->setCurrentIndex(-1);
    }
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

void PanelObject::on_comboBoxMovingType_currentIndexChanged(int index) {
    if (m_model == nullptr) {
        return;
    }
    QStandardItem *selected;
    bool isRoute;

    isRoute = index == static_cast<int>(ObjectMovingKind::Route);
    ui->pushButtonEditRoute->setEnabled(isRoute);
    selected = ui->treeViewStates->getSelected();
    if (selected != nullptr) {
        SystemState *state;

        state = reinterpret_cast<SystemState *>(selected->data().value<quintptr>());
        state->setObjectMovingKind(static_cast<ObjectMovingKind>(index));
        if (!isRoute) {
            state->removeRoute();
        }
    }
}

// -------------------------------------------------------

void PanelObject::on_comboBoxSpeed_currentIndexChanged(int index) {
    if (ui->treeViewStates->getModel() == nullptr) {
        return;
    }
    reinterpret_cast<SystemState *>(ui->treeViewStates->getSelected()->data()
        .value<quintptr>())->setSpeedID(SuperListItem::getIdByIndex(RPM::get()
        ->project()->gameDatas()->systemDatas()->modelSpeed(), index));
}

// -------------------------------------------------------

void PanelObject::on_comboBoxFreq_currentIndexChanged(int index) {
    if (ui->treeViewStates->getModel() == nullptr) {
        return;
    }
    reinterpret_cast<SystemState *>(ui->treeViewStates->getSelected()->data()
        .value<quintptr>())->setFrequencyID(SuperListItem::getIdByIndex(RPM
        ::get()->project()->gameDatas()->systemDatas()->modelFrequencies(),
        index));
}

// -------------------------------------------------------

void PanelObject::on_pushButtonEditRoute_clicked() {
    QStandardItem *selected;

    selected = ui->treeViewStates->getSelected();
    if (selected != nullptr) {
        SystemState *state;

        state = reinterpret_cast<SystemState *>(selected->data().value<quintptr>());
        DialogCommandMoveObject dialog(state->eventCommandRoute(), nullptr,
            nullptr, nullptr, true, m_dialog);
        if (dialog.exec() == QDialog::Accepted) {
            state->removeRoute();
            state->setEventCommandRoute(dialog.getCommand());
        }
    }
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

void PanelObject::on_checkBoxClimbAnimation_toggled(bool checked) {
    getSelectedState()->setClimbAnimation(checked);
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

void PanelObject::on_checkBoxKeepPosition_toggled(bool checked)
{
    getSelectedState()->setKeepPosition(checked);
}

// -------------------------------------------------------

void PanelObject::on_checkBoxDetection_toggled(bool checked) {
    QStandardItem *selected;

    ui->pushButtonDetection->setEnabled(checked);
    selected = ui->treeViewStates->getSelected();
    if (selected != nullptr) {
        SystemState *state;

        state = reinterpret_cast<SystemState *>(selected->data().value<quintptr>());
        if (state != nullptr) {
            m_labelDetection->setText(checked && state->eventCommandDetection()
                != nullptr ? state->eventCommandDetection()->toString() : "...");
        }
    }
}

// -------------------------------------------------------

void PanelObject::on_checkBoxDetection_clicked() {
    if (ui->checkBoxDetection->isChecked()) {
        this->on_pushButtonDetection_clicked();
    } else {
        QStandardItem *selected;

        selected = ui->treeViewStates->getSelected();
        if (selected != nullptr) {
            SystemState *state;

            state = reinterpret_cast<SystemState *>(selected->data().value<
                quintptr>());
            state->removeDetection();
            state->setEventCommandDetection(nullptr);
        }
    }
}

// -------------------------------------------------------

void PanelObject::on_pushButtonDetection_clicked() {
    QStandardItem *selected;

    selected = ui->treeViewStates->getSelected();
    if (selected != nullptr) {
        SystemState *state;
        EventCommand *command;

        state = reinterpret_cast<SystemState *>(selected->data().value<quintptr>());
        command = state->eventCommandDetection();
        DialogCommandSendEvent dialog(command, nullptr, nullptr, m_dialog);
        if (dialog.exec() == QDialog::Accepted) {
            state->removeDetection();
            command = dialog.getCommand();
            state->setEventCommandDetection(command);
            m_labelDetection->setText(command->toString());
        } else {
            if (command == nullptr) {
                ui->checkBoxDetection->setChecked(false);
            }
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

// -------------------------------------------------------

void PanelObject::on_treeViewStates_idChanged(int previousID, int newID)
{
    QStandardItemModel *model;
    SystemObjectEvent *event;
    SystemReaction *reaction;
    int i, l;

    model = ui->treeViewEvents->getModel();
    for (i = 0, l = model->invisibleRootItem()->rowCount(); i < l; i++)
    {
        event = reinterpret_cast<SystemObjectEvent *>(model->item(i)->data()
            .value<quintptr>());
        if (event != nullptr)
        {
            reaction = event->removeReaction(previousID, false);
            if (reaction != nullptr)
            {
                event->addReaction(newID, reaction);
            }
        }
    }
}
