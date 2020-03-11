/*
    RPG Paper Maker Copyright (C) 2017-2019 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include "dialogcommandmovecamera.h"
#include "ui_dialogcommandmovecamera.h"
#include "rpm.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

DialogCommandMoveCamera::DialogCommandMoveCamera(EventCommand *command,
                                                 SystemCommonObject *,
                                                 QStandardItemModel *parameters,
                                                 QWidget *parent) :
    DialogCommand(parent),
    ui(new Ui::DialogCommandMoveCamera),
    m_modelObjects(nullptr)
{
    ui->setupUi(this);

    if (RPM::isInConfig){
        m_modelObjects = new QStandardItemModel;
        Map::setModelObjects(m_modelObjects);
    }
    else{
        m_modelObjects = RPM::get()->project()->currentMap()->modelObjects();
    }
    ui->widgetPrimitiveObjectID->initializeDataBaseCommandId(m_modelObjects,
                                                             parameters,
                                                             nullptr);
    ui->widgetNumberX->initializeNumber(parameters, nullptr);
    ui->widgetNumberY->initializeNumber(parameters, nullptr);
    ui->widgetNumberZ->initializeNumber(parameters, nullptr);
    ui->widgetNumberH->initializeNumber(parameters, nullptr, false);
    ui->widgetNumberV->initializeNumber(parameters, nullptr, false);
    ui->widgetNumberDistance->initializeNumber(parameters, nullptr);
    ui->widgetNumberTime->initializeNumber(parameters, nullptr, false);

    if (command != nullptr) initialize(command);

    this->translate();
}

DialogCommandMoveCamera::~DialogCommandMoveCamera()
{
    delete ui;

    if (RPM::isInConfig)
        SuperListItem::deleteModel(m_modelObjects);
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

//-------------------------------------------------

void DialogCommandMoveCamera::translate()
{
    this->setWindowTitle(RPM::translate(Translations::NEW_PROJECT));
    RPM::get()->translations()->translateButtonBox(ui->buttonBox);
}

void DialogCommandMoveCamera::initialize(EventCommand* command) {
    int i = 0;

    // Target
    int targetKind = command->valueCommandAt(i++).toInt();
    switch (targetKind) {
    case 0:
        ui->radioButtonTargetUnchanged->setChecked(true);
        break;
    case 1:
        ui->radioButtonTargetObjectID->setChecked(true);
        ui->widgetPrimitiveObjectID->initializeCommand(command, i);
        break;
    }

    // Operations
    switch (command->valueCommandAt(i++).toInt()) {
    case 0: ui->radioButtonEquals->setChecked(true); break;
    case 1: ui->radioButtonPlus->setChecked(true); break;
    case 2: ui->radioButtonMinus->setChecked(true); break;
    case 3: ui->radioButtonTimes->setChecked(true); break;
    case 4: ui->radioButtonDivided->setChecked(true); break;
    case 5: ui->radioButtonModulo->setChecked(true); break;
    }

    // Move
    ui->checkBoxtargetOffsetMove->setChecked(
                command->valueCommandAt(i++) == "1");
    ui->checkBoxCameraOrientation->setChecked(command->valueCommandAt(i++)
                                              == "1");
    ui->widgetNumberX->initializeCommand(command, i);
    ui->comboBoxX->setCurrentIndex(command->valueCommandAt(i++).toInt());
    ui->widgetNumberY->initializeCommand(command, i);
    ui->comboBoxY->setCurrentIndex(command->valueCommandAt(i++).toInt());
    ui->widgetNumberZ->initializeCommand(command, i);
    ui->comboBoxZ->setCurrentIndex(command->valueCommandAt(i++).toInt());

    // Rotation
    ui->checkBoxtargetOffsetRotation->setChecked(
                command->valueCommandAt(i++) == "1");
    ui->widgetNumberH->initializeCommand(command, i);
    ui->widgetNumberV->initializeCommand(command, i);

    // Zoom
    ui->widgetNumberDistance->initializeCommand(command, i);

    // Options
    ui->checkBoxWaitEnd->setChecked(command->valueCommandAt(i++) == "1");
    ui->widgetNumberTime->initializeCommand(command, i);
}

// -------------------------------------------------------

EventCommand* DialogCommandMoveCamera::getCommand() const {
    QVector<QString> command;

    // Target
    if (ui->radioButtonTargetUnchanged->isChecked())
        command.append("0");
    else if (ui->radioButtonTargetObjectID->isChecked()) {
        command.append("1");
        ui->widgetPrimitiveObjectID->getCommand(command);
    }

    // Operations
    if (ui->radioButtonEquals->isChecked()) command.append("0");
    else if (ui->radioButtonPlus->isChecked()) command.append("1");
    else if (ui->radioButtonMinus->isChecked()) command.append("2");
    else if (ui->radioButtonTimes->isChecked()) command.append("3");
    else if (ui->radioButtonDivided->isChecked()) command.append("4");
    else if (ui->radioButtonModulo->isChecked()) command.append("5");

    // Move
    command.append(ui->checkBoxtargetOffsetMove->isChecked() ? "1" : "0");
    command.append(ui->checkBoxCameraOrientation->isChecked() ? "1" : "0");
    ui->widgetNumberX->getCommand(command);
    command.append(QString::number(ui->comboBoxX->currentIndex()));
    ui->widgetNumberY->getCommand(command);
    command.append(QString::number(ui->comboBoxY->currentIndex()));
    ui->widgetNumberZ->getCommand(command);
    command.append(QString::number(ui->comboBoxZ->currentIndex()));

    // Rotation
    command.append(ui->checkBoxtargetOffsetRotation->isChecked() ? "1" : "0");
    ui->widgetNumberH->getCommand(command);
    ui->widgetNumberV->getCommand(command);

    // Zoom
    ui->widgetNumberDistance->getCommand(command);

    // Options
    command.append(ui->checkBoxWaitEnd->isChecked() ? "1" : "0");
    ui->widgetNumberTime->getCommand(command);

    return new EventCommand(EventCommandKind::MoveCamera, command);
}

// -------------------------------------------------------
//
//  SLOTS
//
// -------------------------------------------------------

void DialogCommandMoveCamera::on_radioButtonTargetObjectID_toggled(bool checked)
{
    ui->widgetPrimitiveObjectID->setEnabled(checked);
}
