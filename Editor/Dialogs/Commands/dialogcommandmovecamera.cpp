/*
    RPG Paper Maker Copyright (C) 2017-2021 Wano

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
    QStandardItemModel *properties, QStandardItemModel *parameters, QWidget *parent) :
    DialogCommand(parent),
    ui(new Ui::DialogCommandMoveCamera),
    m_properties(properties),
    m_parameters(parameters),
    m_modelObjects(nullptr)
{
    ui->setupUi(this);

    if (RPM::isInConfig && !RPM::isInObjectConfig)
    {
        m_modelObjects = new QStandardItemModel;
        Map::setModelObjects(m_modelObjects);
    }
    else{
        m_modelObjects = RPM::get()->project()->currentMap(true)->modelObjects();
    }
    ui->widgetPrimitiveObjectID->initializeDataBaseCommandId(m_modelObjects,
                                                             m_parameters,
                                                             m_properties);
    ui->widgetNumberX->initializeNumber(parameters, m_properties);
    ui->widgetNumberY->initializeNumber(parameters, m_properties);
    ui->widgetNumberZ->initializeNumber(parameters, m_properties);
    ui->widgetNumberH->initializeNumber(parameters, m_properties, false);
    ui->widgetNumberV->initializeNumber(parameters, m_properties, false);
    ui->widgetNumberDistance->initializeNumber(parameters, m_properties);
    ui->widgetNumberTime->initializeNumber(parameters, m_properties, false);
    ui->comboBoxX->addItem(RPM::translate(Translations::SQUARE_S));
    ui->comboBoxX->addItem(RPM::translate(Translations::PIXEL_S));
    ui->comboBoxY->addItem(RPM::translate(Translations::SQUARE_S));
    ui->comboBoxY->addItem(RPM::translate(Translations::PIXEL_S));
    ui->comboBoxZ->addItem(RPM::translate(Translations::SQUARE_S));
    ui->comboBoxZ->addItem(RPM::translate(Translations::PIXEL_S));

    if (command != nullptr) initialize(command);

    this->translate();
}

DialogCommandMoveCamera::~DialogCommandMoveCamera()
{
    delete ui;

    if (RPM::isInConfig && !RPM::isInObjectConfig)
    {
        SuperListItem::deleteModel(m_modelObjects);
    }
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

//-------------------------------------------------

void DialogCommandMoveCamera::translate()
{
    this->setWindowTitle(RPM::translate(Translations::MOVE_CAMERA) + RPM
        ::DOT_DOT_DOT);
    ui->labelX->setText(RPM::translate(Translations::X) + RPM::COLON);
    ui->labelY->setText(RPM::translate(Translations::Y) + RPM::COLON);
    ui->labelZ->setText(RPM::translate(Translations::Z) + RPM::COLON);
    ui->labelTime->setText(RPM::translate(Translations::TIME) + RPM::COLON);
    ui->labelSeconds->setText(RPM::translate(Translations::SECONDS));
    ui->labelDistance->setText(RPM::translate(Translations::DISTANCE) + RPM
        ::COLON);
    ui->labelVertical->setText(RPM::translate(Translations::VERTICAL) + RPM
        ::COLON);
    ui->labelHorizontal->setText(RPM::translate(Translations::HORIZONTAL) + RPM
        ::COLON);
    ui->radioButtonTargetObjectID->setText(RPM::translate(Translations
        ::OBJECT_ID) + RPM::COLON);
    ui->radioButtonTargetUnchanged->setText(RPM::translate(Translations
        ::UNCHANGED));
    ui->checkBoxWaitEnd->setText(RPM::translate(Translations
        ::WAIT_END_MOVE_BEFORE_NEXT_COMMAND));
    ui->checkBoxtargetOffsetMove->setText(RPM::translate(Translations
        ::TARGET_OFFSET));
    ui->checkBoxCameraOrientation->setText(RPM::translate(Translations
        ::TAKE_ACCOUNT_CAMERA_ORIENTATION));
    ui->checkBoxtargetOffsetRotation->setText(RPM::translate(Translations
        ::TARGET_OFFSET));
    ui->groupBoxMove->setTitle(RPM::translate(Translations::MOVE));
    ui->groupBoxZoom->setTitle(RPM::translate(Translations::ZOOM));
    ui->groupBoxRotation->setTitle(RPM::translate(Translations::ROTATION));
    ui->groupBoxOperation->setTitle(RPM::translate(Translations::OPERATION));
    ui->groupBoxCameraTarget->setTitle(RPM::translate(Translations
        ::CAMERA_TARGET));
    ui->radioButtonPlus->setText(RPM::PARENTHESIS_LEFT + RPM::PLUS + RPM
        ::PARENTHESIS_RIGHT + RPM::translate(Translations::PLUS));
    ui->radioButtonMinus->setText(RPM::PARENTHESIS_LEFT + RPM::MINUS + RPM
        ::PARENTHESIS_RIGHT + RPM::translate(Translations::MINUS));
    ui->radioButtonTimes->setText(RPM::PARENTHESIS_LEFT + RPM::TIMES + RPM
        ::PARENTHESIS_RIGHT + RPM::translate(Translations::TIMES));
    ui->radioButtonEquals->setText(RPM::PARENTHESIS_LEFT + RPM::EQUAL + RPM
        ::PARENTHESIS_RIGHT + RPM::translate(Translations::EQUALS));
    ui->radioButtonModulo->setText(RPM::PARENTHESIS_LEFT + RPM::MODULO + RPM
        ::PARENTHESIS_RIGHT + RPM::translate(Translations::MODULO));
    ui->radioButtonDivided->setText(RPM::PARENTHESIS_LEFT + RPM::DIVIDED_BY +
        RPM::PARENTHESIS_RIGHT + RPM::translate(Translations::DIVIDED_BY));
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
