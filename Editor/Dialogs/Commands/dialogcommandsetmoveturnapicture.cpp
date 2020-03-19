/*
    RPG Paper Maker Copyright (C) 2017-2019 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include "dialogcommandsetmoveturnapicture.h"
#include "ui_dialogcommandsetmoveturnapicture.h"
#include "rpm.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

DialogCommandSetMoveTurnAPicture::DialogCommandSetMoveTurnAPicture(EventCommand
    *command, SystemCommonObject *object, QStandardItemModel *parameters,
    QWidget *parent) :
    DialogCommand(parent),
    m_object(object),
    m_parameters(parameters),
    m_pictureID(new SuperListItem(-1)),
    ui(new Ui::DialogCommandSetMoveTurnAPicture)
{
    ui->setupUi(this);

    this->initializePrimitives();

    if (command != nullptr) {
        this->initialize(command);
    }

    this->translate();
}

DialogCommandSetMoveTurnAPicture::~DialogCommandSetMoveTurnAPicture() {
    delete ui;
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void DialogCommandSetMoveTurnAPicture::initializePrimitives() {
    QStandardItemModel *properties;

    properties = nullptr;
    if (m_object != nullptr){
        properties = m_object->modelProperties();
    }

    ui->panelPrimitiveIndex->initializeNumber(m_parameters, properties);
    ui->widgetPictureImageID->setKind(PictureKind::Pictures);
    ui->widgetPictureImageID->initializeSuper(m_pictureID);
    ui->panelPrimitiveZoom->initializeNumber(m_parameters, properties, false);
    ui->panelPrimitiveZoom->setNumberDoubleValue(100);
    ui->panelPrimitiveOpacity->initializeNumber(m_parameters, properties, false);
    ui->panelPrimitiveOpacity->setNumberDoubleValue(100);
    ui->panelPrimitiveX->initializeNumber(m_parameters, properties, false);
    ui->panelPrimitiveY->initializeNumber(m_parameters, properties, false);
    ui->panelPrimitiveAngle->initializeNumber(m_parameters, properties, false);
    ui->panelPrimitiveTime->initializeNumber(m_parameters, properties, false);
}

//-------------------------------------------------

void DialogCommandSetMoveTurnAPicture::translate()
{
    this->setWindowTitle(RPM::translate(Translations::SET_MOVE_TURN_A_PICTURE) +
        RPM::DOT_DOT_DOT);
    ui->labelTime->setText(RPM::translate(Translations::TIME) + RPM::COLON);
    ui->labelSeconds->setText(RPM::translate(Translations::SECONDS));
    ui->labelImageIndex->setText(RPM::translate(Translations::IMAGE_INDEX) + RPM
        ::COLON);
    ui->checkBoxX->setText(RPM::translate(Translations::X) + RPM::COLON);
    ui->checkBoxY->setText(RPM::translate(Translations::Y) + RPM::COLON);
    ui->checkBoxSet->setText(RPM::translate(Translations::SET) + RPM::COLON);
    ui->checkBoxMove->setText(RPM::translate(Translations::MOVE) + RPM::COLON);
    ui->checkBoxTurn->setText(RPM::translate(Translations::TURN_VERB) + RPM
        ::COLON);
    ui->checkBoxZoom->setText(RPM::translate(Translations::ZOOM) + RPM::COLON);
    ui->checkBoxAngle->setText(RPM::translate(Translations::ANGLE) + RPM::COLON);
    ui->checkBoxImageID->setText(RPM::translate(Translations::IMAGE_ID) + RPM
        ::COLON);
    ui->checkBoxOpacity->setText(RPM::translate(Translations::OPACITY) + RPM
        ::COLON);
    ui->checkBoxWaitEnd->setText(RPM::translate(Translations
        ::WAIT_END_ACTIONS_BEFORE_NEXT_COMMAND));
    RPM::get()->translations()->translateButtonBox(ui->buttonBox);
}

// -------------------------------------------------------

void DialogCommandSetMoveTurnAPicture::initialize(EventCommand *command) {
    bool checked;
    int i;

    i = 0;
    ui->panelPrimitiveIndex->initializeCommand(command, i);
    checked = RPM::stringToBool(command->valueCommandAt(i++));
    if (checked) {
        ui->checkBoxSet->setChecked(true);
        ui->checkBoxImageID->setChecked(true);
        m_pictureID->setId(command->valueCommandAt(i++).toInt());
        ui->widgetPictureImageID->initializeSuper(m_pictureID);
    }
    checked = RPM::stringToBool(command->valueCommandAt(i++));
    if (checked) {
        ui->checkBoxSet->setChecked(true);
        ui->checkBoxZoom->setChecked(true);
        ui->panelPrimitiveZoom->initializeCommand(command, i);
    }
    checked = RPM::stringToBool(command->valueCommandAt(i++));
    if (checked) {
        ui->checkBoxSet->setChecked(true);
        ui->checkBoxOpacity->setChecked(true);
        ui->panelPrimitiveOpacity->initializeCommand(command, i);
    }
    checked = RPM::stringToBool(command->valueCommandAt(i++));
    if (checked) {
        ui->checkBoxMove->setChecked(true);
        ui->checkBoxX->setChecked(true);
        ui->panelPrimitiveX->initializeCommand(command, i);
    }
    checked = RPM::stringToBool(command->valueCommandAt(i++));
    if (checked) {
        ui->checkBoxMove->setChecked(true);
        ui->checkBoxY->setChecked(true);
        ui->panelPrimitiveY->initializeCommand(command, i);
    }
    checked = RPM::stringToBool(command->valueCommandAt(i++));
    if (checked) {
        ui->checkBoxTurn->setChecked(true);
        ui->checkBoxAngle->setChecked(true);
        ui->panelPrimitiveAngle->initializeCommand(command, i);
    }
    ui->panelPrimitiveTime->initializeCommand(command, i);
    ui->checkBoxWaitEnd->setChecked(RPM::stringToBool(command->valueCommandAt(
        i++)));
}

// -------------------------------------------------------

EventCommand * DialogCommandSetMoveTurnAPicture::getCommand() const{
    QVector<QString> command;

    ui->panelPrimitiveIndex->getCommand(command);
    if (ui->checkBoxSet->isChecked()) {
        command.append(RPM::boolToString(ui->checkBoxImageID->isChecked()));
        if (ui->checkBoxImageID->isChecked()) {
            command.append(QString::number(m_pictureID->id()));
        }
        command.append(RPM::boolToString(ui->checkBoxZoom->isChecked()));
        if (ui->checkBoxZoom->isChecked()) {
            ui->panelPrimitiveZoom->getCommand(command);
        }
        command.append(RPM::boolToString(ui->checkBoxOpacity->isChecked()));
        if (ui->checkBoxOpacity->isChecked()) {
            ui->panelPrimitiveOpacity->getCommand(command);
        }
    } else {
        command.append(RPM::FALSE_BOOL_STRING);
        command.append(RPM::FALSE_BOOL_STRING);
        command.append(RPM::FALSE_BOOL_STRING);
    }
    if (ui->checkBoxMove->isChecked()) {
        command.append(RPM::boolToString(ui->checkBoxX->isChecked()));
        if (ui->checkBoxX->isChecked()) {
            ui->panelPrimitiveX->getCommand(command);
        }
        command.append(RPM::boolToString(ui->checkBoxY->isChecked()));
        if (ui->checkBoxY->isChecked()) {
            ui->panelPrimitiveY->getCommand(command);
        }
    } else {
        command.append(RPM::FALSE_BOOL_STRING);
        command.append(RPM::FALSE_BOOL_STRING);
    }
    if (ui->checkBoxTurn->isChecked()) {
        command.append(RPM::boolToString(ui->checkBoxAngle->isChecked()));
        if (ui->checkBoxAngle->isChecked()) {
            ui->panelPrimitiveAngle->getCommand(command);
        }
    } else {
        command.append(RPM::FALSE_BOOL_STRING);
    }
    ui->panelPrimitiveTime->getCommand(command);
    command.append(RPM::boolToString(ui->checkBoxWaitEnd->isChecked()));

    return new EventCommand(EventCommandKind::SetMoveTurnAPicture, command);
}

// -------------------------------------------------------
//
//  SLOTS
//
// -------------------------------------------------------

void DialogCommandSetMoveTurnAPicture::on_checkBoxSet_toggled(bool checked) {
    ui->checkBoxImageID->setEnabled(checked);
    ui->checkBoxZoom->setEnabled(checked);
    ui->checkBoxOpacity->setEnabled(checked);
    ui->checkBoxImageID->setChecked(false);
    ui->checkBoxZoom->setChecked(false);
    ui->checkBoxOpacity->setChecked(false);
}

// -------------------------------------------------------

void DialogCommandSetMoveTurnAPicture::on_checkBoxMove_toggled(bool checked) {
    ui->checkBoxX->setEnabled(checked);
    ui->checkBoxY->setEnabled(checked);
    ui->checkBoxX->setChecked(false);
    ui->checkBoxY->setChecked(false);
}

// -------------------------------------------------------

void DialogCommandSetMoveTurnAPicture::on_checkBoxTurn_toggled(bool checked) {
    ui->checkBoxAngle->setEnabled(checked);
    ui->checkBoxAngle->setChecked(false);
}

// -------------------------------------------------------

void DialogCommandSetMoveTurnAPicture::on_checkBoxImageID_toggled(bool checked) {
    ui->widgetPictureImageID->setEnabled(checked);
}

// -------------------------------------------------------

void DialogCommandSetMoveTurnAPicture::on_checkBoxZoom_toggled(bool checked) {
    ui->panelPrimitiveZoom->setEnabled(checked);
    ui->labelZoomPercent->setEnabled(checked);
}

// -------------------------------------------------------

void DialogCommandSetMoveTurnAPicture::on_checkBoxOpacity_toggled(bool checked) {
    ui->panelPrimitiveOpacity->setEnabled(checked);
    ui->labelOpacityPercent->setEnabled(checked);
}

// -------------------------------------------------------

void DialogCommandSetMoveTurnAPicture::on_checkBoxX_toggled(bool checked) {
    ui->panelPrimitiveX->setEnabled(checked);
}

// -------------------------------------------------------

void DialogCommandSetMoveTurnAPicture::on_checkBoxY_toggled(bool checked) {
    ui->panelPrimitiveY->setEnabled(checked);
}

// -------------------------------------------------------

void DialogCommandSetMoveTurnAPicture::on_checkBoxAngle_toggled(bool checked) {
    ui->panelPrimitiveAngle->setEnabled(checked);
    ui->labelAngledegree->setEnabled(checked);
}
