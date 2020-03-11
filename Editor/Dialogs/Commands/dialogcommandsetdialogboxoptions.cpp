/*
    RPG Paper Maker Copyright (C) 2017-2019 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include "dialogcommandsetdialogboxoptions.h"
#include "ui_dialogcommandsetdialogboxoptions.h"
#include "rpm.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

DialogCommandSetDialogBoxOptions::DialogCommandSetDialogBoxOptions(EventCommand
    *command, SystemCommonObject *object, QStandardItemModel *parameters,
    QWidget *parent) :
    DialogCommand(parent),
    m_object(object),
    m_parameters(parameters),
    ui(new Ui::DialogCommandSetDialogBoxOptions)
{
    ui->setupUi(this);

    this->initializePrimitives();

    if (command != nullptr) {
        this->initialize(command);
    }

    this->translate();
}

DialogCommandSetDialogBoxOptions::~DialogCommandSetDialogBoxOptions() {
    delete ui;
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void DialogCommandSetDialogBoxOptions::initializePrimitives() {
    QStandardItemModel *properties;

    properties = nullptr;
    if (m_object != nullptr){
        properties = m_object->modelProperties();
    }

    ui->panelPrimitiveWindowSkinID->initializeDataBaseCommandId(RPM::get()
        ->project()->gameDatas()->systemDatas()->modelWindowSkins(),
        m_parameters, properties);
    ui->panelPrimitiveX->initializeNumber(m_parameters, properties, false);
    ui->panelPrimitiveY->initializeNumber(m_parameters, properties, false);
    ui->panelPrimitiveWidth->initializeNumber(m_parameters, properties, false);
    ui->panelPrimitiveHeight->initializeNumber(m_parameters, properties, false);
    ui->panelPrimitivePaddingLeft->initializeNumber(m_parameters, properties,
        false);
    ui->panelPrimitivePaddingTop->initializeNumber(m_parameters, properties,
        false);
    ui->panelPrimitivePaddingRight->initializeNumber(m_parameters, properties,
        false);
    ui->panelPrimitivePaddingBottom->initializeNumber(m_parameters, properties,
        false);
    ui->panelPrimitiveFacesetX->initializeNumber(m_parameters, properties,
        false);
    ui->panelPrimitiveFacesetY->initializeNumber(m_parameters, properties,
        false);
    ui->panelPrimitiveTextColorText->initializeDataBaseCommandId(RPM::get()
        ->project()->gameDatas()->systemDatas()->modelColors(), m_parameters,
        properties);
    ui->panelPrimitiveTextColorStroke->initializeDataBaseCommandId(RPM::get()
        ->project()->gameDatas()->systemDatas()->modelColors(), m_parameters,
        properties);
    ui->panelPrimitiveTextColorBackground->initializeDataBaseCommandId(RPM::get()
        ->project()->gameDatas()->systemDatas()->modelColors(), m_parameters,
        properties);
    ui->panelPrimitiveTextSize->initializeDataBaseCommandId(RPM::get()
        ->project()->gameDatas()->systemDatas()->modelFontSizes(), m_parameters,
        properties);
    ui->panelPrimitiveTextFont->initializeDataBaseCommandId(RPM::get()
        ->project()->gameDatas()->systemDatas()->modelFontNames(), m_parameters,
        properties);
    ui->comboBoxFacesetPosition->addItem(RPM::translate(Translations::BEHIND));
    ui->comboBoxFacesetPosition->addItem(RPM::translate(Translations::ABOVE));
    ui->comboBoxTextStroke->addItem(RPM::translate(Translations::YES));
    ui->comboBoxTextStroke->addItem(RPM::translate(Translations::NO));
}

//-------------------------------------------------

void DialogCommandSetDialogBoxOptions::translate()
{
    this->setWindowTitle(RPM::translate(Translations::NEW_PROJECT));
    RPM::get()->translations()->translateButtonBox(ui->buttonBox);
}

// -------------------------------------------------------

void DialogCommandSetDialogBoxOptions::initialize(EventCommand *command) {
    bool checked;
    int i;

    i = 0;
    checked = RPM::stringToBool(command->valueCommandAt(i++));
    if (checked) {
        ui->checkBoxWindowSkinID->setChecked(true);
        ui->panelPrimitiveWindowSkinID->initializeCommand(command, i);
    }
    checked = RPM::stringToBool(command->valueCommandAt(i++));
    if (checked) {
        ui->checkBoxX->setChecked(true);
        ui->panelPrimitiveX->initializeCommand(command, i);
    }
    checked = RPM::stringToBool(command->valueCommandAt(i++));
    if (checked) {
        ui->checkBoxY->setChecked(true);
        ui->panelPrimitiveY->initializeCommand(command, i);
    }
    checked = RPM::stringToBool(command->valueCommandAt(i++));
    if (checked) {
        ui->checkBoxWidth->setChecked(true);
        ui->panelPrimitiveWidth->initializeCommand(command, i);
    }
    checked = RPM::stringToBool(command->valueCommandAt(i++));
    if (checked) {
        ui->checkBoxHeight->setChecked(true);
        ui->panelPrimitiveHeight->initializeCommand(command, i);
    }
    checked = RPM::stringToBool(command->valueCommandAt(i++));
    if (checked) {
        ui->checkBoxPaddingLeft->setChecked(true);
        ui->panelPrimitivePaddingLeft->initializeCommand(command, i);
    }
    checked = RPM::stringToBool(command->valueCommandAt(i++));
    if (checked) {
        ui->checkBoxPaddingTop->setChecked(true);
        ui->panelPrimitivePaddingTop->initializeCommand(command, i);
    }
    checked = RPM::stringToBool(command->valueCommandAt(i++));
    if (checked) {
        ui->checkBoxPaddingRight->setChecked(true);
        ui->panelPrimitivePaddingRight->initializeCommand(command, i);
    }
    checked = RPM::stringToBool(command->valueCommandAt(i++));
    if (checked) {
        ui->checkBoxPaddingBottom->setChecked(true);
        ui->panelPrimitivePaddingBottom->initializeCommand(command, i);
    }
    checked = RPM::stringToBool(command->valueCommandAt(i++));
    if (checked) {
        ui->checkBoxFacesetPosition->setChecked(true);
        ui->comboBoxFacesetPosition->setCurrentIndex(command->valueCommandAt(i++
            ).toInt());
    }
    checked = RPM::stringToBool(command->valueCommandAt(i++));
    if (checked) {
        ui->checkBoxFacesetX->setChecked(true);
        ui->panelPrimitiveFacesetX->initializeCommand(command, i);
    }
    checked = RPM::stringToBool(command->valueCommandAt(i++));
    if (checked) {
        ui->checkBoxFacesetY->setChecked(true);
        ui->panelPrimitiveFacesetY->initializeCommand(command, i);
    }
    checked = RPM::stringToBool(command->valueCommandAt(i++));
    if (checked) {
        ui->checkBoxTextStroke->setChecked(true);
        ui->comboBoxTextStroke->setCurrentIndex(command->valueCommandAt(i++)
            .toInt());
    }
    checked = RPM::stringToBool(command->valueCommandAt(i++));
    if (checked) {
        ui->checkBoxTextColor->setChecked(true);
        ui->checkBoxTextColorText->setChecked(true);
        ui->panelPrimitiveTextColorText->initializeCommand(command, i);
    }
    checked = RPM::stringToBool(command->valueCommandAt(i++));
    if (checked) {
        ui->checkBoxTextColor->setChecked(true);
        ui->checkBoxTextColorStroke->setChecked(true);
        ui->panelPrimitiveTextColorStroke->initializeCommand(command, i);
    }
    checked = RPM::stringToBool(command->valueCommandAt(i++));
    if (checked) {
        ui->checkBoxTextColor->setChecked(true);
        ui->checkBoxTextColorBackground->setChecked(true);
        ui->panelPrimitiveTextColorBackground->initializeCommand(command, i);
    }
    checked = RPM::stringToBool(command->valueCommandAt(i++));
    if (checked) {
        ui->checkBoxTextSize->setChecked(true);
        ui->panelPrimitiveTextSize->initializeCommand(command, i);
    }
    checked = RPM::stringToBool(command->valueCommandAt(i++));
    if (checked) {
        ui->checkBoxTextFont->setChecked(true);
        ui->panelPrimitiveTextFont->initializeCommand(command, i);
    }
}

// -------------------------------------------------------

EventCommand * DialogCommandSetDialogBoxOptions::getCommand() const{
    QVector<QString> command;

    if (ui->checkBoxWindowSkinID->isChecked()) {
        command.append(RPM::TRUE_BOOL_STRING);
        ui->panelPrimitiveWindowSkinID->getCommand(command);
    } else {
        command.append(RPM::FALSE_BOOL_STRING);
    }
    if (ui->checkBoxX->isChecked()) {
        command.append(RPM::TRUE_BOOL_STRING);
        ui->panelPrimitiveX->getCommand(command);
    } else {
        command.append(RPM::FALSE_BOOL_STRING);
    }
    if (ui->checkBoxY->isChecked()) {
        command.append(RPM::TRUE_BOOL_STRING);
        ui->panelPrimitiveY->getCommand(command);
    } else {
        command.append(RPM::FALSE_BOOL_STRING);
    }
    if (ui->checkBoxWidth->isChecked()) {
        command.append(RPM::TRUE_BOOL_STRING);
        ui->panelPrimitiveWidth->getCommand(command);
    } else {
        command.append(RPM::FALSE_BOOL_STRING);
    }
    if (ui->checkBoxHeight->isChecked()) {
        command.append(RPM::TRUE_BOOL_STRING);
        ui->panelPrimitiveHeight->getCommand(command);
    } else {
        command.append(RPM::FALSE_BOOL_STRING);
    }
    if (ui->checkBoxPaddingLeft->isChecked()) {
        command.append(RPM::TRUE_BOOL_STRING);
        ui->panelPrimitivePaddingLeft->getCommand(command);
    } else {
        command.append(RPM::FALSE_BOOL_STRING);
    }
    if (ui->checkBoxPaddingTop->isChecked()) {
        command.append(RPM::TRUE_BOOL_STRING);
        ui->panelPrimitivePaddingTop->getCommand(command);
    } else {
        command.append(RPM::FALSE_BOOL_STRING);
    }
    if (ui->checkBoxPaddingRight->isChecked()) {
        command.append(RPM::TRUE_BOOL_STRING);
        ui->panelPrimitivePaddingRight->getCommand(command);
    } else {
        command.append(RPM::FALSE_BOOL_STRING);
    }
    if (ui->checkBoxPaddingBottom->isChecked()) {
        command.append(RPM::TRUE_BOOL_STRING);
        ui->panelPrimitivePaddingBottom->getCommand(command);
    } else {
        command.append(RPM::FALSE_BOOL_STRING);
    }
    if (ui->checkBoxFacesetPosition->isChecked()) {
        command.append(RPM::TRUE_BOOL_STRING);
        command.append(QString::number(ui->comboBoxFacesetPosition->currentIndex()));
    } else {
        command.append(RPM::FALSE_BOOL_STRING);
    }
    if (ui->checkBoxFacesetX->isChecked()) {
        command.append(RPM::TRUE_BOOL_STRING);
        ui->panelPrimitiveFacesetX->getCommand(command);
    } else {
        command.append(RPM::FALSE_BOOL_STRING);
    }
    if (ui->checkBoxFacesetY->isChecked()) {
        command.append(RPM::TRUE_BOOL_STRING);
        ui->panelPrimitiveFacesetY->getCommand(command);
    } else {
        command.append(RPM::FALSE_BOOL_STRING);
    }
    if (ui->checkBoxTextStroke->isChecked()) {
        command.append(RPM::TRUE_BOOL_STRING);
        command.append(QString::number(ui->comboBoxTextStroke->currentIndex()));
    } else {
        command.append(RPM::FALSE_BOOL_STRING);
    }
    if (ui->checkBoxTextColorText->isChecked()) {
        command.append(RPM::TRUE_BOOL_STRING);
        ui->panelPrimitiveTextColorText->getCommand(command);
    } else {
        command.append(RPM::FALSE_BOOL_STRING);
    }
    if (ui->checkBoxTextColorStroke->isChecked()) {
        command.append(RPM::TRUE_BOOL_STRING);
        ui->panelPrimitiveTextColorStroke->getCommand(command);
    } else {
        command.append(RPM::FALSE_BOOL_STRING);
    }
    if (ui->checkBoxTextColorBackground->isChecked()) {
        command.append(RPM::TRUE_BOOL_STRING);
        ui->panelPrimitiveTextColorBackground->getCommand(command);
    } else {
        command.append(RPM::FALSE_BOOL_STRING);
    }
    if (ui->checkBoxTextSize->isChecked()) {
        command.append(RPM::TRUE_BOOL_STRING);
        ui->panelPrimitiveTextSize->getCommand(command);
    } else {
        command.append(RPM::FALSE_BOOL_STRING);
    }
    if (ui->checkBoxTextFont->isChecked()) {
        command.append(RPM::TRUE_BOOL_STRING);
        ui->panelPrimitiveTextFont->getCommand(command);
    } else {
        command.append(RPM::FALSE_BOOL_STRING);
    }

    return new EventCommand(EventCommandKind::SetDialogBoxOptions, command);
}

// -------------------------------------------------------
//
//  SLOTS
//
// -------------------------------------------------------

void DialogCommandSetDialogBoxOptions::on_checkBoxWindowSkinID_toggled(bool checked)
{
    ui->panelPrimitiveWindowSkinID->setEnabled(checked);
}

// -------------------------------------------------------

void DialogCommandSetDialogBoxOptions::on_checkBoxX_toggled(bool checked)
{
    ui->panelPrimitiveX->setEnabled(checked);
}

// -------------------------------------------------------

void DialogCommandSetDialogBoxOptions::on_checkBoxY_toggled(bool checked)
{
    ui->panelPrimitiveY->setEnabled(checked);
}

// -------------------------------------------------------

void DialogCommandSetDialogBoxOptions::on_checkBoxWidth_toggled(bool checked)
{
    ui->panelPrimitiveWidth->setEnabled(checked);
}

// -------------------------------------------------------

void DialogCommandSetDialogBoxOptions::on_checkBoxHeight_toggled(bool checked)
{
    ui->panelPrimitiveHeight->setEnabled(checked);
}

// -------------------------------------------------------

void DialogCommandSetDialogBoxOptions::on_checkBoxPaddingLeft_toggled(bool checked)
{
    ui->panelPrimitivePaddingLeft->setEnabled(checked);
}

// -------------------------------------------------------

void DialogCommandSetDialogBoxOptions::on_checkBoxPaddingTop_toggled(bool checked)
{
    ui->panelPrimitivePaddingTop->setEnabled(checked);
}

// -------------------------------------------------------

void DialogCommandSetDialogBoxOptions::on_checkBoxPaddingRight_toggled(bool checked)
{
    ui->panelPrimitivePaddingRight->setEnabled(checked);
}

// -------------------------------------------------------

void DialogCommandSetDialogBoxOptions::on_checkBoxPaddingBottom_toggled(bool checked)
{
    ui->panelPrimitivePaddingBottom->setEnabled(checked);
}

// -------------------------------------------------------

void DialogCommandSetDialogBoxOptions::on_checkBoxFacesetPosition_toggled(bool checked)
{
    ui->comboBoxFacesetPosition->setEnabled(checked);
}

// -------------------------------------------------------

void DialogCommandSetDialogBoxOptions::on_checkBoxFacesetX_toggled(bool checked)
{
    ui->panelPrimitiveFacesetX->setEnabled(checked);
}

// -------------------------------------------------------

void DialogCommandSetDialogBoxOptions::on_checkBoxFacesetY_toggled(bool checked)
{
    ui->panelPrimitiveFacesetY->setEnabled(checked);
}

// -------------------------------------------------------

void DialogCommandSetDialogBoxOptions::on_checkBoxTextStroke_toggled(bool checked)
{
    ui->comboBoxTextStroke->setEnabled(checked);
}

// -------------------------------------------------------

void DialogCommandSetDialogBoxOptions::on_checkBoxTextColor_toggled(bool checked)
{
    ui->checkBoxTextColorText->setEnabled(checked);
    ui->checkBoxTextColorStroke->setEnabled(checked);
    ui->checkBoxTextColorBackground->setEnabled(checked);
    ui->checkBoxTextColorText->setChecked(false);
    ui->checkBoxTextColorStroke->setChecked(false);
    ui->checkBoxTextColorBackground->setChecked(false);
}

// -------------------------------------------------------

void DialogCommandSetDialogBoxOptions::on_checkBoxTextColorText_toggled(bool checked)
{
    ui->panelPrimitiveTextColorText->setEnabled(checked);
}

// -------------------------------------------------------

void DialogCommandSetDialogBoxOptions::on_checkBoxTextColorStroke_toggled(bool checked)
{
    ui->panelPrimitiveTextColorStroke->setEnabled(checked);
}

// -------------------------------------------------------

void DialogCommandSetDialogBoxOptions::on_checkBoxTextColorBackground_toggled(bool checked)
{
    ui->panelPrimitiveTextColorBackground->setEnabled(checked);
}

// -------------------------------------------------------

void DialogCommandSetDialogBoxOptions::on_checkBoxTextSize_toggled(bool checked)
{
    ui->panelPrimitiveTextSize->setEnabled(checked);
}

// -------------------------------------------------------

void DialogCommandSetDialogBoxOptions::on_checkBoxTextFont_toggled(bool checked)
{
    ui->panelPrimitiveTextFont->setEnabled(checked);
}
