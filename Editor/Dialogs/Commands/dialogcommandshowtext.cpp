/*
    RPG Paper Maker Copyright (C) 2017-2019 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include "dialogcommandshowtext.h"
#include "ui_dialogcommandshowtext.h"
#include "eventcommandkind.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

DialogCommandShowText::DialogCommandShowText(EventCommand *command,
    SystemCommonObject *object, QStandardItemModel *parameters, QWidget *parent) :
    DialogCommand(parent),
    ui(new Ui::DialogCommandShowText)
{
    ui->setupUi(this);
    
    this->initializeWidgets(object, parameters);
    if (command != nullptr) {
        this->initialize(command);
    }
}

DialogCommandShowText::~DialogCommandShowText()
{
    delete ui;

    delete m_facesetID;
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void DialogCommandShowText::initializeWidgets(SystemCommonObject *object,
    QStandardItemModel *parameters)
{
    QStandardItemModel *properties;

    properties = object == nullptr ? nullptr : object->modelProperties();
    ui->panelPrimitiveInterlocutor->initializeMessage(parameters, properties);
    m_facesetID = new SuperListItem(-1);
    ui->widgetPictureFaceset->setKind(PictureKind::Facesets);
    ui->widgetPictureFaceset->initializeSuper(m_facesetID);
    ui->panelPrimitiveText->initializeMessage(parameters, properties);
    ui->panelPrimitiveText->setKind(PrimitiveValueKind::Variable);
}

// -------------------------------------------------------
//
//  VIRTUAL FUNCTIONS
//
// -------------------------------------------------------

EventCommand * DialogCommandShowText::getCommand() const{
    QVector<QString> command;

    ui->panelPrimitiveInterlocutor->getCommand(command);
    command.append(QString::number(m_facesetID->id()));
    command.append(ui->plainTextMessage->toPlainText());
    ui->panelPrimitiveText->getCommand(command);

    return new EventCommand(EventCommandKind::ShowText, command);
}

// -------------------------------------------------------

void DialogCommandShowText::initialize(EventCommand* command) {
    int i;

    i = 0;
    ui->panelPrimitiveInterlocutor->initializeCommand(command, i);
    m_facesetID->setId(command->valueCommandAt(i++).toInt());
    ui->widgetPictureFaceset->initializeSuper(m_facesetID);
    ui->plainTextMessage->setPlainText(command->valueCommandAt(i++));
    ui->panelPrimitiveText->initializeCommand(command, i);
}
