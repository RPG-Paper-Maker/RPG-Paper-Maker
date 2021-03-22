/*
    RPG Paper Maker Copyright (C) 2017-2021 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include "dialogcommanddisplayapicture.h"
#include "ui_dialogcommanddisplayapicture.h"
#include "rpm.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

DialogCommandDisplayAPicture::DialogCommandDisplayAPicture(EventCommand *command,
    QStandardItemModel *properties, QStandardItemModel *parameters, QWidget *parent) :
    DialogCommand(parent),
    m_properties(properties),
    m_parameters(parameters),
    m_valueID(new PrimitiveValue(-1)),
    ui(new Ui::DialogCommandDisplayAPicture)
{
    ui->setupUi(this);

    this->initializePrimitives();

    if (command != nullptr) {
        this->initialize(command);
    }

    this->translate();
}

DialogCommandDisplayAPicture::~DialogCommandDisplayAPicture() {
    delete ui;

    delete m_valueID;
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void DialogCommandDisplayAPicture::initializePrimitives() {
    ui->widgetPictureImage->setKind(PictureKind::Pictures);
    ui->widgetPictureImage->initializePrimitive(m_valueID, m_properties,
        m_parameters);
    ui->panelPrimitiveID->initializeNumber(m_parameters, m_properties);
    ui->panelPrimitiveX->initializeNumber(m_parameters, m_properties, false);
    ui->panelPrimitiveY->initializeNumber(m_parameters, m_properties, false);
    ui->panelPrimitiveZoom->initializeNumber(m_parameters, m_properties, false);
    ui->panelPrimitiveZoom->setNumberDoubleValue(100);
    ui->panelPrimitiveOpacity->initializeNumber(m_parameters, m_properties, false);
    ui->panelPrimitiveOpacity->setNumberDoubleValue(100);
    ui->panelPrimitiveAngle->initializeNumber(m_parameters, m_properties, false);
    ui->comboBoxOrigin->addItem(RPM::translate(Translations::TOP_LEFT));
    ui->comboBoxOrigin->addItem(RPM::translate(Translations::CENTER));
}

//-------------------------------------------------

void DialogCommandDisplayAPicture::translate()
{
    this->setWindowTitle(RPM::translate(Translations::DISPLAY_A_PICTURE) + RPM
        ::DOT_DOT_DOT);
    ui->labelX->setText(RPM::translate(Translations::X) + RPM::COLON);
    ui->labelY->setText(RPM::translate(Translations::Y) + RPM::COLON);
    ui->labelZoom->setText(RPM::translate(Translations::ZOOM) + RPM::COLON);
    ui->labelAngle->setText(RPM::translate(Translations::ANGLE) + RPM::COLON);
    ui->labelIndex->setText(RPM::translate(Translations::INDEX) + RPM::COLON);
    ui->labelOrigin->setText(RPM::translate(Translations::ORIGIN) + RPM::COLON);
    ui->labelImageID->setText(RPM::translate(Translations::IMAGE_ID) + RPM::COLON);
    ui->labelOpacity->setText(RPM::translate(Translations::OPACITY) + RPM::COLON);
    ui->groupBoxEffects->setTitle(RPM::translate(Translations::EFFECTS));
    ui->groupBoxCoordinates->setTitle(RPM::translate(Translations::COORDINATES));
    RPM::get()->translations()->translateButtonBox(ui->buttonBox);
}

// -------------------------------------------------------

void DialogCommandDisplayAPicture::initialize(EventCommand *command) {
    int i;

    i = 0;
    m_valueID->initializeCommandParameter(command, i, true);
    ui->widgetPictureImage->initializePrimitive(m_valueID, m_properties,
        m_parameters);
    ui->panelPrimitiveID->initializeCommand(command, i);
    ui->comboBoxOrigin->setCurrentIndex(command->valueCommandAt(i++) == RPM
        ::TRUE_BOOL_STRING ? 1 : 0);
    ui->panelPrimitiveX->initializeCommand(command, i);
    ui->panelPrimitiveY->initializeCommand(command, i);
    ui->panelPrimitiveZoom->initializeCommand(command, i);
    ui->panelPrimitiveOpacity->initializeCommand(command, i);
    ui->panelPrimitiveAngle->initializeCommand(command, i);
}

// -------------------------------------------------------

EventCommand * DialogCommandDisplayAPicture::getCommand() const {
    QVector<QString> command;

    m_valueID->getCommandParameter(command, true);
    ui->panelPrimitiveID->getCommand(command);
    command.append(ui->comboBoxOrigin->currentIndex() == 1 ? RPM
        ::TRUE_BOOL_STRING : RPM::FALSE_BOOL_STRING);
    ui->panelPrimitiveX->getCommand(command);
    ui->panelPrimitiveY->getCommand(command);
    ui->panelPrimitiveZoom->getCommand(command);
    ui->panelPrimitiveOpacity->getCommand(command);
    ui->panelPrimitiveAngle->getCommand(command);

    return new EventCommand(EventCommandKind::DisplayAPicture, command);
}
