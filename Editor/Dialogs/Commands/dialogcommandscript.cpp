/*
    RPG Paper Maker Copyright (C) 2017-2019 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include "dialogcommandscript.h"
#include "ui_dialogcommandscript.h"
#include "rpm.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

DialogCommandScript::DialogCommandScript(EventCommand *command,
    SystemCommonObject *object, QStandardItemModel *parameters, QWidget *parent) :
    DialogCommand(parent),
    m_object(object),
    m_parameters(parameters),
    ui(new Ui::DialogCommandScript)
{
    ui->setupUi(this);

    this->initializePrimitives();

    if (command != nullptr) {
        this->initialize(command);
    }
}

DialogCommandScript::~DialogCommandScript() {
    delete ui;
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void DialogCommandScript::initializePrimitives() {
    QStandardItemModel *properties;

    properties = nullptr;
    if (m_object != nullptr){
        properties = m_object->modelProperties();
    }

    ui->panelPrimitiveScript->initializeMessage(false, m_parameters, properties,
        false);
    ui->panelPrimitiveScript->showVariable();
}

// -------------------------------------------------------

void DialogCommandScript::initialize(EventCommand *command) {
    QString checked;
    int i;

    i = 0;
    checked = command->valueCommandAt(i++);
    if (checked == RPM::TRUE_BOOL_STRING) {
        ui->checkBoxDynamic->setChecked(true);
        ui->panelPrimitiveScript->initializeCommand(command, i);
    } else {
        ui->plainTextEditScript->setPlainText(command->valueCommandAt(i));
    }
}

// -------------------------------------------------------

EventCommand * DialogCommandScript::getCommand() const{
    QVector<QString> command;

    command.append(ui->checkBoxDynamic->isChecked() ? RPM::TRUE_BOOL_STRING :
        RPM::FALSE_BOOL_STRING);
    if (ui->checkBoxDynamic->isChecked()) {
        ui->panelPrimitiveScript->getCommand(command);
    } else {
        command.append(ui->plainTextEditScript->toPlainText());
    }

    return new EventCommand(EventCommandKind::Script, command);
}

// -------------------------------------------------------
//
//  SLOTS
//
// -------------------------------------------------------

void DialogCommandScript::on_checkBoxDynamic_toggled(bool checked) {
    ui->plainTextEditScript->setEnabled(!checked);
    ui->panelPrimitiveScript->setEnabled(checked);
}
