/*
    RPG Paper Maker Copyright (C) 2017-2019 Wano

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
    SystemCommonObject *object, QStandardItemModel *parameters, QWidget *parent) :
    DialogCommand(parent),
    m_object(object),
    m_parameters(parameters),
    m_pictureID(new SuperListItem(-1)),
    ui(new Ui::DialogCommandDisplayAPicture)
{
    ui->setupUi(this);

    this->initializePrimitives();

    if (command != nullptr) {
        this->initialize(command);
    }
}

DialogCommandDisplayAPicture::~DialogCommandDisplayAPicture() {
    delete ui;
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void DialogCommandDisplayAPicture::initializePrimitives() {
    QStandardItemModel *properties;

    properties = nullptr;
    if (m_object != nullptr){
        properties = m_object->modelProperties();
    }

    ui->widgetPictureImage->setKind(PictureKind::Pictures);
    ui->widgetPictureImage->initializeSuper(m_pictureID);
    ui->panelPrimitiveID->initializeNumber(m_parameters, properties);
    ui->panelPrimitiveX->initializeNumber(m_parameters, properties, false);
    ui->panelPrimitiveY->initializeNumber(m_parameters, properties, false);
    ui->panelPrimitiveZoom->initializeNumber(m_parameters, properties, false);
    ui->panelPrimitiveZoom->setNumberDoubleValue(100);
    ui->panelPrimitiveOpacity->initializeNumber(m_parameters, properties, false);
    ui->panelPrimitiveOpacity->setNumberDoubleValue(100);
    ui->panelPrimitiveAngle->initializeNumber(m_parameters, properties, false);
}

// -------------------------------------------------------

void DialogCommandDisplayAPicture::initialize(EventCommand *command) {
    int i;

    i = 0;
    m_pictureID->setId(command->valueCommandAt(i++).toInt());
    ui->widgetPictureImage->initializeSuper(m_pictureID);
    ui->panelPrimitiveID->initializeCommand(command, i);
    ui->comboBox->setCurrentIndex(command->valueCommandAt(i++) == RPM
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

    command.append(QString::number(m_pictureID->id()));
    ui->panelPrimitiveID->getCommand(command);
    command.append(ui->comboBox->currentIndex() == 1 ? RPM::TRUE_BOOL_STRING :
        RPM::FALSE_BOOL_STRING);
    ui->panelPrimitiveX->getCommand(command);
    ui->panelPrimitiveY->getCommand(command);
    ui->panelPrimitiveZoom->getCommand(command);
    ui->panelPrimitiveOpacity->getCommand(command);
    ui->panelPrimitiveAngle->getCommand(command);

    return new EventCommand(EventCommandKind::DisplayAPicture, command);
}
