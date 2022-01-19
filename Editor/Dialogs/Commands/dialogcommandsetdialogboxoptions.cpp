/*
    RPG Paper Maker Copyright (C) 2017-2022 Wano

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
    *command, QStandardItemModel *properties, QStandardItemModel *parameters,
    QWidget *parent) :
    DialogCommand(parent),
    m_properties(properties),
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
    ui->panelPrimitiveWindowSkinID->initializeDataBaseCommandId(RPM::get()
        ->project()->gameDatas()->systemDatas()->modelWindowSkins(),
        m_parameters, m_properties);
    ui->panelPrimitiveX->initializeNumber(m_parameters, m_properties, false);
    ui->panelPrimitiveY->initializeNumber(m_parameters, m_properties, false);
    ui->panelPrimitiveWidth->initializeNumber(m_parameters, m_properties, false);
    ui->panelPrimitiveHeight->initializeNumber(m_parameters, m_properties, false);
    ui->panelPrimitivePaddingLeft->initializeNumber(m_parameters, m_properties,
        false);
    ui->panelPrimitivePaddingTop->initializeNumber(m_parameters, m_properties,
        false);
    ui->panelPrimitivePaddingRight->initializeNumber(m_parameters, m_properties,
        false);
    ui->panelPrimitivePaddingBottom->initializeNumber(m_parameters, m_properties,
        false);
    ui->panelPrimitiveFacesetX->initializeNumber(m_parameters, m_properties,
        false);
    ui->panelPrimitiveFacesetY->initializeNumber(m_parameters, m_properties,
        false);
    ui->panelPrimitiveTextColorText->initializeDataBaseCommandId(RPM::get()
        ->project()->gameDatas()->systemDatas()->modelColors(), m_parameters,
        m_properties);
    ui->panelPrimitiveTextColorStroke->initializeDataBaseCommandId(RPM::get()
        ->project()->gameDatas()->systemDatas()->modelColors(), m_parameters,
        m_properties);
    ui->panelPrimitiveTextColorBackground->initializeDataBaseCommandId(RPM::get()
        ->project()->gameDatas()->systemDatas()->modelColors(), m_parameters,
        m_properties);
    ui->panelPrimitiveTextSize->initializeDataBaseCommandId(RPM::get()
        ->project()->gameDatas()->systemDatas()->modelFontSizes(), m_parameters,
        m_properties);
    ui->panelPrimitiveTextFont->initializeDataBaseCommandId(RPM::get()
        ->project()->gameDatas()->systemDatas()->modelFontNames(), m_parameters,
        m_properties);
    ui->comboBoxFacesetPosition->addItem(RPM::translate(Translations::BEHIND));
    ui->comboBoxFacesetPosition->addItem(RPM::translate(Translations::ABOVE));
    ui->comboBoxTextStroke->addItem(RPM::translate(Translations::YES));
    ui->comboBoxTextStroke->addItem(RPM::translate(Translations::NO));
}

//-------------------------------------------------

void DialogCommandSetDialogBoxOptions::translate()
{
    this->setWindowTitle(RPM::translate(Translations::SET_DIALOG_BOX_OPTIONS) +
        RPM::DOT_DOT_DOT);
    ui->checkBoxX->setText(RPM::translate(Translations::X));
    ui->checkBoxY->setText(RPM::translate(Translations::Y));
    ui->checkBoxWidth->setText(RPM::translate(Translations::WIDTH));
    ui->checkBoxHeight->setText(RPM::translate(Translations::HEIGHT));
    ui->checkBoxFacesetX->setText(RPM::translate(Translations::X));
    ui->checkBoxFacesetY->setText(RPM::translate(Translations::Y));
    ui->checkBoxTextFont->setText(RPM::translate(Translations::FONT_ID));
    ui->checkBoxTextSize->setText(RPM::translate(Translations::SIZE_ID));
    ui->checkBoxTextColor->setText(RPM::translate(Translations::COLOR_ID));
    ui->checkBoxPaddingTop->setText(RPM::translate(Translations::TOP));
    ui->checkBoxTextStroke->setText(RPM::translate(Translations::OUTLINE));
    ui->checkBoxPaddingLeft->setText(RPM::translate(Translations::LEFT));
    ui->checkBoxPaddingRight->setText(RPM::translate(Translations::RIGHT));
    ui->checkBoxWindowSkinID->setText(RPM::translate(Translations::WINDOW_SKIN_ID));
    ui->checkBoxPaddingBottom->setText(RPM::translate(Translations::BOTTOM));
    ui->checkBoxTextColorText->setText(RPM::translate(Translations::TEXT));
    ui->checkBoxFacesetPosition->setText(RPM::translate(Translations::POSITION));
    ui->checkBoxTextColorStroke->setText(RPM::translate(Translations::OUTLINE));
    ui->checkBoxTextColorBackground->setText(RPM::translate(Translations::BACKGROUND));
    ui->groupBoxTransform->setTitle(RPM::translate(Translations::TRANSFORM));
    ui->groupBoxPadding->setTitle(RPM::translate(Translations::PADDING));
    ui->groupBoxFaceset->setTitle(RPM::translate(Translations::FACESET));
    ui->groupBoxText->setTitle(RPM::translate(Translations::TEXT));
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
