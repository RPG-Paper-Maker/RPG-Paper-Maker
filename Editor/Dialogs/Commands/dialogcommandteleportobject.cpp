/*
    RPG Paper Maker Copyright (C) 2017-2020 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include "dialogcommandteleportobject.h"
#include "ui_dialogcommandteleportobject.h"
#include "dialogselectposition.h"
#include "rpm.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

DialogCommandTeleportObject::DialogCommandTeleportObject(
        EventCommand* command,
        SystemCommonObject *object,
        QStandardItemModel *parameters,
        QWidget *parent) :
    DialogCommand(parent),
    ui(new Ui::DialogCommandTeleportObject),
    m_modelObjects(nullptr)
{
    ui->setupUi(this);
    

    if (object != nullptr){

    }
    if (RPM::isInConfig && !RPM::isInObjectConfig){
        m_modelObjects = new QStandardItemModel;
        Map::setModelObjects(m_modelObjects);
    }
    else{
        m_modelObjects = RPM::get()->project()->currentMap(true)->modelObjects();
    }

    ui->widgetObjectID->initializeDataBaseCommandId(m_modelObjects, parameters,
                                                    nullptr);
    ui->widgetObjectID->setNumberValue(0);
    ui->widgetIdMap->initializeNumber(parameters, nullptr);
    ui->widgetX->initializeNumber(parameters, nullptr);
    ui->widgetY->initializeNumber(parameters, nullptr);
    ui->widgetYplus->initializeNumber(parameters, nullptr);
    ui->widgetZ->initializeNumber(parameters, nullptr);
    ui->widgetObjectIDPosition->initializeDataBaseCommandId(m_modelObjects,
                                                            parameters,
                                                            nullptr);

    if (command != nullptr) initialize(command);

    this->translate();
}

DialogCommandTeleportObject::~DialogCommandTeleportObject()
{
    delete ui;

    if (RPM::isInConfig && !RPM::isInObjectConfig) {
        SuperListItem::deleteModel(m_modelObjects);
    }
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

//-------------------------------------------------

void DialogCommandTeleportObject::translate()
{
    this->setWindowTitle(RPM::translate(Translations::TELEPORT_OBJECT) + RPM
        ::DOT_DOT_DOT);
    ui->labelX->setText(RPM::translate(Translations::X) + RPM::COLON);
    ui->labelY->setText(RPM::translate(Translations::Y) + RPM::COLON);
    ui->labelZ->setText(RPM::translate(Translations::Z) + RPM::COLON);
    ui->labelIDMap->setText(RPM::translate(Translations::MAP_ID) + RPM::COLON);
    ui->labelYPlus->setText(RPM::translate(Translations::Y_PLUS) + RPM::COLON);
    ui->labelObjectID->setText(RPM::translate(Translations::OBJECT_ID) + RPM
        ::COLON);
    ui->groupBoxOptions->setTitle(RPM::translate(Translations::POSITION));
    ui->groupBoxPosition->setTitle(RPM::translate(Translations::POSITION));
    ui->radioButtonObject->setText(RPM::translate(Translations::OBJECT_ID) + RPM
        ::COLON);
    RPM::get()->translations()->translateButtonBox(ui->buttonBox);
}

void DialogCommandTeleportObject::initialize(EventCommand* command){
    int i = 0;

    // Object ID
    ui->widgetObjectID->initializeCommand(command, i);

    // Position
    switch (command->valueCommandAt(i++).toInt()){
    case 0:
        ui->radioButtonSelect->setChecked(true);
        ui->panelSelectPosition->initialize(command, i);
        break;
    case 1:
        ui->radioButtonNumber->setChecked(true);
        ui->widgetIdMap->initializeCommand(command, i);
        ui->widgetX->initializeCommand(command, i);
        ui->widgetY->initializeCommand(command, i);
        ui->widgetYplus->initializeCommand(command, i);
        ui->widgetZ->initializeCommand(command, i);
        break;
    case 2:
        ui->radioButtonObject->setChecked(true);
        ui->widgetObjectIDPosition->initializeCommand(command, i);
        break;
    }

    // Options
    ui->comboBoxDirection->setCurrentIndex(command->valueCommandAt(i++)
                                           .toInt());
    ui->comboBoxShadinBefore->setCurrentIndex(command->valueCommandAt(i++)
                                              .toInt());
    ui->comboBoxShadingAfter->setCurrentIndex(command->valueCommandAt(i++)
                                              .toInt());
}

// -------------------------------------------------------

EventCommand* DialogCommandTeleportObject::getCommand() const{
    QVector<QString> command;

    // Object ID
    ui->widgetObjectID->getCommand(command);

    // Position
    if (ui->radioButtonSelect->isChecked()){
        command.append("0");
        ui->panelSelectPosition->getCommand(command);
    }
    else if (ui->radioButtonNumber->isChecked()){
        command.append("1");
        ui->widgetIdMap->getCommand(command);
        ui->widgetX->getCommand(command);
        ui->widgetY->getCommand(command);
        ui->widgetYplus->getCommand(command);
        ui->widgetZ->getCommand(command);
    }
    else if (ui->radioButtonObject->isChecked()){
        command.append("2");
        ui->widgetObjectIDPosition->getCommand(command);
    }

    // Options
    command.append(QString::number(ui->comboBoxDirection->currentIndex()));
    command.append(QString::number(ui->comboBoxShadinBefore->currentIndex()));
    command.append(QString::number(ui->comboBoxShadingAfter->currentIndex()));

    return new EventCommand(EventCommandKind::TeleportObject, command);
}

//--------------------------------------------
//
//  SLOTS
//
//--------------------------------------------

void DialogCommandTeleportObject::on_radioButtonSelect_toggled(bool checked){
    ui->panelSelectPosition->setEnabled(checked);
}

//--------------------------------------------

void DialogCommandTeleportObject::on_radioButtonNumber_toggled(bool checked){
    ui->labelIDMap->setEnabled(checked);
    ui->labelX->setEnabled(checked);
    ui->labelY->setEnabled(checked);
    ui->labelYPlus->setEnabled(checked);
    ui->labelZ->setEnabled(checked);
    ui->widgetIdMap->setEnabled(checked);
    ui->widgetX->setEnabled(checked);
    ui->widgetY->setEnabled(checked);
    ui->widgetYplus->setEnabled(checked);
    ui->widgetZ->setEnabled(checked);
}

//--------------------------------------------

void DialogCommandTeleportObject::on_radioButtonObject_toggled(bool checked){
    ui->widgetObjectIDPosition->setEnabled(checked);
}





