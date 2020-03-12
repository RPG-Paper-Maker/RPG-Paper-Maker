/*
    RPG Paper Maker Copyright (C) 2017-2019 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include "panelobjectevent.h"
#include "ui_panelobjectevent.h"
#include "rpm.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

PanelObjectEvent::PanelObjectEvent(QWidget *parent) :
    QWidget(parent),
    ui(new Ui::PanelObjectEvent),
    m_event(nullptr)
{
    ui->setupUi(this);

    ui->treeViewParameters->setHasContextMenu(false);
    ui->treeViewParameters->setCanMove(false);

    // Initilize comboBoxes
    SuperListItem::fillComboBox(ui->comboBoxEventsSystem, RPM::get()
        ->project()->gameDatas()->commonEventsDatas()->modelEventsSystem());
    SuperListItem::fillComboBox(ui->comboBoxEventsUser, RPM::get()->project()
        ->gameDatas()->commonEventsDatas()->modelEventsUser());

    this->translate();
}

PanelObjectEvent::~PanelObjectEvent()
{
    delete ui;
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void PanelObjectEvent::initialize(SystemObjectEvent *event) {
    m_event = event;

    ui->comboBoxEventsSystem->setCurrentIndex(-1);
    ui->comboBoxEventsUser->setCurrentIndex(-1);
    connect(ui->comboBoxEventsSystem, SIGNAL(currentIndexChanged(int)), this,
        SLOT(on_comboBoxEventsSystemCurrentIndexChanged(int)));
    connect(ui->comboBoxEventsUser, SIGNAL(currentIndexChanged(int)), this,
        SLOT(on_comboBoxEventsUserCurrentIndexChanged(int)));

    QStandardItem *item;
    if (m_event->isSystem()){
        item = RPM::get()->project()->gameDatas()->commonEventsDatas()
            ->modelEventsSystem()->invisibleRootItem();
        ui->comboBoxEventsSystem->setCurrentIndex(SuperListItem::getIndexById(
            item, m_event->id()));
        ui->comboBoxEventsUser->setCurrentIndex(0);
        ui->radioButtonEventSystem->setChecked(true);
    }
    else{
        item = RPM::get()->project()->gameDatas()->commonEventsDatas()
            ->modelEventsUser()->invisibleRootItem();
        ui->comboBoxEventsUser->setCurrentIndex(SuperListItem::getIndexById(
            item, m_event->id()));
        ui->comboBoxEventsSystem->setCurrentIndex(0);
        ui->radioButtonEventUser->setChecked(true);
    }

    ui->treeViewParameters->initializeModel(m_event->modelParameters());
    ui->treeViewParameters->setColumnWidth(0,100);
    ui->treeViewParameters->setColumnWidth(1,250);
    ui->treeViewParameters->setColumnWidth(2,100);
    ui->treeViewParameters->updateAbsoluteAllNodesString();
}

// -------------------------------------------------------

void PanelObjectEvent::updateEvent(SystemEvent *ev) {
    if (m_event->id() != ev->id())
        m_event->clearParameters();

    m_event->setId(ev->id());
    m_event->setName(ev->name());
}

// -------------------------------------------------------

void PanelObjectEvent::updateParameters(SystemEvent *) {
    m_event->updateParameters();
    ui->treeViewParameters->initializeModel(m_event->modelParameters());
}

// -------------------------------------------------------

SystemObjectEvent * PanelObjectEvent::initializeCommand(const EventCommand
    *command, int &i)
{
    m_event = SystemObjectEvent::getCommandEvent(command, i);
    initialize(m_event);

    return m_event;
}

// -------------------------------------------------------

void PanelObjectEvent::getCommandObjectEvent(QVector<QString> &command) const {

    // Event
    QStandardItemModel *model = nullptr;
    SystemEvent *event = nullptr;
    if (ui->radioButtonEventSystem->isChecked()) {
        command.append("0");
        model = RPM::get()->project()->gameDatas()->commonEventsDatas()
            ->modelEventsSystem();
        event = reinterpret_cast<SystemEvent *>(model->item(ui
            ->comboBoxEventsSystem->currentIndex())->data().value<quintptr>());
    } else if (ui->radioButtonEventUser->isChecked()){
        command.append("1");
        model = RPM::get()->project()->gameDatas()->commonEventsDatas()
            ->modelEventsUser();
        event = reinterpret_cast<SystemEvent *>(model->item(ui
            ->comboBoxEventsUser->currentIndex())->data().value<quintptr>());
    }
    command.append(QString::number(event->id()));

    // Parameters
    QStandardItemModel *modelParameters = ui->treeViewParameters->getModel();
    SystemParameter *param;
    for (int i = 0; i < modelParameters->invisibleRootItem()->rowCount(); i++) {
        param = reinterpret_cast<SystemParameter *>(modelParameters->item(i)
            ->data().value<quintptr>());
        command.append(QString::number(param->id()));
        param->value()->getCommandParameter(command);
    }
}

//-------------------------------------------------

void PanelObjectEvent::translate()
{
    ui->radioButtonEventUser->setText(RPM::translate(Translations::EVENT_USER) +
        RPM::COLON);
    ui->radioButtonEventSystem->setText(RPM::translate(Translations
        ::EVENT_SYSTEM) + RPM::COLON);
    ui->groupBoxParameterValues->setTitle(RPM::translate(Translations
        ::PARAMETER_VALUES));
}

// -------------------------------------------------------
//
//  SLOTS
//
// -------------------------------------------------------

void PanelObjectEvent::on_comboBoxEventsSystemCurrentIndexChanged(int index) {
    QStandardItemModel *model = RPM::get()->project()->gameDatas()
        ->commonEventsDatas()->modelEventsSystem();
    SystemEvent *super = reinterpret_cast<SystemEvent *>(model->item(index)
        ->data().value<quintptr>());
    if (m_event->isSystem()) {
        updateEvent(super);
        updateParameters(super);
    }
}

// -------------------------------------------------------

void PanelObjectEvent::on_comboBoxEventsUserCurrentIndexChanged(int index) {
    QStandardItemModel *model = RPM::get()->project()->gameDatas()
        ->commonEventsDatas()->modelEventsUser();
    SystemEvent *super = reinterpret_cast<SystemEvent *>(model->item(index)
        ->data().value<quintptr>());
    if (!m_event->isSystem()) {
        updateEvent(super);
        updateParameters(super);
    }
}

// -------------------------------------------------------

void PanelObjectEvent::on_radioButtonEventSystem_toggled(bool checked) {
    ui->comboBoxEventsSystem->setEnabled(checked);

    if (checked) {
        m_event->setIsSystem(true);
        QStandardItemModel *model = RPM::get()->project()->gameDatas()
            ->commonEventsDatas()->modelEventsSystem();
        SystemEvent *super = reinterpret_cast<SystemEvent *>(model->item(ui
            ->comboBoxEventsSystem->currentIndex())->data().value<quintptr>());
        updateEvent(super);
        updateParameters(super);
    }
}

// -------------------------------------------------------

void PanelObjectEvent::on_radioButtonEventUser_toggled(bool checked) {
    ui->comboBoxEventsUser->setEnabled(checked);

    if (checked) {
        m_event->setIsSystem(false);
        QStandardItemModel *model = RPM::get()->project()->gameDatas()
            ->commonEventsDatas()->modelEventsUser();
        SystemEvent *super = reinterpret_cast<SystemEvent *>(model->item(ui
            ->comboBoxEventsUser->currentIndex())->data().value<quintptr>());
        updateEvent(super);
        updateParameters(super);
    }
}
