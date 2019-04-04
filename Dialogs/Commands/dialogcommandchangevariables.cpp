/*
    RPG Paper Maker Copyright (C) 2017-2019 Marie Laporte

    RPG Paper Maker engine is under LGPL-3 license.

    Commercial license for commercial use of your games:
        https://creativecommons.org/licenses/by-nc/4.0/.

    See more information here: http://rpg-paper-maker.com/index.php/downloads.
*/

#include "dialogcommandchangevariables.h"
#include "ui_dialogcommandchangevariables.h"
#include "rpm.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

DialogCommandChangeVariables::DialogCommandChangeVariables(
        EventCommand *command,
        SystemCommonObject* object,
        QStandardItemModel* parameters,
        QWidget *parent) :
    DialogCommand(parent),
    ui(new Ui::DialogCommandChangeVariables)
{
    ui->setupUi(this);

    ui->widgetVariableOne->initialize();
    ui->panelPrimitiveValueNumber->initializeNumber(parameters, nullptr);
    ui->panelPrimitiveValueRandom1->initializeNumber(parameters, nullptr);
    ui->panelPrimitiveValueRandom2->initializeNumber(parameters, nullptr);
    ui->panelPrimitiveValueInstanceID->initializeNumber(parameters, nullptr);
    ui->panelPrimitiveValueNumberItem->initializeDataBaseCommandId(RPM::get()
        ->project()->gameDatas()->weaponsDatas()->model(), parameters, nullptr);
    ui->panelPrimitiveValueStatisticID->initializeDataBaseCommandId(RPM::get()
        ->project()->gameDatas()->battleSystemDatas()->modelCommonStatistics(),
        parameters, nullptr);
    ui->panelPrimitiveValueTotalCurrency->initializeDataBaseCommandId(RPM::get()
        ->project()->gameDatas()->systemDatas()->modelCurrencies(), parameters,
        nullptr);
    if (RPM::isInConfig){
        m_modelObjects = new QStandardItemModel;
        Map::setModelObjects(m_modelObjects);
    }
    else{
        m_modelObjects = RPM::get()->project()->currentMap()->modelObjects();
    }
    ui->panelPrimitiveValueObjectsMap->initializeDataBaseCommandId(
        m_modelObjects, parameters, nullptr);

    if (command != nullptr) initialize(command);
}

DialogCommandChangeVariables::~DialogCommandChangeVariables()
{
    delete ui;

    if (RPM::isInConfig) {
        SuperListItem::deleteModel(m_modelObjects);
    }
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void DialogCommandChangeVariables::initialize(EventCommand* command) {
    int i = 0;

    // Selection
    switch(command->valueCommandAt(i++).toInt()){
    case 0:
        ui->radioButtonOneVariable->setChecked(true);
        ui->widgetVariableOne->setCurrentId(command->valueCommandAt(i++)
                                            .toInt());
        break;
    case 1:
        ui->radioButtonRange->setChecked(true);
        ui->spinBoxRange1->setValue(command->valueCommandAt(i++).toInt());
        ui->spinBoxRange2->setValue(command->valueCommandAt(i++).toInt());
        break;
    }

    // Operation
    switch (command->valueCommandAt(i++).toInt()) {
    case 0: ui->radioButtonEquals->setChecked(true); break;
    case 1: ui->radioButtonPlus->setChecked(true); break;
    case 2: ui->radioButtonMinus->setChecked(true); break;
    case 3: ui->radioButtonTimes->setChecked(true); break;
    case 4: ui->radioButtonDivided->setChecked(true); break;
    case 5: ui->radioButtonModulo->setChecked(true); break;
    }

    // Value
    switch(command->valueCommandAt(i++).toInt()) {
    case 0:
        ui->radioButtonNumber->setChecked(true);
        ui->panelPrimitiveValueNumber->initializeCommand(command, i);
        break;
    case 1:
        ui->radioButtonRandom->setChecked(true);
        ui->panelPrimitiveValueRandom1->initializeCommand(command, i);
        ui->panelPrimitiveValueRandom2->initializeCommand(command, i);
        break;
    }
}

// -------------------------------------------------------

EventCommand* DialogCommandChangeVariables::getCommand() const{
    QVector<QString> command;
    selection(command); // Information about type of selection
    operation(command); // Type of operation done
    value(command); // Type of value given to the selected variable(s)

    return new EventCommand(EventCommandKind::ChangeVariables, command);
}

// -------------------------------------------------------

void DialogCommandChangeVariables::selection(QVector<QString>& command) const{
    // If only selecting one variable...
    if (ui->radioButtonOneVariable->isChecked()){
        command.append("0");
        command.append(QString::number(ui->widgetVariableOne->currentId()));
    }
    // If selecting a range of variables...
    else if (ui->radioButtonRange->isChecked()){
        command.append("1");
        command.append(ui->spinBoxRange1->text());
        command.append(ui->spinBoxRange2->text());
    }
}

// -------------------------------------------------------

void DialogCommandChangeVariables::operation(QVector<QString>& command) const{
    if (ui->radioButtonEquals->isChecked()) command.append("0");
    else if (ui->radioButtonPlus->isChecked()) command.append("1");
    else if (ui->radioButtonMinus->isChecked()) command.append("2");
    else if (ui->radioButtonTimes->isChecked()) command.append("3");
    else if (ui->radioButtonDivided->isChecked()) command.append("4");
    else if (ui->radioButtonModulo->isChecked()) command.append("5");
}

// -------------------------------------------------------

void DialogCommandChangeVariables::value(QVector<QString> &command) const {
    if (ui->radioButtonNumber->isChecked()) {
        command.append("0");
        ui->panelPrimitiveValueNumber->getCommand(command);
    } else if (ui->radioButtonRandom->isChecked()) {
        command.append("1");
        ui->panelPrimitiveValueRandom1->getCommand(command);
        ui->panelPrimitiveValueRandom2->getCommand(command);
    }
}

// -------------------------------------------------------
//
//  SLOTS
//
// -------------------------------------------------------

void DialogCommandChangeVariables::on_radioButtonOneVariable_toggled(
        bool checked)
{
    ui->widgetVariableOne->setEnabled(checked);
}

// -------------------------------------------------------

void DialogCommandChangeVariables::on_radioButtonRange_toggled(bool checked) {
    ui->spinBoxRange1->setEnabled(checked);
    ui->labelRange->setEnabled(checked);
    ui->spinBoxRange2->setEnabled(checked);
}

// -------------------------------------------------------

void DialogCommandChangeVariables::on_radioButtonNumber_toggled(bool checked) {
    ui->panelPrimitiveValueNumber->setEnabled(checked);
}

// -------------------------------------------------------

void DialogCommandChangeVariables::on_radioButtonRandom_toggled(bool checked) {
    ui->panelPrimitiveValueRandom1->setEnabled(checked);
    ui->labelRandom->setEnabled(checked);
    ui->panelPrimitiveValueRandom2->setEnabled(checked);
}
