/*
    RPG Paper Maker Copyright (C) 2017-2019 Wano

    RPG Paper Maker engine is under proprietary license.
    This source code is also copyrighted.

    Use Commercial edition for commercial use of your games.
    See RPG Paper Maker EULA here:
        http://rpg-paper-maker.com/index.php/eula.
*/

#include "dialogcommandcallacommonreaction.h"
#include "ui_dialogcommandcallacommonreaction.h"
#include "rpm.h"
#include "systemcommonreaction.h"

// -------------------------------------------------------
//
//  CONSTRUCTOR / DESTRUCTOR / GET / SET
//
// -------------------------------------------------------

DialogCommandCallACommonReaction::DialogCommandCallACommonReaction(EventCommand
    *command, QWidget *parent) :
    DialogCommand(parent),
    m_modelParameters(new QStandardItemModel),
    ui(new Ui::DialogCommandCallACommonReaction)
{
    ui->setupUi(this);

    this->initializePrimitives();

    if (command != nullptr) {
        this->initialize(command);
    }

    this->translate();
}

DialogCommandCallACommonReaction::~DialogCommandCallACommonReaction() {
    delete ui;

    SuperListItem::deleteModel(m_modelParameters);
}

// -------------------------------------------------------
//
//  INTERMEDIARY FUNCTIONS
//
// -------------------------------------------------------

void DialogCommandCallACommonReaction::initializePrimitives() {
    SuperListItem::fillComboBox(ui->comboBoxCommonReaction, RPM::get()
        ->project()->gameDatas()->commonEventsDatas()->modelCommonReactors());
    ui->treeViewParameters->setHasContextMenu(false);
    ui->treeViewParameters->setCanMove(false);
}

// -------------------------------------------------------

void DialogCommandCallACommonReaction::clearParameters() {
    SuperListItem::deleteModel(m_modelParameters);
    m_modelParameters = new QStandardItemModel;
    m_modelParameters->setHorizontalHeaderLabels(QStringList({RPM::translate(
        Translations::NAME), RPM::translate(Translations::VALUE), RPM::translate
        (Translations::DEFAULT_VALUE)}));
    ui->treeViewParameters->initializeModel(m_modelParameters);
    ui->treeViewParameters->setColumnWidth(0,100);
    ui->treeViewParameters->setColumnWidth(1,250);
    ui->treeViewParameters->setColumnWidth(2,100);
}

//-------------------------------------------------

void DialogCommandCallACommonReaction::translate()
{
    this->setWindowTitle(RPM::translate(Translations::CALL_A_COMMON_REACTION) +
        RPM::DOT_DOT_DOT);
    ui->labelCommonReaction->setText(RPM::translate(Translations
        ::COMMON_REACTION) + RPM::COLON);
    ui->groupBoxParameterValues->setTitle(RPM::translate(Translations
        ::PARAMETER_VALUES));
    RPM::get()->translations()->translateButtonBox(ui->buttonBox);
}

// -------------------------------------------------------
//
//  VIRTUAL FUNCTIONS
//
// -------------------------------------------------------

void DialogCommandCallACommonReaction::initialize(EventCommand *command) {
    PrimitiveValue *v;
    SystemCommonReaction *reaction;
    QStandardItemModel *model;
    SystemCreateParameter *createParameter;
    int i, l, id, paramID;

    i = 0;
    id = command->valueCommandAt(i++).toInt();
    ui->comboBoxCommonReaction->setCurrentIndex(SuperListItem::getIndexById(RPM
        ::get()->project()->gameDatas()->commonEventsDatas()
        ->modelCommonReactors()->invisibleRootItem(), id));
    reaction = reinterpret_cast<SystemCommonReaction *>(SuperListItem
        ::getById(RPM::get()->project()->gameDatas()->commonEventsDatas()
        ->modelCommonReactors()->invisibleRootItem(), id));
    model = reaction->modelParameters();
    this->clearParameters();
    l = command->commandsCount();
    while (i < l) {
        paramID = command->valueCommandAt(i++).toInt();
        createParameter = reinterpret_cast<SystemCreateParameter *>(
            SuperListItem::getById(model->invisibleRootItem(), paramID));
        if (createParameter != nullptr) {
            v = new PrimitiveValue;
            v->initializeCommandParameter(command, i);
            v->setModelProperties(RPM::get()->project()->currentObjectProperties());
            v->setModelParameter(RPM::get()->project()->currentParameters());
            m_modelParameters->appendRow((new SystemParameter(paramID,
                createParameter->name(), createParameter, v))->getModelRow());
        }
    }

    ui->treeViewParameters->updateAbsoluteAllNodesString();
}

// -------------------------------------------------------

EventCommand * DialogCommandCallACommonReaction::getCommand() const{
    QVector<QString> command;
    SystemParameter *param;
    int i, l;

    command.append(QString::number(SuperListItem::getIdByIndex(RPM::get()
        ->project()->gameDatas()->commonEventsDatas()->modelCommonReactors(), ui
        ->comboBoxCommonReaction->currentIndex())));
    for (i = 0, l = m_modelParameters->invisibleRootItem()->rowCount(); i < l;
         i++)
    {
        param = reinterpret_cast<SystemParameter *>(m_modelParameters->item(i)
            ->data().value<quintptr>());
        command.append(QString::number(param->id()));
        param->value()->getCommandParameter(command);
    }

    return new EventCommand(EventCommandKind::CallACommonReaction, command);
}

// -------------------------------------------------------
//
//  VIRTUAL FUNCTIONS
//
// -------------------------------------------------------

void DialogCommandCallACommonReaction
    ::on_comboBoxCommonReaction_currentIndexChanged(int index)
{
    SystemCommonReaction *reaction;
    QStandardItemModel *model;
    SystemParameter *parameter;
    SystemCreateParameter *createParameter;
    int i, l;

    this->clearParameters();
    reaction = reinterpret_cast<SystemCommonReaction *>(SuperListItem
        ::getByIndex(RPM::get()->project()->gameDatas()->commonEventsDatas()
        ->modelCommonReactors(), index));
    model = reaction->modelParameters();

    for (i = 0, l = model->invisibleRootItem()->rowCount(); i < l; i++) {
        createParameter = reinterpret_cast<SystemCreateParameter *>(model->item(
            i)->data().value<quintptr>());
        if (createParameter != nullptr) {
            parameter = new SystemParameter(createParameter->id(),
                createParameter->name(), createParameter, new PrimitiveValue(
                PrimitiveValueKind::Default));
            m_modelParameters->appendRow(parameter->getModelRow());
        }
    }
    ui->treeViewParameters->updateAbsoluteAllNodesString();
}
