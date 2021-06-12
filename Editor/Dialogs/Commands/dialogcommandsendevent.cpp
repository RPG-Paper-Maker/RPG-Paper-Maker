/*
    RPG Paper Maker Copyright (C) 2017-2021 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include "dialogcommandsendevent.h"
#include "ui_dialogcommandsendevent.h"
#include "rpm.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

DialogCommandSendEvent::DialogCommandSendEvent(EventCommand *command,
    QStandardItemModel *properties, QStandardItemModel *parameters, QWidget *parent) :
    DialogCommand(parent),
    ui(new Ui::DialogCommandSendEvent),
    m_properties(properties),
    m_parameters(parameters)
{
    ui->setupUi(this);

    bool test = command == nullptr;
    if (test) {
        QVector<QString> l({"1", QString::number(static_cast<int>(
            PrimitiveValueKind::DataBase)), "1", RPM::TRUE_BOOL_STRING, RPM
            ::FALSE_BOOL_STRING, "0", "1", "1", QString::number(static_cast<int>(
            PrimitiveValueKind::Default)), "2", QString::number(static_cast<int>(
            PrimitiveValueKind::Default))});
        command = new EventCommand(EventCommandKind::SendEvent, l);
    }

    ui->panelPrimitiveDetectionID->initializeDataBaseCommandId(RPM::get()
        ->project()->gameDatas()->systemDatas()->modelDetections(), parameters,
        properties);

    // Objects
    if (RPM::isInConfig && !RPM::isInObjectConfig) {
        m_modelObjects = new QStandardItemModel;
        Map::setModelObjects(m_modelObjects);
    } else {
        m_modelObjects = RPM::get()->project()->currentMap(true)->modelObjects();
    }
    ui->panelPrimitiveObjectID->initializeDataBaseCommandId(m_modelObjects,
        parameters, nullptr);

    initialize(command);

    if (test) {
        delete command;
    }

    this->translate();
}

DialogCommandSendEvent::~DialogCommandSendEvent()
{
    delete ui;
    delete m_event;

    if (RPM::isInConfig && !RPM::isInObjectConfig) {
        SuperListItem::deleteModel(m_modelObjects);
    }
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void DialogCommandSendEvent::translate()
{
    this->setWindowTitle(RPM::translate(Translations::SEND_EVENT) + RPM
        ::DOT_DOT_DOT);
    ui->checkBoxSenderNoReceive->setText(RPM::translate(Translations
        ::SENDER_CANT_RECEIVE));
    ui->checkBoxOnlyTheClosest->setText(RPM::translate(Translations::ONLY_THE_CLOSEST));
    ui->radioButtonAll->setText(RPM::translate(Translations::ALL));
    ui->radioButtonObject->setText(RPM::translate(Translations::OBJECT_ID) + RPM
        ::COLON);
    ui->radioButtonDetection->setText(RPM::translate(Translations::DETECTION_ID)
        + RPM::COLON);
    ui->groupBoxEvent->setTitle(RPM::translate(Translations::EVENT));
    ui->groupBoxTarget->setTitle(RPM::translate(Translations::TARGET));
    RPM::get()->translations()->translateButtonBox(ui->buttonBox);
}

//-------------------------------------------------

void DialogCommandSendEvent::initialize(EventCommand* command){
    int i = 0;

    int target = command->valueCommandAt(i++).toInt();
    switch(target){
    case 0:
        ui->radioButtonAll->setChecked(true);
        break;
    case 1:
        ui->radioButtonDetection->setChecked(true);
        ui->panelPrimitiveDetectionID->initializeCommand(command, i);
        ui->checkBoxSenderNoReceive->setChecked(command->valueCommandAt(i++) ==
            RPM::TRUE_BOOL_STRING);
        ui->checkBoxOnlyTheClosest->setChecked(command->valueCommandAt(i++) ==
            RPM::TRUE_BOOL_STRING);
        break;
    case 2:
        ui->radioButtonObject->setChecked(true);
        ui->panelPrimitiveObjectID->initializeCommand(command, i);
        break;
    }
    m_event = ui->widgetObjectEvent->initializeCommand(command, i);
}

// -------------------------------------------------------

EventCommand* DialogCommandSendEvent::getCommand() const{
    QVector<QString> command;
    chooseTarget(command);
    ui->widgetObjectEvent->getCommandObjectEvent(command);

    return new EventCommand(EventCommandKind::SendEvent, command);
}

// -------------------------------------------------------

void DialogCommandSendEvent::chooseTarget(QVector<QString> &command) const{
    if (ui->radioButtonAll->isChecked()){
        command.append("0");
    } else if(ui->radioButtonDetection->isChecked()){
        command.append("1");
        ui->panelPrimitiveDetectionID->getCommand(command);
        command.append(ui->checkBoxSenderNoReceive->isChecked() ? RPM
            ::TRUE_BOOL_STRING : RPM::FALSE_BOOL_STRING);
        command.append(ui->checkBoxOnlyTheClosest->isChecked() ? RPM
            ::TRUE_BOOL_STRING : RPM::FALSE_BOOL_STRING);
    } else if(ui->radioButtonObject->isChecked()) {
        command.append("2");
        ui->panelPrimitiveObjectID->getCommand(command);
    }
}

// -------------------------------------------------------
//
//  SLOTS
//
// -------------------------------------------------------

void DialogCommandSendEvent::on_radioButtonDetection_toggled(bool checked) {
    ui->panelPrimitiveDetectionID->setEnabled(checked);
    ui->checkBoxSenderNoReceive->setEnabled(checked);
    ui->checkBoxOnlyTheClosest->setEnabled(checked);
}

// -------------------------------------------------------

void DialogCommandSendEvent::on_radioButtonObject_toggled(bool checked) {
    ui->panelPrimitiveObjectID->setEnabled(checked);
}
