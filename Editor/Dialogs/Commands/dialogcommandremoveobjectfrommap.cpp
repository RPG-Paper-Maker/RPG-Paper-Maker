/*
    RPG Paper Maker Copyright (C) 2017-2019 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include "dialogcommandremoveobjectfrommap.h"
#include "ui_dialogcommandremoveobjectfrommap.h"
#include "rpm.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

DialogCommandRemoveObjectFromMap::DialogCommandRemoveObjectFromMap(EventCommand
    *command, SystemCommonObject *object, QStandardItemModel *parameters,
    QWidget *parent) :
    DialogCommand(parent),
    m_object(object),
    m_parameters(parameters),
    ui(new Ui::DialogCommandRemoveObjectFromMap)
{
    ui->setupUi(this);

    this->initializePrimitives();

    if (command != nullptr) {
        this->initialize(command);
    }
}

DialogCommandRemoveObjectFromMap::~DialogCommandRemoveObjectFromMap() {
    delete ui;
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void DialogCommandRemoveObjectFromMap::initializePrimitives() {
    QStandardItemModel *properties;

    properties = nullptr;
    if (m_object != nullptr){
        properties = m_object->modelProperties();
    }
    if (RPM::isInConfig && !RPM::isInObjectConfig) {
        m_modelObjects = new QStandardItemModel;
        Map::setModelObjects(m_modelObjects);
    }
    else{
        m_modelObjects = RPM::get()->project()->currentMap(true)->modelObjects();
    }

    ui->panelPrimitiveObjectID->initializeDataBaseCommandId(m_modelObjects,
        m_parameters, properties);
}

// -------------------------------------------------------
//
//  VIRTUAL FUNCTIONS
//
// -------------------------------------------------------

void DialogCommandRemoveObjectFromMap::initialize(EventCommand *command) {
    int i;

    i = 0;
    ui->panelPrimitiveObjectID->initializeCommand(command, i);
}

// -------------------------------------------------------

EventCommand * DialogCommandRemoveObjectFromMap::getCommand() const{
    QVector<QString> command;

    ui->panelPrimitiveObjectID->getCommand(command);

    return new EventCommand(EventCommandKind::RemoveObjectFromMap, command);
}
