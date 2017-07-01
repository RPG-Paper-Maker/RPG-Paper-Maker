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

#include "panelobjectevent.h"
#include "ui_panelobjectevent.h"
#include "wanok.h"

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
    SuperListItem::fillComboBox(ui->comboBoxEventsSystem,
                                Wanok::get()->project()->gameDatas()
                                ->commonEventsDatas()->modelEventsSystem());
    SuperListItem::fillComboBox(ui->comboBoxEventsUser,
                                Wanok::get()->project()->gameDatas()
                                ->commonEventsDatas()->modelEventsUser());
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

void PanelObjectEvent::initialize(SystemObjectEvent* event){
    m_event = event;

    ui->comboBoxEventsSystem->setCurrentIndex(-1);
    ui->comboBoxEventsUser->setCurrentIndex(-1);
    connect(ui->comboBoxEventsSystem, SIGNAL(currentIndexChanged(int)), this,
            SLOT(on_comboBoxEventsSystemCurrentIndexChanged(int)));
    connect(ui->comboBoxEventsUser, SIGNAL(currentIndexChanged(int)), this,
            SLOT(on_comboBoxEventsUserCurrentIndexChanged(int)));

    QStandardItem* item;
    if (m_event->isSystem()){
        item = Wanok::get()->project()->gameDatas()->commonEventsDatas()
               ->modelEventsSystem()->invisibleRootItem();
        ui->comboBoxEventsSystem->setCurrentIndex(
                    SuperListItem::getIndexById(item, m_event->id()));
        ui->comboBoxEventsUser->setCurrentIndex(0);
        ui->radioButtonEventSystem->setChecked(true);
    }
    else{
        item = Wanok::get()->project()->gameDatas()->commonEventsDatas()
               ->modelEventsUser()->invisibleRootItem();
        ui->comboBoxEventsUser->setCurrentIndex(
                    SuperListItem::getIndexById(item, m_event->id()));
        ui->comboBoxEventsSystem->setCurrentIndex(0);
        ui->radioButtonEventUser->setChecked(true);
    }

    ui->treeViewParameters->initializeModel(m_event->modelParameters());
    ui->treeViewParameters->setColumnWidth(0,100);
    ui->treeViewParameters->setColumnWidth(1,250);
    ui->treeViewParameters->setColumnWidth(2,100);
}

// -------------------------------------------------------

void PanelObjectEvent::updateEvent(SystemEvent* ev){
    if (m_event->id() != ev->id())
        m_event->clearParameters();

    m_event->setId(ev->id());
    m_event->setName(ev->name());
}

// -------------------------------------------------------

void PanelObjectEvent::updateParameters(SystemEvent*){
    m_event->updateParameters();
    ui->treeViewParameters->initializeModel(m_event->modelParameters());
}

// -------------------------------------------------------

SystemObjectEvent *PanelObjectEvent::initializeCommand(const EventCommand*
                                                       command, int& i)
{
    m_event = SystemObjectEvent::getCommandEvent(command, i);
    initialize(m_event);

    return m_event;
}

// -------------------------------------------------------

void PanelObjectEvent::getCommandObjectEvent(QVector<QString>& command) const{

    // Event
    QStandardItemModel* model;
    SystemEvent* event;
    if (ui->radioButtonEventSystem->isChecked()){
        command.append("0");
        model = Wanok::get()->project()->gameDatas()->commonEventsDatas()
                ->modelEventsSystem();
        event = (SystemEvent*) model->item(ui->comboBoxEventsSystem
                                           ->currentIndex())
                ->data().value<quintptr>();
    }
    else if (ui->radioButtonEventUser->isChecked()){
        command.append("1");
        model = Wanok::get()->project()->gameDatas()->commonEventsDatas()
                ->modelEventsUser();
        event = (SystemEvent*) model->item(ui->comboBoxEventsUser
                                           ->currentIndex())
                ->data().value<quintptr>();
    }
    command.append(QString::number(event->id()));

    // Parameters
    QStandardItemModel* modelParameters = ui->treeViewParameters->getModel();
    SystemParameter* param;
    for (int i = 0; i < modelParameters->invisibleRootItem()->rowCount(); i++){
        param = (SystemParameter*) modelParameters->item(i)
                ->data().value<quintptr>();
        command.append(QString::number(param->id()));
        param->value()->getCommandParameter(command);
    }
}

// -------------------------------------------------------
//
//  SLOTS
//
// -------------------------------------------------------

void PanelObjectEvent::on_comboBoxEventsSystemCurrentIndexChanged(int index){
    QStandardItemModel* model = Wanok::get()->project()->gameDatas()
                                ->commonEventsDatas()->modelEventsSystem();
    SystemEvent* super = (SystemEvent*) model->item(index)
                         ->data().value<quintptr>();
    if (m_event->isSystem()){
        updateEvent(super);
        updateParameters(super);
    }
}

// -------------------------------------------------------

void PanelObjectEvent::on_comboBoxEventsUserCurrentIndexChanged(int index){
    QStandardItemModel* model = Wanok::get()->project()->gameDatas()
                                ->commonEventsDatas()->modelEventsUser();
    SystemEvent* super = (SystemEvent*) model->item(index)
                         ->data().value<quintptr>();
    if (!m_event->isSystem()){
        updateEvent(super);
        updateParameters(super);
    }
}

// -------------------------------------------------------

void PanelObjectEvent::on_radioButtonEventSystem_toggled(bool checked){
    ui->comboBoxEventsSystem->setEnabled(checked);
    m_event->setIsSystem(true);
    QStandardItemModel* model = Wanok::get()->project()->gameDatas()
                                ->commonEventsDatas()->modelEventsSystem();
    SystemEvent* super = (SystemEvent*) model->item(ui->comboBoxEventsSystem
                                                    ->currentIndex())
                         ->data().value<quintptr>();
    updateEvent(super);
    updateParameters(super);
}

// -------------------------------------------------------

void PanelObjectEvent::on_radioButtonEventUser_toggled(bool checked){
    ui->comboBoxEventsUser->setEnabled(checked);
    m_event->setIsSystem(false);
    QStandardItemModel* model = Wanok::get()->project()->gameDatas()
                                ->commonEventsDatas()->modelEventsUser();
    SystemEvent* super = (SystemEvent*) model->item(ui->comboBoxEventsUser
                                                    ->currentIndex())
                         ->data().value<quintptr>();
    updateEvent(super);
    updateParameters(super);
}
