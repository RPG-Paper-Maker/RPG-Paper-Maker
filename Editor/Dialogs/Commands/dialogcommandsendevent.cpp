/*
    RPG Paper Maker Copyright (C) 2017-2019 Wano

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
    SystemCommonObject *object, QStandardItemModel *parameters, QWidget *parent) :
    DialogCommand(parent),
    ui(new Ui::DialogCommandSendEvent)
{
    QStandardItemModel *properties;
    ui->setupUi(this);

    bool test = command == nullptr;
    if (test) {
        QVector<QString> l({"1", QString::number(static_cast<int>(
            PrimitiveValueKind::DataBase)), "1", RPM::TRUE_BOOL_STRING, "0", "1", "1",
                            QString::number((int) PrimitiveValueKind::Default),
                            "2",
                            QString::number((int) PrimitiveValueKind::Default)}
                           );
        command = new EventCommand(EventCommandKind::SendEvent, l);
    }

    properties = object == nullptr ? nullptr : object->modelProperties();
    ui->panelPrimitiveDetectionID->initializeDataBaseCommandId(RPM::get()
        ->project()->gameDatas()->systemDatas()->modelDetections(), parameters,
        properties);

    initialize(command);

    if (test) {
        delete command;
    }
}

DialogCommandSendEvent::~DialogCommandSendEvent()
{
    delete ui;
    delete m_event;
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

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
        break;
    case 2:
        ui->radioButtonObject->setChecked(true);
        command->valueCommandAt(i++).toInt();
        break;
    case 3:
        ui->radioButtonSender->setChecked(true);
        break;
    case 4:
        ui->radioButtonHero->setChecked(true);
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
    }
    else if(ui->radioButtonDetection->isChecked()){
        command.append("1");
        ui->panelPrimitiveDetectionID->getCommand(command);
        command.append(ui->checkBoxSenderNoReceive->isChecked() ? RPM
            ::TRUE_BOOL_STRING : RPM::FALSE_BOOL_STRING);
    }
    else if(ui->radioButtonObject->isChecked()){
        command.append("2");
        command.append("1");
        // TODO
    }
    else if(ui->radioButtonSender->isChecked()){
        command.append("3");
    }
    else if(ui->radioButtonHero->isChecked()){
        command.append("4");
    }
}
