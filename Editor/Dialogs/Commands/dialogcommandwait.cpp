/*
    RPG Paper Maker Copyright (C) 2017-2019 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include "dialogcommandwait.h"
#include "ui_dialogcommandwait.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

DialogCommandWait::DialogCommandWait(EventCommand *command, SystemCommonObject
    *object, QStandardItemModel *parameters, QWidget *parent) :
    DialogCommand(parent),
    m_object(object),
    m_parameters(parameters),
    ui(new Ui::DialogCommandWait)
{
    ui->setupUi(this);
    
    this->initializePrimitives();

    if (command != nullptr) {
        initialize(command);
    }
}

DialogCommandWait::~DialogCommandWait()
{
    delete ui;
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void DialogCommandWait::initializePrimitives() {
    QStandardItemModel *properties;

    properties = nullptr;
    if (m_object != nullptr){
        properties = m_object->modelProperties();
    }

    ui->panelPrimitiveTime->initializeNumber(m_parameters, properties, false);
}

// -------------------------------------------------------
//
//  VIRTUAL FUNCTIONS
//
// -------------------------------------------------------

void DialogCommandWait::initialize(EventCommand *command) {
    int i;

    i = 0;
    ui->panelPrimitiveTime->initializeCommand(command, i);
}

// -------------------------------------------------------

EventCommand * DialogCommandWait::getCommand() const{
    QVector<QString> command;

    ui->panelPrimitiveTime->getCommand(command);

    return new EventCommand(EventCommandKind::Wait, command);
}

